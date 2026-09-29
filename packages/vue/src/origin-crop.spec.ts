import { enableAutoUnmount, mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LightGallery from './LightGallery.vue';
import LgItem from './LgItem.vue';
import OriginCrop from './plugins/originCrop';
import type { LgGalleryItem } from './types';

// A square grid tile cropped with `object-fit: cover` shows a window of
// the image. The built-in flight squashes the whole slide into the tile;
// with the plugin the window lands on the tile at a uniform scale while
// two boxes around the slides crop the rest, opening with the flight.
const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-thumb.jpg', alt: 'a', lgSize: '1500-1000' },
    { src: 'b.jpg', thumb: 'b-thumb.jpg', alt: 'b', lgSize: '1500-1000' },
];

enableAutoUnmount(afterEach);

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
async function advance(ms: number): Promise<void> {
    vi.advanceTimersByTime(ms);
    await nextTick();
}
/** Watcher flush + nextTick(runEntrance) + render need three microtask turns. */
async function settle(): Promise<void> {
    for (let i = 0; i < 3; i++) {
        await nextTick();
    }
}
const boxes = () => [
    ...document.querySelectorAll<HTMLElement>('.lg-origin-crop'),
];
const currentItem = () =>
    document.querySelector<HTMLElement>('.lg-item.lg-current')!;
// Stage 1000×800 at the origin, tile 100×100 at (100, 200): the outer
// box's bottom-right corner meets the tile's, the inner box's top-left
// corner meets the tile's.
const OUTER_START = 'translate3d(-800px, -500px, 0)';
const INNER_START = 'translate3d(900px, 700px, 0)';
const REST = 'translate3d(0, 0, 0)';

let spies: Array<{ mockRestore(): void }>;
// Own client-size accessors (a spy on Element.prototype can be shadowed
// by one defined closer to the element in another suite).
const clientSize: Record<string, PropertyDescriptor | undefined> = {};
const defineClientSize = (property: string, size: number) => {
    clientSize[property] = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        property,
    );
    Object.defineProperty(HTMLElement.prototype, property, {
        configurable: true,
        get(this: Element) {
            return this.classList.contains('lg-outer') ? size : 0;
        },
    });
};

function mountTriggers(
    plugins: unknown[] = [OriginCrop],
    galleryProps: Record<string, unknown> = {},
) {
    const Host = defineComponent({
        components: { LightGallery, LgItem },
        setup: () => ({ items: ITEMS, plugins, galleryProps }),
        template: `
            <LightGallery :plugins="plugins" v-bind="galleryProps">
                <LgItem
                    v-for="(item, index) of items"
                    :key="item.src"
                    :item="item"
                    class="trigger"
                >
                    <img
                        :class="index === 0 ? 'tile cover' : 'tile'"
                        :src="item.thumb"
                        :alt="item.alt"
                    />
                </LgItem>
            </LightGallery>
        `,
    });
    return mount(Host, { attachTo: document.body });
}

async function open(index: number): Promise<void> {
    [...document.querySelectorAll<HTMLElement>('.trigger')][index]!.click();
    await settle();
}

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
    defineClientSize('clientWidth', 1000);
    defineClientSize('clientHeight', 800);
    document.head.innerHTML = `<style>
        .lg-outer { padding: 0; }
        .cover { object-fit: cover; }
    </style>`;
});

afterEach(() => {
    vi.runOnlyPendingTimers();
    spies.forEach((spy) => spy.mockRestore());
    Object.keys(clientSize).forEach((property) => {
        const previous = clientSize[property];
        if (previous) {
            Object.defineProperty(HTMLElement.prototype, property, previous);
        } else {
            delete (
                HTMLElement.prototype as unknown as Record<string, unknown>
            )[property];
        }
    });
    document.head.innerHTML = '';
    vi.useRealTimers();
});

