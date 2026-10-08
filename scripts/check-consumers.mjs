#!/usr/bin/env node
/**
 * Consumer-app check. Builds the small apps in `consumers/` against the
 * packed packages, the way a user installs them, and drives each one in
 * headless Chrome: Next.js, Nuxt, Angular SSR, React Router (framework
 * mode), an Astro page with a React island, Vite + React both as a
 * production build and on the dev server (StrictMode), and the vanilla
 * build from CDN-style script tags.
 *
 *   npm run check:consumers                       pack the current builds, check them
 *   npm run check:consumers -- --tarballs <dir>   check tarballs packed earlier
 *                                                 (release:check prints the folder)
 *   npm run check:consumers -- --version <v>      check a version on the registry
 *   npm run check:consumers -- --only <app>       one app, by its id in APPS
 *   npm run check:consumers -- --keep             keep the scratch folder
 *
 * Each app gets a clean `npm install`, a strict compile of every
 * lightGallery declaration it installed (skipLibCheck off), its own type
 * check and production build, then on the running server:
 *   - server HTML: every trigger links to its image; no lightbox markup
 *   - console: nothing but the license notice through load and hydration
 *   - keyboard: Tab reaches the first trigger, Enter opens, ArrowRight
 *     advances, Escape closes and focus returns to the trigger
 *   - axe: no WCAG 2.1 A/AA violations in the open lightbox or the triggers
 * Across the apps, the triggers and the open lightbox must carry the same
 * lg-* structure and ARIA (see PARITY_ALLOWED for accepted differences;
 * the vanilla lightbox is compared as a warning, see APPS).
 *
 * Needs Chrome or Chromium; set CHROME_PATH when it is not in a usual place.
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import zlib from 'node:zlib';

import { HEADLESS, PACKAGES } from './release-packages.mjs';

const rootDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
);

// The workspace hoists an old npm into node_modules/.bin, which `pnpm run`
// puts first on PATH; the consumer installs need the real one.
const cleanPath = (process.env.PATH || '')
    .split(path.delimiter)
    .filter((entry) => !entry.includes(`node_modules${path.sep}.bin`))
    .join(path.delimiter);
const useShell = process.platform === 'win32';

// No framework usage reporting from scratch builds.
const QUIET_ENV = {
    ASTRO_TELEMETRY_DISABLED: '1',
    NEXT_TELEMETRY_DISABLED: '1',
    NUXT_TELEMETRY_DISABLED: '1',
    NG_CLI_ANALYTICS: 'false',
};

const PHOTOS = 4;
const PHOTO_SIZE = [1600, 1067];
const THUMB_SIZE = [400, 267];
const LICENSE_NOTICE = /license key is not valid for production use/;

// React marks rendered elements with its own expando properties.
const REACT_READY = `Object.keys(document.querySelector('.grid a') || {}).some((k) => k.startsWith('__reactProps'))`;

/**
 * The apps. `scripts` run in order after install (default: typecheck and
 * build when the app has them); `serve` is the npm script that serves it,
 * given `PORT` and, through `serveArgs`, any flags it needs for the port.
 * `ssr: false` skips the server-HTML check (client-rendered apps);
 * `triggerParity: false` keeps the app's triggers out of the comparison
 * (vanilla triggers are the user's own markup); `lightboxParity: 'warn'`
 * reports its lightbox differences as warnings instead of failures.
 */
export const APPS = [
    {
        id: 'next',
        dir: 'consumers/next',
        hydrated: REACT_READY,
    },
    {
        id: 'nuxt',
        dir: 'consumers/nuxt',
        hydrated: `!!document.querySelector('#__nuxt')?.__vue_app__`,
    },
    {
        id: 'angular-ssr',
        dir: 'consumers/angular-ssr',
        hydrated: `!!document.querySelector('.grid a')?.__ngContext__`,
    },
    {
        id: 'react-router',
        dir: 'consumers/react-router',
        hydrated: REACT_READY,
    },
    {
        id: 'astro',
        dir: 'consumers/astro',
        serveArgs: (port) => ['--port', String(port)],
        hydrated: REACT_READY,
    },
    {
        id: 'vite-react',
        dir: 'consumers/vite-react',
        ssr: false,
        serveArgs: (port) => ['--port', String(port), '--strictPort'],
        hydrated: REACT_READY,
    },
    {
        // The dev server, where StrictMode double-mounts every effect.
        id: 'vite-react-dev',
        dir: 'consumers/vite-react',
        ssr: false,
        scripts: ['typecheck'],
        serve: 'dev',
        serveArgs: (port) => ['--port', String(port), '--strictPort'],
        hydrated: REACT_READY,
    },
    {
        id: 'vanilla-cdn',
        dir: 'consumers/vanilla-cdn',
        triggerParity: false,
        // Its lightbox differs from the framework packages in ways still
        // to be settled; the differences are reported as warnings.
        lightboxParity: 'warn',
        hydrated: `!!document.querySelector('.grid a[data-lg-id]')`,
    },
];

