<script setup lang="ts">
import { LightGallery, LgItem } from '@lightgallery/vue';

import 'lightgallery/css/lightgallery.css';

import { photos } from './photos';
</script>

<template>
    <h1>lightGallery custom easing</h1>
    <!-- `easing` is any CSS timing function. The speed is slower than the
         default 400, so the curve is easy to see. -->
    <LightGallery
        easing="cubic-bezier(0.680, -0.550, 0.265, 1.550)"
        :speed="1000"
    >
        <div class="gallery">
            <LgItem v-for="photo of photos" :key="photo.src" :item="photo">
                <img :src="photo.thumb" :alt="photo.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>
