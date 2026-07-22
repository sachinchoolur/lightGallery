import { Component, signal, viewChild } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { axe } from 'vitest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgFeature,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withAutoplay } from '@lightgallery/angular/plugins/autoplay';
import { withFullscreen } from '@lightgallery/angular/plugins/fullscreen';
import { withPager } from '@lightgallery/angular/plugins/pager';
import { withRotate } from '@lightgallery/angular/plugins/rotate';
import { withShare } from '@lightgallery/angular/plugins/share';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withVideo } from '@lightgallery/angular/plugins/video';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'a', caption: 'Caption A' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'b' },
    { src: 'c.jpg', thumb: 'c-t.jpg', alt: 'c' },
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
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <lg-gallery
            [slides]="slides() ? items : undefined"
            [zoomFromOrigin]="false"
            [ariaLabelledby]="labelledby()"
            [features]="features()"
            [speed]="0"
            [backdropDuration]="0"
        >
            @if (!slides()) {
                @for (item of items; track item.src) {
                    <a href="#" class="trigger" [lgGalleryItem]="item">
                        <img [src]="item.thumb" [alt]="item.alt" />
                    </a>
                }
            }
        </lg-gallery>
        <h2 id="gallery-heading">My photos</h2>
    `,
})
class A11yHost {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly items = ITEMS;
    readonly slides = signal(true);
    readonly labelledby = signal<string | undefined>(undefined);
    readonly features = signal<readonly LgFeature[]>([]);
}

describe('accessibility', () => {
    describe('with fake timers', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });
        afterEach(() => {
            vi.runOnlyPendingTimers();
            vi.useRealTimers();
        });

        async function advance(
            fixture: ComponentFixture<A11yHost>,
            ms: number,
        ): Promise<void> {
            vi.advanceTimersByTime(ms);
            await flush(fixture);
        }

        it('has dialog semantics with an accessible name (and labelledby override)', async () => {
            const fixture = TestBed.createComponent(A11yHost);
            const host = fixture.componentInstance;
            await flush(fixture);
            host.gallery().openGallery(0);
            await flush(fixture);

            const dialog = query('.lg-container')!;
            expect(dialog.getAttribute('role')).toBe('dialog');
            expect(dialog.getAttribute('aria-modal')).toBe('true');
            expect(dialog.getAttribute('aria-label')).toBe('Gallery');

            host.labelledby.set('gallery-heading');
            await flush(fixture);
            expect(dialog.getAttribute('aria-label')).toBeNull();
            expect(dialog.getAttribute('aria-labelledby')).toBe(
                'gallery-heading',
            );
        });

        it('moves focus in, traps it with CDK, and returns it to the trigger', async () => {
            const fixture = TestBed.createComponent(A11yHost);
            const host = fixture.componentInstance;
            host.slides.set(false);
            await flush(fixture);

            const trigger = document.querySelector<HTMLAnchorElement>(
                '.trigger',
            )!;
            trigger.focus();
            trigger.click();
            await flush(fixture);

            const dialog = query('.lg-container')!;
            expect(document.activeElement).toBe(dialog);
            // CDK FocusTrap sentinels wrap the dialog content.
            expect(
                document.querySelectorAll('.cdk-focus-trap-anchor').length,
            ).toBe(2);

            host.gallery().closeGallery();
            await flush(fixture);
            await advance(fixture, 200);
            expect(query('.lg-container')).toBeNull();
            expect(document.activeElement).toBe(trigger);
        });

        it('collapses every animation under prefers-reduced-motion', async () => {
            const originalMatchMedia = window.matchMedia;
            window.matchMedia = ((query: string) => ({
                matches: query.includes('prefers-reduced-motion'),
                media: query,
                addEventListener: () => undefined,
                removeEventListener: () => undefined,
                addListener: () => undefined,
                removeListener: () => undefined,
                onchange: null,
                dispatchEvent: () => false,
            })) as typeof window.matchMedia;
            try {
                const fixture = TestBed.createComponent(A11yHost);
                const host = fixture.componentInstance;
                await flush(fixture);
                host.gallery().openGallery(0);
                await flush(fixture);
                // backdropDuration collapsed to 0: fully visible at +10ms.
                await advance(fixture, 10);
                const outer = query('.lg-outer')!;
                expect(outer.classList.contains('lg-visible')).toBe(true);
                // slide-end bounce disabled.
                host.gallery().goToSlide(2);
                await flush(fixture);
                host.gallery().nextSlide();
                await flush(fixture);
                expect(outer.classList.contains('lg-right-end')).toBe(
                    false,
                );
            } finally {
                window.matchMedia = originalMatchMedia;
            }
        });
    });

    describe('with real timers (axe)', () => {
        it('has zero detectable WCAG A/AA violations with features enabled', async () => {
            const fixture = TestBed.createComponent(A11yHost);
            const host = fixture.componentInstance;
            host.features.set([
                withThumbnail(),
                withZoom({ showZoomInOutIcons: true }),
                withVideo(),
                withAutoplay(),
                withFullscreen(),
                withPager(),
                withShare(),
                withRotate(),
            ]);
            await flush(fixture);
            host.gallery().openGallery(0);
            await flush(fixture);
            await new Promise((resolve) => setTimeout(resolve, 150));
            await flush(fixture);
            document
                .querySelector<HTMLImageElement>('img.lg-image')
                ?.dispatchEvent(new Event('load'));
            await flush(fixture);

            const results = await axe(query('.lg-container')!, {
                runOnly: {
                    type: 'tag',
                    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
                },
                // jsdom has no canvas; contrast is a manual/browser check.
                rules: { 'color-contrast': { enabled: false } },
            });
            expect(results.violations).toEqual([]);

            fixture.destroy();
        }, 20000);
    });
});
