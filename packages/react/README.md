# @lightgallery/react

> **Alpha.** A ground-up, native React implementation of
> lightGallery — React owns every DOM node; no runtime dependency on the
> vanilla `lightgallery` JS. Styling reuses the published
> `lightgallery/css/*` files unchanged. State and pure gallery logic live
> in [`@lightgallery/headless`](../headless), shared with the upcoming
> Angular port.

## Install & styles

```bash
npm install @lightgallery/react lightgallery
```

```tsx
// CSS is a consumer import — the React package ships no CSS.
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

```tsx
const [open, setOpen] = useState(false);
const [index, setIndex] = useState(0);

<LightGallery
    slides={items}
    open={open}
    onClose={() => setOpen(false)}
    index={index}
    onIndexChange={setIndex}
/>;
```

Settings are flat props with the vanilla 2.x names (`mode`, `speed`, `loop`,
`preload`, …). Per-plugin settings are props named by plugin
(`zoom={{ scale: 1.5 }}`), typed via module augmentation from each plugin
entry. Lifecycle callbacks use the documented 2.x event names
(`onBeforeSlide`, `onAfterSlide`, `onSlideItemLoad`, …).

An imperative handle is available via `ref`:
`{ openGallery(index?), closeGallery(), goToSlide(i), nextSlide(),
prevSlide(), refresh() }`.

## SSR / Next.js

The gallery is SSR-safe by construction: every entry point imports cleanly
in bare Node (ESM and CJS), and `renderToString` emits nothing for the
gallery itself — the portal mounts client-side after hydration. Trigger
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

Beyond 2.x: dialog semantics (`role="dialog"`, `aria-modal`, accessible
name), focus moves into the gallery on open, Tab is trapped while open and
focus returns to the trigger on close, thumbnails and pager dots are
keyboard-operable, and `prefers-reduced-motion` disables all animations.
The open gallery passes axe WCAG A/AA checks (automated in CI).

## Keyboard bindings

| Key | Action |
|---|---|
| `Esc` | close (`escKey`) |
| `←` / `→` | previous / next slide (`keyPress`) |
| `Tab` / `Shift+Tab` | cycle focus within the gallery (`trapFocus`) |
| `Enter` / `Space` | activate focused thumbnail / pager dot |

## Plugins

All 13 vanilla plugins ship as subpath imports; pass them via `plugins={[]}`
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

Order matters for slide wrappers: put `Zoom` before `Rotate` so zoom stays
the outermost transform (matching 2.x DOM order).

## Migrating from the 2.x React wrapper

Coming from `lightgallery/react` (the wrapper inside the vanilla package)
or the old CRA wrapper:

- Items are data: `dynamic`/`dynamicEl` and every DOM-scraping option
  (`selector`, `extraProps`, `exThumbImage`, …) are gone — pass `slides`
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
  dropped — bring custom players through `render.slide`.
- The full behavior comparison lives in the repo's
  `plans-react/parity-matrix.md`.

## License

GPL-3.0-only, matching lightGallery's licensing model. For commercial
projects a commercial license is available — see
[lightgalleryjs.com](https://www.lightgalleryjs.com/docs/license/) or use
`0000-0000-000-0000` as a temporary `licenseKey` for evaluation.