/**
 * Differences between the stacks' lightbox markup that are known and
 * accepted, as `signature: reason`. A signature is an element's tag, its
 * sorted lg-* classes and its ARIA attributes, as the parity check prints.
 */
const PARITY_ALLOWED = {};

// ---------------------------------------------------------------------------
// Processes

function runAsync(command, args, { cwd, env = {}, logFile }) {
    return new Promise((resolve) => {
        const child = spawn(command, args, {
            cwd,
            env: { ...process.env, ...QUIET_ENV, PATH: cleanPath, ...env },
            shell: useShell,
        });
        let output = '';
        const collect = (chunk) => {
            output += chunk;
            if (logFile) fs.appendFileSync(logFile, chunk);
        };
        child.stdout.on('data', collect);
        child.stderr.on('data', collect);
        child.on('error', (error) =>
            resolve({ code: -1, output: String(error) }),
        );
        child.on('close', (code) => resolve({ code, output }));
    });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function freePort() {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.unref();
        server.on('error', reject);
        server.listen(0, () => {
            const { port } = server.address();
            server.close(() => resolve(port));
        });
    });
}

function findChrome() {
    const candidates = [
        process.env.CHROME_PATH,
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        'google-chrome',
        'google-chrome-stable',
        'chromium',
        'chromium-browser',
    ].filter(Boolean);
    for (const candidate of candidates) {
        if (candidate.includes('/')) {
            if (fs.existsSync(candidate)) return candidate;
            continue;
        }
        const found = spawnSync('which', [candidate], { encoding: 'utf8' });
        if (found.status === 0 && found.stdout.trim())
            return found.stdout.trim();
    }
    return null;
}

// ---------------------------------------------------------------------------
// Fixtures

/** A solid-colour RGB PNG, so the apps need no binary fixtures. */
function png(width, height, [r, g, b]) {
    const row = Buffer.alloc(1 + width * 3);
    for (let x = 0; x < width; x++) row.set([r, g, b], 1 + x * 3);
    const raw = Buffer.concat(Array.from({ length: height }, () => row));
    const chunk = (type, data) => {
        const length = Buffer.alloc(4);
        length.writeUInt32BE(data.length);
        const body = Buffer.concat([Buffer.from(type), data]);
        const crc = Buffer.alloc(4);
        crc.writeUInt32BE(zlib.crc32(body));
        return Buffer.concat([length, body, crc]);
    };
    const header = Buffer.alloc(13);
    header.writeUInt32BE(width, 0);
    header.writeUInt32BE(height, 4);
    header.set([8, 2, 0, 0, 0], 8);
    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk('IHDR', header),
        chunk('IDAT', zlib.deflateSync(raw)),
        chunk('IEND', Buffer.alloc(0)),
    ]);
}

function writePhotos(dir) {
    fs.mkdirSync(dir, { recursive: true });
    const colours = [
        [52, 101, 164],
        [204, 102, 51],
        [78, 154, 6],
        [117, 80, 123],
    ];
    for (let n = 1; n <= PHOTOS; n++) {
        const colour = colours[(n - 1) % colours.length];
        fs.writeFileSync(
            path.join(dir, `${n}.png`),
            png(...PHOTO_SIZE, colour),
        );
        fs.writeFileSync(
            path.join(dir, `${n}-thumb.png`),
            png(...THUMB_SIZE, colour),
        );
    }
}

// ---------------------------------------------------------------------------
// Packages

const LG_NAMES = new Set(PACKAGES.map((pkg) => pkg.name));

function tarballVersion(file) {
    const match = /-(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)\.tgz$/.exec(file);
    return match ? match[1] : null;
}

/** Maps package names to tarball paths in a folder of packed tarballs. */
function readTarballDir(dir) {
    const files = fs.readdirSync(dir).filter((file) => file.endsWith('.tgz'));
    const tarballs = new Map();
    for (const pkg of PACKAGES) {
        const prefix = pkg.name.replace('@', '').replace('/', '-');
        const file = files.find(
            (entry) =>
                entry.startsWith(`${prefix}-`) &&
                /^\d/.test(entry.slice(prefix.length + 1)),
        );
        if (!file) throw new Error(`No tarball for ${pkg.name} in ${dir}.`);
        tarballs.set(pkg.name, path.join(dir, file));
    }
    return tarballs;
}

