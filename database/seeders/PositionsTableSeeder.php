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
            ],
            [
                'title' => 'Peace Officer',
                'priority' => 7,
                'max_winners' => 2, // usually more than 1
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Representative (Grade 7)',
                'priority' => 8,
                'max_winners' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Representative (Grade 8)',
                'priority' => 9,
                'max_winners' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Representative (Grade 9)',
                'priority' => 10,
                'max_winners' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Representative (Grade 10)',
                'priority' => 11,
                'max_winners' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Representative (Grade 11)',
                'priority' => 12,
                'max_winners' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Representative (Grade 12)',
                'priority' => 13,
                'max_winners' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
