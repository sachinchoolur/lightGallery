/**
 * Framework-free core logic for lightGallery. Nothing in this package may
 * import a framework or the DOM — the tsconfig excludes the DOM lib so
 * `window`/`document` do not typecheck here by construction.
 */

export {
    createGalleryState,
    galleryReducer,
    type CreateGalleryStateOptions,
    type GalleryAction,
    type GalleryState,
} from './state';

/**
 * Clamp a slide index into the valid range for a gallery of `length` slides.
 * With `loop`, out-of-range indexes wrap around; without it they clamp to the
 * nearest bound. An empty gallery always resolves to 0.
 */
export function clampIndex(
    index: number,
    length: number,
    loop: boolean,
): number {
    if (length <= 0) {
        return 0;
    }
    if (loop) {
        return ((index % length) + length) % length;
    }
    return Math.min(Math.max(index, 0), length - 1);
}
