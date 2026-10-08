/*!
 * lightgallery | 3.0.0 | October 8th 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
const fullscreenDefaultIcons = {
  fullscreen: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M598 724.667h212v-212h-84v128h-128v84zM726 212.667v128h84v-212h-212v84h128zM214 512.667v212h212v-84h-128v-128h-84zM298 340.667v-128h128v-84h-212v212h84z"/></svg>',
  fullscreenExit: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M682 596.667h128v-84h-212v212h84v-128zM598 128.667v212h212v-84h-128v-128h-84zM342 596.667v128h84v-212h-212v84h128zM214 256.667v84h212v-212h-84v128h-128z"/></svg>'
};
const fullscreenSettings = {
  fullScreen: true
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
    var _a, _b;
    this.core.registerDefaultIcons(fullscreenDefaultIcons);
    let fullScreen = "";
    if (this.settings.fullScreen) {
      if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled) {
        return;
      } else {
        fullScreen = `<button type="button" aria-label="${(_b = (_a = this.settings.fullscreenPluginStrings) == null ? void 0 : _a.toggleFullscreen) != null ? _b : this.core.settings.strings.toggleFullscreen}" class="lg-fullscreen lg-icon"></button>`;
        this.core.$toolbar.append(fullScreen);
        this.fullScreen();
      }
    }
  }
  isFullScreen() {
    return document.fullscreenElement || document.webkitFullscreenElement;
  }
  requestFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }
  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
  // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
  fullScreen() {
    this.$LG(document).on(
      `fullscreenchange.lg.global${this.core.lgId} 
            webkitfullscreenchange.lg.global${this.core.lgId}`,
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
            webkitfullscreenchange.lg.global${this.core.lgId}`
    );
  }
}
export {
  FullScreen as default
};
//# sourceMappingURL=lg-fullscreen.es5.js.map
