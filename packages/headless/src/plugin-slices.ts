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

/** Whether the slice's rotation swaps the image's visual axes (90°/270°). */
export function isOrientationSwapped(slice: RotateSlice): boolean {
    const normalized = ((slice.rotate % 360) + 360) % 360;
    return normalized === 90 || normalized === 270;
}

/**
 * Scale that refits a rotated image into its stage. At 90°/270° the
 * image's rendered width runs vertically (and vice versa), so the fit is
 * computed against the swapped axes; capped at 1 — rotation never
 * upscales. At 0°/180° (and with degenerate dimensions) the image already
 * fits the way it was laid out: scale 1.
 */
export function getRotateFitScale(
    imageWidth: number,
    imageHeight: number,
    stageWidth: number,
    stageHeight: number,
    slice: RotateSlice,
): number {
    if (
        !isOrientationSwapped(slice) ||
        imageWidth <= 0 ||
        imageHeight <= 0 ||
        stageWidth <= 0 ||
        stageHeight <= 0
    ) {
        return 1;
    }
    return Math.min(stageWidth / imageHeight, stageHeight / imageWidth, 1);
}

/**
 * CSS transform for a rotate slice (2.x `applyStyles`), with the fit
 * scale folded into the same transform so rotate + refit animate as one
 * motion. `fitScale` defaults to 1 (the 2.x output, byte-identical).
 */
export function getRotateTransform(
    slice: RotateSlice,
    fitScale: number = 1,
): string {
    return `rotate(${slice.rotate}deg) scale3d(${slice.flipHorizontal * fitScale}, ${slice.flipVertical * fitScale}, 1)`;
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
