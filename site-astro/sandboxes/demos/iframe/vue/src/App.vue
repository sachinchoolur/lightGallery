<script setup lang="ts">
import { ref } from 'vue';
import { LightGallery, type LgGalleryItem } from '@lightgallery/vue';

import 'lightgallery/css/lightgallery.css';

// `iframe: true` shows the page at `src` in an iframe.
const slides: LgGalleryItem[] = [
    {
        src: 'https://example.com/',
        iframe: true,
        iframeTitle: 'Website',
    },
    {
        src: 'https://www.openstreetmap.org/export/embed.html?bbox=-5.2884,35.1588,-5.2484,35.1788',
        iframe: true,
        iframeTitle: 'Map',
    },
    {
        src: 'https://www.lightgalleryjs.com/pdf/sample.pdf',
        iframe: true,
        iframeTitle: 'PDF file',
    },
];

const open = ref(false);
const index = ref(0);

function openSlide(slide: number) {
    index.value = slide;
    open.value = true;
}
</script>

<template>
    <h1>lightGallery iframe</h1>
    <div class="gallery">
        <button type="button" @click="openSlide(0)">Open website</button>
        <button type="button" @click="openSlide(1)">Open map</button>
        <button type="button" @click="openSlide(2)">Open PDF file</button>
    </div>
    <LightGallery v-model:open="open" v-model:index="index" :slides="slides" />
</template>
