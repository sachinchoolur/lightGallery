import { enableAutoUnmount, mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LightGallery from './LightGallery.vue';
import LgItem from './LgItem.vue';
import type { LgGalleryItem } from './types';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'a', caption: 'Caption A' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'b' },
    { src: 'c.jpg', thumb: 'c-t.jpg', alt: 'c', caption: 'Caption C' },
];

// Default core timings: backdropDuration 300, speed 400.
const BACKDROP = 300;
const SPEED = 400;

function query(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}

function queryAll(selector: string): HTMLElement[] {
    return [...document.querySelectorAll<HTMLElement>(selector)];
}

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

function loadImage(index: number): Promise<void> {
    const img = document.querySelector<HTMLImageElement>(
        `img.lg-image[data-index="${index}"]`,
    );
    expect(img).not.toBeNull();
    img!.dispatchEvent(new Event('load'));
    return nextTick() as unknown as Promise<void>;
}

enableAutoUnmount(afterEach);

beforeEach(() => {
    vi.useFakeTimers();
});
afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
});

const UncontrolledHost = defineComponent({
    components: { LightGallery, LgItem },
    props: { log: { type: Array, required: true } },
    setup: () => ({ items: ITEMS }),
    template: `
        <LightGallery
            :zoom-from-origin="false"
            @before-open="log.push('beforeOpen')"
            @after-open="log.push('afterOpen')"
            @slide-item-load="log.push('slideItemLoad:' + $event.index)"
            @before-next-slide="log.push('beforeNextSlide:' + $event.index)"
            @before-slide="log.push('beforeSlide:' + $event.prevIndex + '>' + $event.index)"
            @after-slide="log.push('afterSlide:' + $event.prevIndex + '>' + $event.index)"
            @before-close="log.push('beforeClose')"
            @after-close="log.push('afterClose')"
        >
            <LgItem
                v-for="item of items"
                :key="item.src"
                :item="item"
                class="trigger"
            >
                <img :src="item.thumb" :alt="item.alt" />
            </LgItem>
            <template #caption="{ item, index }">
                <h4 class="test-caption">{{ item?.alt }} ({{ index }})</h4>
            </template>
        </LightGallery>
    `,
});

function mountUncontrolled(): {
    wrapper: VueWrapper;
    log: string[];
} {
    const log: string[] = [];
    const wrapper = mount(UncontrolledHost, {
        props: { log },
        attachTo: document.body,
    });
    return { wrapper, log };
}

