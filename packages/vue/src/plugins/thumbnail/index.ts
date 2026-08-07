import {
    computed,
    defineComponent,
    h,
    inject,
    onBeforeUnmount,
    onMounted,
    onScopeDispose,
    ref,
    watch,
    watchEffect,
} from 'vue';
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

import { runSprings } from '../../springRunner';
import {
    LG_PLUGIN_CONTEXT,
    type LgPluginContext,
    type LgVuePlugin,
} from '../types';
import type { LgGalleryItem } from '../../types';

/**
 * Thumbnail plugin (2.x `lg-thumbnail`): footer strip + toggle button —
 * the slot+state template the other plugins copy. Same headless math as
 * the sibling tracks.
 */

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
    /**
     * @deprecated Set these labels on the core `strings` object instead —
     * an explicitly set key here still wins (alias).
     */
    thumbnailPluginStrings?: Partial<ThumbnailStrings>;
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
};

type ThumbnailResolved = ThumbnailSettings & {
    speed: number;
    allowMediaOverlap: boolean;
    virtualization?: { slides?: number; thumbs?: 'auto' | number };
};

function getThumbSrc(
    item: LgGalleryItem,
    settings: ThumbnailResolved,
): string | undefined {
    const videoInfo = getVideoInfo(item.src, !!item.video);
    if (videoInfo?.youtube && settings.loadYouTubeThumbnail) {
        return `//img.youtube.com/vi/${videoInfo.youtube[1]}/${settings.youTubeThumbSize}.jpg`;
    }
    return item.thumb ?? item.src;
}

