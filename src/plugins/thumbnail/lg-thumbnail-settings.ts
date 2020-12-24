export interface ThumbnailsDefaults {
    thumbnail: boolean;

    animateThumb: boolean;
    currentPagerPosition: string;

    thumbWidth: number;
    thumbHeight: string;
    thumbContHeight: number;
    thumbMargin: number;

    exThumbImage: false;
    showThumbByDefault: boolean;
    toggleThumb: boolean;
    pullCaptionUp: boolean;

    enableThumbDrag: boolean;
    enableThumbSwipe: boolean;
    swipeThreshold: number;

    loadYoutubeThumbnail: boolean;
    youtubeThumbSize: number;

    loadVimeoThumbnail: boolean;
    vimeoThumbSize: string;

    loadDailymotionThumbnail: boolean;
}

export const thumbnailsDefaults: ThumbnailsDefaults = {
    thumbnail: true,

    animateThumb: true,
    currentPagerPosition: 'middle',

    thumbWidth: 100,
    thumbHeight: '80px',
    thumbContHeight: 100,
    thumbMargin: 5,

    exThumbImage: false,
    showThumbByDefault: true,
    toggleThumb: true,
    pullCaptionUp: true,

    enableThumbDrag: true,
    enableThumbSwipe: true,
    swipeThreshold: 10,

    loadYoutubeThumbnail: true,
    youtubeThumbSize: 1,

    loadVimeoThumbnail: true,
    vimeoThumbSize: 'thumbnail_small',

    loadDailymotionThumbnail: true,
};
