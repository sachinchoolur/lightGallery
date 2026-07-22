/** Public API surface of @lightgallery/vue. */
export { default as LightGallery } from './LightGallery.vue';
export type { LgGalleryItem } from './LightGallery.vue';
export {
    createGalleryStore,
    LG_ACTIONS,
    LG_STORE,
    type GalleryStore,
    type LgGalleryActions,
} from './store';
