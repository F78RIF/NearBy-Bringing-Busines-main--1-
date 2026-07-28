<?php

use App\Models\Review;
use App\Models\Umkm;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Satu akun hanya boleh punya SATU ulasan per UMKM (pola Play Store).
 *
 * Urutannya penting: data duplikat lama harus dibersihkan dulu, kalau tidak
 * pembuatan unique index akan gagal di tengah jalan.
 *
 * Catatan soal NULL: kolom `user_id` nullable dan ulasan hasil seeder memang
 * ber-user_id NULL. Di MySQL/MariaDB, PostgreSQL, maupun SQLite, dua baris
 * NULL tidak dianggap duplikat oleh unique index — jadi ulasan seeder/anonim
 * tetap aman dan tidak ikut terjaring constraint ini.
 */
return new class extends Migration
{
    public function up(): void
    {
        $this->removeDuplicateReviews();

        Schema::table('reviews', function (Blueprint $table) {
            $table->unique(['user_id', 'umkm_id'], 'reviews_user_id_umkm_id_unique');
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropUnique('reviews_user_id_umkm_id_unique');
        });
    }

    /**
     * Sisakan satu ulasan terbaru per (user_id, umkm_id), hapus sisanya.
     *
     * Ditulis dengan query builder biasa (bukan SQL khusus vendor) supaya jalan
     * di MySQL — yang dipakai .env saat ini — maupun SQLite yang dipakai tes.
     */
    private function removeDuplicateReviews(): void
    {
        $duplicateGroups = DB::table('reviews')
            ->select('user_id', 'umkm_id', DB::raw('COUNT(*) as total'))
            ->whereNotNull('user_id')
            ->groupBy('user_id', 'umkm_id')
            ->having('total', '>', 1)
            ->get();

        if ($duplicateGroups->isEmpty()) {
            return;
        }

        $affectedUmkmIds = [];

        foreach ($duplicateGroups as $group) {
            // "Terbaru" = updated_at paling akhir; id dipakai sebagai pemecah
            // seri karena beberapa baris bisa punya timestamp identik.
            $keepId = DB::table('reviews')
                ->where('user_id', $group->user_id)
                ->where('umkm_id', $group->umkm_id)
                ->orderByDesc('updated_at')
                ->orderByDesc('id')
                ->value('id');

            $deleted = DB::table('reviews')
                ->where('user_id', $group->user_id)
                ->where('umkm_id', $group->umkm_id)
                ->where('id', '!=', $keepId)
                ->delete();

            if ($deleted > 0) {
                $affectedUmkmIds[$group->umkm_id] = ($affectedUmkmIds[$group->umkm_id] ?? 0) + $deleted;
            }
        }

        // Rating & jumlah ulasan yang ditampilkan ikut bergeser setelah baris
        // dibuang — samakan lagi dengan data yang benar-benar tersisa.
        foreach ($affectedUmkmIds as $umkmId => $deletedCount) {
            $umkm = Umkm::find($umkmId);
            if (! $umkm) {
                continue;
            }

            $umkm->update([
                'rating' => round((float) Review::where('umkm_id', $umkmId)->avg('stars'), 1),
                'reviews_count' => max(0, $umkm->reviews_count - $deletedCount),
            ]);
        }
    }
};
