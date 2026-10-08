<script setup lang="ts">
import { ref } from 'vue';
import {
    LightGallery,
    LgItem,
    type LgGalleryItem,
    type SlideEventDetail,
} from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';
import Video from '@lightgallery/vue/plugins/video';

const plugins = [Thumbnail, Zoom, Video];
const open = ref(false);
const index = ref(0);
const items: LgGalleryItem[] = [
    { src: '1.jpg', thumb: '1-t.jpg', alt: 'First', caption: 'One' },
    { src: '2.jpg', thumb: '2-t.jpg', alt: 'Second' },
];

function onAfterSlide(detail: SlideEventDetail): void {
    console.log('slide', detail.index);
}
</script>

<template>
    <LightGallery
        v-model:open="open"
        v-model:index="index"
        :plugins="plugins"
        :thumbnail="{ thumbWidth: 120 }"
        :speed="300"
        @after-slide="onAfterSlide"
    >
        <LgItem
            v-for="item of items"
            :key="item.src"
            :item="item"
            class="trigger"
        >
            <img :src="item.thumb" :alt="item.alt" />
        </LgItem>
        <template #caption="{ item }">
            <strong>{{ item?.caption }}</strong>
        </template>
    </LightGallery>
</template>
