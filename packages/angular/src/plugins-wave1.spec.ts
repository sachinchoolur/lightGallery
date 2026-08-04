import { Component, signal, viewChild } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    LgGalleryComponent,
    LgGalleryRuntime,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withVideo } from '@lightgallery/angular/plugins/video';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'a' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'b' },
    {
        src: 'https://www.youtube.com/watch?v=abc123xyz90',
        alt: 'video slide',
    },
];

function query(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}

function queryAll(selector: string): HTMLElement[] {
    return [...document.querySelectorAll<HTMLElement>(selector)];
}

async function flush<T>(fixture: ComponentFixture<T>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
}

async function advance<T>(
    fixture: ComponentFixture<T>,
    ms: number,
): Promise<void> {
    vi.advanceTimersByTime(ms);
    await flush(fixture);
}

/**
 * jsdom has no PointerEvent constructor; a MouseEvent with the pointer
 * fields defined on it walks and quacks enough for the native listeners.
 */
function firePointer(
    target: EventTarget,
    type: 'pointerdown' | 'pointermove' | 'pointerup',
    init: { x: number; y: number; pointerId?: number },
): void {
    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: init.x,
        clientY: init.y,
    });
    Object.defineProperty(event, 'pointerId', { value: init.pointerId ?? 1 });
    Object.defineProperty(event, 'pointerType', { value: 'touch' });
    target.dispatchEvent(event);
}

@Component({
    imports: [LgGalleryComponent],
    template: `
        <lg-gallery
            [slides]="items"
            [zoomFromOrigin]="false"
            [features]="features"
            [pinchToClose]="pinchToClose()"
            (posterClick)="posterClicks = posterClicks + 1"
            (hasVideo)="hasVideos.push($event.index)"
        />
    `,
})
class Wave1Host {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = ITEMS;
    features = [withThumbnail(), withZoom(), withVideo()];
    readonly pinchToClose = signal(true);
    posterClicks = 0;
    readonly hasVideos: number[] = [];
}

function runtimeOf(fixture: ComponentFixture<Wave1Host>): LgGalleryRuntime {
    return fixture.debugElement
        .query((el) => el.name === 'lg-gallery')!
        .injector.get(LgGalleryRuntime);
}

async function openAndLoad(
    fixture: ComponentFixture<Wave1Host>,
    index = 0,
): Promise<void> {
    fixture.componentInstance.gallery().openGallery(index);
    await flush(fixture);
    await advance(fixture, 450);
    const img = document.querySelector<HTMLImageElement>(
        `img.lg-image[data-index="${index}"]`,
    );
    img?.dispatchEvent(new Event('load'));
    await flush(fixture);
}

