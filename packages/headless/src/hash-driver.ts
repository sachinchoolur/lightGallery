/**
 * URL-hash drivers for the hash plugin (plan 012). The plugin's history
 * side-effects — replace-write the deep link, restore/clear on close,
 * follow back/forward — sit behind one interface with two engines:
 *
 * - `history`: today's behavior (history.replaceState + `hashchange`) —
 *   the default fallback everywhere.
 * - `navigation`: the Navigation API (Baseline Newly Available, Jan
 *   2026) — replace-navigations carry entry state, and back/forward is
 *   observed via `currententrychange`. Strictly a feature-detected
 *   enhancement: nothing here is load-bearing (Safari's missing
 *   `precommitHandler` is irrelevant — we never intercept), and any
 *   missing capability falls back to the history driver.
 *
 * The deep-link URL format (`#lg=<galleryId>&slide=<index|name>`) is
 * public API and identical across drivers — pinned by the parity tests.
 *
 * Everything is structurally typed (the runtimes pass `window`); nothing
 * in this module touches DOM globals directly.
 *
 * Revisit note: flip the docs' default emphasis toward `navigation` once
 * the API reaches Widely Available (~2028 per current projection).
 */

export interface HashDriver {
    /** Which engine this driver runs on (also used by the parity tests). */
    readonly kind: 'history' | 'navigation';
    /** The current URL hash including the leading '#', or ''. */
    getHash(): string;
    /** Replace the current entry's hash (never grows history). */
    replaceHash(hash: string): void;
    /** Replace the current entry with the bare URL (drops the hash). */
    clearHash(): void;
    /**
     * Notify on URL changes the driver did not itself cause is NOT
     * guaranteed — subscribers must be re-entrant-safe (the hash plugin's
     * handlers already are: same-slide jumps no-op and close checks the
     * open flag).
     */
    subscribe(onChange: () => void): () => void;
}

export interface HashHistoryWindow {
    location: { hash: string; pathname: string; search: string };
    history: {
        replaceState(data: unknown, unused: string, url?: string): void;
    };
    addEventListener(type: string, listener: () => void): void;
    removeEventListener(type: string, listener: () => void): void;
}

/** Structural slice of the Navigation API the driver uses. */
export interface NavigationLike {
    currentEntry?: { url?: string | null } | null;
    navigate(
        url: string,
        options?: {
            history?: 'auto' | 'push' | 'replace';
            state?: unknown;
        },
    ): unknown;
    addEventListener(type: string, listener: () => void): void;
    removeEventListener(type: string, listener: () => void): void;
}

export interface HashNavigationWindow extends HashHistoryWindow {
    navigation?: NavigationLike;
}

export type HashDriverPreference = 'auto' | 'history' | 'navigation';

export function createHistoryHashDriver(win: HashHistoryWindow): HashDriver {
    return {
        kind: 'history',
        getHash: () => win.location.hash || '',
        replaceHash: (hash) =>
            win.history.replaceState(
                null,
                '',
                win.location.pathname + win.location.search + hash,
            ),
        clearHash: () =>
            win.history.replaceState(
                null,
                '',
                win.location.pathname + win.location.search,
            ),
        subscribe: (onChange) => {
            win.addEventListener('hashchange', onChange);
            return () => win.removeEventListener('hashchange', onChange);
        },
    };
}

/** Swallow the navigate() result promises — a dismissed/aborted
 *  navigation has nothing to clean up (same posture as the share sheet). */
function settleNavigateResult(result: unknown): void {
    const promises = result as {
        committed?: Promise<unknown>;
        finished?: Promise<unknown>;
    } | null;
    promises?.committed?.catch?.(() => undefined);
    promises?.finished?.catch?.(() => undefined);
}

export function createNavigationHashDriver(
    win: HashHistoryWindow,
    navigation: NavigationLike,
): HashDriver {
    const getHash = (): string => {
        const url = navigation.currentEntry?.url;
        if (typeof url === 'string') {
            const index = url.indexOf('#');
            return index === -1 ? '' : url.slice(index);
        }
        return win.location.hash || '';
    };
    return {
        kind: 'navigation',
        getHash,
        replaceHash: (hash) =>
            settleNavigateResult(
                navigation.navigate(
                    win.location.pathname + win.location.search + hash,
                    { history: 'replace', state: { lgHash: hash } },
                ),
            ),
        clearHash: () =>
            settleNavigateResult(
                navigation.navigate(
                    win.location.pathname + win.location.search,
                    { history: 'replace', state: { lgHash: null } },
                ),
            ),
        subscribe: (onChange) => {
            // currententrychange also fires for the driver's own replace
            // navigations — safe by contract (see HashDriver.subscribe).
            navigation.addEventListener('currententrychange', onChange);
            return () =>
                navigation.removeEventListener('currententrychange', onChange);
        },
    };
}

/**
 * Pick a driver: `navigation` when preferred-or-auto and the Navigation
 * API is present with everything the driver needs; the history driver in
 * every other case (including an explicit `navigation` preference on a
 * browser without support — the enhancement is never load-bearing).
 */
export function createHashDriver(
    win: HashNavigationWindow,
    preference: HashDriverPreference = 'auto',
): HashDriver {
    const navigation = win.navigation;
    const navigationCapable =
        !!navigation &&
        typeof navigation.navigate === 'function' &&
        typeof navigation.addEventListener === 'function' &&
        typeof navigation.removeEventListener === 'function';
    if (preference !== 'history' && navigationCapable) {
        return createNavigationHashDriver(win, navigation);
    }
    return createHistoryHashDriver(win);
}
