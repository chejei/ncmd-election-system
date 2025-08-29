<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = ['option', 'value'];

     public static function getValue($key, $default = null)
    {
        return self::where('option', $key)->value('value') ?? $default;
    }

    public static function setValue($key, $value)
    {
        return self::updateOrCreate(['option' => $key], ['value' => $value]);
    }
}
