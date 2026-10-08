<script setup lang="ts">
import { LightGallery, LgItem } from '@lightgallery/vue';

import 'lightgallery/css/lightgallery.css';

import { photos } from './photos';
</script>

<template>
    <h1>lightGallery HTML markup</h1>
    <!-- A trigger is a component: it renders a link to the full-size image,
         and its `item` carries the slide data that data attributes hold in
         plain HTML. -->
    <LightGallery>
        <div class="gallery">
            <LgItem v-for="photo of photos" :key="photo.src" :item="photo">
                <img :src="photo.thumb" :alt="photo.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>
