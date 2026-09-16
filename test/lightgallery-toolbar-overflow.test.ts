/**
 * Toolbar overflow for the vanilla core: buttons that do not fit beside
 * the counter move into a "More options" menu, the menu triggers them,
 * and touch devices leave out the buttons that repeat a gesture.
 */
import '@testing-library/jest-dom';

import lightGallery from '../src';
import { LightGallery } from '../src/lightgallery';
import { LightGallerySettings } from '../src/lg-settings';
import MediumZoom from '../src/plugins/mediumZoom/lg-medium-zoom';
import Rotate from '../src/plugins/rotate/lg-rotate';
import Zoom from '../src/plugins/zoom/lg-zoom';

const ZERO_MOTION: LightGallerySettings = {
    speed: 0,
    backdropDuration: 0,
    startAnimationDuration: 0,
    zoomFromOrigin: false,
    getCaptionFromTitleOrAlt: false,
};

function initGallery(settings: LightGallerySettings = {}): LightGallery {
    document.body.innerHTML = `<div id="lightGallery">
            <a href="a.png"><img src="a-t.png" alt="a" /></a>
            <a href="b.png"><img src="b-t.png" alt="b" /></a>
        </div>`;
    return lightGallery(
        document.getElementById('lightGallery') as HTMLElement,
        {
            ...ZERO_MOTION,
            plugins: [Zoom, Rotate],
            showZoomInOutIcons: true,
            ...settings,
        },
    );
}

/** jsdom has no layout: give the toolbar, its icons and the counter widths. */
function mockLayout(toolbarWidth: number): () => void {
    const client = jest
        .spyOn(Element.prototype, 'clientWidth', 'get')
        .mockImplementation(function (this: Element) {
            return this.classList.contains('lg-toolbar') ? toolbarWidth : 0;
        });
    const offset = jest
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

describe('toolbar overflow (vanilla core)', () => {
    let instance: LightGallery | undefined;
    let restoreLayout: (() => void) | undefined;

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        restoreLayout?.();
        restoreLayout = undefined;
        instance?.destroy();
        instance = undefined;
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        document.body.innerHTML = '';
    });

    function open(toolbarWidth: number, settings?: LightGallerySettings) {
        restoreLayout = mockLayout(toolbarWidth);
        instance = initGallery(settings);
        instance.openGallery(0);
        jest.advanceTimersByTime(1000);
    }

    it('moves the lowest-priority buttons into More when the row is full', () => {
        open(300);
        const moved = toolbarButtons().filter((button) =>
            button.hasAttribute('data-lg-overflow'),
        );
        expect(moved.length).toBeGreaterThan(0);
        expect(query('.lg-more')).toBeVisible();
        expect(query('.lg-close')).not.toHaveAttribute('data-lg-overflow');
        expect(query('.lg-download')).not.toHaveAttribute('data-lg-overflow');
        // Zoom buttons repeat gestures and go first.
        document
            .querySelectorAll('.lg-zoom-in, .lg-zoom-out')
            .forEach((button) =>
                expect(button).toHaveAttribute('data-lg-overflow'),
            );
    });

    it('lists the moved buttons in the menu and triggers the original', () => {
        open(300);
        const more = query('.lg-more')!;
        more.click();
        expect(more).toHaveAttribute('aria-expanded', 'true');
        const menu = query('.lg-toolbar-menu')!;
        expect(menu).toHaveAttribute('role', 'menu');
        const moved = toolbarButtons().filter((button) =>
            button.hasAttribute('data-lg-overflow'),
        );
        const items = menu.querySelectorAll('[role="menuitem"]');
        expect(items).toHaveLength(moved.length);
        expect(items[0].textContent).toBe(moved[0].getAttribute('aria-label'));
        expect(document.activeElement).toBe(items[0]);

        const spy = jest.fn();
        moved[0].addEventListener('click', spy);
        (items[0] as HTMLElement).click();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(query('.lg-toolbar-menu')).toBeNull();
        expect(more).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes the menu on Escape without closing the gallery', () => {
        open(300);
        const more = query('.lg-more')!;
        more.click();
        const item = query('.lg-toolbar-menu [role="menuitem"]')!;
        item.dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'Escape',
                keyCode: 27,
                bubbles: true,
            } as KeyboardEventInit),
        );
        expect(query('.lg-toolbar-menu')).toBeNull();
        expect(document.activeElement).toBe(more);
        expect(instance!.lgOpened).toBe(true);
    });

    it('leaves the row alone when every button fits', () => {
        open(1200);
        expect(
            toolbarButtons().some((button) =>
                button.hasAttribute('data-lg-overflow'),
            ),
        ).toBe(false);
        expect(query('.lg-more')!.hidden).toBe(true);
    });

    it('adds no More button when toolbarOverflow is off', () => {
        open(300, { toolbarOverflow: false });
        expect(query('.lg-more')).toBeNull();
        expect(
            toolbarButtons().some((button) =>
                button.hasAttribute('data-lg-overflow'),
            ),
        ).toBe(false);
    });

    it('leaves out the gesture buttons on touch devices', () => {
        open(1200, { isMobile: () => true });
        expect(query('.lg-zoom-in')).toBeNull();
        expect(query('.lg-zoom-out')).toBeNull();
        expect(query('.lg-rotate-left')).not.toBeNull();
    });

    it('keeps the gallery open when More and a menu item are clicked', () => {
        // Medium zoom closes the gallery on any click that reaches it.
        open(300, { plugins: [Zoom, Rotate, MediumZoom] });
        const closeGallery = jest.spyOn(instance!, 'closeGallery');
        query('.lg-more')!.click();
        expect(query('.lg-toolbar-menu')).not.toBeNull();
        query('.lg-toolbar-menu [role="menuitem"]')!.click();
        expect(closeGallery).not.toHaveBeenCalled();
        expect(instance!.lgOpened).toBe(true);
    });

    it('copies the icon each moved button shows into its menu item', () => {
        open(300);
        query('.lg-more')!.click();
        const icon = query('.lg-toolbar-menu [role="menuitem"] svg');
        expect(icon).not.toBeNull();
    });
});
