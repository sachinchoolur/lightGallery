<script setup lang="ts">
import { LightGallery, LgItem } from '@lightgallery/vue';

import 'lightgallery/css/lightgallery.css';

import { photos } from './photos';
</script>

<template>
    <h1>lightGallery zoom from origin</h1>
    <!-- zoomFromOrigin is on by default: the image grows out of the clicked
         thumbnail and flies back to it on close. It needs each item's
         lgSize, the full-size image's "WIDTH-HEIGHT". -->
    <LightGallery :zoom-from-origin="true">
        <div class="gallery">
            <LgItem v-for="photo of photos" :key="photo.src" :item="photo">
                <img :src="photo.thumb" :alt="photo.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>
