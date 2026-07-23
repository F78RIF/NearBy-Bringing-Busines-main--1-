<?php

namespace Database\Seeders;

use App\Models\Umkm;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Mirrors the frontend `seedReviewsFor()` — every UMKM gets the same
     * 3 base reviews. Timestamps approximate the "x hari/minggu lalu" labels.
     */
    public function run(): void
    {
        $base = [
            [
                'author_name' => 'Rani Oktaviani', 'stars' => 5, 'days' => 2,
                'text' => 'Pelayanannya ramah banget, rasanya juara! Sudah beberapa kali balik ke sini dan nggak pernah kecewa.',
            ],
            [
                'author_name' => 'Bayu Firmansyah', 'stars' => 4, 'days' => 7,
                'text' => 'Tempatnya nyaman dan bersih. Harga sesuai kualitas, recommended buat warga sekitaran.',
            ],
            [
                'author_name' => 'Siti Marlina', 'stars' => 5, 'days' => 14,
                'text' => 'Salah satu yang terbaik di Balikpapan. Gampang ditemukan lewat NearBy, terima kasih!',
            ],
        ];

        foreach (Umkm::all() as $umkm) {
            foreach ($base as $r) {
                $umkm->reviews()->create([
                    'author_name' => $r['author_name'],
                    'stars' => $r['stars'],
                    'text' => $r['text'],
                    'created_at' => now()->subDays($r['days']),
                    'updated_at' => now()->subDays($r['days']),
                ]);
            }
        }
    }
}
