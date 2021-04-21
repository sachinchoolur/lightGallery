export interface ThumbnailsSettings {
    /**
     * Enable thumbnails for the gallery
     */
    thumbnail: boolean;
    animateThumb: boolean;
    /**
     * Position of selected thumbnail.
     */
    currentPagerPosition: 'left' | 'middle' | 'right';
    /**
     * Position of thumbnails.
     */
    alignThumbnails: 'left' | 'middle' | 'right';
    /**
     * Width of each thumbnails.
     */
    thumbWidth: number;
    /**
     * Height of each thumbnails. Applicable only if animateThumb is false.
     */
    thumbHeight: string;
    /**
     * Spacing between each thumbnails
     */
    thumbMargin: number;
    /**
     * control where the thumbnails should be appended.
     * By default, thumbnails are appended to '.lg-components' which has inbuilt open close transitions
     * If you don't want initial thumbnails transitions, or want to do more customization,
     * you can append thumbnails to the lightGalley outer div -
     * <a href="/demos/thumbnails/#static-thumbnails">Demo</a>
     */
    appendThumbnailsTo: '.lg-outer' | '.lg-components';
    /**
     * Enable toggle captions and thumbnails.
     * @description not applicable if allowMediaOverlap is false
     */
    toggleThumb: boolean;
    /**
     * Enables desktop mouse drag support for thumbnails.
     */
    enableThumbDrag: boolean;
    /**
     * Enables thumbnail touch/swipe support for touch devices
     */
    enableThumbSwipe: boolean;
    /**
     * By setting the swipeThreshold (in px) you can set how far the user must swipe for the next/prev slide.
     */
    swipeThreshold: number;
    /**
     * You can automatically load thumbnails for YouTube videos from YouTube by setting loadYouTubeThumbnail true
     */
    loadYouTubeThumbnail: boolean;
    /**
     * You can specify the thumbnail size by setting respective number.
     */
    youTubeThumbSize: number;
}
export declare const thumbnailsSettings: ThumbnailsSettings;
