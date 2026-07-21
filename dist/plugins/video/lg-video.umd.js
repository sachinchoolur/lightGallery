(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.lgVideo = factory());
})(this, function() {
  "use strict";/*!
 * lightgallery | 2.9.0 | July 21st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

  const videoSettings = {
    autoplayFirstVideo: true,
    youTubePlayerParams: false,
    vimeoPlayerParams: false,
    wistiaPlayerParams: false,
    gotoNextSlideOnVideoEnd: true,
    autoplayVideoOnSlide: false,
    videojs: false,
    videojsTheme: "",
    videojsOptions: {}
  };
  const lGEvents = {
    hasVideo: "lgHasVideo",
    slideItemLoad: "lgSlideItemLoad",
    beforeSlide: "lgBeforeSlide",
    afterSlide: "lgAfterSlide",
    posterClick: "lgPosterClick"
  };
  var __defProp$1 = Object.defineProperty;
  var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
  var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
  var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$1 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    if (__getOwnPropSymbols$1)
      for (var prop of __getOwnPropSymbols$1(b)) {
        if (__propIsEnum$1.call(b, prop))
          __defNormalProp$1(a, prop, b[prop]);
      }
    return a;
  };
  const param = (obj) => {
    return Object.keys(obj).map(function(k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);
    }).join("&");
  };
  const paramsToObject = (url) => {
    const paramas = url.slice(1).split("&").map((p) => p.split("=")).reduce((obj, pair) => {
      const [key, value] = pair.map(decodeURIComponent);
      obj[key] = value;
      return obj;
    }, {});
    return paramas;
  };
  const getYouTubeParams = (videoInfo, youTubePlayerParamsSettings) => {
    if (!videoInfo.youtube) return "";
    const slideUrlParams = videoInfo.youtube[2] ? paramsToObject(videoInfo.youtube[2]) : "";
    const defaultYouTubePlayerParams = {
      wmode: "opaque",
      autoplay: 0,
      mute: 1,
      enablejsapi: 1
    };
    const playerParamsSettings = youTubePlayerParamsSettings || {};
    const youTubePlayerParams = __spreadValues$1(__spreadValues$1(__spreadValues$1({}, defaultYouTubePlayerParams), playerParamsSettings), slideUrlParams);
    const youTubeParams = `?${param(youTubePlayerParams)}`;
    return youTubeParams;
  };
  const isYouTubeNoCookie = (url) => {
    return url.includes("youtube-nocookie.com");
  };
  const getVimeoURLParams = (defaultParams, videoInfo) => {
    if (!videoInfo || !videoInfo.vimeo) return "";
    let urlParams = videoInfo.vimeo[2] || "";
    const defaultVimeoPlayerParams = Object.assign(
      {},
      {
        autoplay: 0,
        muted: 1
      },
      defaultParams
    );
    let defaultPlayerParams = defaultVimeoPlayerParams && Object.keys(defaultVimeoPlayerParams).length !== 0 ? param(defaultVimeoPlayerParams) : "";
    const urlWithHash = videoInfo.vimeo[0].split("/").pop() || "";
    const urlWithHashWithParams = urlWithHash.split("?")[0] || "";
    const hash = urlWithHashWithParams.split("#")[0];
    const isPrivate = videoInfo.vimeo[1] !== hash;
    if (isPrivate) {
      urlParams = urlParams.replace(`/${hash}`, "");
    }
    urlParams = urlParams[0] == "?" ? "&" + urlParams.slice(1) : urlParams || "";
    const privateUrlParams = isPrivate ? `h=${hash}` : "";
    defaultPlayerParams = privateUrlParams ? `&${defaultPlayerParams}` : defaultPlayerParams;
    const vimeoPlayerParams = `?${privateUrlParams}${defaultPlayerParams}${urlParams}`;
    return vimeoPlayerParams;
  };
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  class Video {
    constructor(instance) {
      this.core = instance;
      this.settings = __spreadValues(__spreadValues({}, videoSettings), this.core.settings);
      return this;
    }
    init() {
      this.core.LGel.on(
        `${lGEvents.hasVideo}.video`,
        this.onHasVideo.bind(this)
      );
      this.core.LGel.on(`${lGEvents.posterClick}.video`, () => {
        const $el = this.core.getSlideItem(this.core.index);
        this.loadVideoOnPosterClick($el);
      });
      this.core.LGel.on(
        `${lGEvents.slideItemLoad}.video`,
        this.onSlideItemLoad.bind(this)
      );
      this.core.LGel.on(
        `${lGEvents.beforeSlide}.video`,
        this.onBeforeSlide.bind(this)
      );
      this.core.LGel.on(
        `${lGEvents.afterSlide}.video`,
        this.onAfterSlide.bind(this)
      );
    }
    /**
     * @desc Event triggered when a slide is completely loaded
     *
     * @param {Event} event - lightGalley custom event
     */
    onSlideItemLoad(event) {
      const { isFirstSlide, index } = event.detail;
      if (this.settings.autoplayFirstVideo && isFirstSlide && index === this.core.index) {
        setTimeout(() => {
          this.loadAndPlayVideo(index);
        }, 200);
      }
      if (!isFirstSlide && this.settings.autoplayVideoOnSlide && index === this.core.index) {
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
    onHasVideo(event) {
      const { index, src, html5Video, hasPoster } = event.detail;
      if (!hasPoster) {
        this.appendVideos(this.core.getSlideItem(index), {
          src,
          addClass: "lg-object",
          index,
          html5Video
        });
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
    onBeforeSlide(event) {
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
    onAfterSlide(event) {
      const { index, prevIndex } = event.detail;
      const $slide = this.core.getSlideItem(index);
      if (this.settings.autoplayVideoOnSlide && index !== prevIndex) {
        if ($slide.hasClass("lg-complete")) {
          setTimeout(() => {
            this.loadAndPlayVideo(index);
          }, 100);
        }
      }
    }
    loadAndPlayVideo(index) {
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
    playVideo(index) {
      this.controlVideo(index, "play");
    }
    /**
     * Pause HTML5, Youtube, Vimeo or Wistia videos in a particular slide.
     * @param {number} index - Index of the slide
     */
    pauseVideo(index) {
      this.controlVideo(index, "pause");
    }
    getVideoHtml(src, addClass, index, html5Video) {
      let video = "";
      const videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
      const currentGalleryItem = this.core.galleryItems[index];
      let videoTitle = currentGalleryItem.title || currentGalleryItem.alt;
      videoTitle = videoTitle ? 'title="' + videoTitle + '"' : "";
      const commonIframeProps = `allowtransparency="true"
            frameborder="0"
            scrolling="no"
            allowfullscreen
            mozallowfullscreen
            webkitallowfullscreen
            oallowfullscreen
            msallowfullscreen`;
      if (videoInfo.youtube) {
        const videoId = "lg-youtube" + index;
        const youTubeParams = getYouTubeParams(
          videoInfo,
          this.settings.youTubePlayerParams
        );
        const isYouTubeNoCookieURL = isYouTubeNoCookie(src);
        const youtubeURL = isYouTubeNoCookieURL ? "//www.youtube-nocookie.com/" : "//www.youtube.com/";
        video = `<iframe allow="autoplay" id=${videoId} class="lg-video-object lg-youtube ${addClass}" ${videoTitle} src="${youtubeURL}embed/${videoInfo.youtube[1] + youTubeParams}" ${commonIframeProps}></iframe>`;
      } else if (videoInfo.vimeo) {
        const videoId = "lg-vimeo" + index;
        const playerParams = getVimeoURLParams(
          this.settings.vimeoPlayerParams,
          videoInfo
        );
        video = `<iframe allow="autoplay" id=${videoId} class="lg-video-object lg-vimeo ${addClass}" ${videoTitle} src="//player.vimeo.com/video/${videoInfo.vimeo[1] + playerParams}" ${commonIframeProps}></iframe>`;
      } else if (videoInfo.wistia) {
        const wistiaId = "lg-wistia" + index;
        let playerParams = param(this.settings.wistiaPlayerParams);
        playerParams = playerParams ? "?" + playerParams : "";
        video = `<iframe allow="autoplay" id="${wistiaId}" src="//fast.wistia.net/embed/iframe/${videoInfo.wistia[4] + playerParams}" ${videoTitle} class="wistia_embed lg-video-object lg-wistia ${addClass}" name="wistia_embed" ${commonIframeProps}></iframe>`;
      } else if (videoInfo.html5) {
        let html5VideoMarkup = "";
        for (let i = 0; i < html5Video.source.length; i++) {
          const type = html5Video.source[i].type;
          const typeAttr = type ? `type="${type}"` : "";
          html5VideoMarkup += `<source src="${html5Video.source[i].src}" ${typeAttr}>`;
        }
        if (html5Video.tracks) {
          for (let i = 0; i < html5Video.tracks.length; i++) {
            let trackAttributes = "";
            const track = html5Video.tracks[i];
            Object.keys(track || {}).forEach(function(key) {
              trackAttributes += `${key}="${track[key]}" `;
            });
            html5VideoMarkup += `<track ${trackAttributes}>`;
          }
        }
        let html5VideoAttrs = "";
        const videoAttributes = html5Video.attributes || {};
        Object.keys(videoAttributes || {}).forEach(function(key) {
          html5VideoAttrs += `${key}="${videoAttributes[key]}" `;
        });
        video = `<video class="lg-video-object lg-html5 ${this.settings.videojs && this.settings.videojsTheme ? this.settings.videojsTheme + " " : ""} ${this.settings.videojs ? " video-js" : ""}" ${html5VideoAttrs}>
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
    appendVideos(el, videoParams) {
      var _a;
      const videoHtml = this.getVideoHtml(
        videoParams.src,
        videoParams.addClass,
        videoParams.index,
        videoParams.html5Video
      );
      el.find(".lg-video-cont").append(videoHtml);
      const $videoElement = el.find(".lg-video-object").first();
      if (videoParams.html5Video) {
        $videoElement.on("mousedown.lg.video", (e) => {
          e.stopPropagation();
        });
      }
      if (this.settings.videojs && ((_a = this.core.galleryItems[videoParams.index].__slideVideoInfo) == null ? void 0 : _a.html5)) {
        try {
          return videojs(
            $videoElement.get(),
            this.settings.videojsOptions
          );
        } catch (e) {
          console.error(
            "lightGallery:- Make sure you have included videojs"
          );
        }
      }
    }
    gotoNextSlideOnVideoEnd(src, index) {
      const $videoElement = this.core.getSlideItem(index).find(".lg-video-object").first();
      const videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
      if (this.settings.gotoNextSlideOnVideoEnd) {
        if (videoInfo.html5) {
          $videoElement.on("ended", () => {
            this.core.goToNextSlide();
          });
        } else if (videoInfo.vimeo) {
          try {
            new Vimeo.Player($videoElement.get()).on("ended", () => {
              this.core.goToNextSlide();
            });
          } catch (e) {
            console.error(
              "lightGallery:- Make sure you have included //github.com/vimeo/player.js"
            );
          }
        } else if (videoInfo.wistia) {
          try {
            window._wq = window._wq || [];
            window._wq.push({
              id: $videoElement.attr("id"),
              onReady: (video) => {
                video.bind("end", () => {
                  this.core.goToNextSlide();
                });
              }
            });
          } catch (e) {
            console.error(
              "lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js"
            );
          }
        }
      }
    }
    controlVideo(index, action) {
      const $videoElement = this.core.getSlideItem(index).find(".lg-video-object").first();
      const videoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
      if (!$videoElement.get()) return;
      if (videoInfo.youtube) {
        try {
          $videoElement.get().contentWindow.postMessage(
            `{"event":"command","func":"${action}Video","args":""}`,
            "*"
          );
        } catch (e) {
          console.error(`lightGallery:- ${e}`);
        }
      } else if (videoInfo.vimeo) {
        try {
          new Vimeo.Player($videoElement.get())[action]();
        } catch (e) {
          console.error(
            "lightGallery:- Make sure you have included //github.com/vimeo/player.js"
          );
        }
      } else if (videoInfo.html5) {
        if (this.settings.videojs) {
          try {
            videojs($videoElement.get())[action]();
          } catch (e) {
            console.error(
              "lightGallery:- Make sure you have included videojs"
            );
          }
        } else {
          $videoElement.get()[action]();
        }
      } else if (videoInfo.wistia) {
        try {
          window._wq = window._wq || [];
          window._wq.push({
            id: $videoElement.attr("id"),
            onReady: (video) => {
              video[action]();
            }
          });
        } catch (e) {
          console.error(
            "lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js"
          );
        }
      }
    }
    loadVideoOnPosterClick($el, forcePlay) {
      if (!$el.hasClass("lg-video-loaded")) {
        if (!$el.hasClass("lg-has-video")) {
          $el.addClass("lg-has-video");
          let _html;
          const _src = this.core.galleryItems[this.core.index].src;
          const video = this.core.galleryItems[this.core.index].video;
          if (video) {
            _html = typeof video === "string" ? JSON.parse(video) : video;
          }
          const videoJsPlayer = this.appendVideos($el, {
            src: _src,
            addClass: "",
            index: this.core.index,
            html5Video: _html
          });
          this.gotoNextSlideOnVideoEnd(_src, this.core.index);
          const $tempImg = $el.find(".lg-object").first().get();
          $el.find(".lg-video-cont").first().append($tempImg);
          $el.addClass("lg-video-loading");
          videoJsPlayer && videoJsPlayer.ready(() => {
            videoJsPlayer.on("loadedmetadata", () => {
              this.onVideoLoadAfterPosterClick(
                $el,
                this.core.index
              );
            });
          });
          $el.find(".lg-video-object").first().on("load.lg error.lg loadedmetadata.lg", () => {
            setTimeout(() => {
              this.onVideoLoadAfterPosterClick(
                $el,
                this.core.index
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
    onVideoLoadAfterPosterClick($el, index) {
      $el.addClass("lg-video-loaded");
      this.playVideo(index);
    }
    destroy() {
      this.core.LGel.off(".lg.video");
      this.core.LGel.off(".video");
    }
  }
  return Video;
});
//# sourceMappingURL=lg-video.umd.js.map
