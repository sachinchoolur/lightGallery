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
            entry: {
                index: fileURLToPath(
                    new URL('./src/index.ts', import.meta.url),
                ),
                'plugins/thumbnail/index': fileURLToPath(
                    new URL(
                        './src/plugins/thumbnail/index.ts',
                        import.meta.url,
                    ),
                ),
                'plugins/zoom/index': fileURLToPath(
                    new URL(
                        './src/plugins/zoom/index.ts',
                        import.meta.url,
                    ),
                ),
                'plugins/video/index': fileURLToPath(
                    new URL(
                        './src/plugins/video/index.ts',
                        import.meta.url,
                    ),
                ),
            },
            formats: ['es', 'cjs'],
            fileName: (format, entryName) =>
                `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
        },
        sourcemap: true,
        rollupOptions: {
            external: ['vue', '@lightgallery/headless'],
            // Shared CJS chunks must end in `.cjs` — with "type": "module"
            // a `.js` chunk would be loaded as ESM.
            output: [
                {
                    format: 'es',
                    chunkFileNames: 'chunks/[name]-[hash].js',
                    exports: 'named',
                },
                {
                    format: 'cjs',
                    chunkFileNames: 'chunks/[name]-[hash].cjs',
                    exports: 'named',
                },
            ],
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['src/**/*.spec.ts'],
    },
});
