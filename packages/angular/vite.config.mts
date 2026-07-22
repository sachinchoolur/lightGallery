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
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['src/test-setup.ts'],
        include: ['src/**/*.spec.ts'],
    },
});
