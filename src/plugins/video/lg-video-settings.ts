import { PlayerParams } from '@lightgallery/headless';

export interface VideoSettings {
    /**
     * Enable/DIsable first video autoplay.
     * @description Autoplay has to be managed using this setting.
     * Autoplay in PlayerParams doesn't have any effect.
     */
    autoplayFirstVideo: boolean;

    /**
     * Render provider video slides (YouTube/Vimeo/Wistia) as lite facades:
     * a poster with a play button, with the provider iframe created only
     * when the user presses play.
     * @description The facade poster falls back from the item poster to
     * the YouTube thumbnail endpoint (see loadYouTubePoster) to the item
     * thumb; a slide with no resolvable poster keeps the previous
     * eager-iframe behavior. Note autoplayFirstVideo/autoplayVideoOnSlide
     * force an immediate materialize by design. Set false for 2.x
     * eager-iframe behavior on all provider slides.
     * See <a href="/docs/video-facades/">Video facades</a>.
     * @version V3.0.0
     */
    videoFacade: boolean;

    /**
     * Embed YouTube videos through the privacy-enhanced
     * youtube-nocookie.com host.
     * @description Set false to embed through youtube.com instead. Slide
     * URLs that already point at youtube-nocookie.com always keep it.
     * See <a href="/docs/video-facades/">Video facades</a>.
     * @version V3.0.0
     */
    youTubeNoCookie: boolean;

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
     *     <b>Dependency</b> - You need to include <a href="https://videojs.com/">videoJs</a> on your document to enable videojs player
     * </div>
     */
    videojs: boolean;

    /**
     * Class name of the videojs theme
     * You need to include the theme stylesheet on your document. <a href="https://videojs.com/getting-started/#home-page-themes" target="_blank">More info</a>
     * @version V2.5.0
     */
    videojsTheme: string;

    /**
     * Videojs player options
     */
    videojsOptions: any;
}
export const videoSettings: VideoSettings = {
    autoplayFirstVideo: true,
    videoFacade: true,
    youTubeNoCookie: true,
    youTubePlayerParams: false,
    vimeoPlayerParams: false,
    wistiaPlayerParams: false,
    gotoNextSlideOnVideoEnd: true,
    autoplayVideoOnSlide: false,
    videojs: false,
    videojsTheme: '',
    videojsOptions: {},
};
