<script setup lang="ts">
/**
 * Default image renderer: `<picture class="lg-img-wrap">` with optional
 * `<source>` entries and the `lg-object lg-image` img — the same DOM the
 * vanilla core produces, so `lightgallery/css` styles it unchanged.
 */
import type { LgGalleryItem } from './types';

const props = defineProps<{
    item: LgGalleryItem;
    index: number;
}>();

const emit = defineEmits<{
    'media-load': [];
    'media-error': [];
}>();
</script>

<template>
    <picture class="lg-img-wrap">
        <source
            v-for="(source, sourceIndex) of props.item.sources ?? []"
            :key="sourceIndex"
            :media="source.media"
            :srcset="source.srcset"
            :sizes="source.sizes"
            :type="source.type"
        />
        <img
            class="lg-object lg-image"
            :data-index="props.index"
            :src="props.item.src"
            :srcset="props.item.srcset"
            :sizes="props.item.sizes"
            :alt="props.item.alt ?? ''"
            draggable="false"
            @load="emit('media-load')"
            @error="emit('media-error')"
            @dragstart.prevent
        />
    </picture>
</template>
