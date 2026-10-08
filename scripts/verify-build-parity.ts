import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import zlib from 'zlib';

/**
 * Release parity check: compares the freshly built `dist/` with the last
 * published `lightgallery` release, so nothing a consumer imports today
 * goes missing. The reference is the `latest` version on npm (or
 * `LG_PARITY_BASE=<version>`), fetched once with `npm pack` into the OS
 * temp directory.
 *
 * Fails on JS bundles, declaration files or CSS/asset paths the published
 * package has and this build lacks. New files are listed for information.
 * Bundle growth past the budget is a warning; `LG_PARITY_STRICT_SIZE=1`
 * turns it into a failure.
 */

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const sizeBudgetPercent = 15;
const strictSize = process.env.LG_PARITY_STRICT_SIZE === '1';

// The 2.x framework wrappers, dropped in 3.0 for the native packages.
const excludedPathPrefixes = ['lib/', 'react/', 'vue/', 'lit/', 'angular/'];

const excludedFiles = new Set(['package.json', 'README.md']);
// Paths 3.0 drops on purpose: the icon font (icons are inline SVG now) and
// the video URL helpers, which moved into @lightgallery/headless.
const removedOnPurpose = new Set([
    'scss/_lg-fonts.scss',
    'types/plugins/video/lg-video-utils.d.ts',
]);
const requiredAssetPathPrefixes = ['css/', 'images/', 'scss/'];

interface BundleSize {
    path: string;
    baseRaw: number;
    distRaw: number;
    rawDeltaPercent: number;
    baseGzip: number;
    distGzip: number;
    gzipDeltaPercent: number;
}

// The workspace hoists an old npm (a semantic-release dependency) into
// node_modules/.bin, which `pnpm run` puts first on PATH; the registry
// calls need the real npm.
const cleanPath = (process.env.PATH || '')
    .split(path.delimiter)
    .filter((entry) => !entry.includes(`node_modules${path.sep}.bin`))
    .join(path.delimiter);

function run(command: string, args: string[], cwd: string): string {
    const result = spawnSync(command, args, {
        cwd,
        encoding: 'utf8',
        env: { ...process.env, PATH: cleanPath },
    });
    if (result.status !== 0) {
        throw new Error(
            `${command} ${args.join(' ')} failed: ${
                result.stderr || result.stdout
            }`,
        );
    }
    return result.stdout.trim();
}

/** The published package to compare with, extracted to `<tmp>/package`. */
function fetchBaseline(): { version: string; dir: string } {
    const version =
        process.env.LG_PARITY_BASE ||
        run('npm', ['view', 'lightgallery', 'version'], rootDir);
    const cacheDir = path.join(os.tmpdir(), 'lightgallery-parity', version);
    const packageDir = path.join(cacheDir, 'package');
    if (!fs.existsSync(path.join(packageDir, 'package.json'))) {
        fs.mkdirSync(cacheDir, { recursive: true });
        run(
            'npm',
            ['pack', `lightgallery@${version}`, '--pack-destination', cacheDir],
            rootDir,
        );
        const tarball = fs
            .readdirSync(cacheDir)
            .find((file) => file.endsWith('.tgz'));
        if (!tarball) {
            throw new Error(`npm pack left no tarball in ${cacheDir}`);
        }
        run(
            'tar',
            ['-xzf', path.join(cacheDir, tarball), '-C', cacheDir],
            rootDir,
        );
    }
    return { version, dir: packageDir };
}

function toRelativePath(baseDir: string, filePath: string): string {
    return path.relative(baseDir, filePath).split(path.sep).join('/');
}

function isExcluded(relativePath: string): boolean {
    return (
        excludedFiles.has(relativePath) ||
        excludedPathPrefixes.some((prefix) => relativePath.startsWith(prefix))
    );
}

function isRequiredAssetPath(relativePath: string): boolean {
    return requiredAssetPathPrefixes.some((prefix) =>
        relativePath.startsWith(prefix),
    );
}

function walkFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) {
        return [];
    }
    const files: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...walkFiles(fullPath));
        } else if (entry.isFile()) {
            files.push(fullPath);
        }
    }
    return files;
}

function listContractFiles(
    dir: string,
    predicate: (file: string) => boolean,
): string[] {
    return walkFiles(dir)
        .map((filePath) => toRelativePath(dir, filePath))
        .filter((file) => !isExcluded(file))
        .filter(predicate)
        .sort();
}

/** 2.x shipped declarations beside the bundles; 3.0 keeps them in types/. */
function normalizeDeclarationPath(file: string): string {
    return file.startsWith('types/') ? file : `types/${file}`;
}

function difference(left: string[], right: string[]): string[] {
    const rightSet = new Set(right);
    return left.filter((item) => !rightSet.has(item));
}

function missing(base: string[], dist: string[]): string[] {
    return difference(base, dist).filter((item) => !removedOnPurpose.has(item));
}

