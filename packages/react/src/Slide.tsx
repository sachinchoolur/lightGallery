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
import { useEventCallback } from './hooks';
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
    const shouldLoad =
        state.open &&
        (stickyLoadRef.current ||
            isCurrent ||
            (currentLoaded && inPreloadRange));
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
    });
    const handleError = useEventCallback(() => {
        setError(true);
        actions.dispatch({ type: 'SLIDE_ERROR', index });
    });

    let style: CSSProperties | undefined;
    let originClasses: string | false = false;
    if (originAnim) {
        if (originAnim.stage === 'init') {
            style = { transform: originAnim.transform };
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
