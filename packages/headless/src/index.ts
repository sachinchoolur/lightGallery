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

export { createEmitter, type TypedEmitter } from './emitter';

export {
    formatSlideAnnouncement,
    type SlideAnnouncementOptions,
} from './announce';

export {
    createHashDriver,
    createHistoryHashDriver,
    createNavigationHashDriver,
    type HashDriver,
    type HashDriverPreference,
    type HashHistoryWindow,
    type HashNavigationWindow,
    type NavigationLike,
} from './hash-driver';

export {
    coreSettingsDefaults,
    resolveSettings,
    type CaptionPosition,
    type GalleryDirection,
    type ResolvedGalleryDirection,
    type CoreSettings,
    type GalleryCoreStrings,
    type GalleryMode,
    type MobileSettings,
    type ResolveSettingsOptions,
    type UserSettings,
    type VirtualizationSettings,
} from './settings';

export {
    getPreloadIndexes,
    getSlideIndexesInDom,
    getSlidePoolIndexes,
} from './preload';

export {
    FLICK_MIN_DISTANCE,
    FLICK_VELOCITY,
    SLIDE_EDGE_FRICTION,
    SWIPE_AXIS_THRESHOLD,
    VERTICAL_CLOSE_MIN_DRAG,
    VERTICAL_CLOSE_RATIO,
    VERTICAL_CLOSE_THRESHOLD,
    getEdgeFrictionedDelta,
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

export {
    autoplayDefaultIcons,
    type LgIconName,
    commentDefaultIcons,
    coreDefaultIcons,
    fullscreenDefaultIcons,
    rotateDefaultIcons,
    shareDefaultIcons,
    thumbnailDefaultIcons,
    zoomDefaultIcons,
} from './icons';

export {
    VIMEO_PLAYER_SCRIPT_URL,
    WISTIA_PLAYER_SCRIPT_URL,
    getFacadePoster,
    getVideoInfo,
    getVimeoEmbedUrl,
    getWistiaEmbedUrl,
    getYouTubeEmbedUrl,
    getYouTubePosterUrl,
    isYouTubeNoCookie,
    param,
    paramsToObject,
    type PlayerParams,
    type VideoInfo,
} from './video-urls';

export {
    PINCH_OVER_FRICTION,
    PINCH_UNDER_FRICTION,
    clampPan,
    clampPanToStage,
    clampScale,
    getActualSizeScale,
    getPanBounds,
    getPinchPan,
    getPinchScale,
    getPointZoomPan,
    getPointerDistance,
    shouldCloseOnPinch,
    type PanBounds,
    type ZoomPan,
} from './zoom-math';

export {
    clampThumbTranslate,
    getActiveThumbTranslate,
    getElasticThumbTranslate,
    getScrubThumbIndex,
    getScrubThumbTranslate,
    getThumbCorridorWindow,
    getThumbTotalWidth,
    getThumbWindow,
    type ThumbPagerPosition,
    type ThumbWindow,
} from './thumb-math';
export {
    getJustifiedLayout,
    type JustifiedBox,
    type JustifiedLayout,
    type JustifiedLayoutOptions,
} from './justified-layout';

export {
    onTransitionSettle,
    type TransitionSettleEvent,
    type TransitionSettleTarget,
} from './transition';

export {
    DECODE_TIMEOUT_MS,
    awaitDecode,
    getActualSizeWidth,
    matchesMedia,
    parseSrcset,
    resolveImageSource,
    resolveSizes,
    type ResolvedImageSource,
    type SrcsetCandidate,
    type Viewport,
} from './responsive';

export {
    DECELERATION_RATE,
    SPRING_BOUNCE_DAMPING,
    SPRING_NATURAL_FREQUENCY,
    SPRING_SETTLE_DAMPING,
    isSpringSettled,
    project,
    stepSpring,
    type SpringConfig,
    type SpringState,
} from './spring';

export {
    VELOCITY_WINDOW_MS,
    getWindowedVelocity,
    pushVelocitySample,
    type Velocity,
    type VelocitySample,
} from './velocity';

export {
    applyZoom,
    flipHorizontal,
    flipVertical,
    getRotateFitScale,
    getRotateTransform,
    getRotatedVisualSize,
    isOrientationSwapped,
    initialAutoplaySlice,
    initialRotateSlice,
    initialZoomSlice,
    rotateLeft,
    rotateRight,
    type AutoplaySlice,
    type RotateSlice,
    type ZoomSlice,
} from './plugin-slices';

export {
    canNativeShare,
    getFacebookShareLink,
    getPinterestShareLink,
    getSharePayload,
    getTwitterShareLink,
    getXShareLink,
    type NativeShareNavigator,
    type ShareItemFields,
    type SharePayload,
} from './share-urls';

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
