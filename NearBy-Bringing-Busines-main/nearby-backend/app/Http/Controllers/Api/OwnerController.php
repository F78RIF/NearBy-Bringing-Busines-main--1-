<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\UmkmResource;
use App\Models\Review;
use Illuminate\Http\Request;

class OwnerController extends Controller
{
    /** Dashboard summary: aggregate stats for the owner's businesses. */
    public function summary(Request $request)
    {
        $user = $request->user();
        $umkms = $user->umkms()->get();

        $totalViews = $umkms->sum('views');
        $totalReviews = $umkms->sum('reviews_count');
        $avgRating = $umkms->count() ? round($umkms->avg('rating'), 1) : 0;
        $favorites = \App\Models\Umkm::whereIn('id', $umkms->pluck('id'))
            ->withCount('favoritedBy')->get()->sum('favorited_by_count');

        return response()->json([
            'stats' => [
                'views' => $totalViews,
                'rating' => $avgRating,
                'reviews' => $totalReviews,
                'favorites' => $favorites,
                'umkmCount' => $umkms->count(),
            ],
            'umkms' => UmkmResource::collection($umkms),
        ]);
    }

    /** UMKM owned by the authenticated owner. */
    public function umkms(Request $request)
    {
        $umkms = $request->user()->umkms()->get();

        return UmkmResource::collection($umkms);
    }

    /** Reviews across all of the owner's UMKM. */
    public function reviews(Request $request)
    {
        $umkmIds = $request->user()->umkms()->pluck('id');
        $reviews = Review::whereIn('umkm_id', $umkmIds)
            ->with('umkm')
            ->latest()
            ->get();

        return ReviewResource::collection($reviews);
    }
}
