import {
    onScopeDispose,
    ref,
    watch,
    type Ref,
} from 'vue';

/**
 * Body/document state while the gallery is open (React `useBodyLock` twin):
 * `lg-on` on the html element, optional scrollbar hiding with padding
 * compensation (`lg-overlay-open`), and scroll-position restore on close.
 * Adds and removes symmetrically — cleanup runs on close and on
 * unmount-while-open (watch cleanup + scope dispose).
 */
export function useBodyLock(
    active: Ref<boolean>,
    enabled: Ref<boolean>,
    hideScrollbar: Ref<boolean>,
    resetScrollPosition: Ref<boolean>,
): void {
    let release: (() => void) | null = null;

    const apply = (): void => {
        if (typeof document === 'undefined') {
            return;
        }
        const html = document.documentElement;
        const body = document.body;
        html.classList.add('lg-on');

        const prevScrollX = window.scrollX;
        const prevScrollY = window.scrollY;
        let prevInlinePaddingRight: string | null = null;
        const withScrollbar = hideScrollbar.value;
        if (withScrollbar) {
            prevInlinePaddingRight = body.style.paddingRight;
            const basePadding =
                parseFloat(window.getComputedStyle(body).paddingRight) || 0;
            const scrollbarWidth =
                window.innerWidth - html.getBoundingClientRect().width;
            body.style.paddingRight = `${scrollbarWidth + basePadding}px`;
            body.classList.add('lg-overlay-open');
        }

        release = () => {
            html.classList.remove('lg-on');
            if (withScrollbar) {
                body.style.paddingRight = prevInlinePaddingRight ?? '';
                body.classList.remove('lg-overlay-open');
            } else if (
                resetScrollPosition.value &&
                typeof window.scrollTo === 'function'
            ) {
                window.scrollTo(prevScrollX, prevScrollY);
            }
        };
    };

    watch(
        [active, enabled],
        ([isActive, isEnabled]) => {
            release?.();
            release = null;
            if (isActive && isEnabled) {
                apply();
            }
        },
        { flush: 'post' },
    );
    onScopeDispose(() => {
        release?.();
        release = null;
    });
}

/**
 * `hideBarsDelay` idle behavior (2.x `hideBars`, React `useHideBars` twin):
 * `showBarsAfter` ms after opening, hide the toolbar/controls after
 * `hideBarsDelay` ms of inactivity; any mouse/touch activity on the gallery
 * shows them again. All listeners/timers released on close and dispose.
 */
export function useHideBars(
    active: Ref<boolean>,
    hideBarsDelay: Ref<number>,
    showBarsAfter: Ref<number>,
    target: Ref<HTMLElement | null>,
): Ref<boolean> {
    const hidden = ref(false);
    const EVENTS = ['mousemove', 'click', 'touchstart'] as const;
    let armTimer: ReturnType<typeof setTimeout> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let boundEl: HTMLElement | null = null;

    const onActivity = (): void => {
        hidden.value = false;
        if (hideTimer !== null) {
            clearTimeout(hideTimer);
        }
        hideTimer = setTimeout(
            () => (hidden.value = true),
            hideBarsDelay.value,
        );
    };

    const teardown = (): void => {
        if (armTimer !== null) {
            clearTimeout(armTimer);
            armTimer = null;
        }
        if (hideTimer !== null) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
        if (boundEl) {
            EVENTS.forEach((event) =>
                boundEl!.removeEventListener(event, onActivity),
            );
            boundEl = null;
        }
        hidden.value = false;
    };

    watch(
        active,
        (isActive) => {
            teardown();
            if (!isActive || hideBarsDelay.value <= 0) {
                return;
            }
            armTimer = setTimeout(() => {
                armTimer = null;
                const el = target.value;
                if (!el) {
                    return;
                }
                boundEl = el;
                EVENTS.forEach((event) =>
                    el.addEventListener(event, onActivity),
                );
                onActivity();
            }, showBarsAfter.value);
        },
        { flush: 'post' },
    );
    onScopeDispose(teardown);

    return hidden;
}

/**
 * Visible focusable elements within a container (2.x
 * `getFocusableElements`), for the hand-rolled dialog focus trap — the
 * ADR chose a small local trap over a micro-dependency (no Vue CDK).
 */
export function getFocusableElements(
    container: HTMLElement,
): HTMLElement[] {
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
