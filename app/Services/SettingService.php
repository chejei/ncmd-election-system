<?php

namespace App\Services;

use App\Models\Setting;

class SettingService
{
    public function get(string $key, $default = null)
    {
        return Setting::getValue($key, $default);
    }

    public function set(string $key, $value)
    {
        return Setting::setValue($key, $value);
    }

    public function all(): array
    {
        return Setting::pluck('value', 'option')->toArray();
    }
}
