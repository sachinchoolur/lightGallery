import { enableAutoUnmount, mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LightGallery from './LightGallery.vue';
import type { LgGalleryItem } from './types';
import MediumZoom from './plugins/mediumZoom';
import Rotate from './plugins/rotate';
import Zoom from './plugins/zoom';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'a' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'b' },
];

enableAutoUnmount(afterEach);

function query(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}

async function settle(): Promise<void> {
    for (let i = 0; i < 4; i++) {
        await nextTick();
    }
}

async function advance(ms: number): Promise<void> {
    vi.advanceTimersByTime(ms);
    await settle();
}

/** jsdom has no layout: give the toolbar, its icons and the counter widths. */
function mockLayout(toolbarWidth: number): () => void {
    const client = vi
        .spyOn(Element.prototype, 'clientWidth', 'get')
        .mockImplementation(function (this: Element) {
            return this.classList.contains('lg-toolbar') ? toolbarWidth : 0;
        });
    const offset = vi
        .spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
        .mockImplementation(function (this: HTMLElement) {
            if (this.hidden || this.hasAttribute('data-lg-overflow')) {
                return 0;
            }
            if (this.classList.contains('lg-counter')) return 80;
            if (this.classList.contains('lg-icon')) return 50;
            return 0;
        });
    return () => {
        client.mockRestore();
        offset.mockRestore();
    };
}

const Host = defineComponent({
    components: { LightGallery },
    props: { extra: { type: Object, default: () => ({}) } },
    setup: () => ({ items: ITEMS, plugins: [Zoom, Rotate] }),
    template: `
        <LightGallery
            :slides="items"
            :zoom-from-origin="false"
            :plugins="plugins"
            :zoom="{ showZoomInOutIcons: true }"
            v-bind="extra"
        />
    `,
});

function toolbarButtons(): HTMLElement[] {
    return Array.from(
        document.querySelectorAll<HTMLElement>('.lg-toolbar > .lg-icon'),
    ).filter((button) => !button.classList.contains('lg-more'));
}

const moved = () =>
    toolbarButtons().filter((button) =>
        button.hasAttribute('data-lg-overflow'),
    );

describe('toolbar overflow', () => {
    let restoreLayout: (() => void) | undefined;

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        restoreLayout?.();
        restoreLayout = undefined;
        vi.useRealTimers();
    });

    async function openGallery(
        toolbarWidth: number,
        extra: Record<string, unknown> = {},
    ) {
        restoreLayout = mockLayout(toolbarWidth);
        const wrapper = mount(Host, {
            props: { extra },
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

    it('moves the lowest-priority buttons into More when the row is full', async () => {
        await openGallery(300);
        expect(moved().length).toBeGreaterThan(0);
        expect((query('.lg-more') as HTMLButtonElement).hidden).toBe(false);
        expect(query('.lg-close')!.hasAttribute('data-lg-overflow')).toBe(
            false,
        );
        expect(query('.lg-download')!.hasAttribute('data-lg-overflow')).toBe(
            false,
        );
        document
            .querySelectorAll('.lg-zoom-in, .lg-zoom-out, .lg-actual-size')
            .forEach((button) =>
                expect(button.hasAttribute('data-lg-overflow')).toBe(true),
            );
    });

    it('lists the moved buttons in the menu and triggers the original', async () => {
        await openGallery(300);
        const more = query('.lg-more')!;
        more.click();
        await settle();
        expect(more.getAttribute('aria-expanded')).toBe('true');
        const menu = query('.lg-toolbar-menu')!;
        expect(menu.getAttribute('role')).toBe('menu');
        const hidden = moved();
        const items = menu.querySelectorAll<HTMLElement>('[role="menuitem"]');
        expect(items).toHaveLength(hidden.length);
        expect(items[0]!.textContent).toBe(
            hidden[0]!.getAttribute('aria-label'),
        );
        expect(document.activeElement).toBe(items[0]);

        const spy = vi.fn();
        hidden[0]!.addEventListener('click', spy);
        items[0]!.click();
        await settle();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(query('.lg-toolbar-menu')).toBeNull();
        expect(more.getAttribute('aria-expanded')).toBe('false');
    });

    it('closes the menu on Escape without closing the gallery', async () => {
        const wrapper = await openGallery(300);
        const more = query('.lg-more')!;
        more.click();
        await settle();
        const item = query('.lg-toolbar-menu [role="menuitem"]')!;
        item.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
        );
        await settle();
        expect(query('.lg-toolbar-menu')).toBeNull();
        expect(document.activeElement).toBe(more);
        expect(
            wrapper.findComponent(LightGallery).emitted('before-close'),
        ).toBeUndefined();
    });

    it('leaves the row alone when every button fits', async () => {
        await openGallery(1200);
        expect(moved()).toHaveLength(0);
        expect((query('.lg-more') as HTMLButtonElement).hidden).toBe(true);
    });

    it('adds no More button when toolbarOverflow is off', async () => {
        await openGallery(300, { toolbarOverflow: false });
        expect(query('.lg-more')).toBeNull();
        expect(moved()).toHaveLength(0);
    });

    it('leaves out the gesture buttons on touch devices', async () => {
        await openGallery(1200, { isMobile: () => true });
        expect(query('.lg-zoom-in')).toBeNull();
        expect(query('.lg-zoom-out')).toBeNull();
        expect(query('.lg-actual-size')).toBeNull();
        expect(query('.lg-rotate-left')).not.toBeNull();
    });

    it('keeps the gallery open when More and a menu item are clicked', async () => {
        // Medium zoom closes the gallery on any click that reaches it.
        const wrapper = await openGallery(300, {
            plugins: [Zoom, Rotate, MediumZoom],
        });
        query('.lg-more')!.click();
        await settle();
        expect(query('.lg-toolbar-menu')).not.toBeNull();
        query('.lg-toolbar-menu [role="menuitem"]')!.click();
        await settle();
        expect(
            wrapper.findComponent(LightGallery).emitted('before-close'),
        ).toBeUndefined();
    });

    it('copies the icon each moved button shows into its menu item', async () => {
        await openGallery(300);
        query('.lg-more')!.click();
        await settle();
        expect(query('.lg-toolbar-menu [role="menuitem"] svg')).not.toBeNull();
    });
});
