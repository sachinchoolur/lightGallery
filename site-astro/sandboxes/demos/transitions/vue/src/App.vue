<script setup lang="ts">
import { LightGallery, LgItem } from '@lightgallery/vue';

import 'lightgallery/css/lightgallery.css';
// Every mode other than lg-slide and lg-fade needs this stylesheet.
import 'lightgallery/css/lg-transitions.css';

import { photos } from './photos';
</script>

<template>
    <h1>lightGallery transitions</h1>
    <!-- Try 'lg-zoom-in', 'lg-slide-vertical', 'lg-rotate' or 'lg-tube'. -->
    <LightGallery mode="lg-fade">
        <div class="gallery">
            <LgItem v-for="photo of photos" :key="photo.src" :item="photo">
                <img :src="photo.thumb" :alt="photo.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>
