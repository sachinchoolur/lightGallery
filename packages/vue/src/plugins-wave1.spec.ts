import { enableAutoUnmount, mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LightGallery from './LightGallery.vue';
import { LG_RUNTIME, type LgGalleryRuntime } from './runtime';
import type { LgGalleryItem } from './types';
import type { LgVuePlugin } from './plugins/types';
import Thumbnail from './plugins/thumbnail';
import Video from './plugins/video';
import Zoom from './plugins/zoom';

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

async function advance(ms: number): Promise<void> {
    vi.advanceTimersByTime(ms);
    await nextTick();
}

async function settle(): Promise<void> {
    for (let i = 0; i < 3; i++) {
        await nextTick();
    }
}

/**
 * jsdom has no PointerEvent constructor; a MouseEvent with the pointer
 * fields defined on it walks and quacks enough for the native listeners.
 */
function firePointer(
    target: EventTarget,
    type: 'pointerdown' | 'pointermove' | 'pointerup',
    init: { x: number; y: number; pointerId?: number },
): void {
    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: init.x,
        clientY: init.y,
    });
    Object.defineProperty(event, 'pointerId', { value: init.pointerId ?? 1 });
    Object.defineProperty(event, 'pointerType', { value: 'touch' });
    target.dispatchEvent(event);
}

const Host = defineComponent({
    components: { LightGallery },
    props: {
        plugins: { type: Array, required: true },
        log: { type: Array, required: true },
    },
    setup: () => ({ items: ITEMS }),
    template: `
        <LightGallery
            :slides="items"
            :zoom-from-origin="false"
            :plugins="plugins"
            :zoom="{ showZoomInOutIcons: true }"
            @poster-click="log.push('posterClick')"
            @has-video="log.push('hasVideo:' + $event.index)"
        />
    `,
});

function mountHost(plugins: readonly LgVuePlugin[]): {
    wrapper: ReturnType<typeof mount>;
    log: string[];
} {
    const log: string[] = [];
    const wrapper = mount(Host, {
        props: { plugins: plugins as never[], log },
        attachTo: document.body,
    });
    return { wrapper, log };
}

async function openAndLoad(
    wrapper: ReturnType<typeof mount>,
    index = 0,
): Promise<void> {
    (
        wrapper.findComponent(LightGallery).vm as unknown as {
            openGallery(i?: number): void;
        }
    ).openGallery(index);
    await settle();
    await advance(450);
    document
        .querySelector<HTMLImageElement>(
            `img.lg-image[data-index="${index}"]`,
        )
        ?.dispatchEvent(new Event('load'));
    await settle();
}

