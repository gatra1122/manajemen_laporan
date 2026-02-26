<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class LaporanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $pelaporIds = DB::table('pelapor')->pluck('id')->toArray();
        $kategoriIds = DB::table('kategori_laporan')->pluck('id')->toArray();
        $statusOptions = ['Diajukan', 'Diproses', 'Selesai', 'Ditolak'];

        for ($i = 0; $i < 50; $i++) {
            DB::table('laporan')->insert([
                'pelapor_id' => $faker->randomElement($pelaporIds),
                'kategori_id' => $faker->randomElement($kategoriIds),
                'judul' => $faker->sentence(6),
                'isi_laporan' => $faker->paragraph(3),
                'status' => $faker->randomElement($statusOptions),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
