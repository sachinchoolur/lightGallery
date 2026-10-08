import { describe, expect, it } from 'vitest';

import {
    clampThumbTranslate,
    getActiveThumbTranslate,
    getScrubThumbIndex,
    getScrubThumbTranslate,
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

describe('direction-aware pager position (rtl)', () => {
    it('maps the physical left/right edges to logical ones in rtl', () => {
        const args = [5, 100, 5, 420, 1050] as const;
        expect(getActiveThumbTranslate(...args, 'left', 'rtl')).toBe(
            getActiveThumbTranslate(...args, 'right'),
        );
        expect(getActiveThumbTranslate(...args, 'right', 'rtl')).toBe(
            getActiveThumbTranslate(...args, 'left'),
        );
        expect(getActiveThumbTranslate(...args, 'middle', 'rtl')).toBe(
            getActiveThumbTranslate(...args, 'middle'),
        );
    });
});

describe('getScrubThumbIndex / getScrubThumbTranslate', () => {
    // 20 thumbs of 105px unit = 2100px total; 420px strip; max = 1680.
    const total = getThumbTotalWidth(20, 100, 5);

    it('reaches the FIRST and LAST slides at the strip travel ends', () => {
        expect(getScrubThumbIndex(0, total, 420, 20)).toBe(0);
        expect(getScrubThumbIndex(total - 420, total, 420, 20)).toBe(19);
    });

    it('pins at the ends for elastic overshoot', () => {
        expect(getScrubThumbIndex(-500, total, 420, 20)).toBe(0);
        expect(getScrubThumbIndex(total * 2, total, 420, 20)).toBe(19);
    });

    it('is monotone and covers every index across the travel', () => {
        const seen = new Set<number>();
        let last = -1;
        for (let t = 0; t <= total - 420; t += 7) {
            const index = getScrubThumbIndex(t, total, 420, 20);
            expect(index).toBeGreaterThanOrEqual(last);
            last = index;
            seen.add(index);
        }
        expect(seen.size).toBe(20);
    });

    it('round-trips exactly with getScrubThumbTranslate', () => {
        for (let index = 0; index < 20; index++) {
            expect(
                getScrubThumbIndex(
                    getScrubThumbTranslate(index, total, 420, 20),
                    total,
                    420,
                    20,
                ),
            ).toBe(index);
        }
    });

    it('converges to ~one thumb unit per index step on long strips', () => {
        const bigTotal = getThumbTotalWidth(1000, 100, 5);
        const step =
            getScrubThumbTranslate(500, bigTotal, 420, 1000) -
            getScrubThumbTranslate(499, bigTotal, 420, 1000);
        expect(step).toBeGreaterThan(100);
        expect(step).toBeLessThan(110);
    });

    it('is safe on degenerate inputs', () => {
        expect(getScrubThumbIndex(100, total, 420, 0)).toBe(0);
        expect(getScrubThumbIndex(100, total, 420, 1)).toBe(0);
        // Strip fits the viewport: no travel, no scrubbing.
        expect(getScrubThumbIndex(100, 400, 420, 5)).toBe(0);
        expect(getScrubThumbTranslate(3, 400, 420, 5)).toBe(0);
    });
});
