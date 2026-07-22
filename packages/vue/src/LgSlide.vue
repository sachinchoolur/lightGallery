<script setup lang="ts">
/**
 * One `.lg-item`. Content mounts lazily (2.x parity): the current slide
 * loads immediately; neighbors within `preload` load once the current
 * slide's media completes; once loaded, a slide keeps its content for as
 * long as it stays in the DOM window. The vanilla CSS shows the loading
 * spinner until `lg-complete` lands.
 */
import { computed, h, inject, ref, watch, type VNodeChild } from 'vue';
import { getPreloadIndexes, getSlideType } from '@lightgallery/headless';

import { LgCaptionContent } from './caption-content';
import LgImageSlide from './LgImageSlide.vue';
import { LG_RUNTIME } from './runtime';
import { LG_STORE } from './store';
import type { LgGalleryItem } from './types';

/** Zoom-from-origin animation state (React `OriginAnimation` twin). */
export interface OriginAnimation {
    index: number;
    transform: string;
    stage: 'init' | 'armed' | 'run';
    closing?: boolean;
}

const props = withDefaults(
    defineProps<{
        index: number;
        item?: LgGalleryItem;
        /** Which slide carries `lg-current` (transition timeline). */
        isShown?: boolean;
        /** `lg-prev-slide` / `lg-next-slide` assignment. */
        position?: 'prev' | 'next';
        /** Slide carrying `lg-slide-progress` (outgoing slide). */
        inProgress?: boolean;
        originAnim?: OriginAnimation | null;
    }>(),
    {
        item: undefined,
        isShown: false,
        position: undefined,
        inProgress: false,
        originAnim: null,
    },
);

const store = inject(LG_STORE)!;
const runtime = inject(LG_RUNTIME)!;

const error = ref(false);
const sticky = ref(false);
let appended = false;

const isCurrent = computed(
    () => store.currentIndex.value === props.index,
);
const completed = computed(
    () => store.loadedSlides.value.has(props.index) || error.value,
);
const inPreloadRange = computed(
    () =>
        getPreloadIndexes(
            store.currentIndex.value,
            runtime.settings.value.preload,
            store.slidesCount.value,
        ).indexOf(props.index) !== -1,
);
const shouldLoad = computed(() => {
    if (!store.isOpen.value) {
        return false;
    }
    const currentLoaded = store.loadedSlides.value.has(
        store.currentIndex.value,
    );
    return (
        sticky.value ||
        isCurrent.value ||
        (currentLoaded && inPreloadRange.value)
    );
});
// React counterpart: Slide's sticky shouldLoad ref — once content mounts
// it stays for as long as the slide is in the DOM window; and the
// afterAppendSlide mount event (2.x, fired once).
watch(
    shouldLoad,
    (load) => {
        if (!load) {
            return;
        }
        sticky.value = true;
        if (!appended) {
            appended = true;
            runtime.emit('afterAppendSlide', { index: props.index });
            if (runtime.settings.value.captionPosition === 'slide') {
                runtime.emit('afterAppendSubHtml', { index: props.index });
            }
        }
    },
    { immediate: true },
);

const slideType = computed(() =>
    props.item ? getSlideType(props.item) : 'image',
);

/**
 * Slide content resolved through the plugin runtime (ADR §5): the first
 * plugin slide renderer that owns the item wins (video); otherwise the
 * built-in image renderer; then every plugin `slideWrapper` wraps the
 * result, first plugin outermost (2.x DOM order) — the direct Vue
 * expression of the React runtime's reduceRight.
 */
const SlideContent = (): VNodeChild => {
    const item = props.item;
    if (!item) {
        return null;
    }
    let content: VNodeChild = null;
    const registered = runtime.plugins.value;
    const renderer = registered.find((plugin) =>
        plugin.slideRenderer?.canRender(item),
    )?.slideRenderer;
    if (renderer) {
        content = h(renderer.component, {
            item,
            index: props.index,
        });
    } else if (slideType.value === 'image') {
        content = h(LgImageSlide, {
            item,
            index: props.index,
            onMediaLoad: onLoad,
            onMediaError: onError,
        });
    }
    // Video/iframe items render nothing without their plugin.
    return registered.reduceRight((acc, plugin) => {
        const Wrapper = plugin.slots?.slideWrapper;
        return Wrapper
            ? h(
                  Wrapper,
                  {
                      item,
                      index: props.index,
                      isCurrent: isCurrent.value,
                  },
                  { default: () => acc },
              )
            : acc;
    }, content);
};
const renderContent = computed(
    () => shouldLoad.value && !!props.item && !error.value,
);
const captionInSlide = computed(
    () =>
        runtime.settings.value.captionPosition === 'slide' &&
        shouldLoad.value &&
        !!props.item,
);

function onLoad(): void {
    if (store.loadedSlides.value.has(props.index)) {
        return;
    }
    const isFirstSlide = !store.galleryOn.value;
    store.dispatch({ type: 'SLIDE_LOADED', index: props.index });
    const settings = runtime.settings.value;
    runtime.emit('slideItemLoad', {
        index: props.index,
        delay: isFirstSlide
            ? (settings.zoomFromOrigin
                  ? settings.startAnimationDuration
                  : settings.backdropDuration) + 10
            : 0,
        isFirstSlide,
    });
}

function onError(): void {
    error.value = true;
    store.dispatch({ type: 'SLIDE_ERROR', index: props.index });
}

const classes = computed(() => ({
    'lg-item': true,
    'lg-current': props.isShown,
    'lg-prev-slide': props.position === 'prev',
    'lg-next-slide': props.position === 'next',
    'lg-slide-progress': props.inProgress,
    'lg-loaded': shouldLoad.value,
    'lg-complete': completed.value,
    'lg-complete_': completed.value,
    'lg-start-progress':
        !!props.originAnim &&
        props.originAnim.stage !== 'init' &&
        !props.originAnim.closing,
    'lg-start-end-progress':
        !!props.originAnim && props.originAnim.stage !== 'init',
}));

const style = computed(() => {
    const anim = props.originAnim;
    if (!anim) {
        return undefined;
    }
    if (anim.stage === 'init') {
        return { transform: anim.transform };
    }
    return {
        transform:
            anim.stage === 'run' && !anim.closing
                ? 'translate3d(0, 0, 0)'
                : anim.transform,
        transitionDuration: `${runtime.settings.value.startAnimationDuration}ms`,
    };
});
</script>

<template>
    <div :class="classes" :style="style">
        <SlideContent v-if="renderContent" />
        <span v-if="error" class="lg-error-msg">{{
            runtime.settings.value.strings.mediaLoadingFailed
        }}</span>
        <div v-if="captionInSlide" class="lg-sub-html">
            <LgCaptionContent :item="props.item" :index="props.index" />
        </div>
    </div>
</template>
