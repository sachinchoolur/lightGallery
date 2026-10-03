<script setup lang="ts">
import { ref } from 'vue';
import { LightGallery, type InitDetail } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import './carousel.css';

import { photos } from './photos';

const container = ref<HTMLElement | null>(null);
const plugins = [Thumbnail, Zoom];

// The carousel has no thumbnails to click, so open it as soon as the
// gallery is ready.
const openCarousel = ({ instance }: InitDetail) => instance.openGallery();
</script>

<template>
    <h1>lightGallery carousel gallery</h1>
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
        :slides="photos"
        :plugins="plugins"
        @init="openCarousel"
    />
</template>
