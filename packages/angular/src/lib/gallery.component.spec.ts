import { Component, signal, viewChild, type ElementRef } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { withVideo } from '@lightgallery/angular/plugins/video';

import { LgGalleryComponent } from './gallery.component';
import { LgGalleryItemDirective } from './item.directive';
import { LgCaptionDirective, LgCounterDirective } from './slots';
import type { LgGalleryItem, SlideEventDetail } from './types';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'a', caption: 'Caption A' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'b' },
    { src: 'c.jpg', thumb: 'c-t.jpg', alt: 'c', caption: 'Caption C' },
];

// Default core timings (asserted against the resolved settings defaults):
// backdropDuration 300, speed 400.
const BACKDROP = 300;
const SPEED = 400;

@Component({
    imports: [LgGalleryComponent, LgGalleryItemDirective, LgCaptionDirective],
    template: `
        <lg-gallery
            [zoomFromOrigin]="false"
            (beforeOpen)="log.push('beforeOpen')"
            (afterOpen)="log.push('afterOpen')"
            (slideItemLoad)="log.push('slideItemLoad:' + $event.index)"
            (beforeNextSlide)="log.push('beforeNextSlide:' + $event.index)"
            (beforeSlide)="logSlide('beforeSlide', $event)"
            (afterSlide)="logSlide('afterSlide', $event)"
            (closed)="log.push('closed')"
            (beforeClose)="log.push('beforeClose')"
            (afterClose)="log.push('afterClose')"
        >
            @for (item of items; track item.src) {
            <a href="#" class="trigger" [lgGalleryItem]="item">
                <img [src]="item.thumb" [alt]="item.alt" />
            </a>
            }
            <ng-template lgCaption let-item let-index="index">
                <h4 class="test-caption">{{ item?.alt }} ({{ index }})</h4>
            </ng-template>
        </lg-gallery>
    `,
})
class UncontrolledHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = ITEMS;
    readonly log: string[] = [];

    logSlide(name: string, detail: SlideEventDetail): void {
        this.log.push(`${name}:${detail.prevIndex}>${detail.index}`);
    }
}

@Component({
    imports: [LgGalleryComponent, LgCounterDirective],
    template: `
        <lg-gallery
            [slides]="items"
            [zoomFromOrigin]="false"
            [open]="opened()"
            (closed)="opened.set(false)"
            [(index)]="index"
        >
            <ng-template lgCounter let-current let-total="total">
                <span class="test-counter">{{ current }} of {{ total }}</span>
            </ng-template>
        </lg-gallery>
    `,
})
class ControlledHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = ITEMS;
    readonly opened = signal(false);
    readonly index = signal(1);
}

@Component({
    imports: [LgGalleryComponent],
    template: `
        <lg-gallery [slides]="items" [zoomFromOrigin]="false" [loop]="false" />
    `,
})
class EndsHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = ITEMS;
}

@Component({
    imports: [LgGalleryComponent],
    template: `
        <div #inlineHost class="inline-host"></div>
        <lg-gallery
            [slides]="items"
            [zoomFromOrigin]="false"
            [container]="inlineEl()?.nativeElement ?? null"
            [showMaximizeIcon]="true"
        />
    `,
})
class InlineHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly inlineEl = viewChild<ElementRef<HTMLDivElement>>('inlineHost');
    readonly items = ITEMS;
}

