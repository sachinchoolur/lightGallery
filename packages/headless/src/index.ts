/**
 * Framework-free core logic for lightGallery. Nothing in this package may
 * import a framework or the DOM — the tsconfig excludes the DOM lib so
 * `window`/`document` do not typecheck here by construction.
 */

export {
    createGalleryState,
    galleryReducer,
    type CreateGalleryStateOptions,
    type GalleryAction,
    type GalleryState,
    type SlideDirection,
} from './state';

export {
    getSlideType,
    type GalleryItem,
    type ImageSources,
    type SlideType,
} from './items';

export {
    coreSettingsDefaults,
    resolveSettings,
    type CaptionPosition,
    type CoreSettings,
    type GalleryCoreStrings,
    type GalleryMode,
    type MobileSettings,
    type ResolveSettingsOptions,
    type UserSettings,
} from './settings';

export { getPreloadIndexes, getSlideIndexesInDom } from './preload';

export {
    FLICK_MIN_DISTANCE,
    FLICK_VELOCITY,
    SWIPE_AXIS_THRESHOLD,
    VERTICAL_CLOSE_THRESHOLD,
    getHorizontalDragTransforms,
    getSwipeAxis,
    getSwipeReleaseVerdict,
    getVerticalDragEffects,
    removePointer,
    resolveSwipeTarget,
    shouldCloseOnVerticalDrag,
    upsertPointer,
    type HorizontalDragTransforms,
    type PointerRecord,
    type SwipeAxis,
    type SwipeReleaseInput,
    type SwipeReleaseVerdict,
    type VerticalDragEffects,
} from './gestures';

export {
    fitImageSize,
    getOriginTransform,
    parseImageSize,
    type ImageSize,
    type OriginTransformInput,
    type RectLike,
} from './origin';

/**
 * Clamp a slide index into the valid range for a gallery of `length` slides.
 * With `loop`, out-of-range indexes wrap around; without it they clamp to the
 * nearest bound. An empty gallery always resolves to 0.
 */
export function clampIndex(
    index: number,
    length: number,
    loop: boolean,
): number {
    if (length <= 0) {
        return 0;
    }
    if (loop) {
        return ((index % length) + length) % length;
    }
    return Math.min(Math.max(index, 0), length - 1);
}
