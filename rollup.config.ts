import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import license from 'rollup-plugin-license';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

import path from 'path';
import pluginConfigs from './plugins-config-rollup.json';

const libraryName = 'lightGallery';
const libraryFileName = 'index';

const umdConfigs = pluginConfigs.map((config) => {
    return {
        input: `src/${config.folder}${config.fileName}.ts`,
        output: [
            {
                file: `dist/${config.folder}${config.fileName}.umd.js`,
                name: camelCase(config.fileName),
                format: 'umd',
                sourcemap: true,
            },
            {
                file: `dist/${config.folder}${config.fileName}.es5.js`,
                format: 'es',
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

            license({
                banner: {
                    commentStyle: 'ignored',
                    content: {
                        file: path.join(__dirname, '.banner'),
                    },
                },
            }),

            // Resolve source maps to the original source
            sourceMaps(),
        ],
    };
});
const minConfigs = pluginConfigs.map((config) => {
    return {
        input: `src/${config.folder}${config.fileName}.ts`,
        output: [
            {
                file: `dist/${config.folder}${config.fileName}.min.js`,
                name: camelCase(config.fileName),
                format: 'umd',
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

            // Resolve source maps to the original source
            sourceMaps(),
            terser({ format: { comments: false } }),
            license({
                banner: {
                    commentStyle: 'regular',
                    content: {
                        file: path.join(__dirname, '.banner'),
                    },
                },
            }),
        ],
    };
});

export default [
    ...umdConfigs,
    ...minConfigs,
    {
        input: `src/${libraryFileName}.ts`,
        output: [
            {
                file: pkg.main,
                name: camelCase(libraryName),
                format: 'umd',
                sourcemap: true,
            },
            { file: pkg.module, format: 'es', sourcemap: true },
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

            license({
                banner: {
                    commentStyle: 'ignored',
                    content: {
                        file: path.join(__dirname, '.banner'),
                    },
                },
            }),

            // Resolve source maps to the original source
            sourceMaps(),
        ],
    },
    {
        input: `src/${libraryFileName}.ts`,
        output: [
            { file: pkg.min, name: camelCase(libraryName), format: 'umd' },
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

            // Resolve source maps to the original source
            sourceMaps(),
            terser({ format: { comments: false } }),
            license({
                banner: {
                    commentStyle: 'regular',
                    content: {
                        file: path.join(__dirname, '.banner'),
                    },
                },
            }),
        ],
    },
];
