import {
    Directive,
    effect,
    ElementRef,
    inject,
    input,
    OnDestroy,
    untracked,
} from '@angular/core';
import {
    getHorizontalDragTransforms,
    getSwipeAxis,
    getSwipeReleaseVerdict,
    getVerticalDragEffects,
    removePointer,
    resolveSwipeTarget,
    shouldCloseOnVerticalDrag,
    upsertPointer,
    type PointerRecord,
    type SwipeAxis,
} from '@lightgallery/headless';

import { LgGalleryRuntime } from './runtime';
import { LightGalleryStore } from './store';

/**
 * Swipe/drag gestures (2.x `enableSwipe`/`enableDrag` via pointer events) —
 * the Angular twin of the React track's `useGalleryGestures`.
 *
 * PERFORMANCE CONTRACT (load-bearing — deliberately "un-Angular", see the
 * plan-004 maintenance note): while a pointer moves, transforms are written
 * DIRECTLY to the slide elements and the backdrop. No signal is written and
 * no change detection runs per move — Angular renders exactly twice per
 * gesture (position classes at drag start, navigation commit at release).
 * Everything here is plain fields + native listeners on purpose:
 * - `pointerdown` is a native listener (a template `(pointerdown)` binding
 *   would notify the zoneless scheduler on every press);
 * - move/up/cancel listeners are window-level so drags that leave the
 *   gallery (or the viewport, for mouse) keep tracking — 2.x parity;
 * - signal reads inside the handlers are untracked plain reads.
 * The pure math lives in `@lightgallery/headless`; this directive only wires
 * pointer events to it and dispatches its verdicts. Angular's `[class]` /
 * `[style.*]` bindings reconcile against their own previous values, so the
 * classes and inline styles written here survive unrelated CD passes and are
 * handed back explicitly in `restoreDragVisuals`.
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
    /** A second pointer arrived — reserved for the zoom feature's pinch. */
    suspended: boolean;
    els: {
        current: HTMLElement | null;
        prev: HTMLElement | null;
        next: HTMLElement | null;
        backdrop: HTMLElement | null;
    } | null;
    /** UI-chrome classes we toggled mid-drag and must hand back to Angular. */
    hidUi: boolean;
}

@Directive({
    selector: '[lgGestures]',
})
export class LgGesturesDirective implements OnDestroy {
    /** Gestures act only while the gallery is open (not closing). */
    readonly lgGestures = input.required<boolean>();

    private readonly host = inject(ElementRef).nativeElement as HTMLElement;
    private readonly store = inject(LightGalleryStore);
    private readonly runtime = inject(LgGalleryRuntime);

    private session: DragSession | null = null;
    private detachWindow: (() => void) | null = null;

    constructor() {
        // The overlay view only ever attaches in the browser (ADR §8), so a
        // constructor-time native listener is SSR-safe here.
        this.host.addEventListener('pointerdown', this.onPointerDown);
        // React counterpart: useGalleryGestures' `active` cleanup effect —
        // close/deactivate mid-drag must leave nothing behind.
        effect(() => {
            if (!this.lgGestures()) {
                untracked(() => this.cancelSession());
            }
        });
    }

    ngOnDestroy(): void {
        this.host.removeEventListener('pointerdown', this.onPointerDown);
        this.cancelSession();
    }

    private cancelSession(): void {
        const session = this.session;
        if (session) {
            this.endSession(session);
            this.restoreDragVisuals(session);
        } else {
            this.detachWindow?.();
            this.detachWindow = null;
        }
    }

    private queryEls(session: DragSession): NonNullable<DragSession['els']> {
        const outer = this.host;
        session.els = {
            current:
                outer.querySelector<HTMLElement>('.lg-item.lg-current') ??
                null,
            prev:
                outer.querySelector<HTMLElement>('.lg-item.lg-prev-slide') ??
                null,
            next:
                outer.querySelector<HTMLElement>('.lg-item.lg-next-slide') ??
                null,
            backdrop:
                outer.parentElement?.querySelector<HTMLElement>(
                    '.lg-backdrop',
                ) ?? null,
        };
        return session.els;
    }

    /** Return every mid-drag DOM mutation to what Angular last rendered. */
    private restoreDragVisuals(session: DragSession): void {
        const outer = this.host;
        outer.classList.remove('lg-dragging');
        outer.parentElement?.classList.remove('lg-dragging-vertical');
        if (session.hidUi) {
            outer.classList.remove('lg-hide-items');
            outer.classList.add('lg-components-open');
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
    }

    private endSession(session: DragSession): void {
        this.detachWindow?.();
        this.detachWindow = null;
        this.session = null;
        if (session.isMouse && this.runtime.settings().enableDrag) {
            this.host.classList.remove('lg-grabbing');
            this.host.classList.add('lg-grab');
        }
    }

    private readonly onWindowPointerMove = (event: PointerEvent): void => {
        const seam = this.runtime.gestureSeam;
        seam.pointers = upsertPointer(
            seam.pointers,
            seamRecord(seam.pointers, event),
        );
        const session = this.session;
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
        const outer = this.host;
        const els = session.els ?? this.queryEls(session);

        if (session.axis === 'horizontal') {
            outer.classList.add('lg-dragging');
            const width = els.current?.offsetWidth || outer.offsetWidth || 0;
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
        } else if (this.runtime.settings().swipeToClose) {
            outer.parentElement?.classList.add('lg-dragging-vertical');
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
                outer.classList.toggle('lg-hide-items', effects.hideUi);
                outer.classList.toggle(
                    'lg-components-open',
                    !effects.hideUi,
                );
            }
        }

        if (session.isMouse) {
            this.runtime.emit('dragMove', undefined);
        }
    };