describe('wave-1 features', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('composes all three without ordering bugs and sets outer classes', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        await flush(fixture);
        await openAndLoad(fixture);

        const outer = query('.lg-outer')!;
        expect(outer.classList.contains('lg-has-thumb')).toBe(true);
        expect(outer.classList.contains('lg-animate-thumb')).toBe(true);
        expect(outer.classList.contains('lg-use-transition-for-zoom')).toBe(
            true,
        );
        expect(query('.lg-thumb-outer')).not.toBeNull();
        expect(query('.lg-actual-size')).not.toBeNull();
    });

    it('thumbnail: renders every item, tracks the active index, navigates on click', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        await flush(fixture);
        await openAndLoad(fixture);

        const thumbs = queryAll('.lg-thumb-item');
        expect(thumbs.length).toBe(3);
        expect(thumbs[0]!.classList.contains('active')).toBe(true);
        // The video item derives its thumb from img.youtube.com (2.x).
        expect(thumbs[2]!.querySelector('img')!.getAttribute('src')).toContain(
            'img.youtube.com/vi/abc123xyz90',
        );

        thumbs[1]!.click();
        await flush(fixture);
        await advance(fixture, 500);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');
        expect(
            queryAll('.lg-thumb-item')[1]!.classList.contains('active'),
        ).toBe(true);
    });

    it('zoom: actual-size toggles committed scale, claims the seam, resets on navigation', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        await flush(fixture);
        await openAndLoad(fixture);
        const runtime = runtimeOf(fixture);

        (query('.lg-actual-size') as HTMLButtonElement).click();
        await flush(fixture);

        const scaleEl = query(
            '.lg-item.lg-current .lg-zoom-scale',
        ) as HTMLElement;
        // jsdom has no image metrics -> actual-size falls back to scale 2.
        expect(scaleEl.style.transform).toBe('scale3d(2, 2, 1)');
        expect(query('.lg-outer')!.classList.contains('lg-zoomed')).toBe(true);
        // Core swipe stands down while zoomed.
        expect(runtime.gestureSeam.lockOwner).toBe('zoomSwipe');

        // Toggling back returns to identity and releases the lock.
        (query('.lg-actual-size') as HTMLButtonElement).click();
        await flush(fixture);
        expect(runtime.gestureSeam.lockOwner).toBeNull();
        expect(query('.lg-outer')!.classList.contains('lg-zoomed')).toBe(false);

        // Zoom again, then navigate: the wrapper resets (2.x parity).
        (query('.lg-actual-size') as HTMLButtonElement).click();
        await flush(fixture);
        expect(runtime.gestureSeam.lockOwner).toBe('zoomSwipe');
        fixture.componentInstance.gallery().nextSlide();
        await flush(fixture);
        await advance(fixture, 500);
        expect(runtime.gestureSeam.lockOwner).toBeNull();
        expect(query('.lg-outer')!.classList.contains('lg-zoomed')).toBe(false);
    });

    it('zoom: does not leak a tap into a phantom pinch (pointer ledger)', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        await flush(fixture);
        await openAndLoad(fixture);
        // Pointer interactions arm `enableZoomAfter` ms after the load.
        await advance(fixture, 350);
        const panEl = query('.lg-item.lg-current .lg-zoom-pan')!;
        const scaleEl = query('.lg-item.lg-current .lg-zoom-scale')!;

        // A plain tap on the (unzoomed) slide: down + up, no gesture.
        firePointer(panEl, 'pointerdown', { x: 100, y: 100, pointerId: 11 });
        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 11 });

        // Next single finger must NOT read as a second pinch pointer.
        firePointer(panEl, 'pointerdown', { x: 200, y: 100, pointerId: 12 });
        firePointer(window, 'pointermove', { x: 260, y: 160, pointerId: 12 });
        // A leaked tap pointer would misroute this into a pinch and
        // scale the slide; the rendered rest transform must not change.
        expect(scaleEl.style.transform).toBe('scale3d(1, 1, 1)');
        firePointer(window, 'pointerup', { x: 260, y: 160, pointerId: 12 });
    });

    it('zoom: pans (not pinches) after a double-tap zoom', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        await flush(fixture);
        await openAndLoad(fixture);
        await advance(fixture, 350);
        const img = query('img.lg-image[data-index="0"]')!;
        const scaleEl = query('.lg-item.lg-current .lg-zoom-scale')!;

        // Touch double-tap on the image zooms in (fallback scale 2).
        firePointer(img, 'pointerdown', { x: 50, y: 50, pointerId: 21 });
        firePointer(window, 'pointerup', { x: 50, y: 50, pointerId: 21 });
        vi.advanceTimersByTime(100);
        firePointer(img, 'pointerdown', { x: 50, y: 50, pointerId: 22 });
        firePointer(window, 'pointerup', { x: 50, y: 50, pointerId: 22 });
        expect(scaleEl.style.transform).toBe('scale3d(2, 2, 1)');

        // The next single finger pans — a leaked tap pointer would
        // misroute this into a pinch and change the scale.
        firePointer(img, 'pointerdown', { x: 60, y: 60, pointerId: 23 });
        firePointer(window, 'pointermove', { x: 120, y: 120, pointerId: 23 });
        expect(scaleEl.style.transform).toBe('scale3d(2, 2, 1)');
        firePointer(window, 'pointerup', { x: 120, y: 120, pointerId: 23 });
    });

    it('zoom: snaps a pinch release into [1, actual size] despite infiniteZoom', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        // pinchToClose off: the under-fit part of this test exercises the
        // disarmed spring-back (armed default would close the gallery).
        fixture.componentInstance.pinchToClose.set(false);
        await flush(fixture);
        await openAndLoad(fixture);
        await advance(fixture, 350);
        const panEl = query('.lg-item.lg-current .lg-zoom-pan')!;
        const scaleEl = query('.lg-item.lg-current .lg-zoom-scale')!;

        // Pinch far beyond the actual-size scale (jsdom fallback max: 2).
        firePointer(panEl, 'pointerdown', { x: 100, y: 100, pointerId: 41 });
        firePointer(panEl, 'pointerdown', { x: 200, y: 100, pointerId: 42 });
        firePointer(window, 'pointermove', { x: 500, y: 100, pointerId: 42 });
        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 41 });
        // 2.x pinch touchend rule: release lands on actual size even with
        // the infiniteZoom default (the spring settles it).
        vi.advanceTimersByTime(2000);
        expect(scaleEl.style.transform).toBe('scale3d(2, 2, 1)');
        firePointer(window, 'pointerup', { x: 500, y: 100, pointerId: 42 });

        // Reset to the unzoomed state, then pinch inwards below fit and
        // release: back to scale 1. Starting from scale 1 guards the
        // commit-equals-previous-state path (the styles must still land).
        query('img.lg-image[data-index="0"]')!.dispatchEvent(
            new MouseEvent('dblclick', { bubbles: true }),
        );
        firePointer(panEl, 'pointerdown', { x: 100, y: 100, pointerId: 43 });
        firePointer(panEl, 'pointerdown', { x: 300, y: 100, pointerId: 44 });
        firePointer(window, 'pointermove', { x: 140, y: 100, pointerId: 44 });
        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 43 });
        vi.advanceTimersByTime(2000);
        expect(scaleEl.style.transform).toBe('scale3d(1, 1, 1)');
        firePointer(window, 'pointerup', { x: 140, y: 100, pointerId: 44 });
    });

    it('zoom: a tap that kills a release glide re-settles the scale', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        fixture.componentInstance.pinchToClose.set(false);
        fixture.componentInstance.features = [
            withThumbnail(),
            withZoom({ infiniteZoom: false }),
            withVideo(),
        ];
        await flush(fixture);
        await openAndLoad(fixture);
        await advance(fixture, 350);
        const panEl = query('.lg-item.lg-current .lg-zoom-pan')!;
        const scaleEl = query('.lg-item.lg-current .lg-zoom-scale')!;

        // Pinch far beyond the cap (jsdom fallback max: 2) and release —
        // the spring starts gliding the scale back down to the cap.
        firePointer(panEl, 'pointerdown', { x: 100, y: 100, pointerId: 81 });
        firePointer(panEl, 'pointerdown', { x: 200, y: 100, pointerId: 82 });
        firePointer(window, 'pointermove', { x: 500, y: 100, pointerId: 82 });
        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 81 });
        firePointer(window, 'pointerup', { x: 500, y: 100, pointerId: 82 });

        // A few frames in: mid-glide, still above the cap.
        vi.advanceTimersByTime(48);
        const midGlide = parseFloat(
            /scale3d\(([\d.]+)/.exec(scaleEl.style.transform)![1]!,
        );
        expect(midGlide).toBeGreaterThan(2);

        // Tap: pointerdown grabs the glide (kills the spring); the
        // no-move release must settle the scale back into [1, cap] —
        // pre-fix it committed the stranded mid-glide value.
        firePointer(panEl, 'pointerdown', { x: 150, y: 100, pointerId: 83 });
        firePointer(window, 'pointerup', { x: 150, y: 100, pointerId: 83 });
        vi.advanceTimersByTime(2000);
        expect(scaleEl.style.transform).toBe('scale3d(2, 2, 1)');
    });

    it('zoom: pans with the pinch midpoint (fused zoom-and-pan)', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        fixture.componentInstance.pinchToClose.set(false);
        await flush(fixture);
        await openAndLoad(fixture);
        await advance(fixture, 350);
        const panEl = query('.lg-item.lg-current .lg-zoom-pan')!;

        // Two fingers 100 apart; move BOTH +60px right, spread unchanged:
        // scale stays 1, the image follows the midpoint 1:1.
        firePointer(panEl, 'pointerdown', { x: 100, y: 100, pointerId: 61 });
        firePointer(panEl, 'pointerdown', { x: 200, y: 100, pointerId: 62 });
        firePointer(window, 'pointermove', { x: 160, y: 100, pointerId: 61 });
        firePointer(window, 'pointermove', { x: 260, y: 100, pointerId: 62 });
        expect(panEl.style.transform).toBe('translate3d(60px, 0px, 0)');

        // Release: same-tick samples read zero velocity (windowed guard),
        // and scale 1 clamps the pan back to center on the spring.
        firePointer(window, 'pointerup', { x: 160, y: 100, pointerId: 61 });
        vi.advanceTimersByTime(2000);
        expect(panEl.style.transform).toBe('translate3d(0px, 0px, 0)');
        firePointer(window, 'pointerup', { x: 260, y: 100, pointerId: 62 });
    });

    it('zoom: re-baselines the pinch when a pair finger lifts under a third', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        fixture.componentInstance.pinchToClose.set(false);
        await flush(fixture);
        await openAndLoad(fixture);
        await advance(fixture, 350);
        const panEl = query('.lg-item.lg-current .lg-zoom-pan')!;

        // Pinch 61+62: spread 100 → 160 (scale 1.6), midpoint 150 → 180.
        firePointer(panEl, 'pointerdown', { x: 100, y: 100, pointerId: 61 });
        firePointer(panEl, 'pointerdown', { x: 200, y: 100, pointerId: 62 });
        firePointer(window, 'pointermove', { x: 260, y: 100, pointerId: 62 });
        expect(panEl.style.transform).toBe('translate3d(-60px, -60px, 0)');

        // Third finger rests, then pair finger 61 lifts: re-baseline,
        // no midpoint leap.
        firePointer(panEl, 'pointerdown', { x: 400, y: 100, pointerId: 63 });
        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 61 });
        expect(panEl.style.transform).toBe('translate3d(-60px, -60px, 0)');

        // Both remaining fingers +10px, spread unchanged: pan 1:1.
        firePointer(window, 'pointermove', { x: 270, y: 100, pointerId: 62 });
        firePointer(window, 'pointermove', { x: 410, y: 100, pointerId: 63 });
        expect(panEl.style.transform).toBe('translate3d(-50px, -60px, 0)');

        firePointer(window, 'pointerup', { x: 270, y: 100, pointerId: 62 });
        firePointer(window, 'pointerup', { x: 410, y: 100, pointerId: 63 });
        vi.advanceTimersByTime(2000);
    });

    it('zoom: closes on a pinch released below fit (default pinchToClose)', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        await flush(fixture);
        await openAndLoad(fixture);
        await advance(fixture, 350);
        const panEl = query('.lg-item.lg-current .lg-zoom-pan')!;

        // Squeeze from fit: distance 200 → 40 (scale 0.2), release.
        firePointer(panEl, 'pointerdown', { x: 100, y: 100, pointerId: 51 });
        firePointer(panEl, 'pointerdown', { x: 300, y: 100, pointerId: 52 });
        firePointer(window, 'pointermove', { x: 140, y: 100, pointerId: 52 });
        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 51 });
        await flush(fixture);
        await advance(fixture, 1000);
        expect(query('.lg-container.lg-show')).toBeNull();
        firePointer(window, 'pointerup', { x: 140, y: 100, pointerId: 52 });
    });

    it('zoom: disables transitions during a pinch and settles on release', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        await flush(fixture);
        await openAndLoad(fixture);
        await advance(fixture, 350);
        const panEl = query('.lg-item.lg-current .lg-zoom-pan')!;
        const scaleEl = query('.lg-item.lg-current .lg-zoom-scale')!;

        firePointer(panEl, 'pointerdown', { x: 100, y: 100, pointerId: 31 });
        firePointer(panEl, 'pointerdown', { x: 200, y: 100, pointerId: 32 });
        // Live pinch tracks 1:1 — no easing between finger positions.
        expect(panEl.style.transition).toBe('none');
        expect(scaleEl.style.transition).toBe('none');

        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 31 });
        // The release spring drives frames directly — still no easing.
        expect(scaleEl.style.transition).toBe('none');
        // Once settled, the button-zoom transition is restored.
        vi.advanceTimersByTime(2000);
        expect(scaleEl.style.transition).toBe(
            'transform 0.3s cubic-bezier(0, 0, 0.25, 1)',
        );
        firePointer(window, 'pointerup', { x: 200, y: 100, pointerId: 32 });
    });

    it('zoom: projects a zoomed-pan release with 2.x momentum, clamped to bounds', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        await flush(fixture);
        await openAndLoad(fixture);
        // Pointer interactions arm `enableZoomAfter` ms after the load.
        await advance(fixture, 350);

        // jsdom has no layout: stub the metrics the pan bounds derive
        // from. Image fitted at 400x300, natural 1600 → actual-size scale
        // 4; at that scale the pan bounds are ±600 x, ±450 y.
        const img = query('img.lg-image[data-index="0"]')!;
        Object.defineProperty(img, 'offsetWidth', { value: 400 });
        Object.defineProperty(img, 'offsetHeight', { value: 300 });
        Object.defineProperty(img, 'naturalWidth', { value: 1600 });
        const slide = img.closest<HTMLElement>('.lg-item')!;
        Object.defineProperty(slide, 'offsetWidth', { value: 400 });
        Object.defineProperty(slide, 'offsetHeight', { value: 300 });

        (query('.lg-actual-size') as HTMLButtonElement).click();
        await flush(fixture);
        const panEl = query('.lg-item.lg-current .lg-zoom-pan')!;
        expect(
            query('.lg-item.lg-current .lg-zoom-scale')!.style.transform,
        ).toBe('scale3d(4, 4, 1)');

        const panX = (): number =>
            parseFloat(
                panEl.style.transform.match(/translate3d\((-?[\d.]+)px/)![1]!,
            );

        // 100px drag over 100ms (1 px/ms release): the spring glides the
        // pan to current + project(v) = -100 - 199 = -299, inside bounds.
        firePointer(panEl, 'pointerdown', { x: 300, y: 100, pointerId: 61 });
        vi.advanceTimersByTime(100);
        firePointer(window, 'pointermove', { x: 200, y: 100, pointerId: 61 });
        firePointer(window, 'pointerup', { x: 200, y: 100, pointerId: 61 });
        // Spring in flight: transitions stand down.
        expect(panEl.style.transition).toBe('none');
        vi.advanceTimersByTime(2000);
        expect(panX()).toBeCloseTo(-299, 0);
        // Settled: the button-zoom transition is restored.
        expect(panEl.style.transition).toBe(
            'transform 0.3s cubic-bezier(0, 0, 0.25, 1)',
        );

        // A flick (100px in 20ms, 5 px/ms): projection -399 - 995 clamps
        // into the -600 bound; the spring bounces softly against it.
        firePointer(panEl, 'pointerdown', { x: 300, y: 100, pointerId: 62 });
        vi.advanceTimersByTime(20);
        firePointer(window, 'pointermove', { x: 200, y: 100, pointerId: 62 });
        firePointer(window, 'pointerup', { x: 200, y: 100, pointerId: 62 });
        vi.advanceTimersByTime(3000);
        expect(panX()).toBeCloseTo(-600, 0);
    });

    it('video: renders the video slide, swaps poster for the player, pauses on leave', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        const host = fixture.componentInstance;
        await flush(fixture);
        // Open at the video slide directly.
        await openAndLoad(fixture, 2);
        await flush(fixture);

        // Renderer selection: the video item renders lg-video-cont, with a
        // derived YouTube poster (loadYouTubePoster default).
        const cont = query('.lg-item.lg-current .lg-video-cont')!;
        expect(cont.classList.contains('lg-has-youtube')).toBe(true);
        expect(host.hasVideos).toContain(2);
        const posterImg = cont.querySelector<HTMLImageElement>(
            'img.lg-video-poster',
        )!;
        expect(posterImg.getAttribute('src')).toContain(
            'img.youtube.com/vi/abc123xyz90/maxresdefault.jpg',
        );
        expect(cont.querySelector('iframe')).toBeNull();
        // Poster load marks the slide loaded (drives the spinner + galleryOn).
        posterImg.dispatchEvent(new Event('load'));
        await flush(fixture);
        expect(
            query('.lg-item.lg-current')!.classList.contains('lg-complete'),
        ).toBe(true);

        // Poster click -> player swap + posterClick output.
        (
            cont.querySelector('.lg-video-poster-wrap') as HTMLButtonElement
        ).click();
        await flush(fixture);
        expect(host.posterClicks).toBe(1);
        const frame = query(
            '.lg-video-cont iframe.lg-youtube',
        ) as HTMLIFrameElement;
        expect(frame).not.toBeNull();
        expect(frame.getAttribute('src')).toContain(
            'youtube.com/embed/abc123xyz90',
        );

        // Navigating away pauses the player (postMessage command).
        const postMessage = vi.fn();
        Object.defineProperty(frame, 'contentWindow', {
            value: { postMessage },
        });
        fixture.componentInstance.gallery().prevSlide();
        await flush(fixture);
        expect(postMessage).toHaveBeenCalledWith(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*',
        );
    });

    it('leak check: destroy while open releases timers, locks and DOM', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        await flush(fixture);
        await openAndLoad(fixture);
        const runtime = runtimeOf(fixture);
        (query('.lg-actual-size') as HTMLButtonElement).click();
        await flush(fixture);
        expect(runtime.gestureSeam.lockOwner).toBe('zoomSwipe');

        fixture.destroy();
        expect(query('.lg-container')).toBeNull();
        expect(runtime.gestureSeam.lockOwner).toBeNull();
        vi.runOnlyPendingTimers();
        expect(vi.getTimerCount()).toBe(0);
    });

    it('leak check: destroy mid-pinch releases the seam lock', async () => {
        const fixture = TestBed.createComponent(Wave1Host);
        await flush(fixture);
        await openAndLoad(fixture);
        await advance(fixture, 350);
        const runtime = runtimeOf(fixture);
        const panEl = query('.lg-item.lg-current .lg-zoom-pan')!;

        // A forming pinch claims the seam BEFORE anything is zoomed.
        firePointer(panEl, 'pointerdown', { x: 100, y: 100, pointerId: 71 });
        firePointer(panEl, 'pointerdown', { x: 200, y: 100, pointerId: 72 });
        expect(runtime.gestureSeam.lockOwner).toBe('pinch');

        // Fingers never lift: the gallery is destroyed mid-gesture. The
        // lock must not survive into the next open (core swipe would
        // stay stood down).
        fixture.destroy();
        expect(runtime.gestureSeam.lockOwner).toBeNull();
        vi.runOnlyPendingTimers();
    });
});
