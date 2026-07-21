import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Dev-demo server for manual verification (plan 003 step 8). The demo
 * imports styles as a consumer would (`lightgallery/css/...`) — the alias
 * points that specifier at the repo's built CSS. Run `npm run build:css`
 * at the root first if `dist/css` is missing.
 */
export default defineConfig({
    root: __dirname,
    plugins: [react()],
    resolve: {
        // Array form: first match wins, so subpaths resolve before the
        // package root.
        alias: [
            {
                find: '@lightgallery/react/plugins/thumbnail',
                replacement: path.resolve(
                    __dirname,
                    '../src/plugins/thumbnail/index.tsx',
                ),
            },
            {
                find: '@lightgallery/react/plugins/zoom',
                replacement: path.resolve(
                    __dirname,
                    '../src/plugins/zoom/index.tsx',
                ),
            },
            {
                find: '@lightgallery/react/plugins/video',
                replacement: path.resolve(
                    __dirname,
                    '../src/plugins/video/index.tsx',
                ),
            },
            {
                find: '@lightgallery/react',
                replacement: path.resolve(__dirname, '../src/index.ts'),
            },
            {
                find: '@lightgallery/headless',
                replacement: path.resolve(
                    __dirname,
                    '../../headless/src/index.ts',
                ),
            },
            {
                find: 'lightgallery/css',
                replacement: path.resolve(__dirname, '../../../dist/css'),
            },
        ],
    },
    server: {
        port: 5174,
    },
});
