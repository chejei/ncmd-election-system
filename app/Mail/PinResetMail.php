<?php

namespace App\Mail;

use App\Models\Voter;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PinResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public $pin;
    public $voter;
    public $siteName;



    public function __construct($pin, $voter)
    {
        $this->pin = $pin;
        $this->voter = $voter;
        $this->siteName = setting('site_name', 'Default Site');
    }

    public function build()
    {
        return $this->subject("{$this->siteName} | Your PIN Has Been Reset")
                    ->view('emails.pin_reset') 
                    ->with([
                        'pin' => $this->pin,
                        'voter' => $this->voter,
                        'siteName' => $this->siteName,
                    ])
                    ->attachFromStorageDisk('public', setting('site_logo'), 'logo.png', [
                        'as' => 'logo.png',
                        'mime' => 'image/png',
                    ])
                    ->withSwiftMessage(function ($message) {
                        $logoPath = storage_path('app/public/' . setting('site_logo'));
                        $message->embed($logoPath);
                    });
    }
}