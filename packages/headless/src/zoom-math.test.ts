import { describe, expect, it } from 'vitest';

import {
    applyZoom,
    initialZoomSlice,
} from './plugin-slices';
import {
    clampPan,
    clampScale,
    getActualSizeScale,
    getPanBounds,
    getPinchScale,
    getPointZoomPan,
    getPointerDistance,
} from './zoom-math';
import {
    clampThumbTranslate,
    getActiveThumbTranslate,
    getThumbTotalWidth,
} from './thumb-math';

describe('pan bounds', () => {
    it('allows no pan at scale 1 when the image fits', () => {
        expect(getPanBounds(800, 600, 1000, 800, 1)).toEqual({
            maxX: 0,
            maxY: 0,
        });
    });

    it('grows with scale and clamps the pan', () => {
        const bounds = getPanBounds(800, 600, 1000, 800, 2);
        expect(bounds).toEqual({ maxX: 300, maxY: 200 });
        expect(clampPan({ x: 500, y: -500 }, bounds)).toEqual({
            x: 300,
            y: -200,
        });
        expect(clampPan({ x: 100, y: 50 }, bounds)).toEqual({ x: 100, y: 50 });
    });
});

describe('scale math', () => {
    it('computes the actual-size scale with the 2.x fallback', () => {
        expect(getActualSizeScale(1600, 800)).toBe(2);
        expect(getActualSizeScale(1200, 800)).toBe(1.5);
        expect(getActualSizeScale(1600, 0)).toBe(2);
    });

    it('clamps scale to [1, max] unless infinite', () => {
        expect(clampScale(0.5, 3, false)).toBe(1);
        expect(clampScale(5, 3, false)).toBe(3);
        expect(clampScale(5, 3, true)).toBe(5);
    });

    it('keeps the anchor point stationary while zooming', () => {
        // Zoom 1 → 2 anchored at (100, 50): the pan moves so the anchored
        // image point stays under the cursor.
        expect(
            getPointZoomPan({ x: 100, y: 50 }, { x: 0, y: 0 }, 1, 2),
        ).toEqual({ x: -100, y: -50 });
        // Zooming back to 1 returns to center.
        expect(
            getPointZoomPan({ x: 100, y: 50 }, { x: -100, y: -50 }, 2, 1),
        ).toEqual({ x: 0, y: 0 });
    });

    it('scales pinch by distance ratio', () => {
        expect(getPointerDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
        expect(getPinchScale(100, 200, 1, 3, false)).toBe(2);
        expect(getPinchScale(100, 500, 1, 3, false)).toBe(3);
        expect(getPinchScale(100, 500, 1, 3, true)).toBe(5);
        expect(getPinchScale(100, 10, 1, 3, false)).toBe(0.5);
        expect(getPinchScale(0, 200, 1.5, 3, false)).toBe(1.5);
    });
});

describe('zoom slice', () => {
    it('commits zoom and recenters at scale 1', () => {
        const zoomed = applyZoom(
            initialZoomSlice,
            2,
            { x: 10, y: 5 },
            3,
            false,
        );
        expect(zoomed).toEqual({
            scale: 2,
            pan: { x: 10, y: 5 },
            zoomed: true,
        });
        expect(applyZoom(zoomed, 0.8, { x: 10, y: 5 }, 3, false)).toEqual(
            initialZoomSlice,
        );
    });
});

describe('thumb math', () => {
    it('computes total width', () => {
        expect(getThumbTotalWidth(10, 100, 5)).toBe(1050);
    });

    it('clamps the strip translate', () => {
        expect(clampThumbTranslate(-50, 1050, 500)).toBe(0);
        expect(clampThumbTranslate(2000, 1050, 500)).toBe(550);
        // Strip wider than content: stays at 0.
        expect(clampThumbTranslate(100, 300, 500)).toBe(0);
    });

    it('centers the active thumb at the pager position (2.x math)', () => {
        // index 5, thumb 100+5, strip 500, total 1050, middle position 200
        // translate = 105*5 - 1 - 200 = 324
        expect(getActiveThumbTranslate(5, 100, 5, 500, 1050, 'middle')).toBe(
            324,
        );
        expect(getActiveThumbTranslate(0, 100, 5, 500, 1050, 'middle')).toBe(
            0,
        );
        expect(getActiveThumbTranslate(9, 100, 5, 500, 1050, 'left')).toBe(
            550,
        );
    });
});
