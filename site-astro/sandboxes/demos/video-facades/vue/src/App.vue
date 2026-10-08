<script setup lang="ts">
import { LightGallery, LgItem, type LgGalleryItem } from '@lightgallery/vue';
import Video from '@lightgallery/vue/plugins/video';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-video.css';

const plugins = [Video];

const videoSettings = {
    // The next two are the defaults, written out. A video slide shows its
    // poster with a play button; the player loads when play is pressed.
    videoFacade: true,
    // YouTube videos are embedded through youtube-nocookie.com.
    youTubeNoCookie: true,
    // By default the first video starts playing as the gallery opens, which
    // loads its player at once. Off, so every slide starts as a facade.
    autoplayFirstVideo: false,
};

// `poster` is the image the slide shows until play is pressed.
const videos: LgGalleryItem[] = [
    {
        src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
        poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
        thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/mqdefault.jpg',
        alt: 'Puffin Hunts Fish To Feed Puffling',
        caption: 'YouTube video: Puffin Hunts Fish To Feed Puffling, BBC Earth',
        lgSize: '1280-720',
    },
    {
        src: 'https://vimeo.com/112836958',
        poster: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
        thumb: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
        alt: 'Nature',
        caption: 'Vimeo video: Nature, by Charlie Kaye',
        lgSize: '1280-720',
    },
];
</script>

<template>
    <h1>lightGallery video facades</h1>
    <LightGallery :plugins="plugins" :video="videoSettings">
        <div class="gallery">
            <LgItem v-for="video of videos" :key="video.src" :item="video">
                <img :src="video.thumb" :alt="video.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>
