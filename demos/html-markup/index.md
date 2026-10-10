# HTML markup

> HTML markup demo: the different trigger markups lightGallery accepts, from plain links to data attributes and custom selectors.

lightGallery does not force you to use any specific HTML markup. You can use almost any kind of markup with the help of `selector` setting.

Canonical page: https://www.lightgalleryjs.com/demos/html-markup/

**JavaScript**

**HTML**

```html
<div id="anchor-tag">
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
lightGallery(document.getElementById('anchor-tag'));
```

**React**

```tsx
import { LightGallery, LightGalleryItem } from '@lightgallery/react';

const items = [
    { src: 'img/img1.jpg', thumb: 'img/thumb1.jpg', alt: 'Mountains' },
    { src: 'img/img2.jpg', thumb: 'img/thumb2.jpg', alt: 'Forest path' },
];

// There is no markup to scrape: a trigger is a component that renders a
// link, and its item carries what the data-* attributes used to.
<LightGallery>
    {items.map((item) => (
        <LightGalleryItem key={item.src} item={item} href={item.src}>
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
</script>

<template>
    <!-- There is no markup to scrape: a trigger is a component that renders
         a link, and its item carries what the data-* attributes used to. -->
    <LightGallery>
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
        <!-- There is no markup to scrape: a trigger is a directive on your
             own link, and its value carries what the data-* attributes
             used to. -->
        <lg-gallery>
            @for (item of items; track item.src) {
                <a [href]="item.src" [lgGalleryItem]="item">
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
}
```

---

**JavaScript**

**HTML**

```html
<ul id="ul-li">
    <li data-src="img/img1.jpg">
        <img src="img/thumb1.jpg" />
    </li>
    <li data-src="img/img2.jpg">
        <img src="img/thumb2.jpg" />
    </li>
    <!-- more items -->
</ul>
```

**JavaScript**

```js
lightGallery(document.getElementById('ul-li'));
```

**React**

```tsx
// `as` sets the element a trigger renders; the default is a link.
<LightGallery>
    <ul>
        {items.map((item) => (
            <LightGalleryItem key={item.src} as="li" item={item}>
                <img src={item.thumb} alt={item.alt} />
            </LightGalleryItem>
        ))}
    </ul>
</LightGallery>
```

**Vue**

```vue
<!-- LgItem renders the link; put it inside the markup you need. -->
<LightGallery>
    <ul>
        <li v-for="item of items" :key="item.src">
            <LgItem :item="item">
                <img :src="item.thumb" :alt="item.alt" />
            </LgItem>
        </li>
    </ul>
</LightGallery>
```

**Angular**

```html
<!-- The directive works on any element. -->
<lg-gallery>
    <ul>
        @for (item of items; track item.src) {
            <li [lgGalleryItem]="item">
                <img [src]="item.thumb" [alt]="item.alt" />
            </li>
        }
    </ul>
</lg-gallery>
```

---

The `selector` setting belongs to the vanilla package. In React, Vue and
Angular a trigger is the element you mark as one, so other markup can sit
next to the triggers and there is nothing to select.

**JavaScript**

**HTML**

```html
<div id="selector1">
  <h2>Gallery title</h2>
  <div class="item" data-src="img/img1.jpg">
      <img src="img/thumb1.jpg" />
  </div>
  <div class="item" data-src="img/img2.jpg">
      <img src="img/thumb2.jpg" />
  </div>
  <!-- more items -->
</div>
```

**JavaScript**

```js
lightGallery(document.getElementById('selector1'), {
    selector: '.item',
});
```

**React**

```tsx
<LightGallery>
    <h2>Gallery title</h2>
    {items.map((item) => (
        <LightGalleryItem key={item.src} as="div" className="item" item={item}>
            <img src={item.thumb} alt={item.alt} />
        </LightGalleryItem>
    ))}
</LightGallery>
```

**Vue**

```vue
<LightGallery>
    <h2>Gallery title</h2>
    <LgItem v-for="item of items" :key="item.src" class="item" :item="item">
        <img :src="item.thumb" :alt="item.alt" />
    </LgItem>
</LightGallery>
```

**Angular**

```html
<lg-gallery>
    <h2>Gallery title</h2>
    @for (item of items; track item.src) {
        <div class="item" [lgGalleryItem]="item">
            <img [src]="item.thumb" [alt]="item.alt" />
        </div>
    }
</lg-gallery>
```

---

**JavaScript**

**HTML**

```html
<a id="selector2" href="img/img1.jpg"> Click to open </a>
```

**JavaScript**

```js
lightGallery(document.getElementById('selector2'), {
    selector: 'this',
});
```

**React**

```tsx
<LightGallery>
    <LightGalleryItem item={{ src: 'img/img1.jpg' }} href="img/img1.jpg">
        Click to open
    </LightGalleryItem>
</LightGallery>
```

**Vue**

```vue
<LightGallery>
    <LgItem :item="{ src: 'img/img1.jpg' }">Click to open</LgItem>
</LightGallery>
```

**Angular**

```html
<lg-gallery>
    <a href="img/img1.jpg" [lgGalleryItem]="{ src: 'img/img1.jpg' }">
        Click to open
    </a>
</lg-gallery>
```
