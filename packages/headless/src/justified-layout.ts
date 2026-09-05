/**
 * Justified grid layout for the trigger thumbnails: rows of equal
 * height and varying widths that fill the container edge to edge, the
 * row height staying as close as possible to a target. Pure math —
 * runtimes measure the container, hand in aspect ratios, and position
 * elements from the returned boxes.
 */

export interface JustifiedLayoutOptions {
    /** Aspect ratios (width / height) in item order. */
    ratios: readonly number[];
    /** Content-box width available for rows (px). */
    containerWidth: number;
    /** Row height (px) the algorithm aims for. */
    targetRowHeight?: number;
    /** Gap between items and between rows (px). */
    gap?: number;
    /**
     * Last-row policy: `'justify'` scales the leftover row to fill the
     * width like every other row (clamped by `maxScale`), `'start'`
     * keeps the target height aligned to the reading start, `'hide'`
     * drops the leftover items (their boxes come back zero-sized).
     */
    lastRow?: 'justify' | 'start' | 'hide';
    /**
     * Row-height clamp as a multiple of `targetRowHeight` — a sparse
     * row (single portrait, justified leftovers) never renders taller
     * than `maxScale * targetRowHeight`. Clamped rows align to the
     * reading start instead of filling the width.
     */
    maxScale?: number;
}

export interface JustifiedBox {
    top: number;
    /**
     * Offset from the reading-start edge (logical): the runtime maps
     * it to `left` in LTR and `right` in RTL, the same convention as
     * the thumbnail strip math.
     */
    start: number;
    width: number;
    height: number;
}

export interface JustifiedLayout {
    /**
     * One box per input ratio, in item order — items hidden by
     * `lastRow: 'hide'` come back zero-sized (runtimes hide them).
     */
    boxes: JustifiedBox[];
    /** Total content height including the final row (px). */
    containerHeight: number;
}

const DEFAULT_TARGET_ROW_HEIGHT = 180;
const DEFAULT_GAP = 8;
const DEFAULT_MAX_SCALE = 1.75;

/** Coerce invalid aspect ratios to square so boxes stay 1:1 with items. */
function sanitizeRatios(ratios: readonly number[]): number[] {
    let warned = false;
    return ratios.map((ratio) => {
        if (Number.isFinite(ratio) && ratio > 0) {
            return ratio;
        }
        if (!warned && typeof console !== 'undefined') {
            warned = true;
            console.warn(
                'lightGallery justified layout: invalid aspect ratio, treating as 1 (square). See https://www.lightgalleryjs.com/docs/justified-layout/',
            );
        }
        return 1;
    });
}

interface RowRenderOptions {
    row: number[];
    firstIndex: number;
    top: number;
    height: number;
    containerWidth: number;
    gap: number;
    /** Distribute rounding drift so widths + gaps fill the width exactly. */
    fill: boolean;
    boxes: JustifiedBox[];
}

/** Emit one row's boxes; returns the rendered (rounded) row height. */
function renderRow(options: RowRenderOptions): number {
    const { row, firstIndex, top, containerWidth, gap, fill, boxes } = options;
    const height = Math.round(options.height);
    let start = 0;
    row.forEach((ratio, offset) => {
        let width = Math.round(ratio * height);
        if (fill && offset === row.length - 1) {
            // The row is sized to fill exactly; per-item rounding drift
            // lands on the last item so widths + gaps always sum to the
            // container width.
            width = containerWidth - start;
        }
        boxes[firstIndex + offset] = { top, start, width, height };
        start += width + gap;
    });
    return height;
}

export function getJustifiedLayout(
    options: JustifiedLayoutOptions,
): JustifiedLayout {
    const {
        containerWidth,
        targetRowHeight = DEFAULT_TARGET_ROW_HEIGHT,
        gap = DEFAULT_GAP,
        lastRow = 'start',
        maxScale = DEFAULT_MAX_SCALE,
    } = options;
    const ratios = sanitizeRatios(options.ratios);
    const boxes: JustifiedBox[] = new Array(ratios.length);
    const maxHeight = targetRowHeight * maxScale;

    // Height at which `row` fills the container width exactly.
    const fillHeight = (row: readonly number[]): number => {
        const available = containerWidth - gap * (row.length - 1);
        const ratioSum = row.reduce((sum, ratio) => sum + ratio, 0);
        return available / ratioSum;
    };

    let top = 0;
    let row: number[] = [];
    let firstIndex = 0;

    const closeRow = (height: number, fill: boolean): void => {
        const rendered = renderRow({
            row,
            firstIndex,
            top,
            height: Math.min(height, maxHeight),
            containerWidth,
            gap,
            // A clamped row no longer fills the width — never stretch it.
            fill: fill && height <= maxHeight,
            boxes,
        });
        top += rendered + gap;
        firstIndex += row.length;
        row = [];
    };

    ratios.forEach((ratio) => {
        row.push(ratio);
        const height = fillHeight(row);
        if (height > targetRowHeight) {
            return; // Row still too sparse to reach the target — keep filling.
        }
        // The row crossed the target. Render it closer to the target:
        // with this item (shorter row) or without it (taller row).
        const heightWithout =
            row.length > 1 ? fillHeight(row.slice(0, -1)) : null;
        if (
            heightWithout !== null &&
            heightWithout - targetRowHeight < targetRowHeight - height
        ) {
            const carried = row.pop()!;
            closeRow(heightWithout, true);
            row = [carried];
            if (fillHeight(row) <= targetRowHeight) {
                // The carried item alone already fills the width (wider
                // than the container at target height) — close it too.
                closeRow(fillHeight(row), true);
            }
        } else {
            closeRow(height, true);
        }
    });

    // Leftover items that never reached the target width.
    if (row.length > 0) {
        if (lastRow === 'hide') {
            row.forEach((_, offset) => {
                boxes[firstIndex + offset] = {
                    top: 0,
                    start: 0,
                    width: 0,
                    height: 0,
                };
            });
        } else if (lastRow === 'justify') {
            closeRow(fillHeight(row), true);
        } else {
            closeRow(targetRowHeight, false);
        }
    }

    return {
        boxes,
        containerHeight:
            firstIndex > 0 || row.length > 0 ? Math.max(top - gap, 0) : 0,
    };
}
