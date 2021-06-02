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

import { VideoSettings, videoSettings } from './lg-video-settings';
import { LightGallery } from '../../lightgallery';
import { lgQuery } from '../../lgQuery';
import { CustomEventHasVideo } from '../../types';
import { lGEvents } from '../../lg-events';
import { VideoSource } from './types';

declare let Vimeo: any;
declare let videojs: any;
declare global {
    interface Window {
        _wq: any;
        Vimeo: any;
    }
}

function param(obj: { [x: string]: string | number | boolean }): string {
    return Object.keys(obj)
        .map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
        })
        .join('&');
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

        if (this.core.settings.enableSwipe || this.core.settings.enableDrag) {
            this.core.LGel.on(`${lGEvents.posterClick}.video`, () => {
                const $el = this.core.getSlideItem(this.core.index);
                this.loadVideoOnPosterClick($el);
            });
        } else {
            // For IE 9 and bellow
            this.core.outer
                .find('.lg-item')
                .first()
                .on('click.lg', () => {
                    const $el = this.core.getSlideItem(this.core.index);
                    this.loadVideoOnPosterClick($el);
                });
        }

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
     * @desc Event triggered when video url or poster found
     * Append video HTML is poster is not given
     * Play if autoplayFirstVideo is true
     *
     * @param {Event} event - Javascript Event object.
     */
    onHasVideo(event: CustomEventHasVideo): void {
        const {
            index,
            src,
            html5Video,
            hasPoster,
            isFirstSlide,
        } = event.detail;
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

        if (this.settings.autoplayFirstVideo && isFirstSlide) {
            if (hasPoster) {
                const $slide = this.core.getSlideItem(index);
                this.loadVideoOnPosterClick($slide);
            } else {
                this.playVideo(index);
            }
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
    onBeforeSlide(event: CustomEvent) {
        const { prevIndex, index } = event.detail;
        this.pauseVideo(prevIndex);

        const _videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
        if (_videoInfo.youtube || _videoInfo.vimeo || _videoInfo.wistia) {
            this.core.outer.addClass('lg-hide-download');
        }
    }

    /**
     * @desc fired immediately after each slide transition.
     * Play video if autoplayVideoOnSlide option is enabled.
     *
     * @param {Event} event - Javascript Event object.
     * @param {number} prevIndex - Previous index of the slide.
     * @param {number} index - Current index of the slide
     */
    onAfterSlide(event: CustomEvent): void {
        const { index } = event.detail;
        if (this.settings.autoplayVideoOnSlide && this.core.lGalleryOn) {
            setTimeout(() => {
                const $slide = this.core.getSlideItem(index);
                if (!$slide.hasClass('lg-video-loaded')) {
                    this.loadVideoOnPosterClick($slide);
                } else {
                    this.playVideo(index);
                }
            }, 100);
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

            const youTubePlayerParams = `?wmode=opaque&autoplay=0&enablejsapi=1`;

            const playerParams =
                youTubePlayerParams +
                (this.settings.youTubePlayerParams
                    ? '&' + param(this.settings.youTubePlayerParams)
                    : '');

            video = `<iframe allow="autoplay" id=${videoId} class="lg-video-object lg-youtube ${addClass}" ${videoTitle} src="//www.youtube.com/embed/${
                videoInfo.youtube[1] + playerParams
            }" ${commonIframeProps}></iframe>`;
        } else if (videoInfo.vimeo) {
            const videoId = 'lg-vimeo' + index;
            const playerParams = param(this.settings.vimeoPlayerParams);

            video = `<iframe allow="autoplay" id=${videoId} class="lg-video-object lg-vimeo ${addClass}" ${videoTitle} src="//player.vimeo.com/video/${
                videoInfo.vimeo[1] + playerParams
            }" ${commonIframeProps}></iframe>`;
        } else if (videoInfo.wistia) {
            const wistiaId = 'lg-wistia' + index;
            const playerParams = param(this.settings.wistiaPlayerParams);
            video = `<iframe allow="autoplay" id="${wistiaId}" src="//fast.wistia.net/embed/iframe/${
                videoInfo.wistia[4] + playerParams
            }" ${videoTitle} class="wistia_embed lg-video-object lg-wistia ${addClass}" name="wistia_embed" ${commonIframeProps}></iframe>`;
        } else if (videoInfo.html5) {
            let html5VideoMarkup = '';
            for (let i = 0; i < html5Video.source.length; i++) {
                html5VideoMarkup += `<source src="${html5Video.source[i].src}" type="${html5Video.source[i].type}">`;
            }

            let html5VideoAttrs = '';
            const videoAttributes = html5Video.attributes || {};
            Object.keys(videoAttributes || {}).forEach(function (key) {
                html5VideoAttrs += `${key}="${(videoAttributes as any)[key]}" `;
            });
            video = `<video class="lg-video-object lg-html5 ${
                this.settings.videojs ? 'video-js' : ''
            }" ${html5VideoAttrs}>
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

    loadVideoOnPosterClick($el: lgQuery) {
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
                    src: _src,
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
                    .on('load.lg error.lg loadeddata.lg', () => {
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
