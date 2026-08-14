import { describe, expect, it, vi } from 'vitest';

import {
    createHashDriver,
    createHistoryHashDriver,
    createNavigationHashDriver,
    type HashNavigationWindow,
    type NavigationLike,
} from './hash-driver';

function makeHistoryWindow(hash = '#old') {
    const replaceState = vi.fn();
    const listeners = new Map<string, () => void>();
    const win: HashNavigationWindow = {
        location: { hash, pathname: '/gallery', search: '?a=1' },
        history: { replaceState },
        addEventListener: (type, listener) => listeners.set(type, listener),
        removeEventListener: (type) => listeners.delete(type),
    };
    return { win, replaceState, listeners };
}

function makeNavigation(url = 'https://x.test/gallery?a=1#old') {
    const navigate = vi.fn(() => ({
        committed: Promise.resolve(),
        finished: Promise.resolve(),
    }));
    const listeners = new Map<string, () => void>();
    const navigation: NavigationLike = {
        currentEntry: { url },
        navigate,
        addEventListener: (type, listener) => listeners.set(type, listener),
        removeEventListener: (type) => listeners.delete(type),
    };
    return { navigation, navigate, listeners };
}

describe('history hash driver', () => {
    it('replace-writes and clears against the bare URL', () => {
        const { win, replaceState } = makeHistoryWindow();
        const driver = createHistoryHashDriver(win);
        expect(driver.kind).toBe('history');
        expect(driver.getHash()).toBe('#old');

        driver.replaceHash('#lg=g&slide=2');
        expect(replaceState).toHaveBeenLastCalledWith(
            null,
            '',
            '/gallery?a=1#lg=g&slide=2',
        );
        driver.clearHash();
        expect(replaceState).toHaveBeenLastCalledWith(null, '', '/gallery?a=1');
    });

    it('subscribes to hashchange and unsubscribes cleanly', () => {
        const { win, listeners } = makeHistoryWindow();
        const driver = createHistoryHashDriver(win);
        const onChange = vi.fn();
        const off = driver.subscribe(onChange);
        listeners.get('hashchange')!();
        expect(onChange).toHaveBeenCalledTimes(1);
        off();
        expect(listeners.has('hashchange')).toBe(false);
    });
});

describe('navigation hash driver', () => {
    it('reads the hash from the current entry', () => {
        const { win } = makeHistoryWindow('#stale');
        const { navigation } = makeNavigation(
            'https://x.test/gallery?a=1#lg=g&slide=5',
        );
        const driver = createNavigationHashDriver(win, navigation);
        expect(driver.kind).toBe('navigation');
        expect(driver.getHash()).toBe('#lg=g&slide=5');
    });

    it('replace-navigates with entry state — identical URLs to history', () => {
        const { win, replaceState } = makeHistoryWindow();
        const { navigation, navigate } = makeNavigation();
        const driver = createNavigationHashDriver(win, navigation);

        driver.replaceHash('#lg=g&slide=2');
        expect(navigate).toHaveBeenLastCalledWith('/gallery?a=1#lg=g&slide=2', {
            history: 'replace',
            state: { lgHash: '#lg=g&slide=2' },
        });
        // Clearing goes through replaceState: navigate() to a URL without
        // a fragment is a cross-document navigation, which would reload
        // the page every time a gallery closes.
        driver.clearHash();
        expect(replaceState).toHaveBeenLastCalledWith(null, '', '/gallery?a=1');
        expect(navigate).toHaveBeenCalledTimes(1);

        // URL parity with the history driver (the deep-link format is
        // frozen public API).
        const history = makeHistoryWindow();
        const historyDriver = createHistoryHashDriver(history.win);
        historyDriver.replaceHash('#lg=g&slide=2');
        expect((history.replaceState.mock.calls[0] as unknown[])[2]).toBe(
            (navigate.mock.calls[0] as unknown[])[0],
        );
    });

    it('follows currententrychange and swallows aborted navigations', async () => {
        const { win } = makeHistoryWindow();
        const navigate = vi.fn(() => ({
            committed: Promise.reject(new Error('aborted')),
            finished: Promise.reject(new Error('aborted')),
        }));
        const listeners = new Map<string, () => void>();
        const navigation: NavigationLike = {
            currentEntry: { url: 'https://x.test/gallery' },
            navigate,
            addEventListener: (type, listener) => listeners.set(type, listener),
            removeEventListener: (type) => listeners.delete(type),
        };
        const driver = createNavigationHashDriver(win, navigation);
        driver.replaceHash('#lg=g&slide=1');
        // Rejections handled — an unhandled rejection would fail the run.
        await Promise.resolve();

        const onChange = vi.fn();
        const off = driver.subscribe(onChange);
        listeners.get('currententrychange')!();
        expect(onChange).toHaveBeenCalledTimes(1);
        off();
        expect(listeners.has('currententrychange')).toBe(false);
    });
});

describe('createHashDriver selection', () => {
    it('auto picks navigation when capable, history otherwise', () => {
        const bare = makeHistoryWindow();
        expect(createHashDriver(bare.win).kind).toBe('history');

        const { navigation } = makeNavigation();
        const win = { ...makeHistoryWindow().win, navigation };
        expect(createHashDriver(win).kind).toBe('navigation');
    });

    it('honors explicit preferences, falling back when unsupported', () => {
        const { navigation } = makeNavigation();
        const win = { ...makeHistoryWindow().win, navigation };
        expect(createHashDriver(win, 'history').kind).toBe('history');
        expect(createHashDriver(win, 'navigation').kind).toBe('navigation');
        // Explicit navigation preference without support → never
        // load-bearing, quietly the history driver.
        const bare = makeHistoryWindow();
        expect(createHashDriver(bare.win, 'navigation').kind).toBe('history');
    });
});
