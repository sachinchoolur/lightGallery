import { Component, signal, viewChild } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgFeature,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withOriginCrop } from '@lightgallery/angular/plugins/originCrop';

// A square grid tile cropped with `object-fit: cover` shows a window of
// the image. The built-in flight squashes the whole slide into the tile;
// with the feature the window lands on the tile at a uniform scale while
// two boxes around the slides crop the rest, opening with the flight.
const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', alt: 'a', thumb: 'a-thumb.jpg', lgSize: '1500-1000' },
    { src: 'b.jpg', alt: 'b', thumb: 'b-thumb.jpg', lgSize: '1500-1000' },
];

const rect = (left: number, top: number, width: number, height: number) =>
    ({
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
        x: left,
        y: top,
        toJSON: () => ({}),
    } as DOMRect);
const scales = (value: string) => {
    const match = /scale3d\(([^,]+), ([^,]+), 1\)/.exec(value);
    return match ? [parseFloat(match[1]!), parseFloat(match[2]!)] : [];
};
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
const boxes = () => queryAll('.lg-origin-crop');
const currentItem = () => query('.lg-item.lg-current')!;
// Stage 1000×800 at the origin, tile 100×100 at (100, 200): the outer
// box's bottom-right corner meets the tile's, the inner box's top-left
// corner meets the tile's.
const OUTER_START = 'translate3d(-800px, -500px, 0)';
const INNER_START = 'translate3d(900px, 700px, 0)';
const REST = 'translate3d(0, 0, 0)';

