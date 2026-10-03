<script setup lang="ts">
import { LightGallery, LgItem } from '@lightgallery/vue';
import MediumZoom from '@lightgallery/vue/plugins/mediumZoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-medium-zoom.css';
import './article.css';

// lgBackgroundColor sets the backdrop color for one image; the default is
// black.
const image = (id: number, alt: string, lgBackgroundColor?: string) => ({
    src: `https://picsum.photos/id/${id}/1600/1000`,
    thumb: `https://picsum.photos/id/${id}/800/500`,
    alt,
    lgSize: '1600-1000',
    lgBackgroundColor,
});

const images = [
    image(15, 'Sample photo 1', '#fff'),
    image(28, 'Sample photo 2', 'rgb(28 62 74)'),
    image(29, 'Sample photo 3'),
];

const text =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eleifend ' +
    'purus ligula, at gravida augue ullamcorper et. Cras placerat eu lectus ' +
    'a condimentum. Nam hendrerit sem augue, ac porta ante venenatis vel.';

const plugins = [MediumZoom];
</script>

<template>
    <h1>lightGallery medium zoom</h1>
    <!-- Click an image to zoom it in place. margin is the space kept above
         and below the zoomed image, in px. The settings attribute is
         written mediumZoom, the exact name of the plugin. -->
    <LightGallery :plugins="plugins" :mediumZoom="{ margin: 24 }">
        <article class="article">
            <template v-for="image of images" :key="image.src">
                <p>{{ text }}</p>
                <LgItem :item="image">
                    <img :src="image.thumb" :alt="image.alt" />
                </LgItem>
            </template>
            <p>{{ text }}</p>
        </article>
    </LightGallery>
</template>
