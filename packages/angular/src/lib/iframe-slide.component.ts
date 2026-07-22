import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output,
} from '@angular/core';

import { LgGalleryRuntime } from './runtime';
import type { LgGalleryItem } from './types';

/** Iframe slide renderer (deferred from plan 003), 2.x `getIframeMarkup`. */
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
                [attr.title]="
                    item().iframeTitle ?? item().title ?? 'Embedded content'
                "
                [attr.src]="item().src ?? null"
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
}
