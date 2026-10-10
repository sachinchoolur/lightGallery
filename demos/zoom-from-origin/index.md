# Zoom image from origin

> Zoom-from-origin demo: slides open from the clicked thumbnail's position and close back to it, from cropped thumbnails too.

Zoom images from their origin while opening the image gallery.

Canonical page: https://www.lightgalleryjs.com/demos/zoom-from-origin/

You need to know the original image size upfront and provide it via data-lg-size attribute as data-lg-size="1920-1280"
(`lgSize: '1920-1280'` on an item object). Image optimizers, build-time image plugins and CMS APIs all expose the natural width and height.

If you don't know the size of a few images in the list, you can skip the data-lg-size attribute for the particular slides;
lightGallery will show the default animation if data-lg-size is not available.

On close, the slide flies back to its thumbnail. A slide with no thumbnail to return to, because its trigger is hidden or collapsed
(the overflow photos behind a "+9 photos" tile in a collage) or because it has no data-lg-size, shrinks to the centre of the
screen and fades out instead. The same happens when `zoomFromOrigin` is off or the gallery is dynamic.

#### Demo

**JavaScript**

**HTML**

```html
<div id="gallery-zoom-from-origin-demo">
    <a
        data-lg-size="1600-1067"
        href="img/img1.jpg"
    >
        <img src="img/thumb1.jpg" />
    </a>
    <a
        data-lg-size="1600-1067"
        href="img/img2.jpg"
    >
        <img src="img/thumb2.jpg" />
    </a>
    <!-- more items -->
</div>
```

**JavaScript**

```js
import lightGallery from 'lightgallery';

lightGallery(document.getElementById('gallery-zoom-from-origin-demo'), {
    // on by default, the lightbox grows out of the clicked thumbnail
    zoomFromOrigin: true,
});
```

**React**

```tsx
import { LightGallery, LightGalleryItem } from '@lightgallery/react';

const items = [
    {
        src: 'img/img1.jpg',
        thumb: 'img/thumb1.jpg',
        alt: 'Mountains',
        // "WIDTH-HEIGHT" of the full-size image: required for the flight
        lgSize: '1600-1067',
    },
    {
        src: 'img/img2.jpg',
        thumb: 'img/thumb2.jpg',
        alt: 'Forest path',
        lgSize: '1600-2400',
    },
];

// On by default: the slide grows out of the clicked thumbnail. The
// trigger element is measured automatically; in controlled mode pass
// originRect instead.
<LightGallery zoomFromOrigin>
    {items.map((item) => (
        <LightGalleryItem key={item.src} item={item}>
            <img src={item.thumb} alt={item.alt} />
        </LightGalleryItem>
    ))}
</LightGallery>;
```

**Vue**

```vue
<script setup>
import { LightGallery, LgItem } from '@lightgallery/vue';

const items = [
    {
        src: 'img/img1.jpg',
        thumb: 'img/thumb1.jpg',
        alt: 'Mountains',
        // "WIDTH-HEIGHT" of the full-size image: required for the flight
        lgSize: '1600-1067',
    },
    {
        src: 'img/img2.jpg',
        thumb: 'img/thumb2.jpg',
        alt: 'Forest path',
        lgSize: '1600-2400',
    },
];
</script>

<template>
    <!-- On by default: the slide grows out of the clicked thumbnail. -->
    <LightGallery :zoom-from-origin="true">
        <LgItem v-for="item of items" :key="item.src" :item="item">
            <img :src="item.thumb" :alt="item.alt" />
        </LgItem>
    </LightGallery>
</template>
```

**Angular**

```ts
import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';

@Component({
    selector: 'app-gallery',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <!-- On by default: the slide grows out of the clicked thumbnail. -->
        <lg-gallery [zoomFromOrigin]="true">
            @for (item of items; track item.src) {
                <a [lgGalleryItem]="item">
                    <img [src]="item.thumb" [alt]="item.alt" />
                </a>
            }
        </lg-gallery>
    `,
})
export class Gallery {
    items: LgGalleryItem[] = [
        {
            src: 'img/img1.jpg',
            thumb: 'img/thumb1.jpg',
            alt: 'Mountains',
            // "WIDTH-HEIGHT" of the full-size image: required for the flight
            lgSize: '1600-1067',
        },
        {
            src: 'img/img2.jpg',
            thumb: 'img/thumb2.jpg',
            alt: 'Forest path',
            lgSize: '1600-2400',
        },
    ];
}
```

#### Cropped thumbnails

A grid tile that shows only part of the photo, an `img` with `object-fit: cover` or an element with `background-size: cover`,
flies as a whole by default, squashed into its box. The origin crop plugin flies it from its crop instead: the part the tile
shows grows at a uniform scale and the rest of the photo is revealed around it, following `object-position` or
`background-position`. Nothing is needed in the markup or the stylesheets; the plugin reads the thumbnail's computed fit, and
thumbnails the built-in flight already lands exactly keep it. A thumbnail file that is itself a crop of the photo is taken as
a centred crop.

The tiles below are square and crop portrait and landscape photos alike, each from a different `object-position`. Open one,
then untick the plugin and open it again to compare with the default flight.

<label class="demo-toggle"><input type="checkbox" id="toggle-origin-crop" checked /> Origin crop plugin</label>

**JavaScript**

**HTML**

```html
<div id="gallery-cropped-thumbnails" class="tiles">
    <a data-lg-size="1600-1067" href="img/img1.jpg">
        <img src="img/thumb1.jpg" style="object-position: 0% 50%" />
    </a>
    <a data-lg-size="1067-1600" href="img/img2.jpg">
        <img src="img/thumb2.jpg" style="object-position: 50% 0%" />
    </a>
    <!-- more items -->
