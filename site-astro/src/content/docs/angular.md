---
title: "@lightgallery/angular"
description: "A native Angular lightGallery component. Angular renders the triggers and the lightbox, with standalone components, signal inputs and outputs and zoneless change detection."
lead: "A native Angular lightGallery component. Angular renders the triggers and the lightbox, with standalone components, signal inputs and outputs and zoneless change detection."
date: 2026-07-24T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'Frameworks', name: '@lightgallery/angular' } }
weight: 64
toc: true
---

`@lightgallery/angular` is a native Angular component, not a wrapper
around the vanilla script. Angular renders every node, in the trigger grid
and in the lightbox, so nothing else mutates your DOM. You get standalone
components, signal inputs and outputs, zoneless change detection, CDK
overlay and a11y, and a secondary entry point per plugin in Angular
Package Format. Styling reuses the published `lightgallery/css/*` files,
so the lightbox looks exactly like the vanilla one.

## Install

```bash
npm install @lightgallery/angular @angular/cdk lightgallery
```

Peer ranges: `@angular/core`, `@angular/common`, `@angular/platform-browser`
and `@angular/cdk` `>=21 <23`. Works with zoneless change detection (no `zone.js` anywhere in
the package, tests included).

```ts
// Global styles (angular.json "styles" or your root stylesheet):
import 'lightgallery/css/lightgallery.css';
// plus the CSS of each feature you use, e.g.:
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
```

## Quick start, uncontrolled

Thumbnails on the page open the lightbox; mount order defines slide order.

```ts
import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
    type SlideEventDetail,
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

    onSlide(event: SlideEventDetail): void {
        console.log(event.index, event.prevIndex);
    }
}
```

## Controlled

Pass `[slides]` instead of `[lgGalleryItem]` children and the component
renders no triggers; `[open]` with `(closed)` and the two-way `[(index)]`
give you the state.

```ts
import { Component, signal } from '@angular/core';
import { LgGalleryComponent, type LgGalleryItem } from '@lightgallery/angular';

@Component({
    imports: [LgGalleryComponent],
    template: `
        <button (click)="open.set(true)">Open gallery</button>
        <lg-gallery
            [slides]="items"
            [open]="open()"
            (closed)="open.set(false)"
            [(index)]="index"
        />
    `,
})
export class Gallery {
    open = signal(false);
    index = signal(0);
    items: LgGalleryItem[] = [
        { src: 'img/1.jpg', thumb: 'img/1-t.jpg', alt: 'Mountains' },
        { src: 'img/2.jpg', thumb: 'img/2-t.jpg', alt: 'Forest' },
    ];
}
```

## Imperative

A template reference (`#lg="lgGallery"`) exposes `openGallery(index?)`,
`closeGallery()`, `goToSlide(index)`, `nextSlide()`, `prevSlide()` and
`refresh()`.

```ts
import { Component } from '@angular/core';
import { LgGalleryComponent, type LgGalleryItem } from '@lightgallery/angular';

@Component({
    imports: [LgGalleryComponent],
    template: `
        <button (click)="lg.openGallery(1)">Open at slide 2</button>
        <lg-gallery #lg="lgGallery" [slides]="items" />
    `,
})
export class Gallery {
    items: LgGalleryItem[] = [
        { src: 'img/1.jpg', thumb: 'img/1-t.jpg', alt: 'Mountains' },
        { src: 'img/2.jpg', thumb: 'img/2-t.jpg', alt: 'Forest' },
    ];
}
```

## Settings, events and slots

Settings are same-named signal inputs (`[mode]`, `[speed]`, `[loop]`,
`[captionPosition]`, …); the [settings reference](/docs/settings/) lists
every one. Events are outputs of the documented
[event names](/docs/events/) without the `on` prefix (`(beforeOpen)`,
`(afterSlide)`, `(slideItemLoad)`, …).

Template directives swap parts of the chrome for your own markup:
`*lgCaption`, `lgCounter`, `lgPrevButton` and `lgNextButton`, plus an
`lgIcon` template that replaces any [control icon](/docs/custom-icons/)
by name. An inline gallery mounts into the element you pass as
`[container]`.

## Features (all 14, plus the justified layout)

Each feature is its own tree-shakable entry point
`@lightgallery/angular/plugins/<name>` exposing a `with<Name>(options?)`
factory for the `[features]` input:

