import type { ReactElement } from 'react';

import {
    useGallerySettings,
    useGallerySlots,
    useGalleryState,
} from './context';

/** Slide counter (`1 / 10`), overridable via `render.counter`. */
export function Counter(): ReactElement | null {
    const state = useGalleryState();
    const settings = useGallerySettings();
    const slots = useGallerySlots();

    if (!settings.counter) {
        return null;
    }
    const current = state.currentIndex + 1;
    const total = state.slidesCount;
    // With the announcer active the counter is decorative — the announcer
    // already conveys the position in a friendlier form.
    const a11yProps = settings.ariaAnnouncements
        ? ({ 'aria-hidden': true } as const)
        : ({ role: 'status', 'aria-live': 'polite' } as const);
    return (
        <div className="lg-counter" {...a11yProps}>
            {slots.counter ? (
                slots.counter(current, total)
            ) : (
                <>
                    <span className="lg-counter-current">{current}</span>
                    {' / '}
                    <span className="lg-counter-all">{total}</span>
                </>
            )}
        </div>
    );
}
