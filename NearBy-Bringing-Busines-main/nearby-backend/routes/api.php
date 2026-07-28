<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\OwnerController;
use App\Http\Controllers\Api\RecipeController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SubmissionController;
use App\Http\Controllers\Api\UmkmController;
use App\Http\Controllers\Api\UmkmItemController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| UMKM (public read)
|--------------------------------------------------------------------------
*/
Route::get('/umkm', [UmkmController::class, 'index']);
Route::get('/umkm/{umkm}', [UmkmController::class, 'show']);
Route::get('/umkm/{umkm}/reviews', [ReviewController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Authenticated (Sanctum token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::delete('/me', [AuthController::class, 'destroyAccount']);
    Route::put('/password', [AuthController::class, 'changePassword']);

    // Manajemen sesi aktif
    Route::get('/sessions', [AuthController::class, 'sessions']);
    Route::delete('/sessions/{tokenId}', [AuthController::class, 'revokeSession']);

    // Layanan upload terpusat (foto UMKM/menu/profil, dokumen, media review)
    Route::post('/uploads', [UploadController::class, 'store']);

    // UMKM write (owner)
    Route::post('/umkm', [UmkmController::class, 'store']);
    Route::put('/umkm/{umkm}', [UmkmController::class, 'update']);
    Route::delete('/umkm/{umkm}', [UmkmController::class, 'destroy']);

    // Menu / produk per UMKM (CRUD terpisah, owner)
    Route::post('/umkm/{umkm}/items', [UmkmItemController::class, 'store']);
    Route::put('/items/{item}', [UmkmItemController::class, 'update']);
    Route::delete('/items/{item}', [UmkmItemController::class, 'destroy']);

    // Berkas legalitas untuk pengajuan verifikasi (owner)
    Route::post('/submissions/{submission}/files', [SubmissionController::class, 'attachFile']);

    // Kalkulator HPP & masa tahan makanan (rule-based, owner)
    Route::get('/food-rules', [RecipeController::class, 'rules']);
    Route::post('/hpp/calculate', [RecipeController::class, 'calculate'])->name('recipes.calculate');
    Route::apiResource('recipes', RecipeController::class);

    // Reviews
    Route::get('/me/reviews', [ReviewController::class, 'mine']);
    // Ulasan milik user untuk satu UMKM — dipakai frontend untuk mengisi form
    // dalam mode "edit" saat halaman detail dibuka.
    Route::get('/umkm/{umkm}/reviews/mine', [ReviewController::class, 'mineForUmkm']);
    Route::post('/umkm/{umkm}/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);
    Route::post('/reviews/{review}/reply', [ReviewController::class, 'reply']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/umkm/{umkm}/favorite', [FavoriteController::class, 'toggle']);

    // Rekomendasi UMKM berdasarkan minat user (favorit), fallback: populer
    Route::get('/recommendations', [RecommendationController::class, 'index']);

    // Owner dashboard
    Route::prefix('owner')->group(function () {
        Route::get('/summary', [OwnerController::class, 'summary']);
        Route::get('/umkm', [OwnerController::class, 'umkms']);
        Route::get('/reviews', [OwnerController::class, 'reviews']);
    });

    // Admin dashboard (role: admin)
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'users']);
        Route::put('/users/{user}', [AdminController::class, 'updateUser']);
        Route::post('/users/{user}/reset-password', [AdminController::class, 'resetUserPassword']);
        Route::get('/umkm', [AdminController::class, 'umkms']);
        Route::get('/submissions', [AdminController::class, 'submissions']);
        Route::post('/submissions/{submission}/approve', [AdminController::class, 'approve']);
        Route::post('/submissions/{submission}/reject', [AdminController::class, 'reject']);
        Route::get('/reports', [AdminController::class, 'reports']);
        Route::get('/trash', [AdminController::class, 'trash']);
        Route::post('/trash/{id}/restore', [AdminController::class, 'restore']);
    });
});
