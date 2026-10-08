import { describe, expect, it } from 'vitest';

import { clampIndex } from './index';

describe('clampIndex', () => {
    it('clamps to bounds without loop', () => {
        expect(clampIndex(-1, 5, false)).toBe(0);
        expect(clampIndex(0, 5, false)).toBe(0);
        expect(clampIndex(4, 5, false)).toBe(4);
        expect(clampIndex(7, 5, false)).toBe(4);
    });

    it('wraps with loop', () => {
        expect(clampIndex(5, 5, true)).toBe(0);
        expect(clampIndex(6, 5, true)).toBe(1);
        expect(clampIndex(-1, 5, true)).toBe(4);
        expect(clampIndex(-6, 5, true)).toBe(4);
    });

    it('resolves empty galleries to 0', () => {
        expect(clampIndex(3, 0, false)).toBe(0);
        expect(clampIndex(3, 0, true)).toBe(0);
    });
});
