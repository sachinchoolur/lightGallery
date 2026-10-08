import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    output,
} from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';

import { LgGalleryRuntime } from './runtime';
import type { LgGalleryItem } from './types';

/** Iframe slide renderer — 2.x `getIframeMarkup`. */
@Component({
    selector: 'lg-iframe-slide',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div
            class="lg-media-cont lg-has-iframe"
            [style.width]="runtime.settings().iframeWidth"
            [style.max-width]="runtime.settings().iframeMaxWidth"
            [style.height]="runtime.settings().iframeHeight"
            [style.max-height]="runtime.settings().iframeMaxHeight"
        >
            <iframe
                class="lg-object"
                frameborder="0"
                [attr.title]="
                    item().iframeTitle ?? item().title ?? 'Embedded content'
                "
                [attr.src]="src()"
                allowfullscreen
                (load)="mediaLoad.emit()"
            ></iframe>
        </div>
    `,
})
export class LgIframeSlideComponent {
    readonly item = input.required<LgGalleryItem>();
    readonly index = input.required<number>();
    readonly mediaLoad = output<void>();

    protected readonly runtime = inject(LgGalleryRuntime);
    private readonly sanitizer = inject(DomSanitizer);

    // An iframe's src is a resource URL to Angular, which rejects a plain
    // string there (NG0904). The item's `src` is the URL the application
    // chose to embed, so it is trusted as given, like a video embed URL.
    protected readonly src = computed<SafeResourceUrl | null>(() => {
        const url = this.item().src;
        return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
    });
}
