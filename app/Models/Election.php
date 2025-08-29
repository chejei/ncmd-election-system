<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Election extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'photo',
        'start_date',
        'end_date',
        'status',
    ];

    // One election has many votes
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}
