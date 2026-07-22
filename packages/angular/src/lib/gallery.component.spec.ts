import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { GalleryItem } from '@lightgallery/headless';
import { describe, expect, it } from 'vitest';

import { LgGalleryComponent } from './gallery.component';
import { LgCaptionDirective } from './slots';

@Component({
    imports: [LgGalleryComponent, LgCaptionDirective],
    template: `
        <lg-gallery [slides]="items">
            <ng-template lgCaption let-item let-index="index">
                <h4 class="test-caption">{{ item?.alt }} ({{ index }})</h4>
            </ng-template>
        </lg-gallery>
    `,
})
class HostComponent {
    readonly gallery = viewChild.required(LgGalleryComponent);
    items: GalleryItem<unknown>[] = [
        { src: 'a.jpg', alt: 'a' },
        { src: 'b.jpg', alt: 'b' },
        { src: 'c.jpg', alt: 'c' },
    ];
}

function query(selector: string): HTMLElement | null {
    // CDK attaches the overlay to the document-level overlay container.
    return document.querySelector(selector);
}

describe('LgGalleryComponent (ADR spike)', () => {
    it('opens into a CDK overlay with the lg-* class contract and navigates', async () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(query('.lg-container')).toBeNull();

        fixture.componentInstance.gallery().openGallery(0);
        fixture.detectChanges();
        await fixture.whenStable();

        const container = query('.lg-container');
        expect(container).not.toBeNull();
        expect(container!.getAttribute('role')).toBe('dialog');
        expect(query('.lg-backdrop')).not.toBeNull();
        expect(query('.lg-outer .lg-inner .lg-item.lg-current')).not.toBeNull();
        expect(
            query('.lg-item img.lg-image')!.getAttribute('src'),
        ).toBe('a.jpg');
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('1');
        // Slot template renders with typed context.
        expect(query('.lg-sub-html .test-caption')!.textContent).toContain(
            'a (0)',
        );

        fixture.componentInstance.gallery().nextSlide();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');
        expect(query('.lg-sub-html .test-caption')!.textContent).toContain(
            'b (1)',
        );

        fixture.componentInstance.gallery().closeGallery();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(query('.lg-container')).toBeNull();
    });

    it('destroy removes the overlay and leaves no gallery DOM behind', async () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.componentInstance.gallery().openGallery(1);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(query('.lg-container')).not.toBeNull();

        fixture.destroy();
        expect(query('.lg-container')).toBeNull();
        expect(query('.lg-outer')).toBeNull();
    });
});
