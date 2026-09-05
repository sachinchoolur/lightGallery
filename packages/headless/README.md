# @lightgallery/headless

The framework-free core of lightGallery 3: everything a gallery needs to
*decide*, with none of the rendering. State machine, settings resolution,
gesture verdicts, spring physics, zoom and thumbnail math, justified
layout, responsive image selection, video URL builders, share links, URL
drivers. **No DOM, no framework** — the package's tsconfig excludes the
DOM lib, so `window` and `document` do not even typecheck here.

`@lightgallery/react`, `@lightgallery/vue`, `@lightgallery/angular` and
the vanilla `lightgallery` package are all renderers over this core. Use
it directly to build a gallery for another framework or a custom UI.

```bash
npm install @lightgallery/headless
```

## What it exports

| Area | Exports | Notes |
| --- | --- | --- |
| State | `createGalleryState`, `galleryReducer`, `clampIndex` | Pure reducer over `OPEN`, `CLOSE`, `NEXT`, `PREV`, `GO_TO` … actions |
| Settings | `resolveSettings`, `coreSettingsDefaults` | Merges user settings, mobile settings and per-key `strings` over the defaults |
| Items | `getSlideType` | Image, video, iframe or inline, from an item's fields |
| Slide windowing | `getSlideIndexesInDom`, `getPreloadIndexes`, `getSlidePoolIndexes` | Which slides to mount and preload, including virtualization |
| Gestures | `getSwipeAxis`, `getSwipeReleaseVerdict`, `getHorizontalDragTransforms`, `getVerticalDragEffects`, `shouldCloseOnVerticalDrag`, `getEdgeFrictionedDelta`, `upsertPointer`, `removePointer` | Axis lock, flick detection, boundary friction, drag-to-close |
| Physics | `stepSpring`, `isSpringSettled`, `project`, `getWindowedVelocity`, `pushVelocitySample` | Closed-form damped spring, momentum projection, windowed release velocity |
| Zoom | `getPinchScale`, `getPinchPan`, `getPointZoomPan`, `clampScale`, `clampPan`, `getPanBounds`, `shouldCloseOnPinch`, `getActualSizeScale` | Focal-point pinch, pan bounds with friction, pinch-to-close |
| Thumbnails | `getThumbWindow`, `getThumbCorridorWindow`, `getActiveThumbTranslate`, `clampThumbTranslate`, `getElasticThumbTranslate`, `getScrubThumbIndex`, `getScrubThumbTranslate` | Strip windowing, centering, elastic edges, scrubbing |
| Layout | `getJustifiedLayout` | Row-justified box layout for trigger grids |
| Responsive | `parseSrcset`, `resolveImageSource`, `resolveSizes`, `matchesMedia`, `awaitDecode` | `srcset`/`sizes` selection and decode gating |
| Origin animation | `getOriginTransform`, `fitImageSize`, `parseImageSize` | Open-from-trigger transforms |
| Video | `getVideoInfo`, `getYouTubeEmbedUrl`, `getVimeoEmbedUrl`, `getWistiaEmbedUrl`, `getYouTubePosterUrl`, `getFacadePoster` | Provider detection, embed URLs, facade posters |
| Share | `getSharePayload`, `canNativeShare`, `getXShareLink`, `getFacebookShareLink`, `getPinterestShareLink` | Web Share payload and social fallbacks |
| URL drivers | `createHashDriver`, `createHistoryHashDriver`, `createNavigationHashDriver` | One interface over hash, history and the Navigation API |
| Plugin slices | `initialZoomSlice`, `applyZoom`, `initialRotateSlice`, `rotateLeft`, `rotateRight`, `flipHorizontal`, `flipVertical`, `initialAutoplaySlice` | Per-plugin state reducers |
| Accessibility | `formatSlideAnnouncement` | Live-region text from a template string |
| Icons | `coreDefaultIcons`, `zoomDefaultIcons`, … , `LgIconName` | The built-in inline SVG icon sets, grouped by feature |
| Events | `createEmitter` | A typed emitter for renderers |

Each module is independent; import only what your renderer needs.

## Example

```ts
import {
    createGalleryState,
    galleryReducer,
    getSlideIndexesInDom,
    getSwipeReleaseVerdict,
    resolveSettings,
} from '@lightgallery/headless';

const settings = resolveSettings({ loop: true, speed: 400 });

let state = createGalleryState({ slidesCount: 5, loop: settings.loop });
state = galleryReducer(state, { type: 'OPEN', index: 2 });
state = galleryReducer(state, { type: 'NEXT' });

// Which slides should be mounted right now (current ± preload window).
const mounted = getSlideIndexesInDom(state.index, 5, settings);
```

Every transition is pure and covered by node-environment tests. Renderers
wrap the reducer in their own reactivity and own all DOM concerns.

## Documentation

- Guide: https://www.lightgalleryjs.com/docs/headless/
- Markdown index for tools and agents: https://www.lightgalleryjs.com/llms.txt

## License

GPL-3.0-only, matching lightGallery's licensing model — commercial
licenses via [lightgalleryjs.com](https://www.lightgalleryjs.com/docs/license/).