function packWorkspace(dir) {
    fs.mkdirSync(dir, { recursive: true });
    for (const pkg of PACKAGES) {
        const cwd = path.join(rootDir, pkg.packDir ?? pkg.dir);
        const [command, args] = pkg.packDir
            ? ['npm', ['pack', '--pack-destination', dir]]
            : ['pnpm', ['pack', '--pack-destination', dir]];
        const result = spawnSync(command, args, {
            cwd,
            env: { ...process.env, PATH: cleanPath },
            shell: useShell,
            encoding: 'utf8',
        });
        if (result.status !== 0) {
            throw new Error(
                `Packing ${pkg.name} failed:\n${
                    result.stderr || result.stdout
                }`,
            );
        }
    }
    return readTarballDir(dir);
}

/** Points the app's lightGallery dependencies at the tarballs or a version. */
function pinPackages(appDir, source) {
    const file = path.join(appDir, 'package.json');
    const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
    const spec = (name) =>
        source.tarballs ? `file:${source.tarballs.get(name)}` : source.version;
    for (const name of Object.keys(manifest.dependencies)) {
        if (LG_NAMES.has(name)) manifest.dependencies[name] = spec(name);
    }
    if (source.tarballs) {
        // Without it npm would fetch headless from the registry.
        manifest.dependencies[HEADLESS] = spec(HEADLESS);
    }
    fs.writeFileSync(file, JSON.stringify(manifest, null, 4));
}

/** Every lightGallery package the app resolved, with its version and path. */
function installedPackages(appDir) {
    const found = [];
    const walk = (dir, depth) => {
        if (depth > 6 || !fs.existsSync(dir)) return;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            if (!entry.isDirectory()) continue;
            const full = path.join(dir, entry.name);
            if (entry.name.startsWith('@')) {
                for (const scoped of fs.readdirSync(full)) {
                    visit(
                        path.join(full, scoped),
                        `${entry.name}/${scoped}`,
                        depth,
                    );
                }
            } else if (!entry.name.startsWith('.')) {
                visit(full, entry.name, depth);
            }
        }
    };
    const visit = (dir, name, depth) => {
        if (LG_NAMES.has(name)) {
            const manifest = path.join(dir, 'package.json');
            if (fs.existsSync(manifest)) {
                found.push({
                    name,
                    version: JSON.parse(fs.readFileSync(manifest, 'utf8'))
                        .version,
                    dir: path.relative(appDir, dir),
                });
            }
        }
        walk(path.join(dir, 'node_modules'), depth + 1);
    };
    walk(path.join(appDir, 'node_modules'), 0);
    return found;
}

/**
 * Type-imports every entry of the installed lightGallery packages and
 * compiles them with skipLibCheck off, so a broken or unresolvable
 * declaration fails here instead of turning into a silent `any`.
 */
async function checkDeclarations(appDir, logFile) {
    const specifiers = [];
    for (const { name, dir } of installedPackages(appDir)) {
        const manifest = JSON.parse(
            fs.readFileSync(path.join(appDir, dir, 'package.json'), 'utf8'),
        );
        for (const [subpath, conditions] of Object.entries(
            manifest.exports ?? {},
        )) {
            const hasTypes = JSON.stringify(conditions).includes('"types"');
            if (!subpath.includes('*') && hasTypes) {
                specifiers.push(path.posix.join(name, subpath));
            }
        }
    }
    const source = [...new Set(specifiers)]
        .map(
            (specifier, index) =>
                `import type * as entry${index} from '${specifier}';`,
        )
        .join('\n');
    fs.writeFileSync(
        path.join(appDir, 'lg-declarations.ts'),
        `${source}\nexport {};\n`,
    );
    fs.writeFileSync(
        path.join(appDir, 'tsconfig.lg-declarations.json'),
        JSON.stringify({
            compilerOptions: {
                strict: true,
                noEmit: true,
                skipLibCheck: false,
                target: 'ES2022',
                module: 'ESNext',
                moduleResolution: 'bundler',
                lib: ['ES2022', 'DOM', 'DOM.Iterable'],
                jsx: 'react-jsx',
                types: [],
            },
            files: ['lg-declarations.ts'],
        }),
    );
    // The app's TypeScript, which knows its framework's declarations; the
    // repository's for apps that install none.
    const appTsc = path.join(appDir, 'node_modules/typescript/bin/tsc');
    const run = await runAsync(
        process.execPath,
        [
            fs.existsSync(appTsc)
                ? appTsc
                : path.join(rootDir, 'node_modules/typescript/bin/tsc'),
            '-p',
            'tsconfig.lg-declarations.json',
        ],
        {
            cwd: appDir,
            logFile,
        },
    );
    // The app's own type check must not see the generated files.
    fs.rmSync(path.join(appDir, 'lg-declarations.ts'));
    fs.rmSync(path.join(appDir, 'tsconfig.lg-declarations.json'));
    return {
        count: new Set(specifiers).size,
        ok: run.code === 0,
        output: run.output,
    };
}

