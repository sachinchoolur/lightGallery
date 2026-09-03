export { LightGallery } from './LightGallery';
export { LightGalleryItem } from './LightGalleryItem';
export type { LightGalleryItemProps } from './LightGalleryItem';
export type {
    GalleryItem,
    InitDetail,
    LightGalleryCallbacks,
    LightGalleryProps,
    LightGalleryRefHandle,
    RenderSlots,
    SlideEventDetail,
    SlideItemLoadDetail,
} from './types';
export type { LgIconName } from './icons';
// Plugin-authoring surface (custom plugins / slideRenderer recipes) —
// vue and angular export their equivalents from the root barrel too.
export type {
    LgPlugin,
    LgPluginSlots,
    PluginContext,
    PluginSlotProps,
    SlideWrapperProps,
} from './plugins/types';
