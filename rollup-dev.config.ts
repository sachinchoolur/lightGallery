/**
 * Rollup config used for development
 * typescript files are compiled to the site folder.
 * Only UMD format is generated for now.
 * If you need ES you can copy paste config from the rollup-config.ts
 */

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import pluginConfigs from './plugins-config-rollup.json';

// Usage - LG_PLUGINS=['thumbnails','pager'] npm start
// To tun all plugin - LG_PLUGINS='all' npm start
const libraryName = 'lightGallery';
const libraryFileName = 'index';
const lgPluginsNames = process.argv[5] || [];
let pluginsToCompile = pluginConfigs;
if (lgPluginsNames !== 'all') {
    pluginsToCompile = pluginConfigs.filter(
        (config) => lgPluginsNames.indexOf(config.name) !== -1,
    );
}
const umdConfigs = pluginsToCompile.map((config) => {
    return {
        input: `src/${config.folder}${config.fileName}.ts`,
        output: [
            {
                file: `site/assets/js/${config.folder}${config.fileName}.umd.js`,
                name: camelCase(config.fileName),
                format: 'umd',
                sourcemap: true,
            },
        ],
        // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
        external: [],
        plugins: [
            // Allow json resolution
            json(),
            // Compile TypeScript files
            typescript({ useTsconfigDeclarationDir: true }),
            // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
            commonjs(),
            // Allow node_modules resolution, so you can use 'external' to control
            // which external modules to include in the bundle
            // https://github.com/rollup/rollup-plugin-node-resolve#usage
            resolve(),
        ],
    };
});

export default [
    ...umdConfigs,
    {
        input: `src/${libraryFileName}.ts`,
        output: [
            {
                file: 'site/assets/js/lightgallery.umd.js',
                name: camelCase(libraryName),
                format: 'umd',
                sourcemap: true,
            },
        ],
        // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
        external: [],
        watch: {
            include: 'src/**',
        },
        plugins: [
            // Allow json resolution
            json(),
            // Compile TypeScript files
            typescript({ useTsconfigDeclarationDir: true }),
            // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
            commonjs(),
            // Allow node_modules resolution, so you can use 'external' to control
            // which external modules to include in the bundle
            // https://github.com/rollup/rollup-plugin-node-resolve#usage
            resolve(),
        ],
    },
];
