/**
 * Video module for lightGallery
 * Supports HTML5, YouTube, Vimeo, wistia videos
 *
 *
 * @ref Wistia
 * https://wistia.com/support/integrations/wordpress(How to get url)
 * https://wistia.com/support/developers/embed-options#using-embed-options
 * https://wistia.com/support/developers/player-api
 * https://wistia.com/support/developers/construct-an-embed-code
 * http://jsfiddle.net/xvnm7xLm/
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
 *
 * @ref Youtube
 * https://developers.google.com/youtube/player_parameters#enablejsapi
 * https://developers.google.com/youtube/iframe_api_reference
 *
 */
import { LightGallery } from '../../lightgallery';
import { lgQuery } from '../../lgQuery';
import { CustomEventHasVideo } from '../../types';
declare global {
    interface Window {
        _wq: any;
        Vimeo: any;
    }
}
declare global {
    interface Window {
        LG: (selector: any) => lgQuery;
    }
}
export declare class Video {
    private core;
    private s;
    constructor(instance: LightGallery);
    init(): void;
    /**
     * @desc Event triggered when video url or poster found
     * Append video HTML is poster is not given
     * Play if autoplayFirstVideo is true
     *
     * @param {Event} event - Javascript Event object.
     * @param {number} index - Current index of the slide
     * @param {string} src - src of the video
     * @param {string} html - HTML5 video
     */
    onHasVideo(event: CustomEventHasVideo): void;
    /**
     * @desc Fired when the slide content has been inserted into its slide container.
     * Set max width for video
     *
     * @param {Event} event - Javascript Event object.
     * @param {number} index - Current index of the slide
     */
    onAferAppendSlide(event: CustomEvent): void;
    /**
     * @desc fired immediately before each slide transition.
     * Pause the previous video
     * Hide the download button if the slide contains YouTube, Vimeo, or Wistia videos.
     *
     * @param {Event} event - Javascript Event object.
     * @param {number} prevIndex - Previous index of the slide.
     * @param {number} index - Current index of the slide
     */
    onBeforeSlide(event: CustomEvent): void;
    /**
     * @desc fired immediately after each slide transition.
     * Play video if autoplayVideoOnSlide option is enabled.
     *
     * @param {Event} event - Javascript Event object.
     * @param {number} prevIndex - Previous index of the slide.
     * @param {number} index - Current index of the slide
     */
    onAfterSlide(event: CustomEvent): void;
    /**
     * Play HTML5, Youtube, Vimeo or Wistia videos in a particular slide.
     * @param {number} index - Index of the slide
     */
    playVideo(index: number): void;
    /**
     * Pause HTML5, Youtube, Vimeo or Wistia videos in a particular slide.
     * @param {number} index - Index of the slide
     */
    pauseVideo(index: number): void;
    getVideoHtml(src: any, addClass: any, index: number, html5Video: {
        source: string | any[];
        [key: string]: any;
    }): string;
    /**
     * @desc - Append videos to the slide
     *
     * @param {HTMLElement} el - slide element
     * @param {Object} videoParams - Video parameters, Contains src, class, index, htmlVideo
     */
    appendVideos(el: lgQuery, videoParams: {
        src: any;
        addClass: any;
        index: any;
        html5Video: any;
    }): void;
    gotoNextSlideOnVideoEnd(src: any, index: number): void;
    controlVideo(index: number, action: string): void;
    loadVideoOnPosterClick($el: lgQuery): void;
    destroy(clear?: boolean): void;
}
