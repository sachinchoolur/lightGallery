<script setup lang="ts">
import { LightGallery, LgItem } from '@lightgallery/vue';

import 'lightgallery/css/lightgallery.css';
// Mirrors the gallery controls in a right-to-left gallery.
import 'lightgallery/css/lg-rtl.css';

import { photos } from './photos';

const captions = [
    'الصورة الأولى',
    'الصورة الثانية',
    'الصورة الثالثة',
    'الصورة الرابعة',
    'الصورة الخامسة',
    'الصورة السادسة',
    'الصورة السابعة',
    'الصورة الثامنة',
];

const items = photos.map((photo, index) => ({
    ...photo,
    alt: captions[index],
    caption: captions[index],
}));
</script>

<template>
    <h1>lightGallery RTL</h1>
    <!-- 'rtl' makes the gallery right-to-left. Use 'auto' to follow the dir
         attribute of the page's <html> or <body> instead. -->
    <LightGallery direction="rtl">
        <!-- dir="rtl" mirrors the grid on the page. -->
        <div class="gallery" dir="rtl">
            <LgItem v-for="item of items" :key="item.src" :item="item">
                <img :src="item.thumb" :alt="item.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>
