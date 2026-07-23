// Type-side counterpart of setup.ts: apply jest-dom's matcher types to
// THIS package's vitest assertion interface. jest-dom's own
// `@testing-library/jest-dom/vitest` augments whichever `@vitest/expect`
// hoists to the workspace root (vitest 4, via the sibling packages);
// this package's vitest 2 assertions live in its own pinned
// `@vitest/expect`, so the augmentation must be declared here, where the
// specifier resolves to that copy.
import type { expect } from 'vitest';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module '@vitest/expect' {
    interface JestAssertion<T = unknown>
        extends TestingLibraryMatchers<
            ReturnType<typeof expect.stringContaining>,
            T
        > {}
    interface AsymmetricMatchersContaining
        extends TestingLibraryMatchers<
            ReturnType<typeof expect.stringContaining>,
            unknown
        > {}
}
