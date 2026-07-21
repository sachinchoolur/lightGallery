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
    return (
        <div className="lg-counter" role="status" aria-live="polite">
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
