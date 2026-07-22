import path from 'node:path';
import { fileURLToPath } from 'node:url';
import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Test-only Vite config: the library builds with ng-packagr (APF); the
// Analog plugin compiles Angular for Vitest without an Angular CLI
// workspace (the official unit-test builder requires one — see the
// plans-angular 001 toolchain notes).
export default defineConfig({
    plugins: [
        angular({
            tsconfig: path.join(dirname, 'tsconfig.spec.json'),
        }),
    ],
    resolve: {
        // Secondary entry points import the core via the package name (APF
        // rule: never via relative paths across entries).
        alias: [
            {
                find: /^@lightgallery\/angular\/plugins\/([^/]+)$/,
                replacement: path.join(dirname, 'plugins/$1/index.ts'),
            },
            {
                find: '@lightgallery/angular',
                replacement: path.join(dirname, 'src/public-api.ts'),
            },
        ],
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['src/test-setup.ts'],
        include: ['src/**/*.spec.ts'],
    },
});
