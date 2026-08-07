# @lightgallery/angular

Native Angular lightGallery over `@lightgallery/headless` — every DOM node
rendered by Angular. Standalone components, signal inputs/outputs, zoneless
change detection, CDK overlay/a11y, Angular Package Format with a secondary
entry point per plugin. The framework-free state machine, gesture math and
plugin logic are shared with `@lightgallery/react` through the headless
package: one product, three renderings.

## Install

```bash
npm install @lightgallery/angular @lightgallery/headless @angular/cdk
# CSS ships from the vanilla package:
npm install lightgallery
```

Peer ranges: `@angular/core`, `@angular/common`, `@angular/cdk`
`>=21 <23`. Works with zoneless change detection (no `zone.js` anywhere in
the package, tests included).

```ts
// Global styles (angular.json "styles" or your root stylesheet):
import 'lightgallery/css/lightgallery.css';
// plus the CSS of each feature you use, e.g.:
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
```

## Quick start — uncontrolled

Thumbnails on the page open the lightbox; mount order defines slide order.

```ts
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

@Component({
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <lg-gallery [features]="features" (afterSlide)="onSlide($event)">
            @for (item of items; track item.src) {
                <a [href]="item.src" [lgGalleryItem]="item">
                    <img [src]="item.thumb" [alt]="item.alt" />
                </a>
            }
        </lg-gallery>
    `,
})
export class Gallery {
    features = [withThumbnail({ thumbWidth: 120 }), withZoom()];
    items: LgGalleryItem[] = [
        { src: 'img/1.jpg', thumb: 'img/1-t.jpg', alt: '…', caption: '…' },
    ];
}
```

## Controlled + imperative

```html
<!-- Controlled: -->
<lg-gallery
    [slides]="items"
    [open]="open()"
    (closed)="open.set(false)"
    [(index)]="index"
/>

<!-- Imperative (template ref handle): -->
<lg-gallery #lg="lgGallery" [slides]="items" />
<button (click)="lg.openGallery(2)">Open at slide 3</button>
```

Settings are same-named signal inputs (`[mode]`, `[speed]`, `[loop]`,
`[captionPosition]`, …); events are outputs without the `on` prefix
(`(beforeOpen)`, `(afterSlide)`, `(slideItemLoad)`, …). Slots are template
directives: `*lgCaption`, `lgCounter`, `lgPrevButton`, `lgNextButton`.
Inline gallery: `[container]="element"`.

## Features (all 13)

Each feature is its own tree-shakable entry point
`@lightgallery/angular/plugins/<name>` exposing a `with<Name>(options?)`
factory for the `[features]` input:

| Feature | Import | Notable options |
|---|---|---|
| thumbnail | `withThumbnail()` | `thumbWidth`, `thumbHeight`, `animateThumb`, `toggleThumb` |
| zoom | `withZoom()` | `scale`, `actualSize`, `showZoomInOutIcons`, `infiniteZoom` |
| video | `withVideo()` | `videoFacade` (lite embed, default on), `youTubeNoCookie` (default on), `autoplayFirstVideo`, `autoplayVideoOnSlide`, `youTubePlayerParams` |
| autoplay | `withAutoplay()` | `slideShowInterval`, `slideShowAutoplay`, `progressBar` |
| fullscreen | `withFullscreen()` | — |
| hash | `withHash()` | `galleryId`, `customSlideName`, `hashDriver` (`auto` = Navigation API where supported, History fallback) |
| pager | `withPager()` | — |
| share | `withShare()` | `preferNativeShare` (OS share sheet; default on touch), `facebook`/`twitter` (X intent)/`pinterest`, `additionalShareOptions` (typed) |
| rotate | `withRotate()` | `rotateSpeed`, per-button toggles |
| comment | `withComment()` | `commentBox`, `commentsTemplate: TemplateRef` |
| mediumZoom | `withMediumZoom()` | `margin`, `backgroundColor` (presets a minimal UI) |
| relativeCaption | `withRelativeCaption()` | — (presets `captionPosition: 'slide'`) |
| vimeoThumbnail | `withVimeoThumbnail()` | `showThumbnailWithPlayButton` |

Features compose per gallery instance — two galleries on one page can have
different feature sets. Order matters for slide wrappers: put `withZoom()`
before `withRotate()` (zoom outermost, 2.x DOM order).

## Large galleries (virtualization)

For 1,000+ item galleries, `virtualization` bounds the DOM (default off):

- `virtualization.slides` — mounted-slide pool size (overrides
  `numberOfSlideItemsInDom`).
- `virtualization.thumbs` — thumbnail-strip windowing: only the visible
  thumbs plus an overscan render, with spacers preserving the strip
  geometry (`'auto'` = one extra viewport per side, or a thumb count).
  The window advances at commit points (release, slide change, resize),
  never per pointer move.

## SSR / hydration

- Server-safe and zoneless: with `@angular/ssr` the page server-renders
  your trigger markup as static HTML; the lightbox overlay **never
  server-renders** (even with `[open]` true at bootstrap), so there is
  nothing to hydrate-mismatch. The overlay is created on open, in the
  browser only.
- Deep-link flows (hash feature) run after hydration via a browser-only
  timer; feature services are server-instantiated but guard `window` (the
  built-ins already do).
- Verified against `@angular/platform-server` `renderApplication` and a
  packed-artifact AOT + prerender consumer build.

## Accessibility

`role="dialog"`/`aria-modal` with accessible-name fallback, CDK `FocusTrap`
(focus in on open, Tab trapped, returned to the trigger on close), labelled
buttons everywhere, keyboard-operable thumbnails and pager dots,
`prefers-reduced-motion` support. Automated axe run (WCAG A/AA): zero
violations.

## Localizing labels

Every UI label — core controls and feature buttons alike — lives on the
`strings` input and merges per-key over the English defaults:

```html
<lg-gallery
    [slides]="items"
    [features]="features"
    [strings]="{
        closeGallery: 'Galerie schließen',
        toggleThumbnails: 'Vorschaubilder umschalten',
        zoomIn: 'Vergrößern',
    }"
