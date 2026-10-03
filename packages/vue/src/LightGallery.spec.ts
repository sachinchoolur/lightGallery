import { enableAutoUnmount, mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LightGallery from './LightGallery.vue';
import LgItem from './LgItem.vue';
import Video from './plugins/video';
import type { LgGalleryItem } from './types';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'a', caption: 'Caption A' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'b' },
    { src: 'c.jpg', thumb: 'c-t.jpg', alt: 'c', caption: 'Caption C' },
];

// Default core timings: backdropDuration 300, speed 400.
const BACKDROP = 300;
const SPEED = 400;
// A close runs its exit motion for startAnimationDuration (400) and hides
// once that or the backdrop is done.
const CLOSE_EXIT = Math.max(400, BACKDROP) + 100;

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

describe('LightGallery (core gallery)', () => {
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
        expect(document.documentElement.classList.contains('lg-on')).toBe(true);

        // Entrance timeline: 10ms -> opening, +backdrop -> open/visible.
        await advance(10);
        expect(query('.lg-container')!.classList.contains('lg-show-in')).toBe(
            true,
        );
        expect(query('.lg-backdrop')!.classList.contains('in')).toBe(true);
        await advance(BACKDROP);
        expect(query('.lg-outer')!.classList.contains('lg-visible')).toBe(true);
        expect(
            query('.lg-outer')!.classList.contains('lg-components-open'),
        ).toBe(true);

        // Current slide content mounted, spinner state until load.
        const current = query('.lg-item.lg-current')!;
        expect(current.classList.contains('lg-loaded')).toBe(true);
        expect(current.classList.contains('lg-complete')).toBe(false);
        expect(current.querySelector('img.lg-image')!.getAttribute('src')).toBe(
            'b.jpg',
        );
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');
        expect(query('.lg-sub-html .test-caption')!.textContent).toBe('b (1)');

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
        expect(query('.lg-sub-html .test-caption')!.textContent).toBe('c (2)');

        // Close via the toolbar button; teleport stays through the closing
        // animation, then detaches.
        (query('.lg-close') as HTMLButtonElement).click();
        await nextTick();
        expect(query('.lg-container')).not.toBeNull();
        // zoomFromOrigin is off here, so the zoom close shrinks to the
        // centre instead of flying.
        expect(
            query('.lg-outer')!.classList.contains('lg-close-to-center'),
        ).toBe(true);
        await advance(CLOSE_EXIT);
        // v2 parity: the container persists after close, hidden by
        // dropping lg-show (CSS display:none).
        expect(query('.lg-container.lg-show')).toBeNull();
        expect(query('.lg-container')).not.toBeNull();
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

    it('decode-gates the slide completion (no partial paint)', async () => {
        const { wrapper } = mountUncontrolled();
        queryAll('.trigger')[0]!.click();
        await settle();
        await advance(BACKDROP + 20);
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
        await settle();
        // Loaded but not decoded: the slide must NOT complete — a
        // completion here is exactly the partial paint the gate blocks.
        expect(query('.lg-item.lg-current.lg-complete')).toBeNull();
        settleDecode();
        await Promise.resolve();
        await settle();
        expect(query('.lg-item.lg-current.lg-complete')).not.toBeNull();
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
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();
        expect(opened.value).toBe(false);
        await advance(CLOSE_EXIT);
        expect(query('.lg-container.lg-show')).toBeNull();
        expect(query('.lg-container')).not.toBeNull();
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
        expect(document.documentElement.classList.contains('lg-on')).toBe(true);
        expect(vi.getTimerCount()).toBeGreaterThan(0);

        wrapper.unmount();
        expect(query('.lg-container')).toBeNull();
        expect(document.documentElement.classList.contains('lg-on')).toBe(
            false,
        );
        expect(removeSpy.mock.calls.some(([type]) => type === 'keydown')).toBe(
            true,
        );
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
        expect(query('.lg-outer')!.classList.contains('lg-lollipop')).toBe(
            true,
        );
        wrapper.findComponent(LightGallery).vm.nextSlide();
        await nextTick();
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');
        wrapper.unmount();
    });
});

