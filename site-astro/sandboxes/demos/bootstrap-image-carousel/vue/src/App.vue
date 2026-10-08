<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Carousel from 'bootstrap/js/dist/carousel';
import { LightGallery, LgItem, type LgGalleryItem } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import './carousel.css';

const plugins = [Thumbnail];

// `thumb` is the image on the slide. `lgSize` is the full-size image's
// WIDTH-HEIGHT; it lets the image open from its slide.
const slides: LgGalleryItem[] = [
    {
        src: 'https://picsum.photos/id/10/1600/1067',
        thumb: 'https://picsum.photos/id/10/960/640',
        alt: 'Sample photo 1',
        lgSize: '1600-1067',
    },
    {
        src: 'https://picsum.photos/id/11/1600/1067',
        thumb: 'https://picsum.photos/id/11/960/640',
        alt: 'Sample photo 2',
        lgSize: '1600-1067',
    },
    {
        src: 'https://picsum.photos/id/15/1600/1067',
        thumb: 'https://picsum.photos/id/15/960/640',
        alt: 'Sample photo 3',
        lgSize: '1600-1067',
    },
];

const carouselEl = ref<HTMLElement | null>(null);
let carousel: Carousel | undefined;

// The Bootstrap carousel
onMounted(() => {
    carousel = new Carousel(carouselEl.value!, {
        interval: 2000,
        wrap: false,
    });
});
onBeforeUnmount(() => carousel?.dispose());
</script>

<template>
    <h1>lightGallery with a Bootstrap carousel</h1>
    <!-- One gallery over the carousel: every slide holds an item that
         opens its full-size image. -->
    <LightGallery :plugins="plugins">
        <div
            id="bootstrap-gallery-carousel"
            ref="carouselEl"
            class="carousel slide"
        >
            <div class="carousel-inner">
                <div
                    v-for="(photo, index) of slides"
                    :key="photo.src"
                    class="carousel-item"
                    :class="{ active: index === 0 }"
                >
                    <LgItem :item="photo">
                        <img
                            :src="photo.thumb"
                            class="d-block w-100"
                            :alt="photo.alt"
                        />
                    </LgItem>
                </div>
            </div>
            <button
                class="carousel-control-prev"
                type="button"
                data-bs-target="#bootstrap-gallery-carousel"
                data-bs-slide="prev"
            >
                <span class="carousel-control-prev-icon" aria-hidden="true" />
                <span class="visually-hidden">Previous</span>
            </button>
            <button
                class="carousel-control-next"
                type="button"
                data-bs-target="#bootstrap-gallery-carousel"
                data-bs-slide="next"
            >
                <span class="carousel-control-next-icon" aria-hidden="true" />
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </LightGallery>
</template>
