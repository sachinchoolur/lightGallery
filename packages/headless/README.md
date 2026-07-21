# @lightgallery/headless

> **Alpha.** Framework-free core logic for lightGallery 3.x: the gallery
> state machine, settings resolution, slide windowing/preload math, gesture
> verdicts, zoom/thumbnail/rotate math and video URL builders — everything
> a renderer needs, with **no DOM and no framework** (the tsconfig excludes
> the DOM lib, so `window`/`document` do not even typecheck here).

Consumed today by [`@lightgallery/react`](../react); the Angular port and a
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
