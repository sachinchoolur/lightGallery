# Events demo

> Gallery events demo: listen to lightGallery events such as lgBeforeSlide and lgAfterOpen to react to what the viewer does.

lightGallery emits several custom events throughout the gallery lifecycle. This can be used to customize the gallery or to add your own features. [Docs](../../docs/events/)

Canonical page: https://www.lightgalleryjs.com/demos/events/

Let's see how we can change the background color of the gallery on every slide
change.

#### Demo

**JavaScript**

**HTML**

```html
<div id="custom-events-demo">
    <a href="img/img1.jpg">
        <img src="img/thumb1.jpg" />
    </a>
    <a href="img/img2.jpg">
        <img src="img/thumb2.jpg" />
    </a>
    <!-- more items -->
</div>
```

**JavaScript**

```js
const colours = ['#6a7583', '#1e304b', '#315460', '#080607'];
const galleryEventsDemo = document.getElementById('custom-events-demo');
galleryEventsDemo.addEventListener('lgBeforeSlide', (event) => {
    const { index } = event.detail;
    document.querySelector('.lg-backdrop').style.backgroundColor =
        colours[index];
});
lightGallery(galleryEventsDemo, {
    addClass: 'lg-events-demo-outer', // (Optional)
});
```

**React**

```tsx
import { LightGallery, LightGalleryItem } from '@lightgallery/react';

const items = [
    { src: 'img/img1.jpg', thumb: 'img/thumb1.jpg', alt: 'Mountains' },
    { src: 'img/img2.jpg', thumb: 'img/thumb2.jpg', alt: 'Forest path' },
];

const colours = ['#6a7583', '#1e304b', '#315460', '#080607'];

function setBackdrop(index: number) {
    const backdrop = document.querySelector<HTMLElement>(
        '.lg-events-demo-outer .lg-backdrop',
    );
    if (backdrop) {
        backdrop.style.backgroundColor = colours[index % colours.length];
    }
}

// Every lg* event is a typed callback prop. `className` is a class on
// the gallery container, used by the SCSS below.
<LightGallery
    className="lg-events-demo-outer"
    onBeforeSlide={({ index }) => setBackdrop(index)}
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

const items = [
    { src: 'img/img1.jpg', thumb: 'img/thumb1.jpg', alt: 'Mountains' },
    { src: 'img/img2.jpg', thumb: 'img/thumb2.jpg', alt: 'Forest path' },
];

const colours = ['#6a7583', '#1e304b', '#315460', '#080607'];

function setBackdrop(index) {
    const backdrop = document.querySelector(
        '.lg-events-demo-outer .lg-backdrop',
    );
    if (backdrop) {
        backdrop.style.backgroundColor = colours[index % colours.length];
    }
}
</script>

<template>
    <!-- Kebab-case listeners, same payloads. `class-name` is a class on
         the gallery container, used by the SCSS below. -->
    <LightGallery
        class-name="lg-events-demo-outer"
        @before-slide="({ index }) => setBackdrop(index)"
    >
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

const colours = ['#6a7583', '#1e304b', '#315460', '#080607'];

@Component({
    selector: 'app-gallery',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <!-- Signal outputs, same payloads. "className" is a class on the
             gallery container, used by the SCSS below. -->
        <lg-gallery
            className="lg-events-demo-outer"
            (beforeSlide)="setBackdrop($event.index)"
        >
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
        { src: 'img/img1.jpg', thumb: 'img/thumb1.jpg', alt: 'Mountains' },
        { src: 'img/img2.jpg', thumb: 'img/thumb2.jpg', alt: 'Forest path' },
    ];

    setBackdrop(index: number): void {
        const backdrop = document.querySelector<HTMLElement>(
            '.lg-events-demo-outer .lg-backdrop',
        );
        if (backdrop) {
            backdrop.style.backgroundColor = colours[index % colours.length];
        }
    }
}
```

##### SCSS (Optional)

```scss
.lg-events-demo-outer {
    .lg-backdrop {
        transition: opacity 333ms ease-in 0s, background-color 333ms ease-in 0s;
    }
}
```
