<script setup lang="ts">
/** Grid trigger sized to the item's own aspect ratio. */
import { LgItem } from '@lightgallery/vue';

import type { DemoItem } from '../../../shared/media';

withDefaults(defineProps<{ item: DemoItem; caption?: boolean }>(), {
    caption: true,
});
</script>

<template>
    <figure v-if="caption" class="tile">
        <LgItem :item="item" :data-lg-size="item.lgSize">
            <img
                :src="item.thumb"
                :alt="item.alt"
                :width="item.thumbWidth"
                :height="item.thumbHeight"
                loading="lazy"
            />
        </LgItem>
        <figcaption>{{ item.caption }}</figcaption>
    </figure>
    <LgItem v-else :item="item" :data-lg-size="item.lgSize">
        <img
            :src="item.thumb"
            :alt="item.alt"
            :width="item.thumbWidth"
            :height="item.thumbHeight"
            loading="lazy"
        />
    </LgItem>
</template>
