<script setup lang="ts">
import { ref } from 'vue';
import { LightGallery } from '@lightgallery/vue';

import 'lightgallery/css/lightgallery.css';

import { photos } from './photos';

// The slides are data: there is no gallery markup on the page.
const slides = photos.map((photo) => ({ ...photo, caption: photo.alt }));

const open = ref(false);
// Opens on the third slide.
const index = ref(2);
</script>

<template>
    <h1>lightGallery dynamic mode</h1>
    <button type="button" @click="open = true">Open gallery</button>
    <LightGallery v-model:open="open" v-model:index="index" :slides="slides" />
</template>
