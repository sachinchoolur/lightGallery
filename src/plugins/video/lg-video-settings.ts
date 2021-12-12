import { PlayerParams } from './lg-video-utils';

export interface VideoSettings {
    /**
     * Enable/DIsable first video autoplay.
     * @description Autoplay has to be managed using this setting.
     * Autoplay in PlayerParams doesn't have any effect.
     */
    autoplayFirstVideo: boolean;

    /**
     * Change YouTube player parameters.
     * You can find the list of YouTube player parameters from the following link
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
     * You can find the list of vimeo player parameters from the following link
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
    vimeoPlayerParams: PlayerParams;

    /**
     * Change Wistia player parameters.
     * You can find the list of Wistia player parameters from the following link
     * <a href="https://wistia.com/support/developers/embed-options#using-embed-options">Vimeo player parameters</a>
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
     * <div class="alert alert-info" role="alert">
     *     <b>Dependency</b> - You need to include <a href="https://videojs.com/">videoJs</div> on your document to enable videojs player
     * </div>
     */
    videojs: boolean;

    /**
     * Videojs player options
     */
    videojsOptions: any;
}
export const videoSettings: VideoSettings = {
    autoplayFirstVideo: true,
    youTubePlayerParams: false,
    vimeoPlayerParams: false,
    wistiaPlayerParams: false,
    gotoNextSlideOnVideoEnd: true,
    autoplayVideoOnSlide: false,
    videojs: false,
    videojsOptions: {},
};