function runtimeOf(wrapper: ReturnType<typeof mount>): LgGalleryRuntime {
    return (
        wrapper.findComponent(LightGallery).vm.$ as unknown as {
            provides: Record<symbol, unknown>;
        }
    ).provides[LG_RUNTIME as symbol] as LgGalleryRuntime;
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

describe('plugin runtime + wave-1', () => {
    it('merges plugin defaults/presets/per-plugin attrs without mutating inputs', async () => {
        const defaults = Object.freeze({ probeOption: 'default' });
        const presets = Object.freeze({ loop: false });
        const probe: LgVuePlugin = {
            name: 'probe',
            defaults,
            presets,
        };
        const { wrapper } = mountHost([probe]);
        await openAndLoad(wrapper);

        // Presets land below user settings: no :loop prop -> preset wins
        // (prev from slide 0 stays put).
        const vm = wrapper.findComponent(LightGallery)
            .vm as unknown as { prevSlide(): void };
        vm.prevSlide();
        await settle();
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('1');
        expect(defaults.probeOption).toBe('default');
        expect(presets.loop).toBe(false);
    });

    it('ignores duplicate plugins by name, warning once', async () => {
        const warn = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => undefined);
        const { wrapper } = mountHost([
            { name: 'probe', defaults: { v: 'first' } },
            { name: 'probe', defaults: { v: 'second' } },
        ]);
        await openAndLoad(wrapper);
        expect(warn).toHaveBeenCalledWith(
            'lightGallery: duplicate plugin "probe" ignored.',
        );
        warn.mockRestore();
    });

    it('runs plugin setup(ctx) with scope cleanup and transformItems', async () => {
        const cleanup = vi.fn();
        const probe: LgVuePlugin = {
            name: 'probe',
            setup(ctx) {
                ctx.layout.setOuterClass('lg-probe-setup', true);
                // onScopeDispose path is exercised through unmount below.
                void import('vue').then(() => undefined);
                cleanup.mockImplementation(() => undefined);
            },
            transformItems: (items) =>
                Promise.resolve(
                    items.map((item) => ({
                        ...item,
                        alt: `${item.alt}-transformed`,
                    })),
                ),
        };
        const { wrapper } = mountHost([probe]);
        await settle();
        for (let i = 0; i < 6; i++) {
            await Promise.resolve();
        }
        await settle();
        await openAndLoad(wrapper);

        expect(
            query('.lg-outer')!.classList.contains('lg-probe-setup'),
        ).toBe(true);
        expect(
            query('.lg-item.lg-current img')!.getAttribute('alt'),
        ).toBe('a-transformed');
    });

    it('thumbnail: renders every item, tracks the active index, navigates on click', async () => {
        const { wrapper } = mountHost([Thumbnail, Zoom, Video]);
        await openAndLoad(wrapper);

        const outer = query('.lg-outer')!;
        expect(outer.classList.contains('lg-has-thumb')).toBe(true);
        expect(outer.classList.contains('lg-animate-thumb')).toBe(true);
        expect(
            outer.classList.contains('lg-use-transition-for-zoom'),
        ).toBe(true);

        const thumbs = queryAll('.lg-thumb-item');
        expect(thumbs.length).toBe(3);
        expect(thumbs[0]!.classList.contains('active')).toBe(true);
        // The video item derives its thumb from img.youtube.com (2.x).
        expect(
            thumbs[2]!.querySelector('img')!.getAttribute('src'),
        ).toContain('img.youtube.com/vi/abc123xyz90');

        thumbs[1]!.click();
        await settle();
        await advance(500);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');
        expect(
            queryAll('.lg-thumb-item')[1]!.classList.contains('active'),
        ).toBe(true);
    });

    it('zoom: actual-size toggles committed scale, claims the seam, resets on navigation', async () => {
        const { wrapper } = mountHost([Thumbnail, Zoom, Video]);
        await openAndLoad(wrapper);
        const runtime = runtimeOf(wrapper);

        (query('.lg-actual-size') as HTMLButtonElement).click();
        await settle();

        const scaleEl = query(
            '.lg-item.lg-current .lg-zoom-scale',
        ) as HTMLElement;
        // jsdom has no image metrics -> actual-size falls back to scale 2.
        expect(scaleEl.style.transform).toBe('scale3d(2, 2, 1)');
        expect(query('.lg-outer')!.classList.contains('lg-zoomed')).toBe(
            true,
        );
        expect(runtime.gestureSeam.lockOwner).toBe('zoomSwipe');

        (query('.lg-actual-size') as HTMLButtonElement).click();
        await settle();
        expect(runtime.gestureSeam.lockOwner).toBeNull();
        expect(query('.lg-outer')!.classList.contains('lg-zoomed')).toBe(
            false,
        );

        // Zoom again, then navigate: the wrapper resets (2.x parity).
        (query('.lg-actual-size') as HTMLButtonElement).click();
        await settle();
        expect(runtime.gestureSeam.lockOwner).toBe('zoomSwipe');
        (
            wrapper.findComponent(LightGallery).vm as unknown as {
                nextSlide(): void;
            }
        ).nextSlide();
        await settle();
        await advance(500);
        expect(runtime.gestureSeam.lockOwner).toBeNull();
        expect(query('.lg-outer')!.classList.contains('lg-zoomed')).toBe(
            false,
        );
    });

    it('zoom: does not leak a tap into a phantom pinch (pointer ledger)', async () => {
        const { wrapper } = mountHost([Thumbnail, Zoom, Video]);
        await openAndLoad(wrapper);
        // Pointer interactions arm `enableZoomAfter` ms after the load.
        await advance(350);
        const panEl = query('.lg-item.lg-current .lg-zoom-pan')!;
        const scaleEl = query('.lg-item.lg-current .lg-zoom-scale')!;

        // A plain tap on the (unzoomed) slide: down + up, no gesture.
        firePointer(panEl, 'pointerdown', { x: 100, y: 100, pointerId: 11 });
        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 11 });

        // Next single finger must NOT read as a second pinch pointer.
        firePointer(panEl, 'pointerdown', { x: 200, y: 100, pointerId: 12 });
        firePointer(window, 'pointermove', { x: 260, y: 160, pointerId: 12 });
        // A leaked tap pointer would misroute this into a pinch and
        // scale the slide; the rendered rest transform must not change.
        expect(scaleEl.style.transform).toBe('scale3d(1, 1, 1)');
        firePointer(window, 'pointerup', { x: 260, y: 160, pointerId: 12 });
    });

    it('zoom: pans (not pinches) after a double-tap zoom', async () => {
        const { wrapper } = mountHost([Thumbnail, Zoom, Video]);
        await openAndLoad(wrapper);
        await advance(350);
        const img = query('img.lg-image[data-index="0"]')!;
        const scaleEl = query('.lg-item.lg-current .lg-zoom-scale')!;

        // Touch double-tap on the image zooms in (fallback scale 2).
        firePointer(img, 'pointerdown', { x: 50, y: 50, pointerId: 21 });
        firePointer(window, 'pointerup', { x: 50, y: 50, pointerId: 21 });
        vi.advanceTimersByTime(100);
        firePointer(img, 'pointerdown', { x: 50, y: 50, pointerId: 22 });
        firePointer(window, 'pointerup', { x: 50, y: 50, pointerId: 22 });
        expect(scaleEl.style.transform).toBe('scale3d(2, 2, 1)');

        // The next single finger pans — a leaked tap pointer would
        // misroute this into a pinch and change the scale.
        firePointer(img, 'pointerdown', { x: 60, y: 60, pointerId: 23 });
        firePointer(window, 'pointermove', { x: 120, y: 120, pointerId: 23 });
        expect(scaleEl.style.transform).toBe('scale3d(2, 2, 1)');
        firePointer(window, 'pointerup', { x: 120, y: 120, pointerId: 23 });
    });

    it('zoom: snaps a pinch release into [1, actual size] despite infiniteZoom', async () => {
        const { wrapper } = mountHost([Thumbnail, Zoom, Video]);
        await openAndLoad(wrapper);
        await advance(350);
        const panEl = query('.lg-item.lg-current .lg-zoom-pan')!;
        const scaleEl = query('.lg-item.lg-current .lg-zoom-scale')!;

        // Pinch far beyond the actual-size scale (jsdom fallback max: 2).
        firePointer(panEl, 'pointerdown', { x: 100, y: 100, pointerId: 41 });
        firePointer(panEl, 'pointerdown', { x: 200, y: 100, pointerId: 42 });
        firePointer(window, 'pointermove', { x: 500, y: 100, pointerId: 42 });
        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 41 });
        // 2.x pinch touchend rule: release lands on actual size even with
        // the infiniteZoom default.
        expect(scaleEl.style.transform).toBe('scale3d(2, 2, 1)');
        firePointer(window, 'pointerup', { x: 500, y: 100, pointerId: 42 });

        // Reset to the unzoomed state, then pinch inwards below fit and
        // release: back to scale 1. Starting from scale 1 guards the
        // commit-equals-previous-state path (the styles must still land).
        query('img.lg-image[data-index="0"]')!.dispatchEvent(
            new MouseEvent('dblclick', { bubbles: true }),
        );
        firePointer(panEl, 'pointerdown', { x: 100, y: 100, pointerId: 43 });
        firePointer(panEl, 'pointerdown', { x: 300, y: 100, pointerId: 44 });
        firePointer(window, 'pointermove', { x: 140, y: 100, pointerId: 44 });
        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 43 });
        expect(scaleEl.style.transform).toBe('scale3d(1, 1, 1)');
        firePointer(window, 'pointerup', { x: 140, y: 100, pointerId: 44 });
    });

    it('zoom: disables transitions during a pinch and settles on release', async () => {
        const { wrapper } = mountHost([Thumbnail, Zoom, Video]);
        await openAndLoad(wrapper);
        await advance(350);
        const panEl = query('.lg-item.lg-current .lg-zoom-pan')!;
        const scaleEl = query('.lg-item.lg-current .lg-zoom-scale')!;

        firePointer(panEl, 'pointerdown', { x: 100, y: 100, pointerId: 31 });
        firePointer(panEl, 'pointerdown', { x: 200, y: 100, pointerId: 32 });
        // Live pinch tracks 1:1 — no easing between finger positions.
        expect(panEl.style.transition).toBe('none');
        expect(scaleEl.style.transition).toBe('none');

        firePointer(window, 'pointerup', { x: 100, y: 100, pointerId: 31 });
        // Release snaps with the 2.x settle ease.
        expect(scaleEl.style.transition).toBe(
            'transform 0.8s cubic-bezier(0, 0, 0.25, 1)',
        );
        firePointer(window, 'pointerup', { x: 200, y: 100, pointerId: 32 });
    });

    it('zoom: projects a zoomed-pan release with 2.x momentum, clamped to bounds', async () => {
        const { wrapper } = mountHost([Thumbnail, Zoom, Video]);
        await openAndLoad(wrapper);
        // Pointer interactions arm `enableZoomAfter` ms after the load.
        await advance(350);

        // jsdom has no layout: stub the metrics the pan bounds derive
        // from. Image fitted at 400x300, natural 1600 → actual-size scale
        // 4; at that scale the pan bounds are ±600 x, ±450 y.
        const img = query('img.lg-image[data-index="0"]')!;
        Object.defineProperty(img, 'offsetWidth', { value: 400 });
        Object.defineProperty(img, 'offsetHeight', { value: 300 });
        Object.defineProperty(img, 'naturalWidth', { value: 1600 });
        const slide = img.closest<HTMLElement>('.lg-item')!;
        Object.defineProperty(slide, 'offsetWidth', { value: 400 });
        Object.defineProperty(slide, 'offsetHeight', { value: 300 });

        (query('.lg-actual-size') as HTMLButtonElement).click();
        await settle();
        const panEl = query('.lg-item.lg-current .lg-zoom-pan')!;
        expect(
            query('.lg-item.lg-current .lg-zoom-scale')!.style.transform,
        ).toBe('scale3d(4, 4, 1)');

        // 100px drag over 100ms: speed = 100/100 + 1 = 2 → the release
        // travels double the finger delta (2.x `touchendZoom`).
        firePointer(panEl, 'pointerdown', { x: 300, y: 100, pointerId: 61 });
        vi.advanceTimersByTime(100);
        firePointer(window, 'pointermove', { x: 200, y: 100, pointerId: 61 });
        firePointer(window, 'pointerup', { x: 200, y: 100, pointerId: 61 });
        expect(panEl.style.transform).toBe('translate3d(-200px, 0px, 0)');
        // The projected pan settles with the 2.x post-gesture ease.
        expect(panEl.style.transition).toBe(
            'transform 0.8s cubic-bezier(0, 0, 0.25, 1)',
        );

        // A flick (100px in 20ms) passes speed 2 and gains the extra step
        // (factor 7); the projection -200 + -700 clamps into the -600
        // bound instead of overshooting.
        firePointer(panEl, 'pointerdown', { x: 300, y: 100, pointerId: 62 });
        vi.advanceTimersByTime(20);
        firePointer(window, 'pointerup', { x: 200, y: 100, pointerId: 62 });
        expect(panEl.style.transform).toBe('translate3d(-600px, 0px, 0)');
    });

    it('video: renders the video slide, swaps poster for the player, pauses on leave', async () => {
        const { wrapper, log } = mountHost([Thumbnail, Zoom, Video]);
        await openAndLoad(wrapper, 2);
        await settle();

        const cont = query('.lg-item.lg-current .lg-video-cont')!;
        expect(cont.classList.contains('lg-has-youtube')).toBe(true);
        expect(log).toContain('hasVideo:2');
        const posterImg = cont.querySelector<HTMLImageElement>(
            'img.lg-video-poster',
        )!;
        expect(posterImg.getAttribute('src')).toContain(
            'img.youtube.com/vi/abc123xyz90/maxresdefault.jpg',
        );
        expect(cont.querySelector('iframe')).toBeNull();
        // Poster load marks the slide loaded (spinner + galleryOn).
        posterImg.dispatchEvent(new Event('load'));
        await settle();
        expect(
            query('.lg-item.lg-current')!.classList.contains('lg-complete'),
        ).toBe(true);

        // Poster click -> player swap + poster-click emit.
        (
            cont.querySelector('.lg-video-poster-wrap') as HTMLButtonElement
        ).click();
        await settle();
        expect(log).toContain('posterClick');
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
        (
            wrapper.findComponent(LightGallery).vm as unknown as {
                prevSlide(): void;
            }
        ).prevSlide();
        await settle();
        expect(postMessage).toHaveBeenCalledWith(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*',
        );
    });

    it('leak check: unmount while open releases timers, locks and DOM', async () => {
        const { wrapper } = mountHost([Thumbnail, Zoom, Video]);
        await openAndLoad(wrapper);
        const runtime = runtimeOf(wrapper);
        (query('.lg-actual-size') as HTMLButtonElement).click();
        await settle();
        expect(runtime.gestureSeam.lockOwner).toBe('zoomSwipe');

        wrapper.unmount();
        expect(query('.lg-container')).toBeNull();
        expect(runtime.gestureSeam.lockOwner).toBeNull();
        vi.runOnlyPendingTimers();
        expect(vi.getTimerCount()).toBe(0);
    });
});
