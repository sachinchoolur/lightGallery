// @vitest-environment node
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
    provideServerRendering,
    renderApplication,
} from '@angular/platform-server';
import { describe, expect, it } from 'vitest';

import {
    LgCaptionDirective,
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withHash } from '@lightgallery/angular/plugins/hash';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

/**
 * SSR smoke: the package renders on the server
 * with zoneless change detection and no browser globals — the closed
 * gallery emits only its projected triggers; the overlay never
 * server-renders (nothing to hydrate-mismatch); eager feature services
 * (hash) no-op without `window`.
 */

const ITEMS: LgGalleryItem[] = [
    { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'First slide' },
    { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'Second slide' },
];

@Component({
    selector: 'ssr-host',
    imports: [LgGalleryComponent, LgGalleryItemDirective, LgCaptionDirective],
    template: `
        <lg-gallery [features]="features">
            @for (item of items; track item.src) {
                <a class="ssr-trigger" [lgGalleryItem]="item">
                    <img [src]="item.thumb" [alt]="item.alt" />
                </a>
            }
            <ng-template lgCaption let-item>{{ item?.alt }}</ng-template>
        </lg-gallery>
        <lg-gallery [slides]="items" [open]="true" (init)="onInit()" />
    `,
})
class SsrHost {
    readonly items = ITEMS;
    readonly features = [withThumbnail(), withZoom(), withHash()];

    onInit(): void {
        serverInits += 1;
    }
}

const DOC =
    '<html><head><title>ssr</title></head><body><ssr-host></ssr-host></body></html>';

/** `(init)` emissions seen on the server — a mount event, so none. */
let serverInits = 0;

describe('SSR (platform-server, zoneless)', () => {
    it('server-renders closed and open galleries without browser globals', async () => {
        const html = await renderApplication(
            (context) =>
                bootstrapApplication(
                    SsrHost,
                    {
                        providers: [
                            provideServerRendering(),
                            provideZonelessChangeDetection(),
                        ],
                    },
                    context,
                ),
            { document: DOC },
        );

        // Triggers render as static markup for SEO/no-JS.
        expect(html).toContain('ssr-trigger');
        expect(html).toContain('alt="First slide"');
        expect(html).toContain('alt="Second slide"');
        // Anchors without an href link to the image for no-JS visitors.
        expect(html).toContain('href="a.jpg"');
        expect(html).toContain('href="b.jpg"');
        // The lightbox itself never server-renders — even for the gallery
        // whose [open] is true at bootstrap (browser-only overlay).
        expect(html).not.toContain('lg-container');
        expect(html).not.toContain('lg-outer');
        // No zone.js in the server bundle path.
        expect(html).toContain('ng-server-context');
        // `init` is a mount event (React's effect, Vue's onMounted): the
        // server never emits it, even for the gallery open at bootstrap.
        expect(serverInits).toBe(0);
    });
});
