/**
 * Thumbnail strip math (2.x `animateThumb`/`getPossibleTransformX`) as pure
 * functions for the thumbnail plugin.
 */

export type ThumbPagerPosition = 'left' | 'middle' | 'right';

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
