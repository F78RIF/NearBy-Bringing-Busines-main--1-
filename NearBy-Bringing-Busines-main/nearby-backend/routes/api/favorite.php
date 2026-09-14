<?php

/**
 * ## FAVORIT & REKOMENDASI
 *
 * ## Pengertian:
 * Endpoint untuk menandai UMKM sebagai favorit, dan untuk mengambil daftar
 * rekomendasi UMKM. Rekomendasi disusun dari minat pengguna (kategori UMKM
 * yang ia favoritkan); bila belum ada favorit sama sekali, sistem jatuh ke
 * daftar UMKM terpopuler.
 *
 * ## Alur:
 * Pengguna menekan ikon hati pada sebuah UMKM → `POST /umkm/{umkm}/favorite`
 * menyalakan/mematikan favorit → daftar favorit bisa dibuka kapan saja →
 * `GET /recommendations` membaca favorit tersebut untuk menyusun saran usaha
 * lain yang sejenis.
 */

use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\RecommendationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/umkm/{umkm}/favorite', [FavoriteController::class, 'toggle']);

    // Rekomendasi UMKM berdasarkan minat user (favorit), fallback: populer
    Route::get('/recommendations', [RecommendationController::class, 'index']);
});
