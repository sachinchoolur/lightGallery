/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import summary from 'rollup-plugin-summary';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export default [
    {
        input: 'lightgallery.js',
        output: {
            file: 'lightgallery.esm.js',
            format: 'esm',
        },
        onwarn(warning) {
            if (warning.code !== 'THIS_IS_UNDEFINED') {
                console.error(`(!) ${warning.message}`);
            }
        },
        plugins: [
            replace({ 'Reflect.decorate': 'undefined' }),
            resolve(),
            terser({
                ecma: 2017,
                module: true,
                warnings: true,
                mangle: {
                    properties: {
                        regex: /^__/,
                    },
                },
            }),
            summary(),
        ],
    },
    {
        input: 'lightgallery.js',
        output: {
            file: 'lightgallery.umd.js',
            name: 'lightgallery',
            format: 'umd',
        },
        onwarn(warning) {
            if (warning.code !== 'THIS_IS_UNDEFINED') {
                console.error(`(!) ${warning.message}`);
            }
        },
        external: ['lit'],
        plugins: [
            replace({ 'Reflect.decorate': 'undefined' }),
            resolve(),
            terser({
                ecma: 2017,
                module: true,
                warnings: true,
                mangle: {
                    properties: {
                        regex: /^__/,
                    },
                },
            }),
            summary(),
        ],
    },
];
