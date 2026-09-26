import path from 'node:path';
import { fileURLToPath } from 'node:url';
import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Standalone consumer app. Unlike `packages/angular/dev`, this config
 * does not alias the library to source: `@lightgallery/angular` resolves
 * through the ng-packagr dist and its `exports` map, so the app exercises
 * what a published install would — entry points, subpath exports and
 * shipped types.
 */
export default defineConfig({
    plugins: [
        angular({
            tsconfig: path.join(dirname, 'tsconfig.json'),
        }),
    ],
    resolve: {
        alias: [
            {
                // Inside the workspace @lightgallery/headless points at its
                // TypeScript source; publishConfig swaps in dist only at
                // publish time. The Angular plugin disables Vite's own TS
                // transform, so take the built dist here, which is what a
                // published install resolves.
                find: /^@lightgallery\/headless$/,
                replacement: path.resolve(
                    dirname,
                    '../../packages/headless/dist/index.js',
                ),
            },
        ],
    },
    server: {
        host: true,
        port: 3005,
        allowedHosts: ['.trycloudflare.com'],
    },
});
