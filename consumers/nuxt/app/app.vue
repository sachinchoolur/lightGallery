<script setup lang="ts">
import { LightGallery, LgItem, type LgGalleryItem } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Zoom from '@lightgallery/vue/plugins/zoom';

// The same four photos in every consumer app; the check compares them.
const items: LgGalleryItem[] = [1, 2, 3, 4].map((n) => ({
    src: `/photos/${n}.png`,
    thumb: `/photos/${n}-thumb.png`,
    alt: `Photo ${n}`,
    caption: `Photo ${n} caption`,
    lgSize: '1600-1067',
}));
</script>

<template>
    <main>
        <h1>lightGallery consumer</h1>
        <LightGallery :plugins="[Zoom, Thumbnail]" :thumbnail="{ animateThumb: true }">
            <div class="grid">
                <LgItem v-for="item of items" :key="item.src" :item="item">
                    <img :src="item.thumb" :alt="item.alt" />
                </LgItem>
            </div>
        </LightGallery>
    </main>
</template>

<style>
body { font-family: system-ui, sans-serif; margin: 24px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
.grid img { width: 100%; height: auto; display: block; }
</style>
