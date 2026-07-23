import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type RefObject,
} from 'react';

/**
 * Cleanup-tracked timers: every timeout in the package goes through this hook
 * so unmounting (even mid-animation) never leaks a timer. The leak audit
 * suite assumes this discipline.
 */
export interface Timeouts {
    set(fn: () => void, ms: number): number;
    clear(id: number): void;
    clearAll(): void;
}

export function useTimeouts(): Timeouts {
    const idsRef = useRef<Set<number>>(new Set());
    const api = useMemo<Timeouts>(
        () => ({
            set(fn, ms) {
                const id = window.setTimeout(() => {
                    idsRef.current.delete(id);
                    fn();
                }, ms);
                idsRef.current.add(id);
                return id;
            },
            clear(id) {
                window.clearTimeout(id);
                idsRef.current.delete(id);
            },
            clearAll() {
                idsRef.current.forEach((id) => window.clearTimeout(id));
                idsRef.current.clear();
            },
        }),
        [],
    );
    useEffect(() => () => api.clearAll(), [api]);
    return api;
}

/** Stable function identity that always calls the latest render's closure. */
export function useEventCallback<TArgs extends unknown[], TResult>(
    fn: (...args: TArgs) => TResult,
): (...args: TArgs) => TResult {
    const ref = useRef(fn);
    ref.current = fn;
    return useCallback((...args: TArgs) => ref.current(...args), []);
}

function shallowEqual(a: object, b: object): boolean {
    if (a === b) {
        return true;
    }
    const aKeys = Object.keys(a) as Array<keyof typeof a>;
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
        return false;
    }
    return aKeys.every((key) => a[key] === (b as typeof a)[key]);
}

/** Return a referentially stable object as long as it is shallow-equal. */
export function useShallowStable<T extends object>(value: T): T {
    const ref = useRef(value);
    if (ref.current !== value && !shallowEqual(ref.current, value)) {
        ref.current = value;
    }
    return ref.current;
}

/** `useLayoutEffect` that is silent during SSR. */
export const useIsoLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Body/document state while the gallery is open: `lg-on` on the html element,
 * optional scrollbar hiding with padding compensation, and scroll-position
 * restore on close. Adds and removes symmetrically — cleanup runs on close
 * and on unmount-while-open.
 */
export function useBodyLock(
    active: boolean,
    enabled: boolean,
    hideScrollbar: boolean,
    resetScrollPosition: boolean,
): void {
    useEffect(() => {
        if (!active || !enabled) {
            return;
        }
        const html = document.documentElement;
        const body = document.body;
        html.classList.add('lg-on');

        const prevScrollX = window.scrollX;
        const prevScrollY = window.scrollY;
        let prevInlinePaddingRight: string | null = null;
        if (hideScrollbar) {
            prevInlinePaddingRight = body.style.paddingRight;
            const basePadding =
                parseFloat(window.getComputedStyle(body).paddingRight) || 0;
            const scrollbarWidth =
                window.innerWidth -
                html.getBoundingClientRect().width;
            body.style.paddingRight = `${scrollbarWidth + basePadding}px`;
            body.classList.add('lg-overlay-open');
        }

        return () => {
            html.classList.remove('lg-on');
            if (hideScrollbar) {
                body.style.paddingRight = prevInlinePaddingRight ?? '';
                body.classList.remove('lg-overlay-open');
            } else if (
                resetScrollPosition &&
                typeof window.scrollTo === 'function'
            ) {
                window.scrollTo(prevScrollX, prevScrollY);
            }
        };
    }, [active, enabled, hideScrollbar, resetScrollPosition]);
}

/**
 * Visible focusable elements within a container (2.x
 * `getFocusableElements`), for the dialog focus trap.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
    const elements = container.querySelectorAll<HTMLElement>(
        'a[href]:not([disabled]), button:not([disabled]), ' +
            'textarea:not([disabled]), input:not([disabled]), ' +
            'select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    return [...elements].filter((element) => {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
    });
}

/**
 * `hideBarsDelay` idle behavior (2.x `hideBars`): `showBarsAfter` ms after
 * opening, start hiding the toolbar/controls after `hideBarsDelay` ms of
 * inactivity; any mouse/touch activity on the gallery shows them again.
 */
export function useHideBars(
    active: boolean,
    hideBarsDelay: number,
    showBarsAfter: number,
    targetRef: RefObject<HTMLElement | null>,
): boolean {
    const [hidden, setHidden] = useState(false);
    useEffect(() => {
        if (!active || hideBarsDelay <= 0) {
            setHidden(false);
            return;
        }
        const el = targetRef.current;
        if (!el) {
            return;
        }
        let hideTimer: number | undefined;
        const events = ['mousemove', 'click', 'touchstart'] as const;
        const onActivity = () => {
            setHidden(false);
            window.clearTimeout(hideTimer);
            hideTimer = window.setTimeout(() => setHidden(true), hideBarsDelay);
        };
        const armTimer = window.setTimeout(() => {
            events.forEach((event) => el.addEventListener(event, onActivity));
            onActivity();
        }, showBarsAfter);
        return () => {
            window.clearTimeout(armTimer);
            window.clearTimeout(hideTimer);
            events.forEach((event) =>
                el.removeEventListener(event, onActivity),
            );
        };
    }, [active, hideBarsDelay, showBarsAfter, targetRef]);
    return active ? hidden : false;
}
