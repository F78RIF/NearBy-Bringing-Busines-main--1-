<?php

/**
 * ## KATALOG UMKM
 *
 * ## Pengertian:
 * Endpoint data usaha (UMKM) beserta menu/produk di dalamnya. Membaca daftar
 * dan detail UMKM bersifat publik; membuat, mengubah, dan menghapus hanya
 * boleh dilakukan pemiliknya setelah login.
 *
 * ## Alur:
 * Pengunjung membuka katalog → `GET /umkm` mengembalikan daftar → memilih
 * satu usaha → `GET /umkm/{umkm}` mengembalikan detail beserta menunya.
 * Pemilik yang sudah login bisa menambah UMKM (`POST /umkm`, otomatis masuk
 * antrian verifikasi admin) lalu mengelola menu/produknya.
 */

use App\Http\Controllers\Api\UmkmController;
use App\Http\Controllers\Api\UmkmItemController;
use Illuminate\Support\Facades\Route;

/* ---- Publik: baca katalog ------------------------------------------ */
Route::get('/umkm', [UmkmController::class, 'index']);
Route::get('/umkm/{umkm}', [UmkmController::class, 'show']);

/* ---- Perlu login: kelola UMKM milik sendiri (owner) ---------------- */
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/umkm', [UmkmController::class, 'store']);
    Route::put('/umkm/{umkm}', [UmkmController::class, 'update']);
    Route::delete('/umkm/{umkm}', [UmkmController::class, 'destroy']);

    // Menu / produk per UMKM (CRUD terpisah, owner)
    Route::post('/umkm/{umkm}/items', [UmkmItemController::class, 'store']);
    Route::put('/items/{item}', [UmkmItemController::class, 'update']);
    Route::delete('/items/{item}', [UmkmItemController::class, 'destroy']);
});