// ---------------------------------------------------------------------------
// DevTools protocol

async function launchChrome(binary, profileDir) {
    const port = await freePort();
    const chrome = spawn(
        binary,
        [
            '--headless=new',
            `--remote-debugging-port=${port}`,
            `--user-data-dir=${profileDir}`,
            '--window-size=1280,900',
            '--no-first-run',
            '--no-default-browser-check',
            'about:blank',
        ],
        { stdio: 'ignore' },
    );
    for (let i = 0; i < 80; i++) {
        try {
            await fetch(`http://localhost:${port}/json/version`);
            return { port, close: () => chrome.kill() };
        } catch {
            await sleep(250);
        }
    }
    chrome.kill();
    throw new Error('Chrome did not start.');
}

async function openTab(chromePort) {
    const target = await (
        await fetch(`http://localhost:${chromePort}/json/new?about:blank`, {
            method: 'PUT',
        })
    ).json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
        ws.onopen = resolve;
        ws.onerror = reject;
    });
    let seq = 0;
    const pending = new Map();
    const listeners = new Set();
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.id && pending.has(message.id)) {
            pending.get(message.id)(message);
            pending.delete(message.id);
            return;
        }
        for (const listener of listeners) listener(message);
    };
    const send = (method, params = {}) =>
        new Promise((resolve) => {
            const id = ++seq;
            pending.set(id, resolve);
            ws.send(JSON.stringify({ id, method, params }));
        });
    const evaluate = async (expression) => {
        const response = await send('Runtime.evaluate', {
            expression,
            returnByValue: true,
            awaitPromise: true,
        });
        const details = response.result?.exceptionDetails;
        if (details) {
            throw new Error(details.exception?.description || details.text);
        }
        return response.result?.result?.value;
    };
    const waitFor = async (expression, timeout = 10000) => {
        const end = Date.now() + timeout;
        while (Date.now() < end) {
            if (await evaluate(expression).catch(() => false)) return true;
            await sleep(100);
        }
        return false;
    };
    const key = async (name, code, text) => {
        const base = {
            key: name,
            code: name,
            windowsVirtualKeyCode: code,
            nativeVirtualKeyCode: code,
        };
        await send('Input.dispatchKeyEvent', {
            type: 'keyDown',
            ...base,
            ...(text ? { text } : {}),
        });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
    };
    const close = () => {
        ws.close();
        return fetch(
            `http://localhost:${chromePort}/json/close/${target.id}`,
        ).catch(() => {});
    };
    return { send, evaluate, waitFor, key, close, listeners };
}

// ---------------------------------------------------------------------------
// Checks

const ID_REFS = new Set([
    'aria-labelledby',
    'aria-describedby',
    'aria-controls',
    'aria-owns',
    'id',
    'for',
]);

/** The open lightbox as a set of element signatures, for the parity check. */
const LIGHTBOX_SIGNATURES = `(() => {
    const root = document.querySelector('.lg-container');
    if (!root) return [];
    const idRefs = ${JSON.stringify([...ID_REFS])};
    const out = new Set();
    for (const el of [root, ...root.querySelectorAll('*')]) {
        const lg = [...el.classList].filter((c) => c.startsWith('lg-')).sort();
        if (!lg.length) continue;
        const attrs = [...el.attributes]
            .filter((a) => a.name === 'role' || a.name === 'tabindex' || a.name.startsWith('aria-'))
            .map((a) => a.name + '=' + (idRefs.includes(a.name) ? '#' : a.value))
            .sort();
        // Angular renders components as their own elements (<lg-slide>,
        // <lg-caption>) where React and Vue render a div; classes and ARIA
        // still have to match.
        const tag = el.tagName.includes('-') ? 'div' : el.tagName.toLowerCase();
        out.add(tag + '.' + lg.join('.') + (attrs.length ? '[' + attrs.join(',') + ']' : ''));
    }
    return [...out].sort();
})()`;

const LIGHTBOX_STATE = `(() => {
    const container = document.querySelector('.lg-container.lg-show');
    const current = document.querySelector('.lg-item.lg-current');
    const media = current && current.querySelector('img.lg-object');
    return {
        open: !!container,
        focusInside: !!container && container.contains(document.activeElement),
        counter: document.querySelector('.lg-counter')?.textContent.replace(/\\s+/g, ' ').trim() ?? null,
        caption: document.querySelector('.lg-sub-html')?.textContent.trim() ?? null,
        loaded: !!media && media.complete && media.naturalWidth > 0,
        url: location.href,
    };
})()`;

