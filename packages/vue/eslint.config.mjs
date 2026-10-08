import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import ts from 'typescript-eslint';

export default ts.config(
    js.configs.recommended,
    ...ts.configs.recommended,
    ...vue.configs['flat/recommended'],
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: { parser: ts.parser },
        },
        rules: {
            // vue-tsc owns undefined-identifier checking (browser globals
            // included); eslint's no-undef has no DOM lib knowledge.
            'no-undef': 'off',
        },
    },
    {
        rules: {
            '@typescript-eslint/consistent-type-imports': 'error',
            'vue/multi-word-component-names': 'off',
        },
    },
);
