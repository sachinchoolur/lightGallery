<script setup lang="ts">
/** The caption bar (`.lg-sub-html`) for 'bar' and 'outer' positions. */
import { computed, inject, watch } from 'vue';

import { hasCaption, LgCaptionContent } from './caption-content';
import { LG_RUNTIME, LG_SLOTS } from './runtime';
import type { LgGalleryItem } from './types';

const props = defineProps<{
    item: LgGalleryItem | undefined;
    index: number;
}>();

const runtime = inject(LG_RUNTIME);
const slots = inject(LG_SLOTS, undefined);

const empty = computed(() => !slots?.caption && !hasCaption(props.item));

// The announcer (when active) voices caption changes; a second live
// region here would double-announce every slide.
const live = computed(
    () => runtime?.settings.value.ariaAnnouncements === false,
);

// React counterpart: Caption's afterAppendSubHtml effect — fired whenever
// the caption bar is (re)written for a new index.
watch(
    () => props.index,
    (index) => runtime?.emit('afterAppendSubHtml', { index }),
    { immediate: true },
);
</script>

<template>
    <div
        class="lg-sub-html"
        :class="{ 'lg-empty-html': empty }"
        :role="live ? 'status' : undefined"
        :aria-live="live ? 'polite' : undefined"
    >
        <LgCaptionContent
            v-if="props.item && !empty"
            :item="props.item"
            :index="props.index"
        />
    </div>
</template>