const FIRST_TRIGGER = `document.querySelector('.grid a')`;

/** Opening tags of the anchors that wrap a thumbnail, from server HTML. */
function triggerTags(html) {
    const tags = [];
    const pattern =
        /(<a\b[^>]*>)(?:(?!<\/a>)[\s\S])*?<img\b[^>]*\/photos\/\d+-thumb\.png/g;
    for (const match of html.matchAll(pattern)) {
        const attributes = {};
        for (const attr of match[1]
            .slice(2, -1)
            .matchAll(/([^\s=/>]+)(?:="([^"]*)")?/g)) {
            attributes[attr[1]] = attr[2] ?? '';
        }
        tags.push(attributes);
    }
    return tags;
}

// Attributes the frameworks add for their own bookkeeping.
const FRAMEWORK_ATTRIBUTE = /^(jsaction|ngh|_ng|data-v-|data-ng|ng-)/;

async function checkServerHtml(baseUrl, result) {
    const response = await fetch(baseUrl);
    const html = await response.text();
    if (response.status !== 200) {
        result.failures.push(`server answered ${response.status}`);
        return;
    }
    const triggers = triggerTags(html);
    if (triggers.length !== PHOTOS) {
        result.failures.push(
            `server HTML has ${triggers.length} gallery triggers, expected ${PHOTOS}`,
        );
    }
    triggers.forEach((attributes, index) => {
        const expected = `/photos/${index + 1}.png`;
        if (attributes.href !== expected) {
            result.failures.push(
                `server HTML: trigger ${index + 1} has href ${JSON.stringify(
                    attributes.href ?? null,
                )}, expected ${expected}`,
            );
        }
    });
    result.triggerAttributes = [
        ...new Set(triggers.flatMap((attributes) => Object.keys(attributes))),
    ]
        .filter((name) => !FRAMEWORK_ATTRIBUTE.test(name))
        .sort();
    if (/class="[^"]*\blg-(container|outer)\b/.test(html)) {
        result.failures.push('server HTML contains the lightbox markup');
    }
}

function axeSummary(violations) {
    return violations.map(
        (violation) =>
            `axe ${violation.id} (${violation.impact}): ${violation.help}; ` +
            violation.nodes
                .slice(0, 3)
                .map((node) => node.target.join(' '))
                .join(' | '),
    );
}

const AXE_OPTIONS = JSON.stringify({
    runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    },
});

