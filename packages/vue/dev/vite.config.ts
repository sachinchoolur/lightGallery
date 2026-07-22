import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

/**
 * Dev-demo server for manual verification (plan 003 step 8) — the Vue twin
 * of the sibling dev demos. The demo imports styles as a consumer would
 * (`lightgallery/css/...`); the alias points that specifier at the repo's
 * built CSS. Run `npm run build:css` at the root first if `dist/css` is
 * missing.
 */
export default defineConfig({
    root: fileURLToPath(new URL('.', import.meta.url)),
    plugins: [vue()],
    resolve: {
        alias: [
            {
                find: '@lightgallery/vue',
                replacement: fileURLToPath(
                    new URL('../src/index.ts', import.meta.url),
                ),
            },
            {
                find: '@lightgallery/headless',
                replacement: fileURLToPath(
                    new URL(
                        '../../headless/src/index.ts',
                        import.meta.url,
                    ),
                ),
            },
            {
                find: 'lightgallery/css',
                replacement: fileURLToPath(
                    new URL('../../../dist/css', import.meta.url),
                ),
            },
        ],
    },
    server: {
        port: 5176,
    },
});