describe('LightGallery (plan 003 core gallery)', () => {
    it('runs the uncontrolled lifecycle: open from item, navigate, close', async () => {
        const { wrapper, log } = mountUncontrolled();
        expect(query('.lg-container')).toBeNull();

        // Open from the second trigger.
        queryAll('.trigger')[1]!.click();
        await settle();

        const container = query('.lg-container')!;
        expect(container).not.toBeNull();
        expect(container.getAttribute('role')).toBe('dialog');
        expect(container.classList.contains('lg-show')).toBe(true);
        // Backdrop still transparent in pre-open.
        expect(container.classList.contains('lg-show-in')).toBe(false);
        const outer = query('.lg-outer')!;
        expect(outer.classList.contains('lg-slide')).toBe(true);
        // No zoom transform available -> startClass entrance.
        expect(outer.classList.contains('lg-start-zoom')).toBe(true);
        expect(document.documentElement.classList.contains('lg-on')).toBe(
            true,
        );

        // Entrance timeline: 10ms -> opening, +backdrop -> open/visible.
        await advance(10);
        expect(query('.lg-container')!.classList.contains('lg-show-in')).toBe(
            true,
        );
        expect(query('.lg-backdrop')!.classList.contains('in')).toBe(true);
        await advance(BACKDROP);
        expect(query('.lg-outer')!.classList.contains('lg-visible')).toBe(
            true,
        );
        expect(
            query('.lg-outer')!.classList.contains('lg-components-open'),
        ).toBe(true);

        // Current slide content mounted, spinner state until load.
        const current = query('.lg-item.lg-current')!;
        expect(current.classList.contains('lg-loaded')).toBe(true);
        expect(current.classList.contains('lg-complete')).toBe(false);
        expect(
            current.querySelector('img.lg-image')!.getAttribute('src'),
        ).toBe('b.jpg');
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');
        expect(query('.lg-sub-html .test-caption')!.textContent).toBe(
            'b (1)',
        );

        // Only the current slide loads before its media completes.
        expect(queryAll('img.lg-image').length).toBe(1);
        await loadImage(1);
        expect(
            query('.lg-item.lg-current')!.classList.contains('lg-complete'),
        ).toBe(true);
        // Preload window mounts the neighbors once the current loads.
        expect(queryAll('img.lg-image').length).toBe(3);

        // Navigate: galleryOn -> animated transition, gated while running.
        wrapper.findComponent(LightGallery).vm.nextSlide();
        await nextTick();
        expect(query('.lg-outer')!.classList.contains('lg-no-trans')).toBe(
            true,
        );
        await advance(50);
        expect(query('.lg-outer')!.classList.contains('lg-no-trans')).toBe(
            false,
        );
        wrapper.findComponent(LightGallery).vm.nextSlide();
        await nextTick();
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('3');
        await advance(SPEED + 100);
        expect(query('.lg-sub-html .test-caption')!.textContent).toBe(
            'c (2)',
        );

        // Close via the toolbar button; teleport stays through the closing
        // animation, then detaches.
        (query('.lg-close') as HTMLButtonElement).click();
        await nextTick();
        expect(query('.lg-container')).not.toBeNull();
        expect(query('.lg-outer')!.classList.contains('lg-hide-items')).toBe(
            true,
        );
        await advance(BACKDROP + 100);
        expect(query('.lg-container')).toBeNull();
        expect(document.documentElement.classList.contains('lg-on')).toBe(
            false,
        );

        expect(log).toEqual([
            'beforeOpen',
            'afterOpen',
            'slideItemLoad:1',
            'beforeNextSlide:2',
            'beforeSlide:1>2',
            'afterSlide:1>2',
            'beforeClose',
            'afterClose',
        ]);
        wrapper.unmount();
    });

    it('round-trips v-model:open and v-model:index (controlled mode)', async () => {
        const opened = ref(false);
        const idx = ref(1);
        const Host = defineComponent({
            components: { LightGallery },
            setup: () => ({ opened, idx, items: ITEMS }),
            template: `
                <LightGallery
                    :slides="items"
                    :zoom-from-origin="false"
                    v-model:open="opened"
                    v-model:index="idx"
                >
                    <template #counter="{ current, total }">
                        <span class="test-counter"
                            >{{ current }} of {{ total }}</span
                        >
                    </template>
                </LightGallery>
            `,
        });
        const wrapper = mount(Host, { attachTo: document.body });
        expect(query('.lg-container')).toBeNull();

        opened.value = true;
        await settle();
        expect(query('.lg-container')).not.toBeNull();
        // Opens at the bound index, counter via the scoped slot.
        expect(query('.test-counter')!.textContent).toBe('2 of 3');

        // External index write navigates (no animation before galleryOn).
        idx.value = 2;
        await settle();
        expect(query('.test-counter')!.textContent).toBe('3 of 3');

        // Internal navigation writes the model back (loop wraps to 0).
        wrapper.findComponent(LightGallery).vm.nextSlide();
        await nextTick();
        expect(idx.value).toBe(0);
        expect(query('.test-counter')!.textContent).toBe('1 of 3');

        // ESC clears the open model and closes.
        document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape' }),
        );
        await nextTick();
        expect(opened.value).toBe(false);
        await advance(BACKDROP + 100);
        expect(query('.lg-container')).toBeNull();
        wrapper.unmount();
    });

    it('shows the error state when media fails to load', async () => {
        const { wrapper } = mountUncontrolled();
        queryAll('.trigger')[0]!.click();
        await settle();

        const img = document.querySelector<HTMLImageElement>(
            'img.lg-image[data-index="0"]',
        )!;
        img.dispatchEvent(new Event('error'));
        await nextTick();

        const current = query('.lg-item.lg-current')!;
        expect(current.classList.contains('lg-complete')).toBe(true);
        expect(current.querySelector('.lg-error-msg')!.textContent).toContain(
            'Failed to load content',
        );
        wrapper.unmount();
    });

    it('unmount-while-open removes teleported DOM, body lock and timers', async () => {
        const removeSpy = vi.spyOn(document, 'removeEventListener');
        const { wrapper } = mountUncontrolled();
        queryAll('.trigger')[0]!.click();
        await settle();
        expect(query('.lg-container')).not.toBeNull();
        expect(document.documentElement.classList.contains('lg-on')).toBe(
            true,
        );
        expect(vi.getTimerCount()).toBeGreaterThan(0);

        wrapper.unmount();
        expect(query('.lg-container')).toBeNull();
        expect(document.documentElement.classList.contains('lg-on')).toBe(
            false,
        );
        expect(
            removeSpy.mock.calls.some(([type]) => type === 'keydown'),
        ).toBe(true);
        // Gallery-owned timers are cleared on unmount; what remains is
        // jsdom's one-shot focus/Selection tick. Flush it: nothing may
        // fire afterwards and nothing may resurrect.
        vi.runOnlyPendingTimers();
        expect(vi.getTimerCount()).toBe(0);
        expect(query('.lg-container')).toBeNull();
        removeSpy.mockRestore();
    });

    it('honors ends without loop: bounce class and no wrap', async () => {
        const Host = defineComponent({
            components: { LightGallery },
            setup: () => ({ items: ITEMS }),
            template: `
                <LightGallery
                    :slides="items"
                    :zoom-from-origin="false"
                    :loop="false"
                />
            `,
        });
        const wrapper = mount(Host, { attachTo: document.body });
        wrapper.findComponent(LightGallery).vm.openGallery(2);
        await settle();
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('3');

        wrapper.findComponent(LightGallery).vm.nextSlide();
        await nextTick();
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('3');
        expect(query('.lg-outer')!.classList.contains('lg-right-end')).toBe(
            true,
        );
        await advance(400);
        expect(query('.lg-outer')!.classList.contains('lg-right-end')).toBe(
            false,
        );
        wrapper.unmount();
    });

    it('renders a CSS-only transition mode by class name alone', async () => {
        const Host = defineComponent({
            components: { LightGallery },
            setup: () => ({ items: ITEMS }),
            template: `
                <LightGallery
                    :slides="items"
                    :zoom-from-origin="false"
                    mode="lg-lollipop"
                />
            `,
        });
        const wrapper = mount(Host, { attachTo: document.body });
        wrapper.findComponent(LightGallery).vm.openGallery(0);
        await settle();
        expect(
            query('.lg-outer')!.classList.contains('lg-lollipop'),
        ).toBe(true);
        wrapper.findComponent(LightGallery).vm.nextSlide();
        await nextTick();
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');
        wrapper.unmount();
    });
});