export const ThumbnailStrip = defineComponent({
    name: 'LgThumbnailStrip',
    setup() {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const settings = computed(
            () => ctx.settings.value as unknown as ThumbnailResolved,
        );
        const stripWidth = ref(0);
        const translate = ref(0);
        const dragging = ref(false);
        // Fling corridor (plan 010): set at release so the window covers
        // the whole flight path; cleared at settle.
        const corridor = ref<{ from: number; to: number } | null>(null);
        const stripOuter = ref<HTMLElement | null>(null);
        const track = ref<HTMLElement | null>(null);

        const totalWidth = computed(() =>
            getThumbTotalWidth(
                ctx.items.value.length,
                settings.value.thumbWidth,
                settings.value.thumbMargin,
            ),
        );

        // Plan-010 thumbnail windowing: with virtualization.thumbs set,
        // only the visible thumbs plus overscan render; spacers preserve
        // the strip geometry. Keys off the COMMITTED translate — advances
        // at release/slide-change/resize, never per pointermove.
        const thumbWindow = computed(() => {
            const overscan = settings.value.virtualization?.thumbs;
            if (overscan === undefined) {
                return null;
            }
            const geometry = {
                stripWidth: stripWidth.value,
                thumbWidth: settings.value.thumbWidth,
                thumbMargin: settings.value.thumbMargin,
                count: ctx.items.value.length,
                overscan,
            };
            return corridor.value
                ? getThumbCorridorWindow({
                      ...geometry,
                      ...corridor.value,
                  })
                : getThumbWindow({
                      ...geometry,
                      translate: translate.value,
                  });
        });

        // Strip drag + physics state (plan 010): frames write the DOM
        // directly; the reactive translate commits once at settle
        // (windowed strips re-render there).
        let clickable = true;
        let drag: {
            pointerId: number;
            startX: number;
            startTranslate: number;
            moved: boolean;
        } | null = null;
        let detachWindow: (() => void) | null = null;
        let samples: VelocitySample[] = [];
        let cancelSpring: (() => void) | null = null;
        let liveTranslate = 0;
        // The translate scalar lives in logical strip space; in RTL the
        // strip flows right-to-left (lg-rtl.css floats the thumbs right),
        // so the applied sign and the finger mapping mirror together.
        const isRtl = computed(() => ctx.settings.value.direction === 'rtl');
        function toTrackX(value: number): number {
            return isRtl.value ? value : -value;
        }
        function writeTrackTranslate(value: number): void {
            liveTranslate = value;
            if (track.value) {
                track.value.style.transform = `translate3d(${toTrackX(
                    value,
                )}px, 0px, 0px)`;
            }
        }

        // 2.x measures the outer element on open and on resize.
        const measure = (): void => {
            stripWidth.value =
                ctx.refs.getOuter()?.offsetWidth ??
                stripOuter.value?.offsetWidth ??
                0;
        };
        // The strip mounts one commit before `lg-show` lands (persistent
        // container), so the mount measurement can read a hidden 0-width
        // outer — the stale width mis-clamps the pager translate and,
        // when windowed, shrinks the thumb window. Re-measure shortly
        // after the gallery opens, once the container is visible.
        let measureTimer: ReturnType<typeof setTimeout> | null = null;
        watch(
            () => ctx.store.state.value.open,
            (open) => {
                if (!open) {
                    return;
                }
                if (measureTimer) {
                    clearTimeout(measureTimer);
                }
                measureTimer = setTimeout(measure, 50);
            },
        );
        onMounted(() => {
            measure();
            window.addEventListener('resize', measure);
        });
        onBeforeUnmount(() => {
            window.removeEventListener('resize', measure);
            if (measureTimer) {
                clearTimeout(measureTimer);
            }
            detachWindow?.();
            cancelSpring?.();
        });

        // Committed translate also seeds the live (frame-written) value.
        watchEffect(() => {
            liveTranslate = translate.value;
        });

        // Keep the active thumbnail at the pager position.
        watchEffect(() => {
            if (!settings.value.animateThumb) {
                return;
            }
            translate.value = getActiveThumbTranslate(
                ctx.store.currentIndex.value,
                settings.value.thumbWidth,
                settings.value.thumbMargin,
                stripWidth.value,
                totalWidth.value,
                settings.value.currentPagerPosition,
                isRtl.value ? 'rtl' : 'ltr',
            );
        });

        function onPointerDown(event: PointerEvent): void {
            const cfg = settings.value;
            if (
                !cfg.enableThumbDrag ||
                !cfg.animateThumb ||
                totalWidth.value <= stripWidth.value ||
                drag
            ) {
                return;
            }
            event.preventDefault();
            // A press mid-glide takes over from the current position.
            cancelSpring?.();
            cancelSpring = null;
            corridor.value = null;
            samples = pushVelocitySample([], {
                x: event.clientX,
                y: event.clientY,
                t: Date.now(),
            });
            drag = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startTranslate: liveTranslate,
                moved: false,
            };
            dragging.value = true;
            const onMove = (moveEvent: PointerEvent): void => {
                if (!drag || moveEvent.pointerId !== drag.pointerId) {
                    return;
                }
                const delta = moveEvent.clientX - drag.startX;
                if (Math.abs(delta) > 2) {
                    drag.moved = true;
                    clickable = false;
                }
                samples = pushVelocitySample(samples, {
                    x: moveEvent.clientX,
                    y: moveEvent.clientY,
                    t: Date.now(),
                });
                // Elastic: overshoot past the edges compresses instead of
                // clamping dead.
                writeTrackTranslate(
                    getElasticThumbTranslate(
                        drag.startTranslate + (isRtl.value ? delta : -delta),
                        totalWidth.value,
                        stripWidth.value,
                    ),
                );
                // Windowed strips: a long finger drag can outrun the
                // rendered window — one commit recenters it (rare;
                // routine moves stay zero-reactive).
                const rendered = thumbWindow.value;
                if (rendered) {
                    const unit =
                        settings.value.thumbWidth + settings.value.thumbMargin;
                    if (
                        liveTranslate < rendered.start * unit ||
                        liveTranslate + stripWidth.value >
                            (rendered.end + 1) * unit
                    ) {
                        translate.value = clampThumbTranslate(
                            liveTranslate,
                            totalWidth.value,
                            stripWidth.value,
                        );
                    }
                }
            };
            const onUp = (upEvent: PointerEvent): void => {
                if (!drag || upEvent.pointerId !== drag.pointerId) {
                    return;
                }
                detachWindow?.();
                detachWindow = null;
                clickable =
                    Math.abs(upEvent.clientX - drag.startX) <
                    settings.value.thumbnailSwipeThreshold;
                const moved = drag.moved;
                drag = null;

                // Fling: project the release velocity, clamp into the
                // strip bounds, spring there (bounces off the edge; pulls
                // back when released inside the rubber band).
                const pointerVelocityX = getWindowedVelocity(
                    samples,
                    Date.now(),
                ).x;
                const translateVelocity = isRtl.value
                    ? pointerVelocityX
                    : -pointerVelocityX;
                const target = clampThumbTranslate(
                    liveTranslate + project(translateVelocity),
                    totalWidth.value,
                    stripWidth.value,
                );
                if (!moved) {
                    dragging.value = false;
                    translate.value = clampThumbTranslate(
                        liveTranslate,
                        totalWidth.value,
                        stripWidth.value,
                    );
                    return;
                }
                // Windowed strips: render the whole flight corridor
                // before the glide starts — the destination is known at
                // release, so the spring never crosses unrendered thumbs.
                if (thumbWindow.value) {
                    corridor.value = { from: liveTranslate, to: target };
                }
                cancelSpring = runSprings(
                    [
                        {
                            from: liveTranslate,
                            velocity: translateVelocity,
                            target,
                        },
                    ],
                    ([value]: number[]) => writeTrackTranslate(value!),
                    () => {
                        cancelSpring = null;
                        dragging.value = false;
                        corridor.value = null;
                        translate.value = target;
                    },
                );
            };
            window.addEventListener('pointermove', onMove, {
                passive: true,
            });
            window.addEventListener('pointerup', onUp);
            window.addEventListener('pointercancel', onUp);
            detachWindow = () => {
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
                window.removeEventListener('pointercancel', onUp);
            };
        }

        function onThumbClick(index: number): void {
            if (clickable) {
                ctx.actions.goToSlide(index);
            }
            clickable = true;
        }

        return () => {
            const cfg = settings.value;
            if (!cfg.thumbnail) {
                return null;
            }
            return h(
                'div',
                {
                    ref: stripOuter,
                    class: [
                        'lg-thumb-outer',
                        `lg-thumb-align-${cfg.alignThumbnails}`,
                        {
                            'lg-grab': cfg.enableThumbDrag,
                            'lg-dragging lg-grabbing': dragging.value,
                        },
                    ],
                    // The strip lives outside .lg-inner's
                    // touch-action:none, and its pointermove is passive —
                    // without this the browser owns the pan and cancels
                    // the drag (2.x prevented via touchmove).
                    style: { touchAction: 'none' },
                },
                h(
                    'div',
                    {
                        ref: track,
                        class: 'lg-thumb lg-group',
                        style: {
                            width: `${totalWidth.value}px`,
                            position: 'relative',
                            transitionDuration: dragging.value
                                ? '0ms'
                                : `${cfg.speed}ms`,
                            transform: `translate3d(${toTrackX(
                                dragging.value
                                    ? liveTranslate
                                    : translate.value,
                            )}px, 0px, 0px)`,
                        },
                        onPointerdown: onPointerDown,
                    },
                    [
                        ...(thumbWindow.value &&
                        thumbWindow.value.leadingPad > 0
                            ? [
                                  h('div', {
                                      key: 'lead-spacer',
                                      class: 'lg-thumb-spacer',
                                      'aria-hidden': 'true',
                                      style: {
                                          width: `${thumbWindow.value.leadingPad}px`,
                                          height: '1px',
                                          float: isRtl.value ? 'right' : 'left',
                                      },
                                  }),
                              ]
                            : []),
                        ...(thumbWindow.value
                            ? ctx.items.value
                                  .map((item, index) => ({ item, index }))
                                  .slice(
                                      thumbWindow.value.start,
                                      thumbWindow.value.end + 1,
                                  )
                            : ctx.items.value.map((item, index) => ({
                                  item,
                                  index,
                              }))
                        ).map(({ item, index }) =>
                            h(
                                'div',
                                {
                                    key: index,
                                    'data-lg-item-id': index,
                                    class: [
                                        'lg-thumb-item',
                                        {
                                            active:
                                                index ===
                                                ctx.store.currentIndex.value,
                                        },
                                    ],
                                    style: {
                                        width: `${cfg.thumbWidth}px`,
                                        height: cfg.thumbHeight,
                                        [isRtl.value
                                            ? 'marginLeft'
                                            : 'marginRight']: `${cfg.thumbMargin}px`,
                                    },
                                    role: 'button',
                                    tabindex: 0,
                                    'aria-label':
                                        item.alt ?? `Go to slide ${index + 1}`,
                                    'aria-current':
                                        index === ctx.store.currentIndex.value,
                                    onClick: () => onThumbClick(index),
                                    onKeydown: (event: KeyboardEvent) => {
                                        if (
                                            event.key === 'Enter' ||
                                            event.key === ' '
                                        ) {
                                            event.preventDefault();
                                            ctx.actions.goToSlide(index);
                                        }
                                    },
                                },
                                h('img', {
                                    src: getThumbSrc(item, cfg),
                                    alt: item.alt ?? '',
                                    draggable: false,
                                }),
                            ),
                        ),
                        ...(thumbWindow.value &&
                        thumbWindow.value.trailingPad > 0
                            ? [
                                  h('div', {
                                      key: 'trail-spacer',
                                      class: 'lg-thumb-spacer',
                                      'aria-hidden': 'true',
                                      style: {
                                          width: `${thumbWindow.value.trailingPad}px`,
                                          height: '1px',
                                          float: isRtl.value ? 'right' : 'left',
                                      },
                                  }),
                              ]
                            : []),
                    ],
                ),
            );
        };
    },
});

