import {
    useEffect,
    useRef,
    type PointerEvent as ReactPointerEvent,
    type RefObject,
} from 'react';
import {
    getHorizontalDragTransforms,
    getSwipeAxis,
    getSwipeReleaseVerdict,
    getVerticalDragEffects,
    removePointer,
    resolveSwipeTarget,
    shouldCloseOnVerticalDrag,
    upsertPointer,
    type SlideDirection,
    type SwipeAxis,
} from '@lightgallery/headless';

import {
    useGalleryActions,
    useGalleryInternal,
    useGallerySettings,
    useGalleryState,
} from './context';

/**
 * Swipe/drag gestures (2.x `enableSwipe`/`enableDrag` via pointer events).
 *
 * PERFORMANCE CONTRACT (load-bearing, do not "simplify" into setState): while
 * a pointer moves, transforms are written directly to the slide elements and
 * the backdrop — React renders exactly twice per gesture (position classes at
 * drag start, navigation commit at release), never per move. The pure math
 * lives in `@lightgallery/headless`; this hook only wires pointer events to
 * it and dispatches its verdicts.
 */

interface DragSession {
    pointerId: number;
    isMouse: boolean;
    startX: number;
    startY: number;
    startTime: number;
    lastX: number;
    lastY: number;
    axis: SwipeAxis | undefined;
    moved: boolean;
    /** A second pointer arrived — reserved for the zoom plugin's pinch. */
    suspended: boolean;
    els: {
        current: HTMLElement | null;
        prev: HTMLElement | null;
        next: HTMLElement | null;
        backdrop: HTMLElement | null;
    } | null;
    /** UI-chrome classes we toggled mid-drag and must hand back to React. */
    hidUi: boolean;
}

export interface GalleryGesturesOptions {
    outerRef: RefObject<HTMLDivElement>;
    /** Gestures act only while the gallery is open (not closing). */
    active: boolean;
    /** Assign prev/next position classes around the current slide (1 render). */
    prepareDrag: () => void;
    /** Commit a swipe release to a slide change with fromTouch semantics. */
    commitTouchNavigation: (target: number, direction: SlideDirection) => void;
}

