<script setup lang="ts">
import { LightGallery, LgItem } from '@lightgallery/vue';
import Rotate from '@lightgallery/vue/plugins/rotate';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-rotate.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';

import { photos } from './photos';

const plugins = [Zoom, Rotate, Thumbnail];
</script>

<template>
    <h1>lightGallery image zoom</h1>
    <!-- Zoom in and zoom out buttons next to the actual-size button; the
         library shows only actual size by default. `scale` is how much
         each step changes the scale. -->
    <LightGallery
        :plugins="plugins"
        :zoom="{ showZoomInOutIcons: true, actualSize: true, scale: 1 }"
    >
        <div class="gallery">
            <LgItem v-for="photo of photos" :key="photo.src" :item="photo">
                <img :src="photo.thumb" :alt="photo.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>
