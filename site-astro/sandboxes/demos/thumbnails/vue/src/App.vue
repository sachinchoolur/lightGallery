<script setup lang="ts">
import { LightGallery, LgItem } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';

import { photos } from './photos';

const plugins = [Thumbnail];
</script>

<template>
    <h1>lightGallery thumbnails</h1>
    <LightGallery :plugins="plugins" :thumbnail="{ animateThumb: true }">
        <div class="gallery">
            <LgItem v-for="photo of photos" :key="photo.src" :item="photo">
                <img :src="photo.thumb" :alt="photo.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>
