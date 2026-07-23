<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Models\Umkm;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /** List reviews for a UMKM. */
    public function index(Umkm $umkm)
    {
        return ReviewResource::collection($umkm->reviews()->latest()->get());
    }

    /** Review history for the authenticated user (account page). */
    public function mine(Request $request)
    {
        $reviews = Review::where('user_id', $request->user()->id)
            ->with('umkm')
            ->latest()
            ->get();

        return ReviewResource::collection($reviews);
    }

    /** Authenticated user posts a review. */
    public function store(Request $request, Umkm $umkm)
    {
        $data = $request->validate([
            'stars' => ['required', 'integer', 'min:1', 'max:5'],
            'text' => ['nullable', 'string', 'max:2000'],
        ]);

        $review = $umkm->reviews()->create([
            'user_id' => $request->user()->id,
            'author_name' => $request->user()->name,
            'stars' => $data['stars'],
            'text' => $data['text'] ?? null,
        ]);

        // Bump the cached review count (seeded values are inflated mock data,
        // so we increment rather than recount from stored rows).
        $umkm->increment('reviews_count');

        // Recompute the displayed rating from the actual stored reviews so a new
        // review is reflected instead of leaving the seeded rating stale.
        $this->recomputeRating($umkm);

        return new ReviewResource($review);
    }

    /** Author edits their own review. */
    public function update(Request $request, Review $review)
    {
        $user = $request->user();
        abort_unless(
            $user->role === 'admin' || $review->user_id === $user->id,
            403,
            'Hanya penulis ulasan yang bisa mengubah.'
        );

        $data = $request->validate([
            'stars' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'text' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ]);

        $review->update($data);

        // Rating bisa berubah jika bintang diubah — hitung ulang dari data asli.
        $this->recomputeRating($review->umkm);

        return new ReviewResource($review->fresh());
    }

    /** Author (or admin) deletes a review. */
    public function destroy(Request $request, Review $review)
    {
        $user = $request->user();
        abort_unless(
            $user->role === 'admin' || $review->user_id === $user->id,
            403,
            'Hanya penulis ulasan yang bisa menghapus.'
        );

        $umkm = $review->umkm;
        $review->delete();

        if ($umkm) {
            if ($umkm->reviews_count > 0) {
                $umkm->decrement('reviews_count');
            }
            $this->recomputeRating($umkm);
        }

        return response()->json(['message' => 'Ulasan dihapus.']);
    }

    /** Recompute a UMKM's displayed rating from its stored reviews. */
    private function recomputeRating(Umkm $umkm): void
    {
        $umkm->update([
            'rating' => round((float) $umkm->reviews()->avg('stars'), 1),
        ]);
    }

    /** UMKM owner replies to a review. */
    public function reply(Request $request, Review $review)
    {
        $user = $request->user();
        abort_unless(
            $user->role === 'admin' || $review->umkm->owner_id === $user->id,
            403,
            'Hanya pemilik UMKM yang bisa membalas.'
        );

        $data = $request->validate([
            'reply' => ['required', 'string', 'max:2000'],
        ]);

        $review->update(['reply' => $data['reply']]);

        return new ReviewResource($review);
    }
}
