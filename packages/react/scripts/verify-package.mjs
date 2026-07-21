#!/usr/bin/env node
/**
 * Release verification battery (plan 008): packs @lightgallery/headless and
 * @lightgallery/react with pnpm (applies publishConfig), installs both
 * tarballs into a scratch consumer, then:
 *   - imports AND requires every entry (core + all 13 plugin subpaths)
 *   - renderToString smoke for open + closed with every plugin
 *   - compiles a typed consumer under moduleResolution NodeNext and Bundler
 *
 * Usage: node scripts/verify-package.mjs [scratchDir]
 * Needs network for the scratch `npm install` (react/react-dom/typescript).
 */
import { execSync } from 'node:child_process';
import {
    cpSync,
    mkdirSync,
    readdirSync,
    rmSync,
    writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const reactPkgDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
);
const headlessPkgDir = path.resolve(reactPkgDir, '../headless');
const scratch =
    process.argv[2] ?? path.join(tmpdir(), `lg-react-verify-${Date.now()}`);

const PLUGINS = [
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

function run(cmd, cwd) {
    console.log(`$ ${cmd}`);
    execSync(cmd, { cwd, stdio: 'inherit' });
}

rmSync(scratch, { recursive: true, force: true });
mkdirSync(scratch, { recursive: true });

// 1. Build + pack both packages (pnpm pack applies publishConfig).
run('npx pnpm@9.15.0 run build', headlessPkgDir);
run('npx pnpm@9.15.0 run build', reactPkgDir);
run(`npx pnpm@9.15.0 pack --pack-destination ${scratch}`, headlessPkgDir);
run(`npx pnpm@9.15.0 pack --pack-destination ${scratch}`, reactPkgDir);
const tarballs = readdirSync(scratch).filter((f) => f.endsWith('.tgz'));
const headlessTgz = tarballs.find((f) => f.includes('headless'));
const reactTgz = tarballs.find((f) => !f.includes('headless'));
if (!headlessTgz || !reactTgz) {
    throw new Error(`tarballs missing in ${scratch}: ${tarballs}`);
}

// 2. publint on the extracted tarballs (what consumers actually get).
for (const tgz of [headlessTgz, reactTgz]) {
    const dir = path.join(scratch, `extract-${tgz.replace('.tgz', '')}`);
    mkdirSync(dir, { recursive: true });
    run(`tar -xzf ${path.join(scratch, tgz)} -C ${dir}`);
    run(`npx --yes publint@latest ${path.join(dir, 'package')} --strict`);
}

// 3. Scratch consumer installing both tarballs.
writeFileSync(
    path.join(scratch, 'package.json'),
    JSON.stringify(
        {
            name: 'lg-react-scratch-consumer',
            private: true,
            dependencies: {
                '@lightgallery/headless': `file:./${headlessTgz}`,
                '@lightgallery/react': `file:./${reactTgz}`,
                react: '^18.3.1',
                'react-dom': '^18.3.1',
            },
            devDependencies: {
                '@types/react': '^18.0.15',
                '@types/react-dom': '^18.0.6',
                typescript: '^5.4.5',
            },
        },
        null,
        2,
    ),
);
run('npm install --no-audit --no-fund --loglevel=error', scratch);

// 4. ESM + CJS import matrix with renderToString smoke.
const entryList = JSON.stringify(PLUGINS);
writeFileSync(
    path.join(scratch, 'consume.mjs'),
    `import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { LightGallery } from '@lightgallery/react';
import { createGalleryState } from '@lightgallery/headless';
const plugins = [];
for (const name of ${entryList}) {
    const mod = await import('@lightgallery/react/plugins/' + name);
    if (!mod.default?.name) throw new Error('bad plugin export: ' + name);
    plugins.push(mod.default);
}
if (createGalleryState({ slidesCount: 1 }).open !== false) throw new Error('headless broken');
for (const open of [false, true]) {
    const html = renderToString(createElement(LightGallery, { slides: [{ src: 'a.jpg' }], open, onClose: () => {}, plugins }));
    if (html !== '') throw new Error('expected empty SSR output');
}
console.log('ESM matrix OK');
`,
);
writeFileSync(
    path.join(scratch, 'consume.cjs'),
    `const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const { LightGallery } = require('@lightgallery/react');
const { createGalleryState } = require('@lightgallery/headless');
const plugins = ${entryList}.map((name) => {
    const mod = require('@lightgallery/react/plugins/' + name);
    if (!mod.default?.name) throw new Error('bad plugin export: ' + name);
    return mod.default;
});
if (createGalleryState({ slidesCount: 1 }).open !== false) throw new Error('headless broken');
for (const open of [false, true]) {
    const html = renderToString(createElement(LightGallery, { slides: [{ src: 'a.jpg' }], open, onClose: () => {}, plugins }));
    if (html !== '') throw new Error('expected empty SSR output');
}
console.log('CJS matrix OK');
`,
);
run('node consume.mjs', scratch);
run('node consume.cjs', scratch);

// 5. Types resolve under NodeNext and Bundler.
const imports = PLUGINS.map(
    (name, i) => `import P${i} from '@lightgallery/react/plugins/${name}';`,
).join('\n');
writeFileSync(
    path.join(scratch, 'consumer.tsx'),
    `import { LightGallery, type LightGalleryProps, type LightGalleryRefHandle } from '@lightgallery/react';
import { createGalleryState, type GalleryState } from '@lightgallery/headless';
${imports}
const state: GalleryState = createGalleryState({ slidesCount: 2 });
const props: LightGalleryProps = {
    slides: [{ src: 'a.jpg' }],
    open: state.open,
    onClose: () => undefined,
    plugins: [${PLUGINS.map((_n, i) => `P${i}`).join(', ')}],
    zoom: { scale: 1.5 },
    thumbnail: { thumbWidth: 120 },
};
export function App(ref: React.Ref<LightGalleryRefHandle>) {
    return <LightGallery ref={ref} {...props} />;
}
`,
);
// A CJS TS consumer exercises the require-side .d.cts types.
writeFileSync(
    path.join(scratch, 'consumer-cjs.cts'),
    `import lg = require('@lightgallery/react');
import zoom = require('@lightgallery/react/plugins/zoom');
import headless = require('@lightgallery/headless');
const state: headless.GalleryState = headless.createGalleryState({ slidesCount: 1 });
if (!state || !lg.LightGallery || !zoom.default.name) {
    throw new Error('unreachable');
}
`,
);
for (const moduleResolution of ['nodenext', 'bundler']) {
    writeFileSync(
        path.join(scratch, 'tsconfig.json'),
        JSON.stringify({
            compilerOptions: {
                target: 'ES2017',
                module: moduleResolution === 'nodenext' ? 'NodeNext' : 'ESNext',
                moduleResolution,
                jsx: 'react-jsx',
                strict: true,
                noEmit: true,
                skipLibCheck: true,
            },
            include:
                moduleResolution === 'nodenext'
                    ? ['consumer.tsx', 'consumer-cjs.cts']
                    : ['consumer.tsx'],
        }),
    );
    run('npx tsc -p tsconfig.json', scratch);
    console.log(`types OK under moduleResolution=${moduleResolution}`);
}

console.log(`\nAll release verifications passed. Scratch: ${scratch}`);