function formatList(title: string, items: string[]): string[] {
    return items.length === 0
        ? []
        : [title, ...items.map((item) => `  - ${item}`)];
}

function percentDelta(previous: number, next: number): number {
    if (previous === 0) {
        return next === 0 ? 0 : Infinity;
    }
    return ((next - previous) / previous) * 100;
}

function gzipSize(filePath: string): number {
    return zlib.gzipSync(fs.readFileSync(filePath)).length;
}

function formatPercent(value: number): string {
    if (!Number.isFinite(value)) {
        return 'Infinity';
    }
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function compareBundleSize(baseDir: string, relativePath: string): BundleSize {
    const basePath = path.resolve(baseDir, relativePath);
    const distPath = path.resolve(distDir, relativePath);
    const baseRaw = fs.statSync(basePath).size;
    const distRaw = fs.statSync(distPath).size;
    const baseGzip = gzipSize(basePath);
    const distGzip = gzipSize(distPath);
    return {
        path: relativePath,
        baseRaw,
        distRaw,
        rawDeltaPercent: percentDelta(baseRaw, distRaw),
        baseGzip,
        distGzip,
        gzipDeltaPercent: percentDelta(baseGzip, distGzip),
    };
}

function printSizeSummary(version: string, sizes: BundleSize[]): void {
    console.log(`JS bundle sizes, lightgallery@${version} -> dist:`);
    sizes.forEach((size) => {
        console.log(
            [
                `  ${size.path}`,
                `raw ${size.baseRaw} -> ${size.distRaw} (${formatPercent(
                    size.rawDeltaPercent,
                )})`,
                `gzip ${size.baseGzip} -> ${size.distGzip} (${formatPercent(
                    size.gzipDeltaPercent,
                )})`,
            ].join(' | '),
        );
    });
}

function runSmokeImport(): void {
    const result = spawnSync(process.execPath, ['scripts/smoke-import.mjs'], {
        cwd: rootDir,
        stdio: 'inherit',
    });
    if (result.status !== 0) {
        throw new Error(
            `smoke import failed with exit code ${result.status ?? 'unknown'}`,
        );
    }
}

function main(): void {
    if (!fs.existsSync(path.join(distDir, 'lightgallery.umd.js'))) {
        throw new Error('dist/ is not built; run `npm run build` first');
    }
    const base = fetchBaseline();

    const isJs = (file: string) => file.endsWith('.js');
    const isDeclaration = (file: string) => file.endsWith('.d.ts');
    const baseJs = listContractFiles(base.dir, isJs);
    const distJs = listContractFiles(distDir, isJs);
    const baseDeclarations = listContractFiles(base.dir, isDeclaration).map(
        normalizeDeclarationPath,
    );
    const distDeclarations = listContractFiles(distDir, isDeclaration);
    const baseAssets = listContractFiles(base.dir, isRequiredAssetPath);
    const distAssets = listContractFiles(distDir, isRequiredAssetPath);

    const failures = [
        ...formatList('Missing JS bundles in dist:', missing(baseJs, distJs)),
        ...formatList(
            'Missing declaration paths in dist:',
            missing(baseDeclarations, distDeclarations),
        ),
        ...formatList(
            'Missing CSS/asset paths in dist:',
            missing(baseAssets, distAssets),
        ),
    ];
    const additions = [
        ...formatList('New JS bundles:', difference(distJs, baseJs)),
        ...formatList(
            'New declaration paths:',
            difference(distDeclarations, baseDeclarations),
        ),
        ...formatList(
            'New CSS/asset paths:',
            difference(distAssets, baseAssets),
        ),
    ];
    if (additions.length > 0) {
        console.log(additions.join('\n'));
    }

    const sizes = baseJs
        .filter((file) => distJs.includes(file))
        .map((file) => compareBundleSize(base.dir, file));
    printSizeSummary(base.version, sizes);
    const overBudget = sizes.filter(
        (size) =>
            (size.path.endsWith('.min.js') &&
                size.rawDeltaPercent > sizeBudgetPercent) ||
            size.gzipDeltaPercent > sizeBudgetPercent,
    );
    if (overBudget.length > 0) {
        const lines = [
            `Bundles grown more than ${sizeBudgetPercent}% since ${base.version}:`,
            ...overBudget.map(
                (size) =>
                    `  - ${size.path}: raw ${formatPercent(
                        size.rawDeltaPercent,
                    )}, gzip ${formatPercent(size.gzipDeltaPercent)}`,
            ),
        ];
        if (strictSize) {
            failures.push(...lines);
        } else {
            console.warn(lines.join('\n'));
        }
    }

    if (failures.length > 0) {
        console.error(failures.join('\n'));
        process.exit(1);
    }

    runSmokeImport();
    console.log(`parity OK against lightgallery@${base.version}`);
}

main();
