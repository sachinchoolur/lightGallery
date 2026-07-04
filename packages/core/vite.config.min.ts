import path from 'path';
import { defineConfig, UserConfig } from 'vite';
import license from 'rollup-plugin-license';

import { LightGalleryBuildEntry } from './vite.config';

const rootDir = path.resolve(__dirname, '../..');
const distDir = path.resolve(rootDir, 'dist-vite');

export function createViteMinConfig(entry: LightGalleryBuildEntry): UserConfig {
    return defineConfig({
        root: rootDir,
        esbuild: {
            target: 'es2017',
        },
        build: {
            target: 'es2017',
            outDir: distDir,
            emptyOutDir: false,
            sourcemap: false,
            minify: 'terser',
            terserOptions: {
                format: {
                    comments: false,
                },
            },
            lib: {
                entry: entry.input,
                name: entry.name,
                formats: ['umd'],
                fileName: () => `${entry.fileName}.min.js`,
            },
            rollupOptions: {
                plugins: [
                    license({
                        cwd: rootDir,
                        banner: {
                            commentStyle: 'regular',
                            content: {
                                file: path.join(rootDir, '.banner'),
                            },
                        },
                    }),
                ],
            },
        },
    });
}

export default createViteMinConfig({
    input: path.resolve(rootDir, 'src/index.ts'),
    fileName: 'lightgallery',
    name: 'lightGallery',
});
