<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        @viteReactRefresh
        @vite(['resources/js/main.jsx', 'resources/sass/app.scss', 'resources/css/app.css'])
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link rel="icon" href="/favicon.ico" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body class="antialiased">
        <div id="app"></div>
    </body>
</html>
