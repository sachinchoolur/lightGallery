# Recipe: `next/image` slides (React)

Render lightbox slides through Next.js's image optimizer with a custom
`slideRenderer` plugin. The gallery keeps everything else — zoom, gestures,
thumbnails, the zoom-from-origin flight — because the recipe honors three small
contracts listed after the code.

## The recipe (App Router)

```tsx
'use client';

import Image from 'next/image';
import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
    type LgPlugin,
} from '@lightgallery/react';
import Zoom from '@lightgallery/react/plugins/zoom';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

/** Slides that should render through next/image opt in via a flag. */
type OptimizedItem = GalleryItem & { nextImage?: boolean };

const nextImagePlugin: LgPlugin = {
    name: 'nextImage',
    slideRenderer: (item, index, ctx) => {
        const optimized = item as OptimizedItem;
        if (!optimized.nextImage || !item.src) {
            return undefined; // pass through to the built-in renderer
        }
        return (
            <picture className="lg-img-wrap">
                <Image
                    className="lg-object lg-image"
                    data-index={index}
                    src={item.src}
                    alt={item.alt ?? ''}
                    // Explicit dims (lgSize knows them), NOT `fill`: fill
                    // stretches the img ELEMENT box over the whole slide
                    // (letterbox included), which extends the grab cursor
                    // and tap/zoom targets beyond the visible image. With
                    // dims, the stylesheet contain-fits the element like
                    // the built-in renderer.
                    width={1600}
                    height={1067}
                    sizes="100vw"
                    // The lightbox slide IS the focal content — never lazy.
                    loading="eager"
                    // Blur placeholders work as-is; the spinner hands
                    // off when you mark the slide loaded below.
                    placeholder={item.thumb ? 'blur' : 'empty'}
                    blurDataURL={item.thumb}
                    // Completion via a ref, not onLoad: next/image's own
                    // load plumbing does not reliably forward the event,
                    // and a ref also covers the cached-image case where
                    // the img is already complete at mount.
                    ref={(img) => {
                        if (!img) return;
                        const markLoaded = () =>
                            ctx.actions.dispatch({
                                type: 'SLIDE_LOADED',
                                index,
                            });
                        if (img.complete && img.naturalWidth > 0) {
                            markLoaded();
                            return;
                        }
                        img.addEventListener('load', markLoaded, {
                            once: true,
                        });
                    }}
                />
            </picture>
        );
    },
};

const items: OptimizedItem[] = [
    {
        src: '/photos/river.jpg',
        thumb: '/photos/river-thumb.jpg',
        alt: 'River between mountains',
        lgSize: '1600-1067', // full-resolution dims — see contract 3
        nextImage: true,
    },
];

export function Gallery() {
    return (
        <LightGallery plugins={[nextImagePlugin, Zoom, Thumbnail]}>
            {items.map((item) => (
                <LightGalleryItem key={item.src} item={item} href={item.src}>
                    <Image
                        src={item.thumb!}
                        alt={item.alt!}
                        width={240}
                        height={160}
                    />
                </LightGalleryItem>
            ))}
        </LightGallery>
    );
}
```

## The three contracts

1. **Keep the classes.** The wrapper is `picture.lg-img-wrap` and the image
   carries `lg-object lg-image` + `data-index`. The stylesheet, the zoom plugin
   (double-tap targets `.lg-image`) and the gesture layer all key off these —
   with them, your custom slide inherits zoom, pan and pinch untouched.
2. **Mark the slide loaded.** A custom renderer owns its completion: dispatch
   `{ type: 'SLIDE_LOADED', index }` through `ctx.actions.dispatch` once the
   image has pixels. With `next/image`, do it from a **ref callback** (native
   `load` listener + an `img.complete` check, as in the example) rather than the
   `onLoad` prop — the component's internal load plumbing does not reliably
   forward the event, and the ref also covers cached images already complete at
   mount. This drops the spinner (`lg-complete`), starts neighbor preloading,
   and drives the first-slide choreography.
3. **Declare the real resolution.** The optimizer manages `srcset` itself, which
   makes `img.naturalWidth` report a density-corrected size (≈ the on-screen
   size) — without help, actual-size zoom would collapse to ~1× on phones.
   Declare the true size on the item and zoom uses it: `lgSize: '1600-1067'`
   (you already set this for the zoom-from-origin flight) or `width: '1600'`.

## Caveats

-   **First-slide thumb-dummy**: the built-in renderer flies the trigger's
    thumbnail as a placeholder during the zoom-from-origin flight; custom
    renderers don't take part — bring your own placeholder (blur placeholders
    above) if the flight window matters to you.
-   **Zoom interplay** is supported under the contracts above (this is the
    incompatibility other lightboxes document — lightGallery resolves it via the
    declared-size tiers). Skipping contract 3 degrades only actual-size zoom
    depth; nothing else breaks.
-   **Decode gating**: the built-in renderer waits for `img.decode()` before
    completing a slide. For byte-identical behavior, await `img.decode?.()`
    before dispatching in `markLoaded`; in practice the optimizer's progressive
    formats make partial paints rare.
-   **Avoid `fill` mode** for slide images: it stretches the img element box
    over the whole slide (letterbox included), extending the grab cursor and
    tap/zoom/close-on-tap targets beyond the visible image. Explicit
    `width`/`height` keep the element box equal to the painted image, like the
    built-in renderer.
