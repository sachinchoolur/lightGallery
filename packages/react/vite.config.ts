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
            output: {
                chunkFileNames: 'chunks/[name]-[hash].[format].js',
                exports: 'named',
            },
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './test/setup.ts',
    },
});