export function useGalleryGestures({
    outerRef,
    active,
    prepareDrag,
    commitTouchNavigation,
}: GalleryGesturesOptions): {
    onPointerDown: (event: ReactPointerEvent) => void;
} {
    const state = useGalleryState();
    const settings = useGallerySettings();
    const actions = useGalleryActions();
    const internal = useGalleryInternal();

    // Latest-value refs: the window listeners live across renders.
    const stateRef = useRef(state);
    stateRef.current = state;
    const settingsRef = useRef(settings);
    settingsRef.current = settings;
    const actionsRef = useRef(actions);
    actionsRef.current = actions;
    const internalRef = useRef(internal);
    internalRef.current = internal;

    const sessionRef = useRef<DragSession | null>(null);
    const detachRef = useRef<(() => void) | null>(null);

    const queryEls = (session: DragSession) => {
        const outer = outerRef.current;
        session.els = {
            current: outer?.querySelector<HTMLElement>('.lg-item.lg-current') ?? null,
            prev: outer?.querySelector<HTMLElement>('.lg-item.lg-prev-slide') ?? null,
            next: outer?.querySelector<HTMLElement>('.lg-item.lg-next-slide') ?? null,
            backdrop:
                outer?.parentElement?.querySelector<HTMLElement>(
                    '.lg-backdrop',
                ) ?? null,
        };
        return session.els;
    };

    /** Return every mid-drag DOM mutation to what React last rendered. */
    const restoreDragVisuals = (session: DragSession) => {
        const outer = outerRef.current;
        outer?.classList.remove('lg-dragging');
        outer?.parentElement?.classList.remove('lg-dragging-vertical');
        if (session.hidUi) {
            outer?.classList.remove('lg-hide-items');
            outer?.classList.add('lg-components-open');
            session.hidUi = false;
        }
        const els = session.els;
        if (els) {
            [els.current, els.prev, els.next].forEach((el) => {
                if (el) {
                    el.style.transform = '';
                }
            });
            if (els.backdrop) {
                els.backdrop.style.opacity = '';
            }
        }
    };

    const endSession = (session: DragSession) => {
        detachRef.current?.();
        detachRef.current = null;
        sessionRef.current = null;
        const outer = outerRef.current;
        if (session.isMouse && settingsRef.current.enableDrag) {
            outer?.classList.remove('lg-grabbing');
            outer?.classList.add('lg-grab');
        }
    };

    const onWindowPointerMove = (event: PointerEvent) => {
        const seam = internalRef.current.gestureSeam;
        seam.pointers = upsertPointer(
            seam.pointers,
            seamRecord(seam.pointers, event),
        );
        const session = sessionRef.current;
        if (
            !session ||
            event.pointerId !== session.pointerId ||
            session.suspended ||
            seam.lockOwner !== null
        ) {
            return;
        }
        session.lastX = event.clientX;
        session.lastY = event.clientY;
        const deltaX = event.clientX - session.startX;
        const deltaY = event.clientY - session.startY;
        session.axis = getSwipeAxis(deltaX, deltaY, session.axis);
        if (!session.axis) {
            return;
        }
        session.moved = true;
        const outer = outerRef.current;
        const els = session.els ?? queryEls(session);

        if (session.axis === 'horizontal') {
            outer?.classList.add('lg-dragging');
            const width =
                els.current?.offsetWidth || outer?.offsetWidth || 0;
            const transforms = getHorizontalDragTransforms(deltaX, width);
            if (els.current) {
                els.current.style.transform = transforms.current;
            }
            if (els.prev) {
                els.prev.style.transform = transforms.prev;
            }
            if (els.next) {
                els.next.style.transform = transforms.next;
            }
        } else if (settingsRef.current.swipeToClose) {
            outer?.parentElement?.classList.add('lg-dragging-vertical');
            const effects = getVerticalDragEffects(
                deltaY,
                window.innerWidth,
                window.innerHeight,
            );
            if (els.backdrop) {
                els.backdrop.style.opacity = String(effects.backdropOpacity);
            }
            if (els.current) {
                els.current.style.transform = effects.transform;
            }
            if (effects.hideUi !== session.hidUi) {
                session.hidUi = effects.hideUi;
                outer?.classList.toggle('lg-hide-items', effects.hideUi);
                outer?.classList.toggle(
                    'lg-components-open',
                    !effects.hideUi,
                );
            }
        }

        if (session.isMouse) {
            internalRef.current.emit('onDragMove');
        }
    };

    const onWindowPointerUp = (event: PointerEvent) => {
        const seam = internalRef.current.gestureSeam;
        seam.pointers = removePointer(seam.pointers, event.pointerId);
        const session = sessionRef.current;
        if (!session || event.pointerId !== session.pointerId) {
            return;
        }
        endSession(session);
        if (session.isMouse && session.moved) {
            internalRef.current.emit('onDragEnd');
        }
        const currentState = stateRef.current;
        const currentSettings = settingsRef.current;

        if (session.suspended || !session.moved || !session.axis) {
            restoreDragVisuals(session);
            return;
        }

        const deltaX = session.lastX - session.startX;
        const deltaY = session.lastY - session.startY;

        if (session.axis === 'horizontal') {
            // Removing lg-dragging re-enables transitions, so clearing the
            // inline transforms animates the slides from the dragged position
            // to their class targets (2.x touchEnd behavior).
            restoreDragVisuals(session);
            const verdict = getSwipeReleaseVerdict({
                deltaX,
                durationMs: performance.now() - session.startTime,
                threshold: currentSettings.swipeThreshold,
            });
            const target = resolveSwipeTarget(
                verdict,
                currentState.currentIndex,
                currentState.slidesCount,
                currentState.loop,
            );
            if (target !== null) {
                commitTouchNavigation(
                    target,
                    verdict === 'next' ? 'next' : 'prev',
                );
            }
            return;
        }

        if (
            shouldCloseOnVerticalDrag(deltaY, {
                closable: currentSettings.closable,
                swipeToClose: currentSettings.swipeToClose,
            })
        ) {
            restoreDragVisuals(session);
            actionsRef.current.closeGallery();
        } else {
            restoreDragVisuals(session);
        }
    };

    const onWindowPointerCancel = (event: PointerEvent) => {
        const seam = internalRef.current.gestureSeam;
        seam.pointers = removePointer(seam.pointers, event.pointerId);
        const session = sessionRef.current;
        if (!session || event.pointerId !== session.pointerId) {
            return;
        }
        endSession(session);
        restoreDragVisuals(session);
    };

    const onPointerDown = (event: ReactPointerEvent) => {
        if (!active) {
            return;
        }
        const seam = internalRef.current.gestureSeam;
        const registerPointer = () => {
            seam.pointers = upsertPointer(seam.pointers, {
                id: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                x: event.clientX,
                y: event.clientY,
            });
        };

        const session = sessionRef.current;
        if (session) {
            // Second pointer: core swipe stands down (pinch is 005's zoom).
            registerPointer();
            session.suspended = true;
            restoreDragVisuals(session);
            return;
        }
        if (seam.lockOwner !== null) {
            return;
        }
        const currentState = stateRef.current;
        const currentSettings = settingsRef.current;
        if (currentState.transitioning) {
            return;
        }
        const isMouse = event.pointerType === 'mouse';
        if (isMouse ? !currentSettings.enableDrag : !currentSettings.enableSwipe) {
            return;
        }
        const target = event.target as Element | null;
        if (!target?.closest?.('.lg-item')) {
            return;
        }

        if (isMouse) {
            // Stop text selection / native image drag (2.x mousedown).
            event.preventDefault();
            const outer = outerRef.current;
            outer?.classList.remove('lg-grab');
            outer?.classList.add('lg-grabbing');
            internalRef.current.emit('onDragStart');
        }

        // Register only once a session actually starts — early-return paths
        // must not leave stale records behind (nothing would remove them).
        registerPointer();
        prepareDrag();

        sessionRef.current = {
            pointerId: event.pointerId,
            isMouse,
            startX: event.clientX,
            startY: event.clientY,
            startTime: performance.now(),
            lastX: event.clientX,
            lastY: event.clientY,
            axis: undefined,
            moved: false,
            suspended: false,
            els: null,
            hidUi: false,
        };

        // Window-level listeners so drags that leave the gallery (or even the
        // viewport, for mouse) keep tracking — 2.x used window mousemove/up.
        // Passive is fine: scrolling is prevented by touch-action on
        // `.lg-inner`, not by preventDefault here.
        window.addEventListener('pointermove', onWindowPointerMove, {
            passive: true,
        });
        window.addEventListener('pointerup', onWindowPointerUp);
        window.addEventListener('pointercancel', onWindowPointerCancel);
        detachRef.current = () => {
            window.removeEventListener('pointermove', onWindowPointerMove);
            window.removeEventListener('pointerup', onWindowPointerUp);
            window.removeEventListener('pointercancel', onWindowPointerCancel);
        };
    };

    // Unmount (or close) mid-drag must leave nothing behind.
    useEffect(() => {
        if (active) {
            return;
        }
        const session = sessionRef.current;
        if (session) {
            endSession(session);
            restoreDragVisuals(session);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);
    useEffect(
        () => () => {
            detachRef.current?.();
            detachRef.current = null;
            sessionRef.current = null;
        },
        [],
    );

    return { onPointerDown };
}

function seamRecord(
    pointers: ReadonlyArray<{ id: number; startX: number; startY: number }>,
    event: PointerEvent,
) {
    const existing = pointers.find((p) => p.id === event.pointerId);
    return {
        id: event.pointerId,
        startX: existing?.startX ?? event.clientX,
        startY: existing?.startY ?? event.clientY,
        x: event.clientX,
        y: event.clientY,
    };
}
