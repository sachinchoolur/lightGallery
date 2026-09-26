/**
 * Standalone consumer app for `@lightgallery/angular`.
 *
 * Resolves the package through its published dist and `exports` map
 * rather than a source alias, and splits the feature surface into
 * hash-routed pages shared with the React and Vue apps, so the same page
 * can be opened in all three on any device.
 */
import {
    Component,
    provideZonelessChangeDetection,
    signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import {
    PAGES,
    isPageHash,
    pageFromHash,
    type PageId,
} from '../../shared/media';
import { CombinationsPage } from './pages/combinations';
import { JustifiedPage } from './pages/justified';
import { MixedPage } from './pages/mixed';
import { SizesPage } from './pages/sizes';
import { ThumbnailsPage } from './pages/thumbnails';
import { VideoPage } from './pages/video';

import '../../shared/demo.css';
// CSS stays a consumer import (ADR 0001 §7) — never bundled by the package.
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-transitions.css';
import 'lightgallery/css/lg-rtl.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-pager.css';
import 'lightgallery/css/lg-share.css';
import 'lightgallery/css/lg-rotate.css';
import 'lightgallery/css/lg-comments.css';
import 'lightgallery/css/lg-medium-zoom.css';
import 'lightgallery/css/lg-justified.css';

@Component({
    selector: 'demo-root',
    imports: [
        CombinationsPage,
        JustifiedPage,
        MixedPage,
        SizesPage,
        ThumbnailsPage,
        VideoPage,
    ],
    template: `
        <main class="demo">
            <h1>&#64;lightgallery/angular — consumer app</h1>
            <p class="note">
                Resolved through the package <code>exports</code> map, not a
                source alias. The same pages exist in the React and Vue apps.
            </p>
            <nav class="demo-nav">
                @for (entry of pages; track entry.id) {
                    <a
                        [href]="'#' + entry.id"
                        [class.active]="entry.id === page()"
                    >
                        {{ entry.title }}
                    </a>
                }
            </nav>
            @switch (page()) {
                @case ('combinations') {
                    <page-combinations />
                }
                @case ('sizes') {
                    <page-sizes />
                }
                @case ('thumbnails') {
                    <page-thumbnails />
                }
                @case ('video') {
                    <page-video />
                }
                @case ('justified') {
                    <page-justified />
                }
                @case ('mixed') {
                    <page-mixed />
                }
            }
        </main>
    `,
})
export class DemoRoot {
    readonly pages = PAGES;
    readonly page = signal<PageId>(pageFromHash(window.location.hash));

    constructor() {
        window.addEventListener('hashchange', () => {
            if (isPageHash(window.location.hash)) {
                this.page.set(pageFromHash(window.location.hash));
            }
        });
    }
}

void bootstrapApplication(DemoRoot, {
    providers: [provideZonelessChangeDetection()],
});
