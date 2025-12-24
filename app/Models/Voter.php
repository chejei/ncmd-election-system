<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable; // ← extend Authenticatable
use Laravel\Sanctum\HasApiTokens;

class Voter extends Model
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'last_name',
        'first_name',
        'middle_name',
        'suffix_name',
        'church_id',
        'pin_code',
        'voted_photo',
        'email',         
        'registration_num', 
        'phone_number',   
        'pin_code'
    ];

    protected $appends = ['church_name' , 'full_name', 'restrict'];

    protected $hidden = [
        'pin_code',
    ];

    public function church()
    {
        return $this->belongsTo(Church::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    public function elections()
    {
        return $this->belongsToMany(Election::class, 'votes');
    }
    
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($voter) {
            $voter->pin_code = self::generateUniquePin();
        });
    }

    public static function generateUniquePin()
    {
        do {
            // Generate a 6-digit numeric PIN
            $pin_code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (self::where('pin_code', $pin_code)->exists());

        return $pin_code;
    }

    public function getChurchNameAttribute()
    {
        return $this->church ? $this->church->name : null;
    }

    public function getRestrictAttribute(): bool
    {
        return !empty($this->voted_photo);
    }
   
    public function getFullNameAttribute()
    {
        $middleInitial = $this->middle_name ? strtoupper(substr($this->middle_name, 0, 1)) . '.' : '';
        $suffix = $this->suffix_name ? ' ' . $this->suffix_name : '';

        return trim("{$this->first_name} {$middleInitial} {$this->last_name}{$suffix}");
    }
}
