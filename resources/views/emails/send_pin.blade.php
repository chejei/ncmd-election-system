<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ $siteName }} | Voting PIN</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">

    <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">

        {{-- Site Logo (optional) --}}
        @if(setting('site_logo'))
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="{{ $message->embed(storage_path('app/public/' . setting('site_logo'))) }}" alt="{{ $siteName }}" style="max-height: 60px;">
            </div>
        @endif

        <h2 style="color: #111827;">Welcome {{ $voter->full_name }},</h2>

        <p style="color: #374151; font-size: 16px;">
            Your account has been created and your voting PIN is ready.
        </p>

        <h1 style="color: #16a34a; font-size: 32px; text-align: center; margin: 20px 0;">
            PIN: {{ $pin }}
        </h1>

        <p style="color: #374151; font-size: 16px;">
            Please keep this PIN safe. You will need it to participate in the election.
        </p>

        <br>
        <p style="color: #374151; font-size: 16px;">Thank you,</p>
        <p style="font-weight: bold; font-size: 18px;">{{ $siteName }}</p>

    </div>
</body>
</html>
