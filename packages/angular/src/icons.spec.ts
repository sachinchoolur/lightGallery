import { Component, viewChild } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    LgGalleryComponent,
    LgIconDirective,
    type LgFeature,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withAutoplay } from '@lightgallery/angular/plugins/autoplay';
import { withComment } from '@lightgallery/angular/plugins/comment';

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

@Component({
    imports: [LgGalleryComponent, LgIconDirective],
    template: `
        <lg-gallery
            [slides]="items"
            [zoomFromOrigin]="false"
            [features]="features"
        >
            <ng-template
                [lgIcon]="[
                    'close',
                    'autoplayPlay',
                    'autoplayPause',
                    'fullscreen'
                ]"
                let-name
            >
                @switch (name) { @case ('close') {
                <svg data-lg-test="close" viewBox="0 0 24 24"></svg>
                } @case ('autoplayPlay') {
                <svg data-lg-test="play" viewBox="0 0 24 24"></svg>
                } @case ('autoplayPause') {
                <svg data-lg-test="pause" viewBox="0 0 24 24"></svg>
                } }
            </ng-template>
        </lg-gallery>
    `,
})
class IconsHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = ITEMS;
    features: LgFeature<object>[] = [
        withAutoplay(),
        withComment({ commentBox: true }),
    ];
}

describe('custom icons (lgIcon template)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('renders declared icons, keeps glyphs elsewhere, honors pairs', async () => {
        const fixture = TestBed.createComponent(IconsHost);
        await flush(fixture);
        fixture.componentInstance.gallery().openGallery(0);
        await flush(fixture);

        const close = query('.lg-close')!;
        expect(close.classList.contains('lg-icon-custom')).toBe(true);
        expect(
            close.querySelector('.lg-ci-close [data-lg-test="close"]'),
        ).not.toBeNull();

        // Undeclared names render the built-in default SVG.
        const prev = query('.lg-prev')!;
        expect(prev.classList.contains('lg-icon-custom')).toBe(true);
        expect(prev.querySelector('.lg-ci-prev svg')).not.toBeNull();
        expect(prev.querySelector('[data-lg-test]')).toBeNull();

        // Autoplay pair: both provided icons render.
        const autoplay = query('.lg-autoplay-button')!;
        expect(autoplay.classList.contains('lg-icon-custom')).toBe(true);
        expect(
            autoplay.querySelector(
                '.lg-ci-autoplay-play [data-lg-test="play"]',
            ),
        ).not.toBeNull();
        expect(
            autoplay.querySelector(
                '.lg-ci-autoplay-pause [data-lg-test="pause"]',
            ),
        ).not.toBeNull();
    });

    it('covers the comment plugin buttons with defaults', async () => {
        const fixture = TestBed.createComponent(IconsHost);
        await flush(fixture);
        fixture.componentInstance.gallery().openGallery(0);
        await flush(fixture);
        expect(
            query('.lg-comment-toggle.lg-icon-custom .lg-ci-comment svg'),
        ).not.toBeNull();
        expect(
            query(
                '.lg-comment-close.lg-icon-custom .lg-ci-comment-close svg',
            ),
        ).not.toBeNull();
    });
});
