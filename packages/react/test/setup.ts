import '@testing-library/jest-dom/vitest';

// jsdom does not implement scrolling; the gallery restores the scroll
// position on close, so stub it to keep test output clean. (The SSR suite
// runs in the node environment, where there is no window at all.)
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'scrollTo', {
        value: () => undefined,
        writable: true,
    });
}