function query(selector: string): HTMLElement | null {
    // CDK attaches the overlay to the document-level overlay container.
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

function loadImage(index: number): void {
    const img = document.querySelector<HTMLImageElement>(
        `img.lg-image[data-index="${index}"]`,
    );
    expect(img).not.toBeNull();
    img!.dispatchEvent(new Event('load'));
}

describe('LgGalleryComponent (core gallery)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it('decode-gates the slide completion (no partial paint)', async () => {
        const fixture = TestBed.createComponent(UncontrolledHost);
        await flush(fixture);
        queryAll('.trigger')[0]!.click();
        await flush(fixture);
        await advance(fixture, BACKDROP + 20);
        const img = document.querySelector<HTMLImageElement>(
            'img.lg-image[data-index="0"]',
        )!;
        // jsdom has no decode() — the gate is synchronous there; a
        // controlled decode makes the ordering observable.
        let settleDecode!: () => void;
        Object.defineProperty(img, 'decode', {
            value: () =>
                new Promise<void>((resolve) => {
                    settleDecode = resolve;
                }),
        });
        img.dispatchEvent(new Event('load'));
        await flush(fixture);
        // Loaded but not decoded: the slide must NOT complete — a
        // completion here is exactly the partial paint the gate blocks.
        expect(query('.lg-item.lg-current.lg-complete')).toBeNull();
        settleDecode();
        // Drain the decode promise chain (two hops: decode().then →
        // awaitDecode resolve → completion) — zoneless whenStable does
        // not track bare microtasks.
        await Promise.resolve();
        await Promise.resolve();
        await flush(fixture);
        expect(query('.lg-item.lg-current.lg-complete')).not.toBeNull();
    });

    it('runs the uncontrolled lifecycle: open from item, navigate, close', async () => {
        const fixture = TestBed.createComponent(UncontrolledHost);
        const host = fixture.componentInstance;
        await flush(fixture);
        expect(query('.lg-container')).toBeNull();

        // Open from the second trigger.
        queryAll('.trigger')[1]!.click();
        await flush(fixture);

        const container = query('.lg-container');
        expect(container).not.toBeNull();
        expect(container!.getAttribute('role')).toBe('dialog');
        expect(container!.classList.contains('lg-show')).toBe(true);
        // Backdrop still transparent in pre-open.
        expect(container!.classList.contains('lg-show-in')).toBe(false);
        const outer = query('.lg-outer')!;
        expect(outer.classList.contains('lg-slide')).toBe(true);
        // No zoom transform available -> startClass entrance.
        expect(outer.classList.contains('lg-start-zoom')).toBe(true);
        expect(document.documentElement.classList.contains('lg-on')).toBe(true);

        // Entrance timeline: 10ms -> opening, +backdrop -> open/visible.
        await advance(fixture, 10);
        expect(query('.lg-container')!.classList.contains('lg-show-in')).toBe(
            true,
        );
        expect(query('.lg-backdrop')!.classList.contains('in')).toBe(true);
        await advance(fixture, BACKDROP);
        expect(query('.lg-outer')!.classList.contains('lg-visible')).toBe(true);
        expect(
            query('.lg-outer')!.classList.contains('lg-components-open'),
        ).toBe(true);

        // Current slide content mounted, spinner state until load completes.
        const current = query('.lg-item.lg-current')!;
        expect(current.classList.contains('lg-loaded')).toBe(true);
        expect(current.classList.contains('lg-complete')).toBe(false);
        expect(current.querySelector('img.lg-image')!.getAttribute('src')).toBe(
            'b.jpg',
        );
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');
        expect(query('.lg-sub-html .test-caption')!.textContent).toContain(
            'b (1)',
        );

        // Only the current slide loads before the current media completes.
        expect(queryAll('img.lg-image').length).toBe(1);
        loadImage(1);
        await flush(fixture);
        expect(
            query('.lg-item.lg-current')!.classList.contains('lg-complete'),
        ).toBe(true);
        // Preload window mounts the neighbors once the current slide loads.
        expect(queryAll('img.lg-image').length).toBe(3);

        // Navigate: galleryOn -> animated transition.
        host.gallery().nextSlide();
        await flush(fixture);
        // Outgoing slide keeps lg-current during the no-trans positioning.
        expect(query('.lg-outer')!.classList.contains('lg-no-trans')).toBe(
            true,
        );
        await advance(fixture, 50);
        expect(query('.lg-outer')!.classList.contains('lg-no-trans')).toBe(
            false,
        );
        expect(
            query('.lg-item.lg-current img.lg-image')!.getAttribute('src'),
        ).toBe('c.jpg');
        // Navigation is gated while the transition runs.
        host.gallery().nextSlide();
        await flush(fixture);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('3');
        await advance(fixture, SPEED + 100);
        expect(query('.lg-sub-html .test-caption')!.textContent).toContain(
            'c (2)',
        );

        // Close via the toolbar button; overlay stays until the animation
        // finishes, then detaches.
        (query('.lg-close') as HTMLButtonElement).click();
        await flush(fixture);
        expect(query('.lg-container')).not.toBeNull();
        expect(query('.lg-outer')!.classList.contains('lg-hide-items')).toBe(
            true,
        );
        await advance(fixture, BACKDROP + 100);
        // v2 parity: the container persists after close, hidden by
        // dropping lg-show (CSS display:none).
        expect(query('.lg-container.lg-show')).toBeNull();
        expect(query('.lg-container')).not.toBeNull();
        expect(document.documentElement.classList.contains('lg-on')).toBe(
            false,
        );

        expect(host.log).toEqual([
            'beforeOpen',
            'afterOpen',
            'slideItemLoad:1',
            'beforeNextSlide:2',
            'beforeSlide:1>2',
            'afterSlide:1>2',
            'closed',
            'beforeClose',
            'afterClose',
        ]);
    });

    it('supports the controlled round-trip with [open]/(closed)/[(index)]', async () => {
        const fixture = TestBed.createComponent(ControlledHost);
        const host = fixture.componentInstance;
        await flush(fixture);
        expect(query('.lg-container')).toBeNull();

        // Imperative open is a no-op in controlled mode.
        host.gallery().openGallery(0);
        await flush(fixture);
        expect(query('.lg-container')).toBeNull();

        host.opened.set(true);
        await flush(fixture);
        expect(query('.lg-container')).not.toBeNull();
        // Opens at the bound index, rendered via the counter slot template.
        expect(query('.test-counter')!.textContent).toBe('2 of 3');

        // External index writes navigate (no animation before galleryOn).
        host.index.set(2);
        await flush(fixture);
        expect(query('.test-counter')!.textContent).toBe('3 of 3');

        // Internal navigation writes the model back (loop wraps to 0).
        host.gallery().nextSlide();
        await flush(fixture);
        expect(host.index()).toBe(0);
        expect(query('.test-counter')!.textContent).toBe('1 of 3');

        // ESC requests close -> (closed) -> host flips [open] -> closes.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await flush(fixture);
        expect(host.opened()).toBe(false);
        await advance(fixture, BACKDROP + 100);
        expect(query('.lg-container.lg-show')).toBeNull();
        expect(query('.lg-container')).not.toBeNull();
    });

    it('shows the error state when media fails to load', async () => {
        const fixture = TestBed.createComponent(UncontrolledHost);
        await flush(fixture);
        queryAll('.trigger')[0]!.click();
        await flush(fixture);

        const img = document.querySelector<HTMLImageElement>(
            'img.lg-image[data-index="0"]',
        )!;
        img.dispatchEvent(new Event('error'));
        await flush(fixture);

        const current = query('.lg-item.lg-current')!;
        expect(current.classList.contains('lg-complete')).toBe(true);
        expect(current.querySelector('.lg-error-msg')!.textContent).toContain(
            'Failed to load content',
        );
    });

    it('cleans up on destroy while open: overlay, body state, timers', async () => {
        const fixture = TestBed.createComponent(UncontrolledHost);
        await flush(fixture);
        queryAll('.trigger')[0]!.click();
        await flush(fixture);
        expect(query('.lg-container')).not.toBeNull();
        expect(document.documentElement.classList.contains('lg-on')).toBe(true);
        expect(vi.getTimerCount()).toBeGreaterThan(0);

        fixture.destroy();
        expect(query('.lg-container')).toBeNull();
        expect(query('.lg-outer')).toBeNull();
        expect(document.documentElement.classList.contains('lg-on')).toBe(
            false,
        );
        expect(document.body.classList.contains('lg-overlay-open')).toBe(false);
        // Every gallery-owned animation/idle timer is cleared with the
        // instance; what remains are Angular's own one-shot scheduler ticks.
        // Flush them: nothing may fire afterwards and nothing may resurrect.
        vi.runOnlyPendingTimers();
        expect(vi.getTimerCount()).toBe(0);
        expect(query('.lg-container')).toBeNull();
        expect(document.documentElement.classList.contains('lg-on')).toBe(
            false,
        );
    });

    it('renders inline into a [container] element (2.x container parity)', async () => {
        const fixture = TestBed.createComponent(InlineHost);
        const host = fixture.componentInstance;
        await flush(fixture);
        host.gallery().openGallery(0);
        await flush(fixture);

        // The gallery mounts inside the given element, not a CDK overlay.
        const container = fixture.nativeElement.querySelector(
            '.inline-host .lg-container',
        ) as HTMLElement;
        expect(container).not.toBeNull();
        expect(container.classList.contains('lg-inline')).toBe(true);
        expect(query('.cdk-overlay-container .lg-container')).toBeNull();
        // No body scroll-lock/classes in inline mode.
        expect(document.documentElement.classList.contains('lg-on')).toBe(
            false,
        );

        // Maximize toggles lg-inline off (fills the viewport) and back.
        (container.querySelector('.lg-maximize') as HTMLButtonElement).click();
        await flush(fixture);
        expect(container.classList.contains('lg-inline')).toBe(false);
        (container.querySelector('.lg-maximize') as HTMLButtonElement).click();
        await flush(fixture);
        expect(container.classList.contains('lg-inline')).toBe(true);

        fixture.destroy();
        expect(document.querySelector('.inline-host .lg-container')).toBeNull();
    });

    it('honors ends without loop: bounce class and no wrap', async () => {
        const fixture = TestBed.createComponent(EndsHost);
        const host = fixture.componentInstance;
        await flush(fixture);
        host.gallery().openGallery(2);
        await flush(fixture);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('3');

        // At the last slide without loop: no wrap, slide-end bounce class.
        host.gallery().nextSlide();
        await flush(fixture);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('3');
        expect(query('.lg-outer')!.classList.contains('lg-right-end')).toBe(
            true,
        );
        await advance(fixture, 400);
        expect(query('.lg-outer')!.classList.contains('lg-right-end')).toBe(
            false,
        );
    });
});

