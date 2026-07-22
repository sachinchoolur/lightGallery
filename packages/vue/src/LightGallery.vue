<script setup lang="ts">
/**
 * ADR 0001 spike (plans-vue 002): the minimal `<LightGallery>` proving the
 * architecture — `shallowRef` store over the shared headless reducer,
 * `<Teleport>` outlet rendering the `lg-*` class contract, `v-model:open` /
 * `v-model:index` controlled state, one typed scoped slot (`#caption`),
 * ESC close, `defineExpose` imperative surface.
 *
 * The full gallery (phases, windowing, transitions, gestures, plugins)
 * grows from this shape in plans 003+ after the ADR sign-off.
 */
import {
    computed,
    onBeforeUnmount,
    provide,
    watch,
} from 'vue';
import type { GalleryItem } from '@lightgallery/headless';

import {
    createGalleryStore,
    LG_ACTIONS,
    LG_STORE,
    type LgGalleryActions,
} from './store';

export type LgGalleryItem = GalleryItem<string>;

const props = withDefaults(
    defineProps<{
        /** The gallery data, typed by the shared headless model. */
        slides?: LgGalleryItem[];
        /** Teleport target for the overlay. */
        container?: string | HTMLElement;
    }>(),
    { slides: () => [], container: 'body' },
);

/**
 * Controlled state (ADR §3): bound models = controlled (parent value
 * flows back in), unbound = internal — `defineModel` collapses the React
 * controlled/uncontrolled split into one primitive.
 */
const open = defineModel<boolean>('open', { default: false });
const index = defineModel<number>('index', { default: 0 });

const emit = defineEmits<{
    'before-open': [];
    'after-close': [];
}>();

defineSlots<{
    /** Uncontrolled triggers / page content. */
    default?: () => unknown;
    /** Caption slot — the React `render.caption` twin (ADR §4). */
    caption?: (props: {
        item: LgGalleryItem | undefined;
        index: number;
    }) => unknown;
}>();

const store = createGalleryStore();
provide(LG_STORE, store);

const currentItem = computed<LgGalleryItem | undefined>(
    () => props.slides[store.currentIndex.value],
);

// Mirror the slides input into the reducer (React SET_SLIDES_COUNT twin).
watch(
    () => props.slides.length,
    (count) => store.setSlidesCount(count),
    { immediate: true },
);

// v-model:open ↔ store (both directions; reducer stays source of truth).
watch(open, (value) => {
    if (value && !store.isOpen.value) {
        emit('before-open');
        store.open(index.value);
    } else if (!value && store.isOpen.value) {
        store.close();
        emit('after-close');
    }
});
// v-model:index ↔ store.
watch(index, (value) => {
    if (store.isOpen.value && value !== store.currentIndex.value) {
        store.goTo(value);
        index.value = store.currentIndex.value;
    }
});
watch(store.currentIndex, (value) => {
    index.value = value;
});

// ESC close — bound only while open, removed symmetrically (SSR-safe: the
// watcher only touches `document` in the browser, after open).
function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        closeGallery();
    }
}
watch(store.isOpen, (isOpen) => {
    if (typeof document === 'undefined') {
        return;
    }
    if (isOpen) {
        document.addEventListener('keydown', onKeydown);
    } else {
        document.removeEventListener('keydown', onKeydown);
    }
});
onBeforeUnmount(() => {
    if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', onKeydown);
    }
});

// Imperative surface (ADR §3), mirroring the sibling tracks' handles.
function openGallery(at?: number): void {
    if (store.isOpen.value) {
        return;
    }
    emit('before-open');
    store.open(at ?? index.value);
    index.value = store.currentIndex.value;
    open.value = true;
}
function closeGallery(): void {
    store.close();
    open.value = false;
    emit('after-close');
}
function goToSlide(at: number): void {
    store.goTo(at);
    index.value = store.currentIndex.value;
}
function nextSlide(): void {
    store.next();
    index.value = store.currentIndex.value;
}
function prevSlide(): void {
    store.prev();
    index.value = store.currentIndex.value;
}
function refresh(): void {}

const actions: LgGalleryActions = {
    openGallery,
    closeGallery,
    goToSlide,
    nextSlide,
    prevSlide,
    refresh,
};
provide(LG_ACTIONS, actions);
defineExpose<LgGalleryActions>(actions);
</script>

<template>
    <slot />
    <Teleport :to="props.container">
        <div
            v-if="store.isOpen.value"
            class="lg-container lg-show lg-show-in"
            role="dialog"
            aria-modal="true"
            aria-label="Gallery"
        >
            <div class="lg-backdrop in"></div>
            <div class="lg-outer lg-use-css3 lg-css3 lg-slide lg-visible">
                <div class="lg-content">
                    <div class="lg-inner">
                        <div
                            v-if="currentItem"
                            class="lg-item lg-current lg-loaded"
                        >
                            <picture class="lg-img-wrap">
                                <img
                                    class="lg-object lg-image"
                                    :src="currentItem.src"
                                    :alt="currentItem.alt ?? ''"
                                />
                            </picture>
                        </div>
                    </div>
                    <button
                        type="button"
                        class="lg-prev lg-icon"
                        aria-label="Previous slide"
                        @click="prevSlide"
                    ></button>
                    <button
                        type="button"
                        class="lg-next lg-icon"
                        aria-label="Next slide"
                        @click="nextSlide"
                    ></button>
                </div>
                <div class="lg-toolbar lg-group">
                    <button
                        type="button"
                        class="lg-close lg-icon"
                        aria-label="Close gallery"
                        @click="closeGallery"
                    ></button>
                    <div class="lg-counter" role="status">
                        <span class="lg-counter-current">{{
                            store.currentIndex.value + 1
                        }}</span
                        >{{ ' / '
                        }}<span class="lg-counter-all">{{
                            store.slidesCount.value
                        }}</span>
                    </div>
                </div>
                <div class="lg-components">
                    <div class="lg-sub-html" role="status">
                        <slot
                            name="caption"
                            :item="currentItem"
                            :index="store.currentIndex.value"
                        />
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
