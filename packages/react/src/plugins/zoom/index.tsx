import {
    useEffect,
    useRef,
    useState,
    type MouseEvent as ReactMouseEvent,
    type PointerEvent as ReactPointerEvent,
    type ReactElement,
} from 'react';
import {
    applyZoom,
    clampPanToStage,
    clampScale,
    getActualSizeScale,
    getPanBounds,
    getRotatedVisualSize,
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
    type VelocitySample,
    type ZoomPan,
    type ZoomSlice,
} from '@lightgallery/headless';

import { runSprings, type SpringTrack } from '../../springRunner';
import {
    useGalleryActions,
    useGalleryInternal,
    useGalleryState,
} from '../../context';
import { usePluginSettings } from '../runtime';
import type { LgPlugin, PluginContext, SlideWrapperProps } from '../types';

/**
 * Zoom plugin (2.x `lg-zoom`): toolbar buttons, double-click/tap point
 * zoom, pinch, pan-when-zoomed. Same performance contract as the core
 * gestures: pinch/pan write transforms straight to the DOM;
 * React state changes only on discrete commits (button step, gesture end).
 *
 * DOM deviation vs 2.x (noted in the parity matrix): transforms live
 * on two plugin-owned wrapper divs with inline transitions instead of
 * `.lg-img-wrap`/`.lg-image` + `lg-zoomable` CSS.
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

const TRANSITION = 'transform 0.3s cubic-bezier(0, 0, 0.25, 1)';
/** 2.x post-gesture settle ease (`lg-zoom-drag-transition`). */
const SETTLE_TRANSITION = 'transform 0.8s cubic-bezier(0, 0, 0.25, 1)';

function isImageTarget(target: unknown): boolean {
    return (
        target instanceof HTMLElement && target.classList.contains('lg-image')
    );
}

const ZOOM_IN_EVENT = 'lg-zoom-in';
const ZOOM_OUT_EVENT = 'lg-zoom-out';
const ACTUAL_SIZE_EVENT = 'lg-actual-size';

function ZoomToolbar(): ReactElement | null {
    const internal = useGalleryInternal();
    const settings = usePluginSettings<ZoomSettings>();
    if (!settings.zoom) {
        return null;
    }
    const emit = (name: string) => internal.events.emit(name, undefined);
    return (
        <>
            {settings.showZoomInOutIcons && (
                <button
                    type="button"
                    aria-label={settings.zoomPluginStrings.zoomIn}
                    className={`${settings.actualSizeIcons.zoomIn} lg-icon`}
                    onClick={() => emit(ZOOM_IN_EVENT)}
                />
            )}
            {settings.showZoomInOutIcons && (
                <button
                    type="button"
                    aria-label={settings.zoomPluginStrings.zoomOut}
                    className={`${settings.actualSizeIcons.zoomOut} lg-icon`}
                    onClick={() => emit(ZOOM_OUT_EVENT)}
                />
            )}
            {settings.actualSize && (
                <button
                    type="button"
                    aria-label={settings.zoomPluginStrings.viewActualSize}
                    className="lg-actual-size lg-icon"
                    onClick={() => emit(ACTUAL_SIZE_EVENT)}
                />
            )}
        </>
    );
}

