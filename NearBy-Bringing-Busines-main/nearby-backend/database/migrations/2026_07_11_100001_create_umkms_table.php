<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('umkms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->enum('category', ['Kuliner', 'Penginapan', 'Fashion', 'Oleh-Oleh', 'Jasa']);
            $table->enum('location', [
                'Balikpapan Kota',
                'Balikpapan Utara',
                'Balikpapan Selatan',
                'Balikpapan Timur',
                'Balikpapan Barat',
                'Balikpapan Tengah',
            ]);
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->string('price_label')->nullable();
            $table->text('tag')->nullable();
            $table->string('img_label')->nullable();
            $table->string('address')->nullable();
            $table->string('hours')->nullable();
            $table->string('phone')->nullable();
            $table->string('ig')->nullable();
            $table->string('list_label')->nullable();
            $table->enum('status', ['aktif', 'libur', 'tutup'])->default('aktif');
            $table->enum('verification', ['menunggu', 'disetujui', 'ditolak'])->default('disetujui');
            $table->unsignedInteger('views')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('umkms');
    }
};
