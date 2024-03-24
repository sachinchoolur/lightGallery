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
 * https://developer.chrome.com/blog/autoplay/#iframe-delegation
 *
 * @ref Vimeo
 * https://stackoverflow.com/questions/10488943/easy-way-to-get-vimeo-id-from-a-vimeo-url
 * https://vimeo.zendesk.com/hc/en-us/articles/360000121668-Starting-playback-at-a-specific-timecode
 * https://vimeo.zendesk.com/hc/en-us/articles/360001494447-Using-Player-Parameters
 */

import { VideoSettings, videoSettings } from './lg-video-settings';
import { LightGallery } from '../../lightgallery';
import { lgQuery } from '../../lgQuery';
import {
    CustomEventAfterSlide,
    CustomEventHasVideo,
    CustomEventSlideItemLoad,
    VideoInfo,
} from '../../types';
import { lGEvents } from '../../lg-events';
import { VideoSource } from './types';
import {
    getVimeoURLParams,
    getYouTubeParams,
    isYouTubeNoCookie,
    param,
} from './lg-video-utils';

declare let Vimeo: any;
declare let videojs: any;
declare global {
    interface Window {
        _wq: any;
        Vimeo: any;
    }
}
export default class Video {
    private core: LightGallery;
    private settings: VideoSettings;
    constructor(instance: LightGallery) {
        // get lightGallery core plugin instance
        this.core = instance;
        this.settings = { ...videoSettings, ...this.core.settings };

        return this;
    }
    init() {
        /**
         * Event triggered when video url found without poster
         * Append video HTML
         * Play if autoplayFirstVideo is true
         */
        this.core.LGel.on(
            `${lGEvents.hasVideo}.video`,
            this.onHasVideo.bind(this),
        );

        this.core.LGel.on(`${lGEvents.posterClick}.video`, () => {
            const $el = this.core.getSlideItem(this.core.index);
            this.loadVideoOnPosterClick($el);
        });
        this.core.LGel.on(
            `${lGEvents.slideItemLoad}.video`,
            this.onSlideItemLoad.bind(this),
        );

        // @desc fired immediately before each slide transition.
        this.core.LGel.on(
            `${lGEvents.beforeSlide}.video`,
            this.onBeforeSlide.bind(this),
        );

        // @desc fired immediately after each slide transition.
        this.core.LGel.on(
            `${lGEvents.afterSlide}.video`,
            this.onAfterSlide.bind(this),
        );
    }

    /**
     * @desc Event triggered when a slide is completely loaded
     *
     * @param {Event} event - lightGalley custom event
     */
    onSlideItemLoad(event: CustomEventSlideItemLoad): void {
        const { isFirstSlide, index } = event.detail;

        // Should check the active slide as well as user may have moved to different slide before the first slide is loaded
        if (
            this.settings.autoplayFirstVideo &&
            isFirstSlide &&
            index === this.core.index
        ) {
            // Delay is just for the transition effect on video load
            setTimeout(() => {
                this.loadAndPlayVideo(index);
            }, 200);
        }

        // Should not call on first slide. should check only if the slide is active
        if (
            !isFirstSlide &&
            this.settings.autoplayVideoOnSlide &&
            index === this.core.index
        ) {
            this.loadAndPlayVideo(index);
        }
    }

    /**
     * @desc Event triggered when video url or poster found
     * Append video HTML is poster is not given
     * Play if autoplayFirstVideo is true
     *
     * @param {Event} event - Javascript Event object.
     */
    onHasVideo(event: CustomEventHasVideo): void {
        const { index, src, html5Video, hasPoster } = event.detail;
        if (!hasPoster) {
            // All functions are called separately if poster exist in loadVideoOnPosterClick function

            this.appendVideos(this.core.getSlideItem(index), {
                src,
                addClass: 'lg-object',
                index,
                html5Video,
            });

            // Automatically navigate to next slide once video reaches the end.
            this.gotoNextSlideOnVideoEnd(src, index);
        }
    }

