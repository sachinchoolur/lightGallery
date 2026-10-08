// Register jest-dom on THIS package's vitest instance explicitly — the
// hoisted root `vitest` can be a different major (the Angular package
// pulls vitest 4), and `@testing-library/jest-dom/vitest` would extend
// that one instead.
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(
    (matchers as unknown as { default?: Record<string, never> }).default ??
        (matchers as unknown as Record<string, never>),
);

// jsdom does not implement scrolling; the gallery restores the scroll
// position on close, so stub it to keep test output clean. (The SSR suite
// runs in the node environment, where there is no window at all.)
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'scrollTo', {
        value: () => undefined,
        writable: true,
    });
}
