(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.lgVimeoThumbnail = factory());
})(this, function() {
  "use strict";/*!
 * lightgallery | 2.9.0 | July 21st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

  const lGEvents = {
    init: "lgInit"
  };
  const vimeoSettings = {
    showVimeoThumbnails: true,
    showThumbnailWithPlayButton: false
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
  class VimeoThumbnail {
    constructor(instance) {
      this.core = instance;
      this.settings = __spreadValues(__spreadValues({}, vimeoSettings), this.core.settings);
      return this;
    }
    init() {
      if (!this.settings.showVimeoThumbnails) {
        return;
      }
      this.core.LGel.on(`${lGEvents.init}.vimeothumbnails`, (event) => {
        const pluginInstance = event.detail.instance;
        const thumbCont = pluginInstance.$container.find(".lg-thumb-outer").get();
        if (thumbCont) {
          this.setVimeoThumbnails(pluginInstance);
        }
      });
    }
    async setVimeoThumbnails(dynamicGallery) {
      for (let i = 0; i < dynamicGallery.galleryItems.length; i++) {
        const item = dynamicGallery.galleryItems[i];
        const slideVideoInfo = item.__slideVideoInfo || {};
        if (slideVideoInfo.vimeo) {
          const response = await fetch(
            "https://vimeo.com/api/oembed.json?url=" + encodeURIComponent(item.src)
          );
          const vimeoInfo = await response.json();
          dynamicGallery.$container.find(".lg-thumb-item").eq(i).find("img").attr(
            "src",
            this.settings.showThumbnailWithPlayButton ? vimeoInfo.thumbnail_url_with_play_button : vimeoInfo.thumbnail_url
          );
        }
      }
    }
    destroy() {
      this.core.LGel.off(".lg.vimeothumbnails");
      this.core.LGel.off(".vimeothumbnails");
    }
  }
  return VimeoThumbnail;
});
//# sourceMappingURL=lg-vimeo-thumbnail.umd.js.map