    /**
     * @desc fired immediately before each slide transition.
     * Pause the previous video
     * Hide the download button if the slide contains YouTube, Vimeo, or Wistia videos.
     *
     * @param {Event} event - Javascript Event object.
     * @param {number} prevIndex - Previous index of the slide.
     * @param {number} index - Current index of the slide
     */
    onBeforeSlide(event: CustomEvent): void {
        if (this.core.lGalleryOn) {
            const { prevIndex } = event.detail;
            this.pauseVideo(prevIndex);
        }
    }

    /**
     * @desc fired immediately after each slide transition.
     * Play video if autoplayVideoOnSlide option is enabled.
     *
     * @param {Event} event - Javascript Event object.
     * @param {number} prevIndex - Previous index of the slide.
     * @param {number} index - Current index of the slide
     * @todo should check on onSlideLoad as well if video is not loaded on after slide
     */
    onAfterSlide(event: CustomEventAfterSlide): void {
        const { index, prevIndex } = event.detail;
        // Do not call on first slide
        const $slide = this.core.getSlideItem(index);
        if (this.settings.autoplayVideoOnSlide && index !== prevIndex) {
            if ($slide.hasClass('lg-complete')) {
                setTimeout(() => {
                    this.loadAndPlayVideo(index);
                }, 100);
            }
        }
    }

    loadAndPlayVideo(index: number): void {
        const $slide = this.core.getSlideItem(index);
        const currentGalleryItem = this.core.galleryItems[index];
        if (currentGalleryItem.poster) {
            this.loadVideoOnPosterClick($slide, true);
        } else {
            this.playVideo(index);
        }
    }

    /**
     * Play HTML5, Youtube, Vimeo or Wistia videos in a particular slide.
     * @param {number} index - Index of the slide
     */
    playVideo(index: number) {
        this.controlVideo(index, 'play');
    }

    /**
     * Pause HTML5, Youtube, Vimeo or Wistia videos in a particular slide.
     * @param {number} index - Index of the slide
     */
    pauseVideo(index: number) {
        this.controlVideo(index, 'pause');
    }

