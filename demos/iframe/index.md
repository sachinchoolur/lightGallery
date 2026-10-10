# Iframe lightbox

> Iframe lightbox demo: open a website, a Google map or a PDF inside the gallery as an iframe slide.

Create a simple lightbox iframe gallery with lightGallery. If you want to display a webpage, Google map, PDF file or any other iframe within the gallery, you just need to set data-iframe attribute true for the slide item. lightGallery will automatically display the source in an iframe. This can be used to view PDF files, Google Maps and more.

Canonical page: https://www.lightgalleryjs.com/demos/iframe/

<button class="btn btn-success mrb50" data-iframe="true" id="open-website" data-iframe-title="ParityDeals" data-src="https://www.paritydeals.com/">Open
website</button>
<button class="btn btn-success mrb50" data-iframe="true" id="open-google-map" data-src="https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sChefchaouen,+Morocco">Google
map</button>
<button class="btn btn-success mrb50" data-iframe="true" id="open-pdf" data-src="/pdf/sample.pdf">Open
PDF file</button>

**JavaScript**

**HTML**

```html
<button
    class="btn btn-success btn-lg mrb50"
    data-iframe="true"
    id="open-website"
    data-src="https://www.paritydeals.com/"
    data-iframe-title="ParityDeals"
>
    Open website
</button>
<button
    class="btn btn-success btn-lg mrb50"
    data-iframe="true"
    id="open-google-map"
    data-src="https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sChefchaouen,+Morocco"
>
    Google map
</button>
<button
    class="btn btn-success btn-lg mrb50"
    data-iframe="true"
    id="open-pdf"
    data-src="pdf/sample.pdf"
>
    Open PDF file
</button>
```

**JavaScript**

```js
lightGallery(document.getElementById('open-website'), {
    selector: 'this',
});
lightGallery(document.getElementById('open-google-map'), {
    selector: 'this',
});
lightGallery(document.getElementById('open-pdf'), {
    selector: 'this',
});
```

**React**

```tsx
import { useState } from 'react';
import { LightGallery, type GalleryItem } from '@lightgallery/react';

// `iframe: true` shows the page at `src` in an iframe; it replaces the
// vanilla data-iframe attribute and selector wiring.
const slides: GalleryItem[] = [
    {
        src: 'https://www.paritydeals.com/',
        iframe: true,
        iframeTitle: 'ParityDeals',
    },
    {
        src: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sChefchaouen,+Morocco',
        iframe: true,
        iframeTitle: 'Google map',
    },
    {
        src: 'pdf/sample.pdf',
        iframe: true,
        iframeTitle: 'PDF file',
    },
];

const [open, setOpen] = useState(false);
const [index, setIndex] = useState(0);

// Each button opens the gallery on one slide.
const openSlide = (slide: number) => {
    setIndex(slide);
    setOpen(true);
};

<>
    <button type="button" onClick={() => openSlide(0)}>
        Open website
    </button>
    <button type="button" onClick={() => openSlide(1)}>
        Google map
    </button>
    <button type="button" onClick={() => openSlide(2)}>
        Open PDF file
    </button>
    <LightGallery
        slides={slides}
        open={open}
        onClose={() => setOpen(false)}
        index={index}
        onIndexChange={setIndex}
    />
</>;
```

**Vue**

```vue
<script setup>
import { ref } from 'vue';
import { LightGallery } from '@lightgallery/vue';

// `iframe: true` shows the page at `src` in an iframe; it replaces the
// vanilla data-iframe attribute and selector wiring.
const slides = [
    {
        src: 'https://www.paritydeals.com/',
        iframe: true,
        iframeTitle: 'ParityDeals',
    },
    {
        src: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sChefchaouen,+Morocco',
        iframe: true,
        iframeTitle: 'Google map',
    },
    {
        src: 'pdf/sample.pdf',
        iframe: true,
        iframeTitle: 'PDF file',
    },
];

const open = ref(false);
const index = ref(0);

// Each button opens the gallery on one slide.
function openSlide(slide) {
    index.value = slide;
    open.value = true;
}
</script>

<template>
    <button type="button" @click="openSlide(0)">Open website</button>
    <button type="button" @click="openSlide(1)">Google map</button>
    <button type="button" @click="openSlide(2)">Open PDF file</button>
    <LightGallery v-model:open="open" v-model:index="index" :slides="slides" />
</template>
```

**Angular**

```ts
import { Component, signal } from '@angular/core';
import { LgGalleryComponent, type LgGalleryItem } from '@lightgallery/angular';

@Component({
    selector: 'app-gallery',
    imports: [LgGalleryComponent],
    template: `
        <button type="button" (click)="openSlide(0)">Open website</button>
        <button type="button" (click)="openSlide(1)">Google map</button>
        <button type="button" (click)="openSlide(2)">Open PDF file</button>
        <lg-gallery
            [slides]="slides"
            [open]="open()"
            (closed)="open.set(false)"
            [(index)]="index"
        />
    `,
})
export class Gallery {
    // `iframe: true` shows the page at `src` in an iframe; it replaces
    // the vanilla data-iframe attribute and selector wiring.
    slides: LgGalleryItem[] = [
        {
            src: 'https://www.paritydeals.com/',
            iframe: true,
            iframeTitle: 'ParityDeals',
        },
        {
            src: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sChefchaouen,+Morocco',
            iframe: true,
            iframeTitle: 'Google map',
        },
        {
            src: 'pdf/sample.pdf',
            iframe: true,
            iframeTitle: 'PDF file',
        },
    ];

    open = signal(false);
    index = signal(0);

    // Each button opens the gallery on one slide.
    openSlide(slide: number) {
        this.index.set(slide);
        this.open.set(true);
    }
}
```
