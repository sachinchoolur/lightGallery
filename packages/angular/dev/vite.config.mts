import path from 'node:path';
import { fileURLToPath } from 'node:url';
import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Dev-demo server for manual verification (plan 003 step 8) — the Angular
 * twin of `packages/react/dev`. The demo imports styles as a consumer would
 * (`lightgallery/css/...`); the alias points that specifier at the repo's
 * built CSS. Run `npm run build:css` at the root first if `dist/css` is
 * missing.
 */
export default defineConfig({
    root: dirname,
    plugins: [
        angular({
            tsconfig: path.join(dirname, 'tsconfig.json'),
        }),
    ],
    resolve: {
        alias: [
            {
                find: '@lightgallery/angular',
                replacement: path.resolve(dirname, '../src/public-api.ts'),
            },
            {
                find: '@lightgallery/headless',
                replacement: path.resolve(
                    dirname,
                    '../../headless/src/index.ts',
                ),
            },
            {
                find: 'lightgallery/css',
                replacement: path.resolve(dirname, '../../../dist/css'),
            },
        ],
    },
    server: {
        port: 5175,
    },
});