function ZoomWrapper({
    item,
    index,
    isCurrent,
    children,
}: SlideWrapperProps): ReactElement {
    const state = useGalleryState();
    const internal = useGalleryInternal();
    const actions = useGalleryActions();
    const settings = usePluginSettings<ZoomSettings>();
    const enabled = settings.zoom && getSlideType(item) === 'image';

    const [zoom, setZoom] = useState<ZoomSlice>(initialZoomSlice);
    const [interactive, setInteractive] = useState(false);
    // 2.x transition choreography: default ease for button/double-tap
    // zoom, none while a pinch/pan tracks the fingers, a longer settle
    // ease for the release snap.
    const [transitionMode, setTransitionMode] = useState<'default' | 'settle'>(
        'default',
    );
    const panRef = useRef<HTMLDivElement>(null);
    const scaleElRef = useRef<HTMLDivElement>(null);
    const liveRef = useRef<ZoomSlice>(initialZoomSlice);
    const settingsRef = useRef(settings);
    settingsRef.current = settings;
    const pointersRef = useRef(new Map<number, ZoomPan>());
    const pinchRef = useRef<{
        /** The two pointer ids the pinch is made of — extra resting
         * fingers must never silently re-pair the gesture. */
        ids: [number, number];
        startDistance: number;
        startScale: number;
        startPan: ZoomPan;
        startMid: ZoomPan;
        /** Largest scale the gesture reached — the pinch-to-close guard. */
        maxGestureScale: number;
        /** Midpoint's live position — its travel pans the image 1:1. */
        lastMid: ZoomPan;
        /** Midpoint velocity samples — seed the release springs. */
        midSamples: VelocitySample[];
    } | null>(null);
    const panDragRef = useRef<{
        pointerId: number;
        startX: number;
        startY: number;
        samples: VelocitySample[];
        startPan: ZoomPan;
    } | null>(null);
    const detachRef = useRef<(() => void) | null>(null);
    const cancelSpringRef = useRef<(() => void) | null>(null);
    const lastTapRef = useRef(0);
    const lastTouchToggleRef = useRef(0);

    const measure = () => {
        const img = scaleElRef.current?.querySelector('img');
        const slide = panRef.current?.closest<HTMLElement>('.lg-item');
        // The components strip (thumbnails+caption) below the content
        // box vacates when zoomed — the stage-aware clamps let the
        // image ride up until its bottom edge meets the SCREEN bottom.
        const stage = panRef.current?.closest<HTMLElement>('.lg-content');
        const outer = stage?.closest<HTMLElement>('.lg-outer');
        const stageBottomExtra =
            outer && stage
                ? Math.max(
                      0,
                      outer.getBoundingClientRect().bottom -
                          stage.getBoundingClientRect().bottom,
                  )
                : 0;
        // Bounds math runs on the image's VISUAL box: the rotate
        // plugin's wrapper transform swaps the axes at 90°/270° (and
        // shrinks by its fit scale), which layout offsets don't see.
        const rotateWrap = img?.closest<HTMLElement>('.lg-img-rotate');
        const visual = getRotatedVisualSize(
            img?.offsetWidth ?? 0,
            img?.offsetHeight ?? 0,
            rotateWrap?.style.transform,
        );
        return {
            imageWidth: visual.width,
            imageHeight: visual.height,
            // Unrotated layout width — actual-size scale relates
            // natural pixels to the image's own axis.
            layoutImageWidth: img?.offsetWidth ?? 0,
            naturalWidth: img?.naturalWidth ?? 0,
            containerWidth: slide?.offsetWidth ?? 0,
            containerHeight: slide?.offsetHeight ?? 0,
            stageBottomExtra,
        };
    };

    const maxScale = () => {
        const { naturalWidth, layoutImageWidth } = measure();
        return getActualSizeScale(naturalWidth, layoutImageWidth);
    };

    const setLiveTransition = (value: string) => {
        if (panRef.current) {
            panRef.current.style.transition = value;
        }
        if (scaleElRef.current) {
            scaleElRef.current.style.transition = value;
        }
    };

    const applyLive = (slice: ZoomSlice) => {
        liveRef.current = slice;
        if (panRef.current) {
            panRef.current.style.transform = `translate3d(${slice.pan.x}px, ${slice.pan.y}px, 0)`;
        }
        if (scaleElRef.current) {
            scaleElRef.current.style.transform = `scale3d(${slice.scale}, ${slice.scale}, 1)`;
        }
    };

    const stopSpring = () => {
        cancelSpringRef.current?.();
        cancelSpringRef.current = null;
    };

    // Release settle: the spring drives every frame (transitions stand
    // down); the commit at completion is visually a no-op that restores
    // the button-zoom transition and the committed React state.
    const startSpring = (
        tracks: SpringTrack[],
        onFrame: (values: number[]) => void,
        onDone: () => void,
    ) => {
        stopSpring();
        setLiveTransition('none');
        cancelSpringRef.current = runSprings(tracks, onFrame, () => {
            cancelSpringRef.current = null;
            onDone();
        });
    };

    const commit = (
        scale: number,
        pan: ZoomPan,
        mode: 'default' | 'settle' = 'default',
    ) => {
        setTransitionMode(mode);
        setLiveTransition(mode === 'settle' ? SETTLE_TRANSITION : TRANSITION);
        const cfg = settingsRef.current;
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
            liveRef.current,
            clamped,
            clampPanToStage(pan, bounds, stageBottomExtra),
            max,
            cfg.infiniteZoom,
        );
        // Inline styles first — React's style diffing compares against
        // its own last render, not the live writes, so a commit that
        // matches the previous committed state would otherwise skip the
        // DOM write and strand the gesture's last live transform.
        applyLive(next);
        setZoom(next);
        internal.layout.setOuterClass('lg-zoomed', next.zoomed);
        // Core swipe stands down while zoomed (2.x `touchAction`).
        internal.gestureSeam.claim(next.zoomed ? 'zoomSwipe' : null);
    };

    const reset = () => {
        stopSpring();
        setTransitionMode('default');
        setLiveTransition(TRANSITION);
        pointersRef.current.clear();
        pinchRef.current = null;
        panDragRef.current = null;
        detachRef.current?.();
        detachRef.current = null;
        liveRef.current = initialZoomSlice;
        setZoom(initialZoomSlice);
        internal.layout.setOuterClass('lg-zoomed', false);
        internal.gestureSeam.claim(null);
    };

    const stepZoom = (delta: number) => {
        const previous = liveRef.current;
        const target = clampScale(
            previous.scale + delta,
            maxScale(),
            settingsRef.current.infiniteZoom,
        );
        // Zoom about the center: the pan scales with the ratio.
        const pan = getPointZoomPan(
            { x: 0, y: 0 },
            previous.pan,
            previous.scale,
            target,
        );
        commit(target, pan);
    };

    const toggleActualSize = (point: ZoomPan) => {
        // The double-tap zoom takes over from any settling spring.
        stopSpring();
        const previous = liveRef.current;
        if (previous.zoomed) {
            commit(1, { x: 0, y: 0 });
            return;
        }
        const target = clampScale(maxScale(), maxScale(), true);
        commit(
            target,
            getPointZoomPan(point, previous.pan, previous.scale, target),
        );
    };

    // Zoom interactions arm `enableZoomAfter` ms after the slide loads.
    const loaded = state.loadedSlides.has(index);
    useEffect(() => {
        if (!loaded || !enabled) {
            setInteractive(false);
            return;
        }
        const timer = window.setTimeout(
            () => setInteractive(true),
            settingsRef.current.enableZoomAfter,
        );
        return () => window.clearTimeout(timer);
    }, [loaded, enabled]);

    // Toolbar buttons drive the current slide's wrapper via the event bus.
    useEffect(() => {
        if (!isCurrent || !enabled) {
            return;
        }
        const offs = [
            internal.events.on(ZOOM_IN_EVENT, () =>
                stepZoom(settingsRef.current.scale),
            ),
            internal.events.on(ZOOM_OUT_EVENT, () =>
                stepZoom(-settingsRef.current.scale),
            ),
            internal.events.on(ACTUAL_SIZE_EVENT, () =>
                toggleActualSize({ x: 0, y: 0 }),
            ),
        ];
        return () => offs.forEach((off) => off());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCurrent, enabled]);

    // Reset when the slide stops being current (2.x resets on slide change).
    useEffect(() => {
        if (!isCurrent) {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCurrent]);
    // v2 parity: a release spring finishing at the OLD geometry's clamp
    // target rests out of bounds after a resize/orientation change —
    // stop it and re-clamp into the fresh bounds.
    useEffect(() => {
        if (!enabled || !isCurrent) {
            return;
        }
        const onResize = () => {
            const hadSpring = cancelSpringRef.current !== null;
            const live = liveRef.current;
            if (!hadSpring && !live.zoomed) {
                return;
            }
            stopSpring();
            const target = clampScale(
                live.scale,
                maxScale(),
                settingsRef.current.infiniteZoom,
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
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, isCurrent]);
    useEffect(
        () => () => {
            cancelSpringRef.current?.();
            detachRef.current?.();
            // The seam claim is taken at pinch FORMATION — before
            // `zoomed` is true. Unmounting mid-gesture (close with
            // fingers down) must release it, or core swipe stays stood
            // down after reopen. Guarded to this wrapper's own gesture
            // so an off-window slide unmounting cannot free another
            // slide's live claim.
            if (
                liveRef.current.zoomed ||
                pinchRef.current ||
                panDragRef.current
            ) {
                internal.layout.setOuterClass('lg-zoomed', false);
                internal.gestureSeam.claim(null);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const eventPoint = (event: {
        clientX: number;
        clientY: number;
    }): ZoomPan => {
        // Anchor to the gesture-STABLE content box, not the slide: the
        // slide's rect equals the content rect at rest, but the slide
        // itself transforms during core drags/nav springs — measuring
        // against it would leak the drag displacement 1:1 into the
        // fused pinch pan when a pinch starts mid-drag.
        const stage = panRef.current?.closest<HTMLElement>('.lg-content');
        const rect = stage?.getBoundingClientRect();
        if (!rect) {
            return { x: 0, y: 0 };
        }
        return {
            x: event.clientX - (rect.left + rect.width / 2),
            y: event.clientY - (rect.top + rect.height / 2),
        };
    };

    const attachWindowListeners = () => {
        if (detachRef.current) {
            return;
        }
        const onMove = (event: PointerEvent) => {
            const pointers = pointersRef.current;
            if (!pointers.has(event.pointerId)) {
                return;
            }
            pointers.set(event.pointerId, {
                x: event.clientX,
                y: event.clientY,
            });
            const pinch = pinchRef.current;
            if (pinch && pointers.size >= 2) {
                // Only the tracked pair drives the pinch; a member that
                // just lifted is handled by onUp's re-baseline.
                const a = pointers.get(pinch.ids[0]);
                const b = pointers.get(pinch.ids[1]);
                if (!a || !b) {
                    return;
                }
                // With pinch-to-close armed (setting on, closable, gesture
                // never over fit) the under-fit squeeze is free — the
                // shrink is the close affordance; otherwise it resists
                // with friction.
                const closeArmed =
                    settingsRef.current.pinchToClose &&
                    settingsRef.current.closable &&
                    pinch.maxGestureScale <= 1;
                const scale = getPinchScale(
                    pinch.startDistance,
                    getPointerDistance(a!, b!),
                    pinch.startScale,
                    maxScale(),
                    settingsRef.current.infiniteZoom,
                    closeArmed,
                );
                pinch.maxGestureScale = Math.max(pinch.maxGestureScale, scale);
                // Anchor the zoom to the pinch's focal point and follow
                // the fingers: the midpoint's travel pans the image 1:1
                // (fused zoom-and-pan).
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
                applyLive({
                    ...liveRef.current,
                    scale,
                    pan,
                    zoomed: scale > 1,
                });
                return;
            }
            const drag = panDragRef.current;
            if (drag && event.pointerId === drag.pointerId) {
                drag.samples = pushVelocitySample(drag.samples, {
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
                    liveRef.current.scale,
                );
                const pan = clampPanToStage(
                    {
                        x: drag.startPan.x + (event.clientX - drag.startX),
                        y: drag.startPan.y + (event.clientY - drag.startY),
                    },
                    bounds,
                    stageBottomExtra,
                );
                applyLive({ ...liveRef.current, pan });
            }
        };
        const onUp = (event: PointerEvent) => {
            const pointers = pointersRef.current;
            if (!pointers.has(event.pointerId)) {
                return;
            }
            pointers.delete(event.pointerId);
            const pinch = pinchRef.current;
            if (
                pinch &&
                pinch.ids.includes(event.pointerId) &&
                pointers.size >= 2
            ) {
                // A pair finger lifted while another finger rests:
                // re-baseline onto the surviving pair — silently
                // re-pairing to map order would leap the midpoint 1:1
                // and poison the release velocity.
                const survivor =
                    pinch.ids[0] === event.pointerId
                        ? pinch.ids[1]
                        : pinch.ids[0];
                const otherId = [...pointers.keys()].find(
                    (id) => id !== survivor,
                )!;
                const a = pointers.get(survivor)!;
                const b = pointers.get(otherId)!;
                const mid = eventPoint({
                    clientX: (a.x + b.x) / 2,
                    clientY: (a.y + b.y) / 2,
                });
                pinch.ids = [survivor, otherId];
                pinch.startDistance = getPointerDistance(a, b);
                pinch.startScale = liveRef.current.scale;
                pinch.startPan = liveRef.current.pan;
                pinch.startMid = mid;
                pinch.lastMid = mid;
                pinch.midSamples = [{ x: mid.x, y: mid.y, t: Date.now() }];
                return;
            }
            if (pinch && !pinch.ids.includes(event.pointerId)) {
                // A resting extra finger lifted — the pinch continues.
                return;
            }
            if (pinch && pointers.size < 2) {
                pinchRef.current = null;
                if (
                    shouldCloseOnPinch({
                        scale: liveRef.current.scale,
                        maxGestureScale: pinch.maxGestureScale,
                        pinchToClose: settingsRef.current.pinchToClose,
                        closable: settingsRef.current.closable,
                    })
                ) {
                    // Hand off from fit: the zoom slice resets so a
                    // reopen starts clean; the close animation owns the
                    // rest.
                    commit(1, { x: 0, y: 0 });
                    actions.closeGallery();
                    return;
                }
                // Pinch release snaps into [1, actual size] regardless of
                // infiniteZoom (2.x pinch touchend rule — the setting
                // governs button zoom only). The pan is recomputed through
                // the same focal anchor — carried to the midpoint's last
                // position and projected along its momentum — clamped
                // into the landed scale's bounds. Velocity-seeded springs
                // animate the snap (bounce only where the clamp cut the
                // glide).
                const target = clampScale(
                    liveRef.current.scale,
                    maxScale(),
                    false,
                );
                const {
                    imageWidth,
                    imageHeight,
                    containerWidth,
                    containerHeight,
                    stageBottomExtra,
                } = measure();
                const midVelocity = getWindowedVelocity(
                    pinch.midSamples,
                    Date.now(),
                );
                const basePan = getPinchPan(
                    pinch.lastMid,
                    pinch.startMid,
                    pinch.startPan,
                    pinch.startScale,
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
                        {
                            from: liveRef.current.scale,
                            velocity: 0,
                            target,
                        },
                        {
                            from: liveRef.current.pan.x,
                            velocity: midVelocity.x,
                            target: pan.x,
                            dampingRatio:
                                pan.x !== glide.x ? SPRING_BOUNCE_DAMPING : 1,
                        },
                        {
                            from: liveRef.current.pan.y,
                            velocity: midVelocity.y,
                            target: pan.y,
                            dampingRatio:
                                pan.y !== glide.y ? SPRING_BOUNCE_DAMPING : 1,
                        },
                    ],
                    ([scale, x, y]) =>
                        applyLive({
                            ...liveRef.current,
                            scale: scale!,
                            pan: { x: x!, y: y! },
                            zoomed: scale! > 1,
                        }),
                    () => commit(target, pan),
                );
            }
            const drag = panDragRef.current;
            if (drag && event.pointerId === drag.pointerId) {
                panDragRef.current = null;
                if (event.type !== 'pointerup') {
                    // A canceled pointer settles where it is.
                    commit(liveRef.current.scale, liveRef.current.pan);
                } else {
                    // Project the release momentum, clamp into the pan
                    // bounds, then spring there seeded with the live
                    // velocity — bouncing only against a clamped bound.
                    // The scale settles too (2.x settleIntoBounds): a
                    // plain tap lands here after killing a release
                    // spring mid-glide, and the stranded scale — above
                    // the cap unless infiniteZoom lifts it — would
                    // otherwise survive the commit.
                    const velocity = getWindowedVelocity(
                        drag.samples,
                        Date.now(),
                    );
                    const current = liveRef.current.pan;
                    const targetScale = clampScale(
                        liveRef.current.scale,
                        maxScale(),
                        settingsRef.current.infiniteZoom,
                    );
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
                            targetScale,
                        ),
                        stageBottomExtra,
                    );
                    startSpring(
                        [
                            {
                                from: liveRef.current.scale,
                                velocity: 0,
                                target: targetScale,
                            },
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
                        ([scale, x, y]) =>
                            applyLive({
                                ...liveRef.current,
                                scale: scale!,
                                pan: { x: x!, y: y! },
                                zoomed: scale! > 1,
                            }),
                        () =>
                            commit(targetScale, {
                                x: target.x,
                                y: target.y,
                            }),
                    );
                }
            }
            if (pointers.size === 0) {
                detachRef.current?.();
                detachRef.current = null;
            }
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

    const onPointerDown = (event: ReactPointerEvent) => {
        if (!enabled || !interactive || !isCurrent) {
            return;
        }
        // Grab-in-flight: only a gesture that can take over (a pan on a
        // zoomed image; a forming pinch, below) stops a running settle.
        // A tap on an un-zoomed image must not kill the under-fit reset
        // spring — nothing would restore the stranded position.
        if (liveRef.current.zoomed) {
            stopSpring();
        }
        const pointers = pointersRef.current;
        pointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
        });
        // Every insert gets its removal path: onUp/onCancel must be live
        // for this pointer or the ledger leaks a phantom that corrupts
        // the next gesture.
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
            pinchRef.current = {
                ids,
                startDistance: getPointerDistance(a!, b!),
                startScale: liveRef.current.scale,
                startPan: liveRef.current.pan,
                startMid,
                maxGestureScale: liveRef.current.scale,
                lastMid: startMid,
                midSamples: [{ x: startMid.x, y: startMid.y, t: Date.now() }],
            };
            panDragRef.current = null;
            internal.gestureSeam.claim('pinch');
            setLiveTransition('none');
            return;
        }

        // Double-tap detection for touch (mouse uses onDoubleClick),
        // gated to the image itself (2.x `hasClass('lg-image')`).
        if (
            event.pointerType === 'touch' &&
            pointers.size === 1 &&
            isImageTarget(event.target)
        ) {
            const now = Date.now();
            if (now - lastTapRef.current < 300) {
                lastTapRef.current = 0;
                // 2.x prevents the second touchstart's default: without
                // this the browser synthesizes click + dblclick after the
                // double tap, and onDoubleClick toggles straight back to
                // fit.
                event.preventDefault();
                lastTouchToggleRef.current = now;
                toggleActualSize(eventPoint(event));
                return;
            }
            lastTapRef.current = now;
        }

        if (liveRef.current.zoomed && pointers.size === 1) {
            event.stopPropagation();
            panDragRef.current = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                samples: [
                    { x: event.clientX, y: event.clientY, t: Date.now() },
                ],
                startPan: liveRef.current.pan,
            };
            setLiveTransition('none');
        }
    };

    const onDoubleClick = (event: ReactMouseEvent) => {
        if (!enabled || !interactive || !isCurrent) {
            return;
        }
        if (!isImageTarget(event.target)) {
            return;
        }
        // Synthesized dblclick trailing a touch double-tap (belt for
        // browsers that fire it despite the canceled pointerdown).
        if (Date.now() - lastTouchToggleRef.current < 700) {
            return;
        }
        toggleActualSize(eventPoint(event));
    };

    if (!enabled) {
        return <>{children}</>;
    }

    const transition =
        transitionMode === 'settle' ? SETTLE_TRANSITION : TRANSITION;
    return (
        <div
            ref={panRef}
            className="lg-zoom-pan"
            style={{
                position: 'absolute',
                inset: 0,
                transform: `translate3d(${zoom.pan.x}px, ${zoom.pan.y}px, 0)`,
                transition,
            }}
            onPointerDown={onPointerDown}
            onDoubleClick={onDoubleClick}
        >
            <div
                ref={scaleElRef}
                className="lg-zoom-scale"
                style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `scale3d(${zoom.scale}, ${zoom.scale}, 1)`,
                    transformOrigin: 'center center',
                    transition,
                }}
            >
                {children}
            </div>
        </div>
    );
}

function useZoomPlugin(ctx: PluginContext): void {
    const enabled = !!(ctx.settings as { zoom?: boolean }).zoom;
    const { layout } = ctx;
    useEffect(() => {
        // Decorative in v3 (transitions are inline on the zoom wrappers;
        // 2.x CSS targeted .lg-img-wrap/.lg-image) — kept as a public
        // CSS hook so consumer stylesheets can target zoom-enabled
        // galleries.
        layout.setOuterClass('lg-use-transition-for-zoom', enabled);
        return () => layout.setOuterClass('lg-use-transition-for-zoom', false);
    }, [enabled, layout]);
}

const Zoom: LgPlugin<ZoomSettings> = {
    name: 'zoom',
    defaults: zoomSettings,
    slots: {
        toolbar: ZoomToolbar,
        slideWrapper: ZoomWrapper,
    },
    usePlugin: useZoomPlugin,
};

declare module '../../types' {
    interface LightGalleryPluginSettings {
        zoom: Partial<ZoomSettings>;
    }
}

export default Zoom;
