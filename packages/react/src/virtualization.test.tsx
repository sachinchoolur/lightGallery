import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LightGallery, type GalleryItem } from './index';
import Thumbnail from './plugins/thumbnail';

/**
 * Plan 010: a 1,000-item gallery keeps its DOM bounded — the slide pool
 * caps mounted `.lg-item`s and the thumbnail strip renders only a window
 * (spacers preserve the strip geometry). jsdom reports a 0-width strip,
 * so the thumb window is overscan-driven and fully deterministic.
 */

const slides: GalleryItem[] = Array.from({ length: 1000 }, (_, i) => ({
    src: `img-${i}.jpg`,
    thumb: `thumb-${i}.jpg`,
    alt: `Slide ${i}`,
}));

function tick(ms: number) {
    act(() => {
        vi.advanceTimersByTime(ms);
    });
}

describe('virtualization (plan 010)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        act(() => {
            vi.runOnlyPendingTimers();
        });
        vi.useRealTimers();
    });

    it('bounds slides and thumbnails for a 1,000-item gallery', () => {
        render(
            <LightGallery
                slides={slides}
                open={true}
                onClose={() => undefined}
                plugins={[Thumbnail]}
                virtualization={{ slides: 7, thumbs: 2 }}
            />,
        );
        tick(450);

        // Slide pool: window of 7 around index 0 + the loop far-end slide.
        expect(document.querySelectorAll('.lg-item').length).toBe(8);

        // Thumb window: 0-width jsdom strip → overscan-driven window (the
        // middle-pager translate of 49px keeps thumbs 0-2 mounted), with a
        // trailing spacer standing in for the rest.
        const thumbs = document.querySelectorAll('.lg-thumb-item');
        expect(thumbs.length).toBe(3);
        const spacers =
            document.querySelectorAll<HTMLElement>('.lg-thumb-spacer');
        expect(spacers.length).toBe(1);
        expect(spacers[0]!.style.width).toBe(`${(1000 - 3) * 105}px`);
        // The track keeps its full scroll geometry.
        expect(
            document.querySelector<HTMLElement>('.lg-thumb')!.style.width,
        ).toBe(`${1000 * 105}px`);
    });

    it('renders every thumbnail when virtualization is off (default)', () => {
        render(
            <LightGallery
                slides={slides.slice(0, 100)}
                open={true}
                onClose={() => undefined}
                plugins={[Thumbnail]}
            />,
        );
        tick(450);
        expect(document.querySelectorAll('.lg-thumb-item').length).toBe(100);
        expect(document.querySelector('.lg-thumb-spacer')).toBeNull();
        // Slide pool still bounded by numberOfSlideItemsInDom (2.x).
        expect(
            document.querySelectorAll('.lg-item').length,
        ).toBeLessThanOrEqual(11);
    });

    it('advances the thumb window when the slide changes', () => {
        render(
            <LightGallery
                slides={slides}
                open={true}
                index={500}
                onClose={() => undefined}
                plugins={[Thumbnail]}
                virtualization={{ slides: 7, thumbs: 2 }}
            />,
        );
        tick(450);
        const ids = [
            ...document.querySelectorAll<HTMLElement>('.lg-thumb-item'),
        ].map((el) => Number(el.dataset.lgItemId));
        // The committed translate centers index 500 — the window follows.
        expect(Math.min(...ids)).toBeGreaterThan(400);
        expect(Math.max(...ids)).toBeLessThan(600);
        // Two spacers now: leading and trailing.
        expect(document.querySelectorAll('.lg-thumb-spacer').length).toBe(2);
    });
});

