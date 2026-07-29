/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/test'],
    // The headless workspace package resolves to TS source in dev;
    // map it straight to the file so ts-jest transforms it.
    moduleNameMapper: {
        '^@lightgallery/headless$':
            '<rootDir>/packages/headless/src/index.ts',
    },
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    collectCoverageFrom: ['src/*.{js,ts}'],
    coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
    coverageProvider: 'v8',
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 0,
            lines: 0,
            statements: 0,
        },
    },
};