export const ThumbnailToggle = defineComponent({
    name: 'LgThumbnailToggle',
    setup() {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        return () => {
            const cfg = ctx.settings.value as unknown as ThumbnailResolved;
            // 2.x rule: the toggle only exists when media may overlap.
            if (!cfg.thumbnail || !cfg.toggleThumb || !cfg.allowMediaOverlap) {
                return null;
            }
            return h('button', {
                type: 'button',
                class: 'lg-toggle-thumb lg-icon',
                'aria-label':
                    cfg.thumbnailPluginStrings?.toggleThumbnails ??
                    ctx.settings.value.strings.toggleThumbnails,
                onClick: () => ctx.layout.toggleComponents(),
            });
        };
    },
});

function setupThumbnail(ctx: LgPluginContext): void {
    // Outer classes while the plugin is registered.
    watchEffect(() => {
        const cfg = ctx.settings.value as unknown as ThumbnailResolved;
        const enabled = cfg.thumbnail;
        ctx.layout.setOuterClass('lg-has-thumb', enabled);
        ctx.layout.setOuterClass(
            'lg-animate-thumb',
            enabled && cfg.animateThumb,
        );
        ctx.layout.setOuterClass(
            'lg-can-toggle',
            enabled && cfg.toggleThumb && cfg.allowMediaOverlap,
        );
    });
    onScopeDispose(() => {
        ctx.layout.setOuterClass('lg-has-thumb', false);
        ctx.layout.setOuterClass('lg-animate-thumb', false);
        ctx.layout.setOuterClass('lg-can-toggle', false);
    });
}

const Thumbnail: LgVuePlugin<ThumbnailSettings> = {
    name: 'thumbnail',
    defaults: thumbnailSettings,
    slots: {
        components: ThumbnailStrip,
        toolbar: ThumbnailToggle,
    },
    setup: setupThumbnail,
};

export default Thumbnail;
