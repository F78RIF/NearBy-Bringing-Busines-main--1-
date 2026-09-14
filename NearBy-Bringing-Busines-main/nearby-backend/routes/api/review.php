<?php

/**
 * ## ULASAN UMKM
 *
 * ## Pengertian:
 * Endpoint ulasan (rating + komentar) yang ditulis pengunjung pada sebuah
 * UMKM. Aturannya seperti Play Store: satu akun hanya boleh punya SATU
 * ulasan per UMKM — mengirim ulang berarti memperbarui, bukan menambah baris
 * baru. Pemilik UMKM bisa membalas ulasan yang masuk.
 *
 * ## Alur:
 * Pengunjung membuka halaman detail → daftar ulasan dimuat (publik) → bila
 * sudah login, `GET /umkm/{umkm}/reviews/mine` dipakai mengisi form dalam
 * mode "edit" jika ia pernah mengulas → kirim ulasan → pemilik UMKM
 * membacanya di dashboard dan bisa membalas.
 */

use App\Http\Controllers\Api\ReviewController;
use Illuminate\Support\Facades\Route;

/* ---- Publik: baca ulasan sebuah UMKM ------------------------------- */
Route::get('/umkm/{umkm}/reviews', [ReviewController::class, 'index']);

/* ---- Perlu login: tulis / kelola ulasan ---------------------------- */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me/reviews', [ReviewController::class, 'mine']);

    // Ulasan milik user untuk satu UMKM — dipakai frontend untuk mengisi form
    // dalam mode "edit" saat halaman detail dibuka.
    Route::get('/umkm/{umkm}/reviews/mine', [ReviewController::class, 'mineForUmkm']);

    Route::post('/umkm/{umkm}/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    // Balasan dari pemilik UMKM
    Route::post('/reviews/{review}/reply', [ReviewController::class, 'reply']);
});
