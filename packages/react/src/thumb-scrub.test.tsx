import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LightGallery, type GalleryItem } from './index';
import Thumbnail from './plugins/thumbnail';

/**
 * scrubThumbnails: while the strip is dragged it drives the gallery —
 * the slide under the strip's travel position becomes current
 * immediately (instant no-animation timeline path). jsdom reports a
 * 0-width strip, so travel maps over [0, totalWidth]: 10 thumbs of
 * 105px unit → 1050px travel across indexes 0..9.
 */

const slides: GalleryItem[] = Array.from({ length: 10 }, (_, i) => ({
    src: `img-${i}.jpg`,
    thumb: `thumb-${i}.jpg`,
    alt: `Slide ${i}`,
}));

function tick(ms: number) {
    act(() => {
        vi.advanceTimersByTime(ms);
    });
}

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

function renderStrip(scrubThumbnails: boolean) {
    render(
        <LightGallery
            slides={slides}
            open={true}
            onClose={() => undefined}
            plugins={[Thumbnail]}
            thumbnail={{ scrubThumbnails }}
        />,
    );
    tick(450);
    return document.querySelector<HTMLElement>('.lg-thumb')!;
}

function activeThumbId(): string | null {
    return (
        document
            .querySelector('.lg-thumb-item.active')
            ?.getAttribute('data-lg-item-id') ?? null
    );
}

/** Drive the release spring frame by frame (fake-timer rAF). */
function settleSpring() {
    for (let i = 0; i < 400; i++) {
        tick(16);
    }
}

describe('thumbnail scrub (scrubThumbnails)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        act(() => {
            vi.runOnlyPendingTimers();
        });
        vi.useRealTimers();
    });

    it('drives the gallery synchronously while the strip drags', () => {
        const track = renderStrip(true);
        expect(activeThumbId()).toBe('0');

        firePointer(track, 'pointerdown', 600);
        tick(16);
        // Initial pager translate is 49 (jsdom 0-width strip); dragging
        // 500px left lands the travel at 549/1050 → index 5.
        firePointer(window, 'pointermove', 100);

        // Immediately — no timers advanced: the instant path swapped
        // the current slide within the same commit.
        expect(activeThumbId()).toBe('5');
        expect(
            document
                .querySelector('.lg-item.lg-current')
                ?.querySelector('img')
                ?.getAttribute('src'),
        ).toBe('img-5.jpg');
        expect(
            document
                .querySelector('.lg-outer')
                ?.classList.contains('lg-thumb-scrubbing'),
        ).toBe(true);

        // Hold still past the velocity window so the release carries no
        // momentum — the selection must stay where the finger stopped.
        tick(150);
        firePointer(window, 'pointermove', 100);
        tick(16);
        firePointer(window, 'pointerup', 100);
        settleSpring();
        // Session over: class dropped, selection kept.
        expect(
            document
                .querySelector('.lg-outer')
                ?.classList.contains('lg-thumb-scrubbing'),
        ).toBe(false);
        expect(activeThumbId()).toBe('5');
    });

    it('keeps scrubbing through the release glide', () => {
        const track = renderStrip(true);
        // A fast flick whose projection carries past the release point.
        firePointer(track, 'pointerdown', 600);
        tick(16);
        firePointer(window, 'pointermove', 500);
        tick(16);
        firePointer(window, 'pointermove', 400);
        const atRelease = activeThumbId();
        firePointer(window, 'pointerup', 400);
        settleSpring();
        // The glide advanced the selection beyond the release index.
        expect(Number(activeThumbId())).toBeGreaterThan(Number(atRelease));
    });

    it('reaches the last slide at full travel', () => {
        const track = renderStrip(true);
        firePointer(track, 'pointerdown', 2000);
        tick(16);
        // Far past the strip end: elastic overshoot clamps, index pins.
        firePointer(window, 'pointermove', -2000);
        expect(activeThumbId()).toBe('9');
        firePointer(window, 'pointerup', -2000);
        settleSpring();
        expect(activeThumbId()).toBe('9');
    });

    it('does not navigate from strip drags when disabled', () => {
        const track = renderStrip(false);
        firePointer(track, 'pointerdown', 600);
        tick(16);
        firePointer(window, 'pointermove', 100);
        expect(activeThumbId()).toBe('0');
        expect(
            document
                .querySelector('.lg-outer')
                ?.classList.contains('lg-thumb-scrubbing'),
        ).toBe(false);
        firePointer(window, 'pointerup', 100);
        settleSpring();
        expect(activeThumbId()).toBe('0');
    });
});
