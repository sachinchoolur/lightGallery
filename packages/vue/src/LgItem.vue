<script setup lang="ts">
/**
 * Uncontrolled-mode trigger (ADR 0001 §3): renders the thumbnail markup
 * (an anchor by default) and opens the gallery at its slide on click.
 * Mount order defines slide order — same registration caveat as the
 * sibling tracks. The rendered element doubles as the zoom-from-origin
 * measurement target (the first `<img>` inside it, falling back to the
 * element itself).
 */
import {
    inject,
    onBeforeUnmount,
    onMounted,
    ref,
} from 'vue';

import { LG_ACTIONS } from './store';
import { LG_RUNTIME, type LgItemRegistration } from './runtime';
import type { LgGalleryItem } from './types';

const props = defineProps<{
    /** The slide this trigger opens (also the item data, uncontrolled). */
    item: LgGalleryItem;
}>();

const runtime = inject(LG_RUNTIME);
const actions = inject(LG_ACTIONS);

const el = ref<HTMLElement | null>(null);
const registration: LgItemRegistration = {
    item: () => props.item,
    element: null,
};
let unregister: (() => void) | null = null;

onMounted(() => {
    registration.element = el.value;
    unregister = runtime?.registerItem(registration) ?? null;
});
onBeforeUnmount(() => {
    unregister?.();
    unregister = null;
});

function onClick(event: MouseEvent): void {
    if (event.defaultPrevented) {
        return;
    }
    event.preventDefault();
    const index = runtime?.getItemIndex(registration) ?? -1;
    if (index >= 0) {
        actions?.openGallery(index);
    }
}
</script>

<template>
    <a ref="el" :href="props.item.src" @click="onClick">
        <slot />
    </a>
</template>
