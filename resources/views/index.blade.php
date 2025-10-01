<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="theme-color" content="#2b7fff">
        <meta name="msapplication-navbutton-color" content="#2b7fff"> 
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="format-detection" content="telephone=no">
        <meta name="MSThemeCompatible" content="no">
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
        @viteReactRefresh
        @vite(['resources/js/main.jsx', 'resources/sass/app.scss', 'resources/css/app.css'])
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    </head>
    <body class="antialiased">
        <div id="app"></div>
    </body>
</html>
