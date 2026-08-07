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

## Large galleries (virtualization)

For 1,000+ item galleries, `virtualization` bounds the DOM (default off):

- `virtualization.slides` — mounted-slide pool size (overrides
  `numberOfSlideItemsInDom`).
- `virtualization.thumbs` — thumbnail-strip windowing: only the visible
  thumbs plus an overscan render, with spacers preserving the strip
  geometry (`'auto'` = one extra viewport per side, or a thumb count).
  The window advances at commit points (release, slide change, resize),
  never per pointer move.

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

## Localizing labels

Every UI label — core controls and plugin buttons alike — lives on the
`strings` setting and merges per-key over the English defaults:

```tsx
<LightGallery
    slides={slides}
    plugins={[Zoom, Thumbnail]}
    strings={{
        closeGallery: 'Galerie schließen',
        toggleThumbnails: 'Vorschaubilder umschalten',
        zoomIn: 'Vergrößern',
    }}
/>
```

The per-plugin string objects (`zoomPluginStrings`, `sharePluginStrings`,
…) are deprecated aliases — a key set there still wins over `strings`.

## Right-to-left galleries

Set `direction: 'rtl'` (or `'auto'`, which inherits the page's `dir`
attribute — the default is `'ltr'`) and load the opt-in RTL stylesheet — keyboard
arrows, swipe advance, slide transforms and the thumbnail strip all
mirror; LTR galleries pay zero CSS bytes:

```tsx
import 'lightgallery/css/lg-rtl.css';

<LightGallery slides={slides} direction="rtl" />;
```

The stylesheet only styles `.lg-container[dir='rtl']`, so a forced-LTR
gallery inside an RTL page stays untouched. The decorative horizontal
transitions (`lg-slide-skew`, `lg-tube`, …) keep their LTR choreography.

## Justified layout

Lay the trigger thumbnails out in justified rows — equal heights,
varying widths, filling the container edge to edge — with the
`lightgallery/css/lg-justified.css` stylesheet and the `JustifiedGrid` wrapper. Aspect
ratios come from `data-lg-size`, the thumbnail's `width`/`height`
attributes, or the loaded image (one relayout). The grid reflows on
resize, mirrors under RTL, and writes precise `sizes` attributes on
`srcset` thumbnails. `lastRow` controls the leftover row (`'start'`
default, `'justify'`, `'hide'`).

```tsx
import { JustifiedGrid } from '@lightgallery/react/plugins/justified';
import 'lightgallery/css/lg-justified.css';

<LightGallery slides={undefined} plugins={[Thumbnail, Zoom]}>
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
| Video | `@lightgallery/react/plugins/video` | `videoFacade` (lite embed, default on), `youTubeNoCookie` (default on), `autoplayFirstVideo`, `autoplayVideoOnSlide`, `youTubePlayerParams`, `vimeoPlayerParams`, `gotoNextSlideOnVideoEnd` |
| Autoplay | `@lightgallery/react/plugins/autoplay` | `slideShowAutoplay`, `slideShowInterval`, `progressBar`, `forceSlideShowAutoplay` |
| Fullscreen | `@lightgallery/react/plugins/fullscreen` | `fullScreen` |
| Hash | `@lightgallery/react/plugins/hash` | `galleryId`, `customSlideName`, `hashDriver` (`auto` = Navigation API where supported, History fallback) |
| Pager | `@lightgallery/react/plugins/pager` | `pager` |
| Share | `@lightgallery/react/plugins/share` | `preferNativeShare` (OS share sheet; default on touch), `facebook`, `twitter` (X intent), `pinterest`, `additionalShareOptions` (typed objects) |
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

## License

GPL-3.0-only, matching lightGallery's licensing model. For commercial
projects a commercial license is available — see
[lightgalleryjs.com](https://www.lightgalleryjs.com/docs/license/) or use
`0000-0000-000-0000` as a temporary `licenseKey` for evaluation.
