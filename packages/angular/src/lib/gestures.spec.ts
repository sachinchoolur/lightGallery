import {
    Component,
    signal,
    viewChild,
    type DoCheck,
} from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import type { GalleryMode } from '@lightgallery/headless';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LgGalleryComponent } from './gallery.component';
import { LgGalleryRuntime } from './runtime';
import type { LgGalleryItem, SlideEventDetail } from './types';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', alt: 'a' },
    { src: 'b.jpg', alt: 'b' },
    { src: 'c.jpg', alt: 'c' },
    { src: 'd.jpg', alt: 'd' },
    { src: 'e.jpg', alt: 'e' },
];

const SPEED = 400;

/**
 * Change-detection probe: `ngDoCheck` runs on
 * every application tick that reaches this non-OnPush component, so a
 * pointermove storm must leave the counter untouched.
 */
@Component({
    selector: 'cd-probe',
    template: '',
})
class CdProbe implements DoCheck {
    static checks = 0;

    ngDoCheck(): void {
        CdProbe.checks++;
    }
}

@Component({
    imports: [LgGalleryComponent, CdProbe],
    template: `
        <cd-probe />
        <lg-gallery
            [slides]="items"
            [zoomFromOrigin]="false"
            [mode]="mode()"
            [mousewheel]="true"
            (afterSlide)="afterSlides.push($event)"
        />
    `,
})
class GestureHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = ITEMS;
    readonly mode = signal<GalleryMode>('lg-slide');
    readonly afterSlides: SlideEventDetail[] = [];
}

function query(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}

async function flush(fixture: ComponentFixture<GestureHost>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
}

async function advance(
    fixture: ComponentFixture<GestureHost>,
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
    type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
    init: {
        x?: number;
        y?: number;
        pointerId?: number;
        pointerType?: string;
    },
): void {
    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: init.x ?? 0,
        clientY: init.y ?? 0,
    });
    Object.defineProperty(event, 'pointerId', { value: init.pointerId ?? 1 });
    Object.defineProperty(event, 'pointerType', {
        value: init.pointerType ?? 'touch',
    });
    target.dispatchEvent(event);
}

async function openAndLoad(
    fixture: ComponentFixture<GestureHost>,
): Promise<void> {
    fixture.componentInstance.gallery().openGallery(0);
    await flush(fixture);
    await advance(fixture, 450);
    const img = document.querySelector<HTMLImageElement>(
        'img.lg-image[data-index="0"]',
    )!;
    img.dispatchEvent(new Event('load'));
    await flush(fixture);
}

function currentSlide(): HTMLElement {
    return query('.lg-item.lg-current')!;
}

