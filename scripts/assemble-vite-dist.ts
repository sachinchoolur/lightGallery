/**
 * Assembles the publishable `dist/` folder after the Vite build.
 *
 * The package publishes with `dist/` as its root, as 2.x did, so the paths
 * a script-tag user writes stay `lightgallery/css/<name>.css` and
 * `lightgallery/plugins/<name>/lg-<name>.umd.js` on jsDelivr, unpkg and
 * cdnjs. The root package.json keeps `dist/` in its paths for the
 * workspace; this derives the published manifest from it by dropping that
 * prefix, copies the README and both license files beside it, and writes a manifest
 * into every plugin folder so resolvers that ignore the exports map (older
 * bundlers, TypeScript's node10 resolution) still find the plugin entries.
 */
import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

/** Root manifest fields the published manifest carries, in this order. */
const PUBLISHED_FIELDS = [
    'name',
    'version',
    'description',
    'keywords',
    'homepage',
    'bugs',
    'repository',
    'license',
    'author',
    'funding',
    'engines',
    'sideEffects',
    'main',
    'min',
    'module',
    'typings',
    'unpkg',
    'jsdelivr',
    'exports',
    'publishConfig',
];

/** Fields whose values are paths into the package. */
const PATH_FIELDS = new Set([
    'main',
    'min',
    'module',
    'typings',
    'unpkg',
    'jsdelivr',
    'exports',
]);

/** Files npm includes from the package root. */
const ROOT_FILES = ['README.md', 'LICENSE', 'LICENSE-COMMERCIAL.md'];

type Manifest = Record<string, unknown>;

function readJson(filePath: string): Manifest {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath: string, value: unknown): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function copyFile(source: string, destination: string): void {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
}

/** `./dist/css/*` becomes `./css/*`; `dist/lightgallery.umd.js` becomes `lightgallery.umd.js`. */
function stripDist(value: unknown): unknown {
    if (typeof value === 'string') {
        return value.replace(/^(\.\/)?dist\//, '$1');
    }
    if (Array.isArray(value)) {
        return value.map(stripDist);
    }
    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).map(([key, entry]) => [
                key,
                stripDist(entry),
            ]),
        );
    }
    return value;
}

function publishedManifest(root: Manifest): Manifest {
    const manifest: Manifest = {};
    for (const field of PUBLISHED_FIELDS) {
        if (field in root) {
            manifest[field] = PATH_FIELDS.has(field)
                ? stripDist(root[field])
                : root[field];
        }
    }
    return manifest;
}

/**
 * The manifest for one plugin folder, pointing at the entries the exports
 * map names for it, relative to that folder. The plugin bundles are
 * side-effect free like the rest of the package's JavaScript, which the
 * root manifest states and a nested manifest would otherwise override.
 */
function pluginManifest(pluginDir: string, entry: Manifest): Manifest {
    const relative = (target: unknown) =>
        typeof target === 'string'
            ? path.posix.relative(pluginDir, target.replace(/^\.\//, ''))
            : undefined;
    return {
        private: true,
        sideEffects: false,
        main: relative(entry.require),
        module: relative(entry.import),
        typings: relative(entry.types),
    };
}

function main(): void {
    const manifest = publishedManifest(
        readJson(path.resolve(rootDir, 'package.json')),
    );
    writeJson(path.resolve(distDir, 'package.json'), manifest);
    for (const file of ROOT_FILES) {
        copyFile(path.resolve(rootDir, file), path.resolve(distDir, file));
    }

    const exportsMap = manifest.exports as Record<string, Manifest>;
    for (const [subpath, entry] of Object.entries(exportsMap)) {
        const plugin = /^\.\/plugins\/([^/]+)$/.exec(subpath);
        if (plugin) {
            const pluginDir = path.posix.join('plugins', plugin[1]);
            writeJson(
                path.resolve(distDir, pluginDir, 'package.json'),
                pluginManifest(pluginDir, entry),
            );
        }
    }
}

main();
