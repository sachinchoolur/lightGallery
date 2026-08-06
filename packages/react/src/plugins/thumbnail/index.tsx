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
    getElasticThumbTranslate,
    getThumbCorridorWindow,
    getThumbTotalWidth,
    getThumbWindow,
    getVideoInfo,
    getWindowedVelocity,
    project,
    pushVelocitySample,
    type ThumbPagerPosition,
    type VelocitySample,
} from '@lightgallery/headless';

import { cx } from '../../cx';
import {
    useGalleryActions,
    useGalleryInternal,
    useGalleryState,
} from '../../context';
import { useEventCallback } from '../../hooks';
import { runSprings } from '../../springRunner';
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
    // Fling corridor (plan 010): set at release so the window covers the
    // whole flight path; cleared at settle.
    const [corridor, setCorridor] = useState<{
        from: number;
        to: number;
    } | null>(null);
    const translateRef = useRef(0);
    if (!dragging) {
        // While a gesture/glide owns the track, the ref is the live
        // (frame-written) value — do not clobber it from stale state.
        translateRef.current = translate;
    }
    const clickableRef = useRef(true);
    const dragRef = useRef<{
        pointerId: number;
        startX: number;
        startTranslate: number;
        moved: boolean;
    } | null>(null);
    const detachRef = useRef<(() => void) | null>(null);
    const samplesRef = useRef<VelocitySample[]>([]);
    const springCancelRef = useRef<(() => void) | null>(null);

    const totalWidth = getThumbTotalWidth(
        internal.items.length,
        settings.thumbWidth,
        settings.thumbMargin,
    );

    // Plan-010 thumbnail windowing: with virtualization.thumbs set, only
    // the visible thumbs plus overscan render; spacers preserve the strip
    // geometry. The window keys off the COMMITTED translate — it advances
    // at release/slide-change/resize, never per pointermove, so the
    // zero-reactivity drag contract holds (overscan covers the in-flight
    // stretch of a drag).
    const thumbsOverscan = settings.virtualization?.thumbs;
    const windowGeometry = {
        stripWidth,
        thumbWidth: settings.thumbWidth,
        thumbMargin: settings.thumbMargin,
        count: internal.items.length,
        overscan: thumbsOverscan,
    };
    const thumbWindow =
        thumbsOverscan !== undefined
            ? corridor
                ? getThumbCorridorWindow({ ...windowGeometry, ...corridor })
                : getThumbWindow({ ...windowGeometry, translate })
            : null;
    const thumbWindowRef = useRef(thumbWindow);
    thumbWindowRef.current = thumbWindow;

    // Strip width measurement (2.x measures the outer element on open and
    // on resize).
    const measureStrip = useEventCallback(() =>
        setStripWidth(
            outerRef.current?.parentElement?.closest<HTMLElement>('.lg-outer')
                ?.offsetWidth ??
                outerRef.current?.offsetWidth ??
                0,
        ),
    );
    useLayoutEffect(() => {
        measureStrip();
        window.addEventListener('resize', measureStrip);
        return () => window.removeEventListener('resize', measureStrip);
    }, [measureStrip]);
    // The strip mounts one commit before `lg-show` lands (persistent
    // container), so the mount measurement can read a hidden 0-width
    // outer — the stale width mis-clamps the pager translate and, when
    // windowed, shrinks the thumb window. Re-measure shortly after the
    // gallery opens, once the container is visible (vanilla measures on
    // beforeOpen for the same reason).
    useEffect(() => {
        if (!state.open) {
            return;
        }
        const timeout = window.setTimeout(measureStrip, 50);
        return () => window.clearTimeout(timeout);
    }, [state.open, measureStrip]);

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
            springCancelRef.current?.();
        },
        [],
    );

    // Strip physics (plan 010): drags rubber-band past the edges, and the
    // release glides on a velocity-seeded spring (the same headless
    // project/spring stack the slide gestures ride). Frames write the DOM
    // directly; state commits once at settle — the windowed strip
    // re-renders there.
    const writeTrackTranslate = (value: number) => {
        translateRef.current = value;
        const track = trackRef.current;
        if (track) {
            track.style.transform = `translate3d(${-value}px, 0px, 0px)`;
        }
    };

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
        // A press mid-glide takes over from the current position.
        springCancelRef.current?.();
        springCancelRef.current = null;
        setCorridor(null);
        samplesRef.current = pushVelocitySample([], {
            x: event.clientX,
            y: event.clientY,
            t: Date.now(),
        });
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
            samplesRef.current = pushVelocitySample(samplesRef.current, {
                x: moveEvent.clientX,
                y: moveEvent.clientY,
                t: Date.now(),
            });
            // Elastic: overshoot past the edges compresses instead of
            // clamping dead.
            writeTrackTranslate(
                getElasticThumbTranslate(
                    drag.startTranslate - delta,
                    totalWidth,
                    stripWidth,
                ),
            );
            // Windowed strips: a long finger drag can outrun the
            // rendered window — one commit recenters it (rare; routine
            // moves stay zero-render).
            const rendered = thumbWindowRef.current;
            if (rendered) {
                const unit = settings.thumbWidth + settings.thumbMargin;
                const live = translateRef.current;
                if (
                    live < rendered.start * unit ||
                    live + stripWidth > (rendered.end + 1) * unit
                ) {
                    setTranslate(
                        clampThumbTranslate(live, totalWidth, stripWidth),
                    );
                }
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
            clickableRef.current =
                Math.abs(upEvent.clientX - drag.startX) <
                settings.thumbnailSwipeThreshold;

            // Fling: project the release velocity to a target, clamp into
            // the strip bounds, and spring there (bounces off the edge
            // when the projection overshoots; pulls back when released
            // inside the rubber band).
            const pointerVelocity = getWindowedVelocity(
                samplesRef.current,
                Date.now(),
            ).x;
            const translateVelocity = -pointerVelocity;
            const target = clampThumbTranslate(
                translateRef.current + project(translateVelocity),
                totalWidth,
                stripWidth,
            );
            if (!drag.moved) {
                setDragging(false);
                setTranslate(
                    clampThumbTranslate(
                        translateRef.current,
                        totalWidth,
                        stripWidth,
                    ),
                );
                return;
            }
            // Windowed strips: render the whole flight corridor before
            // the glide starts — the destination is known at release, so
            // the spring never crosses unrendered thumbs.
            if (thumbWindowRef.current) {
                setCorridor({ from: translateRef.current, to: target });
            }
            springCancelRef.current = runSprings(
                [
                    {
                        from: translateRef.current,
                        velocity: translateVelocity,
                        target,
                    },
                ],
                ([value]) => writeTrackTranslate(value!),
                () => {
                    springCancelRef.current = null;
                    // One commit: drop the drag styling, clear the
                    // corridor and publish the settled translate
                    // (windowed strips re-render here).
                    setDragging(false);
                    setCorridor(null);
                    setTranslate(target);
                },
            );
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
            // The strip lives outside .lg-inner's touch-action:none, and
            // its pointermove is passive — without this the browser owns
            // the pan and cancels the drag (2.x prevented via touchmove).
            style={{ touchAction: 'none' }}
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
                    transform: `translate3d(${-(dragging
                        ? translateRef.current
                        : translate)}px, 0px, 0px)`,
                }}
                onPointerDown={onPointerDown}
            >
                {thumbWindow && thumbWindow.leadingPad > 0 && (
                    <div
                        className="lg-thumb-spacer"
                        aria-hidden="true"
                        style={{
                            width: `${thumbWindow.leadingPad}px`,
                            height: 1,
                            float: 'left',
                        }}
                    />
                )}
                {(thumbWindow
                    ? internal.items
                          .map((item, index) => ({ item, index }))
                          .slice(thumbWindow.start, thumbWindow.end + 1)
                    : internal.items.map((item, index) => ({ item, index }))
                ).map(({ item, index }) => (
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
                        role="button"
                        tabIndex={0}
                        aria-label={item.alt ?? `Go to slide ${index + 1}`}
                        aria-current={index === state.currentIndex}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                actions.goToSlide(index);
                            }
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
                {thumbWindow && thumbWindow.trailingPad > 0 && (
                    <div
                        className="lg-thumb-spacer"
                        aria-hidden="true"
                        style={{
                            width: `${thumbWindow.trailingPad}px`,
                            height: 1,
                            float: 'left',
                        }}
                    />
                )}
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
