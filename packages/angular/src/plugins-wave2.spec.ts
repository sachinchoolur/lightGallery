import {
    Component,
    signal,
    viewChild,
    type TemplateRef,
} from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    LgGalleryComponent,
    LgGalleryRuntime,
    type LgFeature,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withAutoplay } from '@lightgallery/angular/plugins/autoplay';
import {
    withComment,
    type CommentContext,
} from '@lightgallery/angular/plugins/comment';
import { withFullscreen } from '@lightgallery/angular/plugins/fullscreen';
import { withHash } from '@lightgallery/angular/plugins/hash';
import { withMediumZoom } from '@lightgallery/angular/plugins/mediumZoom';
import { withPager } from '@lightgallery/angular/plugins/pager';
import {
    withRelativeCaption,
} from '@lightgallery/angular/plugins/relativeCaption';
import { withRotate } from '@lightgallery/angular/plugins/rotate';
import { withShare } from '@lightgallery/angular/plugins/share';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withVideo } from '@lightgallery/angular/plugins/video';
import { withVimeoThumbnail } from '@lightgallery/angular/plugins/vimeoThumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'a', caption: 'Caption A' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'b', caption: 'Caption B' },
    { src: 'c.jpg', thumb: 'c-t.jpg', alt: 'c', caption: 'Caption C' },
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

@Component({
    imports: [LgGalleryComponent],
    template: `
        <ng-template #comments let-item let-index="index">
            <p class="test-comments">{{ item?.alt }} ({{ index }})</p>
        </ng-template>
        <lg-gallery
            [slides]="items"
            [zoomFromOrigin]="false"
            [features]="features()"
            (autoplayStart)="log.push('autoplayStart')"
            (autoplay)="log.push('autoplay:' + $event.index)"
            (autoplayStop)="log.push('autoplayStop')"
            (rotateRight)="log.push('rotateRight:' + $event.rotate)"
        />
    `,
})
class Wave2Host {
    readonly gallery = viewChild.required(LgGalleryComponent);
    readonly comments =
        viewChild.required<TemplateRef<CommentContext>>('comments');
    items = ITEMS;
    readonly features = signal<readonly LgFeature[]>([]);
    readonly log: string[] = [];
}

function runtimeOf(fixture: ComponentFixture<Wave2Host>): LgGalleryRuntime {
    return fixture.debugElement
        .query((el) => el.name === 'lg-gallery')!
        .injector.get(LgGalleryRuntime);
}

async function openAndLoad(
    fixture: ComponentFixture<Wave2Host>,
    index = 0,
): Promise<void> {
    fixture.componentInstance.gallery().openGallery(index);
    await flush(fixture);
    await advance(fixture, 450);
    const img = document.querySelector<HTMLImageElement>(
        `img.lg-image[data-index="${index}"]`,
    );
    img?.dispatchEvent(new Event('load'));
    await flush(fixture);
}

