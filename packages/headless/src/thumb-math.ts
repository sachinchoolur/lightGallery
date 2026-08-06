/**
 * Thumbnail strip math (2.x `animateThumb`/`getPossibleTransformX`) as pure
 * functions for the thumbnail plugin.
 */

import { SLIDE_EDGE_FRICTION } from './gestures';

export type ThumbPagerPosition = 'left' | 'middle' | 'right';

/**
 * Rubber-band a raw strip translate (plan 010 physics): inside the
 * bounds it passes through; beyond an edge the overshoot compresses by
 * the shared edge friction so the strip resists like the slide gestures.
 * The release spring pulls the compressed overshoot back to the bound.
 */
export function getElasticThumbTranslate(
    raw: number,
    totalWidth: number,
    stripWidth: number,
    friction = SLIDE_EDGE_FRICTION,
): number {
    const max = Math.max(0, totalWidth - stripWidth);
    if (raw < 0) {
        return raw * friction;
    }
    if (raw > max) {
        return max + (raw - max) * friction;
    }
    return raw;
}

export function getThumbTotalWidth(
    count: number,
    thumbWidth: number,
    thumbMargin: number,
): number {
    return count * (thumbWidth + thumbMargin);
}

/** Clamp a strip translate into `[0, total - visible]` (never negative). */
export function clampThumbTranslate(
    translate: number,
    totalWidth: number,
    stripWidth: number,
): number {
    const max = Math.max(0, totalWidth - stripWidth);
    return Math.min(Math.max(translate, 0), max);
}

/**
 * The window of thumbnails that must exist in the DOM for a given strip
 * translate (plan 010 virtualization): the visible range plus `overscan`
 * thumbs on each side, with leading/trailing pad widths so the strip keeps
 * its full scroll geometry while only the window renders.
 */
export interface ThumbWindow {
    /** First rendered thumb index (inclusive). */
    start: number;
    /** Last rendered thumb index (inclusive). */
    end: number;
    /** Spacer width (px) standing in for the thumbs before `start`. */
    leadingPad: number;
    /** Spacer width (px) standing in for the thumbs after `end`. */
    trailingPad: number;
}

/**
 * Compute the rendered thumb window from the strip translate. `overscan`
 * is the number of extra thumbs kept mounted on each side of the visible
 * range ('auto' derives one extra viewport per side — enough that a full
 * flick lands on already-rendered thumbs).
 */
export function getThumbWindow(options: {
    translate: number;
    stripWidth: number;
    thumbWidth: number;
    thumbMargin: number;
    count: number;
    overscan?: number | 'auto';
}): ThumbWindow {
    const { translate, stripWidth, thumbWidth, thumbMargin, count } = options;
    const unit = thumbWidth + thumbMargin;
    if (count <= 0 || unit <= 0) {
        return { start: 0, end: -1, leadingPad: 0, trailingPad: 0 };
    }
    const overscan =
        options.overscan === 'auto' || options.overscan === undefined
            ? Math.max(1, Math.ceil(stripWidth / unit))
            : Math.max(0, options.overscan);
    const clampedTranslate = clampThumbTranslate(
        translate,
        getThumbTotalWidth(count, thumbWidth, thumbMargin),
        stripWidth,
    );
    const firstVisible = Math.floor(clampedTranslate / unit);
    const lastVisible = Math.ceil((clampedTranslate + stripWidth) / unit) - 1;
    const start = Math.max(0, firstVisible - overscan);
    const end = Math.min(count - 1, lastVisible + overscan);
    return {
        start,
        end,
        leadingPad: start * unit,
        trailingPad: (count - 1 - end) * unit,
    };
}

/**
 * Window covering a fling's whole flight path (plan 010): the union of
 * the windows at the start and end translates, so a released strip never
 * glides over unrendered thumbs — the destination is known at release.
 */
export function getThumbCorridorWindow(options: {
    from: number;
    to: number;
    stripWidth: number;
    thumbWidth: number;
    thumbMargin: number;
    count: number;
    overscan?: number | 'auto';
}): ThumbWindow {
    const { from, to, ...geometry } = options;
    const a = getThumbWindow({ ...geometry, translate: from });
    const b = getThumbWindow({ ...geometry, translate: to });
    const start = Math.min(a.start, b.start);
    const end = Math.max(a.end, b.end);
    const unit = options.thumbWidth + options.thumbMargin;
    if (end < start) {
        return { start: 0, end: -1, leadingPad: 0, trailingPad: 0 };
    }
    return {
        start,
        end,
        leadingPad: start * unit,
        trailingPad: (options.count - 1 - end) * unit,
    };
}

/**
 * Strip translate that brings the active thumbnail to the pager position
 * (2.x `animateThumb`, including its off-by-one `- 1`).
 */
export function getActiveThumbTranslate(
    index: number,
    thumbWidth: number,
    thumbMargin: number,
    stripWidth: number,
    totalWidth: number,
    pagerPosition: ThumbPagerPosition,
): number {
    let position = 0;
    switch (pagerPosition) {
        case 'left':
            position = 0;
            break;
        case 'middle':
            position = stripWidth / 2 - thumbWidth / 2;
            break;
        case 'right':
            position = stripWidth - thumbWidth;
    }
    const translate = (thumbWidth + thumbMargin) * index - 1 - position;
    return clampThumbTranslate(translate, totalWidth, stripWidth);
}
