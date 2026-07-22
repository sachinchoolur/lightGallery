import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import LightGallery from './LightGallery.vue';
import type { LgGalleryItem } from './LightGallery.vue';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', alt: 'a' },
    { src: 'b.jpg', alt: 'b' },
    { src: 'c.jpg', alt: 'c' },
];

function query(selector: string): HTMLElement | null {
    // Teleport renders into document.body, outside the wrapper.
    return document.querySelector(selector);
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('LightGallery (ADR spike)', () => {
    it('opens into a Teleport with the lg-* class contract and navigates', async () => {
        const wrapper = mount(LightGallery, {
            props: { slides: ITEMS },
            slots: {
                caption: ({ item, index }) =>
                    h('h4', { class: 'test-caption' }, `${item?.alt} (${index})`),
            },
        });
        expect(query('.lg-container')).toBeNull();

        wrapper.vm.openGallery(0);
        await nextTick();

        const container = query('.lg-container');
        expect(container).not.toBeNull();
        expect(container!.getAttribute('role')).toBe('dialog');
        expect(query('.lg-backdrop')).not.toBeNull();
        expect(
            query('.lg-outer .lg-inner .lg-item.lg-current'),
        ).not.toBeNull();
        expect(query('.lg-item img.lg-image')!.getAttribute('src')).toBe(
            'a.jpg',
        );
        expect(query('.lg-counter-current')!.textContent).toBe('1');
        // Scoped slot renders with typed context.
        expect(query('.lg-sub-html .test-caption')!.textContent).toBe(
            'a (0)',
        );

        wrapper.vm.nextSlide();
        await nextTick();
        expect(query('.lg-counter-current')!.textContent).toBe('2');
        expect(query('.lg-sub-html .test-caption')!.textContent).toBe(
            'b (1)',
        );

        wrapper.vm.closeGallery();
        await nextTick();
        expect(query('.lg-container')).toBeNull();
        wrapper.unmount();
    });

    it('round-trips v-model:open and v-model:index', async () => {
        const opened = ref(false);
        const index = ref(1);
        const Host = defineComponent({
            components: { LightGallery },
            setup: () => ({ opened, index, items: ITEMS }),
            template: `
                <LightGallery
                    :slides="items"
                    v-model:open="opened"
                    v-model:index="index"
                />
            `,
        });
        const wrapper = mount(Host);
        expect(query('.lg-container')).toBeNull();

        // Parent → gallery: open at the bound index.
        opened.value = true;
        await nextTick();
        await nextTick();
        expect(query('.lg-container')).not.toBeNull();
        expect(query('.lg-counter-current')!.textContent).toBe('2');

        // Parent → gallery: external index write navigates.
        index.value = 2;
        await nextTick();
        await nextTick();
        expect(query('.lg-counter-current')!.textContent).toBe('3');

        // Gallery → parent: ESC closes and clears the model.
        document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape' }),
        );
        await nextTick();
        await nextTick();
        expect(opened.value).toBe(false);
        expect(query('.lg-container')).toBeNull();
        wrapper.unmount();
    });

    it('unmount removes the teleported DOM and the keydown listener', async () => {
        const removeSpy = vi.spyOn(document, 'removeEventListener');
        const wrapper = mount(LightGallery, { props: { slides: ITEMS } });
        wrapper.vm.openGallery(1);
        await nextTick();
        expect(query('.lg-container')).not.toBeNull();

        wrapper.unmount();
        expect(query('.lg-container')).toBeNull();
        expect(
            removeSpy.mock.calls.some(([type]) => type === 'keydown'),
        ).toBe(true);
        removeSpy.mockRestore();
    });
});
