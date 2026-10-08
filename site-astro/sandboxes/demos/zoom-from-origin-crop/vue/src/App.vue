<script setup lang="ts">
import { LightGallery, LgItem } from '@lightgallery/vue';
import OriginCrop from '@lightgallery/vue/plugins/originCrop';

import 'lightgallery/css/lightgallery.css';

import { photos } from './photos';

const plugins = [OriginCrop];
</script>

<template>
    <h1>lightGallery zoom from origin, cropped thumbnails</h1>
    <!-- The tiles are square and crop every photo with object-fit: cover.
         The origin crop plugin flies the part of the photo a tile shows and
         reveals the rest around it; without the plugin the whole photo
         would be squashed into the tile. It reads the tile's object-fit
         and object-position, nothing is needed in the markup. -->
    <LightGallery :plugins="plugins">
        <div class="tiles">
            <LgItem v-for="photo of photos" :key="photo.src" :item="photo">
                <img
                    :src="photo.thumb"
                    :alt="photo.alt"
                    :style="{ objectPosition: photo.position }"
                />
            </LgItem>
        </div>
    </LightGallery>
</template>

<style>
/* Square tiles: each shows a window of its photo. */
.tiles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
}

.tiles a {
    display: block;
}

.tiles img {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 4px;
}
</style>
