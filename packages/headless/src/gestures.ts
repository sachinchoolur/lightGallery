/**
 * Gesture math, ported from the 2.x touch/drag implementation
 * (`touchMove`/`touchEnd` in `src/lightgallery.ts`) as pure functions. The
 * framework layer owns pointer events and writes the returned transforms
 * straight to the DOM (never through framework state — one render per
 * gesture, not per move); every *decision* lives here so swipe feel is
 * identical across frameworks.
 */

export type SwipeAxis = 'horizontal' | 'vertical';

/** Minimum travel (px) before a drag commits to an axis — 2.x parity. */
export const SWIPE_AXIS_THRESHOLD = 15;

/**
 * Flick support: a release faster than this (px/ms) navigates even below
 * `swipeThreshold`. 2.x decides on distance alone; the velocity cutoff is
 * tuned so slow drags behave exactly like vanilla while quick flicks do not
 * snap back (a deliberate, documented deviation from 2.x).
 */
export const FLICK_VELOCITY = 0.25;

/** Minimum travel (px) for a flick, so taps never navigate. */
export const FLICK_MIN_DISTANCE = 20;

/** Vertical travel (px) beyond which a drag-to-close release closes — 2.x. */
export const VERTICAL_CLOSE_THRESHOLD = 100;

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
    /** Drag duration in ms (for the flick velocity). */
    durationMs: number;
    /** `swipeThreshold` setting (px). */
    threshold: number;
}

/**
 * Horizontal release decision: past `swipeThreshold`, or a quick flick →
 * navigate (negative delta = next, 2.x parity); otherwise snap back.
 */
export function getSwipeReleaseVerdict({
    deltaX,
    durationMs,
    threshold,
}: SwipeReleaseInput): SwipeReleaseVerdict {
    const distance = Math.abs(deltaX);
    const velocity = durationMs > 0 ? distance / durationMs : 0;
    const passes =
        distance > threshold ||
        (distance > FLICK_MIN_DISTANCE && velocity > FLICK_VELOCITY);
    if (!passes) {
        return 'stay';
    }
    return deltaX < 0 ? 'next' : 'prev';
}

/** Vertical release decision (2.x `touchEnd` vertical branch). */
export function shouldCloseOnVerticalDrag(
    deltaY: number,
    options: { closable: boolean; swipeToClose: boolean },
): boolean {
    return (
        options.closable &&
        options.swipeToClose &&
        Math.abs(deltaY) > VERTICAL_CLOSE_THRESHOLD
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
