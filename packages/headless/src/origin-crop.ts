/**
 * Math for the origin crop plugin: zoom-from-origin flights from cropped
 * thumbnails. A grid tile cropped with `object-fit: cover` (or
 * `background-size: cover`) shows only a window of the image. The plugin
 * grows that window from the tile at a uniform scale while two boxes
 * around the slides crop the rest of the image, revealed as the flight
 * lands. Pure rect arithmetic: the plugin measures the DOM and passes
 * plain numbers in. The core flight (`origin.ts`) never imports this.
 */

import { isUsableOriginRect, type ImageSize, type RectLike } from './origin';

/** A region of an image as fractions of its width and height (0..1). */
export interface FractionRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

/** The whole image: the window of an uncropped thumbnail. */
export const WHOLE_IMAGE: FractionRect = { x: 0, y: 0, width: 1, height: 1 };

const FRACTION_EPSILON = 0.001;

/** Whether a region covers the whole image (within rounding). */
export function isWholeImage(rect: FractionRect): boolean {
    return (
        Math.abs(rect.x) < FRACTION_EPSILON &&
        Math.abs(rect.y) < FRACTION_EPSILON &&
        Math.abs(rect.width - 1) < FRACTION_EPSILON &&
        Math.abs(rect.height - 1) < FRACTION_EPSILON
    );
}

/**
 * How a trigger paints its thumbnail file into its box: the CSS
 * `object-fit` of an `<img>`, or the `background-size` keyword of an
 * element with a background image.
 */
export type ThumbFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

/**
 * One axis of a CSS `object-position`/`background-position`: a share of
 * the free space (the box minus the painted image) plus a px offset.
 */
export interface CssPositionAxis {
    percent: number;
    px: number;
}

export interface CssPosition {
    x: CssPositionAxis;
    y: CssPositionAxis;
}

const CENTER_AXIS: CssPositionAxis = { percent: 50, px: 0 };

/** The CSS default, `50% 50%`. */
export const CSS_POSITION_CENTER: CssPosition = {
    x: CENTER_AXIS,
    y: CENTER_AXIS,
};

const POSITION_KEYWORDS: Record<string, number> = {
    left: 0,
    top: 0,
    center: 50,
    right: 100,
    bottom: 100,
};

function parsePositionAxis(token: string): CssPositionAxis | undefined {
    const keyword = POSITION_KEYWORDS[token];
    if (keyword !== undefined) {
        return { percent: keyword, px: 0 };
    }
    const percent = /^(-?\d*\.?\d+)%$/.exec(token);
    if (percent) {
        return { percent: parseFloat(percent[1]!), px: 0 };
    }
    const px = /^(-?\d*\.?\d+)px$/.exec(token);
    if (px) {
        return { percent: 0, px: parseFloat(px[1]!) };
    }
    // `right 10px` computes to `calc(100% - 10px)`.
    const calc =
        /^calc\(\s*(-?\d*\.?\d+)%\s*([+-])\s*(-?\d*\.?\d+)px\s*\)$/.exec(token);
    if (calc) {
        const sign = calc[2] === '-' ? -1 : 1;
        return {
            percent: parseFloat(calc[1]!),
            px: sign * parseFloat(calc[3]!),
        };
    }
    return undefined;
}

/**
 * Parse a computed `object-position` or `background-position` value
 * (`"50% 50%"`, `"10px 20px"`, `"calc(100% - 10px) 0%"`, keywords).
 * Unparseable values fall back to the centre. Only the first layer of a
 * multi-layer background is read.
 */
export function parseCssPosition(value: string | undefined): CssPosition {
    const layer = (value ?? '').split(',')[0]!.trim().toLowerCase();
    if (!layer) {
        return CSS_POSITION_CENTER;
    }
    const tokens = layer.match(/calc\([^)]*\)|\S+/g) ?? [];
    // `top left` orders the axes by keyword, not by position.
    if (
        tokens.length === 2 &&
        (tokens[0] === 'top' || tokens[0] === 'bottom') &&
        (tokens[1] === 'left' || tokens[1] === 'right')
    ) {
        tokens.reverse();
    }
    const x = parsePositionAxis(tokens[0] ?? '');
    const y =
        tokens[1] === undefined ? CENTER_AXIS : parsePositionAxis(tokens[1]);
    if (!x || !y) {
        return CSS_POSITION_CENTER;
    }
    return { x, y };
}

/** Parse a computed `object-fit` value; the CSS default is `fill`. */
export function parseObjectFit(value: string | undefined): ThumbFit {
    const fit = (value ?? '').trim().toLowerCase();
    switch (fit) {
        case 'contain':
        case 'cover':
        case 'none':
        case 'scale-down':
            return fit;
        default:
            return 'fill';
    }
}

