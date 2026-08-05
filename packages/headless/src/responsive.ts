/**
 * Responsive image selection + decode gating (plan: responsive loading).
 *
 * The browser already picks a candidate natively when the runtimes render
 * `<picture>`/`srcset` — these helpers exist for the places that need the
 * DECISION as data: preload warming at the right resolution, tooling, and
 * the framework image-component recipes. The algorithm mirrors the HTML
 * spec's srcset selection closely enough to be deterministic and
 * unit-testable: parse candidates, derive the slot width from `sizes`,
 * scale by DPR, pick the smallest candidate that covers the target
 * (falling back to the largest available).
 */

import type { GalleryItem, ImageSources } from './items';

export interface SrcsetCandidate {
    url: string;
    /** Width descriptor (`640w`) in px, if given. */
    width?: number;
    /** Density descriptor (`2x`), if given; bare candidates read as 1x. */
    density?: number;
}

export interface Viewport {
    width: number;
    height: number;
    /** devicePixelRatio; defaults to 1. */
    dpr?: number;
}

/** Parse a `srcset` attribute string into candidates. Malformed entries
 * are skipped rather than thrown — item data is author-provided. */
export function parseSrcset(srcset: string): SrcsetCandidate[] {
    const candidates: SrcsetCandidate[] = [];
    for (const entry of srcset.split(',')) {
        const parts = entry.trim().split(/\s+/);
        const url = parts[0];
        if (!url) {
            continue;
        }
        const descriptor = parts[1];
        if (!descriptor) {
            candidates.push({ url, density: 1 });
            continue;
        }
        const value = parseFloat(descriptor);
        if (Number.isNaN(value) || value <= 0) {
            continue;
        }
        if (descriptor.endsWith('w')) {
            candidates.push({ url, width: value });
        } else if (descriptor.endsWith('x')) {
            candidates.push({ url, density: value });
        }
    }
    return candidates;
}

/**
 * Effective slot width (px) from a `sizes` attribute for a viewport.
 * Supports the common authored forms deterministically: comma-separated
 * `(min-width: Npx) <len>` / `(max-width: Npx) <len>` clauses with a
 * bare `<len>` default, where `<len>` is `px` or `vw`. The first
 * matching clause wins (spec order). Unsupported conditions are skipped;
 * no match falls back to the full viewport width (`100vw`, the spec
 * default).
 */
export function resolveSizes(
    sizes: string | undefined,
    viewportWidth: number,
): number {
    if (!sizes) {
        return viewportWidth;
    }
    const toLength = (raw: string): number | null => {
        const value = parseFloat(raw);
        if (Number.isNaN(value)) {
            return null;
        }
        if (raw.endsWith('vw')) {
            return (value / 100) * viewportWidth;
        }
        if (raw.endsWith('px')) {
            return value;
        }
        return null;
    };
    for (const clause of sizes.split(',')) {
        const trimmed = clause.trim();
        if (!trimmed) {
            continue;
        }
        const condition = /^\((min|max)-width:\s*([\d.]+)px\)\s+(\S+)$/.exec(
            trimmed,
        );
        if (condition) {
            const bound = parseFloat(condition[2]!);
            const matches =
                condition[1] === 'min'
                    ? viewportWidth >= bound
                    : viewportWidth <= bound;
            if (!matches) {
                continue;
            }
            const length = toLength(condition[3]!);
            if (length !== null) {
                return length;
            }
            continue;
        }
        // Bare default clause (no condition).
        if (!trimmed.startsWith('(')) {
            const length = toLength(trimmed);
            if (length !== null) {
                return length;
            }
        }
    }
    return viewportWidth;
}

/** Whether a `<source media>` condition matches the viewport. Same
 * deterministic subset as {@link resolveSizes}: min/max-width in px;
 * unsupported conditions read as NOT matching. Absent media matches. */
export function matchesMedia(
    media: string | undefined,
    viewport: Viewport,
): boolean {
    if (!media) {
        return true;
    }
    const condition = /^\(\s*(min|max)-width:\s*([\d.]+)px\s*\)$/.exec(
        media.trim(),
    );
    if (!condition) {
        return false;
    }
    const bound = parseFloat(condition[2]!);
    return condition[1] === 'min'
        ? viewport.width >= bound
        : viewport.width <= bound;
}

