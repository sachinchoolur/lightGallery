---
title: "@lightgallery/headless"
description: "Framework-free lightGallery core: state machine, gesture math and plugin logic shared by every v3 binding."
lead: "Framework-free lightGallery core: state machine, gesture math and plugin logic shared by every v3 binding."
date: 2026-07-24T00:00:00.000Z
draft: false
images: []
menu: {docs: {parent: 'V3 (alpha)', name: Headless}}
weight: 61
toc: true
---

> **Alpha release** — the v3 packages are published under the `alpha` dist-tag. APIs may change between alpha releases; feedback is very welcome on [GitHub](https://github.com/sachinchoolur/lightGallery/issues).

> **Alpha.** Framework-free core logic for lightGallery 3.x: the gallery
> state machine, settings resolution, slide windowing/preload math, gesture
> verdicts, zoom/thumbnail/rotate math and video URL builders — everything
> a renderer needs, with **no DOM and no framework** (the tsconfig excludes
> the DOM lib, so `window`/`document` do not even typecheck here).

Consumed today by [`@lightgallery/react`](/docs/v3/react/); the Angular port and a
future vanilla 3.0 renderer build on the same package.

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
