#!/usr/bin/env node
/**
 * Every fenced JavaScript/TypeScript example in the docs, demos and the
 * agent skill must at least parse and resolve its imports against the
 * real workspace packages. Catches truncated snippets, typos in import
 * paths, and API drift in package entry points.
 *
 *   node site-astro/scripts/check-examples.mjs        (from the repo root)
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const SOURCES = ['site-astro/src/content/docs', 'site-astro/src/content/demos', 'skills'];
const LOADERS = { js: 'jsx', javascript: 'jsx', jsx: 'jsx', ts: 'tsx', tsx: 'tsx', typescript: 'tsx' };

function walk(dir) {
    return readdirSync(dir, { withFileTypes: true, recursive: true })
        .filter((e) => e.isFile() && /\.(md|mdx)$/.test(e.name))
        .map((e) => join(e.parentPath, e.name));
}

/** Fenced blocks with their language and starting line. */
function blocks(source) {
    const out = [];
    const lines = source.split('\n');
    let open = null;
    for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(/^\s*```(\w*)/);
        if (!m) {
            if (open) open.body.push(lines[i]);
            continue;
        }
        if (!open) open = { lang: m[1].toLowerCase(), start: i + 1, body: [] };
        else {
            out.push({ lang: open.lang, start: open.start, code: open.body.join('\n') });
            open = null;
        }
    }
    return out;
}

/** Vue SFC: check the <script> part as TypeScript. */
function vueScript(code) {
    const m = code.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    return m ? m[1] : null;
}

const externalise = {
    name: 'externals',
    setup(build) {
        // Framework runtimes, relative project files and assets are the
        // consumer's; only lightGallery's own entry points must resolve.
        build.onResolve({ filter: /^(react|react-dom|vue|@angular\/|rxjs|@vue\/)/ }, (a) => ({ path: a.path, external: true }));
        build.onResolve({ filter: /^@lightgallery\/angular(\/plugins\/[\w-]+)?$/ }, (a) => {
            const plugin = a.path.split('/plugins/')[1];
            const entry = plugin ? `lightgallery-angular-plugins-${plugin}.mjs` : 'lightgallery-angular.mjs';
            const path = join(ROOT, 'packages/angular/dist/fesm2022', entry);
            return existsSync(path) ? { path } : { errors: [{ text: `Could not resolve "${a.path}" (no built entry ${entry})` }] };
        });
        build.onResolve({ filter: /^\.{1,2}\// }, (a) => ({ path: a.path, external: true }));
        build.onResolve({ filter: /\.(css|scss|png|jpg|jpeg|webp|svg|mp4)$/ }, (a) => ({ path: a.path, external: true }));
    },
};

let checked = 0;
const failures = [];
for (const dir of SOURCES) {
    for (const file of walk(join(ROOT, dir))) {
        if (/\/docs\/v2\//.test(file)) continue; // archive of the retired 2.x wrappers
        const source = readFileSync(file, 'utf8');
        for (const block of blocks(source)) {
            let code = block.code;
            let loader = LOADERS[block.lang];
            if (block.lang === 'vue') {
                code = vueScript(code);
                loader = 'tsx';
                if (!code) continue;
            }
            if (!loader) continue;
            checked++;
            const compile = (contents) =>
                esbuild.build({
                    stdin: { contents, loader, resolveDir: ROOT, sourcefile: `${relative(ROOT, file)}:${block.start}` },
                    bundle: true,
                    write: false,
                    format: 'esm',
                    platform: 'browser',
                    logLevel: 'silent',
                    plugins: [externalise],
                    jsx: 'automatic',
                });
            try {
                try {
                    await compile(code);
                } catch (first) {
                    // Documented fragment idioms, accepted when they parse in
                    // their natural container: a settings body
                    // (`speed: 400,`), a bare object literal (`{ source: … }`),
                    // and class members (Angular component fragments).
                    const trimmed = code.replace(/^\s*\/\/.*$/gm, '').trim();
                    const attempts = [];
                    if (/^[\w$]+\s*:/.test(trimmed)) attempts.push(`const settings = {\n${code}\n};`);
                    if (/^\{/.test(trimmed)) attempts.push(`const item = ${code};`);
                    if (/^(ts|tsx|typescript)$/.test(block.lang)) attempts.push(`class Example {\n${code}\n}`);
                    let error = first;
                    let passed = false;
                    for (const attempt of attempts) {
                        try {
                            await compile(attempt);
                            passed = true;
                            break;
                        } catch (e) {
                            error = e;
                        }
                    }
                    if (!passed) throw error;
                }
            } catch (error) {
                const messages = (error.errors ?? [{ text: String(error) }]).map((e) => e.text);
                failures.push({ file: relative(ROOT, file), line: block.start, lang: block.lang, messages });
            }
        }
    }
}

for (const f of failures) {
    console.log(`\n${f.file}:${f.line} (${f.lang})`);
    for (const m of f.messages) console.log(`  ${m}`);
}
console.log(`\n${checked} examples checked, ${failures.length} failed.`);
process.exit(failures.length ? 1 : 0);
