<script setup lang="ts">
import { ref } from 'vue';
import { LightGallery, LgItem } from '@lightgallery/vue';

import 'lightgallery/css/lightgallery.css';
import './update-slides.css';

import { photos as firstPhotos, type Photo } from './photos';

let added = 0;

function newPhoto(): Photo {
    added += 1;
    return {
        src: `https://picsum.photos/seed/lg-added-${added}/1600/1067`,
        thumb: `https://picsum.photos/seed/lg-added-${added}/360/240`,
        alt: `Added photo ${added}`,
        lgSize: '1600-1067',
    };
}

// Changing the list is the update, also while the gallery is open. There
// is no method to call.
const photos = ref([...firstPhotos]);
</script>

<template>
    <h1>lightGallery update slides</h1>
    <p>Open a photo, then use the buttons under it.</p>

    <LightGallery>
        <div class="gallery">
            <LgItem v-for="photo of photos" :key="photo.src" :item="photo">
                <img :src="photo.thumb" :alt="photo.alt" />
            </LgItem>
        </div>

        <!-- The caption slot puts the buttons in the caption area of every
             slide. -->
        <template #caption="{ index }">
            <div class="slide-actions">
                <button type="button" @click="photos.push(newPhoto())">
                    Add a photo
                </button>
                <button
                    type="button"
                    :disabled="photos.length === 1"
                    @click="photos.splice(index, 1)"
                >
                    Remove this photo
                </button>
            </div>
        </template>
    </LightGallery>
</template>
