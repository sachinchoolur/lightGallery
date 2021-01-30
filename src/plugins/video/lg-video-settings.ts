export interface VideoDefaults {
    /**
     * Set limit for video maximal width.
     */
    videoMaxWidth: string;

    /**
     * Enable/DIsable first video autoplay.
     * @description Autoplay has to be managed using this setting.
     * Autoplay in PlayerParams doesn't have any effect.
     */
    autoplayFirstVideo: boolean;

    /**
     * Change YouTube player parameters.
     * @link https://developers.google.com/youtube/player_parameters
     * @example
     * ```js
     * lightGallery(document.getElementById('lightGallery'), {
     *     youTubePlayerParams: {
     *         modestbranding : 1,
     *         showinfo : 0,
     *         controls : 0
     *     }
     * })
     * ```
     */
    youTubePlayerParams: any;

    /**
     * Change Vimeo player parameters.
     * @link https://developer.vimeo.com/player/embedding#universal-parameters
     * @example
     * ```js
     * lightGallery(document.getElementById('lightGallery'), {
     *     vimeoPlayerParams: {
     *         byline : 0,
     *         portrait : 0,
     *         color : 'CCCCCC'
     *     }
     * })
     * ```
     */
    vimeoPlayerParams: any;

    /**
     * Change Vimeo player parameters.
     * @link https://wistia.com/support/developers/embed-options#using-embed-options
     */
    wistiaPlayerParams: any;

    /**
     * Go to next slide when video is ended
     */
    gotoNextSlideOnVideoEnd: boolean;

    /**
     * Autoplay video on slide change
     * @description Make sure you set preload:"none"
     */
    autoplayVideoOnSlide: boolean;

    /**
     * Enbale videojs custom video player
     */
    videojs: boolean;

    /**
     * Videojs player options
     */
    videojsOptions: any;
}
export const videoDefaults: VideoDefaults = {
    videoMaxWidth: '1200px',
    autoplayFirstVideo: true,
    youTubePlayerParams: false,
    vimeoPlayerParams: false,
    wistiaPlayerParams: false,
    gotoNextSlideOnVideoEnd: true,
    autoplayVideoOnSlide: false,
    videojs: false,
    videojsOptions: {},
};
