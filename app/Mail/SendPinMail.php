<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendPinMail extends Mailable
{
    use Queueable, SerializesModels;

    public $pin;
    public $voter;
    public $siteName;

    /**
     * Create a new message instance.
     */
    public function __construct($pin, $voter)
    {
        $this->pin = $pin;
        $this->voter = $voter;
        $this->siteName = setting('site_name', 'Default Site');
    }

    /**
     * Build the message.
     */
    public function build()
    {   
        return $this->subject("{$this->siteName} | Your Voting PIN")
                    ->view('emails.send_pin') 
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
