/**
 * Typed per-plugin state slices (ADR 0001 §5). Framework layers hold these
 * in their own reactivity; the shapes and transitions live here so plugin
 * behavior matches across frameworks.
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

/** Per-slide rotate/flip state (rotate plugin). */
export interface RotateSlice {
    /** Rotation in degrees (multiples of 90, may run negative). */
    rotate: number;
    /** 1 or -1. */
    flipHorizontal: number;
    /** 1 or -1. */
    flipVertical: number;
}

export const initialRotateSlice: RotateSlice = {
    rotate: 0,
    flipHorizontal: 1,
    flipVertical: 1,
};

export function rotateLeft(slice: RotateSlice): RotateSlice {
    return { ...slice, rotate: slice.rotate - 90 };
}

export function rotateRight(slice: RotateSlice): RotateSlice {
    return { ...slice, rotate: slice.rotate + 90 };
}

/**
 * Which flip axis a horizontal/vertical flip actually toggles: at 90°/270°
 * the visual axes swap (2.x `getCurrentRotation` check).
 */
function resolveFlipAxis(
    slice: RotateSlice,
    axis: 'flipHorizontal' | 'flipVertical',
): 'flipHorizontal' | 'flipVertical' {
    const normalized = ((slice.rotate % 360) + 360) % 360;
    if (normalized === 90 || normalized === 270) {
        return axis === 'flipHorizontal' ? 'flipVertical' : 'flipHorizontal';
    }
    return axis;
}

export function flipHorizontal(slice: RotateSlice): RotateSlice {
    const axis = resolveFlipAxis(slice, 'flipHorizontal');
    return { ...slice, [axis]: slice[axis] * -1 };
}

export function flipVertical(slice: RotateSlice): RotateSlice {
    const axis = resolveFlipAxis(slice, 'flipVertical');
    return { ...slice, [axis]: slice[axis] * -1 };
}

/** CSS transform for a rotate slice (2.x `applyStyles`). */
export function getRotateTransform(slice: RotateSlice): string {
    return `rotate(${slice.rotate}deg) scale3d(${slice.flipHorizontal}, ${slice.flipVertical}, 1)`;
}

/** Autoplay run-state (autoplay plugin). */
export interface AutoplaySlice {
    running: boolean;
    pausedOnDrag: boolean;
    pausedOnSlideChange: boolean;
}

export const initialAutoplaySlice: AutoplaySlice = {
    running: false,
    pausedOnDrag: false,
    pausedOnSlideChange: false,
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
