import { onScopeDispose, watch, type Ref } from 'vue';
import {
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
    type PointerRecord,
    type SlideDirection,
    type SwipeAxis,
    type VelocitySample,
} from '@lightgallery/headless';

import type { GalleryStore } from './store';
import type { LgGestureSeam } from './runtime';
import type { LgEventMap } from './types';
import type { CoreSettings } from '@lightgallery/headless';

/**
 * Swipe/drag gestures (2.x `enableSwipe`/`enableDrag` via pointer events) —
 * the Vue twin of the sibling tracks' gesture bindings.
 *
 * PERFORMANCE CONTRACT (load-bearing — deliberately "un-Vue" and
 * load-bearing): while a pointer moves, transforms are written
 * DIRECTLY to the slide elements and the backdrop. No ref/reactive is
 * written and no component updates per move — Vue renders exactly twice per
 * gesture (position classes at drag start, navigation commit at release).
 * Everything here is plain fields + native listeners on purpose:
 * - `pointerdown` is a native listener on the outer element (a template
 *   `@pointerdown` would still be fine, but native keeps the whole layer
 *   uniform and testable);
 * - move/up/cancel listeners are window-level so drags that leave the
 *   gallery (or the viewport, for mouse) keep tracking — 2.x parity;
 * - passive move is fine: scrolling is prevented by `touch-action: none`
 *   on `.lg-inner`, not by preventDefault here.
 * The pure math lives in `@lightgallery/headless`; this composable only
 * wires pointer events to it and dispatches its verdicts.
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
    /** UI-chrome classes toggled mid-drag and handed back to Vue. */
    hidUi: boolean;
}

export interface GalleryGesturesOptions {
    outer: Ref<HTMLElement | null>;
    /** Gestures act only while the gallery is open (not closing). */
    active: Ref<boolean>;
    store: GalleryStore;
    settings: () => CoreSettings;
    seam: LgGestureSeam;
    emit: <K extends keyof LgEventMap>(name: K, detail: LgEventMap[K]) => void;
    closeGallery: () => void;
    /** Assign prev/next position classes around the current slide. */
    prepareDrag: () => void;
    /** Commit a swipe release to a slide change with fromTouch semantics. */
    commitTouchNavigation: (target: number, direction: SlideDirection) => void;
}

