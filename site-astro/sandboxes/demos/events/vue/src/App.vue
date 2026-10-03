<script setup lang="ts">
import { LightGallery, LgItem } from '@lightgallery/vue';

import 'lightgallery/css/lightgallery.css';

import { photos } from './photos';

const colours = ['#6a7583', '#1e304b', '#315460', '#080607'];

function setBackdrop(index: number) {
    const backdrop = document.querySelector<HTMLElement>(
        '.lg-events-demo-outer .lg-backdrop',
    );
    if (backdrop) {
        backdrop.style.backgroundColor = colours[index % colours.length];
    }
}
</script>

<template>
    <h1>lightGallery events</h1>
    <!-- Every gallery event is a kebab-case listener. This one changes the
         backdrop color on every slide change. `class-name` is a class on
         the gallery container, used by the style block below. -->
    <LightGallery
        class-name="lg-events-demo-outer"
        @before-slide="({ index }) => setBackdrop(index)"
    >
        <div class="gallery">
            <LgItem v-for="photo of photos" :key="photo.src" :item="photo">
                <img :src="photo.thumb" :alt="photo.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>

<style>
/* Optional: fade from one backdrop color to the next. */
.lg-events-demo-outer .lg-backdrop {
    transition: opacity 333ms ease-in 0s, background-color 333ms ease-in 0s;
}
</style>
