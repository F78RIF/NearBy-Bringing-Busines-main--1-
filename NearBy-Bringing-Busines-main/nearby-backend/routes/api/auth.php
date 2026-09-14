<?php

/**
 * ## AUTHENTICATION & AKUN
 *
 * ## Pengertian:
 * Endpoint untuk masuk/keluar aplikasi, mendaftar akun baru, mengelola data
 * profil sendiri, mengganti/mereset password, serta melihat dan mencabut
 * sesi (token) yang masih aktif di perangkat lain.
 *
 * ## Alur:
 * Pengguna mendaftar atau login → server mengembalikan token Sanctum →
 * frontend menyimpan token dan mengirimkannya di setiap request berikutnya →
 * `GET /me` dipakai memulihkan sesi setelah halaman di-reload →
 * `POST /logout` mencabut token tersebut di server.
 */

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

/* ---- Publik: belum punya token ------------------------------------- */
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

/* ---- Perlu login --------------------------------------------------- */
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profil akun sendiri
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::delete('/me', [AuthController::class, 'destroyAccount']);
    Route::put('/password', [AuthController::class, 'changePassword']);

    // Manajemen sesi aktif
    Route::get('/sessions', [AuthController::class, 'sessions']);
    Route::delete('/sessions/{tokenId}', [AuthController::class, 'revokeSession']);
});
