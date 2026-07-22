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

    it('server-renders nothing for the overlay even when open initially', async () => {
        // Opening is a client-side phase transition (post-flush watcher +
        // rAF timeline) — on the server `open: true` must not teleport or
        // touch document/window; the client opens after hydration.
        const app = createSSRApp({
            render: () =>
                h(
                    LightGallery,
                    { slides: ITEMS, open: true, index: 1 },
                    {
                        default: () =>
                            h('a', { class: 'ssr-trigger' }, 'open me'),
                    },
                ),
        });
        const teleports: Record<string, string> = {};
        const html = await renderToString(app, { teleports });
        expect(html).toContain('ssr-trigger');
        expect(html).not.toContain('lg-container');
        expect(Object.values(teleports).join('')).not.toContain(
            'lg-container',
        );
    });

    it('imports every entry at module scope without browser globals', async () => {
        // This file runs in a bare Node environment — any module-scope
        // window/document access in an entry throws here.
        const entries = await Promise.all([
            import('./index'),
            import('./plugins/thumbnail'),
            import('./plugins/zoom'),
            import('./plugins/video'),
            import('./plugins/autoplay'),
            import('./plugins/fullscreen'),
            import('./plugins/hash'),
            import('./plugins/pager'),
            import('./plugins/share'),
            import('./plugins/rotate'),
            import('./plugins/comment'),
            import('./plugins/mediumZoom'),
            import('./plugins/relativeCaption'),
            import('./plugins/vimeoThumbnail'),
        ]);
        const [index, ...plugins] = entries;
        expect(index).toHaveProperty('LightGallery');
        for (const plugin of plugins) {
            expect(plugin.default).toHaveProperty('name');
        }
    });
});
