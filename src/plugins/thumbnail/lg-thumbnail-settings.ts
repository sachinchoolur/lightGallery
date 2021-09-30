export interface ThumbnailsSettings {
    /**
     * Enable thumbnails for the gallery
     */
    thumbnail: boolean;

    /*
     * Enable thumbnail animation.
     */
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
     * Height of each thumbnails.
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
     * By setting the thumbnailSwipeThreshold (in px) you can set how far the user must swipe for the next/prev slide.
     */
    thumbnailSwipeThreshold: number;

    /**
     * You can automatically load thumbnails for YouTube videos from YouTube by setting loadYouTubeThumbnail true
     */
    loadYouTubeThumbnail: boolean;

    /**
     * You can specify the thumbnail size by setting respective number.
     */
    //@todo add demo
    youTubeThumbSize: number;

    /**
     * Custom translation strings for aria-labels
     */
    thumbnailPluginStrings: { [key: string]: string };
}

export const thumbnailsSettings: ThumbnailsSettings = {
    thumbnail: true,

    animateThumb: true,
    currentPagerPosition: 'middle',
    alignThumbnails: 'middle',

    thumbWidth: 100,
    thumbHeight: '80px',
    thumbMargin: 5,

    appendThumbnailsTo: '.lg-components',
    toggleThumb: false,

    enableThumbDrag: true,
    enableThumbSwipe: true,
    thumbnailSwipeThreshold: 10,

    loadYouTubeThumbnail: true,
    youTubeThumbSize: 1,

    thumbnailPluginStrings: { toggleThumbnails: 'Toggle thumbnails' },
};
