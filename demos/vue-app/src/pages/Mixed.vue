<script setup lang="ts">
import { computed, reactive } from 'vue';
import { LightGallery, type LgVuePlugin } from '@lightgallery/vue';
import Autoplay from '@lightgallery/vue/plugins/autoplay';
import Fullscreen from '@lightgallery/vue/plugins/fullscreen';
import Rotate from '@lightgallery/vue/plugins/rotate';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Video from '@lightgallery/vue/plugins/video';
import Zoom from '@lightgallery/vue/plugins/zoom';

import { MIXED_ITEMS, MODES, type Mode } from '../../../shared/media';
import Choice from '../ui/Choice.vue';
import Tile from '../ui/Tile.vue';
import Toggle from '../ui/Toggle.vue';

const s = reactive({
    thumbnail: true,
    zoom: true,
    rotate: false,
    video: true,
    fullscreen: true,
    autoplay: false,
    mode: 'lg-slide' as Mode,
});

// Zoom before Rotate keeps zoom as the outermost slide wrapper.
const plugins = computed(
    () =>
        [
            s.thumbnail && Thumbnail,
            s.zoom && Zoom,
            s.rotate && Rotate,
            s.video && Video,
            s.fullscreen && Fullscreen,
            s.autoplay && Autoplay,
        ].filter(Boolean) as LgVuePlugin[],
);
const key = computed(() => JSON.stringify(s));
</script>

<template>
    <section>
        <h2>Mixed media</h2>
        <p class="note">
            Videos interleaved with images of every size and shape, so the slide
            type changes on almost every step. Zoom an image, then swipe to a
            video and back; play a video, then swipe away. Turn the Video plugin
            off to see how video slides degrade.
        </p>
        <details class="panel" open>
            <summary>Settings</summary>
            <div class="controls">
                <div class="control-group">
                    <strong>Plugins</strong>
                    <Toggle v-model="s.thumbnail" label="Thumbnail" />
                    <Toggle v-model="s.zoom" label="Zoom" />
                    <Toggle v-model="s.rotate" label="Rotate" />
                    <Toggle v-model="s.video" label="Video" />
                    <Toggle v-model="s.fullscreen" label="Fullscreen" />
                    <Toggle v-model="s.autoplay" label="Autoplay" />
                </div>
                <div class="control-group">
                    <strong>Transition</strong>
                    <Choice v-model="s.mode" label="Mode" :options="MODES" />
                </div>
            </div>
        </details>
        <p class="readout">{{ MIXED_ITEMS.length }} slides</p>
        <LightGallery
            :key="key"
            :plugins="plugins"
            :mode="s.mode"
            :zoom="{ showZoomInOutIcons: true, actualSize: true }"
        >
            <div class="grid">
                <Tile v-for="item of MIXED_ITEMS" :key="item.alt" :item="item" />
            </div>
        </LightGallery>
    </section>
</template>
