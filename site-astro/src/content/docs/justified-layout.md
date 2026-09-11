---
title: 'Justified layout'
description: 'Lay gallery thumbnails out in justified rows, equal heights, varying widths, filling the container edge to edge, in vanilla JavaScript, React, Vue and Angular.'
lead: 'Justified thumbnail rows for every lightGallery package, no extra dependencies.'
date: 2026-08-07T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'Features', name: 'Justified layout' } }
weight: 65
toc: true
---

lightGallery v3 ships a **justified layout** for the trigger
thumbnails: rows of equal height and varying widths that fill the
container edge to edge, like the photo grids on popular photography
sites. The row math lives in
[`@lightgallery/headless`](/docs/headless/) and is shared by all
four packages, so the same options produce the same grid everywhere.

How it works, in every package:

-   **Aspect ratios** come from the trigger's `data-lg-size`
    attribute, then the thumbnail's `width`/`height` attributes, then
    the loaded image's natural size (one relayout when the last
    unknown resolves). Provide `data-lg-size` for a layout with zero
    reflows.
-   The grid **reflows on container resize** (one `ResizeObserver`),
    mirrors automatically under **RTL**, and writes a precise `sizes`
    attribute on thumbnails that carry `srcset`.
-   `lastRow` controls the leftover row: `'start'` (default) keeps it
    at the natural height aligned to the reading start, `'justify'`
    stretches it edge to edge, `'hide'` hides the leftover
    thumbnails.
-   `maxScale` clamps how tall a sparse row may grow, as a multiple
    of the target row height.

All packages share one stylesheet, it is not part of the bundle, so
galleries that do not use the layout pay zero bytes:

```js
import 'lightgallery/css/lg-justified.css';
```

## How the grid loads

A justified grid cannot be positioned until the script has measured
the container, so the stylesheet keeps the thumbnails out of flow and
invisible until the layout has run. Nothing is ever seen unorganised,
and an oversized thumbnail cannot widen the page in the meantime.

Put the container class in your **markup**, not just in the script.
The plugin adds it too, but only once it runs, and the flash you are
avoiding happens before that:

```html
<div id="gallery" class="lg-justified">
    <a href="full-1.jpg" data-lg-size="1600-1067">
        <img src="thumb-1.jpg" alt="" />
    </a>
</div>
```

Once the layout has positioned a trigger, its box shows immediately as
a placeholder and the thumbnail fades in on top when it has loaded, so
the rows fill in as the images arrive. `justifiedReveal` picks the
order:

-   `'row'` (default) reveals whole rows top to bottom, each once
    every thumbnail in it has loaded.
-   `'image'` reveals each thumbnail on its own, as soon as it has
    loaded.

Two details worth knowing. Before the layout runs the container has no
height, so content below it shifts down when the rows appear; give the
container a `min-height` if that matters on your page. And the
placeholder and fade only apply to grids lightGallery lays out, so
your own layout code using the same class names is left alone.

## Vanilla JavaScript

The layout ships as a regular plugin. Adding it to `plugins` lays the
gallery's inline triggers out; dynamic galleries (no trigger grid) are
left untouched. The grid follows `refresh()` and `updateSlides()`, so
adding or removing triggers relays the rows out automatically.

```js
import lightGallery from 'lightgallery';
import lgJustified from 'lightgallery/plugins/justified';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-justified.css';

lightGallery(document.getElementById('gallery'), {
    plugins: [lgJustified, lgThumbnail, lgZoom],
    justifiedRowHeight: 180,
    justifiedGap: 8,
    justifiedLastRow: 'start',
});
```

| Setting | Default | Description |
| --- | --- | --- |
| `justified` | `true` | Enable the layout (the plugin must be in `plugins`) |
| `justifiedRowHeight` | `180` | Row height (px) the layout aims for |
| `justifiedGap` | `8` | Gap between thumbnails and between rows (px) |
| `justifiedLastRow` | `'start'` | Leftover-row policy: `'justify'`, `'start'` or `'hide'` |
| `justifiedMaxScale` | `1.75` | Row-height clamp as a multiple of `justifiedRowHeight` |

## React

Wrap the `LightGalleryItem` triggers in the `JustifiedGrid` component.
The rendered markup stays unpositioned until the first client-side
measure, so SSR output is hydration-safe.

```tsx
import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import { JustifiedGrid } from '@lightgallery/react/plugins/justified';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-justified.css';

<LightGallery plugins={[Thumbnail, Zoom]}>
    <JustifiedGrid rowHeight={180} gap={8}>
        {items.map((item) => (
            <LightGalleryItem
                key={item.src}
                item={item}
                data-lg-size={item.lgSize}
            >
                <img src={item.thumb} alt={item.alt} />
            </LightGalleryItem>
        ))}
    </JustifiedGrid>
</LightGallery>;
```

## Vue

```vue
<script setup>
import { LightGallery, LgItem } from '@lightgallery/vue';
import { JustifiedGrid } from '@lightgallery/vue/plugins/justified';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-justified.css';
</script>

<template>
    <LightGallery :plugins="[Thumbnail, Zoom]">
        <JustifiedGrid :row-height="180" :gap="8">
            <LgItem
                v-for="item of items"
                :key="item.src"
                :item="item"
                :data-lg-size="item.lgSize"
            >
                <img :src="item.thumb" :alt="item.alt" />
            </LgItem>
        </JustifiedGrid>
    </LightGallery>
</template>
```

## Angular

```ts
import { LgJustifiedGridComponent } from '@lightgallery/angular/plugins/justified';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-justified.css';
```

```html
<lg-gallery [features]="features">
    <lg-justified-grid [rowHeight]="180" [gap]="8">
        @for (item of items; track item.src) {
            <a [lgGalleryItem]="item" [attr.data-lg-size]="item.lgSize">
                <img [src]="item.thumb" [alt]="item.alt" />
            </a>
        }
    </lg-justified-grid>
</lg-gallery>
```

## Component props (React, Vue, Angular)

The three framework components share one prop surface:

| Prop | Default | Description |
| --- | --- | --- |
| `rowHeight` | `180` | Row height (px) the layout aims for |
| `gap` | `8` | Gap between thumbnails and between rows (px) |
| `lastRow` | `'start'` | Leftover-row policy: `'justify'`, `'start'` or `'hide'` |
| `maxScale` | `1.75` | Row-height clamp as a multiple of `rowHeight` |
| `reveal` | `'row'` | Reveal order as thumbnails load: `'row'` or `'image'` |
| `direction` | `'auto'` | Reading direction; `'auto'` inherits the nearest ancestor `dir` attribute |

## Standalone grids

The row math itself is a pure function you can use without a gallery:

```js
import { getJustifiedLayout } from '@lightgallery/headless';

const { boxes, containerHeight } = getJustifiedLayout({
    ratios: [1.5, 0.66, 1.5, 1],
    containerWidth: 960,
    targetRowHeight: 180,
    gap: 8,
    lastRow: 'justify',
});
// boxes: [{ top, start, width, height }, ...] in reading order.
```

`start` offsets are logical, measured from the reading-start edge, so the same output positions a grid in LTR and RTL.
