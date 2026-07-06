import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const rootDir = path.resolve(__dirname, '..');
const legacyDir = path.resolve(rootDir, 'dist');
const viteDir = path.resolve(rootDir, 'dist-vite');
const sizeBudgetPercent = 15;

const excludedPathPrefixes = [
    'lib/',
    'react/',
    'vue/',
    'lit/',
    'angular/',
];

const excludedFiles = new Set(['package.json', 'README.md']);
const requiredAssetPathPrefixes = ['css/', 'fonts/', 'images/', 'scss/'];

interface BundleSize {
    path: string;
    legacyRaw: number;
    viteRaw: number;
    rawDeltaPercent: number;
    legacyGzip: number;
    viteGzip: number;
    gzipDeltaPercent: number;
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
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...walkFiles(fullPath));
        } else if (entry.isFile()) {
            files.push(fullPath);
        }
    }

    return files;
}

function listRelativeFiles(dir: string): string[] {
    return walkFiles(dir).map((filePath) => toRelativePath(dir, filePath));
}

function listContractFiles(dir: string, predicate: (file: string) => boolean): string[] {
    return listRelativeFiles(dir)
        .filter((file) => !isExcluded(file))
        .filter(predicate)
        .sort();
}

function normalizeLegacyDeclarationPath(file: string): string {
    return `types/${file}`;
}

function difference(left: string[], right: string[]): string[] {
    const rightSet = new Set(right);
    return left.filter((item) => !rightSet.has(item));
}

function formatList(title: string, items: string[]): string[] {
    if (items.length === 0) {
        return [];
    }

    return [title, ...items.map((item) => `  - ${item}`)];
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

function compareBundleSize(relativePath: string): BundleSize {
    const legacyPath = path.resolve(legacyDir, relativePath);
    const vitePath = path.resolve(viteDir, relativePath);
    const legacyRaw = fs.statSync(legacyPath).size;
    const viteRaw = fs.statSync(vitePath).size;
    const legacyGzip = gzipSize(legacyPath);
    const viteGzip = gzipSize(vitePath);

    return {
        path: relativePath,
        legacyRaw,
        viteRaw,
        rawDeltaPercent: percentDelta(legacyRaw, viteRaw),
        legacyGzip,
        viteGzip,
        gzipDeltaPercent: percentDelta(legacyGzip, viteGzip),
    };
}

function printSizeSummary(sizes: BundleSize[]): void {
    console.log('JS bundle size comparison:');
    sizes.forEach((size) => {
        console.log(
            [
                `  ${size.path}`,
                `raw ${size.legacyRaw} -> ${size.viteRaw} (${formatPercent(
                    size.rawDeltaPercent,
                )})`,
                `gzip ${size.legacyGzip} -> ${size.viteGzip} (${formatPercent(
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
    const legacyJs = listContractFiles(legacyDir, (file) => file.endsWith('.js'));
    const viteJs = listContractFiles(viteDir, (file) => file.endsWith('.js'));
    const missingJs = difference(legacyJs, viteJs);
    const extraJs = difference(viteJs, legacyJs);

    const legacyDeclarations = listContractFiles(legacyDir, (file) =>
        file.endsWith('.d.ts'),
    ).map(normalizeLegacyDeclarationPath);
    const viteDeclarations = listContractFiles(viteDir, (file) =>
        file.endsWith('.d.ts'),
    );
    const missingDeclarations = difference(legacyDeclarations, viteDeclarations);
    const extraDeclarations = difference(viteDeclarations, legacyDeclarations);
    const legacyAssets = listContractFiles(legacyDir, isRequiredAssetPath);
    const viteAssets = listContractFiles(viteDir, isRequiredAssetPath);
    const missingAssets = difference(legacyAssets, viteAssets);
    const extraAssets = difference(viteAssets, legacyAssets);

    const failures = [
        ...formatList('Missing JS bundles in dist-vite:', missingJs),
        ...formatList('Extra JS bundles in dist-vite:', extraJs),
        ...formatList('Missing declaration paths in dist-vite:', missingDeclarations),
        ...formatList('Extra declaration paths in dist-vite:', extraDeclarations),
        ...formatList('Missing CSS/asset paths in dist-vite:', missingAssets),
        ...formatList('Extra CSS/asset paths in dist-vite:', extraAssets),
    ];

    const matchedJs = legacyJs.filter((file) => viteJs.includes(file));
    const sizes = matchedJs.map(compareBundleSize);
    const sizeRegressions = sizes.filter((size) => {
        const minifiedRawRegression =
            size.path.endsWith('.min.js') &&
            size.rawDeltaPercent > sizeBudgetPercent;
        const gzipRegression = size.gzipDeltaPercent > sizeBudgetPercent;

        return minifiedRawRegression || gzipRegression;
    });

    printSizeSummary(sizes);

    if (sizeRegressions.length > 0) {
        failures.push(
            'Bundle size regressions over budget:',
            ...sizeRegressions.map(
                (size) =>
                    `  - ${size.path}: raw ${formatPercent(
                        size.rawDeltaPercent,
                    )}, gzip ${formatPercent(size.gzipDeltaPercent)}`,
            ),
        );
    }

    if (failures.length > 0) {
        console.error(failures.join('\n'));
        process.exit(1);
    }

    runSmokeImport();
    console.log('parity OK');
}

main();
