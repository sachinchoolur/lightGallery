<script setup lang="ts">
/** Iframe slide renderer, 2.x `getIframeMarkup`. */
import { inject } from 'vue';

import { LG_RUNTIME } from './runtime';
import type { LgGalleryItem } from './types';

const props = defineProps<{
    item: LgGalleryItem;
    index: number;
}>();

const emit = defineEmits<{
    'media-load': [];
}>();

const runtime = inject(LG_RUNTIME)!;
</script>

<template>
    <div
        class="lg-media-cont lg-has-iframe"
        :style="{
            width: runtime.settings.value.iframeWidth,
            maxWidth: runtime.settings.value.iframeMaxWidth,
            height: runtime.settings.value.iframeHeight,
            maxHeight: runtime.settings.value.iframeMaxHeight,
        }"
    >
        <iframe
            class="lg-object"
            frameborder="0"
            :title="
                props.item.iframeTitle ?? props.item.title ?? 'Embedded content'
            "
            :src="props.item.src"
            allowfullscreen
            @load="emit('media-load')"
        />
    </div>
</template>
