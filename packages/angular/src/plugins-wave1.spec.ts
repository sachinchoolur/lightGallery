import { Component, viewChild } from '@angular/core';
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

@Component({
    imports: [LgGalleryComponent],
    template: `
        <lg-gallery
            [slides]="items"
            [zoomFromOrigin]="false"
            [features]="features"
            (posterClick)="posterClicks = posterClicks + 1"
            (hasVideo)="hasVideos.push($event.index)"
        />
    `,
})
class Wave1Host {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = ITEMS;
    readonly features = [withThumbnail(), withZoom(), withVideo()];
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
        expect(
            outer.classList.contains('lg-use-transition-for-zoom'),
        ).toBe(true);
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
        expect(
            thumbs[2]!.querySelector('img')!.getAttribute('src'),
        ).toContain('img.youtube.com/vi/abc123xyz90');

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
        expect(query('.lg-outer')!.classList.contains('lg-zoomed')).toBe(
            true,
        );
        // Core swipe stands down while zoomed.
        expect(runtime.gestureSeam.lockOwner).toBe('zoomSwipe');

        // Toggling back returns to identity and releases the lock.
        (query('.lg-actual-size') as HTMLButtonElement).click();
        await flush(fixture);
        expect(runtime.gestureSeam.lockOwner).toBeNull();
        expect(query('.lg-outer')!.classList.contains('lg-zoomed')).toBe(
            false,
        );

        // Zoom again, then navigate: the wrapper resets (2.x parity).
        (query('.lg-actual-size') as HTMLButtonElement).click();
        await flush(fixture);
        expect(runtime.gestureSeam.lockOwner).toBe('zoomSwipe');
        fixture.componentInstance.gallery().nextSlide();
        await flush(fixture);
        await advance(fixture, 500);
        expect(runtime.gestureSeam.lockOwner).toBeNull();
        expect(query('.lg-outer')!.classList.contains('lg-zoomed')).toBe(
            false,
        );
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
});
