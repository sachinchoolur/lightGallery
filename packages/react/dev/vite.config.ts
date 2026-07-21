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
        alias: {
            '@lightgallery/react': path.resolve(__dirname, '../src/index.ts'),
            '@lightgallery/headless': path.resolve(
                __dirname,
                '../../headless/src/index.ts',
            ),
            'lightgallery/css': path.resolve(__dirname, '../../../dist/css'),
        },
    },
    server: {
        port: 5174,
    },
});
