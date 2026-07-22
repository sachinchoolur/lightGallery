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
                'plugins/autoplay/index': fileURLToPath(
                    new URL(
                        './src/plugins/autoplay/index.ts',
                        import.meta.url,
                    ),
                ),
                'plugins/fullscreen/index': fileURLToPath(
                    new URL(
                        './src/plugins/fullscreen/index.ts',
                        import.meta.url,
                    ),
                ),
                'plugins/hash/index': fileURLToPath(
                    new URL(
                        './src/plugins/hash/index.ts',
                        import.meta.url,
                    ),
                ),
                'plugins/pager/index': fileURLToPath(
                    new URL(
                        './src/plugins/pager/index.ts',
                        import.meta.url,
                    ),
                ),
                'plugins/share/index': fileURLToPath(
                    new URL(
                        './src/plugins/share/index.ts',
                        import.meta.url,
                    ),
                ),
                'plugins/rotate/index': fileURLToPath(
                    new URL(
                        './src/plugins/rotate/index.ts',
                        import.meta.url,
                    ),
                ),
                'plugins/comment/index': fileURLToPath(
                    new URL(
                        './src/plugins/comment/index.ts',
                        import.meta.url,
                    ),
                ),
                'plugins/mediumZoom/index': fileURLToPath(
                    new URL(
                        './src/plugins/mediumZoom/index.ts',
                        import.meta.url,
                    ),
                ),
                'plugins/relativeCaption/index': fileURLToPath(
                    new URL(
                        './src/plugins/relativeCaption/index.ts',
                        import.meta.url,
                    ),
                ),
                'plugins/vimeoThumbnail/index': fileURLToPath(
                    new URL(
                        './src/plugins/vimeoThumbnail/index.ts',
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
