<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UmkmResource;
use App\Models\Umkm;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    /**
     * "Rekomendasi untuk kamu": UMKM relevan berdasarkan minat user.
     *
     * Strategi sederhana (tanpa ML):
     *  1. Ambil kategori dari UMKM yang difavoritkan user, urut dari yang paling sering.
     *  2. Rekomendasikan UMKM lain di kategori tsb (belum difavoritkan), urut rating & views.
     *  3. Fallback (user baru / belum ada favorit): UMKM populer rating tertinggi.
     */
    public function index(Request $request)
    {
        $limit = (int) min(max($request->integer('limit', 6), 1), 12);
        $user = $request->user();

        $favoriteIds = $user->favorites()->pluck('umkms.id');

        // Kategori favorit user, diurutkan dari yang paling sering muncul.
        $preferredCategories = $user->favorites()
            ->select('category')
            ->get()
            ->groupBy('category')
            ->map->count()
            ->sortDesc()
            ->keys();

        $base = Umkm::query()
            ->where('verification', 'disetujui')
            ->whereNotIn('id', $favoriteIds);

        $reason = 'populer';
        $umkms = collect();

        if ($preferredCategories->isNotEmpty()) {
            $umkms = (clone $base)
                ->whereIn('category', $preferredCategories)
                ->orderByDesc('rating')
                ->orderByDesc('views')
                ->with('items')
                ->take($limit)
                ->get();
            $reason = 'minat';
        }

        // Fallback / lengkapi kekurangan dengan UMKM populer.
        if ($umkms->count() < $limit) {
            $fill = (clone $base)
                ->whereNotIn('id', $umkms->pluck('id'))
                ->orderByDesc('rating')
                ->orderByDesc('views')
                ->with('items')
                ->take($limit - $umkms->count())
                ->get();
            $umkms = $umkms->concat($fill);
        }

        return UmkmResource::collection($umkms)->additional([
            'meta' => [
                'reason' => $reason,
                'categories' => $preferredCategories->values(),
            ],
        ]);
    }
}
