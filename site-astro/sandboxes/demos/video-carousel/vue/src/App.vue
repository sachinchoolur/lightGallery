<script setup lang="ts">
import { ref } from 'vue';
import {
    LightGallery,
    type InitDetail,
    type LgGalleryItem,
} from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Video from '@lightgallery/vue/plugins/video';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';
import './carousel.css';

const container = ref<HTMLElement | null>(null);
const plugins = [Thumbnail, Video];

// The carousel has no thumbnails to click, so open it as soon as the
// gallery is ready.
const openCarousel = ({ instance }: InitDetail) => instance.openGallery();

const videos: LgGalleryItem[] = [
    // YouTube and Vimeo: `src` is the address of the video page.
    {
        src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
        poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
        thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/mqdefault.jpg',
        alt: 'Puffin Hunts Fish To Feed Puffling',
        caption: 'YouTube video: Puffin Hunts Fish To Feed Puffling, BBC Earth',
    },
    {
        src: 'https://vimeo.com/112836958',
        poster: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
        thumb: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
        alt: 'Nature',
        caption: 'Vimeo video: Nature, by Charlie Kaye',
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
        thumb: 'https://www.lightgalleryjs.com/images/demo/html5-video-poster.jpg',
        alt: 'Peck Pocketed',
        caption: 'HTML5 video: Peck Pocketed, by Kevin Herron',
    },
];
</script>

<template>
    <h1>lightGallery video carousel</h1>
    <!-- The gallery is rendered inside this element and takes its size,
         which is set in carousel.css. -->
    <div ref="container" class="inline-gallery-container" />
    <!-- The carousel cannot be closed. The maximize icon expands it to the
         whole window. -->
    <LightGallery
        v-if="container"
        :container="container"
        :closable="false"
        :show-maximize-icon="true"
        :slides="videos"
        :plugins="plugins"
        @init="openCarousel"
    />
</template>
