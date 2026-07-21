import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
    type ReactElement,
} from 'react';
import {
    clampThumbTranslate,
    getActiveThumbTranslate,
    getThumbTotalWidth,
    getVideoInfo,
    type ThumbPagerPosition,
} from '@lightgallery/headless';

import { cx } from '../../cx';
import {
    useGalleryActions,
    useGalleryInternal,
    useGalleryState,
} from '../../context';
import { usePluginSettings } from '../runtime';
import type { GalleryItem } from '../../types';
import type { LgPlugin, PluginContext } from '../types';

/** Thumbnail plugin (2.x `lg-thumbnail`): footer strip + toggle button. */

export interface ThumbnailStrings {
    toggleThumbnails: string;
}

export interface ThumbnailSettings {
    /** Enable the thumbnail strip. */
    thumbnail: boolean;
    /** Animate the strip to keep the active thumb at the pager position. */
    animateThumb: boolean;
    /** Where the active thumbnail sits in the strip. */
    currentPagerPosition: ThumbPagerPosition;
    /** Strip alignment when the thumbs are narrower than the gallery. */
    alignThumbnails: 'left' | 'middle' | 'right';
    /** Width of each thumbnail (px). */
    thumbWidth: number;
    /** Height of each thumbnail (CSS length). */
    thumbHeight: string;
    /** Spacing between thumbnails (px). */
    thumbMargin: number;
    /** Show the toggle button (needs `allowMediaOverlap`, 2.x rule). */
    toggleThumb: boolean;
    /** Enable strip dragging (mouse and touch, via pointer events). */
    enableThumbDrag: boolean;
    /** Below this drag distance (px) a release still counts as a click. */
    thumbnailSwipeThreshold: number;
    /** Load YouTube thumbs from img.youtube.com. */
    loadYouTubeThumbnail: boolean;
    /** YouTube thumb size suffix (`<n>.jpg`). */
    youTubeThumbSize: number;
    thumbnailPluginStrings: ThumbnailStrings;
}

export const thumbnailSettings: ThumbnailSettings = {
    thumbnail: true,
    animateThumb: true,
    currentPagerPosition: 'middle',
    alignThumbnails: 'middle',
    thumbWidth: 100,
    thumbHeight: '80px',
    thumbMargin: 5,
    toggleThumb: false,
    enableThumbDrag: true,
    thumbnailSwipeThreshold: 10,
    loadYouTubeThumbnail: true,
    youTubeThumbSize: 1,
    thumbnailPluginStrings: {
        toggleThumbnails: 'Toggle thumbnails',
    },
};

function getThumbSrc(
    item: GalleryItem,
    settings: ThumbnailSettings,
): string | undefined {
    const videoInfo = getVideoInfo(item.src, !!item.video);
    if (videoInfo?.youtube && settings.loadYouTubeThumbnail) {
        return `//img.youtube.com/vi/${videoInfo.youtube[1]}/${settings.youTubeThumbSize}.jpg`;
    }
    return item.thumb ?? item.src;
}

