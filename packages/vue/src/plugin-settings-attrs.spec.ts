import { enableAutoUnmount, mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LightGallery from './LightGallery.vue';
import type { LgGalleryItem } from './types';
import Hash from './plugins/hash';
import MediumZoom from './plugins/mediumZoom';
import Thumbnail from './plugins/thumbnail';
import Video from './plugins/video';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'a' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'b' },
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

function galleryVm(wrapper: ReturnType<typeof mount>): {
    openGallery(i?: number): void;
    nextSlide(): void;
} {
    return wrapper.findComponent(LightGallery).vm as never;
}

async function openAndLoad(wrapper: ReturnType<typeof mount>): Promise<void> {
    galleryVm(wrapper).openGallery(0);
    await settle();
    await advance(450);
    document
        .querySelector<HTMLImageElement>('img.lg-image[data-index="0"]')
        ?.dispatchEvent(new Event('load'));
    await settle();
}

/** A host whose template passes the mediumZoom settings as written. */
function mediumZoomHost(attribute: string) {
    return defineComponent({
        components: { LightGallery },
        props: { margin: { type: Number, default: 24 } },
        setup: () => ({ items: ITEMS, plugins: [MediumZoom] }),
        template: `
            <LightGallery
                :slides="items"
                :zoom-from-origin="false"
                :plugins="plugins"
                ${attribute}="{ margin }"
            />
        `,
    });
}

function contentOffsets(): { top: string; bottom: string } {
    const content = query('.lg-content') as HTMLElement;
    return { top: content.style.top, bottom: content.style.bottom };
}

enableAutoUnmount(afterEach);

beforeEach(() => {
    vi.useFakeTimers();
});
afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
    window.location.hash = '';
});

describe('plugin settings attributes', () => {
    it('reads a multi-word plugin name written in kebab-case', async () => {
        const wrapper = mount(mediumZoomHost(':medium-zoom'), {
            attachTo: document.body,
        });
        await openAndLoad(wrapper);

        expect(contentOffsets()).toEqual({ top: '24px', bottom: '24px' });
    });

    it('reads a multi-word plugin name written in camelCase', async () => {
        const wrapper = mount(mediumZoomHost(':mediumZoom'), {
            attachTo: document.body,
        });
        await openAndLoad(wrapper);

        expect(contentOffsets()).toEqual({ top: '24px', bottom: '24px' });
    });

    it('reads a kebab-case key passed through a render function', async () => {
        const wrapper = mount(
            defineComponent({
                render: () =>
                    h(LightGallery, {
                        slides: ITEMS,
                        zoomFromOrigin: false,
                        plugins: [MediumZoom],
                        'medium-zoom': { margin: 24 },
                    }),
            }),
            { attachTo: document.body },
        );
        await openAndLoad(wrapper);

        expect(contentOffsets()).toEqual({ top: '24px', bottom: '24px' });
    });

    it('follows a kebab-case attribute when its value changes', async () => {
        const wrapper = mount(mediumZoomHost(':medium-zoom'), {
            attachTo: document.body,
        });

        // The media position is measured on open, so change it first.
        await wrapper.setProps({ margin: 8 });
        await openAndLoad(wrapper);

        expect(contentOffsets()).toEqual({ top: '8px', bottom: '8px' });
    });

    it('prefers the camelCase attribute when both spellings are passed', async () => {
        const wrapper = mount(
            defineComponent({
                render: () =>
                    h(LightGallery, {
                        slides: ITEMS,
                        zoomFromOrigin: false,
                        plugins: [MediumZoom],
                        'medium-zoom': { margin: 8 },
                        mediumZoom: { margin: 24 },
                    }),
            }),
            { attachTo: document.body },
        );
        await openAndLoad(wrapper);

        expect(contentOffsets()).toEqual({ top: '24px', bottom: '24px' });
    });

    it('raises no Vue warning for plugin settings attributes', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mount(
            defineComponent({
                components: { LightGallery },
                setup: () => ({
                    items: ITEMS,
                    plugins: [Thumbnail, Hash, Video, MediumZoom],
                }),
                template: `
                    <LightGallery
                        :slides="items"
                        :zoom-from-origin="false"
                        :plugins="plugins"
                        :thumbnail="{ thumbWidth: 80 }"
                        :hash="{ galleryId: 'attrs' }"
                        :video="{ autoplayFirstVideo: false }"
                        :medium-zoom="{ margin: 24 }"
                    />
                `,
            }),
            { attachTo: document.body },
        );
        await openAndLoad(wrapper);
        // A re-render after the first one: the warning is per render.
        galleryVm(wrapper).nextSlide();
        await settle();
        await advance(450);

        const vueWarnings = warn.mock.calls
            .map((call) => String(call[0]))
            .filter((message) => message.includes('[Vue warn]'));
        expect(vueWarnings).toEqual([]);
    });
});
