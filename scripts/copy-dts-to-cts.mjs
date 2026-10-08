#!/usr/bin/env node
/**
 * Duplicate every emitted .d.ts as .d.cts (recursively) so `require`
 * consumers under TS NodeNext get CJS-interpreted declarations — the
 * packages are `"type": "module"`, which makes plain .d.ts ESM-typed.
 * Used by the @lightgallery/headless and @lightgallery/react builds.
 */
import { copyFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'dist');

function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full);
        } else if (entry.name.endsWith('.d.ts')) {
            copyFileSync(full, full.replace(/\.d\.ts$/, '.d.cts'));
        }
    }
}

walk(root);
console.log(`copied .d.ts -> .d.cts under ${root}`);
