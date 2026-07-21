import { describe, expect, it } from 'vitest';

import { getPreloadIndexes, getSlideIndexesInDom } from './preload';

describe('getSlideIndexesInDom', () => {
    it('returns every index for tiny galleries', () => {
        expect(getSlideIndexesInDom(0, 0, 3, 10, true)).toEqual([0, 1, 2]);
        expect(getSlideIndexesInDom(1, 0, 2, 10, false)).toEqual([0, 1]);
        expect(getSlideIndexesInDom(0, 0, 0, 10, true)).toEqual([]);
    });

    it('keeps at least three slides mounted', () => {
        const indexes = getSlideIndexesInDom(0, 0, 10, 0, false);
        expect(indexes.length).toBeGreaterThanOrEqual(3);
    });

    it('caps the window at the requested number of items', () => {
        const indexes = getSlideIndexesInDom(5, 4, 20, 6, false);
        // Window of 6 around index 5 plus the previous index.
        expect(indexes).toContain(5);
        expect(indexes).toContain(4);
        expect(indexes.length).toBeLessThanOrEqual(7);
    });

    it('centers the window with a first-half bias near the start', () => {
        const indexes = getSlideIndexesInDom(1, 0, 10, 5, false);
        expect([...indexes].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
    });

    it('centers the window with a second-half bias near the end', () => {
        const indexes = getSlideIndexesInDom(8, 9, 10, 5, false);
        expect([...indexes].sort((a, b) => a - b)).toEqual([5, 6, 7, 8, 9]);
    });

    it('includes the far end at the edges when looping', () => {
        expect(getSlideIndexesInDom(0, 1, 10, 3, true)).toContain(9);
        expect(getSlideIndexesInDom(9, 8, 10, 3, true)).toContain(0);
        expect(getSlideIndexesInDom(0, 1, 10, 3, false)).not.toContain(9);
    });

    it('always includes the previous index so its exit can animate', () => {
        const indexes = getSlideIndexesInDom(2, 7, 10, 3, false);
        expect(indexes).toContain(7);
    });
});

describe('getPreloadIndexes', () => {
    it('preloads around the index without wrapping', () => {
        expect(getPreloadIndexes(3, 2, 10).sort((a, b) => a - b)).toEqual([
            1, 2, 4, 5,
        ]);
    });

    it('clamps at the gallery bounds', () => {
        expect(getPreloadIndexes(0, 2, 10).sort((a, b) => a - b)).toEqual([
            1, 2,
        ]);
        expect(getPreloadIndexes(9, 2, 10).sort((a, b) => a - b)).toEqual([
            7, 8,
        ]);
    });

    it('handles preload larger than the gallery', () => {
        expect(getPreloadIndexes(1, 5, 3).sort((a, b) => a - b)).toEqual([
            0, 2,
        ]);
    });

    it('returns nothing for zero preload or single slide', () => {
        expect(getPreloadIndexes(0, 0, 10)).toEqual([]);
        expect(getPreloadIndexes(0, 2, 1)).toEqual([]);
    });
});
