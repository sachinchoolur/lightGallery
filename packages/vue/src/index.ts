/** Public API surface of @lightgallery/vue. */
export { default as LightGallery } from './LightGallery.vue';
export { default as LgItem } from './LgItem.vue';
export { default as LgSlide } from './LgSlide.vue';
export type { OriginAnimation } from './LgSlide.vue';
export { default as LgImageSlide } from './LgImageSlide.vue';
export { default as LgCaption } from './LgCaption.vue';
export { LgCaptionContent } from './caption-content';
export {
    createGalleryStore,
    LG_ACTIONS,
    LG_STORE,
    type GalleryStore,
    type LgGalleryActions,
} from './store';
export {
    LG_RUNTIME,
    LG_SLOTS,
    type LgGalleryRuntime,
    type LgItemRegistration,
} from './runtime';
export type {
    HasVideoDetail,
    InitDetail,
    LgEventMap,
    LgGalleryItem,
    LgGalleryProps,
    SlideEventDetail,
    SlideItemLoadDetail,
} from './types';
export {
    dedupePlugins,
    LG_PLUGIN_CONTEXT,
    type LgMediaPosition,
    type LgPluginContext,
    type LgPluginLayout,
    type LgPluginRefs,
    type LgPluginSlots,
    type LgSlideRenderer,
    type LgVuePlugin,
    type ResolvedPluginSettings,
} from './plugins/types';
