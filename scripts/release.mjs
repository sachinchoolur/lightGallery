#!/usr/bin/env node
/**
 * Release tool. The five packages (`lightgallery` and
 * `@lightgallery/{headless,react,vue,angular}`) always ship together under
 * one version.
 *
 *   npm run release:bump <version>  set the version everywhere, rebuild dist
 *   npm run release:check           run every verification, publish nothing
 *   npm run release                 verify, publish, move dist-tags, tag the
 *                                   commit, create the GitHub release
 *   npm run release:github          create the GitHub release for a version
 *                                   that is already published and tagged
 *
 * Options (after `--`, e.g. `npm run release -- --skip-ci`):
 *   --tag <name>   dist-tag to publish under (default: `next` for a
 *                  prerelease, `latest` for a stable version)
 *   --skip-tests   skip typecheck, lint and the test suites
 *   --skip-ci      skip the check that CI passed on the release commit
 *   --skip-consumers  skip building and driving the consumer apps
 *   --yes          publish without the confirmation prompt
 *
 * A release uploads the exact tarballs the verification inspected and
 * installed. Run again after a failure: packages already on the registry
 * are skipped.
 *
 * The GitHub release takes its notes from the version's section in
 * CHANGELOG.md and needs a token with write access to the repository:
 * `GITHUB_TOKEN`, or the GitHub CLI's login (`gh auth token`).
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { builtinModules } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

import { checkConsumers } from './check-consumers.mjs';
import { HEADLESS, PACKAGES } from './release-packages.mjs';

const rootDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
);

// Installed beside the tarballs so the framework entries can be imported.
const CONSUMER_PEERS = ['react@^19', 'react-dom@^19', 'vue@^3'];

const MIN_NODE = [20, 19];
const useShell = process.platform === 'win32';

// The workspace hoists an old npm into node_modules/.bin, which `pnpm run`
// puts first on PATH; registry and pack calls need the real one.
const cleanPath = (process.env.PATH || '')
    .split(path.delimiter)
    .filter((entry) => !entry.includes(`node_modules${path.sep}.bin`))
    .join(path.delimiter);

class ReleaseError extends Error {}

const warnings = [];

function fail(message) {
    throw new ReleaseError(message);
}

function warn(message) {
    warnings.push(message);
    console.log(`  ! ${message}`);
}

function info(message) {
    console.log(`  ${message}`);
}

async function step(title, fn) {
    console.log(`\n> ${title}`);
    return fn();
}

/** Runs a command. Captured output is returned trimmed; otherwise it streams. */
function run(command, args, options = {}) {
    const { cwd = rootDir, capture = false, allowFailure = false } = options;
    const result = spawnSync(command, args, {
        cwd,
        env: { ...process.env, PATH: cleanPath },
        shell: useShell,
        stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
        encoding: capture ? options.encoding ?? 'utf8' : undefined,
        maxBuffer: 256 * 1024 * 1024,
    });
    if (result.error) {
        fail(`Could not run ${command}: ${result.error.message}`);
    }
    if (result.status !== 0 && !allowFailure) {
        const output = capture
            ? `\n${String(result.stderr || result.stdout).trim()}`
            : '';
        fail(`\`${command} ${args.join(' ')}\` failed.${output}`);
    }
    if (!capture) {
        return result.status === 0;
    }
    if (result.status !== 0) {
        return null;
    }
    return options.raw ? String(result.stdout) : String(result.stdout).trim();
}

const git = (...args) => run('git', args, { capture: true });

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function manifestPath(pkg) {
    return path.join(rootDir, pkg.dir, 'package.json');
}

// ---------------------------------------------------------------------------
// Versions

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

function parseVersion(version) {
    const match = SEMVER.exec(version);
    if (!match) {
        return null;
    }
    return {
        core: [Number(match[1]), Number(match[2]), Number(match[3])],
        pre: match[4] ? match[4].split('.') : [],
    };
}

const isPrerelease = (version) => version.includes('-');

/** Semver precedence: negative when `a` is older than `b`. */
function compareVersions(a, b) {
    const left = parseVersion(a);
    const right = parseVersion(b);
    for (let i = 0; i < 3; i++) {
        if (left.core[i] !== right.core[i]) {
            return left.core[i] - right.core[i];
        }
    }
    if (left.pre.length === 0 || right.pre.length === 0) {
        return right.pre.length - left.pre.length;
    }
    for (let i = 0; i < Math.max(left.pre.length, right.pre.length); i++) {
        const l = left.pre[i];
        const r = right.pre[i];
        if (l === undefined || r === undefined) {
            return l === undefined ? -1 : 1;
        }
        if (l === r) {
            continue;
        }
        const numeric = /^\d+$/;
        if (numeric.test(l) && numeric.test(r)) {
            return Number(l) - Number(r);
        }
        if (numeric.test(l) !== numeric.test(r)) {
            return numeric.test(l) ? -1 : 1;
        }
        return l < r ? -1 : 1;
    }
    return 0;
}

function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// Registry and CI

/** Fetches JSON; a status listed in `missing` yields null. */
async function fetchJson(url, headers, missing = [404]) {
    let response;
    try {
        response = await fetch(url, { headers });
    } catch (error) {
        fail(`Could not reach ${new URL(url).host}: ${error.message}`);
    }
    if (missing.includes(response.status)) {
        return null;
    }
    if (!response.ok) {
        fail(`${url} answered HTTP ${response.status}.`);
    }
    return response.json();
}

