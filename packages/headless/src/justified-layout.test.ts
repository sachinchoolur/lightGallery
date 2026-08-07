import { describe, expect, it, vi } from 'vitest';

import { getJustifiedLayout, type JustifiedLayout } from './justified-layout';

/** Group boxes into rows by their top offset (zero-size boxes excluded). */
function rowsOf(layout: JustifiedLayout): number[][] {
    const rows = new Map<number, number[]>();
    layout.boxes.forEach((box, index) => {
        if (box.width === 0 && box.height === 0) {
            return;
        }
        const row = rows.get(box.top) ?? [];
        row.push(index);
        rows.set(box.top, row);
    });
    return [...rows.entries()]
        .sort(([a], [b]) => a - b)
        .map(([, indexes]) => indexes);
}

function rowWidth(layout: JustifiedLayout, row: number[], gap: number): number {
    return (
        row.reduce((sum, index) => sum + layout.boxes[index]!.width, 0) +
        gap * (row.length - 1)
    );
}

describe('getJustifiedLayout', () => {
    const BASE = {
        containerWidth: 1000,
        targetRowHeight: 200,
        gap: 10,
        maxScale: 1.75,
    } as const;

    it('fills every closed row to the exact container width', () => {
        const layout = getJustifiedLayout({
            ...BASE,
            lastRow: 'justify',
            ratios: [1.5, 0.8, 1.33, 1, 2.2, 0.66, 1.5, 1.78, 1, 1.2],
        });
        for (const row of rowsOf(layout)) {
            expect(rowWidth(layout, row, BASE.gap)).toBe(1000);
        }
    });

    it('preserves item order left to right, top to bottom', () => {
        const layout = getJustifiedLayout({
            ...BASE,
            ratios: [1.5, 0.8, 1.33, 1, 2.2, 0.66, 1.5],
        });
        const flat = rowsOf(layout).flat();
        expect(flat).toEqual([0, 1, 2, 3, 4, 5, 6]);
        // Within a row, start offsets grow in item order.
        for (const row of rowsOf(layout)) {
            const starts = row.map((i) => layout.boxes[i]!.start);
            expect([...starts].sort((a, b) => a - b)).toEqual(starts);
        }
    });

    it('keeps the leftover row at target height, start-aligned (default)', () => {
        const layout = getJustifiedLayout({
            ...BASE,
            ratios: [1.5, 1.5, 1.5, 1], // last item cannot fill a row
        });
        const rows = rowsOf(layout);
        const last = rows[rows.length - 1]!;
        expect(last).toEqual([3]);
        const box = layout.boxes[3]!;
        expect(box.height).toBe(200);
        expect(box.start).toBe(0);
        expect(box.width).toBe(200);
    });

    it('justifies the leftover row when asked, clamped by maxScale', () => {
        const layout = getJustifiedLayout({
            ...BASE,
            lastRow: 'justify',
            ratios: [1.5, 1.5, 1.5, 1],
        });
        const box = layout.boxes[3]!;
        // Alone the item would justify to height 1000 — the clamp wins.
        expect(box.height).toBe(200 * 1.75);
        expect(box.width).toBe(Math.round(200 * 1.75));
    });

    it('zero-sizes the leftover items under lastRow: hide', () => {
        const layout = getJustifiedLayout({
            ...BASE,
            lastRow: 'hide',
            ratios: [1.5, 1.5, 1.5, 1],
        });
        expect(layout.boxes).toHaveLength(4);
        expect(layout.boxes[3]).toEqual({
            top: 0,
            start: 0,
            width: 0,
            height: 0,
        });
        // The hidden row adds no height.
        const visibleBottom = Math.max(
            ...rowsOf(layout)
                .flat()
                .map((i) => layout.boxes[i]!.top + layout.boxes[i]!.height),
        );
        expect(layout.containerHeight).toBe(visibleBottom);
    });

    it('breaks rows at the height closest to the target', () => {
        // The row crosses the target at the third item: three across is
        // height 163.3 (off by 36.7), two across is 247.5 (off by
        // 47.5) — the shorter-but-closer row with the newcomer wins.
        const together = getJustifiedLayout({
            ...BASE,
            ratios: [2, 2, 2, 2],
        });
        expect(rowsOf(together)[0]).toEqual([0, 1, 2]);

        // A panorama pushed over the edge by a second item: alone it is
        // height 250 (off by 50); together 138.5 (off by 61.5) — the
        // taller-but-closer row without the newcomer wins.
        const apart = getJustifiedLayout({
            ...BASE,
            ratios: [4, 3.2, 4, 4],
        });
        expect(rowsOf(apart)[0]).toEqual([0]);
    });

    it('coerces invalid ratios to square with a single warning', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        try {
            const layout = getJustifiedLayout({
                ...BASE,
                lastRow: 'justify',
                ratios: [1, Number.NaN, -2, 0, 1],
            });
            expect(layout.boxes).toHaveLength(5);
            for (const row of rowsOf(layout)) {
                expect(rowWidth(layout, row, BASE.gap)).toBe(1000);
            }
            expect(warn).toHaveBeenCalledTimes(1);
        } finally {
            warn.mockRestore();
        }
    });

    it('handles empty input and single items', () => {
        expect(getJustifiedLayout({ ...BASE, ratios: [] })).toEqual({
            boxes: [],
            containerHeight: 0,
        });

        const single = getJustifiedLayout({ ...BASE, ratios: [2] });
        expect(single.boxes[0]).toMatchObject({
            top: 0,
            start: 0,
            height: 200,
        });
        expect(single.containerHeight).toBe(200);
    });

    it('closes a panorama wider than the container as its own row', () => {
        const layout = getJustifiedLayout({
            ...BASE,
            ratios: [8, 1, 1, 1, 1, 1.2],
        });
        const rows = rowsOf(layout);
        expect(rows[0]).toEqual([0]);
        expect(layout.boxes[0]!.width).toBe(1000);
        expect(layout.boxes[0]!.height).toBe(Math.round(1000 / 8));
    });

    it('holds the fill invariant across many ratio mixes', () => {
        // Deterministic pseudo-random ratios (no Math.random in tests).
        let seed = 42;
        const next = () => {
            seed = (seed * 1103515245 + 12345) % 2147483648;
            return seed / 2147483648;
        };
        for (let run = 0; run < 25; run++) {
            const count = 3 + Math.floor(next() * 20);
            const ratios = Array.from(
                { length: count },
                () => 0.4 + next() * 2.4,
            );
            const layout = getJustifiedLayout({
                ...BASE,
                lastRow: 'justify',
                ratios,
            });
            const rows = rowsOf(layout);
            expect(rows.flat()).toEqual(ratios.map((_, i) => i));
            for (const row of rows) {
                const height = layout.boxes[row[0]!]!.height;
                if (height <= BASE.targetRowHeight * BASE.maxScale - 1) {
                    expect(rowWidth(layout, row, BASE.gap)).toBe(1000);
                }
                // Every box in a row shares the row height.
                for (const index of row) {
                    expect(layout.boxes[index]!.height).toBe(height);
                }
            }
        }
    });
});
