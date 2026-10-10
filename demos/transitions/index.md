# Transitions

> Twenty-plus slide transitions for image and video galleries, switched with the mode setting, plus how to build your own.

Create beautiful image and video galleries with built in CSS transitions. You can change the type of transitions by passing the transition name via mode option. lightGallery uses hardware-accelerated CSS transitions for smooth animation. You can create your own beautiful custom transitions by updating the CSS transform values.

Canonical page: https://www.lightgalleryjs.com/demos/transitions/

#### Demo

> Note: the transitions other than the default slide and fade need `lg-transitions.css`: `import 'lightgallery/css/lg-transitions.css';` or load it from the package's `css` folder.

<span class="choose-select-option">Change transition : </span>
<select id="select-trans" class="mrb30 select"><option selected="selected" value="lg-slide">lg-slide</option><option value="lg-fade">lg-fade</option><option value="lg-zoom-in">lg-zoom-in</option><option value="lg-zoom-in-big">lg-zoom-in-big</option><option value="lg-zoom-out">lg-zoom-out</option><option value="lg-zoom-out-big">lg-zoom-out-big</option><option value="lg-zoom-out-in">lg-zoom-out-in</option><option value="lg-zoom-in-out">lg-zoom-in-out</option><option value="lg-soft-zoom">lg-soft-zoom</option><option value="lg-scale-up">lg-scale-up</option><option value="lg-slide-circular">lg-slide-circular</option><option value="lg-slide-circular-vertical">lg-slide-circular-vertical</option><option value="lg-slide-vertical">lg-slide-vertical</option><option value="lg-slide-vertical-growth">lg-slide-vertical-growth</option><option value="lg-slide-skew-only">lg-slide-skew-only</option><option value="lg-slide-skew-only-rev">lg-slide-skew-only-rev</option><option value="lg-slide-skew-only-y">lg-slide-skew-only-y</option><option value="lg-slide-skew-only-y-rev">lg-slide-skew-only-y-rev</option><option value="lg-slide-skew">lg-slide-skew</option><option value="lg-slide-skew-rev">lg-slide-skew-rev</option><option value="lg-slide-skew-cross">lg-slide-skew-cross</option><option value="lg-slide-skew-cross-rev">lg-slide-skew-cross-rev</option><option value="lg-slide-skew-ver">lg-slide-skew-ver</option><option value="lg-slide-skew-ver-rev">lg-slide-skew-ver-rev</option><option value="lg-slide-skew-ver-cross">lg-slide-skew-ver-cross</option><option value="lg-slide-skew-ver-cross-rev">lg-slide-skew-ver-cross-rev</option><option value="lg-lollipop">lg-lollipop</option><option value="lg-lollipop-rev">lg-lollipop-rev</option><option value="lg-rotate">lg-rotate</option><option value="lg-rotate-rev">lg-rotate-rev</option><option value="lg-tube">lg-tube</option> </select>

**JavaScript**

**HTML**

```html
<div id="custom-transition-demo">
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
lightGallery(document.getElementById('custom-transition-demo'), {
    mode: 'lg-fade',
});
```

**React**

```tsx
import { LightGallery, LightGalleryItem } from '@lightgallery/react';

// Every mode other than lg-slide and lg-fade needs this stylesheet.
import 'lightgallery/css/lg-transitions.css';

const items = [
    { src: 'img/img1.jpg', thumb: 'img/thumb1.jpg', alt: 'Mountains' },
    { src: 'img/img2.jpg', thumb: 'img/thumb2.jpg', alt: 'Forest path' },
];

// Try 'lg-zoom-in', 'lg-slide-vertical', 'lg-rotate' or 'lg-tube'.
<LightGallery mode="lg-fade">
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

// Every mode other than lg-slide and lg-fade needs this stylesheet.
import 'lightgallery/css/lg-transitions.css';

const items = [
    { src: 'img/img1.jpg', thumb: 'img/thumb1.jpg', alt: 'Mountains' },
    { src: 'img/img2.jpg', thumb: 'img/thumb2.jpg', alt: 'Forest path' },
];
</script>

<template>
    <!-- Try 'lg-zoom-in', 'lg-slide-vertical', 'lg-rotate' or 'lg-tube'. -->
    <LightGallery mode="lg-fade">
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

// Every mode other than lg-slide and lg-fade needs
// 'lightgallery/css/lg-transitions.css' in your global styles.

@Component({
    selector: 'app-gallery',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <!-- Try 'lg-zoom-in', 'lg-slide-vertical', 'lg-rotate' or 'lg-tube'. -->
        <lg-gallery mode="lg-fade">
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
}
```

### Create custom transition

lightGallery comes with more than 30 transition effects. If you need more, you
can easily create your own custom transitions.

Let's see how we can create custom transition effects. Before that we need to
understand how transition works in lightGallery. Transitions happen based on 3
CSS class names: `lg-prev-slide`, `lg-current` and `lg-next-slide`. When user
tries to navigate a different slide, lightGallery

-   Removes all CSS transition effects from the slides.
-   Remove existing `lg-prev-slide` and `lg-next-slide` classes from the current
    slide.
-   Based on the direction, adds `lg-next-slide` or `lg-prev-slide` to the
    current slide and next slide to determine how the current slide should
    disappear and the next slide should appear. If direction is `previous`,
    `lg-prev-slide` is added to the current slide and `lg-next-slide` is added
    to the next slide. Likewise, if direction is `next`, `lg-next-slide` is added
    to the current slide and `lg-prev-slide` is added to the next slide.
-   50 ms timer starts to give some time for the browser to perform transitions.
-   After 50 ms, remove `lg-current` class from the current slide.
-   Add `lg-current` class to the next slide.
-   Restore the CSS transitions.

Let's create a custom zoom-in-out transition.

When user navigates to next slide, zoom in transition appears and when user
navigates to the previous slide, zoom out transition appears.

```scss
.lg-zoom-in-out {
    .lg-item {
        // By default all slides should be hidden
        opacity: 0;
        will-change: transform, opacity;

        // For the zoom in transition, set scale3d to 2
        &.lg-prev-slide {
            transform: scale3d(2, 2, 2);
        }

        // For the zoom out transition, set scale3d to 0
        &.lg-next-slide {
            transform: scale3d(0, 0, 0);
        }

        // Reset opacity and transition
        &.lg-current {
            transform: scale3d(1, 1, 1);
            opacity: 1;
        }

        // Add CSS transition for opacity and transform
        &.lg-prev-slide,
        &.lg-next-slide,
        &.lg-current {
            transition: transform 1s cubic-bezier(0, 0, 0.25, 1) 0s, opacity 1s
                    ease 0s;
        }
    }
}
```
