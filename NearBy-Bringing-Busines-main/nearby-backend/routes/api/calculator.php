<?php

/**
 * ## KALKULATOR HPP & MASA TAHAN
 *
 * ## Pengertian:
 * Endpoint untuk menghitung Harga Pokok Penjualan (HPP) sebuah resep dan
 * memperkirakan masa tahan makanannya. Perhitungan bersifat rule-based:
 * aturannya (kategori makanan, satuan, berat per porsi, margin, masa tahan
 * per cara penyimpanan) diambil dari `config/food_rules.php`.
 *
 * ## Alur:
 * Pemilik UMKM membuka tab Kalkulator → `GET /food-rules` memuat pilihan
 * kategori, satuan, dan cara penyimpanan → pemilik mengisi daftar bahan →
 * `POST /hpp/calculate` mengembalikan biaya per porsi, harga jual saran, dan
 * perkiraan masa tahan (belum tersimpan) → bila cocok, resep disimpan lewat
 * `POST /recipes` dan bisa dibuka/diubah/dihapus lagi nanti.
 */

use App\Http\Controllers\Api\RecipeController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Aturan rule-based (kategori makanan, satuan, masa tahan, margin)
    Route::get('/food-rules', [RecipeController::class, 'rules']);

    // Hitung tanpa menyimpan
    Route::post('/hpp/calculate', [RecipeController::class, 'calculate'])->name('recipes.calculate');

    // CRUD resep tersimpan
    Route::apiResource('recipes', RecipeController::class);
});
