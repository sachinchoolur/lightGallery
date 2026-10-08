import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';

import { LightGallery } from './index';
import Autoplay from './plugins/autoplay';
import Comment from './plugins/comment';

enableAutoUnmount(afterEach);

const slides = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'A' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'B' },
];

const svg = (id: string) =>
    h('svg', { 'data-lg-test': id, viewBox: '0 0 24 24' }, [
        h('path', { d: 'M0 0h24v24H0z' }),
    ]);

async function settle(): Promise<void> {
    for (let i = 0; i < 3; i++) {
        await nextTick();
    }
}

async function mountOpen(extraProps: Record<string, unknown>) {
    const wrapper = mount(LightGallery, {
        props: { slides, ...extraProps } as never,
        attachTo: document.body,
    });
    (
        wrapper.vm as unknown as { openGallery(i?: number): void }
    ).openGallery(0);
    await settle();
    return wrapper;
}

describe('custom icons (:icons prop)', () => {
    it('renders provided icons (component and raw string alike)', async () => {
        await mountOpen({
            icons: {
                close: () => svg('close'),
                prev: '<svg data-lg-test="prev-raw"></svg>',
            },
        });
        const close = document.querySelector('.lg-close')!;
        expect(close.classList.contains('lg-icon-custom')).toBe(true);
        expect(
            close.querySelector('.lg-ci-close [data-lg-test="close"]'),
        ).not.toBeNull();
        const prev = document.querySelector('.lg-prev')!;
        expect(prev.classList.contains('lg-icon-custom')).toBe(true);
        expect(
            prev.querySelector('.lg-ci-prev [data-lg-test="prev-raw"]'),
        ).not.toBeNull();
        // Un-answered names render the built-in default SVG.
        const next = document.querySelector('.lg-next')!;
        expect(next.classList.contains('lg-icon-custom')).toBe(true);
        expect(next.querySelector('.lg-ci-next svg')).not.toBeNull();
        expect(next.querySelector('[data-lg-test]')).toBeNull();
    });

    it('renders both icons of a state pair and skips half pairs', async () => {
        await mountOpen({
            plugins: [Autoplay],
            icons: {
                autoplayPlay: () => svg('play'),
                autoplayPause: () => svg('pause'),
                // fullscreen half pair must not apply anywhere.
                fullscreen: () => svg('fs'),
            },
        });
        const button = document.querySelector('.lg-autoplay-button')!;
        expect(button.classList.contains('lg-icon-custom')).toBe(true);
        expect(
            button.querySelector('.lg-ci-autoplay-play [data-lg-test="play"]'),
        ).not.toBeNull();
        expect(
            button.querySelector(
                '.lg-ci-autoplay-pause [data-lg-test="pause"]',
            ),
        ).not.toBeNull();
    });

    it('covers the comment plugin buttons with defaults', async () => {
        await mountOpen({
            plugins: [Comment],
            comment: { commentBox: true },
        });
        expect(
            document.querySelector(
                '.lg-comment-toggle.lg-icon-custom .lg-ci-comment svg',
            ),
        ).not.toBeNull();
        expect(
            document.querySelector(
                '.lg-comment-close.lg-icon-custom .lg-ci-comment-close svg',
            ),
        ).not.toBeNull();
    });
});
