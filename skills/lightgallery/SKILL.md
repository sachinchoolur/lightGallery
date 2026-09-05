---
name: lightgallery
description: Add or configure a lightGallery image/video lightbox or gallery in vanilla JavaScript, React, Vue or Angular — install, imports, plugins, CSS, settings, and the pitfalls that produce most bug reports. Use when a project needs a lightbox, photo gallery, thumbnail strip, zoomable images or a YouTube/Vimeo gallery, or when editing code that imports lightgallery or @lightgallery/*.
---

# lightGallery

One gallery, four packages with the same features and settings:

| Stack | Package | Plugins import path |
| --- | --- | --- |
| Vanilla JS / TypeScript | `lightgallery` | `lightgallery/plugins/<name>` |
| React | `@lightgallery/react` | `@lightgallery/react/plugins/<name>` |
| Vue 3 | `@lightgallery/vue` | `@lightgallery/vue/plugins/<name>` |
| Angular | `@lightgallery/angular` | `@lightgallery/angular/plugins/<name>` |

Plugin names: `thumbnail`, `zoom`, `video`, `autoplay`, `fullscreen`, `share`,
`hash`, `rotate`, `pager`, `comment`, `mediumZoom`, `relativeCaption`,
`vimeoThumbnail`, `justified`. Each is a separate entry — import only what
the project uses.

**Two rules that prevent most problems**

1. **CSS is a consumer import in every stack.** The framework packages ship
   no CSS. Import `lightgallery/css/lightgallery.css` plus one file per
   plugin (`lightgallery/css/lg-thumbnail.css`, `lg-zoom.css`, …), or
   `lightgallery/css/lightgallery-bundle.css` for everything.
2. **Plugins are opt-in.** A feature only exists when its plugin is passed
   (`plugins: [...]`, `plugins={[...]}`, `:plugins="[...]"`,
   `[features]="[withX()]"`). Its settings are ignored otherwise.

## Vanilla JavaScript

```js
import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';

const gallery = lightGallery(document.getElementById('gallery'), {
    plugins: [lgZoom, lgThumbnail],
    speed: 400,
});
```

Markup mode: the container holds anchors; each anchor's `href` (or
`data-src`) is the full image, the inner `<img>` is the thumbnail, and
`data-lg-size="WIDTH-HEIGHT"` enables the open-from-thumbnail animation.
Captions come from `data-sub-html`. If items are not direct children, set
`selector`. Dynamic mode: `dynamic: true, dynamicEl: [{ src, thumb, subHtml }]`
and call `gallery.openGallery(index)`.

Methods: `openGallery(index)`, `closeGallery()`, `refresh()` after the
markup changed, `destroy()`. Events fire on the container element
(`lgBeforeOpen`, `lgAfterSlide`, …) with data in `event.detail`; attach
listeners before initializing.

## React

```tsx
'use client'; // Next.js App Router: the gallery is a client component
import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

export function Gallery({ items }) {
    return (
        <LightGallery plugins={[Zoom, Thumbnail]} thumbnail={{ animateThumb: true }}>
            {items.map((item) => (
                <LightGalleryItem key={item.src} item={item}>
                    <img src={item.thumb} alt={item.alt} />
                </LightGalleryItem>
            ))}
        </LightGallery>
    );
}
```

Import the CSS in the root layout. Plugin settings are objects on props
named after the plugin (`zoom={{ … }}`, `thumbnail={{ … }}`); bare boolean
props are not valid. Callbacks are `onAfterSlide`, `onBeforeOpen`, …; the
imperative handle (`ref`) exposes `openGallery`, `closeGallery`,
`goToSlide`, `nextSlide`, `prevSlide`. Use either the controlled `open`
prop or the uncontrolled default for the component's whole lifetime, not
both. The package is SSR-safe; no `dynamic(..., { ssr: false })` needed.

## Vue 3

```vue
<script setup>
import { LightGallery, LgItem } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';
</script>

<template>
    <LightGallery :plugins="[Zoom, Thumbnail]" :thumbnail="{ animateThumb: true }">
        <LgItem v-for="item of items" :key="item.src" :item="item">
            <img :src="item.thumb" :alt="item.alt" />
        </LgItem>
    </LightGallery>
</template>
```

`v-model:open` controls the open state; events are emitted without the
`on` prefix (`@after-slide`). Custom icons: `:icons="{ close: MyIcon }"`.

## Angular

```ts
import { Component } from '@angular/core';
import { LgGalleryComponent, LgGalleryItemDirective } from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

@Component({
    selector: 'app-gallery',
    standalone: true,
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <lg-gallery [features]="features">
            @for (item of items; track item.src) {
                <a [lgGalleryItem]="item"><img [src]="item.thumb" [alt]="item.alt" /></a>
            }
        </lg-gallery>
    `,
})
export class GalleryComponent {
    items = [{ src: '/photos/1.jpg', thumb: '/photos/1-thumb.jpg', alt: 'One' }];
    features = [withThumbnail({ animateThumb: true }), withZoom()];
}
```

Add the CSS files to `angular.json` `styles` or the root stylesheet.
Settings are inputs (`[speed]`, `[loop]`); events are outputs without the
`on` prefix (`(afterSlide)`).

## Settings worth knowing

- `mobileSettings: { controls, showCloseIcon, download }` — a second
  settings object applied on small screens.
- `strings` — every UI label, merged per key; use it to localize.
- `direction: 'rtl'` (or `'auto'`) mirrors the gallery; import
  `lightgallery/css/lg-rtl.css`.
- `icons` — inline SVG per icon name; state pairs (`maximize`/`minimize`,
  `autoplayPlay`/`autoplayPause`, `fullscreen`/`fullscreenExit`) need both.
- Video: items with a YouTube/Vimeo/Wistia URL or `data-video` JSON render
  a poster and load the player on play (`videoFacade`).
- `virtualization` for galleries with hundreds of slides; `scrubThumbnails`
  to scrub with the strip; `hashDriver` for deep links.
- `licenseKey` — required for commercial use; the default key logs a
  warning.

## Pitfalls

- No styles → the CSS import is missing (see rule 1).
- Thumbnails/zoom "not working" → the plugin is not in the plugins list.
- "data-src is not provided" → the `selector` does not match the anchors.
- Slides added after init are not shown → call `refresh()` (vanilla) or
  update the reactive `items` (frameworks).
- React: switching between controlled and uncontrolled `open` logs an error.

## Reference

- Docs index for agents: https://www.lightgalleryjs.com/llms.txt
- Every setting with type and default: https://www.lightgalleryjs.com/docs/settings/index.md
- Events: https://www.lightgalleryjs.com/docs/events/index.md · Methods: https://www.lightgalleryjs.com/docs/methods/index.md
- Framework guides: /docs/react/index.md, /docs/vue/index.md, /docs/angular/index.md on the same host
