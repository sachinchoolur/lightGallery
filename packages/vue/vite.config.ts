import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

/**
 * Library build (ESM + CJS) + Vitest. Declarations are emitted separately
 * by `vue-tsc` (tsconfig.build.json) — plain tsc cannot see inside SFCs;
 * this split is load-bearing.
 */
export default defineConfig({
    plugins: [vue()],
    build: {
        target: 'es2017',
        lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            formats: ['es', 'cjs'],
            fileName: 'index',
        },
        rollupOptions: {
            external: ['vue', '@lightgallery/headless'],
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['src/**/*.spec.ts'],
    },
});
