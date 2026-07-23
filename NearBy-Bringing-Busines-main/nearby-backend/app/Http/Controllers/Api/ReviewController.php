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
        $umkm->update([
            'rating' => round((float) $umkm->reviews()->avg('stars'), 1),
        ]);

        return new ReviewResource($review);
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
