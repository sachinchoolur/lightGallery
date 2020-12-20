import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import license from 'rollup-plugin-license';
import { uglify } from 'rollup-plugin-uglify';

import pkg from './package.json';

import path from 'path';

const libraryName = 'lightgallery';

const pluginConfigs = [
    {
        name: 'thumbnail',
        src: 'src/plugins/thumbnail/',
        dist: 'dist/plugins/',
        fileName: 'lg-thumbnail',
    },
    {
        name: 'video',
        src: 'src/plugins/video/',
        dist: 'dist/plugins/',
        fileName: 'lg-video',
    },
    {
        name: 'zoom',
        src: 'src/plugins/zoom/',
        dist: 'dist/plugins/',
        fileName: 'lg-zoom',
    },
    {
        name: 'share',
        src: 'src/plugins/share/',
        dist: 'dist/plugins/',
        fileName: 'lg-share',
    },
    {
        name: 'rotate',
        src: 'src/plugins/rotate/',
        dist: 'dist/plugins/',
        fileName: 'lg-rotate',
    },
    {
        name: 'pager',
        src: 'src/plugins/pager/',
        dist: 'dist/plugins/',
        fileName: 'lg-pager',
    },
    {
        name: 'hash',
        src: 'src/plugins/hash/',
        dist: 'dist/plugins/',
        fileName: 'lg-hash',
    },
    {
        name: 'fullscreen',
        src: 'src/plugins/fullscreen/',
        dist: 'dist/plugins/',
        fileName: 'lg-fullscreen',
    },
    {
        name: 'comment',
        src: 'src/plugins/comment/',
        dist: 'dist/plugins/',
        fileName: 'lg-comment',
    },
];

const umdConfigs = pluginConfigs.map((config) => {
    return {
        input: `${config.src}${config.fileName}.ts`,
        output: [
            {
                file: `${config.dist}${config.fileName}.umd.js`,
                name: camelCase(config.fileName),
                format: 'umd',
                sourcemap: true,
            },
            {
                file: `${config.dist}${config.fileName}.es5.js`,
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
        ],
    };
});

export default [
    ...umdConfigs,
    {
        input: `src/${libraryName}.ts`,
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
        ],
    },
];
