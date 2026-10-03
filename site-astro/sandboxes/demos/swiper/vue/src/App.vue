<script setup lang="ts">
import { LightGallery, LgItem, type SlideEventDetail } from '@lightgallery/vue';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/navigation';
import 'lightgallery/css/lightgallery.css';

const slides = [10, 11, 15, 16].map((id, index) => ({
    src: `https://picsum.photos/id/${id}/1600/1067`,
    thumb: `https://picsum.photos/id/${id}/960/640`,
    alt: `Sample photo ${index + 1}`,
    // WIDTH-HEIGHT of the full-size image; lets it open from its slide.
    lgSize: '1600-1067',
}));

const modules = [Navigation];

let swiper: SwiperClass | undefined;

function setSwiper(instance: SwiperClass) {
    swiper = instance;
}

// When the gallery goes to another slide, move the carousel to the same
// slide, so the image closes into its slide.
function followGallery({ index }: SlideEventDetail) {
    swiper?.slideTo(index, 0);
}
</script>

<template>
    <h1>lightGallery with a Swiper carousel</h1>
    <LightGallery @before-slide="followGallery">
        <Swiper :modules="modules" navigation @swiper="setSwiper">
            <SwiperSlide v-for="slide of slides" :key="slide.src">
                <LgItem :item="slide">
                    <img :src="slide.thumb" :alt="slide.alt" />
                </LgItem>
            </SwiperSlide>
        </Swiper>
    </LightGallery>
</template>

<style>
/* Optional: the size of the carousel on the page. */
.swiper {
    max-width: 960px;
    margin: 0;
}

.swiper-slide a,
.swiper-slide img {
    display: block;
}

.swiper-slide img {
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
}
</style>
