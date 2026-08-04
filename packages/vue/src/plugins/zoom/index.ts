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
    clampPanToStage,
    clampScale,
    getActualSizeScale,
    getPanBounds,
    SPRING_BOUNCE_DAMPING,
    getPinchPan,
    getPinchScale,
    getPointerDistance,
    getPointZoomPan,
    project,
    getWindowedVelocity,
    pushVelocitySample,
    getSlideType,
    initialZoomSlice,
    shouldCloseOnPinch,
    type CoreSettings,
    type VelocitySample,
    type ZoomPan,
    type ZoomSlice,
} from '@lightgallery/headless';

import { runSprings, type SpringTrack } from '../../springRunner';
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
/** 2.x post-gesture settle ease (`lg-zoom-drag-transition`). */
const SETTLE_TRANSITION = 'transform 0.8s cubic-bezier(0, 0, 0.25, 1)';

function isImageTarget(target: unknown): boolean {
    return (
        target instanceof HTMLElement && target.classList.contains('lg-image')
    );
}

type ZoomResolved = ZoomSettings &
    Pick<CoreSettings, 'pinchToClose' | 'closable'> &
    Record<string, unknown>;

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
                          'aria-label': cfg.zoomPluginStrings.viewActualSize,
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
            () => settings.value.zoom && getSlideType(props.item) === 'image',
        );

        const panEl = ref<HTMLElement | null>(null);
        const scaleEl = ref<HTMLElement | null>(null);
        /** Committed slice; live pinch/pan bypasses it (direct writes). */
        const zoom = shallowRef<ZoomSlice>(initialZoomSlice);
        const interactive = ref(false);

        let live: ZoomSlice = initialZoomSlice;
        const pointers = new Map<number, ZoomPan>();
        const transitionMode = shallowRef<'default' | 'settle'>('default');
        let pinch: {
            /** The two pointer ids the pinch is made of — extra resting
             * fingers must never silently re-pair the gesture. */
            ids: [number, number];
            startDistance: number;
            startScale: number;
            startPan: ZoomPan;
            startMid: ZoomPan;
            /** Largest scale the gesture reached — pinch-to-close guard. */
            maxGestureScale: number;
            /** Midpoint's live position — its travel pans the image 1:1. */
            lastMid: ZoomPan;
            /** Midpoint velocity samples — seed the release springs. */
            midSamples: VelocitySample[];
        } | null = null;
        let panDrag: {
            pointerId: number;
            startX: number;
            startY: number;
            samples: VelocitySample[];
            startPan: ZoomPan;
        } | null = null;
        let detachWindow: (() => void) | null = null;
        let cancelSpring: (() => void) | null = null;
        let lastTap = 0;
        let lastTouchToggle = 0;
        let armTimer: ReturnType<typeof setTimeout> | null = null;

        function measure(): {
            imageWidth: number;
            imageHeight: number;
            naturalWidth: number;
            containerWidth: number;
            containerHeight: number;
            stageBottomExtra: number;
        } {
            const img = scaleEl.value?.querySelector('img');
            const slide = panEl.value?.closest<HTMLElement>('.lg-item');
            // The components strip (thumbnails+caption) below the content
            // box vacates when zoomed — the stage-aware clamps let the
            // image ride up until its bottom edge meets the SCREEN bottom.
            const stage = panEl.value?.closest<HTMLElement>('.lg-inner');
            const outer = stage?.closest<HTMLElement>('.lg-outer');
            const stageBottomExtra =
                outer && stage
                    ? Math.max(
                          0,
                          outer.getBoundingClientRect().bottom -
                              stage.getBoundingClientRect().bottom,
                      )
                    : 0;
            return {
                imageWidth: img?.offsetWidth ?? 0,
                imageHeight: img?.offsetHeight ?? 0,
                naturalWidth: img?.naturalWidth ?? 0,
                containerWidth: slide?.offsetWidth ?? 0,
                containerHeight: slide?.offsetHeight ?? 0,
                stageBottomExtra,
            };
        }

        const maxScale = (): number => {
            const { naturalWidth, imageWidth } = measure();
            return getActualSizeScale(naturalWidth, imageWidth);
        };

        function setLiveTransition(value: string): void {
            if (panEl.value) {
                panEl.value.style.transition = value;
            }
            if (scaleEl.value) {
                scaleEl.value.style.transition = value;
            }
        }

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

        function stopSpring(): void {
            cancelSpring?.();
            cancelSpring = null;
        }

        // Release settle: the spring drives every frame (transitions
        // stand down); the commit at completion is visually a no-op that
        // restores the button-zoom transition and the committed state.
        function startSpring(
            tracks: SpringTrack[],
            onFrame: (values: number[]) => void,
            onDone: () => void,
        ): void {
            stopSpring();
            setLiveTransition('none');
            cancelSpring = runSprings(tracks, onFrame, () => {
                cancelSpring = null;
                onDone();
            });
        }

        function commit(
            scale: number,
            pan: ZoomPan,
            mode: 'default' | 'settle' = 'default',
        ): void {
            transitionMode.value = mode;
            setLiveTransition(
                mode === 'settle' ? SETTLE_TRANSITION : ZOOM_TRANSITION,
            );
            const cfg = settings.value;
            const max = maxScale();
            const clamped = clampScale(scale, max, cfg.infiniteZoom);
            const {
                imageWidth,
                imageHeight,
                containerWidth,
                containerHeight,
                stageBottomExtra,
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
                clampPanToStage(pan, bounds, stageBottomExtra),
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
            stopSpring();
            transitionMode.value = 'default';
            setLiveTransition(ZOOM_TRANSITION);
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
            // The double-tap zoom takes over from any settling spring.
            stopSpring();
            const previous = live;
            if (previous.zoomed) {
                commit(1, { x: 0, y: 0 });
                return;
            }
            const target = clampScale(maxScale(), maxScale(), true);
            commit(
                target,
                getPointZoomPan(point, previous.pan, previous.scale, target),
            );
        }

        function eventPoint(event: {
            clientX: number;
            clientY: number;
        }): ZoomPan {
            // Anchor to the gesture-STABLE inner box, not the slide:
            // the slide's rect equals it at rest, but the slide itself
            // transforms during core drags/nav springs — measuring
            // against it would leak the drag displacement 1:1 into the
            // fused pinch pan when a pinch starts mid-drag.
            const stage = panEl.value?.closest<HTMLElement>('.lg-inner');
            const rect = stage?.getBoundingClientRect();
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
                    // Only the tracked pair drives the pinch; a member
                    // that just lifted is handled by onUp's re-baseline.
                    const a = pointers.get(pinch.ids[0]);
                    const b = pointers.get(pinch.ids[1]);
                    if (!a || !b) {
                        return;
                    }
                    // With pinch-to-close armed (setting on, closable,
                    // gesture never over fit) the under-fit squeeze is
                    // free — the shrink is the close affordance;
                    // otherwise it resists with friction.
                    const closeArmed =
                        settings.value.pinchToClose &&
                        settings.value.closable &&
                        pinch.maxGestureScale <= 1;
                    const scale = getPinchScale(
                        pinch.startDistance,
                        getPointerDistance(a!, b!),
                        pinch.startScale,
                        maxScale(),
                        settings.value.infiniteZoom,
                        closeArmed,
                    );
                    pinch.maxGestureScale = Math.max(
                        pinch.maxGestureScale,
                        scale,
                    );
                    // Anchor the zoom to the pinch's focal point and
                    // follow the fingers: the midpoint's travel pans the
                    // image 1:1 (fused zoom-and-pan).
                    const currentMid = eventPoint({
                        clientX: (a!.x + b!.x) / 2,
                        clientY: (a!.y + b!.y) / 2,
                    });
                    pinch.lastMid = currentMid;
                    pinch.midSamples = pushVelocitySample(pinch.midSamples, {
                        x: currentMid.x,
                        y: currentMid.y,
                        t: Date.now(),
                    });
                    const pan = getPinchPan(
                        currentMid,
                        pinch.startMid,
                        pinch.startPan,
                        pinch.startScale,
                        scale,
                    );
                    applyLive({ ...live, scale, pan, zoomed: scale > 1 });
                    return;
                }
                if (panDrag && event.pointerId === panDrag.pointerId) {
                    panDrag.samples = pushVelocitySample(panDrag.samples, {
                        x: event.clientX,
                        y: event.clientY,
                        t: Date.now(),
                    });
                    const {
                        imageWidth,
                        imageHeight,
                        containerWidth,
                        containerHeight,
                        stageBottomExtra,
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
                        pan: clampPanToStage(
                            {
                                x:
                                    panDrag.startPan.x +
                                    (event.clientX - panDrag.startX),
                                y:
                                    panDrag.startPan.y +
                                    (event.clientY - panDrag.startY),
                            },
                            bounds,
                            stageBottomExtra,
                        ),
                    });
                }
            };
            const onUp = (event: PointerEvent): void => {
                if (!pointers.has(event.pointerId)) {
                    return;
                }
                pointers.delete(event.pointerId);
                const endedPinch = pinch;
                if (
                    endedPinch &&
                    endedPinch.ids.includes(event.pointerId) &&
                    pointers.size >= 2
                ) {
                    // A pair finger lifted while another finger rests:
                    // re-baseline onto the surviving pair — silently
                    // re-pairing to map order would leap the midpoint
                    // 1:1 and poison the release velocity.
                    const survivor =
                        endedPinch.ids[0] === event.pointerId
                            ? endedPinch.ids[1]
                            : endedPinch.ids[0];
                    const otherId = [...pointers.keys()].find(
                        (id) => id !== survivor,
                    )!;
                    const a = pointers.get(survivor)!;
                    const b = pointers.get(otherId)!;
                    const mid = eventPoint({
                        clientX: (a.x + b.x) / 2,
                        clientY: (a.y + b.y) / 2,
                    });
                    endedPinch.ids = [survivor, otherId];
                    endedPinch.startDistance = getPointerDistance(a, b);
                    endedPinch.startScale = live.scale;
                    endedPinch.startPan = live.pan;
                    endedPinch.startMid = mid;
                    endedPinch.lastMid = mid;
                    endedPinch.midSamples = [
                        { x: mid.x, y: mid.y, t: Date.now() },
                    ];
                    return;
                }
                if (
                    endedPinch &&
                    !endedPinch.ids.includes(event.pointerId)
                ) {
                    // A resting extra finger lifted — the pinch continues.
                    return;
                }
                if (endedPinch && pointers.size < 2) {
                    pinch = null;
                    if (
                        shouldCloseOnPinch({
                            scale: live.scale,
                            maxGestureScale: endedPinch.maxGestureScale,
                            pinchToClose: settings.value.pinchToClose,
                            closable: settings.value.closable,
                        })
                    ) {
                        // Hand off from fit: the zoom slice resets so a
                        // reopen starts clean; the close animation owns
                        // the rest.
                        commit(1, { x: 0, y: 0 });
                        ctx.actions.closeGallery();
                        return;
                    }
                    // Pinch release snaps into [1, actual size] regardless
                    // of infiniteZoom (2.x pinch touchend rule — the
                    // setting governs button zoom only). The pan is
                    // recomputed through the same focal anchor — carried
                    // to the midpoint's last position and projected along
                    // its momentum — clamped into the landed scale's
                    // bounds. Velocity-seeded springs animate the snap
                    // (bounce only where the clamp cut the glide).
                    const target = clampScale(live.scale, maxScale(), false);
                    const {
                        imageWidth,
                        imageHeight,
                        containerWidth,
                        containerHeight,
                        stageBottomExtra,
                    } = measure();
                    const midVelocity = getWindowedVelocity(
                        endedPinch.midSamples,
                        Date.now(),
                    );
                    const basePan = getPinchPan(
                        endedPinch.lastMid,
                        endedPinch.startMid,
                        endedPinch.startPan,
                        endedPinch.startScale,
                        target,
                    );
                    const glide = {
                        x: basePan.x + project(midVelocity.x),
                        y: basePan.y + project(midVelocity.y),
                    };
                    const pan = clampPanToStage(
                        glide,
                        getPanBounds(
                            imageWidth,
                            imageHeight,
                            containerWidth,
                            containerHeight,
                            target,
                        ),
                        stageBottomExtra,
                    );
                    startSpring(
                        [
                            { from: live.scale, velocity: 0, target },
                            {
                                from: live.pan.x,
                                velocity: midVelocity.x,
                                target: pan.x,
                                dampingRatio:
                                    pan.x !== glide.x
                                        ? SPRING_BOUNCE_DAMPING
                                        : 1,
                            },
                            {
                                from: live.pan.y,
                                velocity: midVelocity.y,
                                target: pan.y,
                                dampingRatio:
                                    pan.y !== glide.y
                                        ? SPRING_BOUNCE_DAMPING
                                        : 1,
                            },
                        ],
                        ([scale, x, y]) =>
                            applyLive({
                                ...live,
                                scale: scale!,
                                pan: { x: x!, y: y! },
                                zoomed: scale! > 1,
                            }),
                        () => commit(target, pan),
                    );
                }
                const drag = panDrag;
                if (drag && event.pointerId === drag.pointerId) {
                    panDrag = null;
                    if (event.type !== 'pointerup') {
                        // A canceled pointer settles where it is.
                        commit(live.scale, live.pan);
                    } else {
                        // Project the release momentum, clamp into the
                        // pan bounds, then spring there seeded with the
                        // live velocity — bouncing only against a
                        // clamped bound.
                        const velocity = getWindowedVelocity(
                            drag.samples,
                            Date.now(),
                        );
                        const current = live.pan;
                        const {
                            imageWidth,
                            imageHeight,
                            containerWidth,
                            containerHeight,
                            stageBottomExtra,
                        } = measure();
                        const projected = {
                            x: current.x + project(velocity.x),
                            y: current.y + project(velocity.y),
                        };
                        const target = clampPanToStage(
                            projected,
                            getPanBounds(
                                imageWidth,
                                imageHeight,
                                containerWidth,
                                containerHeight,
                                live.scale,
                            ),
                            stageBottomExtra,
                        );
                        startSpring(
                            [
                                {
                                    from: current.x,
                                    velocity: velocity.x,
                                    target: target.x,
                                    dampingRatio:
                                        target.x !== projected.x
                                            ? SPRING_BOUNCE_DAMPING
                                            : 1,
                                },
                                {
                                    from: current.y,
                                    velocity: velocity.y,
                                    target: target.y,
                                    dampingRatio:
                                        target.y !== projected.y
                                            ? SPRING_BOUNCE_DAMPING
                                            : 1,
                                },
                            ],
                            ([x, y]) =>
                                applyLive({
                                    ...live,
                                    pan: { x: x!, y: y! },
                                }),
                            () => commit(live.scale, target),
                        );
                    }
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
            // Grab-in-flight: only a gesture that can take over (a pan
            // on a zoomed image; a forming pinch, below) stops a running
            // settle. A tap on an un-zoomed image must not kill the
            // under-fit reset spring — nothing would restore it.
            if (live.zoomed) {
                stopSpring();
            }
            pointers.set(event.pointerId, {
                x: event.clientX,
                y: event.clientY,
            });
            // Every insert gets its removal path: onUp/onCancel must be
            // live for this pointer or the ledger leaks a phantom that
            // corrupts the next gesture.
            attachWindowListeners();

            if (pointers.size === 2 && event.pointerType === 'touch') {
                // The forming pinch takes over whatever was settling.
                stopSpring();
                const ids = [...pointers.keys()] as [number, number];
                const [a, b] = [...pointers.values()];
                const startMid = eventPoint({
                    clientX: (a!.x + b!.x) / 2,
                    clientY: (a!.y + b!.y) / 2,
                });
                pinch = {
                    ids,
                    startDistance: getPointerDistance(a!, b!),
                    startScale: live.scale,
                    startPan: live.pan,
                    startMid,
                    maxGestureScale: live.scale,
                    lastMid: startMid,
                    midSamples: [
                        { x: startMid.x, y: startMid.y, t: Date.now() },
                    ],
                };
                panDrag = null;
                ctx.gestureLock.claim('pinch');
                setLiveTransition('none');
                return;
            }

            // Double-tap detection for touch (mouse uses dblclick),
            // gated to the image itself (2.x `hasClass('lg-image')`).
            if (
                event.pointerType === 'touch' &&
                pointers.size === 1 &&
                isImageTarget(event.target)
            ) {
                const now = Date.now();
                if (now - lastTap < 300) {
                    lastTap = 0;
                    // 2.x prevents the second touchstart's default:
                    // without this the browser synthesizes click +
                    // dblclick after the double tap, and onDoubleClick
                    // toggles straight back to fit.
                    event.preventDefault();
                    lastTouchToggle = now;
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
                    samples: [
                        { x: event.clientX, y: event.clientY, t: Date.now() },
                    ],
                    startPan: live.pan,
                };
                setLiveTransition('none');
            }
        }

        function onDoubleClick(event: MouseEvent): void {
            if (!enabled.value || !interactive.value || !props.isCurrent) {
                return;
            }
            if (!isImageTarget(event.target)) {
                return;
            }
            // Synthesized dblclick trailing a touch double-tap (belt for
            // browsers that fire it despite the canceled pointerdown).
            if (Date.now() - lastTouchToggle < 700) {
                return;
            }
            toggleActualSize(eventPoint(event));
        }

        // Zoom interactions arm `enableZoomAfter` ms after the slide loads.
        watch(
            [
                computed(() => ctx.store.loadedSlides.value.has(props.index)),
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
        // v2 parity: a release spring finishing at the OLD geometry's
        // clamp target rests out of bounds after a resize/orientation
        // change — stop it and re-clamp into the fresh bounds.
        function onWindowResize(): void {
            const hadSpring = cancelSpring !== null;
            if (!props.isCurrent || (!hadSpring && !live.zoomed)) {
                return;
            }
            stopSpring();
            const cfg = ctx.settings.value as unknown as {
                infiniteZoom: boolean;
            };
            const target = clampScale(
                live.scale,
                maxScale(),
                cfg.infiniteZoom,
            );
            const {
                imageWidth,
                imageHeight,
                containerWidth,
                containerHeight,
                stageBottomExtra,
            } = measure();
            const pan = clampPanToStage(
                live.pan,
                getPanBounds(
                    imageWidth,
                    imageHeight,
                    containerWidth,
                    containerHeight,
                    target,
                ),
                stageBottomExtra,
            );
            commit(target, pan);
        }
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', onWindowResize);
        }

        onBeforeUnmount(() => {
            window.removeEventListener('resize', onWindowResize);
            if (armTimer !== null) {
                clearTimeout(armTimer);
            }
            stopSpring();
            detachWindow?.();
            // The lock is claimed at pinch FORMATION — before `zoomed`
            // is true. Unmounting mid-gesture (close with fingers down)
            // must release it, or core swipe stays stood down after
            // reopen. Guarded to this wrapper's own gesture so an
            // off-window slide unmounting cannot free another slide's
            // live claim.
            if (live.zoomed || pinch || panDrag) {
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
                        transition:
                            transitionMode.value === 'settle'
                                ? SETTLE_TRANSITION
                                : ZOOM_TRANSITION,
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
                            transition:
                                transitionMode.value === 'settle'
                                    ? SETTLE_TRANSITION
                                    : ZOOM_TRANSITION,
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
        // Decorative in v3 (transitions are inline on the zoom wrappers;
        // 2.x CSS targeted .lg-img-wrap/.lg-image) — kept as a public
        // CSS hook so consumer stylesheets can target zoom-enabled
        // galleries.
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
