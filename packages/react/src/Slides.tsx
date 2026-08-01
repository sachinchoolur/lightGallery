import { useMemo, type ReactElement } from 'react';
import { getSlideIndexesInDom } from '@lightgallery/headless';

import {
    useGalleryInternal,
    useGallerySettings,
    useGalleryState,
} from './context';
import type { OriginAnimation, SlideTimeline } from './GalleryOutlet';
import { Slide } from './Slide';

export interface SlidesProps {
    timeline: SlideTimeline;
    originAnim: OriginAnimation | null;
    /**
     * True once the close animation has fully finished. The `.lg-inner`
     * shell stays mounted (the persistent layer iOS reopens against),
     * but the items unmount — 2.x empties `$inner` at the same moment.
     * Stale items would otherwise keep `lg-current` and flash into the
     * next entrance.
     */
    cleared: boolean;
}

/**
 * Windowed slide mounting: only the slides around the current index (per
 * `numberOfSlideItemsInDom`) exist in the DOM, matching 2.x
 * `organizeSlideItems`. `speed`/`easing` land as inline styles on
 * `.lg-inner`; the vanilla CSS inherits them into the slide transitions.
 */
export function Slides({
    timeline,
    originAnim,
    cleared,
}: SlidesProps): ReactElement {
    const state = useGalleryState();
    const settings = useGallerySettings();
    const internal = useGalleryInternal();

    const indexes = useMemo(
        () =>
            getSlideIndexesInDom(
                state.currentIndex,
                state.previousIndex,
                state.slidesCount,
                settings.numberOfSlideItemsInDom,
                state.loop,
            ).sort((a, b) => a - b),
        [
            state.currentIndex,
            state.previousIndex,
            state.slidesCount,
            settings.numberOfSlideItemsInDom,
            state.loop,
        ],
    );

    return (
        <div
            className="lg-inner"
            ref={(element) => internal.registerElements({ inner: element })}
            style={{
                transitionTimingFunction: settings.easing,
                transitionDuration: `${settings.speed}ms`,
                // Pointer events cannot preventDefault scrolling; this is
                // what keeps the page still during swipes. Pinch is handled
                // by the zoom plugin (005), never by the browser.
                touchAction: 'none',
            }}
        >
            {!cleared &&
                indexes.map((index) => (
                    <Slide
                        key={index}
                        index={index}
                        item={internal.items[index]}
                        isShown={timeline.shownIndex === index}
                        position={timeline.positions[index]}
                        inProgress={timeline.progressIndex === index}
                        originAnim={
                            originAnim?.index === index ? originAnim : null
                        }
                    />
                ))}
        </div>
    );
}
