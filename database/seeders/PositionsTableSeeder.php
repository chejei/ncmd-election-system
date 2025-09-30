<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PositionsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('positions')->insert([
            [
                'title' => 'Secretary',
                'priority' => 3,
                'max_winners' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Treasurer',
                'priority' => 4,
                'max_winners' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Auditor',
                'priority' => 5,
                'max_winners' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Public Information Officer',
                'priority' => 6,
                'max_winners' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