describe('persistent container (v2 close contract)', () => {
    it('keeps the shell, empties the items, and remounts on reopen', async () => {
        const { wrapper } = mountUncontrolled();
        queryAll('.trigger')[0]!.click();
        await settle();
        await advance(BACKDROP + 150);
        expect(query('.lg-item.lg-current')).not.toBeNull();

        wrapper.findComponent(LightGallery).vm.closeGallery();
        await settle();
        // Mid-close the items — AND their content — must survive for the
        // exit animation: the close flight on an empty item is invisible.
        expect(query('.lg-item')).not.toBeNull();
        expect(query('.lg-item img.lg-image')).not.toBeNull();
        await advance(CLOSE_EXIT);
        // 2.x `$inner.empty()`: the persistent shell keeps .lg-inner,
        // but the stale items — and their lg-current — unmount with the
        // close.
        expect(query('.lg-container')).not.toBeNull();
        expect(query('.lg-container.lg-show')).toBeNull();
        expect(query('.lg-inner')).not.toBeNull();
        expect(query('.lg-item')).toBeNull();

        // Reopen at a DIFFERENT index: fresh items, correct current.
        queryAll('.trigger')[2]!.click();
        await settle();
        await advance(BACKDROP + 150);
        expect(query('.lg-container.lg-show')).not.toBeNull();
        const current = query('.lg-item.lg-current');
        expect(current).not.toBeNull();
        expect(
            current!.querySelector('img.lg-image')!.getAttribute('src'),
        ).toBe('c.jpg');
        wrapper.unmount();
    });
});

