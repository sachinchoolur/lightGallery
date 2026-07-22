import { createSSRApp, defineComponent, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import LightGallery from './LightGallery.vue';
import LgItem from './LgItem.vue';
import Thumbnail from './plugins/thumbnail';
import Zoom from './plugins/zoom';
import type { LgGalleryItem } from './types';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'a', caption: 'A' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'b', caption: 'B' },
];

/**
 * The Nuxt/SSR consumer story in one test: the server HTML produced by
 * `vue/server-renderer` must hydrate warning-free (Vue logs hydration
 * mismatches through console.error/warn), and the hydrated gallery must
 * open client-side. This is the framework-level contract a Nuxt page
 * relies on; a live Nuxt app exercises the same two steps.
 */
describe('hydration', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('hydrates server markup without mismatch warnings and opens', async () => {
        const Host = defineComponent({
            setup: () => ({ items: ITEMS, plugins: [Thumbnail, Zoom] }),
            render() {
                return h(
                    LightGallery,
                    {
                        slides: undefined,
                        plugins: this.plugins,
                        zoomFromOrigin: false,
                    },
                    {
                        default: () =>
                            this.items.map((item) =>
                                h(
                                    LgItem,
                                    { item, key: item.src, class: 'trigger' },
                                    {
                                        default: () =>
                                            h('img', {
                                                src: item.thumb,
                                                alt: item.alt,
                                            }),
                                    },
                                ),
                            ),
                    },
                );
            },
        });

        const serverHtml = await renderToString(createSSRApp(Host));
        const root = document.createElement('div');
        root.innerHTML = serverHtml;
        document.body.appendChild(root);

        const warn = vi.spyOn(console, 'warn');
        const error = vi.spyOn(console, 'error');
        const app = createSSRApp(Host);
        app.mount(root);
        await nextTick();

        const hydrationMessages = [...warn.mock.calls, ...error.mock.calls]
            .flat()
            .filter(
                (arg) =>
                    typeof arg === 'string' &&
                    arg.toLowerCase().includes('hydrat'),
            );
        expect(hydrationMessages).toEqual([]);

        // The hydrated trigger opens the gallery client-side.
        root.querySelector<HTMLAnchorElement>('.trigger')!.click();
        await nextTick();
        await nextTick();
        expect(document.querySelector('.lg-container')).not.toBeNull();

        app.unmount();
    });
});
