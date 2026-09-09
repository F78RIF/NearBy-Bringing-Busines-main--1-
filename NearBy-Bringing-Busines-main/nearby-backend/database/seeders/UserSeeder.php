<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Akun awal aplikasi: pemilik UMKM yang dirujuk UmkmSeeder (Dewi Anjani =
     * user id 2), beberapa pengguna untuk tabel "Pengguna" di dashboard admin,
     * dan satu administrator.
     *
     * Kata sandi TIDAK di-hardcode. Isi `SEED_USER_PASSWORD` di `.env` bila
     * akun-akun ini perlu bisa dipakai masuk; tanpa itu setiap akun mendapat
     * kata sandi acak yang tidak bisa ditebak (ubah lewat "lupa kata sandi"
     * atau reset dari panel admin).
     */
    public function run(): void
    {
        $accounts = [
            ['name' => 'Rizky Pratama', 'email' => 'rizky.p@mail.com', 'role' => 'user', 'status' => 'aktif'],
            ['name' => 'Dewi Anjani', 'email' => 'dewi.umkm@mail.com', 'role' => 'owner', 'status' => 'aktif'],
            ['name' => 'Suwarno', 'email' => 'warkop.war@mail.com', 'role' => 'owner', 'status' => 'menunggu'],
            ['name' => 'Maya Sari', 'email' => 'maya.s@mail.com', 'role' => 'user', 'status' => 'aktif'],
            ['name' => 'Bayu Firmansyah', 'email' => 'bayu.f@mail.com', 'role' => 'user', 'status' => 'nonaktif'],
            ['name' => 'Admin NearBy', 'email' => 'admin@nearby.id', 'role' => 'admin', 'status' => 'aktif'],
        ];

        $password = env('SEED_USER_PASSWORD');

        foreach ($accounts as $account) {
            User::create([
                ...$account,
                'phone' => '0812-0000-0000',
                'password' => $password ?: Str::random(40),
            ]);
        }
    }
}
