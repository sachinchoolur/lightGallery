#!/usr/bin/env node
/**
 * The vanilla bundles inline @lightgallery/headless, so `lightgallery`
 * has no runtime dependency on it — but the declarations tsc emits still
 * import its types by package name. Ship those types inside the package
 * instead: emit the headless declarations into `dist/types/headless` and
 * point every `@lightgallery/headless` specifier under `dist/types` at
 * that folder. Runs right after the vanilla declarations are emitted.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const typesDir = path.join(root, 'dist/types');
const headlessDir = path.join(root, 'packages/headless');
const inlinedDir = path.join(typesDir, 'headless');

const SPECIFIER = /(['"])@lightgallery\/headless\1/g;

function walk(dir, visit) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (full !== inlinedDir) walk(full, visit);
        } else if (entry.name.endsWith('.d.ts')) {
            visit(full);
        }
    }
}

rmSync(inlinedDir, { recursive: true, force: true });
const tsc = createRequire(path.join(headlessDir, 'package.json')).resolve(
    'typescript/bin/tsc',
);
execFileSync(
    process.execPath,
    [tsc, '-p', 'tsconfig.build.json', '--declarationDir', inlinedDir],
    { cwd: headlessDir, stdio: 'inherit' },
);

let rewritten = 0;
walk(typesDir, (file) => {
    const source = readFileSync(file, 'utf8');
    if (!SPECIFIER.test(source)) return;
    SPECIFIER.lastIndex = 0;
    let target = path
        .relative(path.dirname(file), path.join(inlinedDir, 'index'))
        .split(path.sep)
        .join('/');
    if (!target.startsWith('.')) target = `./${target}`;
    writeFileSync(file, source.replace(SPECIFIER, `$1${target}$1`));
    rewritten++;
});

const leftover = [];
walk(typesDir, (file) => {
    if (
        /(from|import\()\s*['"]@lightgallery\//.test(readFileSync(file, 'utf8'))
    ) {
        leftover.push(path.relative(root, file));
    }
});
if (leftover.length) {
    console.error(
        `declarations still import a workspace package by name:\n  ${leftover.join(
            '\n  ',
        )}`,
    );
    process.exit(1);
}
console.log(
    `inlined @lightgallery/headless types into dist/types/headless (${rewritten} files rewritten)`,
);
