/**
 * Typed per-plugin state slices (ADR 0001 §5). Framework layers hold these
 * in their own reactivity; the shapes and transitions live here so plugin
 * behavior matches across frameworks. Wave-2 slices (rotate transforms,
 * autoplay run-state) join in plan 006.
 */

import { clampScale, type ZoomPan } from './zoom-math';

export interface ZoomSlice {
    scale: number;
    pan: ZoomPan;
    zoomed: boolean;
}

export const initialZoomSlice: ZoomSlice = {
    scale: 1,
    pan: { x: 0, y: 0 },
    zoomed: false,
};

/** Commit a zoom change; scale 1 always recenters (2.x behavior). */
export function applyZoom(
    _slice: ZoomSlice,
    scale: number,
    pan: ZoomPan,
    maxScale: number,
    infiniteZoom: boolean,
): ZoomSlice {
    const clamped = clampScale(scale, maxScale, infiniteZoom);
    if (clamped === 1) {
        return initialZoomSlice;
    }
    return { scale: clamped, pan, zoomed: true };
}
