/**
 * Virtualization: a 1,000-item gallery keeps its DOM bounded — the slide pool
 * caps mounted `.lg-item`s and the thumbnail strip renders only a window
 * (spacers preserve the strip geometry). jsdom reports a 0-width strip,
 * so the thumb window is overscan-driven and fully deterministic.
 */
import '@testing-library/jest-dom';

import lightGallery from '../src';
import { LightGallery } from '../src/lightgallery';
import { LightGallerySettings } from '../src/lg-settings';
import Thumbnail from '../src/plugins/thumbnail/lg-thumbnail';

function buildGallery(count: number): void {
    document.body.innerHTML = `<div id="lightGallery">${Array.from(
        { length: count },
        (_, i) => `
        <a href="img-${i}.jpg" data-thumb="thumb-${i}.jpg">
            <img src="thumb-${i}.jpg" alt="Slide ${i}" />
        </a>`,
    ).join('')}</div>`;
}

function initGallery(
    count: number,
    settings: LightGallerySettings = {},
): LightGallery {
    buildGallery(count);
    return lightGallery(
        document.getElementById('lightGallery') as HTMLElement,
        {
            plugins: [Thumbnail],
            speed: 0,
            backdropDuration: 0,
            startAnimationDuration: 0,
            zoomFromOrigin: false,
            ...settings,
        },
    );
}

describe('virtualization (vanilla)', () => {
    let instance: LightGallery | undefined;

    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        instance?.destroy();
        instance = undefined;
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        document.body.innerHTML = '';
    });

    it('bounds slides and thumbnails for a 1,000-item gallery', () => {
        instance = initGallery(1000, {
            virtualization: { slides: 7, thumbs: 2 },
        });
        instance.openGallery(0);
        jest.advanceTimersByTime(300);

        // Slide pool: window of 7 around index 0 + the loop far-end slide.
        expect(document.querySelectorAll('.lg-item').length).toBe(8);

        // Thumb window: 0-width jsdom strip → overscan-driven window (the
        // middle-pager translate of 49px keeps thumbs 0-2 mounted).
        expect(document.querySelectorAll('.lg-thumb-item').length).toBe(3);
        // Windowed thumbs are lazy like the classic strip.
        document
            .querySelectorAll('.lg-thumb-item img')
            .forEach((img) => expect(img).toHaveAttribute('loading', 'lazy'));
        const spacers =
            document.querySelectorAll<HTMLElement>('.lg-thumb-spacer');
        expect(spacers.length).toBe(1);
        expect(spacers[0]!.style.width).toBe(`${(1000 - 3) * 105}px`);
        // The track keeps its full scroll geometry.
        expect(
            document.querySelector<HTMLElement>('.lg-thumb')!.style.width,
        ).toBe(`${1000 * 105}px`);
    });

    it('marks exactly one thumb active after a windowed re-render', () => {
        instance = initGallery(1000, {
            virtualization: { slides: 7, thumbs: 2 },
        });
        instance.openGallery(0);
        jest.advanceTimersByTime(300);

        // The strip re-renders inside beforeSlide, before the core index
        // moves: the previous thumb must not keep its active mark.
        instance.slide(5, false, false, false);
        jest.advanceTimersByTime(100);
        const active = document.querySelectorAll<HTMLElement>(
            '.lg-thumb-item.active',
        );
        expect(active).toHaveLength(1);
        expect(active[0]).toHaveAttribute('data-lg-item-id', '5');
    });

    it('keeps the pressed thumb mounted through a rubber-band wobble', () => {
        instance = initGallery(1000, {
            virtualization: { slides: 7, thumbs: 2 },
            scrubThumbnails: true,
        });
        instance.openGallery(0);
        jest.advanceTimersByTime(300);
        const thumb = document.querySelector<HTMLElement>(
            '.lg-thumb-item[data-lg-item-id="1"] img',
        )!;
        const count = document.querySelectorAll('.lg-thumb-item').length;

        // A click with a 3px wobble toward the leading edge: the elastic
        // overshoot runs negative and must not be read as a drag past the
        // rendered window, or the strip rebuilds under the pointer and the
        // pressed thumb's click never happens.
        const down = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(down, 'pageX', { value: 500 });
        thumb.dispatchEvent(down);
        jest.advanceTimersByTime(16);
        const move = new MouseEvent('mousemove', { bubbles: true });
        Object.defineProperty(move, 'pageX', { value: 503 });
        window.dispatchEvent(move);
        expect(thumb.isConnected).toBe(true);
        // One pixel is four slides on this strip: a wobble must not scrub.
        expect(instance.index).toBe(0);
        expect(document.querySelectorAll('.lg-thumb-item')).toHaveLength(count);
        const up = new MouseEvent('mouseup', { bubbles: true });
        Object.defineProperty(up, 'pageX', { value: 503 });
        window.dispatchEvent(up);
        thumb.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        jest.advanceTimersByTime(100);
        expect(instance.index).toBe(1);
    });

    it('renders every thumbnail when virtualization is off (default)', () => {
        instance = initGallery(100);
        instance.openGallery(0);
        jest.advanceTimersByTime(300);

        expect(document.querySelectorAll('.lg-thumb-item').length).toBe(100);
        expect(document.querySelector('.lg-thumb-spacer')).toBeNull();
        // Slide pool still bounded by numberOfSlideItemsInDom (2.x).
        expect(
            document.querySelectorAll('.lg-item').length,
        ).toBeLessThanOrEqual(11);
    });

    it('advances the thumb window and active thumb on slide change', () => {
        instance = initGallery(1000, {
            virtualization: { slides: 7, thumbs: 2 },
        });
        instance.openGallery(500);
        jest.advanceTimersByTime(300);

        const ids = [
            ...document.querySelectorAll<HTMLElement>('.lg-thumb-item'),
        ].map((el) => Number(el.getAttribute('data-lg-item-id')));
        expect(Math.min(...ids)).toBeGreaterThan(400);
        expect(Math.max(...ids)).toBeLessThan(600);
        // Both spacers present; the active thumb is the shown slide.
        expect(document.querySelectorAll('.lg-thumb-spacer').length).toBe(2);
        expect(document.querySelector('.lg-thumb-item.active')).toHaveAttribute(
            'data-lg-item-id',
            '500',
        );
    });
});

