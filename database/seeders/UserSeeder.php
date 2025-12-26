<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'username' => 'admin1',
            'password' => Hash::make('password123'),
        ]);

         User::create([
            'username' => 'jozen',
            'password' => Hash::make('password123'),
        ]);
    }
}