describe('zoom-from-origin dummy image', () => {
    it('ignores a load from the real image dropped for the dummy', async () => {
        // The first slide mounts its real <img> for one tick before the
        // flight arms the dummy and drops it; its listener stays on the
        // detached element, and a cached image fires load right then.
        // Completing on it would drop the dummy and mount the real image
        // mid-flight.
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
        const Host = defineComponent({
            components: { LightGallery, LgItem },
            setup: () => ({
                items: ITEMS.map((item) => ({
                    ...item,
                    lgSize: '1600-1067',
                })),
            }),
            template: `
                <LightGallery>
                    <LgItem
                        v-for="item of items"
                        :key="item.src"
                        :item="item"
                        class="trigger"
                    >
                        <img :src="item.thumb" :alt="item.alt" />
                    </LgItem>
                </LightGallery>
            `,
        });
        mount(Host, { attachTo: document.body });
        queryAll('.trigger')[0]!.click();
        await nextTick();
        const early = query('.lg-item.lg-current img.lg-image');
        expect(early).not.toBeNull();
        await settle();
        await advance(20);
        expect(early!.isConnected).toBe(false);
        expect(query('img.lg-dummy-img')).not.toBeNull();

        early!.dispatchEvent(new Event('load'));
        await advance(310);
        expect(query('.lg-item.lg-current.lg-complete')).toBeNull();
        expect(query('img.lg-dummy-img')).not.toBeNull();
        expect(query('.lg-item.lg-current img.lg-image')).toBeNull();

        // The flight lands (fallback offset): the real image mounts and
        // completes on its own load.
        await advance(SPEED);
        const real = query('.lg-item.lg-current img.lg-image');
        expect(real).not.toBeNull();
        real!.dispatchEvent(new Event('load'));
        await nextTick();
        expect(query('.lg-item.lg-current.lg-complete')).not.toBeNull();
        rectSpy.mockRestore();
    });

    it('holds the real image until the flight transition actually ends', async () => {
        // The landing is gated on the slide's own transitionend: a fixed
        // offset lands mid-flight whenever the transition starts late
        // (busy main thread) and the image is fast (cached).
        const transitionEvent = (type: string, propertyName: string) =>
            Object.assign(new Event(type, { bubbles: true }), {
                propertyName,
            });
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
        const Host = defineComponent({
            components: { LightGallery, LgItem },
            setup: () => ({
                items: ITEMS.map((item) => ({
                    ...item,
                    lgSize: '1600-1067',
                })),
            }),
            template: `
                <LightGallery>
                    <LgItem
                        v-for="item of items"
                        :key="item.src"
                        :item="item"
                        class="trigger"
                    >
                        <img :src="item.thumb" :alt="item.alt" />
                    </LgItem>
                </LightGallery>
            `,
        });
        mount(Host, { attachTo: document.body });
        queryAll('.trigger')[0]!.click();
        await settle();
        await advance(20);
        const item = query('.lg-item.lg-current')!;
        expect(query('img.lg-dummy-img')).not.toBeNull();

        // Late start, then well past the fixed offset: still flying.
        await advance(280);
        item.dispatchEvent(transitionEvent('transitionstart', 'transform'));
        await advance(400);
        expect(query('.lg-item.lg-current img.lg-image')).toBeNull();
        expect(item.classList.contains('lg-start-end-progress')).toBe(true);

        item.dispatchEvent(transitionEvent('transitionend', 'transform'));
        await settle();
        expect(query('.lg-item.lg-current img.lg-image')).not.toBeNull();
        expect(item.classList.contains('lg-start-end-progress')).toBe(false);
        rectSpy.mockRestore();
    });

    it('flies the dummy at the natural size when the image is smaller than the stage', async () => {
        // Same flight preconditions as the test below; a 40×30 image fits
        // the 100×80 stage unscaled, so the dummy must not fill the stage.
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
        const Host = defineComponent({
            components: { LightGallery, LgItem },
            setup: () => ({
                items: ITEMS.map((item) => ({ ...item, lgSize: '40-30' })),
            }),
            template: `
                <LightGallery>
                    <LgItem
                        v-for="item of items"
                        :key="item.src"
                        :item="item"
                        class="trigger"
                    >
                        <img :src="item.thumb" :alt="item.alt" />
                    </LgItem>
                </LightGallery>
            `,
        });
        mount(Host, { attachTo: document.body });
        queryAll('.trigger')[0]!.click();
        await settle();
        await advance(20);

        const dummy = query('img.lg-dummy-img') as HTMLImageElement | null;
        expect(dummy).not.toBeNull();
        expect(dummy!.style.width).toBe('40px');
        expect(dummy!.style.height).toBe('30px');
        rectSpy.mockRestore();
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
        const Host = defineComponent({
            components: { LightGallery, LgItem },
            setup: () => ({
                items: ITEMS.map((item) => ({
                    ...item,
                    lgSize: '1600-1067',
                })),
            }),
            template: `
                <LightGallery>
                    <LgItem
                        v-for="item of items"
                        :key="item.src"
                        :item="item"
                        class="trigger"
                    >
                        <img :src="item.thumb" :alt="item.alt" />
                    </LgItem>
                </LightGallery>
            `,
        });
        mount(Host, { attachTo: document.body });
        queryAll('.trigger')[0]!.click();
        await settle();
        await advance(20);

        // 2.x first-slide contract: ONLY the thumb-dummy exists during
        // the flight — the real image must not fetch/decode mid-flight.
        const dummy = query('img.lg-dummy-img');
        expect(dummy).not.toBeNull();
        expect(dummy!.getAttribute('src')).toBe('a-t.jpg');
        expect(query('.lg-item.lg-current img.lg-image')).toBeNull();
        expect(query('.lg-item.lg-first-slide')).not.toBeNull();
        expect(query('.lg-outer.lg-first-slide-loading')).not.toBeNull();

        // Flight lands: the real image mounts, the dummy stays on top.
        await advance(SPEED + 220);
        const real = query('.lg-item.lg-current img.lg-image');
        expect(real).not.toBeNull();
        expect(query('img.lg-dummy-img')).not.toBeNull();

        // Real image load settles, then the 300ms drop buffer removes
        // the dummy and the loading classes.
        real!.dispatchEvent(new Event('load'));
        await nextTick();
        await advance(310);
        expect(query('img.lg-dummy-img')).toBeNull();
        expect(query('.lg-item.lg-first-slide')).toBeNull();
        expect(query('.lg-outer.lg-first-slide-loading')).toBeNull();
        expect(query('.lg-item.lg-current.lg-complete')).not.toBeNull();
        rectSpy.mockRestore();
    });

    it('flies the thumb over a video poster and drops it after the load', async () => {
        // Same flight preconditions as the image dummy: a real-looking
        // trigger rect and lgSize; the video plugin supplies the
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
        const Host = defineComponent({
            components: { LightGallery, LgItem },
            setup: () => ({
                items: [
                    {
                        src: 'https://vimeo.com/112836958',
                        poster: 'poster.jpg',
                        thumb: 'v-t.jpg',
                        alt: 'vimeo',
                        lgSize: '1280-720',
                    },
                ],
                plugins: [Video],
            }),
            template: `
                <LightGallery :plugins="plugins">
                    <LgItem
                        v-for="item of items"
                        :key="item.src"
                        :item="item"
                        class="trigger"
                    >
                        <img :src="item.thumb" :alt="item.alt" />
                    </LgItem>
                </LightGallery>
            `,
        });
        mount(Host, { attachTo: document.body });
        queryAll('.trigger')[0]!.click();
        await settle();
        await advance(20);

        // During the flight ONLY the thumb-dummy exists — the poster
        // must not mount (and fetch) mid-flight.
        const dummy = query('img.lg-dummy-img');
        expect(dummy).not.toBeNull();
        expect(dummy!.getAttribute('src')).toBe('v-t.jpg');
        expect(query('img.lg-video-poster')).toBeNull();
        expect(query('.lg-outer.lg-first-slide-loading')).not.toBeNull();

        // Flight lands: the poster mounts beneath the dummy.
        await advance(SPEED + 220);
        const posterEl = query('img.lg-video-poster');
        expect(posterEl).not.toBeNull();
        expect(query('img.lg-dummy-img')).not.toBeNull();

        // Poster load settles the slide; the 300ms buffer drops the
        // dummy and the loading classes.
        posterEl!.dispatchEvent(new Event('load'));
        await nextTick();
        await advance(310);
        expect(query('img.lg-dummy-img')).toBeNull();
        expect(query('.lg-outer.lg-first-slide-loading')).toBeNull();
        expect(query('.lg-item.lg-current.lg-complete')).not.toBeNull();
        rectSpy.mockRestore();
    });
});

