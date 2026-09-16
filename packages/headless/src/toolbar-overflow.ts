/**
 * Toolbar overflow: when the toolbar's icon buttons do not fit on one row
 * beside the counter, the lowest-priority buttons move into a "More
 * options" menu. Pure layout arithmetic over measured widths; each runtime
 * measures its own DOM, applies the result and renders the menu.
 */

/** Priority of a button that never moves into the menu (close). */
export const TOOLBAR_PINNED = Number.POSITIVE_INFINITY;

/** Priority of a button the table does not know (custom plugin buttons). */
export const TOOLBAR_DEFAULT_PRIORITY = 20;

/**
 * Higher stays in the row longer. Keyed by the class each button carries
 * in every runtime; the first matching class wins.
 */
const PRIORITY_BY_CLASS: ReadonlyArray<readonly [string, number]> = [
    ['lg-close', TOOLBAR_PINNED],
    ['lg-share', 30],
    ['lg-autoplay-button', 30],
    ['lg-download', 30],
    ['lg-fullscreen', 20],
    ['lg-toggle-thumb', 20],
    ['lg-comment-toggle', 20],
    ['lg-maximize', 10],
    ['lg-rotate-left', 10],
    ['lg-rotate-right', 10],
    ['lg-flip-hor', 10],
    ['lg-flip-ver', 10],
    // Gesture duplicates go first: pinch and double-tap do the same.
    ['lg-zoom-in', 0],
    ['lg-zoom-out', 0],
    ['lg-actual-size', 0],
];

/** Overflow priority of a toolbar button from its class names. */
export function getToolbarItemPriority(classList: Iterable<string>): number {
    const classes = new Set(classList);
    for (const [className, priority] of PRIORITY_BY_CLASS) {
        if (classes.has(className)) {
            return priority;
        }
    }
    return TOOLBAR_DEFAULT_PRIORITY;
}

export interface ToolbarOverflowItem {
    /** Measured width, px. */
    width: number;
    /** From {@link getToolbarItemPriority}; higher stays longer. */
    priority: number;
}

export interface ToolbarOverflowInput {
    /** Width of the toolbar row, px. */
    available: number;
    /** Width taken by content that never moves (the counter), px. */
    reserved: number;
    /** Width of the More button, px. */
    moreWidth: number;
    /** The toolbar's icon buttons, in DOM order. */
    items: readonly ToolbarOverflowItem[];
}

/**
 * Indices (in DOM order) of the buttons that move into the menu; empty
 * when everything fits, or when the toolbar has no width yet (not laid
 * out). Lowest priority moves first; among equals, the button later in
 * DOM order goes first, which is the one furthest from the close button.
 * The More button's own width is paid as soon as anything moves.
 */
export function getToolbarOverflow({
    available,
    reserved,
    moreWidth,
    items,
}: ToolbarOverflowInput): number[] {
    if (available <= 0) {
        return [];
    }
    const total = items.reduce((sum, item) => sum + item.width, 0);
    if (reserved + total <= available) {
        return [];
    }
    const candidates = items
        .map((item, index) => ({ ...item, index }))
        .filter((item) => item.priority !== TOOLBAR_PINNED)
        .sort((a, b) => a.priority - b.priority || b.index - a.index);
    let used = reserved + moreWidth + total;
    const moved: number[] = [];
    for (const item of candidates) {
        if (used <= available) {
            break;
        }
        moved.push(item.index);
        used -= item.width;
    }
    return moved.sort((a, b) => a - b);
}

/**
 * Whether a click's event path runs through the toolbar. Clicks there are
 * controls, not a tap on the backdrop: Medium zoom closes on the latter
 * only. The path (`event.composedPath()`) still lists a More menu item the
 * click already removed from the document.
 */
export function isToolbarEventPath(path: readonly unknown[]): boolean {
    return path.some(
        (node) =>
            !!(
                node as { classList?: { contains(name: string): boolean } }
            ).classList?.contains('lg-toolbar'),
    );
}
