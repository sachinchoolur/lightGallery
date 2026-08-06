import { enableAutoUnmount, mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LightGallery from './LightGallery.vue';
import type { LgGalleryItem } from './types';
import Thumbnail from './plugins/thumbnail';

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

async function settle(): Promise<void> {
    for (let i = 0; i < 3; i++) {
        await nextTick();
    }
}

enableAutoUnmount(afterEach);

afterEach(() => {
    document.body.innerHTML = '';
});

async function mountGallery(
    items: LgGalleryItem[],
    virtualization?: Record<string, unknown>,
    openAt = 0,
) {
    const Host = defineComponent({
        components: { LightGallery },
        setup: () => ({ items, plugins: [Thumbnail], virtualization }),
        template: `
            <LightGallery
                :slides="items"
                :zoom-from-origin="false"
                :plugins="plugins"
                :virtualization="virtualization"
            />
        `,
    });
    const wrapper = mount(Host, { attachTo: document.body });
    (
        wrapper.findComponent(LightGallery).vm as unknown as {
            openGallery(i?: number): void;
        }
    ).openGallery(openAt);
    await settle();
    vi.advanceTimersByTime(450);
    await settle();
    return wrapper;
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
        await mountGallery(ITEMS, { slides: 7, thumbs: 2 });

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
    });

    it('renders every thumbnail when virtualization is off (default)', async () => {
        await mountGallery(ITEMS.slice(0, 100));
        expect(document.querySelectorAll('.lg-thumb-item').length).toBe(100);
        expect(query('.lg-thumb-spacer')).toBeNull();
        expect(
            document.querySelectorAll('.lg-item').length,
        ).toBeLessThanOrEqual(11);
    });

    it('advances the thumb window when opening mid-gallery', async () => {
        await mountGallery(ITEMS, { slides: 7, thumbs: 2 }, 500);
        const ids = [
            ...document.querySelectorAll<HTMLElement>('.lg-thumb-item'),
        ].map((el) => Number(el.getAttribute('data-lg-item-id')));
        expect(Math.min(...ids)).toBeGreaterThan(400);
        expect(Math.max(...ids)).toBeLessThan(600);
        expect(document.querySelectorAll('.lg-thumb-spacer').length).toBe(2);
    });
});
