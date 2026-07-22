import {
    computed,
    defineComponent,
    h,
    inject,
    onBeforeUnmount,
    onScopeDispose,
    ref,
    shallowRef,
    watch,
    watchEffect,
    type PropType,
} from 'vue';
import {
    applyZoom,
    clampPan,
    clampScale,
    getActualSizeScale,
    getPanBounds,
    getPinchScale,
    getPointerDistance,
    getPointZoomPan,
    getSlideType,
    initialZoomSlice,
    type ZoomPan,
    type ZoomSlice,
} from '@lightgallery/headless';

import {
    LG_PLUGIN_CONTEXT,
    type LgPluginContext,
    type LgVuePlugin,
} from '../types';
import type { LgGalleryItem } from '../../types';

/**
 * Zoom plugin (2.x `lg-zoom`): toolbar buttons, double-click/tap point
 * zoom, pinch, pan-when-zoomed — the gesture-consumer template. Same
 * performance contract as the core gestures: pinch/pan write transforms
 * straight to the DOM; reactivity changes only on discrete commits.
 *
 * DOM deviation vs 2.x (shared with the siblings, noted for the parity
 * matrix): transforms live on two plugin-owned wrapper divs with inline
 * transitions instead of `.lg-img-wrap`/`.lg-image` + `lg-zoomable` CSS.
 */

export interface ZoomStrings {
    zoomIn: string;
    zoomOut: string;
    viewActualSize: string;
}

export interface ZoomSettings {
    /** Zoom increment per zoom-in/out step. */
    scale: number;
    /** Enable/disable the plugin. */
    zoom: boolean;
    /** Allow zooming beyond the image's actual size. */
    infiniteZoom: boolean;
    /** Show the actual-size button. */
    actualSize: boolean;
    /** Show zoom in/out buttons. */
    showZoomInOutIcons: boolean;
    /** Icon classes for the zoom in/out buttons. */
    actualSizeIcons: {
        zoomIn: 'lg-zoom-in' | 'lg-actual-size';
        zoomOut: 'lg-zoom-out' | 'lg-actual-size';
    };
    /** Delay (ms) after a slide loads before zoom interactions arm. */
    enableZoomAfter: number;
    zoomPluginStrings: ZoomStrings;
}

export const zoomSettings: ZoomSettings = {
    scale: 1,
    zoom: true,
    infiniteZoom: true,
    actualSize: true,
    showZoomInOutIcons: false,
    actualSizeIcons: {
        zoomIn: 'lg-zoom-in',
        zoomOut: 'lg-zoom-out',
    },
    enableZoomAfter: 300,
    zoomPluginStrings: {
        zoomIn: 'Zoom in',
        zoomOut: 'Zoom out',
        viewActualSize: 'View actual size',
    },
};

const ZOOM_IN_EVENT = 'lg-zoom-in';
const ZOOM_OUT_EVENT = 'lg-zoom-out';
const ACTUAL_SIZE_EVENT = 'lg-actual-size';
const ZOOM_TRANSITION = 'transform 0.3s cubic-bezier(0, 0, 0.25, 1)';

type ZoomResolved = ZoomSettings & Record<string, unknown>;

export const ZoomToolbar = defineComponent({
    name: 'LgZoomToolbar',
    setup() {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const emitBus = (name: string): void =>
            ctx.events.emit(name, undefined);
        return () => {
            const cfg = ctx.settings.value as unknown as ZoomResolved;
            if (!cfg.zoom) {
                return null;
            }
            return [
                cfg.showZoomInOutIcons
                    ? h('button', {
                          type: 'button',
                          class: `${cfg.actualSizeIcons.zoomIn} lg-icon`,
                          'aria-label': cfg.zoomPluginStrings.zoomIn,
                          onClick: () => emitBus(ZOOM_IN_EVENT),
                      })
                    : null,
                cfg.showZoomInOutIcons
                    ? h('button', {
                          type: 'button',
                          class: `${cfg.actualSizeIcons.zoomOut} lg-icon`,
                          'aria-label': cfg.zoomPluginStrings.zoomOut,
                          onClick: () => emitBus(ZOOM_OUT_EVENT),
                      })
                    : null,
                cfg.actualSize
                    ? h('button', {
                          type: 'button',
                          class: 'lg-actual-size lg-icon',
                          'aria-label':
                              cfg.zoomPluginStrings.viewActualSize,
                          onClick: () => emitBus(ACTUAL_SIZE_EVENT),
                      })
                    : null,
            ];
        };
    },
});