describe('closing without a thumbnail to return to', () => {
    // A collage hides its overflow items behind a "+N photos" tile: their
    // triggers measure 0×0 at the viewport origin, and the close flight
    // used to aim there, shrinking the slide into the top-left corner.
    const CENTER = 'translate3d(0, 0, 0) scale3d(0.5, 0.5, 1)';
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
    let rectSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
        rectSpy = vi
            .spyOn(Element.prototype, 'getBoundingClientRect')
            .mockImplementation(function (this: Element) {
                return this.closest('[hidden]')
                    ? rect(0, 0, 0, 0)
                    : rect(10, 10, 100, 80);
            });
    });
    afterEach(() => {
        rectSpy.mockRestore();
    });

    const Host = defineComponent({
        components: { LightGallery, LgItem },
        setup: () => ({
            items: ITEMS.map((item) => ({ ...item, lgSize: '1600-1067' })),
        }),
        template: `
            <LightGallery>
                <LgItem
                    v-for="item of items"
                    :key="item.src"
                    :item="item"
                    class="trigger"
                >
                    <img :src="item.thumb" :alt="item.alt" />
                </LgItem>
            </LightGallery>
        `,
    });
    const mountGallery = () => {
        const wrapper = mount(Host, { attachTo: document.body });
        return wrapper.findComponent(LightGallery).vm;
    };
    const currentItem = () => query('.lg-item.lg-current')!;
    const expectCenterClose = () => {
        const outer = query('.lg-outer')!;
        expect(outer.classList.contains('lg-closing')).toBe(true);
        expect(outer.classList.contains('lg-zoom-from-image')).toBe(true);
        expect(outer.classList.contains('lg-close-to-center')).toBe(true);
        expect(currentItem().classList.contains('lg-start-end-progress')).toBe(
            true,
        );
        expect(currentItem().style.transform).toBe(CENTER);
    };

    it('shrinks to the centre when the trigger it flew from is now hidden', async () => {
        const vm = mountGallery();
        queryAll('.trigger')[0]!.click();
        await settle();
        await advance(20);
        expect(currentItem().classList.contains('lg-start-end-progress')).toBe(
            true,
        );
        // Land the flight on its fixed offset.
        await advance(800);
        expect(currentItem().classList.contains('lg-start-end-progress')).toBe(
            false,
        );

        // The grid collapses behind a "+N photos" tile before the close.
        queryAll('.trigger')[0]!.hidden = true;
        vm.closeGallery();
        await settle();
        expectCenterClose();

        await advance(600);
        expect(query('.lg-outer.lg-close-to-center')).toBeNull();
    });

    it('shrinks to the centre after opening on a hidden trigger', async () => {
        const vm = mountGallery();
        queryAll('.trigger')[1]!.hidden = true;
        vm.openGallery(1);
        await settle();
        await advance(20);
        // No flight to aim: the start class scales up from the centre.
        expect(query('.lg-outer')!.classList.contains('lg-start-zoom')).toBe(
            true,
        );
        expect(currentItem().classList.contains('lg-start-end-progress')).toBe(
            false,
        );
        await advance(400);

        vm.closeGallery();
        await settle();
        expectCenterClose();
    });

    it('still flies back to a visible trigger', async () => {
        const vm = mountGallery();
        queryAll('.trigger')[0]!.click();
        await settle();
        await advance(820);

        vm.closeGallery();
        await settle();
        const outer = query('.lg-outer')!;
        expect(outer.classList.contains('lg-closing')).toBe(true);
        expect(outer.classList.contains('lg-close-to-center')).toBe(false);
        expect(currentItem().classList.contains('lg-start-end-progress')).toBe(
            true,
        );
        expect(currentItem().style.transform).toContain('scale3d(');
        expect(currentItem().style.transform).not.toBe(CENTER);
    });

});