describe('originCrop plugin', () => {
    it('wraps the slides alone in two stage boxes', async () => {
        mountTriggers();
        await open(0);
        const [outer, inner] = boxes();
        expect(boxes()).toHaveLength(2);
        expect(outer!.parentElement!.classList.contains('lg-content')).toBe(
            true,
        );
        expect(inner!.parentElement).toBe(outer);
        expect(document.querySelector('.lg-inner')!.parentElement).toBe(inner);
        // The arrows stay in the stage, outside the crop.
        expect(
            document
                .querySelector('.lg-prev')!
                .parentElement!.classList.contains('lg-content'),
        ).toBe(true);
    });

    it('flies the crop window at a uniform scale and reveals the rest', async () => {
        mountTriggers();
        await open(0);
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
        await advance(20);
        expect(outer!.style.transform).toBe(OUTER_START);
        expect(outer!.style.transitionProperty).toBe('transform');
        expect(outer!.style.transitionDuration).toBe('400ms');

        // Running: the boxes open with the slide.
        await advance(100);
        expect(item.style.transform).toBe(REST);
        expect(outer!.style.transform).toBe(REST);
        expect(inner!.style.transform).toBe(REST);

        // Landed: the boxes are inert again.
        await advance(500);
        expect(item.style.transform).toBe('');
        expect(outer!.style.transform).toBe('');
        expect(outer!.style.overflow).toBe('');
        expect(outer!.style.transitionProperty).toBe('');
    });

    it('keeps the built-in flight for an uncropped thumbnail', async () => {
        // The default object-fit stretches the file into the square tile,
        // so the flight has to stretch too: no crop, non-uniform scale.
        mountTriggers();
        await open(1);
        const [scaleX, scaleY] = scales(currentItem().style.transform);
        expect(scaleX).toBeCloseTo(0.1, 5);
        expect(scaleY).toBeCloseTo(0.15, 5);
        expect(currentItem().style.transform).toMatch(
            /^translate3d\(-350px, -150px, 0\)/,
        );
        expect(boxes()[0]!.style.transform).toBe('');
    });

    it('is the built-in flight without the plugin, and when disabled', async () => {
        const wrapper = mountTriggers([]);
        await open(0);
        expect(boxes()).toHaveLength(0);
        // No wrapper either: the slide list sits first in the stage as it
        // always has, with no fragment anchor before it.
        const content = document.querySelector('.lg-content')!;
        const inner = document.querySelector('.lg-inner')!;
        expect(inner.parentElement).toBe(content);
        expect(content.firstChild).toBe(inner);
        let [scaleX, scaleY] = scales(currentItem().style.transform);
        expect(scaleX).toBeCloseTo(0.1, 5);
        expect(scaleY).toBeCloseTo(0.15, 5);
        await advance(600);
        wrapper.unmount();

        mountTriggers([OriginCrop], { originCrop: { originCrop: false } });
        await open(0);
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
        mountTriggers();
        await open(0);
        await advance(20);
        const dummy = document.querySelector<HTMLElement>('img.lg-dummy-img')!;
        expect(parseFloat(dummy.style.width)).toBeCloseTo(666.667, 2);
        expect(parseFloat(dummy.style.height)).toBeCloseTo(666.667, 2);
        expect(dummy.style.transform).toBe(
            'translate(calc(-50% + 0px), calc(-50% + 0px))',
        );
    });

    it('closes onto the crop window with the stage boxes', async () => {
        const wrapper = mountTriggers();
        await open(0);
        await advance(20);
        await advance(100);
        await advance(500);
        const item = currentItem();
        expect(boxes()[0]!.style.transform).toBe('');

        (
            wrapper.findComponent(LightGallery).vm as unknown as {
                closeGallery(): void;
            }
        ).closeGallery();
        await settle();
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
        await advance(600);
        expect(boxes()[0]!.style.transform).toBe('');
        expect(boxes()[0]!.style.overflow).toBe('');
    });
});
