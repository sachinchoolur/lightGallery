import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Standalone consumer app. Unlike `packages/react/dev`, this config
 * declares NO aliases: every specifier resolves through the real
 * package `exports` map, so the app exercises what a published
 * install would — entry points, subpath exports and shipped types.
 */
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 3003,
        allowedHosts: ['.trycloudflare.com'],
    },
});
