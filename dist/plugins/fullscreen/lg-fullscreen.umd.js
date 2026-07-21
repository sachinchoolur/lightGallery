(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.lgFullscreen = factory());
})(this, function() {
  "use strict";/*!
 * lightgallery | 2.9.0 | July 21st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

  const fullscreenSettings = {
    fullScreen: true,
    fullscreenPluginStrings: {
      toggleFullscreen: "Toggle Fullscreen"
    }
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
  class FullScreen {
    constructor(instance, $LG) {
      this.core = instance;
      this.$LG = $LG;
      this.settings = __spreadValues(__spreadValues({}, fullscreenSettings), this.core.settings);
      return this;
    }
    init() {
      let fullScreen = "";
      if (this.settings.fullScreen) {
        if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled && !document.mozFullScreenEnabled && !document.msFullscreenEnabled) {
          return;
        } else {
          fullScreen = `<button type="button" aria-label="${this.settings.fullscreenPluginStrings["toggleFullscreen"]}" class="lg-fullscreen lg-icon"></button>`;
          this.core.$toolbar.append(fullScreen);
          this.fullScreen();
        }
      }
    }
    isFullScreen() {
      return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    }
    requestFullscreen() {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    }
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
    fullScreen() {
      this.$LG(document).on(
        `fullscreenchange.lg.global${this.core.lgId} 
            webkitfullscreenchange.lg.global${this.core.lgId} 
            mozfullscreenchange.lg.global${this.core.lgId} 
            MSFullscreenChange.lg.global${this.core.lgId}`,
        () => {
          if (!this.core.lgOpened) return;
          this.core.outer.toggleClass("lg-fullscreen-on");
        }
      );
      this.core.outer.find(".lg-fullscreen").first().on("click.lg", () => {
        if (this.isFullScreen()) {
          this.exitFullscreen();
        } else {
          this.requestFullscreen();
        }
      });
    }
    closeGallery() {
      if (this.isFullScreen()) {
        this.exitFullscreen();
      }
    }
    destroy() {
      this.$LG(document).off(
        `fullscreenchange.lg.global${this.core.lgId} 
            webkitfullscreenchange.lg.global${this.core.lgId} 
            mozfullscreenchange.lg.global${this.core.lgId} 
            MSFullscreenChange.lg.global${this.core.lgId}`
      );
    }
  }
  return FullScreen;
});
//# sourceMappingURL=lg-fullscreen.umd.js.map