describe('iframe slides', () => {
    const IFRAME_ITEMS: LgGalleryItem[] = [
        { src: 'https://example.com/a', iframe: true, iframeTitle: 'Frame A' },
        { src: 'https://example.com/b', iframe: true, title: 'Slide B' },
        { src: 'https://example.com/c', iframe: true },
    ];

    function mountIframes(settings: Record<string, string> = {}): {
        opened: { value: boolean };
        log: string[];
    } {
        const opened = ref(false);
        const log: string[] = [];
        const Host = defineComponent({
            components: { LightGallery },
            setup: () => ({ opened, items: IFRAME_ITEMS, settings, log }),
            template: `
                <LightGallery
                    :slides="items"
                    :zoom-from-origin="false"
                    v-bind="settings"
                    v-model:open="opened"
                    @slide-item-load="log.push('slideItemLoad:' + $event.index)"
                />
            `,
        });
        mount(Host, { attachTo: document.body });
        return { opened, log };
    }

    function frameOf(src: string): HTMLIFrameElement | null {
        return document.querySelector<HTMLIFrameElement>(
            `.lg-item > .lg-media-cont.lg-has-iframe > iframe[src="${src}"]`,
        );
    }

    it('renders the 2.x iframe markup and completes the slide on load', async () => {
        const { opened, log } = mountIframes();
        opened.value = true;
        await settle();
        await advance(BACKDROP + 20);

        const current = query('.lg-item.lg-current')!;
        const cont = current.querySelector<HTMLElement>(
            ':scope > .lg-media-cont.lg-has-iframe',
        )!;
        expect(cont).not.toBeNull();
        expect(cont.style.width).toBe('100%');
        expect(cont.style.maxWidth).toBe('100%');
        expect(cont.style.height).toBe('100%');
        expect(cont.style.maxHeight).toBe('100%');
        const frame = cont.querySelector<HTMLIFrameElement>(
            ':scope > iframe.lg-object',
        )!;
        expect(frame).not.toBeNull();
        expect(frame.getAttribute('src')).toBe('https://example.com/a');
        expect(frame.getAttribute('frameborder')).toBe('0');
        expect(frame.hasAttribute('allowfullscreen')).toBe(true);

        // Spinner state until the frame loads; neighbours wait for it.
        expect(current.classList.contains('lg-loaded')).toBe(true);
        expect(current.classList.contains('lg-complete')).toBe(false);
        expect(queryAll('.lg-item iframe')).toHaveLength(1);
        expect(log).toEqual([]);

        frame.dispatchEvent(new Event('load'));
        await settle();
        expect(current.classList.contains('lg-complete')).toBe(true);
        expect(log).toEqual(['slideItemLoad:0']);
        // The load releases the preload of the neighbouring slides.
        expect(queryAll('.lg-item iframe')).toHaveLength(3);
    });

    it('sizes the frame from the iframe settings', async () => {
        const { opened } = mountIframes({
            iframeWidth: '80%',
            iframeHeight: '75%',
            iframeMaxWidth: '960px',
            iframeMaxHeight: '600px',
        });
        opened.value = true;
        await settle();

        const cont = query('.lg-media-cont.lg-has-iframe')!;
        expect(cont.style.width).toBe('80%');
        expect(cont.style.height).toBe('75%');
        expect(cont.style.maxWidth).toBe('960px');
        expect(cont.style.maxHeight).toBe('600px');
    });

    it('titles the frame from iframeTitle, then title, then a fallback', async () => {
        const { opened } = mountIframes();
        opened.value = true;
        await settle();
        frameOf('https://example.com/a')!.dispatchEvent(new Event('load'));
        await settle();

        expect(frameOf('https://example.com/a')!.title).toBe('Frame A');
        expect(frameOf('https://example.com/b')!.title).toBe('Slide B');
        expect(frameOf('https://example.com/c')!.title).toBe(
            'Embedded content',
        );
    });
});
