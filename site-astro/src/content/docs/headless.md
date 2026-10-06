---
title: "@lightgallery/headless"
description: "Framework-free lightGallery core: state machine, gesture math and plugin logic shared by every v3 binding."
lead: "Framework-free lightGallery core: state machine, gesture math and plugin logic shared by every v3 binding."
date: 2026-07-24T00:00:00.000Z
draft: false
images: []
menu: { docs: { parent: 'Frameworks', name: '@lightgallery/headless' } }
weight: 61
toc: true
---

`@lightgallery/headless` is the framework-free core of lightGallery 3:
everything a gallery needs to decide, with none of the rendering. It holds
the state machine, settings resolution, gesture verdicts, spring physics,
zoom and thumbnail math, the justified layout, responsive image selection,
video URL builders, share links and URL drivers. It has no DOM and no
framework; its TypeScript config excludes the DOM library, so `window`
and `document` do not even type-check inside it.

The vanilla `lightgallery` package, [`@lightgallery/react`](/docs/react/),
[`@lightgallery/vue`](/docs/vue/) and
[`@lightgallery/angular`](/docs/angular/) are all renderers over this
core. That is why a swipe threshold, a zoom clamp or a setting behaves
the same in every package: it is the same code.

## Who it is for

If you use one of the four packages you never install this one; each
depends on it. Install it directly to build a binding for another
framework, a web component, or a custom gallery UI on the same
foundation.

```bash
npm install @lightgallery/headless
```

## What it exports

| Area | Exports | Notes |
| --- | --- | --- |
| State | `createGalleryState`, `galleryReducer`, `clampIndex` | Pure reducer over `OPEN`, `CLOSE`, `NEXT`, `PREV`, `GO_TO` and the load and transition actions |
| Settings | `resolveSettings`, `coreSettingsDefaults` | Merges user settings, mobile settings and `strings` over the defaults |
| Items | `getSlideType` | Image, video, iframe or inline, from an item's fields |
| Slide windowing | `getSlideIndexesInDom`, `getPreloadIndexes`, `getSlidePoolIndexes` | Which slides to mount and preload, including virtualization |
| Gestures | `getSwipeAxis`, `getSwipeReleaseVerdict`, `getHorizontalDragTransforms`, `getVerticalDragEffects`, `shouldCloseOnVerticalDrag`, `getEdgeFrictionedDelta`, `upsertPointer`, `removePointer` | Axis lock, flick detection, boundary friction, drag to close |
| Physics | `stepSpring`, `isSpringSettled`, `project`, `getWindowedVelocity`, `pushVelocitySample` | Damped spring, momentum projection, windowed release velocity |
| Zoom | `getPinchScale`, `getPinchPan`, `getPointZoomPan`, `clampScale`, `clampPan`, `getPanBounds`, `shouldCloseOnPinch`, `getActualSizeScale` | Focal-point pinch, pan bounds with friction, pinch to close |
| Thumbnails | `getThumbWindow`, `getThumbCorridorWindow`, `getActiveThumbTranslate`, `clampThumbTranslate`, `getElasticThumbTranslate`, `getScrubThumbIndex`, `getScrubThumbTranslate` | Strip windowing, centering, elastic edges, scrubbing |
| Layout | `getJustifiedLayout`, `getJustifiedRows` | Row-justified box layout for trigger grids |
| Responsive | `parseSrcset`, `resolveImageSource`, `resolveSizes`, `matchesMedia`, `awaitDecode` | `srcset` and `sizes` selection, decode gating |
| Origin animation | `getOriginTransform`, `fitImageSize`, `parseImageSize` | Open-from-trigger transforms |
| Origin crop | `getOriginWindow`, `getOriginCropFlight`, `parseObjectFit`, `parseBackgroundFit`, `parseCssPosition` | The origin crop plugin's flight from a cropped thumbnail |
| Toolbar | `getToolbarOverflow`, `getToolbarItemPriority` | Which buttons move into the overflow menu |
| Video | `getVideoInfo`, `getYouTubeEmbedUrl`, `getVimeoEmbedUrl`, `getWistiaEmbedUrl`, `getYouTubePosterUrl`, `getFacadePoster` | Provider detection, embed URLs, facade posters |
| Share | `getSharePayload`, `canNativeShare`, `getXShareLink`, `getFacebookShareLink`, `getPinterestShareLink` | Web Share payload and social fallbacks |
| URL drivers | `createHashDriver`, `createHistoryHashDriver`, `createNavigationHashDriver` | One interface over hash, history and the Navigation API |
| Plugin slices | `initialZoomSlice`, `applyZoom`, `initialRotateSlice`, `rotateLeft`, `rotateRight`, `flipHorizontal`, `flipVertical`, `initialAutoplaySlice` | Per-plugin state reducers |
| Accessibility | `formatSlideAnnouncement` | Live-region text from a template string |
| Icons | `coreDefaultIcons`, `zoomDefaultIcons`, …, `LgIconName` | The built-in inline SVG icon sets, grouped by feature |
| License | `setLicenseKey`, `checkLicenseKey` | The license check every package shares |
| Events | `createEmitter` | A typed emitter for renderers |

Each module is independent and the package has no side effects; import
only what your renderer needs.

## Example

```ts
import {
    createGalleryState,
    galleryReducer,
    getSlideIndexesInDom,
    resolveSettings,
} from '@lightgallery/headless';

const settings = resolveSettings({ loop: true, speed: 400 });

let state = createGalleryState({ slidesCount: 5, loop: settings.loop });
state = galleryReducer(state, { type: 'OPEN', index: 2 });
state = galleryReducer(state, { type: 'NEXT' });

// Which slides to keep mounted right now: the current slide, its
// neighbours, and the previous slide so an outgoing transition can finish.
const mounted = getSlideIndexesInDom(
    state.currentIndex,
    state.previousIndex,
    state.slidesCount,
    settings.numberOfSlideItemsInDom,
    settings.loop,
);
```

Every function is pure. A renderer wraps the reducer in its own
reactivity, a reducer hook in React, a store in Vue, a signal in Angular,
and owns every DOM concern: measuring, painting, pointer events and
focus.

## Related

- [Creating plugins](/docs/creating-plugins/) for the plugin surface
  the renderers expose.
- The [React](/docs/react/), [Vue](/docs/vue/) and
  [Angular](/docs/angular/) guides, each a renderer over this package.

## License

Free and open source under the GPLv3, like every lightGallery package. If
your project keeps its source proprietary, a [commercial license](/license/)
covers it: same code, nothing gated.
