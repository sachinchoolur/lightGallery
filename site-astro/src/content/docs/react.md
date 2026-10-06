---
title: "@lightgallery/react"
description: "A native React lightGallery component. React renders the triggers and the lightbox, with no wrapper and no second runtime touching your DOM."
lead: "A native React lightGallery component. React renders the triggers and the lightbox, with no wrapper and no second runtime touching your DOM."
date: 2026-07-24T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'Frameworks', name: '@lightgallery/react' } }
weight: 62
toc: true
---

`@lightgallery/react` is a native React component, not a wrapper around
the vanilla script. React renders every node, in the trigger grid and in
the lightbox, so nothing else mutates your DOM and the gallery behaves
like the rest of your tree: props in, callbacks out. Styling reuses the
published `lightgallery/css/*` files, so the lightbox looks exactly like
the vanilla one.

## Install & styles

```bash
npm install @lightgallery/react lightgallery
```

Peer range: React 18 or 19 (`react` and `react-dom`).

```tsx
// CSS is a consumer import, the React package ships no CSS.
import 'lightgallery/css/lightgallery.css';
// Per-plugin styles as needed:
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
```

## Uncontrolled (thumbnail grid)

```tsx
import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

const items = [
    {
        src: 'img/1-1600.jpg',
        thumb: 'img/1-240.jpg',
        alt: 'Mountains',
        lgSize: '1600-1067', // enables the zoom-from-origin open animation
        caption: <h4>Mountains</h4>,
    },
];

export function Gallery() {
    return (
        <LightGallery plugins={[Thumbnail, Zoom]} zoom={{ scale: 1.5 }}>
            {items.map((item) => (
                <LightGalleryItem key={item.src} item={item} href={item.src}>
                    <img src={item.thumb} alt={item.alt} />
                </LightGalleryItem>
            ))}
        </LightGallery>
    );
}
```

## Controlled

Pass `slides` instead of children and the component renders no triggers;
you own `open` and `index` and open the gallery from anything you like.

```tsx
import { useState } from 'react';
import { LightGallery } from '@lightgallery/react';

const items = [
    { src: 'img/1-1600.jpg', thumb: 'img/1-240.jpg', alt: 'Mountains' },
    { src: 'img/2-1600.jpg', thumb: 'img/2-240.jpg', alt: 'Forest' },
];

export function Gallery() {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    return (
        <>
            <button onClick={() => setOpen(true)}>Open gallery</button>
            <LightGallery
                slides={items}
                open={open}
                onClose={() => setOpen(false)}
                index={index}
                onIndexChange={setIndex}
            />
        </>
    );
}
```

## Imperative

A `ref` exposes `openGallery(index?)`, `closeGallery()`,
`goToSlide(index)`, `nextSlide()`, `prevSlide()` and `refresh()`.

```tsx
import { useRef } from 'react';
import { LightGallery, type LightGalleryRefHandle } from '@lightgallery/react';

const items = [
    { src: 'img/1-1600.jpg', thumb: 'img/1-240.jpg', alt: 'Mountains' },
    { src: 'img/2-1600.jpg', thumb: 'img/2-240.jpg', alt: 'Forest' },
];

export function Gallery() {
    const gallery = useRef<LightGalleryRefHandle>(null);

    return (
        <>
            <button onClick={() => gallery.current?.openGallery(1)}>
                Open at slide 2
            </button>
            <LightGallery ref={gallery} slides={items} />
        </>
    );
}
```

## Settings, events and render slots

Settings are flat props with the vanilla names (`mode`, `speed`, `loop`,
`captionPosition`, …); the [settings reference](/docs/settings/) lists
every one. Per-plugin settings are a prop named after the plugin
(`zoom={{ scale: 1.5 }}`), typed via module augmentation from each plugin
entry. Lifecycle callbacks use the documented [event names](/docs/events/)
with an `on` prefix (`onBeforeSlide`, `onAfterSlide`, `onSlideItemLoad`,
…).

The `render` prop swaps parts of the chrome for your own components:
`caption(item, index)`, `counter(current, total)`, `prevButton()`,
`nextButton()` and `icon(name)`, which replaces a
[control icon](/docs/custom-icons/) by name. An inline gallery mounts into
an element you pass as `container`.

## SSR / Next.js

The gallery is SSR-safe by construction: every entry point imports cleanly
in bare Node (ESM and CJS), and `renderToString` emits nothing for the
gallery itself, the portal mounts client-side after hydration. Trigger
children (`<LightGalleryItem>`) server-render as static markup, so grids
are crawlable.

With the Next.js App Router the component must live in a client component:

```tsx
'use client';

import { LightGallery, LightGalleryItem } from '@lightgallery/react';
// ... as above
```

Import the CSS in your root layout (or any server component):

```tsx
// app/layout.tsx
import 'lightgallery/css/lightgallery.css';
```

No `dynamic(() => …, { ssr: false })` wrapper is needed.

## Accessibility

The open gallery is a modal dialog (`role="dialog"`, `aria-modal`, an
accessible name). Focus moves into the gallery on open, Tab is trapped
while it is open and focus returns to the trigger on close. Thumbnails and
pager dots are keyboard-operable, and `prefers-reduced-motion` disables
the animations. The open gallery passes axe WCAG A/AA checks in CI. The
[accessibility page](/docs/accessibility/) covers the live region, the
labels and the settings involved.