describe('persistent container (v2 close contract)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it('keeps the shell, empties the items, and remounts on reopen', async () => {
        const fixture = TestBed.createComponent(UncontrolledHost);
        const host = fixture.componentInstance;
        await flush(fixture);
        queryAll('.trigger')[0]!.click();
        await flush(fixture);
        await advance(fixture, BACKDROP + 150);
        expect(query('.lg-item.lg-current')).not.toBeNull();

        host.gallery().closeGallery();
        await flush(fixture);
        // Mid-close the items — AND their content — must survive for the
        // exit animation: the close flight on an empty item is invisible.
        expect(query('.lg-item, lg-slide')).not.toBeNull();
        expect(query('.lg-item img.lg-image')).not.toBeNull();
        await advance(fixture, BACKDROP + 100);
        // 2.x $inner.empty(): the persistent shell keeps .lg-inner, but
        // the stale items — and their lg-current — unmount with the
        // close.
        expect(query('.lg-container')).not.toBeNull();
        expect(query('.lg-container.lg-show')).toBeNull();
        expect(query('.lg-inner')).not.toBeNull();
        expect(query('.lg-item, lg-slide')).toBeNull();

        // Reopen at a DIFFERENT index: fresh items, correct current.
        queryAll('.trigger')[2]!.click();
        await flush(fixture);
        await advance(fixture, BACKDROP + 150);
        expect(query('.lg-container.lg-show')).not.toBeNull();
        const current = query('.lg-item.lg-current');
        expect(current).not.toBeNull();
        expect(
            current!.querySelector('img.lg-image')!.getAttribute('src'),
        ).toBe('c.jpg');
    });
});

