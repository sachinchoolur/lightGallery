<script setup lang="ts">
/**
 * Default image renderer: `<picture class="lg-img-wrap">` with optional
 * `<source>` entries and the `lg-object lg-image` img — the same DOM the
 * vanilla core produces, so `lightgallery/css` styles it unchanged.
 */
import { computed } from 'vue';
import type { ImageSize } from '@lightgallery/headless';

import type { LgGalleryItem } from './types';

const props = defineProps<{
    item: LgGalleryItem;
    index: number;
    /** First-slide dummy (2.x): the thumb that flies while `src` loads. */
    dummySrc?: string | null;
    /** Box the dummy flies at: the fitted image size, capped at natural. */
    dummySize?: ImageSize | null;
    /** Hold back the real `<img>` while the origin flight runs (2.x). */
    deferSrc?: boolean;
}>();

const emit = defineEmits<{
    'media-load': [event: Event];
    'media-error': [];
}>();

// v2 sizes the dummy to the fitted image box, which is capped at the
// natural size. Filling the whole wrap instead stretches the thumb of an
// image smaller than the stage up to stage size, then snaps it down when
// the real image replaces it.
const dummyStyle = computed(() =>
    props.dummySize
        ? {
              width: `${props.dummySize.width}px`,
              height: `${props.dummySize.height}px`,
              transform: 'translate(-50%, -50%)',
          }
        : {
              width: '100%',
              height: '100%',
              objectFit: 'contain' as const,
              transform: 'translate(-50%, -50%)',
          },
);
</script>

<template>
    <picture class="lg-img-wrap">
        <template v-if="!props.deferSrc">
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
                @load="emit('media-load', $event)"
                @error="emit('media-error')"
                @dragstart.prevent
            />
        </template>
        <img
            v-if="props.dummySrc"
            class="lg-dummy-img"
            :src="props.dummySrc"
            alt=""
            aria-hidden="true"
            draggable="false"
            :style="dummyStyle"
        />
    </picture>
</template>
