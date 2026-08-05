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
            @if (!deferSrc()) { @for (source of item().sources ?? []; track
            $index) {
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
                (load)="mediaLoad.emit($event)"
                (error)="mediaError.emit()"
                (dragstart)="$event.preventDefault()"
            />
            } @if (dummySrc(); as dummy) {
            <!-- v2 sizes the dummy to the fitted image box with
                     inline width/height; containing it inside the full
                     wrap lands the same visible box without measuring. -->
            <img
                class="lg-dummy-img"
                [attr.src]="dummy"
                alt=""
                aria-hidden="true"
                draggable="false"
                style="width: 100%; height: 100%; object-fit: contain; transform: translate(-50%, -50%)"
            />
            }
        </picture>
    `,
})
export class LgImageSlideComponent {
    readonly item = input.required<LgGalleryItem>();
    readonly index = input.required<number>();
    /** First-slide dummy (2.x): the thumb that flies while `src` loads. */
    readonly dummySrc = input<string | null>(null);
    /** Hold back the real img while the origin flight runs (2.x). */
    readonly deferSrc = input(false);
    /** Native image dragging would swallow the swipe gesture. */
    readonly mediaLoad = output<Event>();
    readonly mediaError = output<void>();
}
