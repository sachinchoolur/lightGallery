import { enableAutoUnmount, mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LightGallery from './LightGallery.vue';
import { LG_RUNTIME, type LgGalleryRuntime } from './runtime';
import type { LgGalleryItem } from './types';
import Autoplay from './plugins/autoplay';
import Comment from './plugins/comment';
import Fullscreen from './plugins/fullscreen';
import Hash from './plugins/hash';
import MediumZoom from './plugins/mediumZoom';
import Pager from './plugins/pager';
import RelativeCaption from './plugins/relativeCaption';
import Rotate from './plugins/rotate';
import Share from './plugins/share';
import Thumbnail from './plugins/thumbnail';
import Video from './plugins/video';
import VimeoThumbnail from './plugins/vimeoThumbnail';
import Zoom from './plugins/zoom';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'a', caption: 'Caption A' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'b', caption: 'Caption B' },
    { src: 'c.jpg', thumb: 'c-t.jpg', alt: 'c', caption: 'Caption C' },
];

function query(selector: string): HTMLElement | null {
    return document.querySelector(selector);
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
            :enable-swipe="true"
            :enable-drag="true"
            :autoplay="{ slideShowInterval: 100 }"
            @autoplay-start="log.push('autoplayStart')"
            @autoplay="log.push('autoplay:' + $event.index)"
            @autoplay-stop="log.push('autoplayStop')"
            @rotate-right="log.push('rotateRight:' + $event.rotate)"
        >
            <template #comments="{ item, index }">
                <p class="test-comments">{{ item?.alt }} ({{ index }})</p>
            </template>
        </LightGallery>
    `,
});

function mountHost(plugins: readonly unknown[]): {
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

function galleryVm(wrapper: ReturnType<typeof mount>): {
    nextSlide(): void;
    prevSlide(): void;
    closeGallery(): void;
} {
    return wrapper.findComponent(LightGallery).vm as never;
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
    window.location.hash = '';
});

describe('wave-2 plugins', () => {
    it('autoplay: toggle starts/stops the slideshow and advances slides', async () => {
        const { wrapper, log } = mountHost([Autoplay]);
        await openAndLoad(wrapper);

        expect(query('.lg-progress-bar')).not.toBeNull();
        (query('.lg-autoplay-button') as HTMLButtonElement).click();
        await settle();
        expect(
            query('.lg-outer')!.classList.contains('lg-show-autoplay'),
        ).toBe(true);
        expect(log).toContain('autoplayStart');

        // speed(400) + interval(100) later the show advances.
        await advance(500);
        await settle();
        expect(log).toContain('autoplay:1');
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');

        await advance(600);
        (query('.lg-autoplay-button') as HTMLButtonElement).click();
        await settle();
        expect(log).toContain('autoplayStop');
        expect(
            query('.lg-outer')!.classList.contains('lg-show-autoplay'),
        ).toBe(false);
    });

    it('fullscreen: no-ops without the API, toggles via it when present', async () => {
        // jsdom reports no Fullscreen API -> no-op (no button).
        const { wrapper: bare } = mountHost([Fullscreen]);
        await openAndLoad(bare);
        expect(query('.lg-fullscreen')).toBeNull();
        bare.unmount();
        document.body.innerHTML = '';

        // Feature detection is a mount-time check (non-reactive, sibling
        // parity): define the API before mounting.
        Object.defineProperty(document, 'fullscreenEnabled', {
            value: true,
            configurable: true,
        });
        const request = vi.fn(() => Promise.resolve());
        Object.defineProperty(
            document.documentElement,
            'requestFullscreen',
            { value: request, configurable: true },
        );
        try {
            const { wrapper } = mountHost([Fullscreen]);
            await openAndLoad(wrapper);
            const button = query('.lg-fullscreen') as HTMLButtonElement;
            expect(button).not.toBeNull();
            button.click();
            expect(request).toHaveBeenCalled();
        } finally {
            Reflect.deleteProperty(document, 'fullscreenEnabled');
            Reflect.deleteProperty(
                document.documentElement,
                'requestFullscreen',
            );
        }
    });

    it('hash: opens from a deep link, writes and restores the hash', async () => {
        window.location.hash = '#lg=test-g&slide=1';
        const { wrapper } = mountHost([
            { ...Hash, defaults: { ...Hash.defaults!, galleryId: 'test-g' } },
        ]);
        await settle();
        expect(query('.lg-container')).toBeNull();

        // The setup watcher's deep-link timer opens at slide 1.
        await advance(150);
        await settle();
        await advance(450);
        expect(query('.lg-container')).not.toBeNull();
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');
        expect(document.body.classList.contains('lg-from-hash')).toBe(true);
        expect(window.location.hash).toBe('#lg=test-g&slide=1');

        galleryVm(wrapper).closeGallery();
        await settle();
        await advance(450);
        expect(query('.lg-container')).toBeNull();
        expect(window.location.hash).toBe('');
        expect(document.body.classList.contains('lg-from-hash')).toBe(
            false,
        );
    });

    it('pager: renders dots, tracks active, navigates on click', async () => {
        const { wrapper } = mountHost([Pager]);
        await openAndLoad(wrapper);

        const dots = [
            ...document.querySelectorAll<HTMLElement>('.lg-pager-cont'),
        ];
        expect(dots.length).toBe(3);
        expect(dots[0]!.classList.contains('lg-pager-active')).toBe(true);
        dots[2]!.click();
        await settle();
        await advance(500);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('3');
    });

    it('share: dropdown links from the headless builders, toggle + overlay close', async () => {
        const { wrapper } = mountHost([Share]);
        await openAndLoad(wrapper);

        const links = [
            ...document.querySelectorAll<HTMLAnchorElement>(
                '.lg-dropdown a',
            ),
        ];
        expect(links.length).toBe(3);
        expect(links[0]!.getAttribute('href')).toContain(
            'facebook.com/sharer',
        );
        expect(links[1]!.getAttribute('href')).toContain(
            'twitter.com/intent/tweet',
        );
        expect(links[2]!.getAttribute('href')).toContain(
            'pinterest.com/pin/create',
        );

        (query('.lg-share') as HTMLButtonElement).click();
        await settle();
        expect(
            query('.lg-outer')!.classList.contains('lg-dropdown-active'),
        ).toBe(true);
        (query('.lg-dropdown-overlay') as HTMLElement).click();
        await settle();
        expect(
            query('.lg-outer')!.classList.contains('lg-dropdown-active'),
        ).toBe(false);
    });

    it('rotate: composes inside zoom, rotates/flips, fires public events', async () => {
        const { wrapper, log } = mountHost([Zoom, Rotate]);
        await openAndLoad(wrapper);

        // Zoom outermost, rotate inside (2.x DOM order).
        const pan = query('.lg-item.lg-current .lg-zoom-pan')!;
        const rotateEl = pan.querySelector<HTMLElement>('.lg-img-rotate')!;
        expect(rotateEl).not.toBeNull();
        expect(rotateEl.querySelector('img.lg-image')).not.toBeNull();

        (query('.lg-rotate-right') as HTMLButtonElement).click();
        await settle();
        expect(rotateEl.style.transform).toBe(
            'rotate(90deg) scale3d(1, 1, 1)',
        );
        await advance(500);
        expect(log).toContain('rotateRight:90');

        (query('.lg-flip-hor') as HTMLButtonElement).click();
        await settle();
        // At 90 deg the visual flip axis swaps (headless rule).
        expect(rotateEl.style.transform).toBe(
            'rotate(90deg) scale3d(1, -1, 1)',
        );
    });

    it('comment: renders the #comments gallery slot, toggles the panel', async () => {
        const { wrapper } = mountHost([
            {
                ...Comment,
                defaults: { ...Comment.defaults!, commentBox: true },
            },
        ]);
        await openAndLoad(wrapper);

        expect(query('.lg-comment-box .test-comments')!.textContent).toBe(
            'a (0)',
        );
        (query('.lg-comment-toggle') as HTMLButtonElement).click();
        await settle();
        expect(
            query('.lg-outer')!.classList.contains('lg-comment-active'),
        ).toBe(true);
        (query('.lg-comment-overlay') as HTMLElement).click();
        await settle();
        expect(
            query('.lg-outer')!.classList.contains('lg-comment-active'),
        ).toBe(false);
    });

    it('mediumZoom: presets strip the chrome, margin overrides media position', async () => {
        const { wrapper } = mountHost([MediumZoom]);
        await openAndLoad(wrapper);

        const outer = query('.lg-outer')!;
        expect(outer.classList.contains('lg-medium-zoom')).toBe(true);
        // Presets below user settings: chrome off.
        expect(query('.lg-prev')).toBeNull();
        expect(query('.lg-counter')).toBeNull();
        expect(query('.lg-close')).toBeNull();
        // overrideMediaPosition drives the content offsets.
        const content = query('.lg-content') as HTMLElement;
        expect(content.style.top).toBe('40px');
        expect(content.style.bottom).toBe('40px');
    });

    it('relativeCaption: forces slide captions and marks the outer element', async () => {
        const { wrapper } = mountHost([RelativeCaption]);
        await openAndLoad(wrapper);

        expect(
            query('.lg-outer')!.classList.contains('lg-relative-caption'),
        ).toBe(true);
        // captionPosition preset 'slide': the caption lives in the slide.
        expect(query('.lg-item.lg-current .lg-sub-html')).not.toBeNull();
        expect(query('.lg-components .lg-sub-html')).toBeNull();
    });

    it('vimeoThumbnail: fetches oEmbed thumbs through transformItems', async () => {
        const fetchMock = vi.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        thumbnail_url: 'https://i.vimeocdn.com/video/x.jpg',
                    }),
            }),
        );
        vi.stubGlobal('fetch', fetchMock);
        const items = [
            ...ITEMS,
            { src: 'https://vimeo.com/112836958', alt: 'vimeo' },
        ];
        const HostWithVimeo = defineComponent({
            components: { LightGallery },
            setup: () => ({ items, plugins: [VimeoThumbnail] }),
            template: `
                <LightGallery
                    :slides="items"
                    :zoom-from-origin="false"
                    :plugins="plugins"
                />
            `,
        });
        const wrapper = mount(HostWithVimeo, { attachTo: document.body });
        await settle();
        for (let i = 0; i < 6; i++) {
            await Promise.resolve();
        }
        await settle();

        const runtime = runtimeOf(wrapper);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(runtime.items.value[3]!.thumb).toBe(
            'https://i.vimeocdn.com/video/x.jpg',
        );
        expect(runtime.items.value[0]!.thumb).toBe('a-t.jpg');
        vi.unstubAllGlobals();
    });

    it('all 13 plugins compose without conflict and tear down clean', async () => {
        const CommentsHost = defineComponent({
            components: { LightGallery },
            setup: () => ({
                items: ITEMS,
                plugins: [
                    Thumbnail,
                    Zoom,
                    Video,
                    Autoplay,
                    Fullscreen,
                    {
                        ...Hash,
                        defaults: {
                            ...Hash.defaults!,
                            galleryId: 'all13',
                        },
                    },
                    Pager,
                    Share,
                    Rotate,
                    {
                        ...Comment,
                        defaults: {
                            ...Comment.defaults!,
                            commentBox: true,
                        },
                    },
                    MediumZoom,
                    RelativeCaption,
                    VimeoThumbnail,
                ],
            }),
            render() {
                return h(
                    LightGallery,
                    {
                        slides: this.items,
                        zoomFromOrigin: false,
                        plugins: this.plugins as never,
                    },
                    {
                        comments: ({ item }: { item?: LgGalleryItem }) =>
                            h('p', { class: 'test-comments' }, item?.alt),
                    },
                );
            },
        });
        const wrapper = mount(CommentsHost, { attachTo: document.body });
        await settle();
        (
            wrapper.findComponent(LightGallery).vm as unknown as {
                openGallery(i?: number): void;
            }
        ).openGallery(0);
        await settle();
        await advance(450);
        document
            .querySelector<HTMLImageElement>('img.lg-image[data-index="0"]')
            ?.dispatchEvent(new Event('load'));
        await settle();

        const outer = query('.lg-outer')!;
        expect(outer.classList.contains('lg-has-thumb')).toBe(true);
        expect(outer.classList.contains('lg-medium-zoom')).toBe(true);
        expect(outer.classList.contains('lg-relative-caption')).toBe(true);
        expect(query('.lg-thumb-outer')).not.toBeNull();
        expect(query('.lg-pager-outer')).not.toBeNull();
        expect(query('.lg-progress-bar')).not.toBeNull();
        expect(query('.lg-comment-box')).not.toBeNull();
        // Wrapper chain: zoom outermost, rotate inside.
        expect(
            query('.lg-item.lg-current .lg-zoom-pan .lg-img-rotate'),
        ).not.toBeNull();

        const runtime = runtimeOf(wrapper);
        wrapper.unmount();
        expect(query('.lg-container')).toBeNull();
        expect(runtime.gestureSeam.lockOwner).toBeNull();
        vi.runOnlyPendingTimers();
        expect(vi.getTimerCount()).toBe(0);
    });
});
