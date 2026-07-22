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
