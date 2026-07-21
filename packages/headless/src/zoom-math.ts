/**
 * Zoom math for the zoom plugin (plan 005), ported from the 2.x zoom
 * plugin's scale/position logic as pure functions: scale stepping and
 * clamping, actual-size scale, point-anchored zooming, pinch scale and
 * pan bounds. The React plugin writes the resulting transforms to the DOM.
 */

export interface ZoomPan {
    x: number;
    y: number;
}

export interface PanBounds {
    maxX: number;
    maxY: number;
}

/**
 * How far a zoomed image may pan before its edge would detach from the
 * container edge. At scale <= 1 the image cannot pan at all.
 */
export function getPanBounds(
    imageWidth: number,
    imageHeight: number,
    containerWidth: number,
    containerHeight: number,
    scale: number,
): PanBounds {
    return {
        maxX: Math.max(0, (imageWidth * scale - containerWidth) / 2),
        maxY: Math.max(0, (imageHeight * scale - containerHeight) / 2),
    };
}

export function clampPan(pan: ZoomPan, bounds: PanBounds): ZoomPan {
    return {
        x: Math.min(Math.max(pan.x, -bounds.maxX), bounds.maxX),
        y: Math.min(Math.max(pan.y, -bounds.maxY), bounds.maxY),
    };
}

/**
 * Scale at which the image renders at its natural pixel size (2.x
 * `getCurrentImageActualSizeScale`, with its `|| 2` fallback).
 */
export function getActualSizeScale(
    naturalWidth: number,
    renderedWidth: number,
): number {
    if (!renderedWidth) {
        return 2;
    }
    return naturalWidth / renderedWidth || 2;
}

/** Clamp a target scale: never below 1; capped unless `infiniteZoom`. */
export function clampScale(
    scale: number,
    maxScale: number,
    infiniteZoom: boolean,
): number {
    if (scale < 1) {
        return 1;
    }
    if (!infiniteZoom && scale > maxScale) {
        return maxScale;
    }
    return scale;
}

/**
 * Pan that keeps the given point (relative to the container center)
 * anchored while the scale changes — used for double-click/tap zoom and
 * pinch focal points.
 */
export function getPointZoomPan(
    point: ZoomPan,
    prevPan: ZoomPan,
    prevScale: number,
    newScale: number,
): ZoomPan {
    const ratio = newScale / prevScale;
    return {
        x: point.x - (point.x - prevPan.x) * ratio,
        y: point.y - (point.y - prevPan.y) * ratio,
    };
}

/** Distance between two pointers (pinch measurement). */
export function getPointerDistance(
    a: { x: number; y: number },
    b: { x: number; y: number },
): number {
    return Math.sqrt(
        (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y),
    );
}

/**
 * Scale during a pinch: proportional to the distance ratio. Allowed to dip
 * slightly below 1 mid-gesture (the release snaps back via
 * {@link clampScale}); capped unless `infiniteZoom`.
 */
export function getPinchScale(
    startDistance: number,
    currentDistance: number,
    startScale: number,
    maxScale: number,
    infiniteZoom: boolean,
): number {
    if (startDistance <= 0) {
        return startScale;
    }
    let scale = (currentDistance / startDistance) * startScale;
    scale = Math.max(0.5, scale);
    if (!infiniteZoom) {
        scale = Math.min(scale, Math.max(maxScale, 1));
    }
    return scale;
}
