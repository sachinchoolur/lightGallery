import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type ReactElement,
    type ReactNode,
} from 'react';
import { getPreloadIndexes, getSlideType } from '@lightgallery/headless';

import { CaptionContent } from './Caption';
import { cx } from './cx';
import {
    useGalleryActions,
    useGalleryInternal,
    useGallerySettings,
    useGalleryState,
} from './context';
import type { OriginAnimation } from './GalleryOutlet';
import { useEventCallback, useIsoLayoutEffect } from './hooks';
import { IframeSlide } from './IframeSlide';
import { ImageSlide } from './ImageSlide';
import {
    resolvePluginSlideContent,
    usePluginContext,
    wrapSlideContent,
} from './plugins/runtime';
import type { GalleryItem } from './types';

export interface SlideProps {
    index: number;
    item: GalleryItem | undefined;
    isShown: boolean;
    position: 'prev' | 'next' | undefined;
    inProgress: boolean;
    originAnim: OriginAnimation | null;
}

/**
 * One `.lg-item`. Content mounts lazily (2.x parity): the current slide loads
 * immediately; neighbors within `preload` load once the current slide's media
 * completes; once loaded, a slide keeps its content for as long as it stays
 * in the DOM window. The vanilla CSS shows the loading spinner until
 * `lg-complete` lands.
 */
