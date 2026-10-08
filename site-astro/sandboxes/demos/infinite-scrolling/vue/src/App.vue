<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { LightGallery, LgItem } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';

import { photos as firstPhotos, type Photo } from './photos';

const PAGE_SIZE = 12;
const LAST_PAGE = 8;

// Stands in for a request to your server: resolves to one page of photos.
function fetchPage(page: number): Promise<Photo[]> {
    const photos = Array.from({ length: PAGE_SIZE }, (_, i) => {
        const n = firstPhotos.length + (page - 1) * PAGE_SIZE + i + 1;
        return {
            src: `https://picsum.photos/seed/lg-${n}/1600/1067`,
            thumb: `https://picsum.photos/seed/lg-${n}/360/240`,
            alt: `Sample photo ${n}`,
            lgSize: '1600-1067',
        };
    });
    return new Promise((resolve) => setTimeout(() => resolve(photos), 400));
}

const plugins = [Thumbnail];
const photos = ref([...firstPhotos]);
const page = ref(0);
const status = useTemplateRef('status');

let loading = false;

// The status line sits after the gallery. When it comes within 200px of
// the viewport, the next page loads.
const observer = new IntersectionObserver(
    async ([entry]) => {
        if (!entry.isIntersecting || loading) {
            return;
        }
        loading = true;
        const next = await fetchPage(page.value + 1);
        // Appending to the array is all it takes: the gallery picks up the
        // new slides on the next render.
        photos.value.push(...next);
        page.value += 1;
        loading = false;

        if (page.value === LAST_PAGE) {
            observer.disconnect();
            return;
        }
        // Once the new thumbnails are on the page, observe again, so a
        // status line that is still in view after a short page loads the
        // next one too.
        await nextTick();
        observer.unobserve(status.value!);
        observer.observe(status.value!);
    },
    { rootMargin: '200px' },
);

onMounted(() => observer.observe(status.value!));
onUnmounted(() => observer.disconnect());
</script>

<template>
    <h1>lightGallery infinite scrolling</h1>
    <LightGallery :plugins="plugins" :speed="500">
        <div class="gallery">
            <LgItem v-for="photo of photos" :key="photo.src" :item="photo">
                <img :src="photo.thumb" :alt="photo.alt" />
            </LgItem>
        </div>
    </LightGallery>
    <p ref="status">
        {{ page === LAST_PAGE ? 'All photos loaded.' : 'Loading more photos…' }}
    </p>
</template>
