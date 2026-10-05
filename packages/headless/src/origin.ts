/**
 * Zoom-from-origin math, ported from 2.x `utils.getSize`/`utils.getTransform`
 * (`src/lg-utils.ts`) as pure rect arithmetic. The framework layer measures
 * the DOM (trigger/container bounding rects) and passes plain numbers in.
 *
 * Note: this module follows the standing rule that pure functions needed
 * by the framework layers live in headless. It is distinct from
 * `zoom-math.ts` (zoom plugin).
 */

export interface ImageSize {
    width: number;
    height: number;
}

export interface RectLike {
    left: number;
    top: number;
    width: number;
    height: number;
}

/**
 * Parse an item's `lgSize` value (`"1920-1280"`, or a responsive list like
 * `"240-160-375, 1600-1067"` where the third number is the max viewport
 * width the entry applies to).
 */
export function parseImageSize(
    lgSize: string | undefined,
    viewportWidth: number,
): ImageSize | undefined {
    if (!lgSize) {
        return undefined;
    }
    let size = lgSize;
    const responsiveSizes = lgSize.split(',');
    if (responsiveSizes[1]) {
        for (let i = 0; i < responsiveSizes.length; i++) {
            const candidate = responsiveSizes[i]!.trim();
            const responsiveWidth = parseInt(candidate.split('-')[2]!, 10);
            if (responsiveWidth > viewportWidth) {
                size = candidate;
                break;
            }
            if (i === responsiveSizes.length - 1) {
                size = candidate;
            }
        }
    }
    const parts = size.trim().split('-');
    const width = parseInt(parts[0]!, 10);
    const height = parseInt(parts[1]!, 10);
    if (!Number.isFinite(width) || !Number.isFinite(height)) {
        return undefined;
    }
    return { width, height };
}

/**
 * Fit a natural image size into the available container box, preserving
 * aspect ratio and never scaling up (2.x `utils.getSize` math).
 */
export function fitImageSize(
    size: ImageSize,
    containerWidth: number,
    containerHeight: number,
): ImageSize {
    const maxWidth = Math.min(containerWidth, size.width);
    const maxHeight = Math.min(containerHeight, size.height);
    const ratio = Math.min(maxWidth / size.width, maxHeight / size.height);
    return { width: size.width * ratio, height: size.height * ratio };
}

/**
 * Whether a measured trigger rect can anchor the zoom-from-origin flight.
 * A trigger that is hidden (`display: none`, the `hidden` attribute),
 * detached or collapsed measures 0×0 at the viewport origin; a flight
 * aimed at it would shrink the slide into the top-left corner.
 */
export function isUsableOriginRect(
    rect: RectLike | null | undefined,
): rect is RectLike {
    return (
        !!rect &&
        Number.isFinite(rect.left) &&
        Number.isFinite(rect.top) &&
        rect.width > 0 &&
        rect.height > 0
    );
}

/** Scale the closing slide shrinks to when it has no trigger to return to. */
export const CENTER_CLOSE_SCALE = 0.5;

/**
 * Close transform for a slide without a usable origin (hidden or
 * collapsed trigger, no `lgSize`): shrink in place about the stage centre,
 * the mirror of the `lg-start-zoom` open. The runtime pairs it with the
 * `lg-close-to-center` class, which fades the slide out over the same
 * duration.
 */
export function getCenterCloseTransform(scale = CENTER_CLOSE_SCALE): string {
    return `translate3d(0, 0, 0) scale3d(${scale}, ${scale}, 1)`;
}

export interface OriginTransformInput {
    /** Bounding rect of the trigger thumbnail image, viewport coordinates. */
    triggerRect: RectLike;

    /** Bounding rect of the gallery outer element, viewport coordinates. */
    containerRect: RectLike;

    /** Media container top offset (toolbar height), px. */
    top: number;

    /** Media container bottom offset (caption + thumb strip height), px. */
    bottom: number;

    /** Final displayed image size (see {@link fitImageSize}). */
    imageSize: ImageSize;
}

/**
 * CSS transform that places the (centered, final-size) slide image exactly
 * over the trigger thumbnail — the starting point of the zoom-from-origin
 * open animation and the end point of the close animation.
 */
export function getOriginTransform(input: OriginTransformInput): string {
    const { triggerRect, containerRect, top, bottom, imageSize } = input;

    const availableWidth = containerRect.width;
    const availableHeight = containerRect.height - (top + bottom);

    const x =
        (availableWidth - triggerRect.width) / 2 -
        triggerRect.left +
        containerRect.left;
    const y =
        (availableHeight - triggerRect.height) / 2 - triggerRect.top + top;

    const scaleX = triggerRect.width / imageSize.width;
    const scaleY = triggerRect.height / imageSize.height;

    return `translate3d(${-x}px, ${-y}px, 0) scale3d(${scaleX}, ${scaleY}, 1)`;
}
