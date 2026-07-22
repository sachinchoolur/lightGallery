// Bare-Node import matrix: every published entry must load as both ESM
// and CJS without touching browser globals. Run from a directory where
// @lightgallery/vue is installed (the scratch consumer).
import { createRequire } from 'node:module';

const plugins = [
    'thumbnail',
    'zoom',
    'video',
    'autoplay',
    'fullscreen',
    'hash',
    'pager',
    'share',
    'rotate',
    'comment',
    'mediumZoom',
    'relativeCaption',
    'vimeoThumbnail',
];
const specs = [
    '@lightgallery/vue',
    ...plugins.map((p) => `@lightgallery/vue/plugins/${p}`),
];
const require = createRequire(`${process.cwd()}/`);

for (const spec of specs) {
    const esm = await import(spec);
    if (Object.keys(esm).length === 0) {
        throw new Error(`ESM entry exported nothing: ${spec}`);
    }
    const cjs = require(spec);
    if (Object.keys(cjs).length === 0) {
        throw new Error(`CJS entry exported nothing: ${spec}`);
    }
}
console.log(`all ${specs.length} entries: ESM + CJS import OK`);
