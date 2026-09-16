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
        .querySelector<HTMLImageElement>(`img.lg-image[data-index="${index}"]`)
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
        expect(query('.lg-outer')!.classList.contains('lg-show-autoplay')).toBe(
            true,
        );
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
        expect(query('.lg-outer')!.classList.contains('lg-show-autoplay')).toBe(
            false,
        );
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
        Object.defineProperty(document.documentElement, 'requestFullscreen', {
            value: request,
            configurable: true,
        });
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
        expect(query('.lg-container.lg-show')).toBeNull();
        expect(window.location.hash).toBe('');
        expect(document.body.classList.contains('lg-from-hash')).toBe(false);
    });

    it('hash: runs on the Navigation API driver with identical URLs', async () => {
        const calls: Array<[string, { history?: string }]> = [];
        const listeners = new Set<() => void>();
        const navigation = {
            currentEntry: { url: 'http://localhost/' },
            navigate: (url: string, options: { history?: string }) => {
                calls.push([url, options]);
                navigation.currentEntry = {
                    url: new URL(url, 'http://localhost/').href,
                };
                // The real API fires currententrychange for replaces
                // too — the handlers must be re-entrant-safe.
                listeners.forEach((listener) => listener());
                return {
                    committed: Promise.resolve(),
                    finished: Promise.resolve(),
                };
            },
            addEventListener: (type: string, listener: () => void) => {
                if (type === 'currententrychange') {
                    listeners.add(listener);
                }
            },
            removeEventListener: (_type: string, listener: () => void) => {
                listeners.delete(listener);
            },
        };
        Object.defineProperty(window, 'navigation', {
            value: navigation,
            configurable: true,
        });
        try {
            const { wrapper } = mountHost([
                {
                    ...Hash,
                    defaults: { ...Hash.defaults!, galleryId: 'nav-g' },
                },
            ]);
            await settle();
            (
                wrapper.findComponent(LightGallery).vm as unknown as {
                    openGallery(i?: number): void;
                }
            ).openGallery(0);
            await settle();
            await advance(450);

            const lastWrite = calls[calls.length - 1]!;
            expect(lastWrite[0]).toContain('#lg=nav-g&slide=0');
            expect(lastWrite[1]).toMatchObject({ history: 'replace' });

            // Back/forward: the entry changes → the gallery follows.
            navigation.currentEntry = {
                url: 'http://localhost/#lg=nav-g&slide=2',
            };
            listeners.forEach((listener) => listener());
            await settle();
            await advance(600);
            expect(query('.lg-counter-current')!.textContent!.trim()).toBe('3');
        } finally {
            delete (window as { navigation?: unknown }).navigation;
        }
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

        // The dropdown is the button's sibling inside the wrapper that
        // anchors it, so it hangs under the button.
        const shareOuter = query('.lg-toolbar .lg-share-outer')!;
        expect(shareOuter.querySelector(':scope > .lg-share')).not.toBeNull();
        expect(
            shareOuter.querySelector(':scope > .lg-dropdown'),
        ).not.toBeNull();

        const links = [
            ...document.querySelectorAll<HTMLAnchorElement>('.lg-dropdown a'),
        ];
        expect(links.length).toBe(3);
        expect(links[0]!.getAttribute('href')).toContain('facebook.com/sharer');
        expect(links[1]!.getAttribute('href')).toContain('x.com/intent/post');
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

    async function mountShareHost(shareCfg: Record<string, unknown>) {
        const ShareHost = defineComponent({
            components: { LightGallery },
            props: { shareCfg: { type: Object, required: true } },
            setup: () => ({ items: ITEMS, plugins: [Share] }),
            template: `
                <LightGallery
                    :slides="items"
                    :zoom-from-origin="false"
                    :plugins="plugins"
                    :share="shareCfg"
                />
            `,
        });
        const wrapper = mount(ShareHost, {
            props: { shareCfg },
            attachTo: document.body,
        });
        (
            wrapper.findComponent(LightGallery).vm as unknown as {
                openGallery(i?: number): void;
            }
        ).openGallery(0);
        await settle();
        await advance(450);
        return wrapper;
    }

    it('share: dropdown closes with the gallery', async () => {
        const { wrapper } = mountHost([Share]);
        await openAndLoad(wrapper);

        query('.lg-share')!.click();
        await settle();
        expect(
            query('.lg-outer')!.classList.contains('lg-dropdown-active'),
        ).toBe(true);

        // Closing with the dropdown open must not leave it open for the
        // next open.
        galleryVm(wrapper).closeGallery();
        await advance(600);
        await openAndLoad(wrapper);
        expect(
            query('.lg-outer')!.classList.contains('lg-dropdown-active'),
        ).toBe(false);
    });

    it('share: native sheet preferred when enabled and available', async () => {
        const share = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'share', {
            value: share,
            configurable: true,
        });
        try {
            await mountShareHost({ preferNativeShare: true });
            const button = query('.lg-share') as HTMLButtonElement;
            // Native-first buttons do not advertise a popup.
            expect(button.getAttribute('aria-haspopup')).toBeNull();
            button.click();
            await settle();
            expect(share).toHaveBeenCalledWith({
                url: window.location.href,
                title: 'a',
            });
            expect(
                query('.lg-outer')!.classList.contains('lg-dropdown-active'),
            ).toBe(false);
        } finally {
            delete (window.navigator as { share?: unknown }).share;
        }
    });

    it('share: dropdown kept when preferNativeShare is false', async () => {
        const share = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'share', {
            value: share,
            configurable: true,
        });
        try {
            await mountShareHost({ preferNativeShare: false });
            (query('.lg-share') as HTMLButtonElement).click();
            await settle();
            expect(share).not.toHaveBeenCalled();
            expect(
                query('.lg-outer')!.classList.contains('lg-dropdown-active'),
            ).toBe(true);
        } finally {
            delete (window.navigator as { share?: unknown }).share;
        }
    });

    it('share: canShare veto falls back to the dropdown', async () => {
        const share = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'share', {
            value: share,
            configurable: true,
        });
        Object.defineProperty(window.navigator, 'canShare', {
            value: () => false,
            configurable: true,
        });
        try {
            await mountShareHost({ preferNativeShare: true });
            (query('.lg-share') as HTMLButtonElement).click();
            await settle();
            expect(share).not.toHaveBeenCalled();
            expect(
                query('.lg-outer')!.classList.contains('lg-dropdown-active'),
            ).toBe(true);
        } finally {
            delete (window.navigator as { share?: unknown }).share;
            delete (window.navigator as { canShare?: unknown }).canShare;
        }
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
        expect(rotateEl.style.transform).toBe('rotate(90deg) scale3d(1, 1, 1)');
        await advance(500);
        expect(log).toContain('rotateRight:90');

        (query('.lg-flip-hor') as HTMLButtonElement).click();
        await settle();
        // At 90 deg the visual flip axis swaps (headless rule).
        expect(rotateEl.style.transform).toBe(
            'rotate(90deg) scale3d(1, -1, 1)',
        );
    });

    it('rotate: refits a landscape image into the stage at 90 degrees', async () => {
        const { wrapper } = mountHost([Rotate]);
        await openAndLoad(wrapper);

        const rotateEl = query('.lg-item.lg-current .lg-img-rotate')!;
        const image = rotateEl.querySelector<HTMLElement>('.lg-object')!;
        // Landscape image (921x614) fitted into a 1265x614 stage — its
        // 921px width runs vertically after a 90° rotation.
        Object.defineProperty(image, 'offsetWidth', { value: 921 });
        Object.defineProperty(image, 'offsetHeight', { value: 614 });
        Object.defineProperty(rotateEl, 'clientWidth', { value: 1265 });
        Object.defineProperty(rotateEl, 'clientHeight', { value: 614 });

        (query('.lg-rotate-right') as HTMLButtonElement).click();
        await settle();
        const scale = 614 / 921;
        expect(rotateEl.style.transform).toBe(
            `rotate(90deg) scale3d(${scale}, ${scale}, 1)`,
        );
        await advance(500);

        // Back at 180° the laid-out fit applies again: scale 1.
        (query('.lg-rotate-right') as HTMLButtonElement).click();
        await settle();
        expect(rotateEl.style.transform).toBe(
            'rotate(180deg) scale3d(1, 1, 1)',
        );
        await advance(500);
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

    it('media position: reserves the toolbar, caption and thumbnail strip', async () => {
        // jsdom has no layout: give the bars real-looking heights.
        const heights = vi
            .spyOn(Element.prototype, 'clientHeight', 'get')
            .mockImplementation(function (this: Element) {
                if (this.classList.contains('lg-toolbar')) return 40;
                if (this.classList.contains('lg-thumb-outer')) return 100;
                // A caption only takes space once it has content.
                if (this.classList.contains('lg-sub-html')) {
                    return this.textContent?.trim() ? 30 : 0;
                }
                return 0;
            });
        try {
            const { wrapper } = mountHost([Thumbnail]);
            await openAndLoad(wrapper);
            const content = query('.lg-content') as HTMLElement;
            expect(content.style.top).toBe('40px');
            expect(content.style.bottom).toBe('130px');
        } finally {
            heights.mockRestore();
        }
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

describe('plugin label strings (core alias)', () => {
    it('resolves labels from core strings, legacy plugin strings winning', async () => {
        const StringsHost = defineComponent({
            components: { LightGallery },
            setup: () => ({
                items: ITEMS,
                plugins: [Autoplay, Share],
                strings: { toggleAutoplay: 'Diaporama', share: 'Partager' },
                autoplay: {
                    autoplayPluginStrings: {
                        toggleAutoplay: 'Legacy autoplay',
                    },
                },
            }),
            template: `
                <LightGallery
                    :slides="items"
                    :zoom-from-origin="false"
                    :plugins="plugins"
                    :strings="strings"
                    :autoplay="autoplay"
                />
            `,
        });
        const wrapper = mount(StringsHost, { attachTo: document.body });
        await openAndLoad(wrapper);
        // The deprecated per-plugin alias wins where explicitly set…
        expect(query('.lg-autoplay-button')?.getAttribute('aria-label')).toBe(
            'Legacy autoplay',
        );
        // …and the core strings drive every other plugin label.
        expect(query('.lg-share')?.getAttribute('aria-label')).toBe('Partager');
    });
});