    getVideoHtml(
        src: any,
        addClass: any,
        index: number,
        html5Video: VideoSource,
    ): string {
        let video = '';
        const videoInfo =
            this.core.galleryItems[(index as unknown) as number]
                .__slideVideoInfo || {};
        const currentGalleryItem = this.core.galleryItems[index];
        let videoTitle = currentGalleryItem.title || currentGalleryItem.alt;
        videoTitle = videoTitle ? 'title="' + videoTitle + '"' : '';
        const commonIframeProps = `allowtransparency="true"
            frameborder="0"
            scrolling="no"
            allowfullscreen
            mozallowfullscreen
            webkitallowfullscreen
            oallowfullscreen
            msallowfullscreen`;

        if (videoInfo.youtube) {
            const videoId = 'lg-youtube' + index;

            const youTubeParams = getYouTubeParams(
                videoInfo,
                this.settings.youTubePlayerParams,
            );

            const isYouTubeNoCookieURL = isYouTubeNoCookie(src);

            const youtubeURL = isYouTubeNoCookieURL
                ? '//www.youtube-nocookie.com/'
                : '//www.youtube.com/';

            video = `<iframe allow="autoplay" id=${videoId} class="lg-video-object lg-youtube ${addClass}" ${videoTitle} src="${youtubeURL}embed/${
                videoInfo.youtube[1] + youTubeParams
            }" ${commonIframeProps}></iframe>`;
        } else if (videoInfo.vimeo) {
            const videoId = 'lg-vimeo' + index;
            const playerParams = getVimeoURLParams(
                this.settings.vimeoPlayerParams,
                videoInfo,
            );
            video = `<iframe allow="autoplay" id=${videoId} class="lg-video-object lg-vimeo ${addClass}" ${videoTitle} src="//player.vimeo.com/video/${
                videoInfo.vimeo[1] + playerParams
            }" ${commonIframeProps}></iframe>`;
        } else if (videoInfo.wistia) {
            const wistiaId = 'lg-wistia' + index;
            let playerParams = param(this.settings.wistiaPlayerParams);
            playerParams = playerParams ? '?' + playerParams : '';
            video = `<iframe allow="autoplay" id="${wistiaId}" src="//fast.wistia.net/embed/iframe/${
                videoInfo.wistia[4] + playerParams
            }" ${videoTitle} class="wistia_embed lg-video-object lg-wistia ${addClass}" name="wistia_embed" ${commonIframeProps}></iframe>`;
        } else if (videoInfo.html5) {
            let html5VideoMarkup = '';
            for (let i = 0; i < html5Video.source.length; i++) {
                const type = html5Video.source[i].type;
                const typeAttr = type ? `type="${type}"` : '';
                html5VideoMarkup += `<source src="${html5Video.source[i].src}" ${typeAttr}>`;
            }
            if (html5Video.tracks) {
                for (let i = 0; i < html5Video.tracks.length; i++) {
                    let trackAttributes = '';
                    const track = html5Video.tracks[i];
                    Object.keys(track || {}).forEach(function (key) {
                        trackAttributes += `${key}="${(track as any)[key]}" `;
                    });
                    html5VideoMarkup += `<track ${trackAttributes}>`;
                }
            }

            let html5VideoAttrs = '';
            const videoAttributes = html5Video.attributes || {};
            Object.keys(videoAttributes || {}).forEach(function (key) {
                html5VideoAttrs += `${key}="${(videoAttributes as any)[key]}" `;
            });
            video = `<video class="lg-video-object lg-html5 ${
                this.settings.videojs && this.settings.videojsTheme
                    ? this.settings.videojsTheme + ' '
                    : ''
            } ${this.settings.videojs ? ' video-js' : ''}" ${html5VideoAttrs}>
                ${html5VideoMarkup}
                Your browser does not support HTML5 video.
            </video>`;
        }

        return video;
    }

    /**
     * @desc - Append videos to the slide
     *
     * @param {HTMLElement} el - slide element
     * @param {Object} videoParams - Video parameters, Contains src, class, index, htmlVideo
     */
    appendVideos(
        el: lgQuery,
        videoParams: {
            src: string;
            addClass: string;
            index: number;
            html5Video: any;
        },
    ): any {
        const videoHtml = this.getVideoHtml(
            videoParams.src,
            videoParams.addClass,
            videoParams.index,
            videoParams.html5Video,
        );
        el.find('.lg-video-cont').append(videoHtml);
        const $videoElement = el.find('.lg-video-object').first();
        if (videoParams.html5Video) {
            $videoElement.on('mousedown.lg.video', (e) => {
                e.stopPropagation();
            });
        }
        if (
            this.settings.videojs &&
            this.core.galleryItems[videoParams.index].__slideVideoInfo?.html5
        ) {
            try {
                return videojs(
                    $videoElement.get(),
                    this.settings.videojsOptions,
                );
            } catch (e) {
                console.error(
                    'lightGallery:- Make sure you have included videojs',
                );
            }
        }
    }

    gotoNextSlideOnVideoEnd(src: any, index: number) {
        const $videoElement = this.core
            .getSlideItem(index)
            .find('.lg-video-object')
            .first();
        const videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
        if (this.settings.gotoNextSlideOnVideoEnd) {
            if (videoInfo.html5) {
                $videoElement.on('ended', () => {
                    this.core.goToNextSlide();
                });
            } else if (videoInfo.vimeo) {
                try {
                    // https://github.com/vimeo/player.js/#ended
                    new Vimeo.Player($videoElement.get()).on('ended', () => {
                        this.core.goToNextSlide();
                    });
                } catch (e) {
                    console.error(
                        'lightGallery:- Make sure you have included //github.com/vimeo/player.js',
                    );
                }
            } else if (videoInfo.wistia) {
                try {
                    window._wq = window._wq || [];

                    // @todo Event is gettign triggered multiple times
                    window._wq.push({
                        id: $videoElement.attr('id'),
                        onReady: (video: {
                            bind: (arg0: string, arg1: () => void) => void;
                        }) => {
                            video.bind('end', () => {
                                this.core.goToNextSlide();
                            });
                        },
                    });
                } catch (e) {
                    console.error(
                        'lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js',
                    );
                }
            }
        }
    }

