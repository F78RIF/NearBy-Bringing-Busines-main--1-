<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('umkm_id')->nullable()->constrained('umkms')->nullOnDelete();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('owner_name')->nullable();
            $table->enum('category', ['Kuliner', 'Penginapan', 'Fashion', 'Oleh-Oleh', 'Jasa']);
            $table->enum('location', [
                'Balikpapan Kota',
                'Balikpapan Utara',
                'Balikpapan Selatan',
                'Balikpapan Timur',
                'Balikpapan Barat',
                'Balikpapan Tengah',
            ]);
            $table->enum('status', ['menunggu', 'disetujui', 'ditolak'])->default('menunggu');
            $table->json('checks')->nullable();
            $table->json('files')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