/**
 * Parse a computed `background-size` value into the fit it paints like:
 * `cover` and `contain` as themselves, `auto` as `none` (natural size),
 * `100% 100%` as `fill`. Explicit lengths cannot be modelled and return
 * undefined. Only the first layer of a multi-layer background is read.
 */
export function parseBackgroundFit(
    value: string | undefined,
): ThumbFit | undefined {
    const layer = (value ?? '').split(',')[0]!.trim().toLowerCase();
    switch (layer) {
        case 'cover':
        case 'contain':
            return layer;
        case 'auto':
        case 'auto auto':
            return 'none';
        case '100% 100%':
            return 'fill';
        default:
            return undefined;
    }
}

/** The first URL of a computed `background-image` value, if any. */
export function parseCssUrl(value: string | undefined): string | undefined {
    const match = /url\(\s*(["']?)(.*?)\1\s*\)/.exec(value ?? '');
    const url = match?.[2]?.trim();
    return url || undefined;
}

export interface OriginWindowInput {
    /** Rendered box of the trigger (thumbnail img or background element), viewport px. */
    box: RectLike;

    /** The full image; only its aspect ratio matters. */
    imageSize: ImageSize;

    /**
     * Natural size of the thumbnail file when known (an `<img>`'s
     * `naturalWidth`/`naturalHeight`). A file with a different aspect ratio
     * than the image is taken as a centred crop of it. Unknown (a background
     * image, an unloaded img) assumes the image's own aspect ratio.
     */
    thumbSize?: ImageSize;

    /** How the file is painted into the box. Defaults to `fill`. */
    fit?: ThumbFit;

    /** Where the painted file sits in the box. Defaults to the centre. */
    position?: CssPosition;
}

export interface OriginWindow {
    /**
     * The part of the trigger box that shows thumbnail pixels, viewport px:
     * the box itself unless the file is letterboxed inside it.
     */
    rect: RectLike;

    /** The part of the image visible in `rect`, as fractions of the image. */
    window: FractionRect;

    /**
     * The part of the image the thumbnail file covers, as fractions: the
     * whole image unless the file is pre-cropped. Sizes the flight's
     * dummy, which shows the file, so its pixels land where they belong.
     */
    region: FractionRect;
}

const ASPECT_EPSILON = 0.01;

function aspectOf(size: ImageSize): number {
    return size.width / size.height;
}

function sameAspect(a: number, b: number): boolean {
    return Math.abs(a / b - 1) < ASPECT_EPSILON;
}

/**
 * The centred crop of an image with aspect `imageAspect` at aspect
 * `cropAspect`, as fractions of the image (the CSS `cover` fit).
 */
function centeredCrop(imageAspect: number, cropAspect: number): FractionRect {
    if (sameAspect(imageAspect, cropAspect)) {
        return WHOLE_IMAGE;
    }
    if (cropAspect > imageAspect) {
        const height = imageAspect / cropAspect;
        return { x: 0, y: (1 - height) / 2, width: 1, height };
    }
    const width = cropAspect / imageAspect;
    return { x: (1 - width) / 2, y: 0, width, height: 1 };
}

function resolvePositionAxis(axis: CssPositionAxis, freeSpace: number): number {
    return (freeSpace * axis.percent) / 100 + axis.px;
}

const uncropped = (box: RectLike): OriginWindow => ({
    rect: box,
    window: WHOLE_IMAGE,
    region: WHOLE_IMAGE,
});

/**
 * Where a thumbnail's visible pixels sit in the full image. Models the CSS
 * fit and position of the file inside its box, and a pre-cropped file as a
 * centred crop of the image.
 */
export function getOriginWindow(input: OriginWindowInput): OriginWindow {
    const { box, imageSize, thumbSize, position = CSS_POSITION_CENTER } = input;
    let fit = input.fit ?? 'fill';
    if (
        !isUsableOriginRect(box) ||
        !(imageSize.width > 0) ||
        !(imageSize.height > 0)
    ) {
        return uncropped(box);
    }
    const imageAspect = aspectOf(imageSize);
    const knownThumb =
        thumbSize && thumbSize.width > 0 && thumbSize.height > 0
            ? thumbSize
            : undefined;
    // Natural-size fits need the file's real size; without it, fall back
    // to the stretch the built-in flight assumes.
    if (!knownThumb && (fit === 'none' || fit === 'scale-down')) {
        fit = 'fill';
    }
    const thumb = knownThumb ?? imageSize;
    const region = centeredCrop(imageAspect, aspectOf(thumb));

    // The painted file inside the box.
    let scaleX: number;
    let scaleY: number;
    switch (fit) {
        case 'fill':
            scaleX = box.width / thumb.width;
            scaleY = box.height / thumb.height;
            break;
        case 'cover':
            scaleX = scaleY = Math.max(
                box.width / thumb.width,
                box.height / thumb.height,
            );
            break;
        case 'contain':
            scaleX = scaleY = Math.min(
                box.width / thumb.width,
                box.height / thumb.height,
            );
            break;
        case 'none':
            scaleX = scaleY = 1;
            break;
        case 'scale-down':
            scaleX = scaleY = Math.min(
                1,
                box.width / thumb.width,
                box.height / thumb.height,
            );
            break;
    }
    const paintedWidth = thumb.width * scaleX;
    const paintedHeight = thumb.height * scaleY;
    const offsetX = resolvePositionAxis(position.x, box.width - paintedWidth);
    const offsetY = resolvePositionAxis(position.y, box.height - paintedHeight);

    // The visible part: the painted file clipped by the box.
    const visibleLeft = Math.max(0, offsetX);
    const visibleTop = Math.max(0, offsetY);
    const visibleRight = Math.min(box.width, offsetX + paintedWidth);
    const visibleBottom = Math.min(box.height, offsetY + paintedHeight);
    if (visibleRight <= visibleLeft || visibleBottom <= visibleTop) {
        return uncropped(box);
    }
    const rect: RectLike = {
        left: box.left + visibleLeft,
        top: box.top + visibleTop,
        width: visibleRight - visibleLeft,
        height: visibleBottom - visibleTop,
    };

    // The visible part as fractions of the file, then of the image.
    const fileX = (visibleLeft - offsetX) / paintedWidth;
    const fileY = (visibleTop - offsetY) / paintedHeight;
    const window: FractionRect = {
        x: region.x + fileX * region.width,
        y: region.y + fileY * region.height,
        width: (rect.width / paintedWidth) * region.width,
        height: (rect.height / paintedHeight) * region.height,
    };

    return { rect, window, region };
}

export interface OriginCropFlightInput {
    /**
     * The part of the trigger showing thumbnail pixels
     * ({@link OriginWindow.rect}), viewport px.
     */
    triggerRect: RectLike;

    /** Bounding rect of the gallery outer element, viewport coordinates. */
    containerRect: RectLike;

    /** Media container top offset (toolbar height), px. */
    top: number;

    /** Media container bottom offset (caption + thumb strip height), px. */
    bottom: number;

    /** Final displayed image size (see `fitImageSize`). */
    imageSize: ImageSize;

    /** The part of the image the trigger shows ({@link OriginWindow.window}). */
    window: FractionRect;
}

export interface OriginCropFlight {
    /**
     * The slide's transform: the window lands on the trigger, at a uniform
     * scale, inside the translated stage boxes.
     */
    transform: string;

    /** The outer stage box: its bottom-right corner on the trigger's. */
    outer: string;

    /** The inner stage box: its top-left corner on the trigger's. */
    inner: string;
}

/**
 * The start of a flight from a cropped thumbnail (and the end of the flight
 * back to it). Two stage-sized, overflow-hidden boxes wrap the slides: the
 * outer one translates so that its bottom-right corner sits on the
 * trigger's, the inner one so that its top-left corner sits on the
 * trigger's, and their intersection is exactly the trigger's box. As both
 * transition back to rest with the slide, the crop's edges move linearly on
 * screen out to the whole stage, and only transforms animate.
 */
export function getOriginCropFlight(
    input: OriginCropFlightInput,
): OriginCropFlight {
    const { triggerRect, containerRect, top, bottom, imageSize, window } =
        input;

    const stageLeft = containerRect.left;
    const stageTop = containerRect.top + top;
    const stageWidth = containerRect.width;
    const stageHeight = containerRect.height - (top + bottom);

    const outerX =
        triggerRect.left + triggerRect.width - (stageLeft + stageWidth);
    const outerY =
        triggerRect.top + triggerRect.height - (stageTop + stageHeight);
    const innerX = stageWidth - triggerRect.width;
    const innerY = stageHeight - triggerRect.height;

    const scaleX = triggerRect.width / (imageSize.width * window.width);
    const scaleY = triggerRect.height / (imageSize.height * window.height);

    // The window's centre, relative to the image centre (the slide's
    // transform origin), in final-size px.
    const windowX = imageSize.width * (window.x + window.width / 2 - 0.5);
    const windowY = imageSize.height * (window.y + window.height / 2 - 0.5);

    // The inner box's top-left corner sits on the trigger's, so the slide
    // centres the window in a trigger-sized box at its own top-left.
    const x = (triggerRect.width - stageWidth) / 2 - windowX * scaleX;
    const y = (triggerRect.height - stageHeight) / 2 - windowY * scaleY;

    return {
        transform: `translate3d(${x}px, ${y}px, 0) scale3d(${scaleX}, ${scaleY}, 1)`,
        outer: `translate3d(${outerX}px, ${outerY}px, 0)`,
        inner: `translate3d(${innerX}px, ${innerY}px, 0)`,
    };
}