    private readonly onWindowPointerUp = (event: PointerEvent): void => {
        const seam = this.runtime.gestureSeam;
        seam.pointers = removePointer(seam.pointers, event.pointerId);
        const session = this.session;
        if (!session || event.pointerId !== session.pointerId) {
            return;
        }
        this.endSession(session);
        if (session.isMouse && session.moved) {
            this.runtime.emit('dragEnd', undefined);
        }
        const state = this.store.state();
        const settings = this.runtime.settings();

        if (session.suspended || !session.moved || !session.axis) {
            this.restoreDragVisuals(session);
            return;
        }

        const deltaX = session.lastX - session.startX;
        const deltaY = session.lastY - session.startY;

        if (session.axis === 'horizontal') {
            // Removing lg-dragging re-enables transitions, so clearing the
            // inline transforms animates the slides from the dragged position
            // to their class targets (2.x touchEnd behavior).
            this.restoreDragVisuals(session);
            const verdict = getSwipeReleaseVerdict({
                deltaX,
                durationMs: performance.now() - session.startTime,
                threshold: settings.swipeThreshold,
            });
            const target = resolveSwipeTarget(
                verdict,
                state.currentIndex,
                state.slidesCount,
                state.loop,
            );
            if (target !== null) {
                this.runtime.gestureHooks.commitTouchNavigation(
                    target,
                    verdict === 'next' ? 'next' : 'prev',
                );
            }
            return;
        }

        if (
            shouldCloseOnVerticalDrag(deltaY, {
                closable: settings.closable,
                swipeToClose: settings.swipeToClose,
            })
        ) {
            this.restoreDragVisuals(session);
            this.runtime.actions.closeGallery();
        } else {
            this.restoreDragVisuals(session);
        }
    };

    private readonly onWindowPointerCancel = (event: PointerEvent): void => {
        const seam = this.runtime.gestureSeam;
        seam.pointers = removePointer(seam.pointers, event.pointerId);
        const session = this.session;
        if (!session || event.pointerId !== session.pointerId) {
            return;
        }
        this.endSession(session);
        this.restoreDragVisuals(session);
    };

    private readonly onPointerDown = (event: PointerEvent): void => {
        if (!this.lgGestures()) {
            return;
        }
        const seam = this.runtime.gestureSeam;
        const registerPointer = (): void => {
            seam.pointers = upsertPointer(seam.pointers, {
                id: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                x: event.clientX,
                y: event.clientY,
            });
        };

        const session = this.session;
        if (session) {
            // Second pointer: core swipe stands down (pinch is 005's zoom).
            registerPointer();
            session.suspended = true;
            this.restoreDragVisuals(session);
            return;
        }
        if (seam.lockOwner !== null) {
            return;
        }
        const state = this.store.state();
        const settings = this.runtime.settings();
        if (state.transitioning) {
            return;
        }
        const isMouse = event.pointerType === 'mouse';
        if (isMouse ? !settings.enableDrag : !settings.enableSwipe) {
            return;
        }
        const target = event.target as Element | null;
        if (!target?.closest?.('.lg-item')) {
            return;
        }

        if (isMouse) {
            // Stop text selection / native image drag (2.x mousedown).
            event.preventDefault();
            this.host.classList.remove('lg-grab');
            this.host.classList.add('lg-grabbing');
            this.runtime.emit('dragStart', undefined);
        }

        // Register only once a session actually starts — early-return paths
        // must not leave stale records behind (nothing would remove them).
        registerPointer();
        this.runtime.gestureHooks.prepareDrag();

        this.session = {
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

        // Window-level listeners so drags that leave the gallery keep
        // tracking. Passive move is fine: scrolling is prevented by
        // touch-action on `.lg-inner`, not by preventDefault here.
        window.addEventListener('pointermove', this.onWindowPointerMove, {
            passive: true,
        });
        window.addEventListener('pointerup', this.onWindowPointerUp);
        window.addEventListener('pointercancel', this.onWindowPointerCancel);
        this.detachWindow = () => {
            window.removeEventListener(
                'pointermove',
                this.onWindowPointerMove,
            );
            window.removeEventListener('pointerup', this.onWindowPointerUp);
            window.removeEventListener(
                'pointercancel',
                this.onWindowPointerCancel,
            );
        };
    };
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
