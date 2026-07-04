import path from 'path';
import { defineConfig, UserConfig } from 'vite';
import license from 'rollup-plugin-license';

export interface LightGalleryBuildEntry {
    input: string;
    fileName: string;
    name: string;
}

interface LightGalleryViteConfigOptions {
    emptyOutDir?: boolean;
}

const rootDir = path.resolve(__dirname, '../..');
const distDir = path.resolve(rootDir, 'dist-vite');

export function createViteConfig(
    entry: LightGalleryBuildEntry,
    options: LightGalleryViteConfigOptions = {},
): UserConfig {
    return defineConfig({
        root: rootDir,
        esbuild: {
            target: 'es2017',
        },
        build: {
            target: 'es2017',
            outDir: distDir,
            emptyOutDir: options.emptyOutDir ?? true,
            sourcemap: true,
            minify: false,
            lib: {
                entry: entry.input,
                name: entry.name,
                formats: ['es', 'umd'],
                fileName: (format) =>
                    `${entry.fileName}.${format === 'es' ? 'es5' : 'umd'}.js`,
            },
            rollupOptions: {
                plugins: [
                    license({
                        cwd: rootDir,
                        banner: {
                            commentStyle: 'ignored',
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

export default createViteConfig({
    input: path.resolve(rootDir, 'src/index.ts'),
    fileName: 'lightgallery',
    name: 'lightGallery',
});