@Component({
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <lg-gallery>
            @for (item of items; track item.src) {
            <a href="#" class="trigger" [lgGalleryItem]="item">
                <img [src]="item.thumb" [alt]="item.alt" />
            </a>
            }
        </lg-gallery>
    `,
})
class DummyFlightHost {
    readonly items = ITEMS.map((item) => ({
        ...item,
        lgSize: '1600-1067',
    }));
}

@Component({
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <lg-gallery [features]="features">
            @for (item of items; track item.src) {
            <a href="#" class="trigger" [lgGalleryItem]="item">
                <img [src]="item.thumb" [alt]="item.alt" />
            </a>
            }
        </lg-gallery>
    `,
})
class VideoDummyFlightHost {
    readonly features = [withVideo()];
    readonly items: LgGalleryItem[] = [
        {
            src: 'https://vimeo.com/112836958',
            poster: 'poster.jpg',
            thumb: 'v-t.jpg',
            alt: 'vimeo',
            lgSize: '1280-720',
        },
    ];
}

describe('zoom-from-origin dummy image', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it('flies the thumb as lg-dummy-img and drops it after the load settles', async () => {
        // jsdom rects are 0×0; a real-looking rect makes computeOrigin
        // produce a flight (lgSize is the other precondition).
        const rectSpy = vi
            .spyOn(Element.prototype, 'getBoundingClientRect')
            .mockReturnValue({
                left: 10,
                top: 10,
                width: 100,
                height: 80,
                right: 110,
                bottom: 90,
                x: 10,
                y: 10,
                toJSON: () => ({}),
            } as DOMRect);
        const fixture = TestBed.createComponent(DummyFlightHost);
        await flush(fixture);
        queryAll('.trigger')[0]!.click();
        await flush(fixture);
        await advance(fixture, 20);

        // 2.x first-slide contract: ONLY the thumb-dummy exists during
        // the flight — the real image must not fetch/decode mid-flight.
        const dummy = query('img.lg-dummy-img');
        expect(dummy).not.toBeNull();
        expect(dummy!.getAttribute('src')).toBe('a-t.jpg');
        expect(query('.lg-item.lg-current img.lg-image')).toBeNull();
        expect(query('.lg-item.lg-first-slide')).not.toBeNull();
        expect(query('.lg-outer.lg-first-slide-loading')).not.toBeNull();

        // Flight lands: the real image mounts, the dummy stays on top.
        await advance(fixture, SPEED + 120);
        const real = query('.lg-item.lg-current img.lg-image');
        expect(real).not.toBeNull();
        expect(query('img.lg-dummy-img')).not.toBeNull();

        // Real image load settles, then the 300ms drop buffer removes
        // the dummy and the loading classes.
        real!.dispatchEvent(new Event('load'));
        await flush(fixture);
        await advance(fixture, 310);
        expect(query('img.lg-dummy-img')).toBeNull();
        expect(query('.lg-item.lg-first-slide')).toBeNull();
        expect(query('.lg-outer.lg-first-slide-loading')).toBeNull();
        expect(query('.lg-item.lg-current.lg-complete')).not.toBeNull();
        rectSpy.mockRestore();
    });

    it('flies the thumb over a video poster and drops it after the load', async () => {
        // Same flight preconditions as the image dummy: a real-looking
        // trigger rect and lgSize; the video feature supplies the
        // poster-first slide (2.x `getVideoPosterMarkup` + dummy).
        const rectSpy = vi
            .spyOn(Element.prototype, 'getBoundingClientRect')
            .mockReturnValue({
                left: 10,
                top: 10,
                width: 100,
                height: 80,
                right: 110,
                bottom: 90,
                x: 10,
                y: 10,
                toJSON: () => ({}),
            } as DOMRect);
        const fixture = TestBed.createComponent(VideoDummyFlightHost);
        await flush(fixture);
        queryAll('.trigger')[0]!.click();
        await flush(fixture);
        await advance(fixture, 20);

        // During the flight ONLY the thumb-dummy exists — the poster
        // must not mount (and fetch) mid-flight.
        const dummy = query('img.lg-dummy-img');
        expect(dummy).not.toBeNull();
        expect(dummy!.getAttribute('src')).toBe('v-t.jpg');
        expect(query('img.lg-video-poster')).toBeNull();
        expect(query('.lg-outer.lg-first-slide-loading')).not.toBeNull();

        // Flight lands: the poster mounts beneath the dummy.
        await advance(fixture, SPEED + 120);
        const posterEl = query('img.lg-video-poster');
        expect(posterEl).not.toBeNull();
        expect(query('img.lg-dummy-img')).not.toBeNull();

        // Poster load settles the slide; the 300ms buffer drops the
        // dummy and the loading classes.
        posterEl!.dispatchEvent(new Event('load'));
        await flush(fixture);
        await advance(fixture, 310);
        expect(query('img.lg-dummy-img')).toBeNull();
        expect(query('.lg-outer.lg-first-slide-loading')).toBeNull();
        expect(query('.lg-item.lg-current.lg-complete')).not.toBeNull();
        rectSpy.mockRestore();
    });
});