export const ZoomWrapper = defineComponent({
    name: 'LgZoomWrapper',
    props: {
        item: {
            type: Object as PropType<LgGalleryItem>,
            required: true,
        },
        index: { type: Number, required: true },
        isCurrent: { type: Boolean, default: false },
    },
    setup(props, { slots }) {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        const settings = computed(
            () => ctx.settings.value as unknown as ZoomResolved,
        );
        const enabled = computed(
            () =>
                settings.value.zoom &&
                getSlideType(props.item) === 'image',
        );

        const panEl = ref<HTMLElement | null>(null);
        const scaleEl = ref<HTMLElement | null>(null);
        /** Committed slice; live pinch/pan bypasses it (direct writes). */
        const zoom = shallowRef<ZoomSlice>(initialZoomSlice);
        const interactive = ref(false);

        let live: ZoomSlice = initialZoomSlice;
        const pointers = new Map<number, ZoomPan>();
        let pinch: { startDistance: number; startScale: number } | null =
            null;
        let panDrag: {
            pointerId: number;
            startX: number;
            startY: number;
            startPan: ZoomPan;
        } | null = null;
        let detachWindow: (() => void) | null = null;
        let lastTap = 0;
        let armTimer: ReturnType<typeof setTimeout> | null = null;

        function measure(): {
            imageWidth: number;
            imageHeight: number;
            naturalWidth: number;
            containerWidth: number;
            containerHeight: number;
        } {
            const img = scaleEl.value?.querySelector('img');
            const slide =
                panEl.value?.closest<HTMLElement>('.lg-item');
            return {
                imageWidth: img?.offsetWidth ?? 0,
                imageHeight: img?.offsetHeight ?? 0,
                naturalWidth: img?.naturalWidth ?? 0,
                containerWidth: slide?.offsetWidth ?? 0,
                containerHeight: slide?.offsetHeight ?? 0,
            };
        }

        const maxScale = (): number => {
            const { naturalWidth, imageWidth } = measure();
            return getActualSizeScale(naturalWidth, imageWidth);
        };

        /** Live transforms — direct DOM writes, zero reactivity. */
        function applyLive(slice: ZoomSlice): void {
            live = slice;
            if (panEl.value) {
                panEl.value.style.transform = `translate3d(${slice.pan.x}px, ${slice.pan.y}px, 0)`;
            }
            if (scaleEl.value) {
                scaleEl.value.style.transform = `scale3d(${slice.scale}, ${slice.scale}, 1)`;
            }
        }

        function commit(scale: number, pan: ZoomPan): void {
            const cfg = settings.value;
            const max = maxScale();
            const clamped = clampScale(scale, max, cfg.infiniteZoom);
            const {
                imageWidth,
                imageHeight,
                containerWidth,
                containerHeight,
            } = measure();
            const bounds = getPanBounds(
                imageWidth,
                imageHeight,
                containerWidth,
                containerHeight,
                clamped,
            );
            const next = applyZoom(
                live,
                clamped,
                clampPan(pan, bounds),
                max,
                cfg.infiniteZoom,
            );
            // Inline styles first (no flash while the render is pending);
            // the committed ref keeps the bindings in agreement.
            applyLive(next);
            zoom.value = next;
            ctx.layout.setOuterClass('lg-zoomed', next.zoomed);
            // Core swipe stands down while zoomed (2.x `touchAction`).
            ctx.gestureLock.claim(next.zoomed ? 'zoomSwipe' : null);
        }

        function reset(): void {
            pointers.clear();
            pinch = null;
            panDrag = null;
            detachWindow?.();
            detachWindow = null;
            live = initialZoomSlice;
            zoom.value = initialZoomSlice;
            ctx.layout.setOuterClass('lg-zoomed', false);
            ctx.gestureLock.claim(null);
        }

        function stepZoom(delta: number): void {
            const previous = live;
            const target = clampScale(
                previous.scale + delta,
                maxScale(),
                settings.value.infiniteZoom,
            );
            // Zoom about the center: the pan scales with the ratio.
            commit(
                target,
                getPointZoomPan(
                    { x: 0, y: 0 },
                    previous.pan,
                    previous.scale,
                    target,
                ),
            );
        }

        function toggleActualSize(point: ZoomPan): void {
            const previous = live;
            if (previous.zoomed) {
                commit(1, { x: 0, y: 0 });
                return;
            }
            const target = clampScale(maxScale(), maxScale(), true);
            commit(
                target,
                getPointZoomPan(
                    point,
                    previous.pan,
                    previous.scale,
                    target,
                ),
            );
        }

        function eventPoint(event: {
            clientX: number;
            clientY: number;
        }): ZoomPan {
            const slide =
                panEl.value?.closest<HTMLElement>('.lg-item');
            const rect = slide?.getBoundingClientRect();
            if (!rect) {
                return { x: 0, y: 0 };
            }
            return {
                x: event.clientX - (rect.left + rect.width / 2),
                y: event.clientY - (rect.top + rect.height / 2),
            };
        }

        function attachWindowListeners(): void {
            if (detachWindow) {
                return;
            }
            const onMove = (event: PointerEvent): void => {
                if (!pointers.has(event.pointerId)) {
                    return;
                }
                pointers.set(event.pointerId, {
                    x: event.clientX,
                    y: event.clientY,
                });
                if (pinch && pointers.size >= 2) {
                    const [a, b] = [...pointers.values()];
                    const scale = getPinchScale(
                        pinch.startDistance,
                        getPointerDistance(a!, b!),
                        pinch.startScale,
                        maxScale(),
                        settings.value.infiniteZoom,
                    );
                    applyLive({ ...live, scale, zoomed: scale > 1 });
                    return;
                }
                if (panDrag && event.pointerId === panDrag.pointerId) {
                    const {
                        imageWidth,
                        imageHeight,
                        containerWidth,
                        containerHeight,
                    } = measure();
                    const bounds = getPanBounds(
                        imageWidth,
                        imageHeight,
                        containerWidth,
                        containerHeight,
                        live.scale,
                    );
                    applyLive({
                        ...live,
                        pan: clampPan(
                            {
                                x:
                                    panDrag.startPan.x +
                                    (event.clientX - panDrag.startX),
                                y:
                                    panDrag.startPan.y +
                                    (event.clientY - panDrag.startY),
                            },
                            bounds,
                        ),
                    });
                }
            };
            const onUp = (event: PointerEvent): void => {
                if (!pointers.has(event.pointerId)) {
                    return;
                }
                pointers.delete(event.pointerId);
                if (pinch && pointers.size < 2) {
                    pinch = null;
                    // Snap the pinch result into the committed range.
                    commit(live.scale, live.pan);
                }
                if (panDrag && event.pointerId === panDrag.pointerId) {
                    panDrag = null;
                    commit(live.scale, live.pan);
                }
                if (pointers.size === 0) {
                    detachWindow?.();
                    detachWindow = null;
                }
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

        function onPointerDown(event: PointerEvent): void {
            if (!enabled.value || !interactive.value || !props.isCurrent) {
                return;
            }
            pointers.set(event.pointerId, {
                x: event.clientX,
                y: event.clientY,
            });

            if (pointers.size === 2 && event.pointerType === 'touch') {
                const [a, b] = [...pointers.values()];
                pinch = {
                    startDistance: getPointerDistance(a!, b!),
                    startScale: live.scale,
                };
                panDrag = null;
                ctx.gestureLock.claim('pinch');
                attachWindowListeners();
                return;
            }

            // Double-tap detection for touch (mouse uses dblclick).
            if (event.pointerType === 'touch' && pointers.size === 1) {
                const now = Date.now();
                if (now - lastTap < 300) {
                    lastTap = 0;
                    toggleActualSize(eventPoint(event));
                    return;
                }
                lastTap = now;
            }

            if (live.zoomed && pointers.size === 1) {
                event.stopPropagation();
                panDrag = {
                    pointerId: event.pointerId,
                    startX: event.clientX,
                    startY: event.clientY,
                    startPan: live.pan,
                };
                attachWindowListeners();
            }
        }

        function onDoubleClick(event: MouseEvent): void {
            if (!enabled.value || !interactive.value || !props.isCurrent) {
                return;
            }
            toggleActualSize(eventPoint(event));
        }

        // Zoom interactions arm `enableZoomAfter` ms after the slide loads.
        watch(
            [
                computed(() =>
                    ctx.store.loadedSlides.value.has(props.index),
                ),
                enabled,
            ],
            ([loaded, isEnabled]) => {
                if (armTimer !== null) {
                    clearTimeout(armTimer);
                    armTimer = null;
                }
                if (!loaded || !isEnabled) {
                    interactive.value = false;
                    return;
                }
                armTimer = setTimeout(
                    () => (interactive.value = true),
                    settings.value.enableZoomAfter,
                );
            },
            { immediate: true },
        );

        // Toolbar buttons drive the current slide's wrapper via the bus.
        watch(
            [computed(() => props.isCurrent), enabled],
            ([current, isEnabled], _prev, onCleanup) => {
                if (!current || !isEnabled) {
                    return;
                }
                const offs = [
                    ctx.events.on(ZOOM_IN_EVENT, () =>
                        stepZoom(settings.value.scale),
                    ),
                    ctx.events.on(ZOOM_OUT_EVENT, () =>
                        stepZoom(-settings.value.scale),
                    ),
                    ctx.events.on(ACTUAL_SIZE_EVENT, () =>
                        toggleActualSize({ x: 0, y: 0 }),
                    ),
                ];
                onCleanup(() => offs.forEach((off) => off()));
            },
            { immediate: true },
        );

        // Reset when the slide stops being current (2.x parity).
        watch(
            () => props.isCurrent,
            (current) => {
                if (!current) {
                    reset();
                }
            },
        );
        onBeforeUnmount(() => {
            if (armTimer !== null) {
                clearTimeout(armTimer);
            }
            detachWindow?.();
            if (live.zoomed) {
                ctx.layout.setOuterClass('lg-zoomed', false);
                ctx.gestureLock.claim(null);
            }
        });

        return () => {
            if (!enabled.value) {
                return slots.default?.();
            }
            return h(
                'div',
                {
                    ref: panEl,
                    class: 'lg-zoom-pan',
                    style: {
                        position: 'absolute',
                        inset: '0',
                        transform: `translate3d(${zoom.value.pan.x}px, ${zoom.value.pan.y}px, 0)`,
                        transition: ZOOM_TRANSITION,
                    },
                    onPointerdown: onPointerDown,
                    onDblclick: onDoubleClick,
                },
                h(
                    'div',
                    {
                        ref: scaleEl,
                        class: 'lg-zoom-scale',
                        style: {
                            position: 'absolute',
                            inset: '0',
                            transform: `scale3d(${zoom.value.scale}, ${zoom.value.scale}, 1)`,
                            transformOrigin: 'center center',
                            transition: ZOOM_TRANSITION,
                        },
                    },
                    slots.default?.(),
                ),
            );
        };
    },
});

function setupZoom(ctx: LgPluginContext): void {
    watchEffect(() => {
        ctx.layout.setOuterClass(
            'lg-use-transition-for-zoom',
            !!(ctx.settings.value as { zoom?: boolean }).zoom,
        );
    });
    onScopeDispose(() =>
        ctx.layout.setOuterClass('lg-use-transition-for-zoom', false),
    );
}

const Zoom: LgVuePlugin<ZoomSettings> = {
    name: 'zoom',
    defaults: zoomSettings,
    slots: {
        toolbar: ZoomToolbar,
        slideWrapper: ZoomWrapper,
    },
    setup: setupZoom,
};

export default Zoom;
