import { Component, signal, viewChild } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    LgGalleryComponent,
    type LgFeature,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';

/**
 * Plan 010: a 1,000-item gallery keeps its DOM bounded — the slide pool
 * caps mounted `.lg-item`s and the thumbnail strip renders only a window
 * (spacers preserve the strip geometry). jsdom reports a 0-width strip,
 * so the thumb window is overscan-driven and fully deterministic.
 */

const ITEMS: LgGalleryItem[] = Array.from({ length: 1000 }, (_, i) => ({
    src: `img-${i}.jpg`,
    thumb: `thumb-${i}.jpg`,
    alt: `Slide ${i}`,
}));

function query(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}

async function flush<T>(fixture: ComponentFixture<T>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
}

@Component({
    imports: [LgGalleryComponent],
    template: `
        <lg-gallery
            [slides]="items()"
            [zoomFromOrigin]="false"
            [features]="features"
            [virtualization]="virtualization()"
        />
    `,
})
class VirtualizationHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = signal<LgGalleryItem[]>(ITEMS);
    readonly virtualization = signal<
        { slides?: number; thumbs?: 'auto' | number } | undefined
    >(undefined);
    features: LgFeature<object>[] = [withThumbnail()];
}

async function openGallery(
    fixture: ComponentFixture<VirtualizationHost>,
    index = 0,
): Promise<void> {
    await flush(fixture);
    fixture.componentInstance.gallery().openGallery(index);
    await flush(fixture);
    vi.advanceTimersByTime(450);
    await flush(fixture);
}

describe('virtualization (plan 010)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('bounds slides and thumbnails for a 1,000-item gallery', async () => {
        const fixture = TestBed.createComponent(VirtualizationHost);
        fixture.componentInstance.virtualization.set({
            slides: 7,
            thumbs: 2,
        });
        await openGallery(fixture);

        // Slide pool: window of 7 around index 0 + the loop far-end slide.
        expect(document.querySelectorAll('.lg-item').length).toBe(8);

        // Thumb window: 0-width jsdom strip → overscan-driven window (the
        // middle-pager translate of 49px keeps thumbs 0-2 mounted).
        expect(document.querySelectorAll('.lg-thumb-item').length).toBe(3);
        const spacers =
            document.querySelectorAll<HTMLElement>('.lg-thumb-spacer');
        expect(spacers.length).toBe(1);
        expect(spacers[0]!.style.width).toBe(`${(1000 - 3) * 105}px`);
        expect(query('.lg-thumb')!.style.width).toBe(`${1000 * 105}px`);
        fixture.destroy();
    });

    it('renders every thumbnail when virtualization is off (default)', async () => {
        const fixture = TestBed.createComponent(VirtualizationHost);
        fixture.componentInstance.items.set(ITEMS.slice(0, 100));
        await openGallery(fixture);

        expect(document.querySelectorAll('.lg-thumb-item').length).toBe(100);
        expect(query('.lg-thumb-spacer')).toBeNull();
        expect(
            document.querySelectorAll('.lg-item').length,
        ).toBeLessThanOrEqual(11);
        fixture.destroy();
    });

    it('advances the thumb window when opening mid-gallery', async () => {
        const fixture = TestBed.createComponent(VirtualizationHost);
        fixture.componentInstance.virtualization.set({
            slides: 7,
            thumbs: 2,
        });
        await openGallery(fixture, 500);

        const ids = [
            ...document.querySelectorAll<HTMLElement>('.lg-thumb-item'),
        ].map((el) => Number(el.getAttribute('data-lg-item-id')));
        expect(Math.min(...ids)).toBeGreaterThan(400);
        expect(Math.max(...ids)).toBeLessThan(600);
        expect(document.querySelectorAll('.lg-thumb-spacer').length).toBe(2);
        fixture.destroy();
    });
});
