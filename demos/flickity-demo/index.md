# Flickity carousel demo with lightbox gallery

> Flickity carousel demo with a lightbox gallery on every cell, click to open full-screen, with thumbnails, zoom and video support.

[Flickity](https://flickity.metafizzy.co/) makes carousels, galleries, & sliders that feel lively and effortless. Flickity can be used for creating beautiful image galleries with thumbnails. Here is the demo of adding lightbox gallery support for the Flickity carousel.

Canonical page: https://www.lightgalleryjs.com/demos/flickity-demo/

#### Demo

Letting go of a mouse drag also clicks the cell under the pointer, so each
example stops that click before it reaches the cell and only a plain click
opens the gallery.

**JavaScript**

**HTML**

```html
<div id="flickity-carousel-gallery-demo" class="main-carousel">
    <a data-lg-size="1600-1200" href="img/img1.jpg" class="carousel-cell">
        <img src="img/thumb1.jpg" />
    </a>
    <a data-lg-size="1600-1200" href="img/img2.jpg" class="carousel-cell">
        <img src="img/thumb2.jpg" />
    </a>
    <!-- more items -->
</div>
```

**JavaScript**

```js
import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import Flickity from 'flickity';

const carousel = document.getElementById('flickity-carousel-gallery-demo');

// True from the start of a drag until the click that ends it
let dragged = false;

new Flickity(carousel, {
    cellAlign: 'center',
    pageDots: false,
    contain: true,
    autoPlay: true,
    on: {
        // Flickity moves the cells into its own slider element. Create
        // the gallery on that element once the carousel is ready
        ready() {
            lightGallery(document.querySelector('.flickity-slider'), {
                plugins: [lgZoom, lgThumbnail],
                selector: '.carousel-cell',
            });
        },
        pointerDown() {
            dragged = false;
        },
        dragStart() {
            dragged = true;
        },
    },
});

// Stop the click that ends a drag before it reaches the cell
carousel.addEventListener(
    'click',
    (event) => {
        if (dragged) {
            dragged = false;
            event.preventDefault();
            event.stopPropagation();
        }
    },
    true,
);
```

**React**

```tsx
import { useEffect, useRef, type MouseEvent } from 'react';
import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';
import Flickity from 'flickity';

// `lgSize` is the full-size image's WIDTH-HEIGHT; it lets the image
// open from its cell.
const items = [
    {
        src: 'img/img1.jpg',
        thumb: 'img/thumb1.jpg',
        alt: 'Mountains',
        lgSize: '1600-1200',
    },
    {
        src: 'img/img2.jpg',
        thumb: 'img/thumb2.jpg',
        alt: 'Forest path',
        lgSize: '1600-1200',
    },
];

const carousel = useRef<HTMLDivElement>(null);
// True from the start of a drag until the click that ends it
const dragged = useRef(false);

// Create the carousel once its cells are in the page
useEffect(() => {
    const flickity = new Flickity(carousel.current!, {
        cellAlign: 'center',
        pageDots: false,
        contain: true,
        autoPlay: true,
        on: {
            pointerDown() {
                dragged.current = false;
            },
            dragStart() {
                dragged.current = true;
            },
        },
    });
    return () => flickity.destroy();
}, []);

// Stop the click that ends a drag before it reaches the cell
const stopDragClick = (event: MouseEvent) => {
    if (dragged.current) {
        dragged.current = false;
        event.preventDefault();
        event.stopPropagation();
    }
};

<LightGallery plugins={[Zoom, Thumbnail]}>
    <div ref={carousel} className="main-carousel" onClickCapture={stopDragClick}>
        {items.map((item) => (
            <LightGalleryItem
                key={item.src}
                className="carousel-cell"
                item={item}
                href={item.src}
            >
                <img src={item.thumb} alt={item.alt} />
            </LightGalleryItem>
        ))}
    </div>
</LightGallery>;
```

**Vue**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
import { LightGallery, LgItem, type LgGalleryItem } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';
import Flickity from 'flickity';

const plugins = [Zoom, Thumbnail];

// `lgSize` is the full-size image's WIDTH-HEIGHT; it lets the image
// open from its cell.
const items: LgGalleryItem[] = [
    {
        src: 'img/img1.jpg',
        thumb: 'img/thumb1.jpg',
        alt: 'Mountains',
        lgSize: '1600-1200',
    },
    {
        src: 'img/img2.jpg',
        thumb: 'img/thumb2.jpg',
        alt: 'Forest path',
        lgSize: '1600-1200',
    },
];

const carousel = useTemplateRef('carousel');
let flickity: Flickity | undefined;
// True from the start of a drag until the click that ends it
let dragged = false;

// Create the carousel once its cells are in the page
onMounted(() => {
    flickity = new Flickity(carousel.value!, {
        cellAlign: 'center',
        pageDots: false,
        contain: true,
        autoPlay: true,
        on: {
            pointerDown() {
                dragged = false;
            },
            dragStart() {
                dragged = true;
            },
        },
    });
});
onBeforeUnmount(() => flickity?.destroy());

// Stop the click that ends a drag before it reaches the cell
function stopDragClick(event: MouseEvent) {
    if (dragged) {
        dragged = false;
        event.preventDefault();
        event.stopPropagation();
    }
}
</script>

<template>
    <LightGallery :plugins="plugins">
        <div ref="carousel" class="main-carousel" @click.capture="stopDragClick">
            <LgItem
                v-for="item of items"
                :key="item.src"
                class="carousel-cell"
                :item="item"
            >
                <img :src="item.thumb" :alt="item.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>
```

**Angular**

```ts
import {
    afterNextRender,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    viewChild,
} from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';
import Flickity from 'flickity';

@Component({
    selector: 'app-gallery',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <lg-gallery [features]="features">
            <div #carousel class="main-carousel">
                @for (item of items; track item.src) {
                    <a class="carousel-cell" [href]="item.src" [lgGalleryItem]="item">
                        <img [src]="item.thumb" [alt]="item.alt" />
                    </a>
                }
            </div>
        </lg-gallery>
    `,
})
export class Gallery {
    features = [withZoom(), withThumbnail()];

    // `lgSize` is the full-size image's WIDTH-HEIGHT; it lets the image
    // open from its cell.
    items: LgGalleryItem[] = [
        {
            src: 'img/img1.jpg',
            thumb: 'img/thumb1.jpg',
            alt: 'Mountains',
            lgSize: '1600-1200',
        },
        {
            src: 'img/img2.jpg',
            thumb: 'img/thumb2.jpg',
            alt: 'Forest path',
            lgSize: '1600-1200',
        },
    ];

    carousel = viewChild.required<ElementRef<HTMLElement>>('carousel');

    constructor() {
        let flickity: Flickity | undefined;
        // True from the start of a drag until the click that ends it
        let dragged = false;

        // Create the carousel once its cells are in the page
        afterNextRender(() => {
            const element = this.carousel().nativeElement;

            flickity = new Flickity(element, {
                cellAlign: 'center',
                pageDots: false,
                contain: true,
                autoPlay: true,
                on: {
                    pointerDown() {
                        dragged = false;
                    },
                    dragStart() {
                        dragged = true;
                    },
                },
            });

            // Stop the click that ends a drag before it reaches the cell
            element.addEventListener(
                'click',
                (event) => {
                    if (dragged) {
                        dragged = false;
                        event.preventDefault();
                        event.stopPropagation();
                    }
                },
                true,
            );
        });
        inject(DestroyRef).onDestroy(() => flickity?.destroy());
    }
}
```

##### SCSS (Optional)

```scss
.flickity-slider {
    .lg-item {
        img {
            height: 600px;
        }
    }
}
```
