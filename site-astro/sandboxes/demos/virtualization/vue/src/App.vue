<script setup lang="ts">
import { ref } from 'vue';
import { LightGallery } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';

const slides = Array.from({ length: 1000 }, (_, i) => ({
    src: `https://picsum.photos/seed/lg-${i}/1600/1067`,
    thumb: `https://picsum.photos/seed/lg-${i}/240/160`,
    caption: `Slide ${i + 1} / 1000`,
}));

const plugins = [Thumbnail];
const open = ref(false);
const index = ref(0);
</script>

<template>
    <h1>lightGallery virtualization</h1>
    <button type="button" @click="open = true">
        Open the 1,000-slide gallery
    </button>
    <!-- slides: how many slides are in the DOM at once, around the current
         one. thumbs: only the visible thumbnails are in the DOM, plus one
         more viewport of them on each side. -->
    <LightGallery
        v-model:open="open"
        v-model:index="index"
        :slides="slides"
        :plugins="plugins"
        :virtualization="{ slides: 7, thumbs: 'auto' }"
    />
</template>
