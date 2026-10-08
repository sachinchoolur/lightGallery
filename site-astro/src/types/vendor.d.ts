// Untyped page-vendor bundles (jQuery, Masonry, imagesLoaded, carousels).
declare module '*/scripts/vendor/*.js';

interface Window {
    Masonry?: new (element: Element, options: object) => { layout(): void; destroy(): void };
    imagesLoaded?: (element: Element) => { on(event: string, cb: () => void): void };
    jQuery?: unknown;
    $?: unknown;
}
