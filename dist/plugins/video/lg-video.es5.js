/*!
 * lightgallery | 3.0.0 | October 8th 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
const videoSettings = {
  autoplayFirstVideo: true,
  videoFacade: true,
  youTubeNoCookie: true,
  youTubePlayerParams: false,
  vimeoPlayerParams: false,
  wistiaPlayerParams: false,
  gotoNextSlideOnVideoEnd: true,
  autoplayVideoOnSlide: false,
  videojs: false,
  videojsTheme: "",
  videojsOptions: {}
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
function toParamsObject(params) {
  return typeof params === "object" && params ? params : {};
}
function param(obj) {
  return Object.keys(obj).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
  ).join("&");
}
function paramsToObject(url) {
  return url.slice(1).split("&").map((pair) => pair.split("=")).reduce((obj, pair) => {
    const [key, value] = pair.map(decodeURIComponent);
    if (key) {
      obj[key] = value != null ? value : "";
    }
    return obj;
  }, {});
}
function isYouTubeNoCookie(url) {
  return url.includes("youtube-nocookie.com");
}
function getYouTubeEmbedUrl(videoInfo, playerParamsSettings, srcUrl, preferNoCookie = true) {
  if (!videoInfo.youtube) {
    return void 0;
  }
  const slideUrlParams = videoInfo.youtube[2] ? paramsToObject(videoInfo.youtube[2]) : {};
  const params = __spreadValues$1(__spreadValues$1({
    wmode: "opaque",
    autoplay: 0,
    mute: 1,
    enablejsapi: 1
  }, toParamsObject(playerParamsSettings)), slideUrlParams);
  const base = preferNoCookie || isYouTubeNoCookie(srcUrl) ? "//www.youtube-nocookie.com/" : "//www.youtube.com/";
  return `${base}embed/${videoInfo.youtube[1]}?${param(params)}`;
}
const VIMEO_PLAYER_SCRIPT_URL = "https://player.vimeo.com/api/player.js";
const WISTIA_PLAYER_SCRIPT_URL = "https://fast.wistia.com/assets/external/E-v1.js";
function getVimeoEmbedUrl(videoInfo, playerParamsSettings) {
  if (!videoInfo.vimeo) {
    return void 0;
  }
  let urlParams = videoInfo.vimeo[2] || "";
  const defaultPlayerParams = __spreadValues$1({
    autoplay: 0,
    muted: 1
  }, toParamsObject(playerParamsSettings));
  let defaultParams = param(defaultPlayerParams);
  const urlWithHash = videoInfo.vimeo[0].split("/").pop() || "";
  const urlWithHashWithoutParams = urlWithHash.split("?")[0] || "";
  const hash = urlWithHashWithoutParams.split("#")[0];
  const isPrivate = videoInfo.vimeo[1] !== hash;
  if (isPrivate) {
    urlParams = urlParams.replace(`/${hash}`, "");
  }
  urlParams = urlParams[0] === "?" ? `&${urlParams.slice(1)}` : urlParams || "";
  const privateUrlParams = isPrivate ? `h=${hash}` : "";
  defaultParams = privateUrlParams ? `&${defaultParams}` : defaultParams;
  return `//player.vimeo.com/video/${videoInfo.vimeo[1]}?${privateUrlParams}${defaultParams}${urlParams}`;
}
function getWistiaEmbedUrl(videoInfo, playerParamsSettings) {
  if (!videoInfo.wistia) {
    return void 0;
  }
  const paramsObject = toParamsObject(playerParamsSettings);
  const params = Object.keys(paramsObject).length ? param(paramsObject) : "";
  return `//fast.wistia.net/embed/iframe/${videoInfo.wistia[4]}${params ? `?${params}` : ""}`;
}
const lGEvents = {
  hasVideo: "lgHasVideo",
  slideItemLoad: "lgSlideItemLoad",
  beforeSlide: "lgBeforeSlide",
  afterSlide: "lgAfterSlide",
  posterClick: "lgPosterClick"
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
const providerScriptLoads = {};
function loadProviderScript(url) {
  if (!providerScriptLoads[url]) {
    providerScriptLoads[url] = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.head.appendChild(script);
    });
  }
  return providerScriptLoads[url];
}
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
      const embedUrl = getYouTubeEmbedUrl(
        videoInfo,
        this.settings.youTubePlayerParams,
        src,
        this.settings.youTubeNoCookie
      );
      video = `<iframe allow="autoplay" id=${videoId} class="lg-video-object lg-youtube ${addClass}" ${videoTitle} src="${embedUrl}" ${commonIframeProps}></iframe>`;
    } else if (videoInfo.vimeo) {
      const videoId = "lg-vimeo" + index;
      const embedUrl = getVimeoEmbedUrl(
        videoInfo,
        this.settings.vimeoPlayerParams
      );
      video = `<iframe allow="autoplay" id=${videoId} class="lg-video-object lg-vimeo ${addClass}" ${videoTitle} src="${embedUrl}" ${commonIframeProps}></iframe>`;
    } else if (videoInfo.wistia) {
      const wistiaId = "lg-wistia" + index;
      const embedUrl = getWistiaEmbedUrl(
        videoInfo,
        this.settings.wistiaPlayerParams
      );
      video = `<iframe allow="autoplay" id="${wistiaId}" src="${embedUrl}" ${videoTitle} class="wistia_embed lg-video-object lg-wistia ${addClass}" name="wistia_embed" ${commonIframeProps}></iframe>`;
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
          "lightGallery:- Make sure you have included videojs. See https://www.lightgalleryjs.com/demos/video-gallery/"
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
        this.withVimeoApi(() => {
          new Vimeo.Player($videoElement.get()).on("ended", () => {
            this.core.goToNextSlide();
          });
        });
      } else if (videoInfo.wistia) {
        this.pushWistiaCommand({
          id: $videoElement.attr("id"),
          onReady: (video) => {
            video.bind("end", () => {
              this.core.goToNextSlide();
            });
          }
        });
      }
    }
  }
  /**
   * Run a callback with the Vimeo player API available, loading
   * player.js on demand at first use (lite-embed: no provider script
   * before user intent). Errors keep the 2.x console message.
   */
  withVimeoApi(callback) {
    const run = () => {
      try {
        callback();
      } catch (e) {
        console.error(
          "lightGallery:- Make sure you have included //github.com/vimeo/player.js. See https://www.lightgalleryjs.com/demos/video-gallery/"
        );
      }
    };
    if (window.Vimeo && window.Vimeo.Player) {
      run();
      return;
    }
    loadProviderScript(VIMEO_PLAYER_SCRIPT_URL).then(run);
  }
  /**
   * Queue a Wistia command and load E-v1.js on demand, `_wq` is
   * Wistia's own pre-load command queue, drained when the script lands.
   */
  pushWistiaCommand(command) {
    try {
      window._wq = window._wq || [];
      window._wq.push(command);
    } catch (e) {
      console.error(
        "lightGallery:- Make sure you have included //fast.wistia.com/assets/external/E-v1.js. See https://www.lightgalleryjs.com/demos/video-gallery/"
      );
      return;
    }
    if (!window.Wistia) {
      loadProviderScript(WISTIA_PLAYER_SCRIPT_URL);
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
      this.withVimeoApi(() => {
        new Vimeo.Player($videoElement.get())[action]();
      });
    } else if (videoInfo.html5) {
      if (this.settings.videojs) {
        try {
          videojs($videoElement.get())[action]();
        } catch (e) {
          console.error(
            "lightGallery:- Make sure you have included videojs. See https://www.lightgalleryjs.com/demos/video-gallery/"
          );
        }
      } else {
        $videoElement.get()[action]();
      }
    } else if (videoInfo.wistia) {
      this.pushWistiaCommand({
        id: $videoElement.attr("id"),
        onReady: (video) => {
          video[action]();
        }
      });
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
export {
  Video as default
};
//# sourceMappingURL=lg-video.es5.js.map
