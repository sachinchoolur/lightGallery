# Recipe: `<NuxtImg>` slides (Vue / Nuxt)

Render lightbox slides through Nuxt Image with a custom `slideRenderer` plugin.
The gallery keeps zoom, gestures, thumbnails and the zoom-from-origin flight
because the recipe honors the three contracts listed after the code.

## The recipe

```vue
<script setup lang="ts">
import { defineComponent, h, inject } from 'vue';
import {
    LG_PLUGIN_CONTEXT,
    LightGallery,
    LgItem,
    type LgGalleryItem,
    type LgVuePlugin,
} from '@lightgallery/vue';
import Zoom from '@lightgallery/vue/plugins/zoom';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
// Resolved by @nuxt/image:
import { NuxtImg } from '#components';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

type OptimizedItem = LgGalleryItem & { nuxtImg?: boolean };

const NuxtImageSlide = defineComponent({
    props: {
        item: { type: Object, required: true },
        index: { type: Number, required: true },
    },
    setup(props) {
        const ctx = inject(LG_PLUGIN_CONTEXT)!;
        return () =>
            h('picture', { class: 'lg-img-wrap' }, [
                h(NuxtImg, {
                    class: 'lg-object lg-image',
                    'data-index': props.index,
                    src: props.item.src,
                    alt: props.item.alt ?? '',
                    // REQUIRED: explicit dims (lgSize knows them) with
                    // NO `sizes` prop — @nuxt/image then emits clean
                    // density variants (s_1600x1067 1x / 2x). A `sizes`
                    // value here collapses the ladder to a 1px base and
                    // a 2px image gets stretched fullscreen.
                    width: 1600,
                    height: 1067,
                    // The lightbox slide IS the focal content — never lazy.
                    loading: 'eager',
                    // Blur placeholder handled by @nuxt/image.
                    placeholder: true,
                    onLoad: () =>
                        ctx.actions.dispatch({
                            type: 'SLIDE_LOADED',
                            index: props.index,
                        }),
                }),
            ]);
    },
});

const nuxtImagePlugin: LgVuePlugin = {
    name: 'nuxtImg',
    slideRenderer: {
        component: NuxtImageSlide,
        canRender: (item) => !!(item as OptimizedItem).nuxtImg,
    },
};

const items: OptimizedItem[] = [
    {
        src: '/photos/river.jpg',
        thumb: '/photos/river-thumb.jpg',
        alt: 'River between mountains',
        lgSize: '1600-1067', // full-resolution dims — see contract 3
        nuxtImg: true,
    },
];
</script>

<template>
    <LightGallery :plugins="[nuxtImagePlugin, Zoom, Thumbnail]">
        <LgItem v-for="item of items" :key="item.src" :item="item">
            <NuxtImg
                :src="item.thumb!"
                :alt="item.alt"
                width="240"
                height="160"
            />
        </LgItem>
    </LightGallery>
</template>
```

## The three contracts

1. **Keep the classes.** `picture.lg-img-wrap` around an image carrying
   `lg-object lg-image` + `data-index`. The stylesheet, the zoom plugin
   (double-tap targets `.lg-image`) and the gesture layer key off these — with
   them, the custom slide inherits zoom, pan and pinch untouched.
2. **Mark the slide loaded.** Inject `LG_PLUGIN_CONTEXT` and dispatch
   `{ type: 'SLIDE_LOADED', index }` from the image's `load` event. This drops
   the spinner (`lg-complete`), starts neighbor preloading, and drives the
   first-slide choreography.
3. **Declare the real resolution.** The optimizer manages `srcset` itself, which
   makes `img.naturalWidth` report a density-corrected size — without help,
   actual-size zoom collapses to ~1× on phones. Declare the true size on the
   item: `lgSize: '1600-1067'` (already set for the zoom-from-origin flight) or
   `width: '1600'`.

## Caveats

-   **Always pass `width`/`height`, and skip `sizes`, on the slide
    `<NuxtImg>`**: without explicit dims — or with a `sizes` value — @nuxt/image
    builds its srcset from a 1px base (`w_1 1w, w_2 2w`) and the browser
    stretches a 2-pixel image fullscreen. Explicit dims alone yield clean
    density variants (`1x`/`2x`); the item's `lgSize` dims are exactly the
    numbers to use.
-   **First-slide thumb-dummy**: the built-in renderer flies the trigger's
    thumbnail as a placeholder during the zoom-from-origin flight; custom
    renderers don't take part — bring your own placeholder (blur placeholders
    above) if the flight window matters to you.
-   Skipping contract 3 degrades only actual-size zoom depth; nothing else
    breaks.
-   The built-in renderer decode-gates completion (`img.decode()` before
    `lg-complete`); browsers fire `load` on `<NuxtImg>`'s underlying img the
    standard way, so dispatching from `load` matches the stock feel. For
    byte-identical behavior you can await `event.target.decode?.()` before
    dispatching.
-   SSR: the gallery overlay is client-only (it teleports after mount), so
    `<NuxtImg>` inside slides never renders on the server — no hydration caveats
    beyond Nuxt Image's own.
