/**
 * Zoom math for the zoom plugin, ported from the 2.x zoom
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
 * Continuous resistance below fit scale — replaces the 2.x hard 0.5
 * floor: past the boundary the scale keeps moving at 15% per unit.
 */
export const PINCH_UNDER_FRICTION = 0.15;

/**
 * Very stiff resistance beyond actual size instead of a hard stop;
 * the release spring lands back inside bounds. `infiniteZoom` disables
 * this boundary entirely.
 */
export const PINCH_OVER_FRICTION = 0.05;

/**
 * Scale during a pinch: proportional to the distance ratio, with
 * friction (not clamps) at both boundaries. When pinch-to-close is
 * armed, the under-fit squeeze is free — the shrink IS the close
 * affordance; the release verdict is {@link shouldCloseOnPinch}.
 */
export function getPinchScale(
    startDistance: number,
    currentDistance: number,
    startScale: number,
    maxScale: number,
    infiniteZoom: boolean,
    pinchToCloseArmed = false,
): number {
    if (startDistance <= 0) {
        return startScale;
    }
    let scale = (currentDistance / startDistance) * startScale;
    if (scale < 1 && !pinchToCloseArmed) {
        scale = 1 + (scale - 1) * PINCH_UNDER_FRICTION;
    }
    const cap = Math.max(maxScale, 1);
    if (!infiniteZoom && scale > cap) {
        scale = cap + (scale - cap) * PINCH_OVER_FRICTION;
    }
    return scale;
}

/**
 * Pinch-to-close verdict (iOS Photos signature): a pinch released
 * below fit closes ONLY when the whole gesture stayed at or under fit
 * — an over-then-under pinch is a zoom correction, not a dismissal.
 * `maxGestureScale` is the largest scale seen since the pinch started
 * (seeded with the start scale).
 */
export function shouldCloseOnPinch(input: {
    scale: number;
    maxGestureScale: number;
    pinchToClose: boolean;
    closable: boolean;
}): boolean {
    return (
        input.pinchToClose &&
        input.closable &&
        input.scale < 1 &&
        input.maxGestureScale <= 1
    );
}
