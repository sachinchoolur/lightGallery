import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import * as react from 'react';

export default [
    {
        input: `src/Lightgallery.tsx`,
        output: [
            {
                file: 'dist/Lightgallery.umd.js',
                name: 'Lightgallery',
                format: 'umd',
                sourcemap: true,
            },
            {
                file: 'dist/Lightgallery.es5.js',
                format: 'es',
                sourcemap: true,
            },
        ],
        // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
        external: ['react'],
        plugins: [
            // Allow json resolution
            json(),
            // Compile TypeScript files
            typescript({ useTsconfigDeclarationDir: true}),
            // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
            commonjs({
                namedExports: {
                    react: Object.keys(react),
                },
            }),
            // Allow node_modules resolution, so you can use 'external' to control
            // which external modules to include in the bundle
            // https://github.com/rollup/rollup-plugin-node-resolve#usage
            resolve(),
        ],
    },
];
