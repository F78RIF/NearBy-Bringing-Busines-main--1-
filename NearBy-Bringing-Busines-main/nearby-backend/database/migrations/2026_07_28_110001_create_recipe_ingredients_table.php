<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipe_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained('recipes')->cascadeOnDelete();

            $table->string('name');
            $table->decimal('qty', 10, 2);
            $table->string('unit', 20);
            // Hasil konversi qty+unit ke gram. 0 untuk satuan yang tidak bisa
            // dikonversi (pcs/butir/lembar) — bahan itu tetap dihitung di HPP
            // tapi tidak menambah berat total yang jadi dasar estimasi porsi.
            $table->decimal('weight_grams', 10, 2)->default(0);
            $table->decimal('price', 12, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipe_ingredients');
    }
};
