<script setup lang="ts">
/**
 * Runnable verification of recipes/nuxt-img.md — the recipe code,
 * verbatim in shape: a `slideRenderer` plugin rendering opted-in
 * slides through `<NuxtImg>` while keeping the three contracts
 * (classes, SLIDE_LOADED dispatch, declared resolution via lgSize).
 * The last item deliberately has no `nuxtImg` flag to show the
 * pass-through to the built-in renderer.
 */
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
import { NuxtImg } from '#components';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-transitions.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

type OptimizedItem = LgGalleryItem & { nuxtImg?: boolean };

const picsum = (id: number, w: number, h: number): string =>
    `https://picsum.photos/id/${id}/${w}/${h}`;

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
                    // REQUIRED: without explicit dims @nuxt/image falls
                    // back to a 1px base and serves w_1/w_2 variants — a
                    // 2px image stretched fullscreen. lgSize knows them.
                    width: 1600,
                    height: 1067,
                    // The lightbox slide IS the focal content — never lazy.
                    loading: 'eager',
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
    { id: 1015, title: 'River between mountains' },
    { id: 1016, title: 'Canyon walls' },
    { id: 1018, title: 'Snowy peak' },
].map(({ id, title }) => ({
    src: picsum(id, 1600, 1067),
    thumb: picsum(id, 240, 160),
    alt: title,
    lgSize: '1600-1067',
    nuxtImg: true,
}));

// Pass-through control: no nuxtImg flag → built-in renderer.
items.push({
    src: picsum(1019, 1600, 1067),
    thumb: picsum(1019, 240, 160),
    alt: 'Lakeside cliffs (built-in renderer)',
    lgSize: '1600-1067',
});

const plugins = [nuxtImagePlugin, Zoom, Thumbnail];
</script>

<template>
    <main style="font-family: system-ui, sans-serif; margin: 24px">
        <h1>NuxtImg recipe — @lightgallery/vue</h1>
        <p>
            First three slides render through
            <code>&lt;NuxtImg&gt;</code> (check the
            <code>/_ipx/…</code> requests); the fourth uses the built-in
            renderer.
        </p>
        <LightGallery :plugins="plugins">
            <div style="display: flex; flex-wrap: wrap; gap: 8px">
                <LgItem v-for="item of items" :key="item.src" :item="item">
                    <NuxtImg
                        :src="item.thumb!"
                        :alt="item.alt"
                        width="240"
                        height="160"
                    />
                </LgItem>
            </div>
        </LightGallery>
    </main>
</template>
