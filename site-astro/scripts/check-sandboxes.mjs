#!/usr/bin/env node
/**
 * Every sandbox the site hands to StackBlitz must install from the npm
 * registry and build, the way it will in the browser. Each framework's
 * project is installed once, then every demo's files are swapped in and
 * built (the build scripts include the type check).
 *
 *   node site-astro/scripts/check-sandboxes.mjs [demos] [framework]
 *   demos: one name or several separated by commas
 *   --keep   leave the project folders in place and print where they
 *            are; each sandbox's build output is copied to built/<demo>/
 */
import { spawnSync } from 'node:child_process';
import {
    cpSync,
    mkdirSync,
    mkdtempSync,
    readdirSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { assembleSandboxes } from '../sandboxes/assemble.mjs';

const SANDBOXES = fileURLToPath(new URL('../sandboxes', import.meta.url));
const ROOT = fileURLToPath(new URL('../..', import.meta.url));

const args = process.argv.slice(2);
const keep = args.includes('--keep');
const [demoList, onlyFramework] = args.filter((arg) => !arg.startsWith('--'));
const onlyDemos = demoList?.split(',');

const sources = {};
for (const entry of readdirSync(SANDBOXES, {
    withFileTypes: true,
    recursive: true,
})) {
    if (entry.isFile()) {
        const file = join(entry.parentPath, entry.name);
        sources[relative(SANDBOXES, file).split('\\').join('/')] = readFileSync(
            file,
            'utf8',
        );
    }
}
const { version } = JSON.parse(
    readFileSync(join(ROOT, 'package.json'), 'utf8'),
);
const sandboxes = assembleSandboxes(sources, version).filter(
    (sandbox) =>
        (!onlyDemos || onlyDemos.includes(sandbox.demo)) &&
        (!onlyFramework || sandbox.framework === onlyFramework),
);

function run(command, commandArgs, cwd) {
    const result = spawnSync(command, commandArgs, {
        cwd,
        encoding: 'utf8',
        shell: process.platform === 'win32',
    });
    return {
        ok: result.status === 0,
        output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim(),
    };
}

const workDir = mkdtempSync(join(tmpdir(), 'lg-sandboxes-'));
const installed = new Map();
const failures = [];

for (const sandbox of sandboxes) {
    const name = `${sandbox.demo}/${sandbox.framework}`;
    const dir = join(workDir, sandbox.framework);
    mkdirSync(dir, { recursive: true });
    // Same folder for every demo of a framework: node_modules is reused,
    // the project files are replaced.
    for (const entry of readdirSync(dir, { withFileTypes: true }).filter(
        (item) =>
            item.name !== 'node_modules' && item.name !== 'package-lock.json',
    )) {
        rmSync(join(dir, entry.name), { recursive: true, force: true });
    }
    for (const [path, content] of Object.entries(sandbox.files)) {
        mkdirSync(dirname(join(dir, path)), { recursive: true });
        writeFileSync(join(dir, path), content);
    }

    const manifest = sandbox.files['package.json'];
    if (installed.get(sandbox.framework) !== manifest) {
        const install = run('npm', ['install', '--no-audit', '--no-fund'], dir);
        if (!install.ok) {
            failures.push({
                name,
                step: 'npm install',
                output: install.output,
            });
            console.log(`x ${name}: npm install failed`);
            continue;
        }
        installed.set(sandbox.framework, manifest);
    }

    const build = run('npm', ['run', 'build'], dir);
    if (!build.ok) {
        failures.push({ name, step: 'npm run build', output: build.output });
        console.log(`x ${name}: build failed`);
        continue;
    }
    if (keep) {
        // The framework folder is reused by the next demo.
        cpSync(join(dir, 'dist'), join(workDir, 'built', name), {
            recursive: true,
        });
    }
    console.log(`ok ${name} (lightgallery ${version})`);
}

for (const failure of failures) {
    console.log(`\n${failure.name}: ${failure.step}\n${failure.output}`);
}
console.log(
    `\n${sandboxes.length} sandboxes checked, ${failures.length} failed.`,
);
if (keep) {
    console.log(`Projects: ${workDir}`);
} else {
    rmSync(workDir, { recursive: true, force: true });
}
process.exit(failures.length ? 1 : 0);