export function useGalleryGestures(options: GalleryGesturesOptions): void {
    const {
        outer,
        active,
        store,
        settings,
        seam,
        emit,
        closeGallery,
        prepareDrag,
        commitTouchNavigation,
    } = options;

    let session: DragSession | null = null;
    let detachWindow: (() => void) | null = null;

    function queryEls(drag: DragSession): NonNullable<DragSession['els']> {
        const el = outer.value!;
        drag.els = {
            current:
                el.querySelector<HTMLElement>('.lg-item.lg-current') ?? null,
            prev:
                el.querySelector<HTMLElement>('.lg-item.lg-prev-slide') ?? null,
            next:
                el.querySelector<HTMLElement>('.lg-item.lg-next-slide') ?? null,
            backdrop:
                el.parentElement?.querySelector<HTMLElement>('.lg-backdrop') ??
                null,
        };
        return drag.els;
    }

    /** Return every mid-drag DOM mutation to what Vue last rendered. */
    function restoreDragVisuals(drag: DragSession): void {
        const el = outer.value;
        el?.classList.remove('lg-dragging');
        el?.parentElement?.classList.remove('lg-dragging-vertical');
        if (drag.hidUi) {
            el?.classList.remove('lg-hide-items');
            el?.classList.add('lg-components-open');
            drag.hidUi = false;
        }
        const els = drag.els;
        if (els) {
            [els.current, els.prev, els.next].forEach((slide) => {
                if (slide) {
                    slide.style.transform = '';
                }
            });
            if (els.backdrop) {
                els.backdrop.style.opacity = '';
            }
        }
    }

    function endSession(drag: DragSession): void {
        detachWindow?.();
        detachWindow = null;
        session = null;
        // The ledger is session-scoped: once the window listeners detach
        // nothing can remove records, so clear them here (a suspended
        // second pointer would otherwise be stranded).
        seam.pointers = [];
        if (drag.isMouse && settings().enableDrag) {
            outer.value?.classList.remove('lg-grabbing');
            outer.value?.classList.add('lg-grab');
        }
    }

    function cancelSession(): void {
        if (session) {
            const drag = session;
            endSession(drag);
            restoreDragVisuals(drag);
        } else {
            detachWindow?.();
            detachWindow = null;
        }
    }

    const onWindowPointerMove = (event: PointerEvent): void => {
        // Update only pointers that registered at pointerdown — hovering
        // mouse moves have no down/up lifecycle and would be stranded.
        if (seam.pointers.some((r) => r.id === event.pointerId)) {
            seam.pointers = upsertPointer(
                seam.pointers,
                seamRecord(seam.pointers, event),
            );
        }
        const drag = session;
        if (
            !drag ||
            event.pointerId !== drag.pointerId ||
            drag.suspended ||
            seam.lockOwner !== null
        ) {
            return;
        }
        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
        drag.samples = pushVelocitySample(drag.samples, {
            x: event.clientX,
            y: event.clientY,
            t: performance.now(),
        });
        const deltaX = event.clientX - drag.startX;
        const deltaY = event.clientY - drag.startY;
        drag.axis = getSwipeAxis(deltaX, deltaY, drag.axis);
        if (!drag.axis) {
            return;
        }
        drag.moved = true;
        const el = outer.value;
        const els = drag.els ?? queryEls(drag);

        if (drag.axis === 'horizontal') {
            el?.classList.add('lg-dragging');
            const width = els.current?.offsetWidth || el?.offsetWidth || 0;
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
        } else if (settings().swipeToClose) {
            el?.parentElement?.classList.add('lg-dragging-vertical');
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
            if (effects.hideUi !== drag.hidUi) {
                drag.hidUi = effects.hideUi;
                el?.classList.toggle('lg-hide-items', effects.hideUi);
                el?.classList.toggle('lg-components-open', !effects.hideUi);
            }
        }

        if (drag.isMouse) {
            emit('dragMove', undefined);
        }
    };

    const onWindowPointerUp = (event: PointerEvent): void => {
        seam.pointers = removePointer(seam.pointers, event.pointerId);
        const drag = session;
        if (!drag || event.pointerId !== drag.pointerId) {
            return;
        }
        endSession(drag);
        if (drag.isMouse && drag.moved) {
            emit('dragEnd', undefined);
        }
        const state = store.state.value;
        const cfg = settings();

        if (drag.suspended || !drag.moved || !drag.axis) {
            restoreDragVisuals(drag);
            return;
        }

        const deltaX = drag.lastX - drag.startX;
        const deltaY = drag.lastY - drag.startY;
        const releaseVelocity = getWindowedVelocity(
            drag.samples,
            performance.now(),
        );

        if (drag.axis === 'horizontal') {
            // Removing lg-dragging re-enables transitions, so clearing the
            // inline transforms animates the slides from the dragged
            // position to their class targets (2.x touchEnd behavior).
            restoreDragVisuals(drag);
            const verdict = getSwipeReleaseVerdict({
                deltaX,
                velocityX: releaseVelocity.x,
                viewportWidth: outer.value?.offsetWidth || window.innerWidth,
                threshold: cfg.swipeThreshold,
                flickVelocity: cfg.flickVelocity,
            });
            const target = resolveSwipeTarget(
                verdict,
                state.currentIndex,
                state.slidesCount,
                state.loop,
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
            shouldCloseOnVerticalDrag(
                deltaY,
                releaseVelocity.y,
                window.innerHeight,
                {
                    closable: cfg.closable,
                    swipeToClose: cfg.swipeToClose,
                },
            )
        ) {
            restoreDragVisuals(drag);
            closeGallery();
        } else {
            restoreDragVisuals(drag);
        }
    };

    const onWindowPointerCancel = (event: PointerEvent): void => {
        seam.pointers = removePointer(seam.pointers, event.pointerId);
        const drag = session;
        if (!drag || event.pointerId !== drag.pointerId) {
            return;
        }
        endSession(drag);
        restoreDragVisuals(drag);
    };

    const onPointerDown = (event: PointerEvent): void => {
        if (!active.value) {
            return;
        }
        const registerPointer = (): void => {
            seam.pointers = upsertPointer(seam.pointers, {
                id: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                x: event.clientX,
                y: event.clientY,
            });
        };

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
        const state = store.state.value;
        const cfg = settings();
        if (state.transitioning) {
            return;
        }
        const isMouse = event.pointerType === 'mouse';
        if (isMouse ? !cfg.enableDrag : !cfg.enableSwipe) {
            return;
        }
        const target = event.target as Element | null;
        if (!target?.closest?.('.lg-item')) {
            return;
        }

        if (isMouse) {
            // Stop text selection / native image drag (2.x mousedown).
            event.preventDefault();
            outer.value?.classList.remove('lg-grab');
            outer.value?.classList.add('lg-grabbing');
            emit('dragStart', undefined);
        }

        // Register only once a session actually starts — early-return paths
        // must not leave stale records behind.
        registerPointer();
        prepareDrag();

        session = {
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

        window.addEventListener('pointermove', onWindowPointerMove, {
            passive: true,
        });
        window.addEventListener('pointerup', onWindowPointerUp);
        window.addEventListener('pointercancel', onWindowPointerCancel);
        detachWindow = () => {
            window.removeEventListener('pointermove', onWindowPointerMove);
            window.removeEventListener('pointerup', onWindowPointerUp);
            window.removeEventListener('pointercancel', onWindowPointerCancel);
        };
    };

    // Bind/unbind pointerdown as the outer element mounts/unmounts with the
    // open phase; deactivating (close) mid-drag leaves nothing behind.
    watch(
        [outer, active],
        ([el, isActive], _prev, onCleanup) => {
            if (!isActive) {
                cancelSession();
            }
            if (el) {
                el.addEventListener('pointerdown', onPointerDown);
                onCleanup(() =>
                    el.removeEventListener('pointerdown', onPointerDown),
                );
            }
        },
        { flush: 'post' },
    );
    onScopeDispose(() => {
        cancelSession();
    });
}

function seamRecord(
    pointers: readonly PointerRecord[],
    event: PointerEvent,
): PointerRecord {
    const existing = pointers.find((p) => p.id === event.pointerId);
    return {
        id: event.pointerId,
        startX: existing?.startX ?? event.clientX,
        startY: existing?.startY ?? event.clientY,
        x: event.clientX,
        y: event.clientY,
    };
}
