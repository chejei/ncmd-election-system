<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ElectionsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('elections')->insert([
            [
                'start_date' => now(),
                'end_date' => now()->addDays(3),
                'status' => 'Ongoing',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