async function checkInBrowser(
    app,
    baseUrl,
    chromePort,
    axeSource,
    workDir,
    result,
) {
    const tab = await openTab(chromePort);
    const problems = [];
    tab.listeners.add(({ method, params }) => {
        if (method === 'Runtime.exceptionThrown') {
            const details = params.exceptionDetails;
            problems.push(
                `exception: ${details.exception?.description || details.text}`,
            );
        } else if (method === 'Runtime.consoleAPICalled') {
            if (['error', 'warning', 'assert'].includes(params.type)) {
                const text = params.args
                    .map((arg) => arg.value ?? arg.description ?? '')
                    .join(' ');
                if (!LICENSE_NOTICE.test(text))
                    problems.push(`console.${params.type}: ${text}`);
            }
        } else if (method === 'Log.entryAdded') {
            const { level, text, url = '' } = params.entry;
            if (
                ['error', 'warning'].includes(level) &&
                !url.endsWith('/favicon.ico')
            ) {
                problems.push(`${level}: ${text} ${url}`.trim());
            }
        } else if (method === 'Network.responseReceived') {
            const { status, url } = params.response;
            if (status >= 400 && !url.endsWith('/favicon.ico'))
                problems.push(`HTTP ${status}: ${url}`);
        }
    });
    const step = async (label, expression, timeout) => {
        if (!(await tab.waitFor(expression, timeout))) {
            result.failures.push(label);
            return false;
        }
        return true;
    };
    try {
        for (const domain of ['Runtime', 'Log', 'Network', 'Page'])
            await tab.send(`${domain}.enable`);
        await tab.send('Page.navigate', { url: baseUrl });
        if (!(await step('the page did not hydrate', app.hydrated, 30000)))
            return;
        // Let hydration finish its effects before driving the page.
        await sleep(500);

        // Keyboard: Tab from the heading reaches the first trigger.
        await tab.evaluate(`(() => {
            document.activeElement?.blur();
            const heading = document.querySelector('h1');
            heading.tabIndex = -1;
            heading.focus();
            heading.removeAttribute('tabindex');
        })()`);
        await tab.key('Tab', 9);
        if (
            !(await step(
                'Tab does not reach the first gallery trigger',
                `document.activeElement === ${FIRST_TRIGGER}`,
                2000,
            ))
        )
            return;

        await tab.key('Enter', 13, '\r');
        if (
            !(await step(
                'Enter on the trigger does not open the lightbox',
                `(${LIGHTBOX_STATE}).open`,
                5000,
            ))
        )
            return;
        const opened = await tab.evaluate(LIGHTBOX_STATE);
        if (opened.url !== baseUrl)
            result.failures.push(`Enter navigated to ${opened.url}`);
        await step(
            'the first slide image did not load',
            `(${LIGHTBOX_STATE}).loaded`,
            10000,
        );
        if (!(await tab.evaluate(LIGHTBOX_STATE)).focusInside) {
            result.failures.push('focus did not move into the lightbox');
        }
        const state = await tab.evaluate(LIGHTBOX_STATE);
        if (state.counter !== `1 / ${PHOTOS}`)
            result.failures.push(`counter reads "${state.counter}" on open`);
        if (state.caption !== 'Photo 1 caption')
            result.failures.push(`caption reads "${state.caption}" on open`);

        // Settle the opening animation, then record and audit the lightbox.
        await sleep(1000);
        result.lightbox = await tab.evaluate(LIGHTBOX_SIGNATURES);
        await tab.evaluate(axeSource);
        const lightboxAxe = await tab.evaluate(
            `axe.run(document.querySelector('.lg-container'), ${AXE_OPTIONS}).then((r) => r.violations.map(({ id, impact, help, nodes }) => ({ id, impact, help, nodes: nodes.map((n) => ({ target: n.target })) })))`,
        );
        result.failures.push(
            ...axeSummary(lightboxAxe).map((line) => `lightbox ${line}`),
        );

        await tab.key('ArrowRight', 39);
        await step(
            'ArrowRight did not advance to slide 2',
            `(() => { const s = ${LIGHTBOX_STATE}; return s.counter === '2 / ${PHOTOS}' && s.caption === 'Photo 2 caption'; })()`,
            5000,
        );

        await tab.key('Escape', 27);
        if (
            await step(
                'Escape did not close the lightbox',
                `!(${LIGHTBOX_STATE}).open`,
                5000,
            )
        ) {
            await step(
                'focus did not return to the trigger after closing',
                `document.activeElement === ${FIRST_TRIGGER}`,
                3000,
            );
        }
        const finalUrl = await tab.evaluate('location.href');
        if (finalUrl !== baseUrl)
            result.failures.push(`the page navigated to ${finalUrl}`);

        const triggerAxe = await tab.evaluate(
            `axe.run(document.querySelector('.grid'), ${AXE_OPTIONS}).then((r) => r.violations.map(({ id, impact, help, nodes }) => ({ id, impact, help, nodes: nodes.map((n) => ({ target: n.target })) })))`,
        );
        result.failures.push(
            ...axeSummary(triggerAxe).map((line) => `triggers ${line}`),
        );
    } catch (error) {
        result.failures.push(`browser check stopped: ${error.message}`);
    } finally {
        result.failures.push(...new Set(problems));
        if (result.failures.length) {
            const shot = await tab
                .send('Page.captureScreenshot', { format: 'png' })
                .catch(() => null);
            if (shot?.result?.data) {
                const file = path.join(workDir, `${app.id}-failure.png`);
                fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
                result.screenshot = file;
            }
        }
        await tab.close();
    }
}

/** Items that some apps have and others lack, minus the accepted ones. */
function parityDifferences(results, key) {
    const present = results.filter((result) => Array.isArray(result[key]));
    if (present.length < 2) return [];
    const all = new Set(present.flatMap((result) => result[key]));
    const differences = [];
    for (const item of [...all].sort()) {
        const having = present
            .filter((result) => result[key].includes(item))
            .map((result) => result.id);
        if (having.length !== present.length && !PARITY_ALLOWED[item]) {
            const missing = present
                .map((result) => result.id)
                .filter((id) => !having.includes(id));
            differences.push(
                `${item}  (in ${having.join(', ')}; not in ${missing.join(
                    ', ',
                )})`,
            );
        }
    }
    return differences;
}

// Angular prints `▲ [WARNING]`, Next `⚠`; Next's own banner starts with `▲` too.
const BUILD_WARNING = /\[WARNING\]|⚠|\bwarning\b/i;

// ---------------------------------------------------------------------------
// Main