function ThumbnailStrip(): ReactElement | null {
    const state = useGalleryState();
    const actions = useGalleryActions();
    const internal = useGalleryInternal();
    const settings = usePluginSettings<ThumbnailSettings>();

    const outerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [stripWidth, setStripWidth] = useState(0);
    const [translate, setTranslate] = useState(0);
    const [dragging, setDragging] = useState(false);
    const translateRef = useRef(0);
    translateRef.current = translate;
    const clickableRef = useRef(true);
    const dragRef = useRef<{
        pointerId: number;
        startX: number;
        startTranslate: number;
        moved: boolean;
    } | null>(null);
    const detachRef = useRef<(() => void) | null>(null);

    const totalWidth = getThumbTotalWidth(
        internal.items.length,
        settings.thumbWidth,
        settings.thumbMargin,
    );

    // Strip width measurement (2.x measures the outer element on open and
    // on resize).
    useLayoutEffect(() => {
        const measure = () =>
            setStripWidth(
                outerRef.current?.parentElement?.closest<HTMLElement>(
                    '.lg-outer',
                )?.offsetWidth ??
                    outerRef.current?.offsetWidth ??
                    0,
            );
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, []);

    // Keep the active thumbnail at the pager position.
    useEffect(() => {
        if (!settings.animateThumb) {
            return;
        }
        setTranslate(
            getActiveThumbTranslate(
                state.currentIndex,
                settings.thumbWidth,
                settings.thumbMargin,
                stripWidth,
                totalWidth,
                settings.currentPagerPosition,
            ),
        );
    }, [
        state.currentIndex,
        stripWidth,
        totalWidth,
        settings.animateThumb,
        settings.thumbWidth,
        settings.thumbMargin,
        settings.currentPagerPosition,
    ]);

    useEffect(
        () => () => {
            detachRef.current?.();
        },
        [],
    );

    const onPointerDown = (event: ReactPointerEvent) => {
        if (
            !settings.enableThumbDrag ||
            !settings.animateThumb ||
            totalWidth <= stripWidth ||
            dragRef.current
        ) {
            return;
        }
        event.preventDefault();
        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startTranslate: translateRef.current,
            moved: false,
        };
        setDragging(true);
        const onMove = (moveEvent: PointerEvent) => {
            const drag = dragRef.current;
            if (!drag || moveEvent.pointerId !== drag.pointerId) {
                return;
            }
            const delta = moveEvent.clientX - drag.startX;
            if (Math.abs(delta) > 2) {
                drag.moved = true;
                clickableRef.current = false;
            }
            const next = clampThumbTranslate(
                drag.startTranslate - delta,
                totalWidth,
                stripWidth,
            );
            translateRef.current = next;
            // Written straight to the DOM per move; committed on release.
            const track = trackRef.current;
            if (track) {
                track.style.transform = `translate3d(-${next}px, 0px, 0px)`;
            }
        };
        const onUp = (upEvent: PointerEvent) => {
            const drag = dragRef.current;
            if (!drag || upEvent.pointerId !== drag.pointerId) {
                return;
            }
            detachRef.current?.();
            detachRef.current = null;
            dragRef.current = null;
            setDragging(false);
            setTranslate(translateRef.current);
            clickableRef.current =
                Math.abs(upEvent.clientX - drag.startX) <
                settings.thumbnailSwipeThreshold;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        detachRef.current = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
        };
    };

    if (!settings.thumbnail) {
        return null;
    }

    return (
        <div
            ref={outerRef}
            className={cx(
                'lg-thumb-outer',
                `lg-thumb-align-${settings.alignThumbnails}`,
                settings.enableThumbDrag && 'lg-grab',
                dragging && 'lg-dragging lg-grabbing',
            )}
        >
            <div
                ref={trackRef}
                className="lg-thumb lg-group"
                style={{
                    width: `${totalWidth}px`,
                    position: 'relative',
                    transitionDuration: dragging
                        ? '0ms'
                        : `${settings.speed}ms`,
                    transform: `translate3d(-${translate}px, 0px, 0px)`,
                }}
                onPointerDown={onPointerDown}
            >
                {internal.items.map((item, index) => (
                    <div
                        key={index}
                        data-lg-item-id={index}
                        className={cx(
                            'lg-thumb-item',
                            index === state.currentIndex && 'active',
                        )}
                        style={{
                            width: `${settings.thumbWidth}px`,
                            height: settings.thumbHeight,
                            marginRight: `${settings.thumbMargin}px`,
                        }}
                        onClick={() => {
                            if (clickableRef.current) {
                                actions.goToSlide(index);
                            }
                            clickableRef.current = true;
                        }}
                    >
                        <img
                            src={getThumbSrc(item, settings)}
                            alt={item.alt ?? ''}
                            draggable={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function ThumbnailToggleButton(): ReactElement | null {
    const internal = useGalleryInternal();
    const settings = usePluginSettings<ThumbnailSettings>();
    // 2.x rule: the toggle only exists when media may overlap the strip.
    if (
        !settings.thumbnail ||
        !settings.toggleThumb ||
        !settings.allowMediaOverlap
    ) {
        return null;
    }
    return (
        <button
            type="button"
            aria-label={settings.thumbnailPluginStrings.toggleThumbnails}
            className="lg-toggle-thumb lg-icon"
            onClick={() => internal.layout.toggleComponents()}
        />
    );
}

function useThumbnailPlugin(ctx: PluginContext): void {
    const settings = ctx.settings as unknown as ThumbnailSettings & {
        allowMediaOverlap: boolean;
    };
    const enabled = settings.thumbnail;
    const animate = settings.animateThumb;
    const canToggle =
        enabled && settings.toggleThumb && settings.allowMediaOverlap;
    const { layout } = ctx;
    useEffect(() => {
        if (!enabled) {
            return;
        }
        layout.setOuterClass('lg-has-thumb', true);
        layout.setOuterClass('lg-animate-thumb', animate);
        layout.setOuterClass('lg-can-toggle', canToggle);
        return () => {
            layout.setOuterClass('lg-has-thumb', false);
            layout.setOuterClass('lg-animate-thumb', false);
            layout.setOuterClass('lg-can-toggle', false);
        };
    }, [enabled, animate, canToggle, layout]);
}

const Thumbnail: LgPlugin<ThumbnailSettings> = {
    name: 'thumbnail',
    defaults: thumbnailSettings,
    slots: {
        components: ThumbnailStrip,
        toolbar: ThumbnailToggleButton,
    },
    usePlugin: useThumbnailPlugin,
};

declare module '../../types' {
    interface LightGalleryPluginSettings {
        thumbnail: Partial<ThumbnailSettings>;
    }
}

export default Thumbnail;
