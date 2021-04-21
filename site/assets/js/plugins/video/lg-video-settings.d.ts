export interface VideoSettings {
    /**
     * Enable/DIsable first video autoplay.
     * @description Autoplay has to be managed using this setting.
     * Autoplay in PlayerParams doesn't have any effect.
     */
    autoplayFirstVideo: boolean;
    /**
     * Change YouTube player parameters.
     * <a href="https://developers.google.com/youtube/player_parameters">YouTube player parameters</a>
     * @example
     * lightGallery(document.getElementById('lightGallery'), {
     *     youTubePlayerParams: {
     *         modestbranding : 1,
     *         showinfo : 0,
     *         controls : 0
     *     }
     * })
     */
    youTubePlayerParams: any;
    /**
     * Change Vimeo player parameters.
     * <a href="https://developer.vimeo.com/player/embedding#universal-parameters">Vimeo player parameters</a>
     * @example
     * lightGallery(document.getElementById('lightGallery'), {
     *     vimeoPlayerParams: {
     *         byline : 0,
     *         portrait : 0,
     *         color : 'CCCCCC'
     *     }
     * })
     */
    vimeoPlayerParams: any;
    /**
     * Change Vimeo player parameters.
     * @link https://wistia.com/support/developers/embed-options#using-embed-options
     */
    wistiaPlayerParams: any;
    /**
     * Go to next slide when video is ended
     * Note - this doesn't work with YouTube videos at the moment
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
export declare const videoSettings: VideoSettings;
