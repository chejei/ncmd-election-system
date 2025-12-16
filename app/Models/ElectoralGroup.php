<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElectoralGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'logo',
        'color',
        'banner_image',
    ];

    public function candidates()
    {
        return $this->hasMany(Candidate::class);
    }
}
