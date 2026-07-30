/**
 * Gesture math, ported from the 2.x touch/drag implementation
 * (`touchMove`/`touchEnd` in `src/lightgallery.ts`) as pure functions. The
 * framework layer owns pointer events and writes the returned transforms
 * straight to the DOM (never through framework state — one render per
 * gesture, not per move); every *decision* lives here so swipe feel is
 * identical across frameworks.
 */

import { project } from './spring';

export type SwipeAxis = 'horizontal' | 'vertical';

/** Minimum travel (px) before a drag commits to an axis — 2.x parity. */
export const SWIPE_AXIS_THRESHOLD = 15;

/**
 * Flick support: a release faster than this (px/ms, windowed — see
 * `velocity.ts`) navigates even below `swipeThreshold`. Default per the
 * gesture-physics teardown: windowed readings run higher than the old
 * whole-gesture averages, so this gate and windowed measurement ship as
 * one change. Public setting: `flickVelocity`.
 */
export const FLICK_VELOCITY = 0.5;

/** Minimum travel (px) for a flick, so taps never navigate. */
export const FLICK_MIN_DISTANCE = 20;

/** Vertical travel (px) beyond which the drag hides the UI chrome — 2.x. */
export const VERTICAL_CLOSE_THRESHOLD = 100;

/**
 * Drag-to-close verdict: the momentum-projected travel must pass this
 * fraction of the viewport height — a small fast downward flick closes,
 * a large slow drag released while returning does not.
 */
export const VERTICAL_CLOSE_RATIO = 0.4;

/**
 * Rubber-band friction past the first/last slide (no loop): the drag
 * keeps moving at this fraction of the finger instead of the 2.x
 * un-resisted 1:1 travel — you feel that there is nothing further.
 */
export const SLIDE_EDGE_FRICTION = 0.35;

/**
 * Horizontal drag delta with rubber-banding past the gallery ends.
 * `hasPrev`/`hasNext` reflect whether a slide exists in that direction
 * (loop counts); the release spring returns the frictioned distance.
 */
export function getEdgeFrictionedDelta(
    deltaX: number,
    hasPrev: boolean,
    hasNext: boolean,
): number {
    if ((deltaX > 0 && !hasPrev) || (deltaX < 0 && !hasNext)) {
        return deltaX * SLIDE_EDGE_FRICTION;
    }
    return deltaX;
}

/** Decide (once) which axis a drag follows; sticky after the first commit. */
export function getSwipeAxis(
    deltaX: number,
    deltaY: number,
    current: SwipeAxis | undefined,
): SwipeAxis | undefined {
    if (current) {
        return current;
    }
    if (Math.abs(deltaX) > SWIPE_AXIS_THRESHOLD) {
        return 'horizontal';
    }
    if (Math.abs(deltaY) > SWIPE_AXIS_THRESHOLD) {
        return 'vertical';
    }
    return undefined;
}

export interface HorizontalDragTransforms {
    current: string;
    prev: string;
    next: string;
}

/**
 * Follow-the-finger transforms for the current slide and its neighbors
 * (2.x `touchMove` horizontal branch, including the shrinking gutter).
 */
export function getHorizontalDragTransforms(
    deltaX: number,
    slideWidth: number,
): HorizontalDragTransforms {
    const slideWidthAmount = (slideWidth * 15) / 100;
    const gutter = slideWidthAmount - Math.abs((deltaX * 10) / 100);
    return {
        current: `translate3d(${deltaX}px, 0px, 0px)`,
        prev: `translate3d(${-slideWidth + deltaX - gutter}px, 0px, 0px)`,
        next: `translate3d(${slideWidth + deltaX + gutter}px, 0px, 0px)`,
    };
}

export interface VerticalDragEffects {
    /** Backdrop opacity fading out with the drag. */
    backdropOpacity: number;
    /** Transform for the current slide (translate + shrink). */
    transform: string;
    /** True once the UI chrome should hide (past the close threshold). */
    hideUi: boolean;
}

/** Drag-to-close visuals (2.x `touchMove` vertical branch). */
export function getVerticalDragEffects(
    deltaY: number,
    viewportWidth: number,
    viewportHeight: number,
): VerticalDragEffects {
    const distance = Math.abs(deltaY);
    const scale = 1 - distance / (viewportWidth * 2);
    return {
        backdropOpacity: 1 - distance / viewportHeight,
        transform: `translate3d(0px, ${deltaY}px, 0px) scale3d(${scale}, ${scale}, 1)`,
        hideUi: distance > VERTICAL_CLOSE_THRESHOLD,
    };
}

