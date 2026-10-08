<script setup lang="ts">
import { computed, reactive } from 'vue';
import { LightGallery } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';

import { THUMB_COUNTS, manyItems } from '../../../shared/media';
import Choice from '../ui/Choice.vue';
import Tile from '../ui/Tile.vue';
import Toggle from '../ui/Toggle.vue';

const POSITIONS = ['left', 'middle', 'right'] as const;
const WIDTHS = [60, 100, 150];
const HEIGHTS = ['60px', '80px', '120px'];
const MARGINS = [0, 5, 15];

const s = reactive({
    count: 100,
    zoom: true,
    virtualization: false,
    animateThumb: true,
    toggleThumb: false,
    enableThumbDrag: true,
    scrubThumbnails: false,
    thumbWidth: 100,
    thumbHeight: '80px',
    thumbMargin: 5,
    alignThumbnails: 'middle' as (typeof POSITIONS)[number],
    currentPagerPosition: 'middle' as (typeof POSITIONS)[number],
});

const items = computed(() => manyItems(s.count));
const plugins = computed(() => (s.zoom ? [Thumbnail, Zoom] : [Thumbnail]));
const key = computed(() => JSON.stringify(s));
</script>

<template>
    <section>
        <h2>Thumbnails</h2>
        <p class="note">
            Up to 500 slides with mixed aspect ratios. Drag and fling the strip,
            scrub it, jump far through it, and check the active thumbnail stays
            in view. Compare with virtualization on.
        </p>
        <details class="panel" open>
            <summary>Settings</summary>
            <div class="controls">
                <div class="control-group">
                    <strong>Slides</strong>
                    <Choice
                        v-model="s.count"
                        label="Count"
                        :options="THUMB_COUNTS"
                    />
                    <Toggle v-model="s.virtualization" label="virtualization" />
                    <Toggle v-model="s.zoom" label="Zoom plugin" />
                </div>
                <div class="control-group">
                    <strong>Strip behaviour</strong>
                    <Toggle v-model="s.animateThumb" label="animateThumb" />
                    <Toggle v-model="s.toggleThumb" label="toggleThumb" />
                    <Toggle v-model="s.enableThumbDrag" label="enableThumbDrag" />
                    <Toggle v-model="s.scrubThumbnails" label="scrubThumbnails" />
                </div>
                <div class="control-group">
                    <strong>Strip layout</strong>
                    <Choice
                        v-model="s.thumbWidth"
                        label="thumbWidth"
                        :options="WIDTHS"
                    />
                    <Choice
                        v-model="s.thumbHeight"
                        label="thumbHeight"
                        :options="HEIGHTS"
                    />
                    <Choice
                        v-model="s.thumbMargin"
                        label="thumbMargin"
                        :options="MARGINS"
                    />
                    <Choice
                        v-model="s.alignThumbnails"
                        label="alignThumbnails"
                        :options="POSITIONS"
                    />
                    <Choice
                        v-model="s.currentPagerPosition"
                        label="currentPagerPosition"
                        :options="POSITIONS"
                    />
                </div>
            </div>
        </details>
        <p class="readout">
            {{ items.length }} slides · thumbnails {{ s.thumbWidth }}px ×
            {{ s.thumbHeight }}
        </p>
        <LightGallery
            :key="key"
            :plugins="plugins"
            :virtualization="
                s.virtualization ? { slides: 5, thumbs: 'auto' } : undefined
            "
            :thumbnail="{
                animateThumb: s.animateThumb,
                toggleThumb: s.toggleThumb,
                enableThumbDrag: s.enableThumbDrag,
                scrubThumbnails: s.scrubThumbnails,
                thumbWidth: s.thumbWidth,
                thumbHeight: s.thumbHeight,
                thumbMargin: s.thumbMargin,
                alignThumbnails: s.alignThumbnails,
                currentPagerPosition: s.currentPagerPosition,
            }"
        >
            <div class="grid grid-dense">
                <Tile
                    v-for="item of items"
                    :key="item.alt"
                    :item="item"
                    :caption="false"
                />
            </div>
        </LightGallery>
    </section>
</template>
