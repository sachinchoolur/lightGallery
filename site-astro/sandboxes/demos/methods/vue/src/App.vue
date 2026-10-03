<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { LightGallery, LgItem } from '@lightgallery/vue';

import 'lightgallery/css/lightgallery.css';
import './methods.css';

import { photos } from './photos';

// The template ref gives access to the gallery's methods.
const gallery = useTemplateRef('gallery');
</script>

<template>
    <h1>lightGallery methods</h1>
    <p>
        <button type="button" @click="gallery?.openGallery(2)">
            Open on the third photo
        </button>
    </p>

    <!-- :controls="false" hides the built-in previous and next buttons. -->
    <LightGallery ref="gallery" :controls="false">
        <div class="gallery">
            <LgItem v-for="photo of photos" :key="photo.src" :item="photo">
                <img :src="photo.thumb" :alt="photo.alt" />
            </LgItem>
        </div>

        <!-- The caption slot puts custom buttons in the caption area of
             every slide. -->
        <template #caption>
            <div class="gallery-nav">
                <button type="button" @click="gallery?.prevSlide()">
                    Previous
                </button>
                <button type="button" @click="gallery?.nextSlide()">
                    Next
                </button>
                <button type="button" @click="gallery?.closeGallery()">
                    Close
                </button>
            </div>
        </template>
    </LightGallery>
</template>
