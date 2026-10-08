<script setup lang="ts">
import { LightGallery, LgItem, type LgGalleryItem } from '@lightgallery/vue';
import Share from '@lightgallery/vue/plugins/share';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-share.css';

import { photos } from './photos';

// Share adds a share button to the toolbar. It lists Facebook, X and
// Pinterest; on touch devices it opens the device's share sheet first.
// Pass :share="{ preferNativeShare: true }" (or false) to choose one for
// every device.
const plugins = [Share];

// tweetText and pinterestText are the text the post on X and the pin on
// Pinterest start with.
const items: LgGalleryItem[] = photos.map((photo) => ({
    ...photo,
    tweetText: `${photo.alt}, shared from lightGallery`,
    pinterestText: photo.alt,
}));
</script>

<template>
    <h1>lightGallery social sharing</h1>
    <LightGallery :plugins="plugins">
        <div class="gallery">
            <LgItem v-for="item of items" :key="item.src" :item="item">
                <img :src="item.thumb" :alt="item.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>
