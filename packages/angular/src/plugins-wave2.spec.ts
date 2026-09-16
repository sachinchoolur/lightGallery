import { Component, signal, viewChild, type TemplateRef } from '@angular/core';
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
import { withRelativeCaption } from '@lightgallery/angular/plugins/relativeCaption';
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
            [strings]="strings()"
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
    readonly strings = signal<Record<string, string> | undefined>(undefined);
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
        expect(query('.lg-outer')!.classList.contains('lg-show-autoplay')).toBe(
            true,
        );
        expect(host.log).toContain('autoplayStart');

        // speed(400) + interval(100) later the show advances.
        await advance(fixture, 500);
        expect(host.log).toContain('autoplay:1');
        expect(query('.lg-counter-current')!.textContent!.trim()).toBe('2');

        await advance(fixture, 600);
        (query('.lg-autoplay-button') as HTMLButtonElement).click();
        await flush(fixture);
        expect(host.log).toContain('autoplayStop');
        expect(query('.lg-outer')!.classList.contains('lg-show-autoplay')).toBe(
            false,
        );
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
        Reflect.deleteProperty(document.documentElement, 'requestFullscreen');
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
        expect(query('.lg-container.lg-show')).toBeNull();
        expect(window.location.hash).toBe('');
        expect(document.body.classList.contains('lg-from-hash')).toBe(false);
    });

    it('hash: runs on the Navigation API driver with identical URLs', async () => {
        const calls: Array<[string, { history?: string }]> = [];
        const listeners = new Set<() => void>();
        const navigation = {
            currentEntry: { url: 'http://localhost/' },
            navigate: (url: string, options: { history?: string }) => {
                calls.push([url, options]);
                navigation.currentEntry = {
                    url: new URL(url, 'http://localhost/').href,
                };
                // The real API fires currententrychange for replaces
                // too — the handlers must be re-entrant-safe.
                listeners.forEach((listener) => listener());
                return {
                    committed: Promise.resolve(),
                    finished: Promise.resolve(),
                };
            },
            addEventListener: (type: string, listener: () => void) => {
                if (type === 'currententrychange') {
                    listeners.add(listener);
                }
            },
            removeEventListener: (_type: string, listener: () => void) => {
                listeners.delete(listener);
            },
        };
        Object.defineProperty(window, 'navigation', {
            value: navigation,
            configurable: true,
        });
        try {
            const fixture = TestBed.createComponent(Wave2Host);
            const host = fixture.componentInstance;
            host.features.set([withHash({ galleryId: 'nav-g' })]);
            await flush(fixture);
            host.gallery().openGallery(0);
            await flush(fixture);
            await advance(fixture, 450);

            const lastWrite = calls[calls.length - 1]!;
            expect(lastWrite[0]).toContain('#lg=nav-g&slide=0');
            expect(lastWrite[1]).toMatchObject({ history: 'replace' });

            // Back/forward: the entry changes → the gallery follows.
            navigation.currentEntry = {
                url: 'http://localhost/#lg=nav-g&slide=2',
            };
            listeners.forEach((listener) => listener());
            await flush(fixture);
            await advance(fixture, 600);
            expect(query('.lg-counter-current')!.textContent!.trim()).toBe('3');
        } finally {
            delete (window as { navigation?: unknown }).navigation;
        }
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

        // The dropdown is the button's sibling inside the wrapper that
        // anchors it, so it hangs under the button.
        const shareOuter = query('.lg-toolbar .lg-share-outer')!;
        expect(shareOuter.querySelector(':scope > .lg-share')).not.toBeNull();
        expect(
            shareOuter.querySelector(':scope > .lg-dropdown'),
        ).not.toBeNull();

        const links = [
            ...document.querySelectorAll<HTMLAnchorElement>('.lg-dropdown a'),
        ];
        expect(links.length).toBe(3);
        expect(links[0]!.getAttribute('href')).toContain('facebook.com/sharer');
        expect(links[1]!.getAttribute('href')).toContain('x.com/intent/post');
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

    it('share: native sheet preferred when enabled and available', async () => {
        const share = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'share', {
            value: share,
            configurable: true,
        });
        try {
            const fixture = TestBed.createComponent(Wave2Host);
            const host = fixture.componentInstance;
            host.features.set([withShare({ preferNativeShare: true })]);
            await flush(fixture);
            await openAndLoad(fixture);

            const button = query('.lg-share') as HTMLButtonElement;
            // Native-first buttons do not advertise a popup.
            expect(button.getAttribute('aria-haspopup')).toBeNull();
            button.click();
            await flush(fixture);
            expect(share).toHaveBeenCalledWith({
                url: window.location.href,
                title: 'a',
            });
            expect(
                query('.lg-outer')!.classList.contains('lg-dropdown-active'),
            ).toBe(false);
        } finally {
            delete (window.navigator as { share?: unknown }).share;
        }
    });

    it('share: dropdown kept when preferNativeShare is false', async () => {
        const share = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'share', {
            value: share,
            configurable: true,
        });
        try {
            const fixture = TestBed.createComponent(Wave2Host);
            const host = fixture.componentInstance;
            host.features.set([withShare({ preferNativeShare: false })]);
            await flush(fixture);
            await openAndLoad(fixture);

            (query('.lg-share') as HTMLButtonElement).click();
            await flush(fixture);
            expect(share).not.toHaveBeenCalled();
            expect(
                query('.lg-outer')!.classList.contains('lg-dropdown-active'),
            ).toBe(true);
        } finally {
            delete (window.navigator as { share?: unknown }).share;
        }
    });

    it('share: canShare veto falls back to the dropdown', async () => {
        const share = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'share', {
            value: share,
            configurable: true,
        });
        Object.defineProperty(window.navigator, 'canShare', {
            value: () => false,
            configurable: true,
        });
        try {
            const fixture = TestBed.createComponent(Wave2Host);
            const host = fixture.componentInstance;
            host.features.set([withShare({ preferNativeShare: true })]);
            await flush(fixture);
            await openAndLoad(fixture);

            (query('.lg-share') as HTMLButtonElement).click();
            await flush(fixture);
            expect(share).not.toHaveBeenCalled();
            expect(
                query('.lg-outer')!.classList.contains('lg-dropdown-active'),
            ).toBe(true);
        } finally {
            delete (window.navigator as { share?: unknown }).share;
            delete (window.navigator as { canShare?: unknown }).canShare;
        }
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
        expect(rotateEl.style.transform).toBe('rotate(90deg) scale3d(1, 1, 1)');
        await advance(fixture, 500);
        expect(host.log).toContain('rotateRight:90');

        (query('.lg-flip-hor') as HTMLButtonElement).click();
        await flush(fixture);
        // At 90 deg the visual flip axis swaps (headless rule).
        expect(rotateEl.style.transform).toBe(
            'rotate(90deg) scale3d(1, -1, 1)',
        );
    });

    it('rotate: refits a landscape image into the stage at 90 degrees', async () => {
        const fixture = TestBed.createComponent(Wave2Host);
        const host = fixture.componentInstance;
        host.features.set([withRotate()]);
        await flush(fixture);
        await openAndLoad(fixture);

        const rotateEl = query('.lg-item.lg-current .lg-img-rotate')!;
        const image = rotateEl.querySelector<HTMLElement>('.lg-object')!;
        // Landscape image (921x614) fitted into a 1265x614 stage — its
        // 921px width runs vertically after a 90° rotation.
        Object.defineProperty(image, 'offsetWidth', { value: 921 });
        Object.defineProperty(image, 'offsetHeight', { value: 614 });
        Object.defineProperty(rotateEl, 'clientWidth', { value: 1265 });
        Object.defineProperty(rotateEl, 'clientHeight', { value: 614 });

        (query('.lg-rotate-right') as HTMLButtonElement).click();
        await flush(fixture);
        const scale = 614 / 921;
        expect(rotateEl.style.transform).toBe(
            `rotate(90deg) scale3d(${scale}, ${scale}, 1)`,
        );
        await advance(fixture, 500);

        // Back at 180° the laid-out fit applies again: scale 1.
        (query('.lg-rotate-right') as HTMLButtonElement).click();
        await flush(fixture);
        expect(rotateEl.style.transform).toBe(
            'rotate(180deg) scale3d(1, 1, 1)',
        );
        await advance(fixture, 500);
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

    it('media position: reserves the toolbar, caption and thumbnail strip', async () => {
        // jsdom has no layout: give the bars real-looking heights.
        const heights = vi
            .spyOn(Element.prototype, 'clientHeight', 'get')
            .mockImplementation(function (this: Element) {
                if (this.classList.contains('lg-toolbar')) return 40;
                if (this.classList.contains('lg-thumb-outer')) return 100;
                // A caption only takes space once it has content.
                if (this.classList.contains('lg-sub-html')) {
                    return this.textContent?.trim() ? 30 : 0;
                }
                return 0;
            });
        try {
            const fixture = TestBed.createComponent(Wave2Host);
            fixture.componentInstance.features.set([withThumbnail()]);
            await flush(fixture);
            await openAndLoad(fixture);
            const content = query('.lg-content') as HTMLElement;
            expect(content.style.top).toBe('40px');
            expect(content.style.bottom).toBe('130px');
            // The caption host must lay out as a block, like vanilla's div.
            const caption = query('.lg-components .lg-sub-html')!;
            expect(getComputedStyle(caption).display).toBe('block');
        } finally {
            heights.mockRestore();
        }
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

describe('plugin label strings (core alias)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('resolves labels from core strings, legacy plugin strings winning', async () => {
        const fixture = TestBed.createComponent(Wave2Host);
        const host = fixture.componentInstance;
        host.strings.set({ toggleAutoplay: 'Diaporama', share: 'Partager' });
        host.features.set([
            withAutoplay({
                autoplayPluginStrings: { toggleAutoplay: 'Legacy autoplay' },
            }),
            withShare(),
        ]);
        await flush(fixture);
        await openAndLoad(fixture);
        // The deprecated per-plugin alias wins where explicitly set…
        expect(query('.lg-autoplay-button')?.getAttribute('aria-label')).toBe(
            'Legacy autoplay',
        );
        // …and the core strings drive every other plugin label.
        expect(query('.lg-share')?.getAttribute('aria-label')).toBe('Partager');
    });
});