## Keyboard bindings

| Key | Action |
|---|---|
| `Esc` | close (`escKey`) |
| `←` / `→` | previous / next slide (`keyPress`) |
| `Tab` / `Shift+Tab` | cycle focus within the gallery (`trapFocus`) |
| `Enter` / `Space` | activate focused thumbnail / pager dot |

## Plugins

All 14 plugins ship as subpath imports, plus the justified layout; pass them via `plugins={[]}`
and configure each with the prop named after it. Import the matching
`lightgallery/css/lg-*.css` where one exists.

| Plugin | Import | Key options (prop of the same name) |
|---|---|---|
| Thumbnail | `@lightgallery/react/plugins/thumbnail` | `thumbWidth`, `thumbHeight`, `thumbMargin`, `animateThumb`, `toggleThumb` |
| Zoom | `@lightgallery/react/plugins/zoom` | `scale`, `actualSize`, `showZoomInOutIcons`, `infiniteZoom`, `enableZoomAfter` |
| Video | `@lightgallery/react/plugins/video` | `autoplayFirstVideo`, `autoplayVideoOnSlide`, `youTubePlayerParams`, `vimeoPlayerParams`, `gotoNextSlideOnVideoEnd` |
| Autoplay | `@lightgallery/react/plugins/autoplay` | `slideShowAutoplay`, `slideShowInterval`, `progressBar`, `forceSlideShowAutoplay` |
| Fullscreen | `@lightgallery/react/plugins/fullscreen` | `fullScreen` |
| Hash | `@lightgallery/react/plugins/hash` | `galleryId`, `customSlideName` |
| Pager | `@lightgallery/react/plugins/pager` | `pager` |
| Share | `@lightgallery/react/plugins/share` | `facebook`, `twitter`, `pinterest`, `additionalShareOptions` (typed objects) |
| Rotate | `@lightgallery/react/plugins/rotate` | `rotateSpeed`, `rotateLeft/Right`, `flipHorizontal/Vertical` |
| Comment | `@lightgallery/react/plugins/comment` | `commentBox`, `renderComments(item)` render prop |
| MediumZoom | `@lightgallery/react/plugins/mediumZoom` | `margin`, `backgroundColor` (+ per-item `lgBackgroundColor`) |
| RelativeCaption | `@lightgallery/react/plugins/relativeCaption` | `relativeCaption` |
| VimeoThumbnail | `@lightgallery/react/plugins/vimeoThumbnail` | `showVimeoThumbnails`, `showThumbnailWithPlayButton` |
| OriginCrop | `@lightgallery/react/plugins/originCrop` | `originCrop`: flies a cropped thumbnail from its crop ([zoom from origin](/demos/zoom-from-origin/)) |
| Justified | `@lightgallery/react/plugins/justified` | Not a plugin: the `<JustifiedGrid>` component wraps the triggers, with `rowHeight`, `gap`, `lastRow` ([justified layout](/docs/justified-layout/)) |

Order matters for slide wrappers: put `Zoom` before `Rotate` so zoom stays
the outermost transform.

## Migrating from the 2.x React wrapper

Coming from `lightgallery/react`, the wrapper that shipped inside the
vanilla 2.x package? The full list is in the
[migration guide](/docs/migration/#react); the key changes:

- Items are data: `dynamic`/`dynamicEl` and every DOM-scraping option
  (`selector`, `extraProps`, `exThumbImage`, …) are gone, pass `slides`
  or wrap thumbnails in `<LightGalleryItem item={…}>`.
- HTML-string options became typed render props: `subHtml` →
  `item.caption` (ReactNode) or `item.captionHtml` (explicit raw HTML);
  `nextHtml`/`prevHtml`/`appendCounterTo` → the `render` prop slots.
- `appendSubHtmlTo` → `captionPosition: 'bar' | 'slide' | 'outer'`;
  `addClass` → `className`; `index` → controlled `index`/`onIndexChange`
  or `defaultIndex`.
- Plugins are modules, not constructors: `plugins={[Zoom]}` with settings
  as a `zoom={{ … }}` prop instead of flat settings keys.
- Events keep their documented `onXxx` names and payloads; `updateSlides`
  is gone (changing `slides` is the update). The `videojs` option was
  dropped, bring custom players through a plugin `slideRenderer`.

## Next steps

- [React image gallery](/demos/react-image-gallery/),
  [video gallery](/demos/react-video-gallery/),
  [carousel](/demos/react-carousel/) and
  [video carousel](/demos/react-video-carousel/) demos, each with the
  code behind it.
- Features that work the same in every package:
  [justified layout](/docs/justified-layout/),
  [virtualization](/docs/virtualization/),
  [thumbnail scrubbing](/docs/thumbnail-scrubbing/),
  [video facades](/docs/video-facades/),
  [custom icons](/docs/custom-icons/),
  [localization and RTL](/docs/localization-rtl/) and
  [responsive loading](/docs/responsive-loading/).
- The [settings reference](/docs/settings/), every setting is a prop of
  the same name, and the [events](/docs/events/) list, each one an
  `on*` callback here.

## License

Free and open source under the GPLv3, like every lightGallery package. If
your project keeps its source proprietary, a [commercial license](/license/)
covers it: same code, nothing gated. Use `0000-0000-000-0000` as a temporary
`licenseKey` for evaluation.
