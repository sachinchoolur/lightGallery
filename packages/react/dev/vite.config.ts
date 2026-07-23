import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Dev-demo server for manual verification. The demo
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
                find: '@lightgallery/react/plugins/autoplay',
                replacement: path.resolve(
                    __dirname,
                    '../src/plugins/autoplay/index.tsx',
                ),
            },
            {
                find: '@lightgallery/react/plugins/fullscreen',
                replacement: path.resolve(
                    __dirname,
                    '../src/plugins/fullscreen/index.tsx',
                ),
            },
            {
                find: '@lightgallery/react/plugins/hash',
                replacement: path.resolve(
                    __dirname,
                    '../src/plugins/hash/index.tsx',
                ),
            },
            {
                find: '@lightgallery/react/plugins/pager',
                replacement: path.resolve(
                    __dirname,
                    '../src/plugins/pager/index.tsx',
                ),
            },
            {
                find: '@lightgallery/react/plugins/share',
                replacement: path.resolve(
                    __dirname,
                    '../src/plugins/share/index.tsx',
                ),
            },
            {
                find: '@lightgallery/react/plugins/rotate',
                replacement: path.resolve(
                    __dirname,
                    '../src/plugins/rotate/index.tsx',
                ),
            },
            {
                find: '@lightgallery/react/plugins/comment',
                replacement: path.resolve(
                    __dirname,
                    '../src/plugins/comment/index.tsx',
                ),
            },
            {
                find: '@lightgallery/react/plugins/mediumZoom',
                replacement: path.resolve(
                    __dirname,
                    '../src/plugins/mediumZoom/index.tsx',
                ),
            },
            {
                find: '@lightgallery/react/plugins/relativeCaption',
                replacement: path.resolve(
                    __dirname,
                    '../src/plugins/relativeCaption/index.tsx',
                ),
            },
            {
                find: '@lightgallery/react/plugins/vimeoThumbnail',
                replacement: path.resolve(
                    __dirname,
                    '../src/plugins/vimeoThumbnail/index.tsx',
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
