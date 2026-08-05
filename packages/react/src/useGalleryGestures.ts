import {
    useEffect,
    useRef,
    type PointerEvent as ReactPointerEvent,
    type RefObject,
} from 'react';
import {
    getEdgeFrictionedDelta,
    getHorizontalDragTransforms,
    getSwipeAxis,
    getSwipeReleaseVerdict,
    getWindowedVelocity,
    pushVelocitySample,
    getVerticalDragEffects,
    removePointer,
    resolveSwipeTarget,
    shouldCloseOnVerticalDrag,
    upsertPointer,
    type SlideDirection,
    type SwipeAxis,
    type VelocitySample,
} from '@lightgallery/headless';

import { runSprings } from './springRunner';

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
    samples: VelocitySample[];
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
    /** The navigation spring settled (or died) — restore the slide mode. */
    settleTouchNavigation: () => void;
}

export function useGalleryGestures({
    outerRef,
    active,
    prepareDrag,
    commitTouchNavigation,
    settleTouchNavigation,
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
    const springCancelRef = useRef<(() => void) | null>(null);
    const navSpringActiveRef = useRef(false);

    const queryEls = (session: DragSession) => {
        const outer = outerRef.current;
        session.els = {
            current:
                outer?.querySelector<HTMLElement>('.lg-item.lg-current') ??
                null,
            prev:
                outer?.querySelector<HTMLElement>('.lg-item.lg-prev-slide') ??
                null,
            next:
                outer?.querySelector<HTMLElement>('.lg-item.lg-next-slide') ??
                null,
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
        // Every slide, not just the session's trio: a navigation spring
        // cancelled mid-flight leaves transforms on slides that are no
        // longer positioned around the new current index. EXCEPT slides
        // the zoom-from-origin flight owns: a backdrop-tap close runs
        // closeOnTap (outer pointerup) BEFORE this release (window
        // pointerup), and real events drain microtasks between the two
        // listeners — the closing transform is already painted and this
        // wipe would kill the exit flight in place.
        outer?.querySelectorAll<HTMLElement>('.lg-item').forEach((el) => {
            if (el.classList.contains('lg-start-end-progress')) {
                return;
            }
            el.style.transform = '';
            el.style.transitionProperty = '';
        });
        if (session.els?.backdrop) {
            session.els.backdrop.style.opacity = '';
        }
    };

    const stopReleaseSpring = () => {
        springCancelRef.current?.();
        springCancelRef.current = null;
        // A cancelled navigation spring still owes the mode restore.
        if (navSpringActiveRef.current) {
            navSpringActiveRef.current = false;
            settleTouchNavigation();
        }
    };

    // Snap the dragged slides back to rest on a spring seeded with the
    // release velocity; lg-dragging stays on (transitions down) until it
    // settles, then the visuals are restored to the rendered state.
    const springHorizontalBack = (
        session: DragSession,
        deltaX: number,
        velocityX: number,
    ) => {
        const els = session.els;
        const width =
            els?.current?.offsetWidth || outerRef.current?.offsetWidth || 0;
        if (!els || !width || Math.abs(deltaX) < 1) {
            restoreDragVisuals(session);
            return;
        }
        stopReleaseSpring();
        springCancelRef.current = runSprings(
            [{ from: deltaX, velocity: velocityX, target: 0 }],
            ([x]) => {
                const transforms = getHorizontalDragTransforms(x!, width);
                if (els.current) {
                    els.current.style.transform = transforms.current;
                }
                if (els.prev) {
                    els.prev.style.transform = transforms.prev;
                }
                if (els.next) {
                    els.next.style.transform = transforms.next;
                }
            },
            () => {
                springCancelRef.current = null;
                restoreDragVisuals(session);
            },
        );
    };

    // Navigate at release (fromTouch semantics: events, counter and classes
    // flip immediately) while a spring carries the drag geometry to the x
    // where the arriving slide sits at exactly 0. The class flip is purely
    // declarative, so the inline transforms keep ruling the visuals until
    // the spring settles and hands everything back.
    const springHorizontalNavigate = (
        session: DragSession,
        verdict: 'next' | 'prev',
        target: number,
        deltaX: number,
        velocityX: number,
    ) => {
        const els = session.els;
        const width =
            els?.current?.offsetWidth || outerRef.current?.offsetWidth || 0;
        stopReleaseSpring();
        // The commit re-render may rewrite the outer className (dropping the
        // classList-added lg-dragging), so the driven slides opt out of
        // transitions inline for the flight.
        if (els && width) {
            [els.current, els.prev, els.next].forEach((el) => {
                if (el) {
                    el.style.transitionProperty = 'none';
                }
            });
        }
        commitTouchNavigation(target, verdict);
        if (!els || !width) {
            restoreDragVisuals(session);
            settleTouchNavigation();
            return;
        }
        // The x where the arriving slide's drag transform lands at 0:
        // slideWidth + x + gutter(x) = 0  →  x = ∓ width·115/110.
        const springTarget =
            (verdict === 'next' ? -1 : 1) * ((width * 115) / 110);
        navSpringActiveRef.current = true;
        springCancelRef.current = runSprings(
            [{ from: deltaX, velocity: velocityX, target: springTarget }],
            ([x]) => {
                const transforms = getHorizontalDragTransforms(x!, width);
                if (els.current) {
                    els.current.style.transform = transforms.current;
                }
                if (els.prev) {
                    els.prev.style.transform = transforms.prev;
                }
                if (els.next) {
                    els.next.style.transform = transforms.next;
                }
            },
            () => {
                springCancelRef.current = null;
                navSpringActiveRef.current = false;
                restoreDragVisuals(session);
                settleTouchNavigation();
            },
        );
    };

    // Same for a non-closing vertical drag: slide transform and backdrop
    // opacity spring home together.
    const springVerticalBack = (
        session: DragSession,
        deltaY: number,
        velocityY: number,
    ) => {
        const els = session.els;
        if (!els?.current || Math.abs(deltaY) < 1) {
            restoreDragVisuals(session);
            return;
        }
        stopReleaseSpring();
        springCancelRef.current = runSprings(
            [{ from: deltaY, velocity: velocityY, target: 0 }],
            ([y]) => {
                const effects = getVerticalDragEffects(
                    y!,
                    window.innerWidth,
                    window.innerHeight,
                );
                els.current!.style.transform = effects.transform;
                if (els.backdrop) {
                    els.backdrop.style.opacity = String(
                        effects.backdropOpacity,
                    );
                }
            },
            () => {
                springCancelRef.current = null;
                restoreDragVisuals(session);
            },
        );
    };

    const endSession = (session: DragSession) => {
        detachRef.current?.();
        detachRef.current = null;
        sessionRef.current = null;
        // The ledger is session-scoped: once the window listeners detach
        // nothing can remove records, so clear them here (a suspended
        // second pointer would otherwise be stranded).
        internalRef.current.gestureSeam.pointers = [];
        const outer = outerRef.current;
        if (session.isMouse && settingsRef.current.enableDrag) {
            outer?.classList.remove('lg-grabbing');
            outer?.classList.add('lg-grab');
        }
    };

    const onWindowPointerMove = (event: PointerEvent) => {
        const seam = internalRef.current.gestureSeam;
        // Update only pointers that registered at pointerdown — hovering
        // mouse moves have no down/up lifecycle and would be stranded.
        if (seam.pointers.some((r) => r.id === event.pointerId)) {
            seam.pointers = upsertPointer(
                seam.pointers,
                seamRecord(seam.pointers, event),
            );
        }
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
        session.samples = pushVelocitySample(session.samples, {
            x: event.clientX,
            y: event.clientY,
            t: performance.now(),
        });
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
            const width = els.current?.offsetWidth || outer?.offsetWidth || 0;
            // Rubber-band past the gallery ends: a missing neighbor in
            // the drag direction means there is nothing there.
            const transforms = getHorizontalDragTransforms(
                getEdgeFrictionedDelta(deltaX, !!els.prev, !!els.next),
                width,
            );
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
                outer?.classList.toggle('lg-components-open', !effects.hideUi);
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
        const releaseVelocity = getWindowedVelocity(
            session.samples,
            performance.now(),
        );

        if (session.axis === 'horizontal') {
            const verdict = getSwipeReleaseVerdict({
                deltaX,
                velocityX: releaseVelocity.x,
                viewportWidth:
                    outerRef.current?.offsetWidth || window.innerWidth,
                threshold: currentSettings.swipeThreshold,
                flickVelocity: currentSettings.flickVelocity,
            });
            const target = resolveSwipeTarget(
                verdict,
                currentState.currentIndex,
                currentState.slidesCount,
                currentState.loop,
            );
            // Springs start from the RENDERED delta — rubber-banded at
            // the gallery ends, identical to raw elsewhere.
            const renderedDeltaX = getEdgeFrictionedDelta(
                deltaX,
                !!session.els?.prev,
                !!session.els?.next,
            );
            if (target !== null) {
                springHorizontalNavigate(
                    session,
                    verdict === 'next' ? 'next' : 'prev',
                    target,
                    renderedDeltaX,
                    releaseVelocity.x,
                );
            } else {
                springHorizontalBack(
                    session,
                    renderedDeltaX,
                    releaseVelocity.x,
                );
            }
            return;
        }

        if (
            shouldCloseOnVerticalDrag(
                deltaY,
                releaseVelocity.y,
                window.innerHeight,
                {
                    closable: currentSettings.closable,
                    swipeToClose: currentSettings.swipeToClose,
                },
            )
        ) {
            restoreDragVisuals(session);
            actionsRef.current.closeGallery();
        } else {
            springVerticalBack(session, deltaY, releaseVelocity.y);
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
        if (
            isMouse ? !currentSettings.enableDrag : !currentSettings.enableSwipe
        ) {
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

        // The new session claims the visuals from a settling spring — only
        // here: a blocked tap (transitioning, chrome) must not freeze an
        // in-flight spring mid-glide.
        stopReleaseSpring();
        // Register only once a session actually starts — early-return paths
        // must not leave stale records behind (nothing would remove them).
        registerPointer();
        prepareDrag();

        sessionRef.current = {
            pointerId: event.pointerId,
            isMouse,
            startX: event.clientX,
            startY: event.clientY,
            samples: [
                {
                    x: event.clientX,
                    y: event.clientY,
                    t: performance.now(),
                },
            ],
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
        stopReleaseSpring();
        const session = sessionRef.current;
        if (session) {
            endSession(session);
            restoreDragVisuals(session);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);
    useEffect(
        () => () => {
            springCancelRef.current?.();
            springCancelRef.current = null;
            navSpringActiveRef.current = false;
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