describe('thumbnail strip physics (vanilla)', () => {
    let instance: LightGallery | undefined;

    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        instance?.destroy();
        instance = undefined;
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        document.body.innerHTML = '';
    });

    function fireMouse(
        target: EventTarget,
        type: 'mousedown' | 'mousemove' | 'mouseup',
        pageX: number,
    ): void {
        const event = new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(event, 'pageX', { value: pageX });
        target.dispatchEvent(event);
    }

    function trackX(): number {
        const track = document.querySelector<HTMLElement>('.lg-thumb')!;
        return parseFloat(track.style.transform.replace('translate3d(', ''));
    }

    function settleSpring(): void {
        for (let i = 0; i < 400; i++) {
            jest.advanceTimersByTime(16);
        }
    }

    it('treats a press below the swipe threshold as a click, not a glide', () => {
        instance = initGallery(10, { scrubThumbnails: true });
        instance.openGallery(0);
        jest.advanceTimersByTime(300);
        const track = document.querySelector<HTMLElement>('.lg-thumb')!;
        const outer = document.querySelector<HTMLElement>('.lg-outer')!;
        const thumb = document.querySelector<HTMLElement>(
            '.lg-thumb-item[data-lg-item-id="3"] img',
        )!;
        expect(trackX()).toBe(-49);

        // A click with a 3px wobble: below the swipe threshold no scrub
        // session starts and the gallery does not move...
        fireMouse(thumb, 'mousedown', 500);
        jest.advanceTimersByTime(16);
        fireMouse(window, 'mousemove', 503);
        expect(outer).not.toHaveClass('lg-thumb-scrubbing');
        expect(instance.index).toBe(0);
        jest.advanceTimersByTime(16);
        fireMouse(window, 'mouseup', 503);
        // ...and the release runs no glide: the strip snaps back.
        expect(outer).not.toHaveClass('lg-thumb-scrubbing');
        jest.advanceTimersByTime(48);
        expect(trackX()).toBe(-49);

        // The click then navigates and the strip centers on the slide
        // (105px unit × 3 - 1 + 50 for the 0-width jsdom strip).
        thumb.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        jest.advanceTimersByTime(100);
        expect(instance.index).toBe(3);
        expect(trackX()).toBe(-364);
    });

    it('glides on release and rubber-bands past the edges', () => {
        instance = initGallery(10);
        instance.openGallery(0);
        jest.advanceTimersByTime(300);
        const track = document.querySelector<HTMLElement>('.lg-thumb')!;

        // Fast flick left: the release spring keeps the strip moving and
        // settles at the clamped fling target (jsdom strip width 0 →
        // max translate = total width).
        fireMouse(track, 'mousedown', 500);
        jest.advanceTimersByTime(16);
        fireMouse(window, 'mousemove', 400);
        jest.advanceTimersByTime(16);
        fireMouse(window, 'mousemove', 300);
        const atRelease = trackX();
        fireMouse(window, 'mouseup', 300);
        jest.advanceTimersByTime(48);
        expect(trackX()).toBeLessThan(atRelease);
        settleSpring();
        expect(trackX()).toBe(-1050);

        // Rubber band: dragging right past the leading edge compresses
        // the overshoot; the release spring pulls it back to the bound.
        fireMouse(track, 'mousedown', 100);
        jest.advanceTimersByTime(16);
        fireMouse(window, 'mousemove', 1300);
        // raw = 1050 - 1200 = -150 → elastic -52.5 → transform +52.5.
        expect(trackX()).toBeCloseTo(52.5, 1);
        fireMouse(window, 'mouseup', 1300);
        settleSpring();
        expect(trackX()).toBeCloseTo(0, 5);
    });
});
