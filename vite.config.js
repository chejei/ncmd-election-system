import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';


export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/main.jsx', 
                'resources/sass/app.scss',
                'resources/css/app.css'
                ],
            refresh: true,
        }),
        react(),
        tailwindcss(),
        svgr({ 
        svgrOptions: {
            exportAsDefault: false,
            exportType: 'named'
        },
        }),
    ],
});
