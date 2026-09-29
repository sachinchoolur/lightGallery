/**
 * Minimal ambient declarations for host functions this package touches.
 * The tsconfig deliberately excludes the DOM lib so `window`/`document`
 * never typecheck here — but timers and `console` exist in every JS
 * host (browser, Node, workers), and typing them narrowly keeps the
 * DOM-free guarantee intact without pulling the whole `dom` lib in.
 */

declare function setTimeout(
    handler: (...args: unknown[]) => void,
    timeout?: number,
): number;

declare function clearTimeout(id: number | undefined): void;

declare const console: {
    warn(...data: unknown[]): void;
};
