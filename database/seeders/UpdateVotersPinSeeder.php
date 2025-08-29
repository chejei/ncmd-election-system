<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Voter;
use Illuminate\Support\Facades\Hash;

class UpdateVotersPinSeeder extends Seeder
{
    public function run(): void
    {
        Voter::chunk(100, function ($voters) {
            foreach ($voters as $voter) {
                if (empty($voter->pin_code)) {
                    $voter->pin_code = Hash::make('123456'); // default pin
                    $voter->save();
                }
            }
        });
    }
}
