---
title: 'Responsive loading'
description: 'Serve the right image to every screen inside the lightbox: srcset, sizes and picture sources on slides, plus a decode gate for flash-free first paint.'
lead: 'Real responsive markup on every slide, and images that only count as loaded once they are decoded.'
date: 2026-08-07T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'V3 (alpha)', name: 'Responsive loading' } }
weight: 72
toc: true
---

> **Alpha release** — the v3 packages are published under the `alpha`
> dist-tag. APIs may change between alpha releases; feedback is very
> welcome on
> [GitHub](https://github.com/sachinchoolur/lightGallery/issues).

## Responsive slide images

Every package renders full responsive markup for image slides: the
main image carries `srcset`/`sizes`, and `sources` renders a real
`<picture>` element — art direction, format negotiation
(`type="image/avif"`, …) and DPR selection all work exactly as they
do in page markup, because it *is* that markup.

Vanilla (data attributes):

```html
<a
    data-src="img/photo-1600.jpg"
    data-srcset="img/photo-800.jpg 800w, img/photo-1600.jpg 1600w"
    data-sizes="90vw"
    data-lg-size="1600-1067"
>
    <img src="img/thumb.jpg" alt="" />
</a>
```

Frameworks (item fields):

```tsx
const slides = [
    {
        src: 'img/photo-1600.jpg',
        srcset: 'img/photo-800.jpg 800w, img/photo-1600.jpg 1600w',
        sizes: '90vw',
        sources: [
            {
                type: 'image/avif',
                srcset: 'img/photo-800.avif 800w, img/photo-1600.avif 1600w',
            },
        ],
        lgSize: '1600-1067',
        thumb: 'img/thumb.jpg',
    },
];
```

The vanilla markup equivalent of `sources` is `data-sources` (a JSON
array), and the classic `data-responsive` list
(`"img-480.jpg 480, img-800.jpg 800"`) keeps working as before.

## Responsive `data-lg-size`

`data-lg-size` (the natural size that drives the zoom-from-origin
animation) accepts a comma-separated responsive list — each entry is
`width-height-breakpoint`, the last entry (no breakpoint) is the
default:

```html
<a data-src="..." data-lg-size="240-160-375, 1600-1067">...</a>
```

Below a 375px-wide viewport the open animation targets the 240×160
variant; everywhere else, 1600×1067. The
[justified layout](/docs/v3/justified-layout/) reads the same
attribute for its aspect ratios.

## The decode gate

A slide now reports *loaded* only after the browser has **decoded**
the image — not merely fetched it. The completion state
(`lg-complete`, the loading spinner, the dummy-image drop in the
zoom-from-origin flight) waits for `img.decode()` to settle, capped
at 500 ms so a slow decoder can never strand the UI. The result: the
full-resolution image appears sharp in one paint instead of flashing
half-decoded.

Browsers without `decode()` (and error paths) behave exactly as
before — the gate is progressive enhancement.

## Precise `sizes` from the layouts

When the [justified layout](/docs/v3/justified-layout/) positions a
trigger whose thumbnail carries `srcset`, it writes the rendered
width as the thumbnail's `sizes` attribute — the browser downloads
the smallest candidate that actually covers the box.

## Headless utilities

The selection logic is exported from `@lightgallery/headless` for
custom preloading and warming strategies:

```ts
import {
    parseSrcset,
    resolveSizes,
    resolveImageSource,
    awaitDecode,
} from '@lightgallery/headless';

// Which URL would the browser pick in a 900×600 viewport at 2x DPR?
const candidate = resolveImageSource(item, {
    width: 900,
    height: 600,
    dpr: 2,
});
// → { src, width } from sources (spec order) → srcset → src, or null.
```