describe('thumbnail strip physics (plan 010)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        act(() => {
            vi.runOnlyPendingTimers();
        });
        vi.useRealTimers();
    });

    function firePointer(
        target: EventTarget,
        type: 'pointerdown' | 'pointermove' | 'pointerup',
        x: number,
    ) {
        const event = new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: x,
        });
        Object.defineProperty(event, 'pointerId', { value: 7 });
        act(() => {
            target.dispatchEvent(event);
        });
    }

    function renderStrip() {
        render(
            <LightGallery
                slides={slides.slice(0, 10)}
                open={true}
                onClose={() => undefined}
                plugins={[Thumbnail]}
            />,
        );
        tick(450);
        return document.querySelector<HTMLElement>('.lg-thumb')!;
    }

    // jsdom strip width is 0, so the initial pager translate is 49px
    // (the middle-pager offset) and the clamp range is [0, totalWidth].
    const START_TRANSLATE = 49;

    function trackX(track: HTMLElement): number {
        return parseFloat(track.style.transform.replace('translate3d(', ''));
    }

    /** Drive the spring frame by frame (fake-timer rAF chains poorly). */
    function settleSpring() {
        for (let i = 0; i < 400; i++) {
            tick(16);
        }
    }

    it('glides on release with a projected, clamped fling', () => {
        const track = renderStrip();
        // A fast flick: 100px per 16ms frame (6.25 px/ms) projects well
        // past the strip end, so the fling target clamps to the max.
        firePointer(track, 'pointerdown', 500);
        tick(16);
        firePointer(window, 'pointermove', 400);
        tick(16);
        firePointer(window, 'pointermove', 300);
        const atRelease = trackX(track);
        firePointer(window, 'pointerup', 300);
        // Mid-glide: the spring keeps moving the track after the release.
        tick(48);
        expect(trackX(track)).toBeLessThan(atRelease);
        // Settle: committed at the clamped fling target (strip max —
        // jsdom's 0-width strip makes max = totalWidth).
        settleSpring();
        expect(track.style.transform).toBe('translate3d(-1050px, 0px, 0px)');
    });

    it('rubber-bands past the leading edge and springs back', () => {
        const track = renderStrip();
        firePointer(track, 'pointerdown', 100);
        tick(16);
        // Drag right past the leading edge: the raw overshoot compresses
        // by the shared edge friction (0.35).
        firePointer(window, 'pointermove', 200);
        expect(trackX(track)).toBeCloseTo(-((START_TRANSLATE - 100) * 0.35), 1);
        firePointer(window, 'pointerup', 200);
        // The release spring pulls the overshoot back to the bound.
        settleSpring();
        expect(track.style.transform).toBe('translate3d(0px, 0px, 0px)');
    });
});

describe('fling corridor on a windowed strip (plan 010)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        act(() => {
            vi.runOnlyPendingTimers();
        });
        vi.useRealTimers();
    });

    function firePointer(
        target: EventTarget,
        type: 'pointerdown' | 'pointermove' | 'pointerup',
        x: number,
    ) {
        const event = new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: x,
        });
        Object.defineProperty(event, 'pointerId', { value: 7 });
        act(() => {
            target.dispatchEvent(event);
        });
    }

    function thumbIds(): number[] {
        return [
            ...document.querySelectorAll<HTMLElement>('.lg-thumb-item'),
        ].map((el) => Number(el.dataset.lgItemId));
    }

    it('renders the whole flight path at release, shrinks at settle', () => {
        render(
            <LightGallery
                slides={slides}
                open={true}
                onClose={() => undefined}
                plugins={[Thumbnail]}
                virtualization={{ slides: 7, thumbs: 2 }}
            />,
        );
        tick(450);
        const track = document.querySelector<HTMLElement>('.lg-thumb')!;

        // Fast flick: 100px per 16ms (6.25 px/ms) → projected target
        // 1492.75px, ~14 thumbs downstream of the release point.
        firePointer(track, 'pointerdown', 500);
        tick(16);
        firePointer(window, 'pointermove', 400);
        tick(16);
        firePointer(window, 'pointermove', 300);
        firePointer(window, 'pointerup', 300);

        // Immediately after release the corridor covers release→target,
        // so the glide never crosses unrendered thumbs.
        const corridorIds = thumbIds();
        expect(Math.min(...corridorIds)).toBe(0);
        expect(Math.max(...corridorIds)).toBe(16);

        // At settle the window shrinks back around the target.
        for (let i = 0; i < 400; i++) {
            tick(16);
        }
        const settledIds = thumbIds();
        expect(Math.min(...settledIds)).toBe(12);
        expect(Math.max(...settledIds)).toBe(16);
    });
});
