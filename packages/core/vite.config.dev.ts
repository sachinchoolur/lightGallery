import path from 'path';

import { createViteConfig } from './vite.config';

const rootDir = path.resolve(__dirname, '../..');

// Watch/dev builds must never empty dist/ — the full tree (min bundles, css,
// fonts, types, package stubs) is assembled by `npm run build`, and a watcher
// that wipes it leaves the package broken until the next full build.
export default createViteConfig(
    {
        input: path.resolve(rootDir, 'src/index.ts'),
        fileName: 'lightgallery',
        name: 'lightGallery',
    },
    { emptyOutDir: false },
);
