# Swiper.js demo with lightbox gallery

> Swiper slider demo with a lightbox gallery on every slide, open any slide full-screen with thumbnails, zoom and video support.

[SwiperJs](https://swiperjs.com/) is one of the most popular JavaScript carousel/slider libraries. Swiper can be used for creating beautiful image galleries with thumbnails. Here is the demo of adding lightbox gallery support for the Swiper carousel.

Canonical page: https://www.lightgalleryjs.com/demos/swiper/

#### Demo

    
    
        {photos('street', 4).map((p) => (
            <a data-lg-size={`${p.width}-${p.height}`} class="swiper-slide" data-src={p.src} data-sub-html={p.caption}>
                <img class="img-responsive" alt={p.alt} src={p.sizes[1].src} />
            </a>
        ))}
    
    
    
    
    

**JavaScript**

**HTML**

```html
<div class="swiper">
    <div class="swiper-wrapper" id="lg-swiper">
        <a class="swiper-slide" href="img/img1.jpg" data-lg-size="1600-1200">
            <img src="img/thumb1.jpg" />
        </a>
        <a class="swiper-slide" href="img/img2.jpg" data-lg-size="1600-1200">
            <img src="img/thumb2.jpg" />
        </a>
        <!-- more items -->
    </div>

    <!-- If we need navigation buttons -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
</div>
```

**JavaScript**

```js
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import lightGallery from 'lightgallery';

const slides = document.getElementById('lg-swiper');

new Swiper('.swiper', {
    // other parameters
    modules: [Navigation],
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    on: {
        // Create the gallery once the carousel is ready
        init(swiper) {
            const gallery = lightGallery(slides);

            // Before the gallery closes, move the carousel to the slide
            // the gallery is showing, so the image closes into its slide
            slides.addEventListener('lgBeforeClose', () => {
                swiper.slideTo(gallery.index, 0);
            });
        },
    },
});
```

**React**

```tsx
import { useRef } from 'react';
import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react';

// `lgSize` is the full-size image's WIDTH-HEIGHT; it lets the image
// open from its slide.
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

const swiper = useRef<SwiperClass | null>(null);

// When the gallery goes to another slide, move the carousel to the same
// slide, so the image closes into its slide
<LightGallery onBeforeSlide={({ index }) => swiper.current?.slideTo(index, 0)}>
    <Swiper
        modules={[Navigation]}
        navigation
        onSwiper={(instance) => {
            swiper.current = instance;
        }}
    >
        {items.map((item) => (
            <SwiperSlide key={item.src}>
                <LightGalleryItem item={item} href={item.src}>
                    <img src={item.thumb} alt={item.alt} />
                </LightGalleryItem>
            </SwiperSlide>
        ))}
    </Swiper>
</LightGallery>;
```

**Vue**

```vue
<script setup lang="ts">
import {
    LightGallery,
    LgItem,
    type LgGalleryItem,
    type SlideEventDetail,
} from '@lightgallery/vue';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/vue';

// `lgSize` is the full-size image's WIDTH-HEIGHT; it lets the image
// open from its slide.
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

const modules = [Navigation];

let swiper: SwiperClass | undefined;

function setSwiper(instance: SwiperClass) {
    swiper = instance;
}

// When the gallery goes to another slide, move the carousel to the same
// slide, so the image closes into its slide
function followGallery({ index }: SlideEventDetail) {
    swiper?.slideTo(index, 0);
}
</script>

<template>
    <LightGallery @before-slide="followGallery">
        <Swiper :modules="modules" navigation @swiper="setSwiper">
            <SwiperSlide v-for="item of items" :key="item.src">
                <LgItem :item="item">
                    <img :src="item.thumb" :alt="item.alt" />
                </LgItem>
            </SwiperSlide>
        </Swiper>
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
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

@Component({
    selector: 'app-gallery',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <!-- When the gallery goes to another slide, move the carousel to
             the same slide, so the image closes into its slide -->
        <lg-gallery (beforeSlide)="swiper?.slideTo($event.index, 0)">
            <div #carousel class="swiper">
                <div class="swiper-wrapper">
                    @for (item of items; track item.src) {
                        <a class="swiper-slide" [href]="item.src" [lgGalleryItem]="item">
                            <img [src]="item.thumb" [alt]="item.alt" />
                        </a>
                    }
                </div>

                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </lg-gallery>
    `,
})
export class Gallery {
    // `lgSize` is the full-size image's WIDTH-HEIGHT; it lets the image
    // open from its slide.
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

    swiper?: Swiper;
    carousel = viewChild.required<ElementRef<HTMLElement>>('carousel');

    constructor() {
        // Create the carousel once its slides are in the page
        afterNextRender(() => {
            this.swiper = new Swiper(this.carousel().nativeElement, {
                modules: [Navigation],
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        });
        inject(DestroyRef).onDestroy(() => this.swiper?.destroy());
    }
}
```

##### CSS (Optional)

```css
.swiper-lg-wrap {
    width: 1200px;
    height: 0;
    padding-bottom: 65%;
    position: relative;
    max-width: 100%;
}
.swiper {
    width: 100%;
    height: 100%;
    position: absolute !important;
}
```
