<script setup lang="ts">
import { LightGallery, LgItem } from '@lightgallery/vue';
import Hash from '@lightgallery/vue/plugins/hash';

import 'lightgallery/css/lightgallery.css';

import { photos } from './photos';

const plugins = [Hash];
</script>

<template>
    <h1>lightGallery hash</h1>
    <p>
        Open a photo and look at the address bar. Loading that URL opens the
        gallery on the same photo.
    </p>
    <!-- galleryId is the id in the URL: #lg=1&slide=2. Give each gallery on
         a page its own. hashDriver 'auto' uses the Navigation API where the
         browser has it and the History API everywhere else. -->
    <LightGallery
        :plugins="plugins"
        :hash="{ galleryId: '1', hashDriver: 'auto' }"
    >
        <div class="gallery">
            <LgItem v-for="photo of photos" :key="photo.src" :item="photo">
                <img :src="photo.thumb" :alt="photo.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>
