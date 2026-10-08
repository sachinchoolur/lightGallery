<script setup lang="ts">
import { LightGallery, LgItem, type LgGalleryItem } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';

const plugins = [Thumbnail, Zoom];
const items: LgGalleryItem[] = [
    { src: '1.jpg', thumb: '1-t.jpg', alt: 'First', caption: 'One' },
    { src: '2.jpg', thumb: '2-t.jpg', alt: 'Second' },
];
</script>

<template>
    <main>
        <h1>lg-scratch-nuxt</h1>
        <LightGallery :plugins="plugins">
            <LgItem
                v-for="item of items"
                :key="item.src"
                :item="item"
                class="trigger"
            >
                <img :src="item.thumb" :alt="item.alt" />
            </LgItem>
        </LightGallery>
    </main>
</template>
