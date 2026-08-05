<script setup lang="ts">
/**
 * One `.lg-item`. Content mounts lazily (2.x parity): the current slide
 * loads immediately; neighbors within `preload` load once the current
 * slide's media completes; once loaded, a slide keeps its content for as
 * long as it stays in the DOM window. The vanilla CSS shows the loading
 * spinner until `lg-complete` lands.
 */
import {
    computed,
    h,
    inject,
    onUnmounted,
    ref,
    watch,
    type VNodeChild,
} from 'vue';
import {
    awaitDecode,
    getPreloadIndexes,
    getSlideType,
} from '@lightgallery/headless';

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

const isCurrent = computed(() => store.currentIndex.value === props.index);
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
    // Sticky content survives `isOpen` flipping false at close-START:
    // the close flight animates this slide back to the thumbnail, and an
    // open-gated unmount would fly an EMPTY item (invisible close).
    // Teardown belongs to the item's own unmount once the close settles
    // (the phase-gated v-for) — the moment 2.x empties `$inner`.
    if (sticky.value) {
        return true;
    }
    if (!store.isOpen.value) {
        return false;
    }
    const currentLoaded = store.loadedSlides.value.has(
        store.currentIndex.value,
    );
    return isCurrent.value || (currentLoaded && inPreloadRange.value);
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

// 2.x first-slide dummy (`getDummyImageContent`): while the
// zoom-from-origin flight runs, the trigger's already-decoded thumbnail
// flies enlarged in place of the still-loading image; the real image
// mounts only once the flight lands and the dummy drops shortly after
// the load settles (`loadContentOnFirstSlideLoad`). The arming watch is
// pre-flush so the dummy is in the flight's first painted frame.
const dummySrc = ref<string | null>(null);
let dummyDone = false;
let dummyDropTimer: ReturnType<typeof setTimeout> | null = null;
watch(
    () => props.originAnim,
    (anim) => {
        if (
            dummyDone ||
            dummySrc.value ||
            !anim ||
            anim.closing ||
            completed.value ||
            slideType.value !== 'image'
        ) {
            return;
        }
        const src = runtime.getDummySrc(props.index);
        if (src) {
            dummySrc.value = src;
            runtime.firstSlideLoading.value = true;
        } else {
            dummyDone = true;
        }
    },
    { flush: 'pre' },
);
watch([dummySrc, completed], ([src, isComplete]) => {
    if (!src || !isComplete) {
        return;
    }
    dummyDropTimer = setTimeout(() => {
        dummyDone = true;
        dummySrc.value = null;
        runtime.firstSlideLoading.value = false;
    }, 300);
});
let unmounted = false;
onUnmounted(() => {
    unmounted = true;
    if (dummyDropTimer !== null) {
        clearTimeout(dummyDropTimer);
    }
    if (dummySrc.value) {
        runtime.firstSlideLoading.value = false;
    }
});
// v2 mounts the real image only once the flight lands
// (startAnimationDuration + 100): its fetch and decode must never jank
// the flight's frames.
const deferSrc = computed(
    () => !!dummySrc.value && !!props.originAnim && !props.originAnim.closing,
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
            dummySrc: dummySrc.value,
            deferSrc: deferSrc.value,
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

function onLoad(event?: Event): void {
    if (store.loadedSlides.value.has(props.index)) {
        return;
    }
    const isFirstSlide = !store.galleryOn.value;
    const complete = (): void => {
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
    };
    // Decode gate: `lg-complete` flips only once the browser can paint
    // the FULL image — a loaded-but-undecoded flip paints partially on
    // slow devices. Synchronous when `decode()` is unavailable (the
    // load event already fired); the timeout fallback keeps a stalling
    // decode from stranding the spinner.
    const target = event?.currentTarget ?? event?.target;
    if (
        target instanceof HTMLImageElement &&
        typeof target.decode === 'function'
    ) {
        void awaitDecode(target).then(() => {
            if (!unmounted) {
                complete();
            }
        });
        return;
    }
    complete();
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
    'lg-first-slide': !!dummySrc.value,
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
        return {
            transform: anim.transform,
            // The origin transform must LAND, never animate: measuring
            // (computeOrigin) forces a recalc that baselines the item at
            // identity, and the `:not(.lg-start-end-progress)` inherit
            // rule would transition identity → origin — a visible
            // fullscreen→thumbnail shrink before the flight.
            transitionProperty: 'none',
        };
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
