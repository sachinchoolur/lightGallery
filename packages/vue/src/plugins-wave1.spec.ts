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
