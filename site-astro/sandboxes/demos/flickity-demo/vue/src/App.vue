<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
import Flickity from 'flickity';
import { LightGallery, LgItem } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';

import 'flickity/css/flickity.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';

const slides = [10, 11, 15, 16, 28, 29].map((id, index) => ({
    src: `https://picsum.photos/id/${id}/1600/1067`,
    thumb: `https://picsum.photos/id/${id}/720/480`,
    alt: `Sample photo ${index + 1}`,
    // WIDTH-HEIGHT of the full-size image; lets it open from its cell.
    lgSize: '1600-1067',
}));

const plugins = [Zoom, Thumbnail];

const carousel = useTemplateRef('carousel');
let flickity: Flickity | undefined;
// True from the start of a drag until the click that ends it.
let dragged = false;

// Create the carousel once its cells are in the page.
onMounted(() => {
    flickity = new Flickity(carousel.value!, {
        cellAlign: 'center',
        pageDots: false,
        contain: true,
        autoPlay: true,
        on: {
            pointerDown() {
                dragged = false;
            },
            dragStart() {
                dragged = true;
            },
        },
    });
});

onBeforeUnmount(() => flickity?.destroy());

// Letting go of a drag also clicks the cell under the pointer. Stop that
// click before it reaches the cell, so only a plain click opens the gallery.
function stopDragClick(event: MouseEvent) {
    if (dragged) {
        dragged = false;
        event.preventDefault();
        event.stopPropagation();
    }
}
</script>

<template>
    <h1>lightGallery with a Flickity carousel</h1>
    <LightGallery :plugins="plugins">
        <div
            ref="carousel"
            class="main-carousel"
            @click.capture="stopDragClick"
        >
            <LgItem
                v-for="slide of slides"
                :key="slide.src"
                class="carousel-cell"
                :item="slide"
            >
                <img :src="slide.thumb" :alt="slide.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>

<style>
/* Flickity reads the size of each cell when it starts, so the images get
   their size here instead of from the loaded file. */
.carousel-cell {
    margin-right: 10px;
}

.carousel-cell img {
    display: block;
    width: 360px;
    max-width: 80vw;
    aspect-ratio: 3 / 2;
    object-fit: cover;
}
</style>