    controlVideo(index: number, action: string) {
        const $videoElement = this.core
            .getSlideItem(index)
            .find('.lg-video-object')
            .first();
        const videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};

        if (!$videoElement.get()) return;

        if (videoInfo.youtube) {
            try {
                ($videoElement.get() as any).contentWindow.postMessage(
                    `{"event":"command","func":"${action}Video","args":""}`,
                    '*',
                );
            } catch (e) {
                console.error(`lightGallery:- ${e}`);
            }
        } else if (videoInfo.vimeo) {
            try {
                new Vimeo.Player($videoElement.get())[action]();
            } catch (e) {
                console.error(
                    'lightGallery:- Make sure you have included //github.com/vimeo/player.js',
                );
            }
        } else if (videoInfo.html5) {
            if (this.settings.videojs) {
                try {
                    (videojs($videoElement.get()) as any)[action as any]();
                } catch (e) {
                    console.error(
                        'lightGallery:- Make sure you have included videojs',
                    );
                }
            } else {
                ($videoElement.get() as any)[action]();
            }
        } else if (videoInfo.wistia) {
            try {
                window._wq = window._wq || [];

                // @todo Find a way to destroy wistia player instance
                window._wq.push({
                    id: $videoElement.attr('id'),
                    onReady: (video: any) => {
                        video[action]();
                    },
                });
            } catch (e) {
                console.error(
                    'lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js',
                );
            }
        }
    }

    loadVideoOnPosterClick($el: lgQuery, forcePlay?: boolean): void {
        // check slide has poster
        if (!$el.hasClass('lg-video-loaded')) {
            // check already video element present
            if (!$el.hasClass('lg-has-video')) {
                $el.addClass('lg-has-video');

                let _html;

                const _src = this.core.galleryItems[this.core.index].src;
                const video = this.core.galleryItems[this.core.index].video;
                if (video) {
                    _html =
                        typeof video === 'string' ? JSON.parse(video) : video;
                }

                const videoJsPlayer = this.appendVideos($el, {
                    src: _src as string,
                    addClass: '',
                    index: this.core.index,
                    html5Video: _html,
                });

                this.gotoNextSlideOnVideoEnd(_src, this.core.index);

                const $tempImg = $el.find('.lg-object').first().get();

                // @todo make sure it is working
                $el.find('.lg-video-cont').first().append($tempImg);
                $el.addClass('lg-video-loading');

                videoJsPlayer &&
                    videoJsPlayer.ready(() => {
                        videoJsPlayer.on('loadedmetadata', () => {
                            this.onVideoLoadAfterPosterClick(
                                $el,
                                this.core.index,
                            );
                        });
                    });

                $el.find('.lg-video-object')
                    .first()
                    .on('load.lg error.lg loadedmetadata.lg', () => {
                        setTimeout(() => {
                            this.onVideoLoadAfterPosterClick(
                                $el,
                                this.core.index,
                            );
                        }, 50);
                    });
            } else {
                this.playVideo(this.core.index);
            }
        } else if (forcePlay) {
            this.playVideo(this.core.index);
        }
    }
    onVideoLoadAfterPosterClick($el: lgQuery, index: number): void {
        $el.addClass('lg-video-loaded');
        this.playVideo(index);
    }
    destroy(): void {
        this.core.LGel.off('.lg.video');
        this.core.LGel.off('.video');
    }
}
