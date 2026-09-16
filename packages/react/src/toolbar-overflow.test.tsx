import { act, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LightGallery, type GalleryItem } from './index';
import MediumZoom from './plugins/mediumZoom';
import Rotate from './plugins/rotate';
import Zoom from './plugins/zoom';

const slides: GalleryItem[] = [
    { src: 'a.jpg', alt: 'a', thumb: 'a-t.jpg' },
    { src: 'b.jpg', alt: 'b', thumb: 'b-t.jpg' },
];

function tick(ms: number) {
    act(() => {
        vi.advanceTimersByTime(ms);
    });
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

function query(selector: string): HTMLElement | null {
    return document.querySelector<HTMLElement>(selector);
}

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

    function renderGallery(
        toolbarWidth: number,
        props: Record<string, unknown> = {},
    ) {
        restoreLayout = mockLayout(toolbarWidth);
        const onClose = vi.fn();
        render(
            <LightGallery
                slides={slides}
                open={true}
                onClose={onClose}
                plugins={[Zoom, Rotate]}
                zoom={{ showZoomInOutIcons: true }}
                {...props}
            />,
        );
        tick(450);
        return { onClose };
    }

    it('moves the lowest-priority buttons into More when the row is full', () => {
        renderGallery(300);
        expect(moved().length).toBeGreaterThan(0);
        expect(query('.lg-more')!.hidden).toBe(false);
        expect(query('.lg-close')).not.toHaveAttribute('data-lg-overflow');
        expect(query('.lg-download')).not.toHaveAttribute('data-lg-overflow');
        document
            .querySelectorAll('.lg-zoom-in, .lg-zoom-out, .lg-actual-size')
            .forEach((button) =>
                expect(button).toHaveAttribute('data-lg-overflow'),
            );
    });

    it('lists the moved buttons in the menu and triggers the original', () => {
        renderGallery(300);
        const more = query('.lg-more')!;
        fireEvent.click(more);
        expect(more).toHaveAttribute('aria-expanded', 'true');
        const menu = query('.lg-toolbar-menu')!;
        expect(menu).toHaveAttribute('role', 'menu');
        const hidden = moved();
        const items = menu.querySelectorAll<HTMLElement>('[role="menuitem"]');
        expect(items).toHaveLength(hidden.length);
        expect(items[0]!.textContent).toBe(
            hidden[0]!.getAttribute('aria-label'),
        );
        expect(document.activeElement).toBe(items[0]);

        const spy = vi.fn();
        hidden[0]!.addEventListener('click', spy);
        fireEvent.click(items[0]!);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(query('.lg-toolbar-menu')).toBeNull();
        expect(more).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes the menu on Escape without closing the gallery', () => {
        const { onClose } = renderGallery(300);
        const more = query('.lg-more')!;
        fireEvent.click(more);
        const item = query('.lg-toolbar-menu [role="menuitem"]')!;
        act(() => {
            item.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
            );
        });
        expect(query('.lg-toolbar-menu')).toBeNull();
        expect(document.activeElement).toBe(more);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('leaves the row alone when every button fits', () => {
        renderGallery(1200);
        expect(moved()).toHaveLength(0);
        expect(query('.lg-more')!.hidden).toBe(true);
    });

    it('adds no More button when toolbarOverflow is off', () => {
        renderGallery(300, { toolbarOverflow: false });
        expect(query('.lg-more')).toBeNull();
        expect(moved()).toHaveLength(0);
    });

    it('leaves out the gesture buttons on touch devices', () => {
        renderGallery(1200, { isMobile: () => true });
        expect(query('.lg-zoom-in')).toBeNull();
        expect(query('.lg-zoom-out')).toBeNull();
        expect(query('.lg-actual-size')).toBeNull();
        expect(query('.lg-rotate-left')).not.toBeNull();
    });

    it('keeps the gallery open when More and a menu item are clicked', () => {
        // Medium zoom closes the gallery on any click that reaches it.
        const { onClose } = renderGallery(300, {
            plugins: [Zoom, Rotate, MediumZoom],
        });
        fireEvent.click(query('.lg-more')!);
        expect(query('.lg-toolbar-menu')).not.toBeNull();
        fireEvent.click(query('.lg-toolbar-menu [role="menuitem"]')!);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('copies the icon each moved button shows into its menu item', () => {
        renderGallery(300);
        fireEvent.click(query('.lg-more')!);
        expect(query('.lg-toolbar-menu [role="menuitem"] svg')).not.toBeNull();
    });
});
