---
title: 'Thumbnail scrubbing'
description: 'Turn the thumbnail strip into a scrubber, drag it and the gallery follows instantly, the interaction familiar from native photo apps.'
lead: 'Drag the thumbnail strip and the gallery follows your finger, instant slide changes, native photo-app feel.'
date: 2026-08-28T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'Features', name: 'Thumbnail scrubbing' } }
weight: 73
toc: true
---

By default the thumbnail strip scrolls independently: you browse it,
then tap a thumbnail to navigate. With **`scrubThumbnails`** the strip
becomes a scrubber, while it is dragged (or still gliding after a
flick), the slide under the strip's travel position becomes current
immediately, with no slide transitions:

```js
lightGallery(el, {
    plugins: [lgThumbnail],
    scrubThumbnails: true,
});
```

How a scrub session behaves:

-   **The full strip travel spans the whole gallery**, the first and
    last slides are always reachable, and on long strips the mapping
    settles at roughly one slide per thumbnail of travel.
-   **Slide changes are instant** while the session runs. Regular
    navigation, taps on thumbnails, arrows, keyboard, swipes, keeps
    its normal transitions.
-   **The release glide keeps scrubbing**: flick the strip and the
    gallery follows it all the way to where it decelerates.
-   Scrubbing engages only when the strip actually overflows its
    container, and it requires the animated strip (`animateThumb`,
    the default). A tap is still a tap.
-   It composes with
    <a href="/docs/virtualization/">virtualization</a>: pair it with
    small `thumbWidth`/`thumbHeight` values and a windowed strip to
    scrub thousand-item galleries.

The behavior is identical in all four packages; the frameworks take
the setting in the Thumbnail plugin's options object:

```tsx
<LightGallery slides={slides} plugins={[Thumbnail]} thumbnail={{ scrubThumbnails: true }} />
```

```vue
<LightGallery :slides="slides" :plugins="[Thumbnail]" :thumbnail="{ scrubThumbnails: true }" />
```

```html
<lg-gallery [slides]="slides" [features]="[withThumbnail({ scrubThumbnails: true })]" />
```

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `scrubThumbnails` | `false` | Scrub the gallery with the thumbnail strip while it is dragged or gliding |
| `animateThumb` | `true` | The animated strip, required for scrubbing |
| `thumbWidth` / `thumbHeight` / `thumbMargin` | `100` / `'80px'` / `5` | Thumbnail geometry; smaller thumbs scrub more slides per screen of travel |
