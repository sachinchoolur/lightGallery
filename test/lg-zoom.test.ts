/**
 * Pinch scale rules — kept in lock-step with the framework packages'
 * `getPinchScale` (@lightgallery/headless).
 */
import Zoom from '../src/plugins/zoom/lg-zoom';

import '@testing-library/jest-dom';

const pinchScale = Zoom.prototype.getPinchZoomScale as (
    this: unknown,
    startDist: number,
    endDist: number,
    initScale: number,
) => number;

const pinch = (
    startDist: number,
    endDist: number,
    initScale: number,
    { infiniteZoom = true, actualSize = 2 } = {},
) =>
    pinchScale.call(
        {
            settings: { infiniteZoom },
            getCurrentImageActualSizeScale: () => actualSize,
        },
        startDist,
        endDist,
        initScale,
    );

const focalPan = Zoom.prototype.getPinchFocalPan as (
    this: unknown,
    point: { x: number; y: number },
    startPan: { x: number; y: number },
    startScale: number,
    scale: number,
) => { x: number; y: number };

const clampPan = Zoom.prototype.clampPinchPan as (
    this: unknown,
    pan: { x: number; y: number },
    scale: number,
) => { x: number; y: number };

const clampThis = {
    core: {
        getSlideItem: () => ({
            find: () => ({
                first: () => ({
                    get: () => ({ offsetWidth: 800, offsetHeight: 600 }),
                }),
            }),
        }),
    },
    containerRect: { width: 1000, height: 800 },
};

describe('pinch focal pan', () => {
    it('keeps the anchor point stationary while scaling', () => {
        // Zoom 1 → 2 anchored at (100, 50): the pan moves so the
        // anchored image point stays under the fingers (same cases as
        // the headless getPointZoomPan suite).
        expect(focalPan({ x: 100, y: 50 }, { x: 0, y: 0 }, 1, 2)).toEqual({
            x: -100,
            y: -50,
        });
        // Zooming back to 1 returns to centre.
        expect(focalPan({ x: 100, y: 50 }, { x: -100, y: -50 }, 2, 1)).toEqual({
            x: 0,
            y: 0,
        });
    });

    it('projects from the gesture-start pan, not an accumulated one', () => {
        expect(focalPan({ x: 0, y: 0 }, { x: 40, y: -20 }, 1, 3)).toEqual({
            x: 120,
            y: -60,
        });
    });
});

describe('pinch pan clamp', () => {
    it('clamps into the exact bounds for the scale', () => {
        // 800x600 at x2 in a 1000x800 stage → bounds ±300 x, ±200 y.
        expect(clampPan.call(clampThis, { x: 500, y: -500 }, 2)).toEqual({
            x: 300,
            y: -200,
        });
        expect(clampPan.call(clampThis, { x: 100, y: 50 }, 2)).toEqual({
            x: 100,
            y: 50,
        });
    });

    it('pins to centre when the image fits the stage', () => {
        expect(clampPan.call(clampThis, { x: 50, y: 40 }, 1)).toEqual({
            x: 0,
            y: 0,
        });
    });
});

describe('pinch zoom scale', () => {
    it('scales by the finger-distance ratio', () => {
        expect(pinch(100, 200, 1)).toBe(2);
        expect(pinch(100, 150, 2)).toBe(3);
    });

    it('dips below 1 elastically, floored at 0.5', () => {
        expect(pinch(100, 80, 1)).toBe(0.8);
        expect(pinch(100, 10, 1)).toBe(0.5);
    });

    it('caps at the actual-size scale unless infiniteZoom', () => {
        expect(pinch(100, 500, 1, { infiniteZoom: false })).toBe(2);
        expect(pinch(100, 500, 1)).toBe(5);
    });

    it('keeps the current scale for a degenerate start distance', () => {
        expect(pinch(0, 200, 1.5)).toBe(1.5);
    });
});