// Registry state is read from the per-version and dist-tags documents. The
// package document is served from a cache for five minutes, so it keeps
// showing the state from before an upload.
const REGISTRY = 'https://registry.npmjs.org';
const registryPath = (name) => name.replace('/', '%2f');

/** The manifest the registry serves for `name@version`, or null. */
function publishedVersion(name, version) {
    return fetchJson(`${REGISTRY}/${registryPath(name)}/${version}`);
}

async function distTags(name) {
    const tags = await fetchJson(
        `${REGISTRY}/-/package/${registryPath(name)}/dist-tags`,
        undefined,
        // 401: the registry's answer for a package that does not exist.
        [401, 404],
    );
    return tags ?? {};
}

const REGISTRY_WAIT_MINUTES = 10;

/** Polls until the registry serves `name@version`; returns its manifest. */
async function waitForVersion(name, version) {
    const deadline = Date.now() + REGISTRY_WAIT_MINUTES * 60 * 1000;
    let announced = false;
    while (Date.now() < deadline) {
        const manifest = await publishedVersion(name, version);
        if (manifest) {
            return manifest;
        }
        if (!announced) {
            info(
                'waiting for the registry to process the upload; this can take a few minutes',
            );
            announced = true;
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    return fail(
        `${name}@${version} was uploaded but the registry is not serving it after ${REGISTRY_WAIT_MINUTES} minutes. Check \`npm view ${name}@${version} version\`, then run the release again: packages already on the registry are skipped.`,
    );
}

function repoSlug() {
    const url = readJson(path.join(rootDir, 'package.json')).repository?.url;
    const match = /github\.com[/:]([^/]+\/[^/.]+)/.exec(url ?? '');
    if (!match) {
        fail('package.json has no GitHub repository URL to read CI from.');
    }
    return match[1];
}

async function assertCiPassed(sha) {
    const headers = {
        accept: 'application/vnd.github+json',
        'user-agent': 'lightgallery-release',
    };
    if (process.env.GITHUB_TOKEN) {
        headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const slug = repoSlug();
    const body = await fetchJson(
        `https://api.github.com/repos/${slug}/commits/${sha}/check-runs?per_page=100`,
        headers,
        // 422: GitHub has never seen the commit.
        [404, 422],
    );
    const runs = body?.check_runs ?? [];
    const page = `https://github.com/${slug}/commit/${sha}/checks`;
    if (runs.length === 0) {
        fail(
            `No CI run found for ${sha.slice(
                0,
                8,
            )}. Push the commit to a branch CI builds, or pass --skip-ci. ${page}`,
        );
    }
    const pending = runs.filter((entry) => entry.status !== 'completed');
    if (pending.length > 0) {
        fail(
            `CI is still running (${pending
                .map((entry) => entry.name)
                .join(', ')}). Wait for it, or pass --skip-ci. ${page}`,
        );
    }
    const passing = new Set(['success', 'skipped', 'neutral']);
    const failed = runs.filter((entry) => !passing.has(entry.conclusion));
    if (failed.length > 0) {
        fail(
            `CI failed on ${sha.slice(0, 8)}: ${failed
                .map((entry) => `${entry.name} (${entry.conclusion})`)
                .join(', ')}. ${page}`,
        );
    }
    info(`${runs.length} CI jobs passed on ${sha.slice(0, 8)}`);
}

// ---------------------------------------------------------------------------
// GitHub release

/** The CHANGELOG.md section under the version's stable heading, as notes. */
function releaseNotes(version) {
    const core = parseVersion(version).core.join('.');
    const heading = new RegExp(`^## ${escapeRegExp(core)}\\b`);
    const lines = fs
        .readFileSync(path.join(rootDir, 'CHANGELOG.md'), 'utf8')
        .split('\n');
    const start = lines.findIndex((line) => heading.test(line));
    if (start === -1) {
        fail(
            `CHANGELOG.md has no "## ${core}" section to use as the release notes.`,
        );
    }
    let end = lines.findIndex((line, i) => i > start && /^## /.test(line));
    if (end === -1) {
        end = lines.length;
    }
    const notes = lines
        .slice(start + 1, end)
        .join('\n')
        .trim();
    if (!notes) {
        fail(`The "## ${core}" section of CHANGELOG.md is empty.`);
    }
    return notes;
}

/** `GITHUB_TOKEN`, or the GitHub CLI's token when it is signed in. */
function githubToken() {
    if (process.env.GITHUB_TOKEN) {
        return process.env.GITHUB_TOKEN;
    }
    try {
        return run('gh', ['auth', 'token'], {
            capture: true,
            allowFailure: true,
        });
    } catch {
        return null;
    }
}

/**
 * Creates the GitHub release for `version` from `notes`; a prerelease is
 * marked as one and does not become the repository's latest release. Does
 * nothing when the release already exists. A missing token or a refused
 * request is a warning unless `strict`, because by then the packages are
 * on the registry.
 */
async function createGitHubRelease(version, notes, strict = false) {
    const slug = repoSlug();
    const page = `https://github.com/${slug}/releases`;
    const report = strict ? fail : warn;
    const token = githubToken();
    if (!token) {
        report(
            `No GitHub token: set GITHUB_TOKEN or run \`gh auth login\`, then \`npm run release:github\`. ${page}`,
        );
        return;
    }
    const headers = {
        accept: 'application/vnd.github+json',
        'user-agent': 'lightgallery-release',
        authorization: `Bearer ${token}`,
    };
    const api = `https://api.github.com/repos/${slug}/releases`;
    const existing = await fetchJson(`${api}/tags/${version}`, headers);
    if (existing) {
        info(`release ${version} already exists: ${existing.html_url}`);
        return;
    }
    let response;
    try {
        response = await fetch(api, {
            method: 'POST',
            headers: { ...headers, 'content-type': 'application/json' },
            body: JSON.stringify({
                tag_name: version,
                name: version,
                body: notes,
                prerelease: isPrerelease(version),
                make_latest: isPrerelease(version) ? 'false' : 'true',
            }),
        });
    } catch (error) {
        report(`Could not reach api.github.com: ${error.message}. ${page}`);
        return;
    }
    if (!response.ok) {
        const text = (await response.text()).slice(0, 200);
        report(
            `GitHub refused the release (HTTP ${response.status}): ${text}. Run \`npm run release:github\` once fixed. ${page}`,
        );
        return;
    }
    const created = await response.json();
    info(`created ${created.html_url}`);
}

// ---------------------------------------------------------------------------
// Git

// The dist banner carries the build date, so a rebuild on another day
// rewrites every bundle without changing a line of code.
const BANNER_DATE = /\| [A-Z][a-z]+ \d{1,2}(?:st|nd|rd|th) \d{4}/g;

function sameApartFromBannerDate(file) {
    const committed = spawnSync('git', ['show', `HEAD:${file}`], {
        cwd: rootDir,
        maxBuffer: 256 * 1024 * 1024,
    });
    const working = path.join(rootDir, file);
    if (committed.status !== 0 || !fs.existsSync(working)) {
        return false;
    }
    const normalize = (buffer) =>
        buffer.toString('latin1').replace(BANNER_DATE, '| DATE');
    return normalize(committed.stdout) === normalize(fs.readFileSync(working));
}

/** Paths that differ from HEAD, ignoring dist files that only changed their banner date. */
function dirtyPaths() {
    const entries = run(
        'git',
        ['status', '--porcelain', '-z', '--untracked-files=all'],
        // Untrimmed: an entry starts with its two status columns, either
        // of which may be a space.
        { capture: true, raw: true },
    )
        .split('\0')
        .filter(Boolean);
    const dirty = [];
    for (let i = 0; i < entries.length; i++) {
        const status = entries[i].slice(0, 2);
        const file = entries[i].slice(3);
        if (status.includes('R') || status.includes('C')) {
            i++; // the entry that follows is the path it was renamed from
        }
        const modifiedOnly = /^[ M]{2}$/.test(status);
        if (
            modifiedOnly &&
            file.startsWith('dist/') &&
            sameApartFromBannerDate(file)
        ) {
            continue;
        }
        dirty.push(file);
    }
    return dirty;
}

function listed(paths) {
    const shown = paths.slice(0, 12).map((file) => `\n    ${file}`);
    const more =
        paths.length > 12 ? `\n    ... and ${paths.length - 12} more` : '';
    return shown.join('') + more;
}

function assertGitReady(version) {
    const dirty = dirtyPaths();
    if (dirty.length > 0) {
        fail(
            `The working tree has uncommitted changes. Commit or stash them; a release is built from a commit.${listed(
                dirty,
            )}`,
        );
    }
    const upstream = run(
        'git',
        ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'],
        { capture: true, allowFailure: true },
    );
    if (!upstream) {
        fail(
            'The current branch has no upstream. Push it first (`git push -u origin <branch>`).',
        );
    }
    const remote = upstream.split('/')[0];
    run('git', ['fetch', '--quiet', '--tags', remote]);
    const head = git('rev-parse', 'HEAD');
    if (head !== git('rev-parse', '@{u}')) {
        const ahead = git('rev-list', '--count', '@{u}..HEAD');
        const behind = git('rev-list', '--count', 'HEAD..@{u}');
        fail(
            `HEAD is not what ${upstream} has (${ahead} commit(s) not pushed, ${behind} not pulled). Push or pull first.`,
        );
    }
    const localTag = run(
        'git',
        ['rev-parse', '-q', '--verify', `refs/tags/${version}^{commit}`],
        { capture: true, allowFailure: true },
    );
    if (localTag && localTag !== head) {
        fail(
            `Tag ${version} already exists and points at ${localTag.slice(
                0,
                8,
            )}, not at HEAD.`,
        );
    }
    const remoteTag = remoteTagCommit(remote, version);
    if (remoteTag && remoteTag !== head) {
        fail(
            `Tag ${version} on ${remote} points at ${remoteTag.slice(
                0,
                8,
            )}, not at HEAD.`,
        );
    }
    info(`clean tree, ${head.slice(0, 8)} is on ${upstream}`);
    return {
        head,
        remote,
        tagged: Boolean(localTag),
        tagPushed: Boolean(remoteTag),
    };
}

function remoteTagCommit(remote, version) {
    const lines = git('ls-remote', '--tags', remote, `refs/tags/${version}*`)
        .split('\n')
        .map((line) => line.split('\t'))
        .filter(
            ([, ref]) =>
                ref === `refs/tags/${version}` ||
                ref === `refs/tags/${version}^{}`,
        );
    // An annotated tag lists its commit on the peeled `^{}` line.
    const peeled = lines.find(([, ref]) => ref.endsWith('^{}'));
    return (peeled ?? lines[0])?.[0] ?? null;
}

// ---------------------------------------------------------------------------
// Manifests

function readReleaseVersion() {
    const manifests = PACKAGES.map((pkg) => ({
        pkg,
        manifest: readJson(manifestPath(pkg)),
    }));
    const versions = new Set(manifests.map(({ manifest }) => manifest.version));
    if (versions.size !== 1) {
        fail(
            `The packages are not on one version:${manifests
                .map(
                    ({ pkg, manifest }) =>
                        `\n    ${pkg.name} ${manifest.version}`,
                )
                .join('')}\n  Run \`npm run release:bump <version>\`.`,
        );
    }
    const [version] = versions;
    if (!parseVersion(version)) {
        fail(`"${version}" is not a semver version.`);
    }
    for (const { pkg, manifest } of manifests) {
        if (manifest.name !== pkg.name) {
            fail(
                `${pkg.dir}/package.json is named ${manifest.name}, expected ${pkg.name}.`,
            );
        }
        if (manifest.private) {
            fail(`${pkg.name} is marked private.`);
        }
        const range = manifest.dependencies?.[HEADLESS];
        const expected =
            pkg.headless === 'caret'
                ? [`^${version}`]
                : ['workspace:*', version];
        if (pkg.headless && !expected.includes(range)) {
            fail(
                `${pkg.name} depends on ${HEADLESS} "${range}", expected "${expected[0]}".`,
            );
        }
    }
    const changelog = fs.readFileSync(
        path.join(rootDir, 'CHANGELOG.md'),
        'utf8',
    );
    if (!changelog.includes(version)) {
        fail(`CHANGELOG.md does not mention ${version}.`);
    }
    const unreleased = new RegExp(
        `^## ${escapeRegExp(version)} \\(unreleased\\)`,
        'm',
    );
    if (!isPrerelease(version) && unreleased.test(changelog)) {
        fail(`CHANGELOG.md still marks ${version} as unreleased.`);
    }
    info(`all ${PACKAGES.length} packages are on ${version}`);
    return version;
}

function resolveTag(version, requested) {
    const tag = requested ?? (isPrerelease(version) ? 'next' : 'latest');
    if (isPrerelease(version) && tag === 'latest') {
        fail(
            `${version} is a prerelease; publishing it as "latest" would hand it to every plain install. Use --tag next.`,
        );
    }
    return tag;
}

function assertTooling() {
    const [major, minor] = process.versions.node.split('.').map(Number);
    if (major < MIN_NODE[0] || (major === MIN_NODE[0] && minor < MIN_NODE[1])) {
        fail(
            `Node ${MIN_NODE.join(
                '.',
            )} or newer is needed to verify the packed entries (this is ${
                process.versions.node
            }).`,
        );
    }
    const wanted = /^pnpm@(.+)$/.exec(
        readJson(path.join(rootDir, 'package.json')).packageManager ?? '',
    )?.[1];
    const actual = run('pnpm', ['--version'], { capture: true });
    if (wanted && actual !== wanted) {
        warn(
            `pnpm ${actual} is in use; the repo pins ${wanted} (\`corepack enable\` selects it).`,
        );
    }
    info(`node ${process.versions.node}, pnpm ${actual}`);
}

// ---------------------------------------------------------------------------
// Build and test

function install() {
    run('pnpm', ['install', '--frozen-lockfile']);
}

function buildAll() {
    run('npm', ['run', 'build']);
    for (const pkg of PACKAGES.filter((entry) => entry.dir !== '.')) {
        run('pnpm', ['--filter', pkg.name, 'run', 'build']);
    }
    const dirty = dirtyPaths();
    if (dirty.length > 0) {
        fail(
            `The build changed tracked files, so the commit does not hold what would be published. Commit the rebuilt output and release from that commit.${listed(
                dirty,
            )}`,
        );
    }
    info('the committed dist/ matches this build');
}

function runQualityGates() {
    run('npm', ['run', 'typecheck']);
    run('npm', ['run', 'lint']);
    run('npm', ['test']);
    for (const pkg of PACKAGES.filter((entry) => entry.dir !== '.')) {
        run('pnpm', ['--filter', pkg.name, 'run', 'typecheck']);
        run('pnpm', ['--filter', pkg.name, 'run', 'lint']);
        run('pnpm', ['--filter', pkg.name, 'run', 'test']);
    }
    // Nothing the last stable `lightgallery` shipped may go missing.
    run('npm', ['run', 'verify:parity']);
}

// ---------------------------------------------------------------------------
// Tarballs

function pack(workDir) {
    const tarballDir = path.join(workDir, 'tarballs');
    fs.mkdirSync(tarballDir, { recursive: true });
    const tarballs = new Map();
    for (const pkg of PACKAGES) {
        const before = new Set(fs.readdirSync(tarballDir));
        if (pkg.packDir) {
            run('npm', ['pack', '--pack-destination', tarballDir], {
                cwd: path.join(rootDir, pkg.packDir),
                capture: true,
            });
        } else {
            // pnpm rewrites `workspace:` ranges and applies publishConfig.
            run('pnpm', ['pack', '--pack-destination', tarballDir], {
                cwd: path.join(rootDir, pkg.dir),
                capture: true,
            });
        }
        const created = fs
            .readdirSync(tarballDir)
            .filter((file) => file.endsWith('.tgz') && !before.has(file));
        if (created.length !== 1) {
            fail(`Packing ${pkg.name} produced ${created.length} tarballs.`);
        }
        tarballs.set(pkg.name, path.join(tarballDir, created[0]));
        info(created[0]);
    }
    return tarballs;
}

function listFiles(dir, base = dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory()
            ? listFiles(full, base)
            : [path.relative(base, full).split(path.sep).join('/')];
    });
}

/** Every file path the manifest points a consumer at. */
function entryTargets(manifest) {
    const targets = [];
    for (const field of [
        'main',
        'module',
        'types',
        'typings',
        'unpkg',
        'jsdelivr',
    ]) {
        if (typeof manifest[field] === 'string') {
            targets.push(manifest[field]);
        }
    }
    const walk = (node) => {
        if (typeof node === 'string') {
            targets.push(node);
        } else if (node && typeof node === 'object') {
            Object.values(node).forEach(walk);
        }
    };
    walk(manifest.exports);
    return targets.map((target) => target.replace(/^\.\//, ''));
}

const IMPORT_PATTERNS = [
    /\bfrom\s*['"]([^'"\n]+)['"]/g,
    /\bimport\s*['"]([^'"\n]+)['"]/g,
    /\b(?:import|require)\s*\(\s*['"]([^'"\n]+)['"]\s*\)/g,
];
const PACKAGE_SPECIFIER =
    /^(@[a-z0-9~-][a-z0-9._~-]*\/)?[a-z0-9~-][a-z0-9._~-]*(\/|$)/;

/** Bare specifiers a file imports, comments left out. */
function importedPackages(source) {
    const code = source
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
    const found = new Set();
    for (const pattern of IMPORT_PATTERNS) {
        for (const [, specifier] of code.matchAll(pattern)) {
            if (
                specifier.startsWith('node:') ||
                !PACKAGE_SPECIFIER.test(specifier)
            ) {
                continue;
            }
            const parts = specifier.split('/');
            found.add(
                specifier.startsWith('@')
                    ? parts.slice(0, 2).join('/')
                    : parts[0],
            );
        }
    }
    return found;
}

function inspectTarball(pkg, tarball, version, workDir) {
    const dir = path.join(workDir, 'unpacked', pkg.name.replace('/', '__'));
    fs.mkdirSync(dir, { recursive: true });
    run('tar', ['-xzf', tarball, '-C', dir], { capture: true });
    const packageDir = path.join(dir, 'package');
    const manifest = readJson(path.join(packageDir, 'package.json'));
    const files = listFiles(packageDir);
    const fileSet = new Set(files);
    const problems = [];

    if (manifest.name !== pkg.name) {
        problems.push(`is named ${manifest.name}`);
    }
    if (manifest.version !== version) {
        problems.push(`carries version ${manifest.version}, not ${version}`);
    }
    if (manifest.private) {
        problems.push('is marked private');
    }
    if (!manifest.license) {
        problems.push('has no license field');
    }
    if (!fileSet.has('README.md')) {
        problems.push('has no README.md');
    }
    if (!fileSet.has('LICENSE')) {
        problems.push('has no LICENSE');
    }
    if (
        /LicenseRef-Commercial/.test(manifest.license ?? '') &&
        !fileSet.has('LICENSE-COMMERCIAL.md')
    ) {
        problems.push(
            'declares LicenseRef-Commercial but ships no LICENSE-COMMERCIAL.md',
        );
    }
    for (const field of [
        'dependencies',
        'peerDependencies',
        'optionalDependencies',
        'devDependencies',
    ]) {
        for (const [name, range] of Object.entries(manifest[field] ?? {})) {
            if (/^(workspace|link|file):/.test(range)) {
                problems.push(
                    `${field}.${name} is "${range}", which no registry install can resolve`,
                );
            }
        }
    }
    if (pkg.headless) {
        const expected = pkg.headless === 'caret' ? `^${version}` : version;
        const range = manifest.dependencies?.[HEADLESS];
        if (range !== expected) {
            problems.push(
                `depends on ${HEADLESS} "${range}", expected "${expected}"`,
            );
        }
    }

    for (const target of entryTargets(manifest)) {
        if (target.includes('*')) {
            const pattern = new RegExp(
                `^${target.split('*').map(escapeRegExp).join('.+')}$`,
            );
            if (!files.some((file) => pattern.test(file))) {
                problems.push(`points at ${target}, which matches no file`);
            }
        } else if (!fileSet.has(target)) {
            problems.push(`points at ${target}, which is not in the tarball`);
        }
    }

    const declared = new Set([
        pkg.name,
        ...Object.keys(manifest.dependencies ?? {}),
        ...Object.keys(manifest.peerDependencies ?? {}),
        ...Object.keys(manifest.optionalDependencies ?? {}),
        ...builtinModules,
    ]);
    const undeclared = new Map();
    for (const file of files) {
        if (!/\.(d\.[cm]?ts|[cm]?js)$/.test(file) || file.endsWith('.min.js')) {
            continue;
        }
        const source = fs.readFileSync(path.join(packageDir, file), 'utf8');
        for (const name of importedPackages(source)) {
            if (!declared.has(name) && !undeclared.has(name)) {
                undeclared.set(name, file);
            }
        }
    }
    for (const [name, file] of undeclared) {
        problems.push(
            `imports "${name}" (${file}) without declaring it as a dependency`,
        );
    }

    if (pkg.name === 'lightgallery') {
        const bundle = fs.readFileSync(
            path.join(packageDir, manifest.main),
            'utf8',
        );
        if (!bundle.includes(`lightgallery | ${version} |`)) {
            problems.push(
                `dist banner does not say ${version}; the bundles were built before the version bump`,
            );
        }
    }

    if (problems.length > 0) {
        fail(
            `${path.basename(tarball)}:${problems
                .map((problem) => `\n    ${problem}`)
                .join('')}`,
        );
    }
    info(`${pkg.name}: ${files.length} files, manifest and entries consistent`);
    return manifest;
}

const IMPORT_MATRIX = `
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/');
const entries = JSON.parse(fs.readFileSync('entries.json', 'utf8'));
const empty = (value) =>
    value == null || (typeof value === 'object' && Object.keys(value).length === 0);
for (const { spec, esm, cjs } of entries) {
    if (esm && empty(await import(spec))) {
        throw new Error('ESM entry exported nothing: ' + spec);
    }
    if (cjs && empty(require(spec))) {
        throw new Error('CJS entry exported nothing: ' + spec);
    }
}
`;

/** Installs the tarballs the way a user would and loads every entry. */
function verifyInConsumer(tarballs, manifests, version, workDir) {
    const consumer = path.join(workDir, 'consumer');
    fs.mkdirSync(consumer, { recursive: true });
    fs.writeFileSync(
        path.join(consumer, 'package.json'),
        JSON.stringify({ name: 'lg-release-consumer', private: true }),
    );
    // --legacy-peer-deps keeps Angular's peers out; its entries are not imported.
    run(
        'npm',
        [
            'install',
            '--no-audit',
            '--no-fund',
            '--legacy-peer-deps',
            ...tarballs.values(),
            ...CONSUMER_PEERS,
        ],
        { cwd: consumer, capture: true },
    );
    for (const pkg of PACKAGES) {
        const installed = readJson(
            path.join(consumer, 'node_modules', pkg.name, 'package.json'),
        ).version;
        if (installed !== version) {
            fail(
                `The consumer resolved ${pkg.name} to ${installed}, not the packed ${version}.`,
            );
        }
    }
    const entries = [];
    for (const pkg of PACKAGES.filter((entry) => !entry.skipImport)) {
        const exportsMap = manifests.get(pkg.name).exports ?? {};
        for (const [subpath, conditions] of Object.entries(exportsMap)) {
            if (subpath.includes('*') || typeof conditions !== 'object') {
                continue;
            }
            const esm = 'import' in conditions;
            const cjs = 'require' in conditions;
            if (esm || cjs) {
                entries.push({
                    spec: path.posix.join(pkg.name, subpath),
                    esm,
                    cjs,
                });
            }
        }
    }
    fs.writeFileSync(path.join(consumer, 'import-matrix.mjs'), IMPORT_MATRIX);
    fs.writeFileSync(
        path.join(consumer, 'entries.json'),
        JSON.stringify(entries),
    );
    run('node', ['import-matrix.mjs'], { cwd: consumer });
    info(`${entries.length} entries load as ESM and CJS from a clean install`);
}

async function verifyConsumerApps(tarballs) {
    let result;
    try {
        result = await checkConsumers({ source: { tarballs }, log: info });
    } catch (error) {
        fail(error.message);
    }
    result.warnings.forEach(warn);
    if (result.failures.length > 0) {
        fail(
            `The consumer apps found problems:${result.failures
                .map((failure) => `\n  - ${failure}`)
                .join('')}`,
        );
    }
}

function integrityOf(file) {
    return `sha512-${createHash('sha512')
        .update(fs.readFileSync(file))
        .digest('base64')}`;
}

// ---------------------------------------------------------------------------
// Publish

async function confirm(question) {
    if (!process.stdin.isTTY) {
        fail('Not a terminal: pass --yes to publish without the prompt.');
    }
    const prompt = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const answer = await prompt.question(`\n${question} (y/N) `);
    prompt.close();
    return /^y(es)?$/i.test(answer.trim());
}

/** Dist-tags `name@version` should carry, given the tags the registry has. */
function tagsToMove(version, tag, tags) {
    const wanted = new Set();
    if (tags[tag] !== version) {
        wanted.add(tag);
    }
    // A package with no stable release keeps `latest` on its newest
    // prerelease; a plain install would otherwise stay on an old one.
    if (
        tag !== 'latest' &&
        (!tags.latest ||
            (isPrerelease(tags.latest) &&
                compareVersions(version, tags.latest) > 0))
    ) {
        wanted.add('latest');
    }
    // A stable release supersedes the prerelease line.
    if (
        tag === 'latest' &&
        tags.next &&
        compareVersions(version, tags.next) > 0
    ) {
        wanted.add('next');
    }
    return [...wanted];
}

async function settleDistTags(pkg, version, tag, workDir) {
    await waitForVersion(pkg.name, version);
    const tags = await distTags(pkg.name);
    for (const name of tagsToMove(version, tag, tags)) {
        run('npm', ['dist-tag', 'add', `${pkg.name}@${version}`, name], {
            cwd: workDir,
        });
    }
}

function tagCommit(version, gitState) {
    if (!gitState.tagged) {
        run('git', ['tag', version, gitState.head]);
    }
    if (!gitState.tagPushed) {
        run('git', ['push', gitState.remote, `refs/tags/${version}`]);
    }
    info(`tag ${version} is on ${gitState.remote}`);
}

// ---------------------------------------------------------------------------
// Commands

async function verify(options, publishing) {
    await step('Tooling', assertTooling);
    const version = await step('Versions', readReleaseVersion);
    const notes = await step('Release notes', () => {
        const text = releaseNotes(version);
        info(`${text.split('\n').length} lines from CHANGELOG.md`);
        return text;
    });
    const tag = resolveTag(version, options.tag);
    const gitState = await step('Git', () => assertGitReady(version));

    const published = new Set();
    await step('Registry', async () => {
        for (const pkg of PACKAGES) {
            const isPublished = Boolean(
                await publishedVersion(pkg.name, version),
            );
            if (isPublished) {
                published.add(pkg.name);
            }
            const state = isPublished
                ? 'already published'
                : 'not published yet';
            info(`${pkg.name}@${version}: ${state}`);
        }
        if (publishing) {
            const user = run('npm', ['whoami'], {
                capture: true,
                allowFailure: true,
            });
            if (!user) {
                fail('Not logged in to npm. Run `npm login` first.');
            }
            info(`publishing as ${user}`);
        }
    });
    const pending = PACKAGES.filter((pkg) => !published.has(pkg.name));
    if (publishing && pending.length === 0) {
        return {
            version,
            notes,
            tag,
            gitState,
            pending,
            tarballs: new Map(),
        };
    }

    if (options.skipCi) {
        warn('CI status was not checked (--skip-ci).');
    } else {
        await step('CI', () => assertCiPassed(gitState.head));
    }

    await step('Install', install);
    await step('Build', buildAll);
    if (options.skipTests) {
        warn('Typecheck, lint and tests were skipped (--skip-tests).');
    } else {
        await step('Typecheck, lint, test', runQualityGates);
    }

    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lg-release-'));
    const tarballs = await step('Pack', () => pack(workDir));
    const manifests = new Map();
    await step('Inspect tarballs', () => {
        for (const pkg of PACKAGES) {
            manifests.set(
                pkg.name,
                inspectTarball(pkg, tarballs.get(pkg.name), version, workDir),
            );
        }
    });
    await step('Clean install and import', () =>
        verifyInConsumer(tarballs, manifests, version, workDir),
    );
    if (options.skipConsumers) {
        warn('The consumer apps were not checked (--skip-consumers).');
    } else {
        await step('Consumer apps', () => verifyConsumerApps(tarballs));
    }
    return { version, notes, tag, gitState, pending, tarballs, workDir };
}

function printWarnings() {
    if (warnings.length > 0) {
        console.log(
            `\nWarnings:${warnings.map((entry) => `\n  ! ${entry}`).join('')}`,
        );
    }
}

async function check(options) {
    const { version, tag, pending, workDir } = await verify(options, false);
    printWarnings();
    console.log(
        `\nAll checks passed for ${version} (dist-tag ${tag}); ${pending.length} of ${PACKAGES.length} packages are not on the registry yet.`,
    );
    console.log(`Tarballs: ${path.join(workDir, 'tarballs')}`);
    console.log('Publish with `npm run release`.');
}

async function publish(options) {
    const { version, notes, tag, gitState, pending, tarballs, workDir } =
        await verify(options, true);
    if (pending.length === 0) {
        console.log(
            `\nEvery package is already on the registry at ${version}.`,
        );
    } else {
        const names = pending
            .map((pkg) => `\n    ${pkg.name}@${version}`)
            .join('');
        console.log(`\nReady to publish under the "${tag}" dist-tag:${names}`);
        if (
            !options.yes &&
            !(await confirm('Publish these packages to npm?'))
        ) {
            fail('Stopped before publishing; nothing was uploaded.');
        }
    }

    const settleDir = workDir ?? os.tmpdir();
    for (const pkg of PACKAGES) {
        if (pending.includes(pkg)) {
            await step(`Publish ${pkg.name}`, async () => {
                const tarball = tarballs.get(pkg.name);
                // From outside the repo, so its pnpm settings stay out of npm's way.
                run(
                    'npm',
                    ['publish', tarball, '--tag', tag, '--access', 'public'],
                    { cwd: workDir },
                );
                const manifest = await waitForVersion(pkg.name, version);
                const served = manifest.dist?.integrity;
                if (served !== integrityOf(tarball)) {
                    fail(
                        `${pkg.name}@${version} on the registry is not the tarball that was verified (integrity ${served}).`,
                    );
                }
                info('the registry serves the verified tarball');
            });
        }
        await settleDistTags(pkg, version, tag, settleDir);
    }

    await step('Git tag', () => tagCommit(version, gitState));
    await step('GitHub release', () => createGitHubRelease(version, notes));
    await step('Registry state', async () => {
        for (const pkg of PACKAGES) {
            const tags = await distTags(pkg.name);
            const summary = Object.entries(tags)
                .map(([name, value]) => `${name}=${value}`)
                .join(', ');
            info(`${pkg.name}: ${summary}`);
        }
    });
    printWarnings();
    console.log(`\nReleased ${version}.`);
}

/** Creates the GitHub release for the current version, which must be tagged on the remote. */
async function githubRelease() {
    const version = await step('Versions', readReleaseVersion);
    const notes = await step('Release notes', () => {
        const text = releaseNotes(version);
        info(`${text.split('\n').length} lines from CHANGELOG.md`);
        return text;
    });
    await step('Git', () => {
        const upstream = run(
            'git',
            ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'],
            { capture: true, allowFailure: true },
        );
        const remote = upstream ? upstream.split('/')[0] : 'origin';
        run('git', ['fetch', '--quiet', '--tags', remote]);
        const commit = remoteTagCommit(remote, version);
        if (!commit) {
            fail(
                `Tag ${version} is not on ${remote}. Publish first with \`npm run release\`.`,
            );
        }
        info(`tag ${version} is ${commit.slice(0, 8)} on ${remote}`);
    });
    await step('GitHub release', () =>
        createGitHubRelease(version, notes, true),
    );
    printWarnings();
}

function replaceOnce(file, pattern, replacement, what) {
    const before = fs.readFileSync(file, 'utf8');
    const after = before.replace(pattern, replacement);
    if (after === before && !pattern.test(before)) {
        fail(`${path.relative(rootDir, file)}: could not find ${what}.`);
    }
    fs.writeFileSync(file, after);
}

function bump(version) {
    if (!version || !parseVersion(version)) {
        fail('Usage: npm run release:bump <version>   e.g. 3.0.0-beta.3');
    }
    for (const pkg of PACKAGES) {
        const current = readJson(manifestPath(pkg)).version;
        if (parseVersion(current) && compareVersions(version, current) < 0) {
            fail(`${version} is older than ${pkg.name}'s current ${current}.`);
        }
        replaceOnce(
            manifestPath(pkg),
            /^(\s*"version":\s*")[^"]+(")/m,
            `$1${version}$2`,
            'the version field',
        );
        if (pkg.headless === 'caret') {
            replaceOnce(
                manifestPath(pkg),
                /("@lightgallery\/headless":\s*")[^"]+(")/,
                `$1^${version}$2`,
                `the ${HEADLESS} range`,
            );
        }
    }
    console.log(`Set ${PACKAGES.length} manifests to ${version}.`);

    const changelogFile = path.join(rootDir, 'CHANGELOG.md');
    const changelog = fs.readFileSync(changelogFile, 'utf8');
    const prereleaseLine = /Prerelease: `[^`]+` \(\d{4}-\d{2}-\d{2}\)/;
    let changelogDone = false;
    if (isPrerelease(version) && prereleaseLine.test(changelog)) {
        const now = new Date();
        const today = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0'),
        ].join('-');
        fs.writeFileSync(
            changelogFile,
            changelog.replace(
                prereleaseLine,
                `Prerelease: \`${version}\` (${today})`,
            ),
        );
        changelogDone = true;
        console.log('Updated the prerelease line in CHANGELOG.md.');
    }

    // The lockfile records the Angular package's headless range, and the
    // dist banner carries the version.
    run('pnpm', ['install']);
    run('npm', ['run', 'build']);

    console.log(`\nBumped to ${version}. Next:`);
    if (!changelogDone) {
        console.log(`  - update CHANGELOG.md for ${version} by hand`);
    }
    console.log(
        '  - review and commit the manifests, pnpm-lock.yaml, CHANGELOG.md and dist/',
    );
    console.log('  - push, wait for CI, then `npm run release`');
}

function parseArgs(argv) {
    const options = { positional: [] };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--tag') {
            options.tag = argv[++i];
            if (!options.tag) {
                fail('--tag needs a name, e.g. --tag next');
            }
        } else if (arg === '--skip-tests') {
            options.skipTests = true;
        } else if (arg === '--skip-ci') {
            options.skipCi = true;
        } else if (arg === '--skip-consumers') {
            options.skipConsumers = true;
        } else if (arg === '--yes') {
            options.yes = true;
        } else if (arg.startsWith('--')) {
            fail(`Unknown option ${arg}.`);
        } else {
            options.positional.push(arg);
        }
    }
    return options;
}

async function main() {
    const options = parseArgs(process.argv.slice(2));
    const [command, argument] = options.positional;
    if (command === 'bump') {
        bump(argument);
    } else if (command === 'check') {
        await check(options);
    } else if (command === 'publish') {
        await publish(options);
    } else if (command === 'github') {
        await githubRelease();
    } else {
        fail(
            'Usage: npm run release | release:check | release:github | release:bump <version>   options after `--`: --tag <name>, --skip-tests, --skip-ci, --skip-consumers, --yes',
        );
    }
}

main().catch((error) => {
    if (error instanceof ReleaseError) {
        console.error(`\nx ${error.message}`);
        printWarnings();
        process.exit(1);
    }
    throw error;
});