/**
 * Runs the check. `source` is `{ tarballs: Map<name, path> }` or
 * `{ version }`. Resolves to `{ failures, warnings }`; it throws only when
 * the check itself cannot run (no Chrome, a failed install or build).
 */
export async function checkConsumers({
    source,
    only,
    keep = false,
    log = console.log,
}) {
    const chromeBinary = findChrome();
    if (!chromeBinary) {
        throw new Error(
            'Chrome or Chromium is needed for the consumer check; set CHROME_PATH.',
        );
    }
    const version =
        source.version ?? tarballVersion(source.tarballs.get('lightgallery'));
    const apps = APPS.filter((app) => !only || app.id === only);
    if (apps.length === 0) throw new Error(`No consumer app called ${only}.`);
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lg-consumers-'));
    const photos = path.join(workDir, 'photos');
    writePhotos(photos);
    const axeSource = fs.readFileSync(
        path.join(rootDir, 'node_modules/axe-core/axe.min.js'),
        'utf8',
    );

    const servers = [];
    let chrome = null;
    const failures = [];
    const warnings = [];
    try {
        // Install, type check and build every app in parallel.
        await Promise.all(
            apps.map(async (app) => {
                const appDir = path.join(workDir, app.id);
                fs.cpSync(path.join(rootDir, app.dir), appDir, {
                    recursive: true,
                    filter: (src) =>
                        !/[\\/](node_modules|\.next|\.nuxt|\.output|\.angular|dist)$/.test(
                            src,
                        ),
                });
                fs.cpSync(photos, path.join(appDir, 'public', 'photos'), {
                    recursive: true,
                });
                pinPackages(appDir, source);
                const logFile = path.join(workDir, `${app.id}.log`);
                const install = await runAsync(
                    'npm',
                    ['install', '--no-audit', '--no-fund', '--loglevel=error'],
                    { cwd: appDir, logFile },
                );
                if (install.code !== 0) {
                    throw new Error(
                        `${
                            app.id
                        }: npm install failed (log: ${logFile})\n${install.output.slice(
                            -2000,
                        )}`,
                    );
                }
                const resolved = installedPackages(appDir);
                for (const entry of resolved) {
                    if (entry.version !== version) {
                        failures.push(
                            `${app.id}: resolved ${entry.name}@${entry.version} at ${entry.dir}, expected ${version}`,
                        );
                    }
                }
                const headlessCopies = resolved.filter(
                    (entry) => entry.name === HEADLESS,
                );
                // Two copies would split its module state (one license notice, one
                // registry); the vanilla build bundles it and installs none.
                if (headlessCopies.length > 1) {
                    failures.push(
                        `${app.id}: ${
                            headlessCopies.length
                        } copies of ${HEADLESS} (${headlessCopies
                            .map((entry) => entry.dir)
                            .join(', ')})`,
                    );
                }
                const declarations = await checkDeclarations(appDir, logFile);
                if (!declarations.ok) {
                    failures.push(
                        `${
                            app.id
                        }: the lightGallery declarations do not compile with skipLibCheck off\n${declarations.output
                            .trim()
                            .slice(0, 3000)}`,
                    );
                }
                const manifest = JSON.parse(
                    fs.readFileSync(path.join(appDir, 'package.json'), 'utf8'),
                );
                const scripts = (app.scripts ?? ['typecheck', 'build']).filter(
                    (script) => manifest.scripts[script],
                );
                for (const script of scripts) {
                    const run = await runAsync('npm', ['run', script], {
                        cwd: appDir,
                        logFile,
                    });
                    if (run.code !== 0) {
                        throw new Error(
                            `${
                                app.id
                            }: \`npm run ${script}\` failed (log: ${logFile})\n${run.output.slice(
                                -3000,
                            )}`,
                        );
                    }
                    for (const line of run.output.split('\n')) {
                        if (
                            BUILD_WARNING.test(line) &&
                            !/^npm warn/i.test(line.trim())
                        ) {
                            warnings.push(
                                `${app.id} ${script}: ${line.trim()}`,
                            );
                        }
                    }
                }
                log(
                    `${app.id}: installed, ${declarations.count} declaration entries compiled` +
                        (scripts.length
                            ? `, ${scripts.join(' and ')} passed`
                            : ''),
                );
            }),
        );

        // Serve every app, then drive each one.
        for (const app of apps) {
            const port = await freePort();
            const serve = app.serve ?? 'start';
            const args = app.serveArgs ? ['--', ...app.serveArgs(port)] : [];
            const child = spawn('npm', ['run', serve, ...args], {
                cwd: path.join(workDir, app.id),
                env: {
                    ...process.env,
                    ...QUIET_ENV,
                    PATH: cleanPath,
                    PORT: String(port),
                    NODE_ENV: serve === 'dev' ? 'development' : 'production',
                },
                shell: useShell,
                detached: !useShell,
                stdio: [
                    'ignore',
                    fs.openSync(
                        path.join(workDir, `${app.id}-server.log`),
                        'a',
                    ),
                    fs.openSync(
                        path.join(workDir, `${app.id}-server.log`),
                        'a',
                    ),
                ],
            });
            servers.push(child);
            app.baseUrl = `http://localhost:${port}/`;
            let ready = false;
            for (let i = 0; i < 300 && !ready; i++) {
                ready = await fetch(app.baseUrl).then(
                    (response) => response.status === 200,
                    () => false,
                );
                if (!ready) await sleep(200);
            }
            if (!ready)
                throw new Error(
                    `${app.id}: the server did not answer on ${app.baseUrl}`,
                );
        }

        chrome = await launchChrome(
            chromeBinary,
            path.join(workDir, 'chrome-profile'),
        );
        const results = [];
        for (const app of apps) {
            const result = { id: app.id, failures: [] };
            if (app.ssr !== false) {
                await checkServerHtml(app.baseUrl, result);
                if (app.triggerParity === false)
                    delete result.triggerAttributes;
            }
            await checkInBrowser(
                app,
                app.baseUrl,
                chrome.port,
                axeSource,
                workDir,
                result,
            );
            results.push(result);
            log(
                `${app.id}: ${
                    result.failures.length
                        ? `${result.failures.length} problem(s)`
                        : 'passed'
                }` +
                    ` (${
                        result.lightbox?.length ?? 0
                    } lightbox elements recorded)`,
            );
            failures.push(
                ...result.failures.map((failure) => `${app.id}: ${failure}`),
            );
            if (result.screenshot)
                failures.push(`${app.id}: screenshot ${result.screenshot}`);
        }
        for (const difference of parityDifferences(
            results,
            'triggerAttributes',
        )) {
            failures.push(`parity, trigger attribute: ${difference}`);
        }
        const lenient = new Set(
            apps
                .filter((app) => app.lightboxParity === 'warn')
                .map((app) => app.id),
        );
        const strict = results.filter((result) => !lenient.has(result.id));
        for (const difference of parityDifferences(strict, 'lightbox')) {
            failures.push(`parity, lightbox: ${difference}`);
        }
        for (const result of results.filter((entry) => lenient.has(entry.id))) {
            for (const difference of parityDifferences(
                [...strict, result],
                'lightbox',
            )) {
                warnings.push(`parity, ${result.id} lightbox: ${difference}`);
            }
        }
        if (apps.length > 1) log(`parity: compared ${results.length} apps`);
    } finally {
        chrome?.close();
        for (const child of servers) {
            try {
                process.kill(useShell ? child.pid : -child.pid);
            } catch {
                // already gone
            }
        }
        if (keep || failures.length) {
            log(`scratch folder kept: ${workDir}`);
        } else {
            fs.rmSync(workDir, { recursive: true, force: true });
        }
    }
    return { failures, warnings };
}

