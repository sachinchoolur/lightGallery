import { describe, expect, it } from 'vitest';

import { createGalleryStore } from './store';

describe('createGalleryStore (ADR spike)', () => {
    it('exposes reducer state through narrow selectors', () => {
        const store = createGalleryStore();
        store.setSlidesCount(3);
        expect(store.isOpen.value).toBe(false);
        expect(store.slidesCount.value).toBe(3);

        store.open(1);
        expect(store.isOpen.value).toBe(true);
        expect(store.currentIndex.value).toBe(1);

        store.next();
        expect(store.currentIndex.value).toBe(2);
        expect(store.previousIndex.value).toBe(1);
        expect(store.slideDirection.value).toBe('next');

        store.close();
        expect(store.isOpen.value).toBe(false);
        // Index survives close (2.x behavior via the shared reducer).
        expect(store.currentIndex.value).toBe(2);
    });

    it('replaces state wholesale per dispatch (shallowRef semantics)', () => {
        const store = createGalleryStore();
        store.setSlidesCount(2);
        const before = store.state.value;
        store.open(0);
        expect(store.state.value).not.toBe(before);
        // No-op actions keep the same object (reducer identity semantics).
        const after = store.state.value;
        store.dispatch({ type: 'SET_LOOP', loop: after.loop });
        expect(store.state.value).toBe(after);
    });

    it('inherits headless gating (transitions block navigation)', () => {
        const store = createGalleryStore();
        store.setSlidesCount(3);
        store.open(0);
        store.dispatch({ type: 'SLIDE_LOADED', index: 0 });
        store.next();
        expect(store.transitioning.value).toBe(true);
        store.next();
        expect(store.currentIndex.value).toBe(1);
        store.dispatch({ type: 'TRANSITION_END' });
        store.next();
        expect(store.currentIndex.value).toBe(2);
    });
});
