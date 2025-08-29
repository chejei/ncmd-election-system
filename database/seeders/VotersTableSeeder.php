<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VotersTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('voters')->insert([
            [
                'last_name' => 'Reyes',
                'first_name' => 'Juan',
                'middle_name' => null,
                'suffix_name' => null,
                'church_id' => 1,
                'voters_number' => 'V001',
                'voted_photo' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
