// vite.config.ts (en la raíz de reposteria-project)
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        open: true,
        host: true,
        allowedHosts: true   // ← Array con 'all' como string
    }
});