import fs from 'fs';
import path from 'path';

interface PluginConfig {
    name: string;
    folder: string;
    fileName: string;
}

const rootDir = path.resolve(__dirname, '..');
const configPath = path.resolve(rootDir, 'plugins-config-rollup.json');
const configs = JSON.parse(
    fs.readFileSync(configPath, 'utf8'),
) as PluginConfig[];

export const coreEntry = path.resolve(rootDir, 'src/index.ts');
export const pluginEntries = Object.fromEntries(
    configs.map((config) => [
        `plugins/${config.name}/${config.fileName}`,
        path.resolve(rootDir, `src/${config.folder}${config.fileName}.ts`),
    ]),
);

if (require.main === module) {
    console.log(`core: ${coreEntry}`);
    Object.keys(pluginEntries).forEach((key) => console.log(key));
}
