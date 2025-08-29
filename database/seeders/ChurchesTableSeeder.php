<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChurchesTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('churches')->insert([
            [
                'name' => 'Grace Church',
                'senior_ptr' => 'Ptr. John Doe',
                'address' => '123 Main St, Zone 1',
                'zone' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
