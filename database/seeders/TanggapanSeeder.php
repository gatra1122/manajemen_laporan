<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class TanggapanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $laporanIds = DB::table('laporan')->pluck('id')->toArray();
        $userIds = DB::table('users')->where('role', 'petugas')->pluck('id')->toArray();

        for ($i = 0; $i < 30; $i++) {
            DB::table('tanggapan')->insert([
                'laporan_id' => $faker->randomElement($laporanIds),
                'user_id' => $faker->randomElement($userIds),
                'isi' => $faker->paragraph(2),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
