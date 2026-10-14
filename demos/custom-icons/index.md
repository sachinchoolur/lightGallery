# Lightbox with custom icons

> JavaScript lightbox gallery with a custom icon set. Replace the control icons per name with your own inline SVGs, live demo plus the code for vanilla JS, React, Vue, and Angular.

Every lightGallery control icon is an inline SVG you can replace per name. This gallery runs a hand-rolled thin-stroke set, close, arrows, zoom, autoplay and fullscreen are all swapped, while everything else keeps the built-in artwork. Read more in the [custom icons guide](https://www.lightgalleryjs.com/docs/custom-icons/).

Canonical page: https://www.lightgalleryjs.com/demos/custom-icons/

### Custom icon set

Open the gallery and compare the toolbar with any other demo on this
site, the icons here are overridden per name with the `icons`
setting. The download button's name is deliberately omitted, so it
keeps the built-in icon right next to the custom ones, and state
pairs such as `autoplayPlay`/`autoplayPause` swap exactly like the
built-ins do.

_Live demo: https://www.lightgalleryjs.com/demos/custom-icons/_

**JavaScript**

```js
import lightGallery from 'lightgallery';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

// Any SVG markup works; drawing with currentColor keeps the
// hover/active colors of the buttons.
const icon = (content) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.8" stroke-linecap="round"
        stroke-linejoin="round">${content}</svg>`;

lightGallery(document.getElementById('custom-icons-gallery'), {
    plugins: [lgZoom, lgFullscreen, lgAutoplay, lgThumbnail],
    icons: {
        close: icon('<path d="M6 6l12 12M18 6L6 18"/>'),
        prev: icon('<path d="M14.5 5.5L8 12l6.5 6.5"/>'),
        next: icon('<path d="M9.5 5.5L16 12l-6.5 6.5"/>'),
        // State pairs need both names, or the pair keeps the built-ins.
        autoplayPlay: icon('<path d="M9 5.8v12.4L19 12z"/>'),
        autoplayPause: icon('<path d="M8.5 6v12M15.5 6v12"/>'),
        // more icons by name
    },
});
```

**React**

```tsx
import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import Autoplay from '@lightgallery/react/plugins/autoplay';
import Fullscreen from '@lightgallery/react/plugins/fullscreen';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

const items = [
    { src: 'img/img1.jpg', thumb: 'img/thumb1.jpg', alt: 'Mountains' },
    { src: 'img/img2.jpg', thumb: 'img/thumb2.jpg', alt: 'Forest path' },
];

// Any SVG works; drawing with currentColor keeps the hover/active
// colors of the buttons.
const icon = (path: string) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d={path} />
    </svg>
);

<LightGallery
    plugins={[Zoom, Fullscreen, Autoplay, Thumbnail]}
    render={{
        // A node per name; `undefined` keeps the built-in icon.
        icon: (name) => {
            switch (name) {
                case 'close':
                    return icon('M6 6l12 12M18 6L6 18');
                // State pairs need both names, or the pair keeps the
                // built-ins.
                case 'autoplayPlay':
                    return icon('M9 5.8v12.4L19 12z');
                case 'autoplayPause':
                    return icon('M8.5 6v12M15.5 6v12');
                default:
                    return undefined;
            }
        },
    }}
>
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
import Autoplay from '@lightgallery/vue/plugins/autoplay';
import Fullscreen from '@lightgallery/vue/plugins/fullscreen';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';
// SVG components or raw SVG strings, keyed by icon name.
import CloseIcon from './icons/CloseIcon.vue';
import PauseIcon from './icons/PauseIcon.vue';
import PlayIcon from './icons/PlayIcon.vue';

const plugins = [Zoom, Fullscreen, Autoplay, Thumbnail];

// Names left out keep the built-in icons. State pairs need both names,
// or the pair keeps the built-ins.
const icons = {
    close: CloseIcon,
    autoplayPlay: PlayIcon,
    autoplayPause: PauseIcon,
};

const items = [
    { src: 'img/img1.jpg', thumb: 'img/thumb1.jpg', alt: 'Mountains' },
    { src: 'img/img2.jpg', thumb: 'img/thumb2.jpg', alt: 'Forest path' },
];
</script>

<template>
    <LightGallery :plugins="plugins" :icons="icons">
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
    LgIconDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withAutoplay } from '@lightgallery/angular/plugins/autoplay';
import { withFullscreen } from '@lightgallery/angular/plugins/fullscreen';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

@Component({
    selector: 'app-gallery',
    imports: [LgGalleryComponent, LgGalleryItemDirective, LgIconDirective],
    template: `
        <lg-gallery [features]="features">
            @for (item of items; track item.src) {
                <a [lgGalleryItem]="item">
                    <img [src]="item.thumb" [alt]="item.alt" />
                </a>
            }
            <!-- The template declares the names it covers; other names keep
                 the built-in icons. -->
            <ng-template
                [lgIcon]="['close', 'autoplayPlay', 'autoplayPause']"
                let-name
            >
                @switch (name) {
                    @case ('close') {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.8" stroke-linecap="round">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    }
                    @case ('autoplayPlay') {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.8" stroke-linejoin="round">
                            <path d="M9 5.8v12.4L19 12z" />
                        </svg>
                    }
                    @case ('autoplayPause') {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.8" stroke-linecap="round">
                            <path d="M8.5 6v12M15.5 6v12" />
                        </svg>
                    }
                }
            </ng-template>
        </lg-gallery>
    `,
})
export class Gallery {
    features = [
        withZoom(),
        withFullscreen(),
        withAutoplay(),
        withThumbnail(),
    ];

    items: LgGalleryItem[] = [
        { src: 'img/img1.jpg', thumb: 'img/thumb1.jpg', alt: 'Mountains' },
        { src: 'img/img2.jpg', thumb: 'img/thumb2.jpg', alt: 'Forest path' },
    ];
}
```
