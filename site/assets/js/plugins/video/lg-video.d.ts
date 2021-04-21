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
 * https://wistia.com/support/embed-and-share/sharing-videos
 * https://private-sharing.wistia.com/medias/mwhrulrucj
 *
 * @ref Youtube
 * https://developers.google.com/youtube/player_parameters#enablejsapi
 * https://developers.google.com/youtube/iframe_api_reference
 *
 */
import { LightGallery } from '../../lightgallery';
import { lgQuery } from '../../lgQuery';
import { CustomEventHasVideo } from '../../types';
import { VideoSource } from './types';
declare global {
    interface Window {
        _wq: any;
        Vimeo: any;
    }
}
export default class Video {
    private core;
    private settings;
    constructor(instance: LightGallery);
    init(): void;
    /**
     * @desc Event triggered when video url or poster found
     * Append video HTML is poster is not given
     * Play if autoplayFirstVideo is true
     *
     * @param {Event} event - Javascript Event object.
     */
    onHasVideo(event: CustomEventHasVideo): void;
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
    getVideoHtml(src: any, addClass: any, index: number, html5Video: VideoSource): string;
    /**
     * @desc - Append videos to the slide
     *
     * @param {HTMLElement} el - slide element
     * @param {Object} videoParams - Video parameters, Contains src, class, index, htmlVideo
     */
    appendVideos(el: lgQuery, videoParams: {
        src: string;
        addClass: string;
        index: number;
        html5Video: any;
    }): any;
    gotoNextSlideOnVideoEnd(src: any, index: number): void;
    controlVideo(index: number, action: string): void;
    loadVideoOnPosterClick($el: lgQuery): void;
    onVideoLoadAfterPosterClick($el: lgQuery, index: number): void;
    destroy(): void;
}
