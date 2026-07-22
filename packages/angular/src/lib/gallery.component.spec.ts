import { Component, signal, viewChild } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
        <lg-gallery
            [slides]="items"
            [zoomFromOrigin]="false"
            [loop]="false"
        />
    `,
})
class EndsHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
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

describe('LgGalleryComponent (plan 003 core gallery)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
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
        expect(document.documentElement.classList.contains('lg-on')).toBe(
            true,
        );

        // Entrance timeline: 10ms -> opening, +backdrop -> open/visible.
        await advance(fixture, 10);
        expect(query('.lg-container')!.classList.contains('lg-show-in')).toBe(
            true,
        );
        expect(query('.lg-backdrop')!.classList.contains('in')).toBe(true);
        await advance(fixture, BACKDROP);
        expect(query('.lg-outer')!.classList.contains('lg-visible')).toBe(
            true,
        );
        expect(
            query('.lg-outer')!.classList.contains('lg-components-open'),
        ).toBe(true);

        // Current slide content mounted, spinner state until load completes.
        const current = query('.lg-item.lg-current')!;
        expect(current.classList.contains('lg-loaded')).toBe(true);
        expect(current.classList.contains('lg-complete')).toBe(false);
        expect(
            current.querySelector('img.lg-image')!.getAttribute('src'),
        ).toBe('b.jpg');
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
        expect(query('.lg-container')).toBeNull();
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
        document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape' }),
        );
        await flush(fixture);
        expect(host.opened()).toBe(false);
        await advance(fixture, BACKDROP + 100);
        expect(query('.lg-container')).toBeNull();
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
        expect(document.documentElement.classList.contains('lg-on')).toBe(
            true,
        );
        expect(vi.getTimerCount()).toBeGreaterThan(0);

        fixture.destroy();
        expect(query('.lg-container')).toBeNull();
        expect(query('.lg-outer')).toBeNull();
        expect(document.documentElement.classList.contains('lg-on')).toBe(
            false,
        );
        expect(document.body.classList.contains('lg-overlay-open')).toBe(
            false,
        );
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