</div>
```

**CSS**

```css
.tiles img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
}
```

**JavaScript**

```js
import lightGallery from 'lightgallery';
import lgOriginCrop from 'lightgallery/plugins/originCrop';

lightGallery(document.getElementById('gallery-cropped-thumbnails'), {
    plugins: [lgOriginCrop],
});
```

**React**

```tsx
import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import OriginCrop from '@lightgallery/react/plugins/originCrop';

const items = [
    {
        src: 'img/img1.jpg',
        thumb: 'img/thumb1.jpg',
        alt: 'Mountains',
        // "WIDTH-HEIGHT" of the full-size image: required for the flight
        lgSize: '1600-1067',
        // the part of the photo the tile shows
        position: '0% 50%',
    },
    {
        src: 'img/img2.jpg',
        thumb: 'img/thumb2.jpg',
        alt: 'Forest path',
        lgSize: '1067-1600',
        position: '50% 0%',
    },
];

// `.tiles img` is square and crops with `object-fit: cover`.
<LightGallery plugins={[OriginCrop]}>
    <div className="tiles">
        {items.map((item) => (
            <LightGalleryItem key={item.src} item={item}>
                <img
                    src={item.thumb}
                    alt={item.alt}
                    style={{ objectPosition: item.position }}
                />
            </LightGalleryItem>
        ))}
    </div>
</LightGallery>;
```

**Vue**

```vue
<script setup>
import { LightGallery, LgItem } from '@lightgallery/vue';
import OriginCrop from '@lightgallery/vue/plugins/originCrop';

const plugins = [OriginCrop];
const items = [
    {
        src: 'img/img1.jpg',
        thumb: 'img/thumb1.jpg',
        alt: 'Mountains',
        // "WIDTH-HEIGHT" of the full-size image: required for the flight
        lgSize: '1600-1067',
        // the part of the photo the tile shows
        position: '0% 50%',
    },
    {
        src: 'img/img2.jpg',
        thumb: 'img/thumb2.jpg',
        alt: 'Forest path',
        lgSize: '1067-1600',
        position: '50% 0%',
    },
];
</script>

<template>
    <!-- `.tiles img` is square and crops with `object-fit: cover`. -->
    <LightGallery :plugins="plugins">
        <div class="tiles">
            <LgItem v-for="item of items" :key="item.src" :item="item">
                <img
                    :src="item.thumb"
                    :alt="item.alt"
                    :style="{ objectPosition: item.position }"
                />
            </LgItem>
        </div>
    </LightGallery>
</template>
```

**Angular**

```ts
import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withOriginCrop } from '@lightgallery/angular/plugins/originCrop';

@Component({
    selector: 'app-gallery',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <!-- .tiles img is square and crops with object-fit: cover. -->
        <lg-gallery [features]="features">
            <div class="tiles">
                @for (item of items; track item.src) {
                    <a [lgGalleryItem]="item">
                        <img
                            [src]="item.thumb"
                            [alt]="item.alt"
                            [style.object-position]="item.position"
                        />
                    </a>
                }
            </div>
        </lg-gallery>
    `,
})
export class Gallery {
    features = [withOriginCrop()];

    items = [
        {
            src: 'img/img1.jpg',
            thumb: 'img/thumb1.jpg',
            alt: 'Mountains',
            // "WIDTH-HEIGHT" of the full-size image: required for the flight
            lgSize: '1600-1067',
            // the part of the photo the tile shows
            position: '0% 50%',
        },
        {
            src: 'img/img2.jpg',
            thumb: 'img/thumb2.jpg',
            alt: 'Forest path',
            lgSize: '1067-1600',
            position: '50% 0%',
        },
    ] satisfies (LgGalleryItem & { position: string })[];
}
```
