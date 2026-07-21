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
    useGalleryInternal,
    useGalleryState,
} from '../../context';
import { usePluginSettings } from '../runtime';
import type {
    LgPlugin,
    PluginContext,
    SlideWrapperProps,
} from '../types';

/**
 * Zoom plugin (2.x `lg-zoom`): toolbar buttons, double-click/tap point
 * zoom, pinch, pan-when-zoomed. Same performance contract as the core
 * gestures (plan 004): pinch/pan write transforms straight to the DOM;
 * React state changes only on discrete commits (button step, gesture end).
 *
 * DOM deviation vs 2.x (noted for the 007 parity matrix): transforms live
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
    const settings = usePluginSettings<ZoomSettings>();
    const enabled = settings.zoom && getSlideType(item) === 'image';

    const [zoom, setZoom] = useState<ZoomSlice>(initialZoomSlice);
    const [interactive, setInteractive] = useState(false);
    const panRef = useRef<HTMLDivElement>(null);
    const scaleElRef = useRef<HTMLDivElement>(null);
    const liveRef = useRef<ZoomSlice>(initialZoomSlice);
    const settingsRef = useRef(settings);
    settingsRef.current = settings;
    const pointersRef = useRef(new Map<number, ZoomPan>());
    const pinchRef = useRef<{ startDistance: number; startScale: number } | null>(
        null,
    );
    const panDragRef = useRef<{
        pointerId: number;
        startX: number;
        startY: number;
        startPan: ZoomPan;
        moved: boolean;
    } | null>(null);
    const detachRef = useRef<(() => void) | null>(null);
    const lastTapRef = useRef(0);

    const measure = () => {
        const img = scaleElRef.current?.querySelector('img');
        const slide = panRef.current?.closest<HTMLElement>('.lg-item');
        return {
            imageWidth: img?.offsetWidth ?? 0,
            imageHeight: img?.offsetHeight ?? 0,
            naturalWidth: img?.naturalWidth ?? 0,
            containerWidth: slide?.offsetWidth ?? 0,
            containerHeight: slide?.offsetHeight ?? 0,
        };
    };

    const maxScale = () => {
        const { naturalWidth, imageWidth } = measure();
        return getActualSizeScale(naturalWidth, imageWidth);
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

    const commit = (scale: number, pan: ZoomPan) => {
        const cfg = settingsRef.current;
        const max = maxScale();
        const clamped = clampScale(scale, max, cfg.infiniteZoom);
        const { imageWidth, imageHeight, containerWidth, containerHeight } =
            measure();
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
            clampPan(pan, bounds),
            max,
            cfg.infiniteZoom,
        );
        liveRef.current = next;
        setZoom(next);
        internal.layout.setOuterClass('lg-zoomed', next.zoomed);
        // Core swipe stands down while zoomed (2.x `touchAction`).
        internal.gestureSeam.claim(next.zoomed ? 'zoomSwipe' : null);
    };

    const reset = () => {
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
    useEffect(
        () => () => {
            detachRef.current?.();
            if (liveRef.current.zoomed) {
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
        const slide = panRef.current?.closest<HTMLElement>('.lg-item');
        const rect = slide?.getBoundingClientRect();
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
                const [a, b] = [...pointers.values()];
                const scale = getPinchScale(
                    pinch.startDistance,
                    getPointerDistance(a!, b!),
                    pinch.startScale,
                    maxScale(),
                    settingsRef.current.infiniteZoom,
                );
                applyLive({ ...liveRef.current, scale, zoomed: scale > 1 });
                return;
            }
            const drag = panDragRef.current;
            if (drag && event.pointerId === drag.pointerId) {
                drag.moved = true;
                const { imageWidth, imageHeight, containerWidth, containerHeight } =
                    measure();
                const bounds = getPanBounds(
                    imageWidth,
                    imageHeight,
                    containerWidth,
                    containerHeight,
                    liveRef.current.scale,
                );
                const pan = clampPan(
                    {
                        x: drag.startPan.x + (event.clientX - drag.startX),
                        y: drag.startPan.y + (event.clientY - drag.startY),
                    },
                    bounds,
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
            if (pinchRef.current && pointers.size < 2) {
                pinchRef.current = null;
                // Snap the pinch result into the committed range.
                commit(liveRef.current.scale, liveRef.current.pan);
            }
            const drag = panDragRef.current;
            if (drag && event.pointerId === drag.pointerId) {
                panDragRef.current = null;
                commit(liveRef.current.scale, liveRef.current.pan);
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
        const pointers = pointersRef.current;
        pointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
        });

        if (pointers.size === 2 && event.pointerType === 'touch') {
            const [a, b] = [...pointers.values()];
            pinchRef.current = {
                startDistance: getPointerDistance(a!, b!),
                startScale: liveRef.current.scale,
            };
            panDragRef.current = null;
            internal.gestureSeam.claim('pinch');
            attachWindowListeners();
            return;
        }

        // Double-tap detection for touch (mouse uses onDoubleClick).
        if (event.pointerType === 'touch' && pointers.size === 1) {
            const now = Date.now();
            if (now - lastTapRef.current < 300) {
                lastTapRef.current = 0;
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
                startPan: liveRef.current.pan,
                moved: false,
            };
            attachWindowListeners();
        }
    };

    const onDoubleClick = (event: ReactMouseEvent) => {
        if (!enabled || !interactive || !isCurrent) {
            return;
        }
        toggleActualSize(eventPoint(event));
    };

    if (!enabled) {
        return <>{children}</>;
    }

    const transition = 'transform 0.3s cubic-bezier(0, 0, 0.25, 1)';
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