/>
```

The per-feature string objects (`zoomPluginStrings`, `sharePluginStrings`,
…) are deprecated aliases — a key set there still wins over `strings`.

## Right-to-left galleries

Set `direction: 'rtl'` (or `'auto'`, which inherits the page's `dir`
attribute — the default is `'ltr'`) and load the opt-in RTL stylesheet — keyboard
arrows, swipe advance, slide transforms and the thumbnail strip all
mirror; LTR galleries pay zero CSS bytes:

```ts
import 'lightgallery/css/lg-rtl.css';
```

```html
<lg-gallery [slides]="items" direction="rtl" />
```

`withRtl()` is the same setting as feature-list sugar —
`[features]="[withRtl(), withThumbnail()]"` — and an explicit
`[direction]` input still wins.

The stylesheet only styles `.lg-container[dir='rtl']`, so a forced-LTR
gallery inside an RTL page stays untouched. The decorative horizontal
transitions (`lg-slide-skew`, `lg-tube`, …) keep their LTR choreography.

## Migrating from the legacy `lightgallery` Angular wrapper

The old wrapper (`lightgallery-angular*` folders / `lightgallery` v2 with
`lgQuery`) wrapped the vanilla runtime; this package renders natively. Key
renames (full table in the project ADRs):

- `dynamicEl` → `[slides]` (typed `LgGalleryItem[]`), or `[lgGalleryItem]`
  trigger directives for uncontrolled galleries.
- `onAfterSlide` etc. → outputs without the prefix: `(afterSlide)`.
- `appendSubHtmlTo` → `captionPosition: 'bar' | 'slide' | 'outer'`;
  `subHtml` strings → `caption` (plain string), `*lgCaption` template, or
  the explicit raw-HTML `captionHtml` opt-in (Angular-sanitized).
- Plugin constructor arrays → `with*()` feature values on `[features]`.
- Dropped (2.x DOM-scraping/HTML-string era): `selector`, `extraProps`,
  `getCaptionFromTitleOrAlt`, `nextHtml`/`prevHtml`, `appendCounterTo`,
  `videojs`.

## License

GPL-3.0-only — commercial license available, see
[lightgalleryjs.com/license](https://www.lightgalleryjs.com/license/).
