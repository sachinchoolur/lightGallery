# @lightgallery/vue

Native Vue 3 lightGallery over `@lightgallery/headless` — every DOM node
rendered by Vue. `<script setup>` SFCs, `v-model` open/index, typed emits
and scoped slots, Teleport overlay, a tree-shakable subpath per plugin. The
framework-free state machine, gesture math and plugin logic are shared with
`@lightgallery/react` and `@lightgallery/angular` through the headless
package: one product, four renderings.

## Install

```bash
npm install @lightgallery/vue @lightgallery/headless
# CSS ships from the vanilla package:
npm install lightgallery
```

Peer range: `vue >=3.4` (uses `defineModel`).

```ts
// Global styles (main.ts or your root stylesheet):
import 'lightgallery/css/lightgallery.css';
// plus the CSS of each plugin you use, e.g.:
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
```

## Quick start — uncontrolled

Thumbnails on the page open the lightbox; mount order defines slide order.

```vue
<script setup lang="ts">
import { LightGallery, LgItem, type LgGalleryItem } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';

const plugins = [Thumbnail, Zoom];
const items: LgGalleryItem[] = [
    { src: 'img/1.jpg', thumb: 'img/1-t.jpg', alt: '…', caption: '…' },
];
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

## Controlled + imperative

```vue
<!-- Controlled: -->
<LightGallery :slides="items" v-model:open="open" v-model:index="index" />

<!-- Imperative (template ref handle): -->
<LightGallery ref="lg" :slides="items" />
<button @click="lg?.openGallery(2)">Open at slide 3</button>
```

Settings are same-named props (`:mode`, `:speed`, `:loop`,
`:caption-position`, …); events are kebab-case emits without the `on`
prefix (`@before-open`, `@after-slide`, `@slide-item-load`, …). Slots are
named scoped slots: `#caption`, `#counter`, `#prev-button`, `#next-button`.
Inline gallery: `:container="element"`.

## Plugins (all 13)

Each plugin is its own tree-shakable subpath
`@lightgallery/vue/plugins/<name>` exporting a plugin object for the
`:plugins` prop. Per-plugin settings go on a same-named gallery prop
(e.g. `:zoom="{ scale: 1.5 }"`):

| Plugin | Subpath | Notable options |
|---|---|---|
| thumbnail | `plugins/thumbnail` | `thumbWidth`, `thumbHeight`, `animateThumb`, `toggleThumb` |
| zoom | `plugins/zoom` | `scale`, `actualSize`, `showZoomInOutIcons`, `infiniteZoom` |
| video | `plugins/video` | `autoplayFirstVideo`, `autoplayVideoOnSlide`, `youTubePlayerParams` |
| autoplay | `plugins/autoplay` | `slideShowInterval`, `slideShowAutoplay`, `progressBar` |
| fullscreen | `plugins/fullscreen` | — |
| hash | `plugins/hash` | `galleryId`, `customSlideName` |
| pager | `plugins/pager` | — |
| share | `plugins/share` | `facebook`/`twitter`/`pinterest`, `additionalShareOptions` (typed) |
| rotate | `plugins/rotate` | `rotateSpeed`, per-button toggles |
| comment | `plugins/comment` | `commentBox`; comment body via the `#comments` gallery slot |
| mediumZoom | `plugins/mediumZoom` | `margin`, `backgroundColor` (presets a minimal UI) |
| relativeCaption | `plugins/relativeCaption` | — (presets `captionPosition: 'slide'`) |
| vimeoThumbnail | `plugins/vimeoThumbnail` | `showThumbnailWithPlayButton` |

Plugins compose per gallery instance — two galleries on one page can have
different plugin sets. Order matters for slide wrappers: put `Zoom` before
`Rotate` (zoom outermost, 2.x DOM order).

## SSR / Nuxt

- Server-safe: every entry imports without browser globals, and the closed
  gallery server-renders only your trigger markup. The lightbox overlay
  **never server-renders** (even with `open` true at first render) — the
  `<Teleport>` mounts client-side only, so there is no teleport buffer to
  wire up and no hydration mismatch surface. Verified with
  `vue/server-renderer` render + hydrate tests (zero hydration warnings).
- In Nuxt, use the component directly in server-rendered pages — no
  `<ClientOnly>` wrapper needed. Deep-link flows (hash plugin) run after
  hydration.
- Import the CSS globally (`nuxt.config` `css: ['lightgallery/css/...']`).

## Accessibility

`role="dialog"`/`aria-modal` with accessible-name fallback
(`:aria-labelledby` override supported), hand-rolled focus trap (focus in
on open, Tab/Shift+Tab wrapped, returned to the trigger on close), labelled
buttons everywhere, keyboard-operable thumbnails and pager dots,
`prefers-reduced-motion` support. Automated axe run (WCAG A/AA): zero
violations.

## Migrating from the legacy `lightgallery/vue` wrapper

The old wrapper (`lightgallery-vue*` folders / `lightgallery` v2 with
`lgQuery`) wrapped the vanilla runtime; this package renders natively. Key
renames (full table in the project ADRs):

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

## License

GPL-3.0-only — commercial license available, see
[lightgalleryjs.com/license](https://www.lightgalleryjs.com/license/).