describe('LgGesturesDirective', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        CdProbe.checks = 0;
    });
    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('follows the finger with direct DOM writes — zero CD per move — and commits past the threshold', async () => {
        const fixture = TestBed.createComponent(GestureHost);
        const host = fixture.componentInstance;
        await openAndLoad(fixture);

        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        await flush(fixture);
        // Drag start assigned neighbor position classes (the one render).
        expect(query('.lg-item.lg-next-slide')).not.toBeNull();

        const checksBefore = CdProbe.checks;
        firePointer(window, 'pointermove', { x: 180, y: 100 });
        expect(item.style.transform).toBe('translate3d(-20px, 0px, 0px)');
        expect(query('.lg-outer')!.classList.contains('lg-dragging')).toBe(
            true,
        );
        // Pointermove storm: transforms are written directly to the DOM;
        // no signal writes, no change detection.
        for (let x = 179; x >= 120; x--) {
            firePointer(window, 'pointermove', { x, y: 100 });
        }
        expect(item.style.transform).toBe('translate3d(-80px, 0px, 0px)');
        await fixture.whenStable();
        expect(CdProbe.checks).toBe(checksBefore);

        firePointer(window, 'pointerup', { x: 120, y: 100 });
        await flush(fixture);
        // Inline transforms and drag classes are handed back to Angular.
        expect(item.style.transform).toBe('');
        expect(query('.lg-outer')!.classList.contains('lg-dragging')).toBe(
            false,
        );
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');

        await advance(fixture, SPEED + 100);
        expect(host.afterSlides).toEqual([
            { index: 1, prevIndex: 0, fromTouch: true, fromThumb: false },
        ]);
    });

    it('snaps back below the swipe threshold', async () => {
        const fixture = TestBed.createComponent(GestureHost);
        await openAndLoad(fixture);

        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        await flush(fixture);
        firePointer(window, 'pointermove', { x: 182, y: 100 });
        expect(item.style.transform).toBe('translate3d(-18px, 0px, 0px)');
        firePointer(window, 'pointerup', { x: 182, y: 100 });
        await flush(fixture);

        expect(item.style.transform).toBe('');
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('1');
    });

    it('stands down when a second pointer arrives (pinch seam) or the lock is claimed', async () => {
        const fixture = TestBed.createComponent(GestureHost);
        await openAndLoad(fixture);
        const runtime = fixture.debugElement
            .query((el) => el.name === 'lg-gallery')!
            .injector.get(LgGalleryRuntime);

        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100, pointerId: 1 });
        firePointer(item, 'pointerdown', { x: 300, y: 100, pointerId: 2 });
        expect(runtime.gestureSeam.pointers.length).toBe(2);
        firePointer(window, 'pointermove', { x: 100, y: 100, pointerId: 1 });
        expect(item.style.transform).toBe('');
        // Same order the browser reports a released pinch: the second finger
        // first, then the session pointer (which detaches the listeners —
        // React-parity behavior; zoom tracks its own pointers when locked).
        firePointer(window, 'pointerup', { x: 300, y: 100, pointerId: 2 });
        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 1 });
        await flush(fixture);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('1');
        expect(runtime.gestureSeam.pointers.length).toBe(0);

        // A claimed lock (zoom pinch) blocks new sessions.
        runtime.gestureSeam.claim('pinch');
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        firePointer(window, 'pointermove', { x: 100, y: 100 });
        expect(item.style.transform).toBe('');
        runtime.gestureSeam.claim(null);
    });

    it('fades the backdrop on vertical drag and closes past the threshold', async () => {
        const fixture = TestBed.createComponent(GestureHost);
        await openAndLoad(fixture);

        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        await flush(fixture);
        firePointer(window, 'pointermove', { x: 200, y: 120 });
        firePointer(window, 'pointermove', { x: 200, y: 220 });
        const backdrop = query('.lg-backdrop')!;
        expect(backdrop.style.opacity).not.toBe('');
        expect(Number(backdrop.style.opacity)).toBeLessThan(1);
        expect(item.style.transform).toContain('scale3d');
        expect(query('.lg-outer')!.classList.contains('lg-hide-items')).toBe(
            true,
        );

        firePointer(window, 'pointerup', { x: 200, y: 220 });
        await flush(fixture);
        expect(backdrop.style.opacity).toBe('');
        await advance(fixture, 450);
        expect(query('.lg-container')).toBeNull();
    });

    it('restores a sub-threshold vertical drag without closing', async () => {
        const fixture = TestBed.createComponent(GestureHost);
        await openAndLoad(fixture);

        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        await flush(fixture);
        firePointer(window, 'pointermove', { x: 200, y: 120 });
        firePointer(window, 'pointermove', { x: 200, y: 160 });
        firePointer(window, 'pointerup', { x: 200, y: 160 });
        await flush(fixture);

        expect(query('.lg-container')).not.toBeNull();
        expect(query('.lg-backdrop')!.style.opacity).toBe('');
        expect(item.style.transform).toBe('');
    });

    it('adds lg-slide for the release animation in non-slide modes', async () => {
        const fixture = TestBed.createComponent(GestureHost);
        fixture.componentInstance.mode.set('lg-fade');
        await openAndLoad(fixture);

        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        await flush(fixture);
        firePointer(window, 'pointermove', { x: 100, y: 100 });
        firePointer(window, 'pointerup', { x: 100, y: 100 });
        await flush(fixture);

        const outer = query('.lg-outer')!;
        expect(outer.classList.contains('lg-fade')).toBe(true);
        expect(outer.classList.contains('lg-slide')).toBe(true);
        await advance(fixture, SPEED + 100);
        expect(outer.classList.contains('lg-slide')).toBe(false);
    });

    it('navigates on mousewheel, throttled to one slide per second', async () => {
        const fixture = TestBed.createComponent(GestureHost);
        await openAndLoad(fixture);
        const outer = query('.lg-outer')!;

        outer.dispatchEvent(
            new WheelEvent('wheel', { deltaY: 100, cancelable: true }),
        );
        await flush(fixture);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');

        // Within the 1000ms throttle window: ignored.
        outer.dispatchEvent(
            new WheelEvent('wheel', { deltaY: 100, cancelable: true }),
        );
        await flush(fixture);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');

        await advance(fixture, 1100);
        outer.dispatchEvent(
            new WheelEvent('wheel', { deltaY: -100, cancelable: true }),
        );
        await flush(fixture);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('1');
    });

    it('navigates with arrow keys when keyPress is on', async () => {
        const fixture = TestBed.createComponent(GestureHost);
        await openAndLoad(fixture);

        document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowRight' }),
        );
        await flush(fixture);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');

        await advance(fixture, SPEED + 100);
        document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
        );
        await flush(fixture);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('1');
    });

    it('destroy mid-drag removes the window listeners', async () => {
        const fixture = TestBed.createComponent(GestureHost);
        await openAndLoad(fixture);

        const item = currentSlide();
        firePointer(item, 'pointerdown', { x: 200, y: 100 });
        await flush(fixture);
        firePointer(window, 'pointermove', { x: 150, y: 100 });
        expect(item.style.transform).not.toBe('');

        const removeSpy = vi.spyOn(window, 'removeEventListener');
        fixture.destroy();
        const removed = removeSpy.mock.calls.map((call) => call[0]);
        expect(removed).toContain('pointermove');
        expect(removed).toContain('pointerup');
        expect(removed).toContain('pointercancel');
        removeSpy.mockRestore();
        // A stray move after destroy must be a no-op, not an error.
        firePointer(window, 'pointermove', { x: 100, y: 100 });
        expect(query('.lg-container')).toBeNull();
    });
});
