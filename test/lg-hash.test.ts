/**
 * Hash plugin drivers (plan 012): the History engine (default/fallback)
 * and the Navigation API engine produce identical URLs — the deep-link
 * format is frozen public API.
 */
import '@testing-library/jest-dom';

import lightGallery from '../src';
import { LightGallery } from '../src/lightgallery';
import { LightGallerySettings } from '../src/lg-settings';
import Hash from '../src/plugins/hash/lg-hash';

function initGallery(settings: LightGallerySettings = {}): LightGallery {
    document.body.innerHTML = `<div id="lightGallery">
            <a href="a.png"><img src="a-t.png" alt="a" /></a>
            <a href="b.png"><img src="b-t.png" alt="b" /></a>
            <a href="c.png"><img src="c-t.png" alt="c" /></a>
        </div>`;
    return lightGallery(
        document.getElementById('lightGallery') as HTMLElement,
        {
            plugins: [Hash],
            galleryId: 'test-g',
            speed: 0,
            backdropDuration: 0,
            startAnimationDuration: 0,
            zoomFromOrigin: false,
            ...settings,
        },
    );
}

interface FakeNavigation {
    currentEntry: { url: string };
    navigate: jest.Mock;
    addEventListener: (type: string, listener: () => void) => void;
    removeEventListener: (type: string, listener: () => void) => void;
}

function stubNavigation(): {
    navigation: FakeNavigation;
    fireEntryChange: () => void;
    restore: () => void;
} {
    const listeners = new Set<() => void>();
    const navigation: FakeNavigation = {
        currentEntry: { url: 'http://localhost/' },
        navigate: jest.fn((url: string, _options: unknown) => {
            navigation.currentEntry = {
                url: new URL(url, 'http://localhost/').href,
            };
            // The real API fires currententrychange for replaces too —
            // the plugin handlers must be re-entrant-safe.
            listeners.forEach((listener) => listener());
            return {
                committed: Promise.resolve(),
                finished: Promise.resolve(),
            };
        }),
        addEventListener: (type, listener) => {
            if (type === 'currententrychange') {
                listeners.add(listener);
            }
        },
        removeEventListener: (_type, listener) => listeners.delete(listener),
    };
    Object.defineProperty(window, 'navigation', {
        value: navigation,
        configurable: true,
    });
    return {
        navigation,
        fireEntryChange: () => listeners.forEach((listener) => listener()),
        restore: () => {
            delete (window as { navigation?: unknown }).navigation;
        },
    };
}

describe('hash plugin drivers (vanilla)', () => {
    let instance: LightGallery | undefined;

    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        instance?.destroy();
        instance = undefined;
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        document.body.innerHTML = '';
        window.history.replaceState(null, '', '/');
    });

    it('history driver: writes, follows and restores the hash', () => {
        instance = initGallery();
        instance.openGallery(1);
        jest.advanceTimersByTime(300);
        expect(window.location.hash).toBe('#lg=test-g&slide=1');

        instance.closeGallery();
        jest.advanceTimersByTime(300);
        expect(window.location.hash).toBe('');
    });

    it('navigation driver: identical URLs, follows entry changes', () => {
        const { navigation, fireEntryChange, restore } = stubNavigation();
        try {
            instance = initGallery();
            instance.openGallery(0);
            jest.advanceTimersByTime(300);

            const writes = navigation.navigate.mock.calls as Array<
                [string, { history?: string }]
            >;
            const lastWrite = writes[writes.length - 1]!;
            expect(lastWrite[0]).toContain('#lg=test-g&slide=0');
            expect(lastWrite[1]).toMatchObject({ history: 'replace' });

            // Back/forward: the entry changes → the gallery follows.
            navigation.currentEntry = {
                url: 'http://localhost/#lg=test-g&slide=2',
            };
            fireEntryChange();
            jest.advanceTimersByTime(300);
            expect(instance.index).toBe(2);

            // Entry without the marker → the gallery closes.
            navigation.currentEntry = { url: 'http://localhost/' };
            fireEntryChange();
            jest.advanceTimersByTime(500);
            expect(document.querySelector('.lg-container.lg-show')).toBeNull();
        } finally {
            restore();
        }
    });
});
