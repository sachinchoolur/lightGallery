// @vitest-environment node
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';

import LightGallery from './LightGallery.vue';
import type { LgGalleryItem } from './types';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', alt: 'First slide' },
    { src: 'b.jpg', alt: 'Second slide' },
];

/**
 * SSR rule (ADR §7): the closed gallery renders only its default slot
 * (triggers) on the server — the Teleport body is `v-if`-gated on open
 * state, so nothing teleports and there is no SSR mismatch surface.
 */
describe('SSR (vue/server-renderer)', () => {
    it('server-renders the closed gallery without browser globals', async () => {
        const app = createSSRApp({
            render: () =>
                h(
                    LightGallery,
                    { slides: ITEMS },
                    {
                        default: () =>
                            h('a', { class: 'ssr-trigger' }, 'open me'),
                    },
                ),
        });
        const html = await renderToString(app);
        expect(html).toContain('ssr-trigger');
        expect(html).not.toContain('lg-container');
    });
});
