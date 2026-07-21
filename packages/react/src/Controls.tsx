import type { ReactElement } from 'react';

import { cx } from './cx';
import {
    useGalleryActions,
    useGallerySettings,
    useGallerySlots,
    useGalleryState,
} from './context';

/**
 * Prev/next buttons. `hideControlOnEnd` disables the button at the ends
 * (only effective without `loop`/`slideEndAnimation` — the settings merge
 * enforces that, 2.x parity).
 */
export function Controls(): ReactElement | null {
    const state = useGalleryState();
    const settings = useGallerySettings();
    const actions = useGalleryActions();
    const slots = useGallerySlots();

    if (!settings.controls) {
        return null;
    }

    const disablePrev =
        !state.loop && settings.hideControlOnEnd && state.currentIndex === 0;
    const disableNext =
        !state.loop &&
        settings.hideControlOnEnd &&
        state.currentIndex === state.slidesCount - 1;

    return (
        <>
            <button
                type="button"
                aria-label={settings.strings.previousSlide}
                className={cx('lg-prev', 'lg-icon', disablePrev && 'disabled')}
                disabled={disablePrev}
                onClick={actions.prevSlide}
            >
                {slots.prevButton?.()}
            </button>
            <button
                type="button"
                aria-label={settings.strings.nextSlide}
                className={cx('lg-next', 'lg-icon', disableNext && 'disabled')}
                disabled={disableNext}
                onClick={actions.nextSlide}
            >
                {slots.nextButton?.()}
            </button>
        </>
    );
}
