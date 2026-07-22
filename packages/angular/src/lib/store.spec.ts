import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { LightGalleryStore } from './store';

function createStore(): LightGalleryStore {
    TestBed.configureTestingModule({ providers: [LightGalleryStore] });
    const store = TestBed.inject(LightGalleryStore);
    store.setSlidesCount(3);
    return store;
}

describe('LightGalleryStore', () => {
    it('exposes reducer state through narrow selectors', () => {
        const store = createStore();
        expect(store.isOpen()).toBe(false);
        expect(store.slidesCount()).toBe(3);

        store.open(1);
        expect(store.isOpen()).toBe(true);
        expect(store.currentIndex()).toBe(1);

        store.next();
        expect(store.currentIndex()).toBe(2);
        expect(store.previousIndex()).toBe(1);
        expect(store.slideDirection()).toBe('next');

        store.close();
        expect(store.isOpen()).toBe(false);
        // Index survives close (2.x behavior via the shared reducer).
        expect(store.currentIndex()).toBe(2);
    });

    it('inherits headless gating (transitions block navigation)', () => {
        const store = createStore();
        store.open(0);
        store.dispatch({ type: 'SLIDE_LOADED', index: 0 });
        store.next();
        expect(store.transitioning()).toBe(true);
        // Blocked while transitioning — same rule as every framework.
        store.next();
        expect(store.currentIndex()).toBe(1);
        store.dispatch({ type: 'TRANSITION_END' });
        store.next();
        expect(store.currentIndex()).toBe(2);
    });
});
