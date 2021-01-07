(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.lgVideo = {})));
}(this, (function (exports) { 'use strict';

    var videoDefaults = {
        videoMaxWidth: '855px',
        autoplayFirstVideo: true,
        youtubePlayerParams: false,
        vimeoPlayerParams: false,
        wistiaPlayerParams: false,
        gotoNextSlideOnVideoEnd: true,
        autoplayVideoOnSlide: false,
        videojs: false,
        videojsOptions: {},
    };
    //# sourceMappingURL=lg-video-settings.js.map

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
    function param(obj) {
        return Object.keys(obj)
            .map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
        })
            .join('&');
    }
    var Video = /** @class */ (function () {
        function Video(instance) {
            this.core = instance;
            this.s = Object.assign({}, videoDefaults, this.core.s);
            this.init();
            return this;
        }
        Video.prototype.init = function () {
            var _this = this;
            /**
             * Event triggered when video url found without poster
             * Append video HTML
             * Play if autoplayFirstVideo is true
             */
            this.core.LGel.on('hasVideo.lg.video', this.onHasVideo.bind(this));
            // Set max width for video
            this.core.LGel.on('onAferAppendSlide.lg.video', this.onAferAppendSlide.bind(this));
            if (this.core.doCss() &&
                this.core.galleryItems.length > 1 &&
                (this.core.s.enableSwipe || this.core.s.enableDrag)) {
                this.core.LGel.on('onSlideClick.lg.video', function () {
                    var $el = _this.core.getSlideItem(_this.core.index);
                    _this.loadVideoOnPosterClick($el);
                });
            }
            else {
                // For IE 9 and bellow
                this.core.outer
                    .find('.lg-item')
                    .first()
                    .on('click.lg', function () {
                    var $el = _this.core.getSlideItem(_this.core.index);
                    _this.loadVideoOnPosterClick($el);
                });
            }
            // @desc fired immediately before each slide transition.
            this.core.LGel.on('onBeforeSlide.lg.video', this.onBeforeSlide.bind(this));
            // @desc fired immediately after each slide transition.
            this.core.LGel.on('onAfterSlide.lg.video', this.onAfterSlide.bind(this));
        };
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
        Video.prototype.onHasVideo = function (event) {
            var _a = event.detail, index = _a.index, src = _a.src, html5Video = _a.html5Video, hasPoster = _a.hasPoster;
            if (!hasPoster) {
                // All functions are called separately if poster exist in loadVideoOnPosterClick function
                this.appendVideos(this.core.getSlideItem(index), {
                    src: src,
                    addClass: 'lg-object',
                    index: index,
                    html5Video: html5Video,
                });
                // Automatically navigate to next slide once video reaches the end.
                this.gotoNextSlideOnVideoEnd(src, index);
            }
            if (this.s.autoplayFirstVideo && !this.core.lGalleryOn) {
                if (hasPoster) {
                    var $slide = this.core.getSlideItem(index);
                    this.loadVideoOnPosterClick($slide);
                }
                else {
                    this.playVideo(index);
                }
            }
        };
        /**
         * @desc Fired when the slide content has been inserted into its slide container.
         * Set max width for video
         *
         * @param {Event} event - Javascript Event object.
         * @param {number} index - Current index of the slide
         */
        Video.prototype.onAferAppendSlide = function (event) {
            var $videoCont = this.core
                .getSlideItem(event.detail.index)
                .find('.lg-video-cont')
                .first();
            if (!$videoCont.hasClass('lg-has-iframe')) {
                $videoCont.css('max-width', this.s.videoMaxWidth);
            }
        };
        /**
         * @desc fired immediately before each slide transition.
         * Pause the previous video
         * Hide the download button if the slide contains YouTube, Vimeo, or Wistia videos.
         *
         * @param {Event} event - Javascript Event object.
         * @param {number} prevIndex - Previous index of the slide.
         * @param {number} index - Current index of the slide
         */
        Video.prototype.onBeforeSlide = function (event) {
            var _a = event.detail, prevIndex = _a.prevIndex, index = _a.index;
            this.pauseVideo(prevIndex);
            var _videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
            if (_videoInfo.youtube || _videoInfo.vimeo || _videoInfo.wistia) {
                this.core.outer.addClass('lg-hide-download');
            }
        };
        /**
         * @desc fired immediately after each slide transition.
         * Play video if autoplayVideoOnSlide option is enabled.
         *
         * @param {Event} event - Javascript Event object.
         * @param {number} prevIndex - Previous index of the slide.
         * @param {number} index - Current index of the slide
         */
        Video.prototype.onAfterSlide = function (event) {
            var _this = this;
            var _a = event.detail, prevIndex = _a.prevIndex, index = _a.index;
            if (this.s.autoplayVideoOnSlide && this.core.lGalleryOn) {
                this.core.getSlideItem(prevIndex).removeClass('lg-video-playing');
                setTimeout(function () {
                    var $slide = _this.core.getSlideItem(index);
                    if ($slide.find('.lg-object').first().hasClass('lg-has-poster')) {
                        _this.loadVideoOnPosterClick($slide);
                    }
                    else {
                        _this.playVideo(index);
                    }
                }, 100);
            }
        };
        /**
         * Play HTML5, Youtube, Vimeo or Wistia videos in a particular slide.
         * @param {number} index - Index of the slide
         */
        Video.prototype.playVideo = function (index) {
            this.controlVideo(index, 'play');
        };
        /**
         * Pause HTML5, Youtube, Vimeo or Wistia videos in a particular slide.
         * @param {number} index - Index of the slide
         */
        Video.prototype.pauseVideo = function (index) {
            this.controlVideo(index, 'pause');
        };
        Video.prototype.getVideoHtml = function (src, addClass, index, html5Video) {
            var video = '';
            var videoInfo = this.core.galleryItems[index]
                .__slideVideoInfo || {};
            var currentDynamicItem = this.core.galleryItems[index];
            var videoTitle = currentDynamicItem.title || currentDynamicItem.alt;
            videoTitle = videoTitle ? 'title="' + videoTitle + '"' : '';
            var commonIframeProps = "allowtransparency=\"true\" \n            frameborder=\"0\" \n            scrolling=\"no\" \n            allowfullscreen \n            mozallowfullscreen \n            webkitallowfullscreen \n            oallowfullscreen \n            msallowfullscreen";
            if (videoInfo.youtube) {
                var videoId = 'lg-youtube' + index;
                var youtubePlayerParams = "?wmode=opaque&autoplay=0&enablejsapi=1";
                var playerParams = youtubePlayerParams + '&' + param(this.s.youtubePlayerParams);
                video = "<iframe allow=\"autoplay\" id=" + videoId + " class=\"lg-video-object lg-youtube " + addClass + "\" " + videoTitle + " src=\"//www.youtube.com/embed/" + (videoInfo.youtube[1] + playerParams) + "\" " + commonIframeProps + "></iframe>";
            }
            else if (videoInfo.vimeo) {
                var videoId = 'lg-vimeo' + index;
                var playerParams = param(this.s.vimeoPlayerParams);
                video = "<iframe allow=\"autoplay\" id=" + videoId + " class=\"lg-video-object lg-vimeo " + addClass + "\" " + videoTitle + " src=\"//player.vimeo.com/video/" + (videoInfo.vimeo[1] + playerParams) + "\" " + commonIframeProps + "></iframe>";
            }
            else if (videoInfo.wistia) {
                var wistiaId = 'lg-wistia' + index;
                var playerParams = param(this.s.wistiaPlayerParams);
                video = "<iframe allow=\"autoplay\" id=\"" + wistiaId + "\" src=\"//fast.wistia.net/embed/iframe/" + (videoInfo.wistia[4] + playerParams) + "\" " + videoTitle + " class=\"wistia_embed lg-video-object lg-wistia " + addClass + "\" name=\"wistia_embed\" " + commonIframeProps + "></iframe>";
            }
            else if (videoInfo.html5) {
                var html5VideoMarkup = '';
                for (var i = 0; i < html5Video.source.length; i++) {
                    html5VideoMarkup += "<source src=\"" + html5Video.source[i].src + "\" type=\"" + html5Video.source[i].type + "\">";
                }
                var html5VideoAttrs_1 = '';
                Object.keys(html5Video).forEach(function (key) {
                    if (key !== 'source') {
                        html5VideoAttrs_1 += key + "=\"" + html5Video[key] + "\" ";
                    }
                });
                video = "<video class=\"lg-video-object lg-html5 " + (this.s.videojs ? 'video-js' : '') + "\" " + html5VideoAttrs_1 + ">\n                " + html5VideoMarkup + "\n                Your browser does not support HTML5 video.\n            </video>";
            }
            return video;
        };
        /**
         * @desc - Append videos to the slide
         *
         * @param {HTMLElement} el - slide element
         * @param {Object} videoParams - Video parameters, Contains src, class, index, htmlVideo
         */
        Video.prototype.appendVideos = function (el, videoParams) {
            var videoHtml = this.getVideoHtml(videoParams.src, videoParams.addClass, videoParams.index, videoParams.html5Video);
            el.find('.lg-video').append(videoHtml);
            var $videoElement = el.find('.lg-video-object').first();
            if (this.s.videojs) {
                try {
                    videojs($videoElement.get(), this.s.videojsOptions);
                }
                catch (e) {
                    console.error('lightGallery:- Make sure you have included videojs');
                }
            }
            this.core.LGel.trigger('onAppendVideo.lg', [
                $videoElement,
                videoParams.index,
            ]);
        };
        Video.prototype.gotoNextSlideOnVideoEnd = function (src, index) {
            var _this = this;
            var $videoElement = this.core
                .getSlideItem(index)
                .find('.lg-video-object')
                .first();
            var videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
            if (this.s.gotoNextSlideOnVideoEnd) {
                if (videoInfo.html5) {
                    $videoElement.on('ended', function () {
                        _this.core.goToNextSlide();
                    });
                }
                else if (videoInfo.youtube) {
                    try {
                        new YT.Player($videoElement.attr('id'), {
                            events: {
                                onStateChange: function (event) {
                                    if (event.data === YT.PlayerState.ENDED) {
                                        _this.core.goToNextSlide();
                                    }
                                },
                            },
                        });
                    }
                    catch (e) {
                        console.error('lightGallery:- Make sure you have included //www.youtube.com/iframe_api');
                    }
                }
                else if (videoInfo.vimeo) {
                    try {
                        // https://github.com/vimeo/player.js/#ended
                        new Vimeo.Player($videoElement.get()).on('ended', function () {
                            _this.core.goToNextSlide();
                        });
                    }
                    catch (e) {
                        console.error('lightGallery:- Make sure you have included //github.com/vimeo/player.js');
                    }
                }
                else if (videoInfo.wistia) {
                    try {
                        window._wq = window._wq || [];
                        // @todo Event is gettign triggered multiple times
                        window._wq.push({
                            id: $videoElement.attr('id'),
                            onReady: function (video) {
                                video.bind('end', function () {
                                    _this.core.goToNextSlide();
                                });
                            },
                        });
                    }
                    catch (e) {
                        console.error('lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js');
                    }
                }
            }
        };
        Video.prototype.controlVideo = function (index, action) {
            var $videoElement = this.core
                .getSlideItem(index)
                .find('.lg-video-object')
                .first();
            var videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
            if (!$videoElement.get())
                return;
            if (videoInfo.youtube) {
                try {
                    // @todo Do not create multiple player instences
                    // Create and store in dynamic array
                    new YT.Player($videoElement.attr('id'), {
                        events: {
                            onReady: function (event) {
                                event.target[action + "Video"]();
                            },
                        },
                    });
                }
                catch (e) {
                    console.error('lightGallery:- Make sure you have included //www.youtube.com/iframe_api');
                }
            }
            else if (videoInfo.vimeo) {
                try {
                    new Vimeo.Player($videoElement.get())[action]();
                }
                catch (e) {
                    console.error('lightGallery:- Make sure you have included //github.com/vimeo/player.js');
                }
            }
            else if (videoInfo.html5) {
                if (this.s.videojs) {
                    try {
                        videojs($videoElement.get())[action]();
                    }
                    catch (e) {
                        console.error('lightGallery:- Make sure you have included videojs');
                    }
                }
                else {
                    $videoElement.get()[action]();
                }
            }
            else if (videoInfo.wistia) {
                try {
                    window._wq = window._wq || [];
                    // @todo Find a way to destroy wistia player instance
                    window._wq.push({
                        id: $videoElement.attr('id'),
                        onReady: function (video) {
                            video[action]();
                        },
                    });
                }
                catch (e) {
                    console.error('lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js');
                }
            }
        };
        Video.prototype.loadVideoOnPosterClick = function ($el) {
            // check slide has poster
            if ($el.find('.lg-object').first().hasClass('lg-has-poster') &&
                $el.find('.lg-object').first().style().display !== 'none') {
                // check already video element present
                if (!$el.hasClass('lg-has-video')) {
                    $el.addClass('lg-video-playing lg-has-video');
                    var _html = void 0;
                    var _src = this.core.galleryItems[this.core.index].src;
                    if (this.core.galleryItems[this.core.index].video) {
                        _html = JSON.parse(this.core.galleryItems[this.core.index].video);
                    }
                    this.appendVideos($el, {
                        src: _src,
                        addClass: '',
                        index: this.core.index,
                        html5Video: _html,
                    });
                    this.gotoNextSlideOnVideoEnd(_src, this.core.index);
                    this.playVideo(this.core.index);
                    var $tempImg = $el.find('.lg-object').first().get();
                    // @todo make sure it is working
                    $el.find('.lg-video').first().append($tempImg);
                    // @todo loading icon for html5 videos also
                    // for showing the loading indicator while loading video
                    if (!$el.find('.lg-video-object').first().hasClass('lg-html5')) {
                        $el.removeClass('lg-complete');
                        $el.find('.lg-video-object')
                            .first()
                            .on('load.lg error.lg', function () {
                            $el.addClass('lg-complete');
                        });
                    }
                }
                else {
                    this.playVideo(this.core.index);
                    $el.addClass('lg-video-playing');
                }
            }
        };
        Video.prototype.destroy = function (clear) {
            if (clear) {
                this.core.LGel.off('.lg.video');
            }
        };
        return Video;
    }());
    window.lgModules.video = Video;
    //# sourceMappingURL=lg-video.js.map

    exports.Video = Video;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=lg-video.umd.js.map
