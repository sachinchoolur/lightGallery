<script setup lang="ts">
import { computed, reactive } from 'vue';
import { LightGallery, type LgVuePlugin } from '@lightgallery/vue';
import Rotate from '@lightgallery/vue/plugins/rotate';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';

import { SHAPES, SIZE_CLASSES, SIZE_ITEMS } from '../../../shared/media';
import Choice from '../ui/Choice.vue';
import Tile from '../ui/Tile.vue';
import Toggle from '../ui/Toggle.vue';
import { flip } from '../ui/flip';

const SCALES = [0.5, 1, 2];

const s = reactive({
    sizes: [...SIZE_CLASSES] as string[],
    shapes: [...SHAPES] as string[],
    thumbnail: true,
    zoom: true,
    rotate: false,
    actualSize: true,
    infiniteZoom: true,
    showZoomInOutIcons: true,
    zoomFromOrigin: true,
    scale: 1,
});

const items = computed(() =>
    SIZE_ITEMS.filter(
        (item) =>
            s.sizes.some((tag) => item.tags.includes(tag)) &&
            s.shapes.some((tag) => item.tags.includes(tag)),
    ),
);
const plugins = computed(
    () =>
        [s.thumbnail && Thumbnail, s.zoom && Zoom, s.rotate && Rotate].filter(
            Boolean,
        ) as LgVuePlugin[],
);
const key = computed(() => JSON.stringify(s));
</script>

<template>
    <section>
        <h2>Image sizes</h2>
        <p class="note">
            Every size class, from 60&nbsp;px up to 5000&nbsp;px, in every shape.
            Tiny and small images are below the stage, so actual-size zoom should
            leave them at their natural size; huge ones test fitting, pan bounds
            and decode time.
        </p>
        <details class="panel" open>
            <summary>Settings</summary>
            <div class="controls">
                <div class="control-group">
                    <strong>Size</strong>
                    <Toggle
                        v-for="entry of SIZE_CLASSES"
                        :key="entry"
                        :label="entry"
                        :model-value="s.sizes.includes(entry)"
                        @update:model-value="s.sizes = flip(s.sizes, entry)"
                    />
                </div>
                <div class="control-group">
                    <strong>Shape</strong>
                    <Toggle
                        v-for="entry of SHAPES"
                        :key="entry"
                        :label="entry"
                        :model-value="s.shapes.includes(entry)"
                        @update:model-value="s.shapes = flip(s.shapes, entry)"
                    />
                </div>
                <div class="control-group">
                    <strong>Plugins</strong>
                    <Toggle v-model="s.thumbnail" label="Thumbnail" />
                    <Toggle v-model="s.zoom" label="Zoom" />
                    <Toggle v-model="s.rotate" label="Rotate" />
                </div>
                <div class="control-group">
                    <strong>Zoom</strong>
                    <Toggle v-model="s.actualSize" label="actualSize" />
                    <Toggle v-model="s.infiniteZoom" label="infiniteZoom" />
                    <Toggle
                        v-model="s.showZoomInOutIcons"
                        label="showZoomInOutIcons"
                    />
                    <Toggle v-model="s.zoomFromOrigin" label="zoomFromOrigin" />
                    <Choice v-model="s.scale" label="scale" :options="SCALES" />
                </div>
            </div>
        </details>
        <p class="readout">{{ items.length }} images</p>
        <LightGallery
            :key="key"
            :plugins="plugins"
            :zoom-from-origin="s.zoomFromOrigin"
            :zoom="{
                actualSize: s.actualSize,
                infiniteZoom: s.infiniteZoom,
                showZoomInOutIcons: s.showZoomInOutIcons,
                scale: s.scale,
            }"
        >
            <div class="grid">
                <Tile v-for="item of items" :key="item.alt" :item="item" />
            </div>
        </LightGallery>
    </section>
</template>
