import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

/**
 * Standalone consumer app. Unlike `packages/vue/dev`, this config
 * declares NO aliases: every specifier resolves through the real
 * package `exports` map, so the app exercises what a published
 * install would — entry points, subpath exports and shipped types.
 */
export default defineConfig({
    plugins: [vue()],
    server: {
        host: true,
        port: 3004,
        allowedHosts: ['.trycloudflare.com'],
    },
});
