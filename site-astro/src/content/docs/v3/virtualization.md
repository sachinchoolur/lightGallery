---
title: 'Virtualization'
description: 'Keep thousand-item galleries fast: a bounded slide pool and a windowed thumbnail strip, one setting in vanilla JavaScript, React, Vue and Angular.'
lead: 'Galleries with thousands of items keep a small, constant DOM — one setting, every package.'
date: 2026-08-07T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'V3 (alpha)', name: 'Virtualization' } }
weight: 67
toc: true
---

> **Alpha release** — the v3 packages are published under the `alpha`
> dist-tag. APIs may change between alpha releases; feedback is very
> welcome on
> [GitHub](https://github.com/sachinchoolur/lightGallery/issues).

Large galleries pay for every DOM node: a 1,000-item gallery that
renders 1,000 thumbnails plus mounted slides gets slow to open,
slow to scroll and heavy on memory. lightGallery v3 adds an opt-in
`virtualization` setting that bounds both:

-   **Slide pool** — only the current slide, its neighbors and any
    protected slides stay mounted. `slides` sets the pool size.
-   **Thumbnail windowing** — only the visible thumbnails plus an
    overscan render; leading and trailing **spacers** preserve the
    strip's total width, so scrollbar-free dragging, the pager math
    and the strip geometry are identical to a fully rendered strip.
    `thumbs` sets the overscan per side, or `'auto'` derives one
    extra viewport per side.

The setting is **off by default** (`undefined`) — the classic
behavior: every thumbnail renders and the mounted-slide window
follows `numberOfSlideItemsInDom`. The shape is shared by all four
packages:

```ts
virtualization: {
    slides: 7,      // mounted-slide pool size
    thumbs: 'auto', // thumb overscan per side: a number, or 'auto'
}
```

## Zero-cost interaction

The thumbnail window advances only at **commit points** — release,
slide change, resize — never per `pointermove`. Dragging the strip
costs nothing extra; the overscan covers the in-flight stretch. A
fast fling renders its whole flight corridor before the glide starts,
so the strip never shows blank thumbnails mid-flight, and shrinks
back to the normal window when it settles.

## Vanilla JavaScript

```js
import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

lightGallery(el, {
    dynamic: true,
    dynamicEl: items, // thousands of items
    plugins: [lgThumbnail, lgZoom],
    virtualization: {
        slides: 7,
        thumbs: 'auto',
    },
});
```

## React

```tsx
<LightGallery
    slides={items}
    plugins={[Thumbnail, Zoom]}
    virtualization={{ slides: 7, thumbs: 'auto' }}
/>
```

## Vue

```vue
<LightGallery
    :slides="items"
    :plugins="[Thumbnail, Zoom]"
    :virtualization="{ slides: 7, thumbs: 'auto' }"
/>
```

## Angular

```html
<lg-gallery
    [slides]="items"
    [features]="[withThumbnail(), withZoom()]"
    [virtualization]="{ slides: 7, thumbs: 'auto' }"
/>
```

## Options

| Key | Default | Description |
| --- | --- | --- |
| `slides` | `numberOfSlideItemsInDom` | Mounted-slide pool size — how many slide elements exist at once, regardless of gallery length |
| `thumbs` | off | Thumbnail-strip windowing: overscan thumbs kept mounted on each side of the visible range, or `'auto'` for one extra viewport per side |

Notes:

-   Omit the whole `virtualization` object to keep the classic
    render-everything behavior — nothing changes for existing
    galleries.
-   A zoomed slide is never unmounted: zoom only ever lives on the
    current slide, which is always inside the pool.
-   Thumbnail windowing needs the Thumbnail plugin; `slides` works on
    its own.