function pickFromCandidates(
    candidates: SrcsetCandidate[],
    slotWidth: number,
    dpr: number,
): SrcsetCandidate | null {
    if (!candidates.length) {
        return null;
    }
    const widthCandidates = candidates
        .filter((c) => c.width !== undefined)
        .sort((a, b) => a.width! - b.width!);
    if (widthCandidates.length) {
        const target = slotWidth * dpr;
        return (
            widthCandidates.find((c) => c.width! >= target) ??
            widthCandidates[widthCandidates.length - 1]!
        );
    }
    const densityCandidates = [...candidates].sort(
        (a, b) => (a.density ?? 1) - (b.density ?? 1),
    );
    return (
        densityCandidates.find((c) => (c.density ?? 1) >= dpr) ??
        densityCandidates[densityCandidates.length - 1]!
    );
}

export interface ResolvedImageSource {
    src: string;
    /** Intrinsic width (px) when the winning candidate declared one. */
    width?: number;
    /** The `<source>` entry that won, when selection went through
     * `sources` (picture semantics) rather than the item srcset. */
    source?: ImageSources;
}

/**
 * Deterministically resolve which image URL a viewport displays for an
 * item, mirroring picture/srcset semantics: the first matching
 * `sources[]` entry wins (spec order), then the item-level
 * `srcset`/`sizes`, then plain `src`. Returns null for items with no
 * image source at all.
 */
export function resolveImageSource(
    item: Pick<GalleryItem, 'src' | 'srcset' | 'sizes' | 'sources'>,
    viewport: Viewport,
): ResolvedImageSource | null {
    const dpr = viewport.dpr && viewport.dpr > 0 ? viewport.dpr : 1;
    for (const source of item.sources ?? []) {
        if (!matchesMedia(source.media, viewport)) {
            continue;
        }
        const picked = pickFromCandidates(
            parseSrcset(source.srcset),
            resolveSizes(source.sizes, viewport.width),
            dpr,
        );
        if (picked) {
            return { src: picked.url, width: picked.width, source };
        }
    }
    if (item.srcset) {
        const picked = pickFromCandidates(
            parseSrcset(item.srcset),
            resolveSizes(item.sizes, viewport.width),
            dpr,
        );
        if (picked) {
            return { src: picked.url, width: picked.width };
        }
    }
    return item.src ? { src: item.src } : null;
}

/**
 * The width "actual size" zoom refers to. `img.naturalWidth` LIES under
 * `srcset`/`sizes`: w-descriptor selection density-corrects the
 * intrinsic size to roughly the layout slot — on phones that collapses
 * the actual-size scale to ~1 and kills double-tap/pinch zoom. The real
 * ceiling is the largest candidate the ladder can serve (first matching
 * `sources[]` entry per picture semantics, else the item srcset);
 * without width descriptors the reported natural width stands.
 */
export function getActualSizeWidth(
    item: Pick<GalleryItem, 'srcset' | 'sources'>,
    viewport: Viewport,
    naturalWidth: number,
): number {
    let candidates: SrcsetCandidate[] = [];
    for (const source of item.sources ?? []) {
        if (matchesMedia(source.media, viewport)) {
            candidates = parseSrcset(source.srcset);
            break;
        }
    }
    if (!candidates.length && item.srcset) {
        candidates = parseSrcset(item.srcset);
    }
    const widths = candidates
        .map((candidate) => candidate.width)
        .filter((width): width is number => width !== undefined);
    if (widths.length) {
        return Math.max(...widths);
    }
    return naturalWidth;
}

/**
 * How long a slide waits on `img.decode()` before completing anyway —
 * the gate must never strand a slide on a browser that rejects or
 * stalls decode (huge images evict decoded data; some UAs reject on
 * detached nodes).
 */
export const DECODE_TIMEOUT_MS = 500;

/**
 * Decode gate: resolve when the image is safe to paint — after
 * `decode()` settles (success OR rejection; rejection still means the
 * data arrived) or after the timeout, whichever is first. Browsers
 * without `decode()` resolve immediately (the load event already
 * fired). Never rejects.
 */
export function awaitDecode(
    img: { decode?: () => Promise<void> },
    timeoutMs: number = DECODE_TIMEOUT_MS,
): Promise<void> {
    if (typeof img.decode !== 'function') {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        let done = false;
        const finish = () => {
            if (!done) {
                done = true;
                clearTimeout(timer);
                resolve();
            }
        };
        const timer = setTimeout(finish, timeoutMs);
        img.decode!().then(finish, finish);
    });
}
