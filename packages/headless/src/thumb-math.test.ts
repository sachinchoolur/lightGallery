import { describe, expect, it } from 'vitest';

import {
    clampThumbTranslate,
    getActiveThumbTranslate,
    getThumbCorridorWindow,
    getThumbTotalWidth,
    getThumbWindow,
} from './thumb-math';

// 100px thumbs + 5px margin → 105px unit; 420px strip shows 4 units.
const GEOMETRY = {
    stripWidth: 420,
    thumbWidth: 100,
    thumbMargin: 5,
};

describe('getThumbWindow', () => {
    it('windows the start of a large strip with overscan', () => {
        const window = getThumbWindow({
            ...GEOMETRY,
            translate: 0,
            count: 1000,
            overscan: 2,
        });
        expect(window).toEqual({
            start: 0,
            end: 5, // 4 visible (0-3) + 2 overscan
            leadingPad: 0,
            trailingPad: (1000 - 1 - 5) * 105,
        });
    });

    it('windows a mid-strip translate with pads on both sides', () => {
        const window = getThumbWindow({
            ...GEOMETRY,
            translate: 100 * 105,
            count: 1000,
            overscan: 2,
        });
        expect(window.start).toBe(98);
        expect(window.end).toBe(105);
        expect(window.leadingPad).toBe(98 * 105);
        expect(window.trailingPad).toBe((1000 - 1 - 105) * 105);
    });

    it('clamps an overscrolled translate into the strip bounds', () => {
        const total = getThumbTotalWidth(1000, 100, 5);
        const window = getThumbWindow({
            ...GEOMETRY,
            translate: total * 2,
            count: 1000,
            overscan: 2,
        });
        expect(window.end).toBe(999);
        expect(window.trailingPad).toBe(0);
        // The clamped max translate leaves exactly one strip visible.
        expect(window.start).toBe(
            Math.floor((total - GEOMETRY.stripWidth) / 105) - 2,
        );
    });

    it("derives 'auto' overscan as one extra viewport per side", () => {
        const auto = getThumbWindow({
            ...GEOMETRY,
            translate: 0,
            count: 1000,
        });
        // ceil(420 / 105) = 4 extra thumbs.
        expect(auto.end).toBe(3 + 4);
    });

    it('renders everything when the window covers the whole strip', () => {
        const window = getThumbWindow({
            ...GEOMETRY,
            translate: 0,
            count: 5,
            overscan: 2,
        });
        expect(window).toEqual({
            start: 0,
            end: 4,
            leadingPad: 0,
            trailingPad: 0,
        });
    });

    it('returns an empty window for an empty gallery', () => {
        const window = getThumbWindow({
            ...GEOMETRY,
            translate: 0,
            count: 0,
        });
        expect(window.end).toBeLessThan(window.start);
    });
});

describe('strip geometry (existing helpers)', () => {
    it('keeps total width = count * unit', () => {
        expect(getThumbTotalWidth(10, 100, 5)).toBe(1050);
    });

    it('clamps translates into [0, total - strip]', () => {
        expect(clampThumbTranslate(-50, 1050, 420)).toBe(0);
        expect(clampThumbTranslate(5000, 1050, 420)).toBe(630);
    });

    it('centers the active thumb for the middle pager position', () => {
        const translate = getActiveThumbTranslate(
            5,
            100,
            5,
            420,
            1050,
            'middle',
        );
        expect(translate).toBe(
            clampThumbTranslate(5 * 105 - 1 - 160, 1050, 420),
        );
    });
});

describe('getThumbCorridorWindow', () => {
    it('unions the start and end windows of a fling', () => {
        const corridor = getThumbCorridorWindow({
            ...GEOMETRY,
            from: 0,
            to: 100 * 105,
            count: 1000,
            overscan: 2,
        });
        expect(corridor.start).toBe(0);
        expect(corridor.end).toBe(105);
        expect(corridor.leadingPad).toBe(0);
        expect(corridor.trailingPad).toBe((1000 - 1 - 105) * 105);
    });

    it('is direction-agnostic', () => {
        const forward = getThumbCorridorWindow({
            ...GEOMETRY,
            from: 2000,
            to: 8000,
            count: 1000,
            overscan: 2,
        });
        const backward = getThumbCorridorWindow({
            ...GEOMETRY,
            from: 8000,
            to: 2000,
            count: 1000,
            overscan: 2,
        });
        expect(backward).toEqual(forward);
    });
});
