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
                'name' => 'City Alliance Church',
                'senior_ptr' => 'Ptr.John Collins Labrador',
                'address' => '187 Pres. Quirino Street, Barangay 31, Cagayan de Oro, Philippines',
                'zone' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
