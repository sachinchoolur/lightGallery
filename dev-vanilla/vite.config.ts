import { defineConfig } from 'vite';

/**
 * Vanilla dev-demo server for manual verification: serves the root
 * `src/` (TS + SCSS) directly with HMR — no build step. The v2/vanilla
 * counterpart of `packages/react/dev`, kept on the same images for
 * side-by-side gesture comparison.
 */
export default defineConfig({
    root: __dirname,
    server: {
        port: 5177,
    },
});
