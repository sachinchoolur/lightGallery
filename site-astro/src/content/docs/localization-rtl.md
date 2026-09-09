---
title: 'Localization & RTL'
description: 'Localize every lightGallery label from one strings object and mirror the gallery for right-to-left pages, in vanilla JavaScript, React, Vue and Angular.'
lead: 'One strings contract for every label, and an opt-in RTL layer that mirrors the whole gallery.'
date: 2026-08-07T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'Features', name: 'Localization & RTL' } }
weight: 66
toc: true
---

## The `strings` object

Every user-facing label in lightGallery v3, core controls **and**
plugin buttons, lives in a single `strings` setting. Pass a partial
object; the keys you provide merge over the English defaults. The same
contract works in all four packages.

```js
lightGallery(el, {
    plugins: [lgThumbnail, lgZoom],
    strings: {
        closeGallery: 'Galerie schließen',
        previousSlide: 'Vorheriges Bild',
        nextSlide: 'Nächstes Bild',
        zoomIn: 'Vergrößern',
        zoomOut: 'Verkleinern',
        slideAnnouncement: 'Bild {index} von {total}',
    },
});
```

```tsx
<LightGallery
    slides={slides}
    strings={{ closeGallery: 'Galerie schließen' }}
/>
```

```vue
<LightGallery
    :slides="slides"
    :strings="{ closeGallery: 'Galerie schließen' }"
/>
```

```html
<lg-gallery
    [slides]="slides"
    [strings]="{ closeGallery: 'Galerie schließen' }"
/>
```

### Core keys

| Key | Default |
| --- | --- |
| `closeGallery` | `'Close gallery'` |
| `toggleMaximize` | `'Toggle maximize'` |
| `previousSlide` | `'Previous slide'` |
| `nextSlide` | `'Next slide'` |
| `download` | `'Download'` |
| `playVideo` | `'Play video'` |
| `mediaLoadingFailed` | `'Oops... Failed to load content...'` |
| `galleryLabel` | `'Gallery'` |
| `slideAnnouncement` | `'Image {index} of {total}'` |

`galleryLabel` names the gallery dialog for assistive technology when
`ariaLabelledby` is not set. `slideAnnouncement` is announced politely
on every slide change, `{index}` and `{total}` are replaced with the
1-based position and the slide count, and the slide caption, when
present, is appended.

### Plugin labels

Plugin buttons read from the same object, no per-plugin
configuration needed:

| Key | Default | Plugin |
| --- | --- | --- |
| `share` | `'Share'` | Share |
| `toggleThumbnails` | `'Toggle thumbnails'` | Thumbnail |
| `toggleAutoplay` | `'Toggle Autoplay'` | Autoplay |
| `toggleFullscreen` | `'Toggle Fullscreen'` | Fullscreen |
| `zoomIn` | `'Zoom in'` | Zoom |
| `zoomOut` | `'Zoom out'` | Zoom |
| `viewActualSize` | `'View actual size'` | Zoom |
| `rotateLeft` | `'Rotate left'` | Rotate |
| `rotateRight` | `'Rotate right'` | Rotate |
| `flipHorizontal` | `'Flip horizontal'` | Rotate |
| `flipVertical` | `'Flip vertical'` | Rotate |
| `toggleComments` | `'Toggle Comments'` | Comment |

### Deprecated per-plugin objects

The v2-era per-plugin label objects (`zoomPluginStrings`,
`thumbnailPluginStrings`, `autoplayPluginStrings`,
`fullscreenPluginStrings`, `rotatePluginStrings`,
`sharePluginStrings`, `commentPluginStrings`) still work as
**deprecated aliases**: a key set explicitly on a legacy object wins
over the same key on `strings`, so existing configurations keep their
behavior. New code should use `strings` only.

## Right-to-left galleries

Set `direction: 'rtl'` and load the opt-in RTL stylesheet, keyboard
arrows, swipe advance, the slide transforms and the thumbnail strip
all mirror. The layer is a separate file, so LTR galleries pay zero
CSS bytes.

```js
import 'lightgallery/css/lg-rtl.css';

lightGallery(el, {
    plugins: [lgThumbnail, lgZoom],
    direction: 'rtl',
});
```

```tsx
import 'lightgallery/css/lg-rtl.css';

<LightGallery slides={slides} direction="rtl" />;
```

```vue
<script setup>
import 'lightgallery/css/lg-rtl.css';
</script>

<LightGallery :slides="slides" direction="rtl" />
```

```ts
import 'lightgallery/css/lg-rtl.css';
```

```html
<lg-gallery [slides]="slides" direction="rtl" />
```

In Angular, `withRtl()` is the same setting as feature-list sugar, `[features]="[withRtl(), withThumbnail()]"`, and an explicit
`[direction]` input still wins.

### The `direction` setting

| Value | Behavior |
| --- | --- |
| `'ltr'` (default) | Left-to-right, exactly as before |
| `'rtl'` | Mirrored: arrows, swipe, transforms, thumbnails |
| `'auto'` | Inherit the direction of the page/gallery element |

`'auto'` resolves from the gallery element's computed direction in
vanilla JavaScript, and from the nearest `dir` attribute
(`document.documentElement` / `document.body`) in the framework
packages. The default stays `'ltr'` so upgrading never changes
behavior on existing pages, RTL pages opt in with `'rtl'` or
`'auto'`.

### What the RTL layer covers

-   Prev/next arrows swap sides and glyphs; keyboard `ArrowLeft` /
    `ArrowRight` advance in reading order.
-   Slide resting positions, swipe advance and the release spring are
    mirrored.
-   The thumbnail strip starts at the right edge and drags in reading
    order; the counter keeps its `3 / 5` form in bidi text.
-   The share dropdown, comment drawer and toolbar chrome mirror.
-   Slide captions render `direction: rtl`, while the slide rail
    keeps internal LTR geometry (the mirroring lives in the
    transforms).

Everything is scoped to `.lg-container[dir='rtl']`, a forced-LTR
gallery inside an RTL page stays untouched. The decorative horizontal
transitions (`lg-slide-skew`, `lg-tube`, …) intentionally keep their
LTR choreography.
