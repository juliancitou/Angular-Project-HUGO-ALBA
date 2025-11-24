import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        host: true,                    // Permite acceso desde ngrok
        hmr: {
            host: 'localhost',
        },
        // AQUÍ ESTÁ LA CLAVE: permite ngrok
        allowedHosts: 'all'            // ← Permite TODOS los hosts (ngrok, localhost, etc)
        // O más seguro:
        // allowedHosts: ['.ngrok-free.app', '.ngrok.io', '.ngrok.app']
    }
});