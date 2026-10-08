# Recipe: `NgOptimizedImage` slides (Angular)

Render lightbox slides through Angular's `NgOptimizedImage` directive with a
custom `slideRenderer` feature. The gallery keeps zoom, gestures, thumbnails and
the zoom-from-origin flight because the recipe honors the three contracts listed
after the code.

## The recipe

```ts
import { Component, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {
    LG_PLUGIN_CONTEXT,
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgFeature,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withZoom } from '@lightgallery/angular/plugins/zoom';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';

type OptimizedItem = LgGalleryItem & { optimized?: boolean };

@Component({
    selector: 'app-optimized-slide',
    imports: [NgOptimizedImage],
    template: `
        <picture class="lg-img-wrap">
            <img
                class="lg-object lg-image"
                [attr.data-index]="index()"
                [ngSrc]="item().src!"
                fill
                sizes="100vw"
                [alt]="item().alt ?? ''"
                (load)="markLoaded()"
            />
        </picture>
    `,
})
export class OptimizedSlideComponent {
    readonly item = input.required<LgGalleryItem>();
    readonly index = input.required<number>();
    private readonly ctx = inject(LG_PLUGIN_CONTEXT);

    markLoaded(): void {
        this.ctx.actions.dispatch({
            type: 'SLIDE_LOADED',
            index: this.index(),
        });
    }
}

export const optimizedImageFeature: LgFeature = {
    name: 'optimizedImage',
    slideRenderer: {
        component: OptimizedSlideComponent,
        canRender: (item) => !!(item as OptimizedItem).optimized,
    },
};

@Component({
    selector: 'app-gallery',
    imports: [LgGalleryComponent, LgGalleryItemDirective, NgOptimizedImage],
    template: `
        <lg-gallery [features]="features">
            @for (item of items; track item.src) {
            <a [href]="item.src" [lgGalleryItem]="item">
                <img
                    [ngSrc]="item.thumb!"
                    width="240"
                    height="160"
                    [alt]="item.alt"
                />
            </a>
            }
        </lg-gallery>
    `,
})
export class GalleryComponent {
    readonly features = [optimizedImageFeature, withZoom(), withThumbnail()];
    readonly items: OptimizedItem[] = [
        {
            src: '/photos/river.jpg',
            thumb: '/photos/river-thumb.jpg',
            alt: 'River between mountains',
            lgSize: '1600-1067', // full-resolution dims — see contract 3
            optimized: true,
        },
    ];
}
```

## The three contracts

1. **Keep the classes.** `picture.lg-img-wrap` around an image carrying
   `lg-object lg-image` + `data-index`. The stylesheet, the zoom plugin
   (double-tap targets `.lg-image`) and the gesture layer key off these — with
   them, the custom slide inherits zoom, pan and pinch untouched.
2. **Mark the slide loaded.** Inject `LG_PLUGIN_CONTEXT` and dispatch
   `{ type: 'SLIDE_LOADED', index: this.index() }` from the image's `(load)`
   handler. This drops the spinner (`lg-complete`), starts neighbor preloading,
   and drives the first-slide choreography.
3. **Declare the real resolution.** The optimizer manages `srcset` itself, which
   makes `img.naturalWidth` report a density-corrected size — without help,
   actual-size zoom collapses to ~1× on phones. Declare the true size on the
   item: `lgSize: '1600-1067'` (already set for the zoom-from-origin flight) or
   `width: '1600'`.

## Caveats

-   **First-slide thumb-dummy**: the built-in renderer flies the trigger's
    thumbnail as a placeholder during the zoom-from-origin flight; custom
    renderers don't take part — bring your own placeholder (blur placeholders
    above) if the flight window matters to you.
-   Skipping contract 3 degrades only actual-size zoom depth; nothing else
    breaks.
-   `fill` mode needs a positioned ancestor; `.lg-img-wrap` provides one inside
    the slide box.
-   SSR: the gallery renders its overlay client-side only (CDK overlay attaches
    after bootstrap), so slide components never run on the server.
    `NgOptimizedImage`'s LCP warnings don't apply inside the lightbox — set
    `priority` only on your page's trigger thumbnails.
-   The trigger thumbnails in the example also use `ngSrc` — they're plain page
    content and follow the directive's usual rules (width/height required,
    etc.).
