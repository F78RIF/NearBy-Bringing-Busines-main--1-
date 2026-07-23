<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Demo accounts mirror the frontend's mocked logins:
     *  - user  : Rizky Pratama
     *  - owner : Dewi Anjani  (owns UMKM ids 1 & 4)
     *  - admin : Admin NearBy
     * Plus the extra accounts listed in the admin "Pengguna" table.
     * Default password for every account: "password".
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

        foreach ($accounts as $account) {
            User::create([
                ...$account,
                'phone' => '0812-0000-0000',
                'password' => 'password',
            ]);
        }
    }
}
