import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    build: {
        target: 'es2017',
        lib: {
            entry: {
                index: path.resolve(__dirname, 'src/index.ts'),
                'plugins/thumbnail/index': path.resolve(
                    __dirname,
                    'src/plugins/thumbnail/index.tsx',
                ),
                'plugins/zoom/index': path.resolve(
                    __dirname,
                    'src/plugins/zoom/index.tsx',
                ),
                'plugins/video/index': path.resolve(
                    __dirname,
                    'src/plugins/video/index.tsx',
                ),
                'plugins/autoplay/index': path.resolve(
                    __dirname,
                    'src/plugins/autoplay/index.tsx',
                ),
                'plugins/fullscreen/index': path.resolve(
                    __dirname,
                    'src/plugins/fullscreen/index.tsx',
                ),
                'plugins/hash/index': path.resolve(
                    __dirname,
                    'src/plugins/hash/index.tsx',
                ),
                'plugins/pager/index': path.resolve(
                    __dirname,
                    'src/plugins/pager/index.tsx',
                ),
                'plugins/share/index': path.resolve(
                    __dirname,
                    'src/plugins/share/index.tsx',
                ),
                'plugins/rotate/index': path.resolve(
                    __dirname,
                    'src/plugins/rotate/index.tsx',
                ),
                'plugins/comment/index': path.resolve(
                    __dirname,
                    'src/plugins/comment/index.tsx',
                ),
                'plugins/mediumZoom/index': path.resolve(
                    __dirname,
                    'src/plugins/mediumZoom/index.tsx',
                ),
                'plugins/relativeCaption/index': path.resolve(
                    __dirname,
                    'src/plugins/relativeCaption/index.tsx',
                ),
                'plugins/vimeoThumbnail/index': path.resolve(
                    __dirname,
                    'src/plugins/vimeoThumbnail/index.tsx',
                ),
            },
            formats: ['es', 'cjs'],
            fileName: (format, entryName) =>
                `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
        },
        sourcemap: true,
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                '@lightgallery/headless',
            ],
            // Per-format outputs: shared CJS chunks must end in `.cjs` —
            // with `"type": "module"`, a `.js` chunk would be loaded as ESM
            // (caught by the scratch-consumer packaging check).
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
        setupFiles: './test/setup.ts',
    },
});