export function Slide({
    index,
    item,
    isShown,
    position,
    inProgress,
    originAnim,
}: SlideProps): ReactElement {
    const state = useGalleryState();
    const settings = useGallerySettings();
    const actions = useGalleryActions();
    const internal = useGalleryInternal();

    const [error, setError] = useState(false);

    const isCurrent = state.currentIndex === index;
    const completed = state.loadedSlides.has(index) || error;
    const currentLoaded = state.loadedSlides.has(state.currentIndex);
    const inPreloadRange = useMemo(
        () =>
            getPreloadIndexes(
                state.currentIndex,
                settings.preload,
                state.slidesCount,
            ).indexOf(index) !== -1,
        [state.currentIndex, settings.preload, state.slidesCount, index],
    );
    const stickyLoadRef = useRef(false);
    // Sticky content survives `state.open` flipping false at close-START:
    // the close flight animates this slide back to the thumbnail, and an
    // `open`-gated unmount would fly an EMPTY item (invisible close).
    // Teardown belongs to the item's own unmount once the close settles
    // (Slides `cleared`) — the moment 2.x empties `$inner`.
    const shouldLoad =
        stickyLoadRef.current ||
        (state.open && (isCurrent || (currentLoaded && inPreloadRange)));
    if (shouldLoad) {
        stickyLoadRef.current = true;
    }

    // 2.x afterAppendSlide: fired once when the slide's content mounts.
    const appendedRef = useRef(false);
    useEffect(() => {
        if (shouldLoad && !appendedRef.current) {
            appendedRef.current = true;
            internal.emit('onAfterAppendSlide', { index });
            if (settings.captionPosition === 'slide') {
                internal.emit('onAfterAppendSubHtml', { index });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldLoad]);

    const handleLoad = useEventCallback(() => {
        if (state.loadedSlides.has(index)) {
            return;
        }
        const isFirstSlide = !state.galleryOn;
        const complete = () => {
            actions.dispatch({ type: 'SLIDE_LOADED', index });
            internal.emit('onSlideItemLoad', {
                index,
                delay: isFirstSlide
                    ? (settings.zoomFromOrigin
                          ? settings.startAnimationDuration
                          : settings.backdropDuration) + 10
                    : 0,
                isFirstSlide,
            });
        };
        // While the zoom-from-origin flight is animating THIS slide,
        // hold the completion: the class/state flip rewrites the flying
        // element's attributes mid-transition, which Safari answers by
        // restarting the transition (visible flicker whenever a cached
        // image loads instantly — e.g. reopening on the same slide).
        // v2 is immune because it flies an isolated dummy image.
        if (isFirstSlide && internal.zoomOriginOpenRef.current) {
            loadSettleRef.current = window.setTimeout(
                complete,
                settings.startAnimationDuration + 120,
            );
            return;
        }
        complete();
    });
    const loadSettleRef = useRef<number | undefined>(undefined);
    useEffect(
        () => () => window.clearTimeout(loadSettleRef.current),
        [],
    );
    const handleError = useEventCallback(() => {
        setError(true);
        actions.dispatch({ type: 'SLIDE_ERROR', index });
    });

    let style: CSSProperties | undefined;
    let originClasses: string | false = false;
    if (originAnim) {
        if (originAnim.stage === 'init') {
            style = {
                transform: originAnim.transform,
                // The origin transform must LAND, never animate: measuring
                // (computeOrigin) forces a recalc that baselines the item
                // at identity, and the `:not(.lg-start-end-progress)`
                // inherit rule would transition identity → origin — a
                // visible fullscreen→thumbnail shrink before the flight.
                // (v2 batches transform + flight classes into one style
                // change event, so it never trips this.)
                transitionProperty: 'none',
            };
        } else {
            style = {
                transform:
                    originAnim.stage === 'run' && !originAnim.closing
                        ? 'translate3d(0, 0, 0)'
                        : originAnim.transform,
                transitionDuration: `${settings.startAnimationDuration}ms`,
            };
            originClasses = originAnim.closing
                ? 'lg-start-end-progress'
                : 'lg-start-progress lg-start-end-progress';
        }
    }

    const slideType = item ? getSlideType(item) : 'image';
    const pluginCtx = usePluginContext();

    // 2.x first-slide dummy (`getDummyImageContent`): while the
    // zoom-from-origin flight runs, the trigger's already-decoded
    // thumbnail flies enlarged in place of the still-loading image; the
    // real image loads beneath it and the dummy drops shortly after the
    // load settles (`loadContentOnFirstSlideLoad`). Layout effect: the
    // dummy must be in the flight's FIRST painted frame.
    const [dummySrc, setDummySrc] = useState<string | null>(null);
    const dummyDoneRef = useRef(false);
    useIsoLayoutEffect(() => {
        if (
            dummyDoneRef.current ||
            dummySrc ||
            !originAnim ||
            originAnim.closing ||
            completed ||
            slideType !== 'image'
        ) {
            return;
        }
        const src = internal.getDummySrc(index);
        if (src) {
            setDummySrc(src);
        } else {
            dummyDoneRef.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originAnim]);
    useEffect(() => {
        if (!dummySrc || !completed) {
            return;
        }
        const timeout = window.setTimeout(() => {
            dummyDoneRef.current = true;
            setDummySrc(null);
        }, 300);
        return () => window.clearTimeout(timeout);
    }, [dummySrc, completed]);
    useEffect(() => {
        if (!dummySrc) {
            return;
        }
        internal.layout.setOuterClass('lg-first-slide-loading', true);
        return () =>
            internal.layout.setOuterClass('lg-first-slide-loading', false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dummySrc]);

    let content: ReactNode = null;
    if (shouldLoad && item && !error) {
        // Plugin slide renderers win (video plugin); undefined passes
        // through to the built-in renderers.
        content = resolvePluginSlideContent(
            internal.plugins,
            item,
            index,
            pluginCtx,
        );
        if (content === undefined) {
            if (slideType === 'image') {
                content = (
                    <ImageSlide
                        item={item}
                        index={index}
                        dummySrc={dummySrc}
                        // v2 appends the real image only once the flight
                        // lands (startAnimationDuration + 100): its fetch
                        // and decode must never jank the flight's frames.
                        deferSrc={
                            !!dummySrc && !!originAnim && !originAnim.closing
                        }
                        onLoad={handleLoad}
                        onError={handleError}
                    />
                );
            } else if (slideType === 'iframe') {
                content = (
                    <IframeSlide
                        item={item}
                        index={index}
                        onLoad={handleLoad}
                    />
                );
            } else {
                // Video items render nothing without the video plugin.
                content = null;
            }
        }
        content = wrapSlideContent(internal.plugins, content, {
            item,
            index,
            isCurrent,
        });
    }

    return (
        <div
            className={cx(
                'lg-item',
                isShown && 'lg-current',
                position === 'prev' && 'lg-prev-slide',
                position === 'next' && 'lg-next-slide',
                inProgress && 'lg-slide-progress',
                shouldLoad && 'lg-loaded',
                completed && 'lg-complete lg-complete_',
                dummySrc && 'lg-first-slide',
                originClasses,
            )}
            style={style}
        >
            {content}
            {error && (
                <span className="lg-error-msg">
                    {settings.strings.mediaLoadingFailed}
                </span>
            )}
            {settings.captionPosition === 'slide' && shouldLoad && item && (
                <div className="lg-sub-html">
                    <CaptionContent item={item} index={index} />
                </div>
            )}
        </div>
    );
}
