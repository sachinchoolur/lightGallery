import {
    computed,
    defineComponent,
    h,
    inject,
    onBeforeUnmount,
    onMounted,
    onScopeDispose,
    ref,
    watchEffect,
} from 'vue';
import {
    clampThumbTranslate,
    getActiveThumbTranslate,
    getThumbTotalWidth,
    getVideoInfo,
    type ThumbPagerPosition,
} from '@lightgallery/headless';

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

type ThumbnailResolved = ThumbnailSettings & {
    speed: number;
    allowMediaOverlap: boolean;
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
        const stripOuter = ref<HTMLElement | null>(null);
        const track = ref<HTMLElement | null>(null);

        const totalWidth = computed(() =>
            getThumbTotalWidth(
                ctx.items.value.length,
                settings.value.thumbWidth,
                settings.value.thumbMargin,
            ),
        );

        // 2.x measures the outer element on open and on resize.
        const measure = (): void => {
            stripWidth.value =
                ctx.refs.getOuter()?.offsetWidth ??
                stripOuter.value?.offsetWidth ??
                0;
        };
        onMounted(() => {
            measure();
            window.addEventListener('resize', measure);
        });
        onBeforeUnmount(() => {
            window.removeEventListener('resize', measure);
            detachWindow?.();
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
            );
        });

        // Strip drag: transforms written straight to the track per move
        // (the no-reactive-writes-per-move rule); committed on release.
        let clickable = true;
        let drag: {
            pointerId: number;
            startX: number;
            startTranslate: number;
        } | null = null;
        let detachWindow: (() => void) | null = null;

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
            drag = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startTranslate: translate.value,
            };
            dragging.value = true;
            let live = translate.value;
            const onMove = (moveEvent: PointerEvent): void => {
                if (!drag || moveEvent.pointerId !== drag.pointerId) {
                    return;
                }
                const delta = moveEvent.clientX - drag.startX;
                if (Math.abs(delta) > 2) {
                    clickable = false;
                }
                live = clampThumbTranslate(
                    drag.startTranslate - delta,
                    totalWidth.value,
                    stripWidth.value,
                );
                if (track.value) {
                    track.value.style.transform = `translate3d(-${live}px, 0px, 0px)`;
                }
            };
            const onUp = (upEvent: PointerEvent): void => {
                if (!drag || upEvent.pointerId !== drag.pointerId) {
                    return;
                }
                detachWindow?.();
                detachWindow = null;
                dragging.value = false;
                translate.value = live;
                clickable =
                    Math.abs(upEvent.clientX - drag.startX) <
                    settings.value.thumbnailSwipeThreshold;
                drag = null;
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
                            transform: `translate3d(-${translate.value}px, 0px, 0px)`,
                        },
                        onPointerdown: onPointerDown,
                    },
                    ctx.items.value.map((item, index) =>
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
                                    marginRight: `${cfg.thumbMargin}px`,
                                },
                                role: 'button',
                                tabindex: 0,
                                'aria-label':
                                    item.alt ?? `Go to slide ${index + 1}`,
                                'aria-current':
                                    index ===
                                    ctx.store.currentIndex.value,
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
            const cfg = ctx.settings
                .value as unknown as ThumbnailResolved;
            // 2.x rule: the toggle only exists when media may overlap.
            if (
                !cfg.thumbnail ||
                !cfg.toggleThumb ||
                !cfg.allowMediaOverlap
            ) {
                return null;
            }
            return h('button', {
                type: 'button',
                class: 'lg-toggle-thumb lg-icon',
                'aria-label':
                    cfg.thumbnailPluginStrings.toggleThumbnails,
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
