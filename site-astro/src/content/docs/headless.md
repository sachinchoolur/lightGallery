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

Framework-free core logic for lightGallery 3.x: the gallery state
machine, settings resolution, slide windowing/preload math, gesture
verdicts, zoom/thumbnail/rotate math and video URL builders — everything
a renderer needs, with **no DOM and no framework** (the tsconfig excludes
the DOM lib, so `window`/`document` do not even typecheck here).

Shared by [`@lightgallery/react`](/docs/react/),
[`@lightgallery/vue`](/docs/vue/) and
[`@lightgallery/angular`](/docs/angular/) — build your own binding on the
same package.

```ts
import {
    createGalleryState,
    galleryReducer,
    resolveSettings,
    getSlideIndexesInDom,
    getSwipeReleaseVerdict,
} from '@lightgallery/headless';

let state = createGalleryState({ slidesCount: 5, loop: true });
state = galleryReducer(state, { type: 'OPEN', index: 2 });
state = galleryReducer(state, { type: 'NEXT' });
```

Every transition is pure and covered by node-environment tests; renderers
wrap the reducer in their own reactivity (`useReducer` in React) and own
all DOM concerns.

## License

GPL-3.0-only, matching lightGallery's licensing model — commercial
licenses via [lightgalleryjs.com](https://www.lightgalleryjs.com/docs/license/).
