import { describe, expect, it } from 'vitest';

import {
    createGalleryState,
    galleryReducer,
    type GalleryState,
} from './state';

function state(overrides: Partial<GalleryState> = {}): GalleryState {
    return {
        ...createGalleryState({ slidesCount: 5 }),
        ...overrides,
    };
}

describe('galleryReducer', () => {
    it('opens at the requested index, clamped', () => {
        const opened = galleryReducer(state(), { type: 'OPEN', index: 3 });
        expect(opened.open).toBe(true);
        expect(opened.currentIndex).toBe(3);
        expect(opened.previousIndex).toBe(3);

        const clamped = galleryReducer(state(), { type: 'OPEN', index: 99 });
        expect(clamped.currentIndex).toBe(4);
    });

    it('closes without losing the index', () => {
        const opened = galleryReducer(state(), { type: 'OPEN', index: 2 });
        const closed = galleryReducer(opened, { type: 'CLOSE' });
        expect(closed.open).toBe(false);
        expect(closed.currentIndex).toBe(2);
    });

    it('navigates next/prev and tracks previousIndex', () => {
        let s = galleryReducer(state(), { type: 'OPEN', index: 1 });
        s = galleryReducer(s, { type: 'NEXT' });
        expect(s.currentIndex).toBe(2);
        expect(s.previousIndex).toBe(1);
        s = galleryReducer(s, { type: 'PREV' });
        expect(s.currentIndex).toBe(1);
        expect(s.previousIndex).toBe(2);
    });

    it('wraps at the ends with loop', () => {
        let s = state({ open: true, currentIndex: 4, loop: true });
        s = galleryReducer(s, { type: 'NEXT' });
        expect(s.currentIndex).toBe(0);
        s = galleryReducer(s, { type: 'PREV' });
        expect(s.currentIndex).toBe(4);
    });

    it('stays at the ends without loop', () => {
        const last = state({ open: true, currentIndex: 4, loop: false });
        expect(galleryReducer(last, { type: 'NEXT' })).toBe(last);

        const first = state({ open: true, currentIndex: 0, loop: false });
        expect(galleryReducer(first, { type: 'PREV' })).toBe(first);
    });

    it('GO_TO same index is a no-op returning the same reference', () => {
        const s = state({ open: true, currentIndex: 2 });
        expect(galleryReducer(s, { type: 'GO_TO', index: 2 })).toBe(s);
    });

    it('re-clamps indexes when the slide count shrinks', () => {
        const s = state({ open: true, currentIndex: 4, previousIndex: 3 });
        const shrunk = galleryReducer(s, { type: 'SET_SLIDES_COUNT', count: 2 });
        expect(shrunk.slidesCount).toBe(2);
        expect(shrunk.currentIndex).toBe(1);
        expect(shrunk.previousIndex).toBe(1);
    });

    it('tracks slide direction, including wrap-around edges', () => {
        let s = state({ open: true, currentIndex: 4, galleryOn: true });
        s = galleryReducer(s, { type: 'NEXT' });
        expect(s.currentIndex).toBe(0);
        expect(s.slideDirection).toBe('next');

        s = galleryReducer(s, { type: 'TRANSITION_END' });
        s = galleryReducer(s, { type: 'PREV' });
        expect(s.currentIndex).toBe(4);
        expect(s.slideDirection).toBe('prev');
    });

    it('only transitions once the gallery is on (first slide is static)', () => {
        let s = galleryReducer(state(), { type: 'OPEN', index: 1 });
        s = galleryReducer(s, { type: 'NEXT' });
        expect(s.transitioning).toBe(false);

        s = galleryReducer(s, { type: 'SLIDE_LOADED', index: 2 });
        expect(s.galleryOn).toBe(true);
        s = galleryReducer(s, { type: 'NEXT' });
        expect(s.transitioning).toBe(true);
    });

    it('ignores navigation while transitioning until TRANSITION_END', () => {
        let s = state({
            open: true,
            currentIndex: 1,
            galleryOn: true,
            transitioning: true,
        });
        expect(galleryReducer(s, { type: 'NEXT' })).toBe(s);
        expect(galleryReducer(s, { type: 'GO_TO', index: 3 })).toBe(s);

        s = galleryReducer(s, { type: 'TRANSITION_END' });
        expect(s.transitioning).toBe(false);
        expect(galleryReducer(s, { type: 'NEXT' }).currentIndex).toBe(2);
    });

    it('accumulates loaded slides and resets them on open/close', () => {
        let s = galleryReducer(state(), { type: 'OPEN', index: 0 });
        s = galleryReducer(s, { type: 'SLIDE_LOADED', index: 0 });
        s = galleryReducer(s, { type: 'SLIDE_LOADED', index: 1 });
        expect([...s.loadedSlides].sort()).toEqual([0, 1]);

        const closed = galleryReducer(s, { type: 'CLOSE' });
        expect(closed.loadedSlides.size).toBe(0);
        expect(closed.galleryOn).toBe(false);

        const reopened = galleryReducer(s, { type: 'OPEN', index: 2 });
        expect(reopened.loadedSlides.size).toBe(0);
    });

    it('marks the gallery on after a slide error without recording a load', () => {
        let s = galleryReducer(state(), { type: 'OPEN' });
        s = galleryReducer(s, { type: 'SLIDE_ERROR', index: 0 });
        expect(s.galleryOn).toBe(true);
        expect(s.loadedSlides.size).toBe(0);
    });

    it('prunes loaded slides beyond a shrunk slide count', () => {
        let s = state({ open: true });
        s = galleryReducer(s, { type: 'SLIDE_LOADED', index: 1 });
        s = galleryReducer(s, { type: 'SLIDE_LOADED', index: 4 });
        s = galleryReducer(s, { type: 'SET_SLIDES_COUNT', count: 3 });
        expect([...s.loadedSlides]).toEqual([1]);
    });

    it('updates loop via SET_LOOP', () => {
        const s = state({ loop: true });
        expect(galleryReducer(s, { type: 'SET_LOOP', loop: true })).toBe(s);
        expect(
            galleryReducer(s, { type: 'SET_LOOP', loop: false }).loop,
        ).toBe(false);
    });
});