function parseArgs(argv) {
    const options = {};
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--tarballs') options.tarballs = argv[++i];
        else if (arg === '--version') options.version = argv[++i];
        else if (arg === '--only') options.only = argv[++i];
        else if (arg === '--keep') options.keep = true;
        else throw new Error(`Unknown option ${arg}.`);
    }
    return options;
}

async function main() {
    const options = parseArgs(process.argv.slice(2));
    let source;
    if (options.version) {
        source = { version: options.version };
    } else if (options.tarballs) {
        source = { tarballs: readTarballDir(path.resolve(options.tarballs)) };
    } else {
        const dir = fs.mkdtempSync(
            path.join(os.tmpdir(), 'lg-consumer-tarballs-'),
        );
        console.log(`Packing the current builds into ${dir}`);
        source = { tarballs: packWorkspace(dir) };
    }
    const packedDir =
        source.tarballs && !options.tarballs
            ? path.dirname(source.tarballs.get(HEADLESS))
            : null;
    const { failures, warnings } = await checkConsumers({ ...options, source });
    if (packedDir && !options.keep)
        fs.rmSync(packedDir, { recursive: true, force: true });
    for (const warning of warnings) console.log(`  ! ${warning}`);
    if (failures.length) {
        console.error(
            `\nConsumer check failed:\n${failures
                .map((failure) => `  x ${failure}`)
                .join('\n')}`,
        );
        process.exit(1);
    }
    console.log('\nConsumer check passed.');
}

if (
    process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    main().catch((error) => {
        console.error(`\nx ${error.message}`);
        process.exit(1);
    });
}
