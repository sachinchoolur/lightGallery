import { Component, viewChild } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LgGalleryComponent, type LgGalleryItem } from '@lightgallery/angular';
import { withMediumZoom } from '@lightgallery/angular/plugins/mediumZoom';
import { withRotate } from '@lightgallery/angular/plugins/rotate';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'a' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'b' },
];

function query(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}

async function flush<T>(fixture: ComponentFixture<T>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
}

async function advance<T>(
    fixture: ComponentFixture<T>,
    ms: number,
): Promise<void> {
    vi.advanceTimersByTime(ms);
    await flush(fixture);
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

const FEATURES = [withZoom({ showZoomInOutIcons: true }), withRotate()];

@Component({
    imports: [LgGalleryComponent],
    template: `
        <lg-gallery
            [slides]="items"
            [zoomFromOrigin]="false"
            [features]="features"
            (beforeClose)="closed = true"
        />
    `,
})
class OverflowHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = ITEMS;
    readonly features = FEATURES;
    closed = false;
}

@Component({
    imports: [LgGalleryComponent],
    template: `
        <lg-gallery
            [slides]="items"
            [zoomFromOrigin]="false"
            [features]="features"
            [toolbarOverflow]="false"
        />
    `,
})
class OverflowOffHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = ITEMS;
    readonly features = FEATURES;
}

@Component({
    imports: [LgGalleryComponent],
    template: `
        <lg-gallery
            [slides]="items"
            [zoomFromOrigin]="false"
            [features]="features"
            [isMobile]="isMobile"
        />
    `,
})
class OverflowMobileHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = ITEMS;
    readonly features = FEATURES;
    readonly isMobile = () => true;
}

@Component({
    imports: [LgGalleryComponent],
    template: `
        <lg-gallery
            [slides]="items"
            [zoomFromOrigin]="false"
            [features]="features"
            (beforeClose)="closed = true"
        />
    `,
})
class OverflowMediumZoomHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = ITEMS;
    readonly features = [...FEATURES, withMediumZoom()];
    closed = false;
}

/**
 * The toolbar's own icon buttons: feature buttons sit inside their
 * component hosts, so search by descendant (same rule as the component).
 */
function toolbarButtons(): HTMLElement[] {
    return Array.from(
        document.querySelectorAll<HTMLElement>('.lg-toolbar .lg-icon'),
    ).filter(
        (button) =>
            !button.classList.contains('lg-more') &&
            !button.closest('.lg-toolbar-menu, .lg-dropdown') &&
            !button.parentElement?.closest('.lg-icon'),
    );
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
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    async function open<T extends { gallery: () => LgGalleryComponent }>(
        host: new () => T,
        toolbarWidth: number,
    ): Promise<ComponentFixture<T>> {
        restoreLayout = mockLayout(toolbarWidth);
        const fixture = TestBed.createComponent(host);
        await flush(fixture);
        fixture.componentInstance.gallery().openGallery(0);
        await flush(fixture);
        await advance(fixture, 450);
        // rAF-scheduled measurements run on the fake timer clock.
        await advance(fixture, 50);
        return fixture;
    }

    it('moves the lowest-priority buttons into More when the row is full', async () => {
        await open(OverflowHost, 300);
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
        const fixture = await open(OverflowHost, 300);
        const more = query('.lg-more')!;
        more.click();
        await flush(fixture);
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
        await flush(fixture);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(query('.lg-toolbar-menu')).toBeNull();
        expect(more.getAttribute('aria-expanded')).toBe('false');
    });

    it('closes the menu on Escape without closing the gallery', async () => {
        const fixture = await open(OverflowHost, 300);
        const more = query('.lg-more')!;
        more.click();
        await flush(fixture);
        const item = query('.lg-toolbar-menu [role="menuitem"]')!;
        item.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
        );
        await flush(fixture);
        expect(query('.lg-toolbar-menu')).toBeNull();
        expect(document.activeElement).toBe(more);
        expect(fixture.componentInstance.closed).toBe(false);
    });

    it('leaves the row alone when every button fits', async () => {
        await open(OverflowHost, 1200);
        expect(moved()).toHaveLength(0);
        expect((query('.lg-more') as HTMLButtonElement).hidden).toBe(true);
    });

    it('adds no More button when toolbarOverflow is off', async () => {
        await open(OverflowOffHost, 300);
        expect(query('.lg-more')).toBeNull();
        expect(moved()).toHaveLength(0);
    });

    it('leaves out the gesture buttons on touch devices', async () => {
        await open(OverflowMobileHost, 1200);
        expect(query('.lg-zoom-in')).toBeNull();
        expect(query('.lg-zoom-out')).toBeNull();
        expect(query('.lg-actual-size')).toBeNull();
        expect(query('.lg-rotate-left')).not.toBeNull();
    });

    it('keeps the gallery open when More and a menu item are clicked', async () => {
        // Medium zoom closes the gallery on any click that reaches it.
        const fixture = await open(OverflowMediumZoomHost, 300);
        query('.lg-more')!.click();
        await flush(fixture);
        expect(query('.lg-toolbar-menu')).not.toBeNull();
        query('.lg-toolbar-menu [role="menuitem"]')!.click();
        await flush(fixture);
        expect(fixture.componentInstance.closed).toBe(false);
    });

    it('copies the icon each moved button shows into its menu item', async () => {
        const fixture = await open(OverflowHost, 300);
        query('.lg-more')!.click();
        await flush(fixture);
        expect(query('.lg-toolbar-menu [role="menuitem"] svg')).not.toBeNull();
    });
});