describe('wave-2 features', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('autoplay: toggle starts/stops the slideshow and advances slides', async () => {
        const fixture = TestBed.createComponent(Wave2Host);
        const host = fixture.componentInstance;
        host.features.set([withAutoplay({ slideShowInterval: 100 })]);
        await flush(fixture);
        await openAndLoad(fixture);

        expect(query('.lg-progress-bar')).not.toBeNull();
        (query('.lg-autoplay-button') as HTMLButtonElement).click();
        await flush(fixture);
        expect(
            query('.lg-outer')!.classList.contains('lg-show-autoplay'),
        ).toBe(true);
        expect(host.log).toContain('autoplayStart');

        // speed(400) + interval(100) later the show advances.
        await advance(fixture, 500);
        expect(host.log).toContain('autoplay:1');
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');

        await advance(fixture, 600);
        (query('.lg-autoplay-button') as HTMLButtonElement).click();
        await flush(fixture);
        expect(host.log).toContain('autoplayStop');
        expect(
            query('.lg-outer')!.classList.contains('lg-show-autoplay'),
        ).toBe(false);
    });

    it('fullscreen: feature-detects, toggles via the browser API', async () => {
        const fixture = TestBed.createComponent(Wave2Host);
        const host = fixture.componentInstance;
        host.features.set([withFullscreen()]);
        await flush(fixture);
        await openAndLoad(fixture);
        // jsdom reports no Fullscreen API -> no-op (no button).
        expect(query('.lg-fullscreen')).toBeNull();

        Object.defineProperty(document, 'fullscreenEnabled', {
            value: true,
            configurable: true,
        });
        const request = vi.fn(() => Promise.resolve());
        Object.defineProperty(document.documentElement, 'requestFullscreen', {
            value: request,
            configurable: true,
        });
        // Re-render with support present.
        host.features.set([withFullscreen({ fullScreen: true })]);
        await flush(fixture);
        const button = query('.lg-fullscreen') as HTMLButtonElement;
        expect(button).not.toBeNull();
        button.click();
        expect(request).toHaveBeenCalled();
        Reflect.deleteProperty(document, 'fullscreenEnabled');
        Reflect.deleteProperty(
            document.documentElement,
            'requestFullscreen',
        );
    });

    it('hash: opens from a deep link, writes and restores the hash', async () => {
        window.location.hash = '#lg=test-g&slide=1';
        const fixture = TestBed.createComponent(Wave2Host);
        const host = fixture.componentInstance;
        host.features.set([withHash({ galleryId: 'test-g' })]);
        await flush(fixture);
        expect(query('.lg-container')).toBeNull();

        // The eager service's deep-link timer opens the gallery at slide 1.
        await advance(fixture, 150);
        await advance(fixture, 450);
        expect(query('.lg-container')).not.toBeNull();
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');
        expect(document.body.classList.contains('lg-from-hash')).toBe(true);
        expect(window.location.hash).toBe('#lg=test-g&slide=1');

        host.gallery().closeGallery();
        await flush(fixture);
        await advance(fixture, 450);
        expect(query('.lg-container')).toBeNull();
        expect(window.location.hash).toBe('');
        expect(document.body.classList.contains('lg-from-hash')).toBe(
            false,
        );
    });

    it('pager: renders dots, tracks active, navigates on click', async () => {
        const fixture = TestBed.createComponent(Wave2Host);
        const host = fixture.componentInstance;
        host.features.set([withPager()]);
        await flush(fixture);
        await openAndLoad(fixture);

        const dots = [
            ...document.querySelectorAll<HTMLElement>('.lg-pager-cont'),
        ];
        expect(dots.length).toBe(3);
        expect(dots[0]!.classList.contains('lg-pager-active')).toBe(true);
        dots[2]!.click();
        await flush(fixture);
        await advance(fixture, 500);
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('3');
    });

    it('share: dropdown links from the headless builders, toggle + overlay close', async () => {
        const fixture = TestBed.createComponent(Wave2Host);
        const host = fixture.componentInstance;
        host.features.set([withShare()]);
        await flush(fixture);
        await openAndLoad(fixture);

        const links = [
            ...document.querySelectorAll<HTMLAnchorElement>(
                '.lg-dropdown a',
            ),
        ];
        expect(links.length).toBe(3);
        expect(links[0]!.getAttribute('href')).toContain(
            'facebook.com/sharer',
        );
        expect(links[1]!.getAttribute('href')).toContain(
            'twitter.com/intent/tweet',
        );
        expect(links[2]!.getAttribute('href')).toContain(
            'pinterest.com/pin/create',
        );
        expect(links[2]!.getAttribute('href')).toContain(
            encodeURIComponent('a.jpg'),
        );

        (query('.lg-share') as HTMLButtonElement).click();
        await flush(fixture);
        expect(
            query('.lg-outer')!.classList.contains('lg-dropdown-active'),
        ).toBe(true);
        (query('.lg-dropdown-overlay') as HTMLElement).click();
        await flush(fixture);
        expect(
            query('.lg-outer')!.classList.contains('lg-dropdown-active'),
        ).toBe(false);
    });

    it('rotate: composes inside zoom, rotates/flips, fires public events', async () => {
        const fixture = TestBed.createComponent(Wave2Host);
        const host = fixture.componentInstance;
        host.features.set([withZoom(), withRotate()]);
        await flush(fixture);
        await openAndLoad(fixture);

        // Zoom outermost, rotate inside (2.x DOM order).
        const pan = query('.lg-item.lg-current .lg-zoom-pan')!;
        const rotateEl = pan.querySelector<HTMLElement>('.lg-img-rotate')!;
        expect(rotateEl).not.toBeNull();
        expect(rotateEl.querySelector('img.lg-image')).not.toBeNull();

        (query('.lg-rotate-right') as HTMLButtonElement).click();
        await flush(fixture);
        expect(rotateEl.style.transform).toBe(
            'rotate(90deg) scale3d(1, 1, 1)',
        );
        await advance(fixture, 500);
        expect(host.log).toContain('rotateRight:90');

        (query('.lg-flip-hor') as HTMLButtonElement).click();
        await flush(fixture);
        // At 90 deg the visual flip axis swaps (headless rule).
        expect(rotateEl.style.transform).toBe(
            'rotate(90deg) scale3d(1, -1, 1)',
        );
    });

    it('comment: renders the comments template, toggles the panel', async () => {
        const fixture = TestBed.createComponent(Wave2Host);
        const host = fixture.componentInstance;
        await flush(fixture);
        host.features.set([
            withComment({
                commentBox: true,
                commentsTemplate: host.comments(),
            }),
        ]);
        await flush(fixture);
        await openAndLoad(fixture);

        expect(query('.lg-comment-box .test-comments')!.textContent).toBe(
            'a (0)',
        );
        (query('.lg-comment-toggle') as HTMLButtonElement).click();
        await flush(fixture);
        expect(
            query('.lg-outer')!.classList.contains('lg-comment-active'),
        ).toBe(true);
        (query('.lg-comment-overlay') as HTMLElement).click();
        await flush(fixture);
        expect(
            query('.lg-outer')!.classList.contains('lg-comment-active'),
        ).toBe(false);
    });

    it('mediumZoom: presets strip the chrome, margin overrides media position', async () => {
        const fixture = TestBed.createComponent(Wave2Host);
        const host = fixture.componentInstance;
        host.features.set([withMediumZoom({ margin: 40 })]);
        await flush(fixture);
        await openAndLoad(fixture);

        const outer = query('.lg-outer')!;
        expect(outer.classList.contains('lg-medium-zoom')).toBe(true);
        // Presets below user settings: controls/counter/close all off.
        expect(query('.lg-prev')).toBeNull();
        expect(query('.lg-counter')).toBeNull();
        expect(query('.lg-close')).toBeNull();
        // overrideMediaPosition drives the content offsets.
        const content = query('.lg-content') as HTMLElement;
        expect(content.style.top).toBe('40px');
        expect(content.style.bottom).toBe('40px');
    });

    it('relativeCaption: forces slide captions and marks the outer element', async () => {
        const fixture = TestBed.createComponent(Wave2Host);
        const host = fixture.componentInstance;
        host.features.set([withRelativeCaption()]);
        await flush(fixture);
        await openAndLoad(fixture);

        expect(
            query('.lg-outer')!.classList.contains('lg-relative-caption'),
        ).toBe(true);
        // captionPosition preset 'slide': the caption lives in the slide.
        expect(query('.lg-item.lg-current .lg-sub-html')).not.toBeNull();
        expect(query('.lg-components .lg-sub-html')).toBeNull();
    });

    it('vimeoThumbnail: fetches oEmbed thumbs through transformItems', async () => {
        const fetchMock = vi.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        thumbnail_url: 'https://i.vimeocdn.com/video/x.jpg',
                    }),
            }),
        );
        vi.stubGlobal('fetch', fetchMock);
        const fixture = TestBed.createComponent(Wave2Host);
        const host = fixture.componentInstance;
        host.items = [
            ...ITEMS,
            { src: 'https://vimeo.com/112836958', alt: 'vimeo' },
        ];
        host.features.set([withVimeoThumbnail()]);
        await flush(fixture);
        // Drain the async transform (microtask chain).
        for (let i = 0; i < 6; i++) {
            await Promise.resolve();
        }
        await flush(fixture);

        const items = runtimeOf(fixture).items();
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(items[3]!.thumb).toBe('https://i.vimeocdn.com/video/x.jpg');
        expect(items[0]!.thumb).toBe('a-t.jpg');
        vi.unstubAllGlobals();
    });

    it('all 13 features compose without conflict', async () => {
        const fixture = TestBed.createComponent(Wave2Host);
        const host = fixture.componentInstance;
        await flush(fixture);
        host.features.set([
            withThumbnail(),
            withZoom(),
            withVideo(),
            withAutoplay(),
            withFullscreen(),
            withHash({ galleryId: 'all13' }),
            withPager(),
            withShare(),
            withRotate(),
            withComment({
                commentBox: true,
                commentsTemplate: host.comments(),
            }),
            withMediumZoom(),
            withRelativeCaption(),
            withVimeoThumbnail(),
        ]);
        await flush(fixture);
        await openAndLoad(fixture);

        const outer = query('.lg-outer')!;
        expect(outer.classList.contains('lg-has-thumb')).toBe(true);
        expect(outer.classList.contains('lg-medium-zoom')).toBe(true);
        expect(outer.classList.contains('lg-relative-caption')).toBe(true);
        expect(query('.lg-thumb-outer')).not.toBeNull();
        expect(query('.lg-pager-outer')).not.toBeNull();
        expect(query('.lg-progress-bar')).not.toBeNull();
        expect(query('.lg-comment-box')).not.toBeNull();
        // Wrapper chain: zoom outermost, rotate inside.
        expect(
            query('.lg-item.lg-current .lg-zoom-pan .lg-img-rotate'),
        ).not.toBeNull();

        // Clean teardown with the full stack live.
        const runtime = runtimeOf(fixture);
        fixture.destroy();
        expect(query('.lg-container')).toBeNull();
        expect(runtime.gestureSeam.lockOwner).toBeNull();
        vi.runOnlyPendingTimers();
        expect(vi.getTimerCount()).toBe(0);
        window.location.hash = '';
    });
});
