<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database from the frontend mock data.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            UmkmSeeder::class,
            ReviewSeeder::class,
            SubmissionSeeder::class,
        ]);
    }
}
