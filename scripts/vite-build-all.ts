import fs from 'fs';
import path from 'path';
import camelCase from 'lodash.camelcase';
import { build } from 'vite';

import { coreEntry, pluginEntries } from './build-plugin-entries';
import { createViteConfig, LightGalleryBuildEntry } from '../packages/core/vite.config';
import { createViteMinConfig } from '../packages/core/vite.config.min';

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist-vite');
const coreOutputFiles = [
    'lightgallery.umd.js',
    'lightgallery.umd.js.map',
    'lightgallery.es5.js',
    'lightgallery.es5.js.map',
    'lightgallery.min.js',
];

function pluginGlobalName(fileName: string): string {
    return camelCase(fileName.split('/').pop() || fileName);
}

const entries: LightGalleryBuildEntry[] = [
    {
        input: coreEntry,
        fileName: 'lightgallery',
        name: 'lightGallery',
    },
    ...Object.entries(pluginEntries).map(([fileName, input]) => ({
        input,
        fileName,
        name: pluginGlobalName(fileName),
    })),
];

async function runBuilds(): Promise<void> {
    fs.rmSync(path.resolve(distDir, 'plugins'), {
        recursive: true,
        force: true,
    });
    coreOutputFiles.forEach((fileName) => {
        fs.rmSync(path.resolve(distDir, fileName), { force: true });
    });

    for (const entry of entries) {
        await build(createViteConfig(entry, { emptyOutDir: false }));
    }

    for (const entry of entries) {
        await build(createViteMinConfig(entry));
    }
}

runBuilds().catch((error) => {
    console.error(error);
    process.exit(1);
});
