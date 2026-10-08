<script setup lang="ts">
import { LightGallery, LgItem, type LgGalleryItem } from '@lightgallery/vue';

import 'lightgallery/css/lightgallery.css';

// `captionHtml` takes an HTML string; `caption` takes plain text.
const items: LgGalleryItem[] = [
    {
        src: 'https://picsum.photos/id/10/1600/1067',
        thumb: 'https://picsum.photos/id/10/360/240',
        alt: 'Forest and sea',
        lgSize: '1600-1067',
        captionHtml:
            '<h4>Forest and sea</h4><p>Evergreen treetops in front of a calm blue bay.</p>',
    },
    {
        src: 'https://picsum.photos/id/11/1600/1067',
        thumb: 'https://picsum.photos/id/11/360/240',
        alt: 'Misty valley',
        lgSize: '1600-1067',
        captionHtml:
            '<h4>Misty valley</h4><p>A stream winds through a meadow under a grey sky.</p>',
    },
    {
        src: 'https://picsum.photos/id/15/1600/1067',
        thumb: 'https://picsum.photos/id/15/360/240',
        alt: 'Waterfall',
        lgSize: '1600-1067',
        captionHtml:
            '<h4>Waterfall</h4><p>A narrow waterfall drops into a rocky gorge.</p>',
    },
    {
        src: 'https://picsum.photos/id/16/1600/1067',
        thumb: 'https://picsum.photos/id/16/360/240',
        alt: 'Rocky shore',
        lgSize: '1600-1067',
        captionHtml:
            '<h4>Rocky shore</h4><p>Driftwood and boulders at the edge of clear water.</p>',
    },
];
</script>

<template>
    <h1>lightGallery captions</h1>
    <LightGallery>
        <div class="gallery">
            <LgItem v-for="item of items" :key="item.src" :item="item">
                <img :src="item.thumb" :alt="item.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>
