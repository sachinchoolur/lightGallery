---
title: "@lightgallery/vue"
description: "A native Vue 3 lightGallery component. Vue renders the triggers and the lightbox, with v-model, typed emits, scoped slots and a subpath per plugin."
lead: "A native Vue 3 lightGallery component. Vue renders the triggers and the lightbox, with v-model, typed emits, scoped slots and a subpath per plugin."
date: 2026-07-24T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'Frameworks', name: '@lightgallery/vue' } }
weight: 63
toc: true
---

`@lightgallery/vue` is a native Vue 3 component, not a wrapper around the
vanilla script. Vue renders every node, in the trigger grid and in the
lightbox, so nothing else mutates your DOM. You get `<script setup>` SFCs,
`v-model` for the open state and index, typed emits, scoped slots, a
Teleport overlay and a tree-shakable subpath per plugin. Styling reuses
the published `lightgallery/css/*` files, so the lightbox looks exactly
like the vanilla one.

## Install

```bash
npm install @lightgallery/vue lightgallery
```

Peer range: `vue >=3.4` (uses `defineModel`).

```ts
// Global styles (main.ts or your root stylesheet):
import 'lightgallery/css/lightgallery.css';
// plus the CSS of each plugin you use, e.g.:
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
```

## Quick start, uncontrolled

Thumbnails on the page open the lightbox; mount order defines slide order.

```vue
<script setup lang="ts">
import {
    LightGallery,
    LgItem,
    type LgGalleryItem,
    type SlideEventDetail,
} from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';

const plugins = [Thumbnail, Zoom];
const items: LgGalleryItem[] = [
    { src: 'img/1.jpg', thumb: 'img/1-t.jpg', alt: '…', caption: '…' },
];

function onSlide({ index }: SlideEventDetail) {
    console.log('slide', index);
}
</script>

<template>
    <LightGallery
        :plugins="plugins"
        :thumbnail="{ thumbWidth: 120 }"
        @after-slide="onSlide"
    >
        <LgItem v-for="item of items" :key="item.src" :item="item">
            <img :src="item.thumb" :alt="item.alt" />
        </LgItem>
    </LightGallery>
</template>
```

## Controlled

Pass `:slides` instead of `<LgItem>` children and the component renders no
triggers; `v-model:open` and `v-model:index` give you the state.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { LightGallery, type LgGalleryItem } from '@lightgallery/vue';

const open = ref(false);
const index = ref(0);
const items: LgGalleryItem[] = [
    { src: 'img/1.jpg', thumb: 'img/1-t.jpg', alt: 'Mountains' },
    { src: 'img/2.jpg', thumb: 'img/2-t.jpg', alt: 'Forest' },
];
</script>

<template>
    <button @click="open = true">Open gallery</button>
    <LightGallery :slides="items" v-model:open="open" v-model:index="index" />
</template>
```

## Imperative

A template ref exposes `openGallery(index?)`, `closeGallery()`,
`goToSlide(index)`, `nextSlide()`, `prevSlide()` and `refresh()`.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { LightGallery, type LgGalleryItem } from '@lightgallery/vue';

const gallery = ref<InstanceType<typeof LightGallery> | null>(null);
const items: LgGalleryItem[] = [
    { src: 'img/1.jpg', thumb: 'img/1-t.jpg', alt: 'Mountains' },
    { src: 'img/2.jpg', thumb: 'img/2-t.jpg', alt: 'Forest' },
];
</script>

<template>
    <button @click="gallery?.openGallery(1)">Open at slide 2</button>
    <LightGallery ref="gallery" :slides="items" />
</template>
```

## Settings, events and slots

Settings are same-named props (`:mode`, `:speed`, `:loop`,
`:caption-position`, …); the [settings reference](/docs/settings/) lists
every one. Events are kebab-case emits of the documented
[event names](/docs/events/) without the `on` prefix (`@before-open`,
`@after-slide`, `@slide-item-load`, …).

Scoped slots swap parts of the chrome for your own markup: `#caption`
(`{ item, index }`), `#counter` (`{ current, total }`), `#prev-button`,
`#next-button` and, with the comment plugin, `#comments` (`{ item, index }`).
The `:icons` prop replaces any [control icon](/docs/custom-icons/) by
name. An inline gallery mounts into the element you pass as `:container`.

## Plugins (all 14, plus the justified layout)

Each plugin is its own tree-shakable subpath
`@lightgallery/vue/plugins/<name>` exporting a plugin object for the
`:plugins` prop. Per-plugin settings go on a same-named gallery prop
(e.g. `:zoom="{ scale: 1.5 }"`). A multi-word plugin name works in either
spelling, `:medium-zoom="{ margin: 24 }"` or `:mediumZoom`:

| Plugin | Subpath | Key options (prop of the same name) |
|---|---|---|
| thumbnail | `plugins/thumbnail` | `thumbWidth`, `thumbHeight`, `thumbMargin`, `animateThumb`, `toggleThumb` |
| zoom | `plugins/zoom` | `scale`, `actualSize`, `showZoomInOutIcons`, `infiniteZoom`, `enableZoomAfter` |
| video | `plugins/video` | `autoplayFirstVideo`, `autoplayVideoOnSlide`, `youTubePlayerParams`, `vimeoPlayerParams`, `gotoNextSlideOnVideoEnd` |
| autoplay | `plugins/autoplay` | `slideShowAutoplay`, `slideShowInterval`, `progressBar`, `forceSlideShowAutoplay` |
| fullscreen | `plugins/fullscreen` | `fullScreen` |
| hash | `plugins/hash` | `galleryId`, `customSlideName` |
| pager | `plugins/pager` | `pager` |
| share | `plugins/share` | `facebook`, `twitter`, `pinterest`, `additionalShareOptions` (typed objects) |
| rotate | `plugins/rotate` | `rotateSpeed`, `rotateLeft/Right`, `flipHorizontal/Vertical` |
| comment | `plugins/comment` | `commentBox`; the comment body comes from the `#comments` slot |
| mediumZoom | `plugins/mediumZoom` | `margin`, `backgroundColor` (+ per-item `lgBackgroundColor`) |
| relativeCaption | `plugins/relativeCaption` | `relativeCaption` (presets `captionPosition: 'slide'`) |
| vimeoThumbnail | `plugins/vimeoThumbnail` | `showVimeoThumbnails`, `showThumbnailWithPlayButton` |
| originCrop | `plugins/originCrop` | `originCrop`: flies a cropped thumbnail from its crop ([zoom from origin](/demos/zoom-from-origin/)) |
| justified | `plugins/justified` | Not a plugin: the `<JustifiedGrid>` component wraps the triggers, with `row-height`, `gap`, `last-row` ([justified layout](/docs/justified-layout/)) |

Plugins compose per gallery instance, two galleries on one page can have
different plugin sets. Order matters for slide wrappers: put `Zoom` before
`Rotate` so zoom stays the outermost transform.

## SSR / Nuxt

- Server-safe: every entry imports without browser globals, and the closed
  gallery server-renders only your trigger markup. The lightbox overlay
  **never server-renders** (even with `open` true at first render), the
  `<Teleport>` mounts client-side only, so there is no teleport buffer to
  wire up and no hydration mismatch surface.
- In Nuxt, use the component directly in server-rendered pages, no
  `<ClientOnly>` wrapper needed. Deep-link flows (hash plugin) run after
  hydration.
- Import the CSS globally (`nuxt.config` `css: ['lightgallery/css/...']`).

## Accessibility

The open gallery is a modal dialog (`role="dialog"`, `aria-modal`, an
accessible name, with an `:aria-labelledby` override). Focus moves in on
open, Tab and Shift+Tab are trapped while it is open and focus returns to
the trigger on close. Every button is labelled, thumbnails and pager dots
are keyboard-operable, and `prefers-reduced-motion` disables the
animations. The open gallery passes axe WCAG A/AA checks in CI. The
[accessibility page](/docs/accessibility/) covers the live region, the
labels and the settings involved.

## Migrating from the legacy `lightgallery/vue` wrapper

Coming from `lightgallery/vue`, the wrapper that shipped inside the
vanilla 2.x package? The full list is in the
[migration guide](/docs/migration/#vue); the key changes:

- `dynamicEl` → `:slides` (typed `LgGalleryItem[]`), or `<LgItem>` trigger
  components for uncontrolled galleries.
- `onAfterSlide` etc. → kebab-case emits without the prefix:
  `@after-slide`.
- `appendSubHtmlTo` → `captionPosition: 'bar' | 'slide' | 'outer'`;
  `subHtml` strings → `caption` (plain string), the `#caption` slot, or the
  explicit raw-HTML `captionHtml` opt-in.
- Plugin constructor arrays → plugin objects on `:plugins`, options via
  same-named gallery props.
- Dropped (2.x DOM-scraping/HTML-string era): `selector`, `extraProps`,
  `getCaptionFromTitleOrAlt`, `nextHtml`/`prevHtml`, `appendCounterTo`,
  `videojs`.

## Next steps

- [Vue image gallery](/demos/vue-image-gallery/) and
  [video gallery](/demos/vue-video-gallery/) demos, each with the code
  behind it.
- Features that work the same in every package:
  [justified layout](/docs/justified-layout/),
  [virtualization](/docs/virtualization/),
  [thumbnail scrubbing](/docs/thumbnail-scrubbing/),
  [video facades](/docs/video-facades/),
  [custom icons](/docs/custom-icons/),
  [localization and RTL](/docs/localization-rtl/) and
  [responsive loading](/docs/responsive-loading/).
- The [settings reference](/docs/settings/), every setting is a prop of
  the same name, and the [events](/docs/events/) list, each one a
  kebab-case emit here.

## License

GPL-3.0-only, matching lightGallery's licensing model. For commercial
projects a commercial license is available, see the
[license page](/license/), or use `0000-0000-000-0000` as a temporary
`licenseKey` for evaluation.
