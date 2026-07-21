import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    build: {
        target: 'es2017',
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            formats: ['es', 'cjs'],
            fileName: 'index',
        },
        sourcemap: true,
    },
    test: {
        environment: 'node',
    },
});
