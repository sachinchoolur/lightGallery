<script setup lang="ts">
import { LightGallery, LgItem, type LgIcons } from '@lightgallery/vue';
import Autoplay from '@lightgallery/vue/plugins/autoplay';
import Zoom from '@lightgallery/vue/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-zoom.css';

import CloseIcon from './icons/CloseIcon.vue';
import PauseIcon from './icons/PauseIcon.vue';
import PlayIcon from './icons/PlayIcon.vue';
import { photos } from './photos';

const plugins = [Zoom, Autoplay];

// An SVG component, or an SVG string, per icon name. Names left out keep
// the built-in icons. The icons draw with currentColor, which keeps the
// hover and active colors of the buttons.
const icons: LgIcons = {
    close: CloseIcon,
    // A state pair needs both names, or the pair keeps the built-ins.
    autoplayPlay: PlayIcon,
    autoplayPause: PauseIcon,
};
</script>

<template>
    <h1>lightGallery custom icons</h1>
    <LightGallery :plugins="plugins" :icons="icons">
        <div class="gallery">
            <LgItem v-for="photo of photos" :key="photo.src" :item="photo">
                <img :src="photo.thumb" :alt="photo.alt" />
            </LgItem>
        </div>
    </LightGallery>
</template>
