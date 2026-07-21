/**
 * Slide windowing and preload math, ported from 2.x
 * `getItemsToBeInsertedToDom` / `preload` (`src/lightgallery.ts`). Pure
 * index arithmetic — the framework layer maps the returned indexes to
 * mounted slide components.
 */

/**
 * Which slide indexes should be mounted for a given current/previous index.
 *
 * Mirrors 2.x behavior: at least 3 items (capped at the gallery length),
 * the window centered around `index` biased by which half of the gallery it
 * falls in, plus the far-end slide at the edges when `loop` is on, plus the
 * previous slide so an outgoing transition can finish.
 */
export function getSlideIndexesInDom(
    index: number,
    prevIndex: number,
    slidesCount: number,
    numberOfItems = 0,
    loop = true,
): number[] {
    if (slidesCount <= 0) {
        return [];
    }
    if (slidesCount <= 3) {
        return Array.from({ length: slidesCount }, (_ignored, idx) => idx);
    }

    let possibleNumberOfItems = Math.max(numberOfItems, 3);
    possibleNumberOfItems = Math.min(possibleNumberOfItems, slidesCount);

    const indexes: number[] = [];
    const push = (idx: number) => {
        if (indexes.indexOf(idx) === -1) {
            indexes.push(idx);
        }
    };

    if (index < (slidesCount - 1) / 2) {
        for (
            let idx = index;
            idx > index - possibleNumberOfItems / 2 && idx >= 0;
            idx--
        ) {
            push(idx);
        }
        const numberOfExistingItems = indexes.length;
        for (
            let idx = 0;
            idx < possibleNumberOfItems - numberOfExistingItems;
            idx++
        ) {
            push(index + idx + 1);
        }
    } else {
        for (
            let idx = index;
            idx <= slidesCount - 1 && idx < index + possibleNumberOfItems / 2;
            idx++
        ) {
            push(idx);
        }
        const numberOfExistingItems = indexes.length;
        for (
            let idx = 0;
            idx < possibleNumberOfItems - numberOfExistingItems;
            idx++
        ) {
            push(index - idx - 1);
        }
    }

    if (loop) {
        if (index === slidesCount - 1) {
            push(0);
        } else if (index === 0) {
            push(slidesCount - 1);
        }
    }

    push(prevIndex);

    return indexes.filter((idx) => idx >= 0 && idx < slidesCount);
}

/**
 * Indexes to preload around `index` once the current slide has finished
 * loading: up to `preload` slides forward and backward, clamped at the
 * gallery bounds (no wrap-around — 2.x parity).
 */
export function getPreloadIndexes(
    index: number,
    preload: number,
    slidesCount: number,
): number[] {
    const indexes: number[] = [];
    for (let i = 1; i <= preload; i++) {
        if (i >= slidesCount - index) {
            break;
        }
        indexes.push(index + i);
    }
    for (let j = 1; j <= preload; j++) {
        if (index - j < 0) {
            break;
        }
        indexes.push(index - j);
    }
    return indexes;
}