@Component({
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <lg-gallery [features]="features()">
            @for (item of items; track item.src; let i = $index) {
            <a href="#" class="trigger" [lgGalleryItem]="item">
                <img
                    [class]="tileClasses[i]"
                    [src]="item.thumb"
                    [alt]="item.alt + ' thumbnail'"
                />
            </a>
            }
        </lg-gallery>
    `,
})
class CropHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = ITEMS;
    readonly features = signal<readonly LgFeature[]>([withOriginCrop()]);
    // The first tile crops its thumbnail; the second stretches it.
    readonly tileClasses = ['tile cover', 'tile'];
}

async function mount(
    features: readonly LgFeature[] = [withOriginCrop()],
): Promise<ComponentFixture<CropHost>> {
    const fixture = TestBed.createComponent(CropHost);
    fixture.componentInstance.features.set(features);
    await flush(fixture);
    return fixture;
}

let spies: Array<{ mockRestore(): void }>;

beforeEach(() => {
    vi.useFakeTimers();
    spies = [
        vi
            .spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get')
            .mockReturnValue(240),
        vi
            .spyOn(HTMLImageElement.prototype, 'naturalHeight', 'get')
            .mockReturnValue(160),
        // Tiles are 100×100 squares; the stage is 1000×800 at the viewport
        // origin.
        vi
            .spyOn(Element.prototype, 'getBoundingClientRect')
            .mockImplementation(function (this: Element) {
                return this.classList.contains('tile')
                    ? rect(100, 200, 100, 100)
                    : rect(0, 0, 1000, 800);
            }),
    ];
    document.head.innerHTML = `<style>
        .cover { object-fit: cover; }
    </style>`;
});

afterEach(() => {
    vi.runOnlyPendingTimers();
    spies.forEach((spy) => spy.mockRestore());
    document.head.innerHTML = '';
    vi.useRealTimers();
});

describe('originCrop feature', () => {
    it('wraps the slides alone in two stage boxes', async () => {
        const fixture = await mount();
        queryAll('.trigger')[0]!.click();
        await flush(fixture);
        const [outer, inner] = boxes();
        expect(boxes()).toHaveLength(2);
        expect(outer!.closest('.lg-content')).not.toBeNull();
        expect(inner!.parentElement).toBe(outer);
        // The tail of the wrapper chain (an inert host element) sits between
        // the inner box and the slide list.
        expect(query('.lg-inner')!.closest('.lg-origin-crop')).toBe(inner);
        // The arrows stay in the stage, outside the crop.
        expect(query('.lg-prev')!.closest('.lg-origin-crop')).toBeNull();
        expect(
            query('.lg-prev')!.parentElement!.classList.contains('lg-content'),
        ).toBe(true);
    });

    it('flies the crop window at a uniform scale and reveals the rest', async () => {
        const fixture = await mount();
        queryAll('.trigger')[0]!.click();
        await flush(fixture);
        // Parked on the tile: the slide's window at a uniform scale, the
        // boxes cropping the stage to the tile, no transition yet.
        const item = currentItem();
        const [scaleX, scaleY] = scales(item.style.transform);
        expect(scaleX).toBeCloseTo(0.15, 5);
        expect(scaleY).toBeCloseTo(0.15, 5);
        expect(item.style.transform).toMatch(
            /^translate3d\(-450px, -350px, 0\)/,
        );
        const [outer, inner] = boxes();
        expect(outer!.style.transform).toBe(OUTER_START);
        expect(inner!.style.transform).toBe(INNER_START);
        expect(outer!.style.overflow).toBe('hidden');
        expect(outer!.style.transitionProperty).toBe('none');

        // Armed: transitions in place, still on the tile.
        await advance(fixture, 20);
        expect(outer!.style.transform).toBe(OUTER_START);
        expect(outer!.style.transitionProperty).toBe('transform');
        expect(outer!.style.transitionDuration).toBe('400ms');

        // Running: the boxes open with the slide.
        await advance(fixture, 100);
        expect(item.style.transform).toBe(REST);
        expect(outer!.style.transform).toBe(REST);
        expect(inner!.style.transform).toBe(REST);

        // Landed: the boxes are inert again.
        await advance(fixture, 500);
        expect(item.style.transform).toBe('');
        expect(outer!.style.transform).toBe('');
        expect(outer!.style.overflow).toBe('');
        expect(outer!.style.transitionProperty).toBe('');
    });

    it('keeps the built-in flight for an uncropped thumbnail', async () => {
        // The default object-fit stretches the file into the square tile,
        // so the flight has to stretch too: no crop, non-uniform scale.
        const fixture = await mount();
        queryAll('.trigger')[1]!.click();
        await flush(fixture);
        const [scaleX, scaleY] = scales(currentItem().style.transform);
        expect(scaleX).toBeCloseTo(0.1, 5);
        expect(scaleY).toBeCloseTo(0.15, 5);
        expect(currentItem().style.transform).toMatch(
            /^translate3d\(-350px, -150px, 0\)/,
        );
        expect(boxes()[0]!.style.transform).toBe('');
    });

    it('is the built-in flight without the feature, and when disabled', async () => {
        let fixture = await mount([]);
        queryAll('.trigger')[0]!.click();
        await flush(fixture);
        expect(boxes()).toHaveLength(0);
        // No wrapper chain either: the slide list sits in the stage as
        // it always has.
        expect(query('lg-stage-wrappers')).toBeNull();
        expect(
            query('.lg-inner')!.parentElement!.classList.contains('lg-content'),
        ).toBe(true);
        let [scaleX, scaleY] = scales(currentItem().style.transform);
        expect(scaleX).toBeCloseTo(0.1, 5);
        expect(scaleY).toBeCloseTo(0.15, 5);
        await advance(fixture, 600);
        fixture.destroy();

        fixture = await mount([withOriginCrop({ originCrop: false })]);
        queryAll('.trigger')[0]!.click();
        await flush(fixture);
        [scaleX, scaleY] = scales(currentItem().style.transform);
        expect(scaleX).toBeCloseTo(0.1, 5);
        expect(scaleY).toBeCloseTo(0.15, 5);
        expect(boxes()[0]!.style.transform).toBe('');
    });

    it('sizes the dummy to the region a pre-cropped file covers', async () => {
        // A square thumbnail file: its pixels are the centre square of the
        // 3:2 image, so the dummy covers only that square of the fitted
        // image box (666.67px wide, a sixth of the width in).
        spies[0]!.mockRestore();
        spies[1]!.mockRestore();
        spies.push(
            vi
                .spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get')
                .mockReturnValue(300),
            vi
                .spyOn(HTMLImageElement.prototype, 'naturalHeight', 'get')
                .mockReturnValue(300),
        );
        const fixture = await mount();
        queryAll('.trigger')[0]!.click();
        await advance(fixture, 20);
        const dummy = query('img.lg-dummy-img')!;
        expect(dummy).not.toBeNull();
        expect(parseFloat(dummy.style.width)).toBeCloseTo(666.667, 2);
        expect(parseFloat(dummy.style.height)).toBeCloseTo(666.667, 2);
        expect(dummy.style.transform).toBe(
            'translate(calc(-50% + 0px), calc(-50% + 0px))',
        );
    });

    it('closes onto the crop window with the stage boxes', async () => {
        const fixture = await mount();
        queryAll('.trigger')[0]!.click();
        await advance(fixture, 20);
        await advance(fixture, 100);
        await advance(fixture, 500);
        const item = currentItem();
        expect(boxes()[0]!.style.transform).toBe('');

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await flush(fixture);
        expect(item.classList.contains('lg-start-end-progress')).toBe(true);
        const [scaleX, scaleY] = scales(item.style.transform);
        expect(scaleX).toBeCloseTo(0.15, 5);
        expect(scaleY).toBeCloseTo(0.15, 5);
        const [outer, inner] = boxes();
        expect(outer!.style.transform).toBe(OUTER_START);
        expect(inner!.style.transform).toBe(INNER_START);
        expect(outer!.style.overflow).toBe('hidden');
        expect(outer!.style.transitionProperty).toBe('transform');
        expect(outer!.style.transitionDuration).toBe('400ms');

        // Gone: inert again for the next open.
        await advance(fixture, 600);
        expect(boxes()[0]!.style.transform).toBe('');
        expect(boxes()[0]!.style.overflow).toBe('');
    });
});
