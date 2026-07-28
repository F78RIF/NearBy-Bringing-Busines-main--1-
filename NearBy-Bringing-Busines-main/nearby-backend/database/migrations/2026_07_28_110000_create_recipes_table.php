<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            // Resep boleh berdiri sendiri (belum dikaitkan ke UMKM tertentu).
            $table->foreignId('umkm_id')->nullable()->constrained('umkms')->nullOnDelete();

            $table->string('name');
            // Sengaja string, bukan enum: daftar kategori hidup di
            // config/food_rules.php supaya bisa ditambah tanpa migration baru.
            // Validasi dilakukan di controller terhadap kunci config tersebut.
            $table->string('category')->index();
            $table->enum('storage', ['suhu_ruang', 'kulkas', 'freezer'])->default('suhu_ruang');

            // Hasil perhitungan disimpan (snapshot), bukan dihitung ulang saat
            // dibaca — supaya angka historis tidak berubah kalau aturan di
            // config/food_rules.php nanti disesuaikan.
            $table->decimal('total_weight_grams', 10, 2)->default(0);
            $table->decimal('serving_weight_grams', 8, 2);
            $table->unsignedInteger('yield_servings');
            $table->decimal('total_cost', 12, 2);
            $table->decimal('cost_per_serving', 12, 2);
            $table->unsignedSmallInteger('margin_percent')->default(35);
            $table->decimal('suggested_price', 12, 2);
            $table->unsignedInteger('shelf_life_hours')->nullable();
            $table->string('shelf_life_note', 500)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
