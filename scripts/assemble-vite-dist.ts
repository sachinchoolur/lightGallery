import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const pluginsDir = path.resolve(rootDir, 'packages/plugins');

function readJson(filePath: string): any {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath: string, value: any): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function copyFile(source: string, destination: string): void {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
}

function copyPackageStub(source: string, destination: string): void {
    writeJson(destination, readJson(source));
}

function main(): void {
    const rootPackage = readJson(path.resolve(rootDir, 'package.json'));
    const packageStub = readJson(path.resolve(rootDir, 'packages/package.json'));

    packageStub.version = rootPackage.version;

    writeJson(path.resolve(distDir, 'package.json'), packageStub);
    copyFile(path.resolve(rootDir, 'README.md'), path.resolve(distDir, 'README.md'));

    const pluginNames = fs
        .readdirSync(pluginsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();

    for (const pluginName of pluginNames) {
        copyPackageStub(
            path.resolve(pluginsDir, pluginName, 'package.json'),
            path.resolve(distDir, 'plugins', pluginName, 'package.json'),
        );
    }
}

main();