export type SwipeReleaseVerdict = 'next' | 'prev' | 'stay';

export interface SwipeReleaseInput {
    deltaX: number;
    /** Release velocity, px/ms signed (windowed — see `velocity.ts`). */
    velocityX: number;
    /** `swipeThreshold` setting (px). */
    threshold: number;
    /** `flickVelocity` setting (px/ms). */
    flickVelocity?: number;
    /**
     * Slide width (px). When given, a release whose momentum-projected
     * travel crosses the midpoint also navigates — a firm half-hearted
     * swipe keeps going where a hesitant one snaps back.
     */
    viewportWidth?: number;
}

/**
 * Horizontal release decision: past `swipeThreshold`, or a quick flick →
 * navigate (negative delta = next, 2.x parity); otherwise snap back.
 * The flick counts only when the release velocity points the same way
 * as the drag — reversing direction just before lifting is a cancel,
 * not a flick.
 */
export function getSwipeReleaseVerdict({
    deltaX,
    velocityX,
    threshold,
    flickVelocity = FLICK_VELOCITY,
    viewportWidth,
}: SwipeReleaseInput): SwipeReleaseVerdict {
    const distance = Math.abs(deltaX);
    const directionMatches =
        deltaX !== 0 && Math.sign(velocityX) === Math.sign(deltaX);
    const projected = deltaX + project(velocityX);
    const passes =
        distance > threshold ||
        (distance > FLICK_MIN_DISTANCE &&
            directionMatches &&
            Math.abs(velocityX) > flickVelocity) ||
        (viewportWidth !== undefined &&
            distance > FLICK_MIN_DISTANCE &&
            directionMatches &&
            Math.abs(projected) > viewportWidth / 2);
    if (!passes) {
        return 'stay';
    }
    return deltaX < 0 ? 'next' : 'prev';
}

/**
 * Vertical release decision: close when the momentum-projected travel
 * passes {@link VERTICAL_CLOSE_RATIO} of the viewport in the drag's own
 * direction (a release moving back toward rest never closes).
 */
export function shouldCloseOnVerticalDrag(
    deltaY: number,
    velocityY: number,
    viewportHeight: number,
    options: { closable: boolean; swipeToClose: boolean },
): boolean {
    if (!options.closable || !options.swipeToClose || deltaY === 0) {
        return false;
    }
    const projected = deltaY + project(velocityY);
    return (
        Math.sign(projected) === Math.sign(deltaY) &&
        Math.abs(projected) > VERTICAL_CLOSE_RATIO * viewportHeight
    );
}

/**
 * Which slide navigation a release verdict maps to, honoring the 2.x touch
 * loop rule: galleries with fewer than 3 slides never wrap from touch.
 */
export function resolveSwipeTarget(
    verdict: SwipeReleaseVerdict,
    currentIndex: number,
    slidesCount: number,
    loop: boolean,
): number | null {
    if (verdict === 'stay') {
        return null;
    }
    const touchLoop = loop && slidesCount >= 3;
    if (verdict === 'next') {
        if (currentIndex + 1 < slidesCount) {
            return currentIndex + 1;
        }
        return touchLoop ? 0 : null;
    }
    if (currentIndex > 0) {
        return currentIndex - 1;
    }
    return touchLoop ? slidesCount - 1 : null;
}

/** One live pointer, for multi-pointer consumers (zoom plugin). */
export interface PointerRecord {
    id: number;
    startX: number;
    startY: number;
    x: number;
    y: number;
}

/** Add or update a pointer record, returning a new array. */
export function upsertPointer(
    pointers: readonly PointerRecord[],
    record: PointerRecord,
): PointerRecord[] {
    const existing = pointers.findIndex((p) => p.id === record.id);
    if (existing === -1) {
        return [...pointers, record];
    }
    const copy = [...pointers];
    copy[existing] = record;
    return copy;
}

/** Remove a pointer record by id, returning a new array. */
export function removePointer(
    pointers: readonly PointerRecord[],
    id: number,
): PointerRecord[] {
    return pointers.filter((p) => p.id !== id);
}
