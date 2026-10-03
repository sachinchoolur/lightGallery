<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import Carousel from 'bootstrap/js/dist/carousel';
import { LightGallery, LgItem, type LgGalleryItem } from '@lightgallery/vue';
import Video from '@lightgallery/vue/plugins/video';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-video.css';
import './carousel.css';

const plugins = [Video];

const videos: LgGalleryItem[] = [
    // YouTube and Vimeo: `src` is the address of the video page. `poster`
    // is the image shown before the video plays.
    {
        src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
        poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
        alt: 'YouTube video',
        lgSize: '1280-720',
    },
    {
        src: 'https://vimeo.com/112836958',
        poster: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
        alt: 'Vimeo video',
        lgSize: '1280-720',
    },
    // A video file you host yourself: no `src`. The files and the <video>
    // attributes go in `video`.
    {
        video: {
            source: [
                {
                    src: 'https://www.lightgalleryjs.com/videos/video1.mp4',
                    type: 'video/mp4',
                },
            ],
            attributes: { preload: 'metadata', controls: true },
        },
        poster: 'https://www.lightgalleryjs.com/images/demo/html5-video-poster.jpg',
        alt: 'HTML5 video',
        lgSize: '1280-720',
    },
];

const carouselEl = ref<HTMLElement | null>(null);
let carousel: Carousel | undefined;

// The Bootstrap carousel
onMounted(() => {
    carousel = new Carousel(carouselEl.value!, {
        interval: 2000,
        wrap: false,
        // Start cycling right away.
        ride: 'carousel',
    });
});
onBeforeUnmount(() => {
    // dispose() leaves the cycle timer running, so stop it first.
    carousel?.pause();
    carousel?.dispose();
});
</script>

<template>
    <h1>lightGallery with a Bootstrap video carousel</h1>
    <!-- One gallery over the carousel: every slide holds an item that
         opens its video. -->
    <LightGallery :plugins="plugins">
        <div
            id="bootstrap-video-carousel"
            ref="carouselEl"
            class="carousel slide"
        >
            <div class="carousel-indicators">
                <button
                    v-for="(video, index) of videos"
                    :key="video.poster"
                    type="button"
                    data-bs-target="#bootstrap-video-carousel"
                    :data-bs-slide-to="index"
                    :class="{ active: index === 0 }"
                    :aria-current="index === 0 ? 'true' : undefined"
                    :aria-label="`Slide ${index + 1}`"
                />
            </div>
            <div class="carousel-inner">
                <div
                    v-for="(video, index) of videos"
                    :key="video.poster"
                    class="carousel-item"
                    :class="{ active: index === 0 }"
                >
                    <LgItem :item="video">
                        <img
                            :src="video.poster"
                            class="d-block w-100"
                            :alt="video.alt"
                        />
                    </LgItem>
                </div>
            </div>
            <button
                class="carousel-control-prev"
                type="button"
                data-bs-target="#bootstrap-video-carousel"
                data-bs-slide="prev"
            >
                <span class="carousel-control-prev-icon" aria-hidden="true" />
                <span class="visually-hidden">Previous</span>
            </button>
            <button
                class="carousel-control-next"
                type="button"
                data-bs-target="#bootstrap-video-carousel"
                data-bs-slide="next"
            >
                <span class="carousel-control-next-icon" aria-hidden="true" />
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </LightGallery>
</template>
