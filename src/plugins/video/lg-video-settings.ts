export interface VideoDefaults {
    videoMaxWidth: string;
    autoplayFirstVideo: boolean;
    youtubePlayerParams: any;
    vimeoPlayerParams: any;
    wistiaPlayerParams: any;
    gotoNextSlideOnVideoEnd: boolean;
    autoplayVideoOnSlide: boolean;
    videojs: boolean;
    videojsOptions: any;
}
export const videoDefaults: VideoDefaults = {
    videoMaxWidth: '855px',

    autoplayFirstVideo: true,

    youtubePlayerParams: false,
    vimeoPlayerParams: false,
    wistiaPlayerParams: false,
    gotoNextSlideOnVideoEnd: true,
    autoplayVideoOnSlide: false, // Make sure you set preload:"none"

    videojs: false,
    videojsOptions: {},
};
