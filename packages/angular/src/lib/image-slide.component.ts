import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
} from '@angular/core';

import type { LgGalleryItem } from './types';

/**
 * Default image renderer: `<picture class="lg-img-wrap">` with optional
 * `<source>` entries and the `lg-object lg-image` img — the same DOM the
 * vanilla core produces, so `lightgallery/css` styles it unchanged.
 */
@Component({
    selector: 'lg-image-slide',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <picture class="lg-img-wrap">
            @for (source of item().sources ?? []; track $index) {
                <source
                    [attr.media]="source.media ?? null"
                    [attr.srcset]="source.srcset"
                    [attr.sizes]="source.sizes ?? null"
                    [attr.type]="source.type ?? null"
                />
            }
            <img
                class="lg-object lg-image"
                [attr.data-index]="index()"
                [attr.src]="item().src ?? null"
                [attr.srcset]="item().srcset ?? null"
                [attr.sizes]="item().sizes ?? null"
                [alt]="item().alt ?? ''"
                draggable="false"
                (load)="mediaLoad.emit()"
                (error)="mediaError.emit()"
                (dragstart)="$event.preventDefault()"
            />
        </picture>
    `,
})
export class LgImageSlideComponent {
    readonly item = input.required<LgGalleryItem>();
    readonly index = input.required<number>();
    /** Native image dragging would swallow the swipe gesture. */
    readonly mediaLoad = output<void>();
    readonly mediaError = output<void>();
}
