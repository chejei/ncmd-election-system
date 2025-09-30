<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['option' => 'site_name', 'value' => 'NCMD Elections 2025'],
            ['option' => 'start_date', 'value' => '2025-08-28'],
            ['option' => 'end_date', 'value' => '2025-09-21'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['option' => $setting['option']], // search by option
                ['value' => $setting['value']]    // update or set value
            );
        }
    }
}