| Feature | Import | Key options (passed to the factory) |
|---|---|---|
| thumbnail | `withThumbnail()` | `thumbWidth`, `thumbHeight`, `thumbMargin`, `animateThumb`, `toggleThumb` |
| zoom | `withZoom()` | `scale`, `actualSize`, `showZoomInOutIcons`, `infiniteZoom`, `enableZoomAfter` |
| video | `withVideo()` | `autoplayFirstVideo`, `autoplayVideoOnSlide`, `youTubePlayerParams`, `vimeoPlayerParams`, `gotoNextSlideOnVideoEnd` |
| autoplay | `withAutoplay()` | `slideShowAutoplay`, `slideShowInterval`, `progressBar`, `forceSlideShowAutoplay` |
| fullscreen | `withFullscreen()` | `fullScreen` |
| hash | `withHash()` | `galleryId`, `customSlideName` |
| pager | `withPager()` | `pager` |
| share | `withShare()` | `facebook`, `twitter`, `pinterest`, `additionalShareOptions` (typed objects) |
| rotate | `withRotate()` | `rotateSpeed`, `rotateLeft/Right`, `flipHorizontal/Vertical` |
| comment | `withComment()` | `commentBox`, `commentsTemplate: TemplateRef` |
| mediumZoom | `withMediumZoom()` | `margin`, `backgroundColor` (+ per-item `lgBackgroundColor`) |
| relativeCaption | `withRelativeCaption()` | `relativeCaption` (presets `captionPosition: 'slide'`) |
| vimeoThumbnail | `withVimeoThumbnail()` | `showVimeoThumbnails`, `showThumbnailWithPlayButton` |
| originCrop | `withOriginCrop()` | `originCrop`: flies a cropped thumbnail from its crop ([zoom from origin](/demos/zoom-from-origin/)) |
| justified | `LgJustifiedGridComponent` | Not a feature: the `<lg-justified-grid>` component wraps the triggers, with `rowHeight`, `gap`, `lastRow` ([justified layout](/docs/justified-layout/)) |

Features compose per gallery instance, two galleries on one page can have
different feature sets. Order matters for slide wrappers: put `withZoom()`
before `withRotate()` so zoom stays the outermost transform.

## SSR / hydration

- Server-safe and zoneless: with `@angular/ssr` the page server-renders
  your trigger markup as static HTML; the lightbox overlay **never
  server-renders** (even with `[open]` true at bootstrap), so there is
  nothing to hydrate-mismatch. The overlay is created on open, in the
  browser only.
- Deep-link flows (hash feature) run after hydration via a browser-only
  timer; feature services are server-instantiated but guard `window` (the
  built-ins already do).

## Accessibility

The open gallery is a modal dialog (`role="dialog"`, `aria-modal`, an
accessible name). The CDK focus trap moves focus in on open, keeps Tab
inside while it is open and returns focus to the trigger on close. Every
button is labelled, thumbnails and pager dots are keyboard-operable, and
`prefers-reduced-motion` disables the animations. The open gallery passes
axe WCAG A/AA checks in CI. The [accessibility page](/docs/accessibility/)
covers the live region, the labels and the settings involved.

## Migrating from the legacy `lightgallery` Angular wrapper

Coming from `lightgallery/angular`, the wrapper that shipped inside the
vanilla 2.x package? The full list is in the
[migration guide](/docs/migration/#angular); the key changes:

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

## Next steps

- [Angular image gallery](/demos/angular-image-gallery/) and
  [video gallery](/demos/angular-video-gallery/) demos, each with the
  code behind it.
- Features that work the same in every package:
  [justified layout](/docs/justified-layout/),
  [virtualization](/docs/virtualization/),
  [thumbnail scrubbing](/docs/thumbnail-scrubbing/),
  [video facades](/docs/video-facades/),
  [custom icons](/docs/custom-icons/),
  [localization and RTL](/docs/localization-rtl/) and
  [responsive loading](/docs/responsive-loading/).
- The [settings reference](/docs/settings/), every setting is an input
  of the same name, and the [events](/docs/events/) list, each one an
  output here.

## License

GPL-3.0-only, matching lightGallery's licensing model. For commercial
projects a commercial license is available, see the
[license page](/license/), or use `0000-0000-000-0000` as a temporary
`licenseKey` for evaluation.
