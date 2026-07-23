<?php

namespace Database\Seeders;

use App\Models\Submission;
use Illuminate\Database\Seeder;

class SubmissionSeeder extends Seeder
{
    /**
     * Verification queue — mirrors the frontend `SUBMISSIONS_RAW`.
     */
    public function run(): void
    {
        $rows = [
            [
                'name' => 'Bakso Urat Cak War', 'owner_name' => 'Suwarno',
                'category' => 'Kuliner', 'location' => 'Balikpapan Selatan',
                'checks' => [
                    ['Deskripsi usaha', true], ['Alamat lengkap', true],
                    ['Nomor telepon', true], ['Foto (min. 3)', false],
                    ['Jam operasional', true], ['Kategori & wilayah', true],
                ],
                'files' => [
                    ['name' => 'Tampak depan', 'kind' => 'image', 'ok' => true, 'meta' => 'JPG · 1.2 MB'],
                    ['name' => 'Menu bakso', 'kind' => 'image', 'ok' => true, 'meta' => 'JPG · 980 KB'],
                    ['name' => 'Foto tempat 3', 'kind' => 'image', 'ok' => false, 'meta' => 'Belum diunggah'],
                    ['name' => 'KTP pemilik', 'kind' => 'doc', 'ok' => true, 'meta' => 'PDF · 640 KB'],
                    ['name' => 'Surat izin usaha (SIUP)', 'kind' => 'doc', 'ok' => false, 'meta' => 'Belum diunggah'],
                ],
            ],
            [
                'name' => 'Homestay Bukit Damai', 'owner_name' => 'Linda Wijaya',
                'category' => 'Penginapan', 'location' => 'Balikpapan Kota',
                'checks' => [
                    ['Deskripsi usaha', true], ['Alamat lengkap', true],
                    ['Nomor telepon', true], ['Foto (min. 3)', true],
                    ['Jam operasional', true], ['Kategori & wilayah', true],
                ],
                'files' => [
                    ['name' => 'Tampak depan', 'kind' => 'image', 'ok' => true, 'meta' => 'JPG · 1.6 MB'],
                    ['name' => 'Kamar', 'kind' => 'image', 'ok' => true, 'meta' => 'JPG · 1.4 MB'],
                    ['name' => 'Ruang tamu', 'kind' => 'image', 'ok' => true, 'meta' => 'JPG · 1.1 MB'],
                    ['name' => 'KTP pemilik', 'kind' => 'doc', 'ok' => true, 'meta' => 'PDF · 720 KB'],
                    ['name' => 'Surat izin usaha (SIUP)', 'kind' => 'doc', 'ok' => true, 'meta' => 'PDF · 810 KB'],
                ],
            ],
            [
                'name' => 'Thrift Corner Senja', 'owner_name' => 'Belum diisi',
                'category' => 'Fashion', 'location' => 'Balikpapan Utara',
                'checks' => [
                    ['Deskripsi usaha', false], ['Alamat lengkap', false],
                    ['Nomor telepon', true], ['Foto (min. 3)', false],
                    ['Jam operasional', false], ['Kategori & wilayah', true],
                ],
                'files' => [
                    ['name' => 'Tampak depan', 'kind' => 'image', 'ok' => true, 'meta' => 'JPG · 900 KB'],
                    ['name' => 'Foto koleksi 2', 'kind' => 'image', 'ok' => false, 'meta' => 'Belum diunggah'],
                    ['name' => 'Foto koleksi 3', 'kind' => 'image', 'ok' => false, 'meta' => 'Belum diunggah'],
                    ['name' => 'KTP pemilik', 'kind' => 'doc', 'ok' => false, 'meta' => 'Belum diunggah'],
                ],
            ],
        ];

        foreach ($rows as $row) {
            Submission::create([...$row, 'status' => 'menunggu']);
        }
    }
}
