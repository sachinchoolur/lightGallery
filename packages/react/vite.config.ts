import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    build: {
        target: 'es2017',
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            formats: ['es', 'cjs'],
            fileName: 'index',
        },
        sourcemap: true,
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                '@lightgallery/headless',
            ],
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './test/setup.ts',
    },
});
