import { enableAutoUnmount, mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { axe } from 'vitest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LightGallery from './LightGallery.vue';
import LgItem from './LgItem.vue';
import type { LgGalleryItem } from './types';
import Autoplay from './plugins/autoplay';
import Pager from './plugins/pager';
import Rotate from './plugins/rotate';
import Share from './plugins/share';
import Thumbnail from './plugins/thumbnail';
import Video from './plugins/video';
import Zoom from './plugins/zoom';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'a', caption: 'Caption A' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'b' },
    { src: 'c.jpg', thumb: 'c-t.jpg', alt: 'c' },
];

function query(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}

async function settle(): Promise<void> {
    for (let i = 0; i < 3; i++) {
        await nextTick();
    }
}

enableAutoUnmount(afterEach);

afterEach(() => {
    document.body.innerHTML = '';
});

describe('accessibility', () => {
    describe('with fake timers', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });
        afterEach(() => {
            vi.runOnlyPendingTimers();
            vi.useRealTimers();
        });

        async function advance(ms: number): Promise<void> {
            vi.advanceTimersByTime(ms);
            await nextTick();
        }

        it('has dialog semantics with an accessible name (and labelledby override)', async () => {
            const Host = defineComponent({
                components: { LightGallery },
                props: { labelledby: { type: String, default: undefined } },
                setup: () => ({ items: ITEMS }),
                template: `
                    <LightGallery
                        :slides="items"
                        :zoom-from-origin="false"
                        :aria-labelledby="labelledby"
                    />
                    <h2 id="gallery-heading">My photos</h2>
                `,
            });
            const wrapper = mount(Host, { attachTo: document.body });
            (
                wrapper.findComponent(LightGallery).vm as unknown as {
                    openGallery(i?: number): void;
                }
            ).openGallery(0);
            await settle();

            const dialog = query('.lg-container')!;
            expect(dialog.getAttribute('role')).toBe('dialog');
            expect(dialog.getAttribute('aria-modal')).toBe('true');
            expect(dialog.getAttribute('aria-label')).toBe('Gallery');

            await wrapper.setProps({ labelledby: 'gallery-heading' });
            await settle();
            expect(dialog.getAttribute('aria-label')).toBeNull();
            expect(dialog.getAttribute('aria-labelledby')).toBe(
                'gallery-heading',
            );
        });

        it('moves focus in, traps Tab, and returns focus to the trigger', async () => {
            const Host = defineComponent({
                components: { LightGallery, LgItem },
                setup: () => ({ items: ITEMS }),
                template: `
                    <LightGallery :zoom-from-origin="false">
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
            const wrapper = mount(Host, { attachTo: document.body });
            const trigger =
                document.querySelector<HTMLAnchorElement>('.trigger')!;
            trigger.focus();
            trigger.click();
            await settle();

            const dialog = query('.lg-container')!;
            expect(document.activeElement).toBe(dialog);

            // Tab from the last focusable wraps to the first.
            const focusable = [
                ...dialog.querySelectorAll<HTMLElement>('button, a[href]'),
            ];
            focusable[focusable.length - 1]!.focus();
            document.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Tab' }),
            );
            await nextTick();
            expect(document.activeElement).toBe(focusable[0]);
            // Shift+Tab from the first wraps to the last.
            document.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Tab',
                    shiftKey: true,
                }),
            );
            await nextTick();
            expect(document.activeElement).toBe(
                focusable[focusable.length - 1],
            );

            document.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Escape' }),
            );
            await settle();
            await advance(450);
            expect(query('.lg-container')).toBeNull();
            expect(document.activeElement).toBe(trigger);
            wrapper.unmount();
        });

        it('collapses every animation under prefers-reduced-motion', async () => {
            const originalMatchMedia = window.matchMedia;
            window.matchMedia = ((mediaQuery: string) => ({
                matches: mediaQuery.includes('prefers-reduced-motion'),
                media: mediaQuery,
                addEventListener: () => undefined,
                removeEventListener: () => undefined,
                addListener: () => undefined,
                removeListener: () => undefined,
                onchange: null,
                dispatchEvent: () => false,
            })) as typeof window.matchMedia;
            try {
                const Host = defineComponent({
                    components: { LightGallery },
                    setup: () => ({ items: ITEMS }),
                    template: `
                        <LightGallery :slides="items" :loop="false" />
                    `,
                });
                const wrapper = mount(Host, { attachTo: document.body });
                const vm = wrapper.findComponent(LightGallery)
                    .vm as unknown as {
                    openGallery(i?: number): void;
                    nextSlide(): void;
                    goToSlide(i: number): void;
                };
                vm.openGallery(0);
                await settle();
                // backdropDuration collapsed to 0: visible at +10ms.
                await advance(10);
                const outer = query('.lg-outer')!;
                expect(outer.classList.contains('lg-visible')).toBe(true);
                // slide-end bounce disabled.
                vm.goToSlide(2);
                await settle();
                vm.nextSlide();
                await settle();
                expect(outer.classList.contains('lg-right-end')).toBe(
                    false,
                );
                wrapper.unmount();
            } finally {
                window.matchMedia = originalMatchMedia;
            }
        });
    });

    describe('with real timers (axe)', () => {
        it('has zero detectable WCAG A/AA violations with plugins enabled', async () => {
            const Host = defineComponent({
                components: { LightGallery },
                setup: () => ({
                    items: ITEMS,
                    plugins: [
                        Thumbnail,
                        Zoom,
                        Video,
                        Autoplay,
                        Pager,
                        Share,
                        Rotate,
                    ],
                }),
                template: `
                    <LightGallery
                        :slides="items"
                        :zoom-from-origin="false"
                        :plugins="plugins"
                        :speed="0"
                        :backdrop-duration="0"
                        :zoom="{ showZoomInOutIcons: true }"
                    />
                `,
            });
            const wrapper = mount(Host, { attachTo: document.body });
            (
                wrapper.findComponent(LightGallery).vm as unknown as {
                    openGallery(i?: number): void;
                }
            ).openGallery(0);
            await settle();
            await new Promise((resolve) => setTimeout(resolve, 150));
            await settle();
            document
                .querySelector<HTMLImageElement>('img.lg-image')
                ?.dispatchEvent(new Event('load'));
            await settle();

            const results = await axe(query('.lg-container')!, {
                runOnly: {
                    type: 'tag',
                    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
                },
                // jsdom has no canvas; contrast is a browser check.
                rules: { 'color-contrast': { enabled: false } },
            });
            expect(results.violations).toEqual([]);
            wrapper.unmount();
        }, 20000);
    });
});
