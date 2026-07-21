(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.lgAutoplay = factory());
})(this, function() {
  "use strict";/*!
 * lightgallery | 2.9.0 | July 21st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

  const lGEvents = {
    slideItemLoad: "lgSlideItemLoad",
    beforeSlide: "lgBeforeSlide",
    afterSlide: "lgAfterSlide",
    dragStart: "lgDragStart",
    dragEnd: "lgDragEnd",
    autoplay: "lgAutoplay",
    autoplayStart: "lgAutoplayStart",
    autoplayStop: "lgAutoplayStop"
  };
  const autoplaySettings = {
    autoplay: true,
    slideShowAutoplay: false,
    slideShowInterval: 5e3,
    progressBar: true,
    forceSlideShowAutoplay: false,
    autoplayControls: true,
    appendAutoplayControlsTo: ".lg-toolbar",
    autoplayPluginStrings: {
      toggleAutoplay: "Toggle Autoplay"
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
  class Autoplay {
    constructor(instance) {
      this.core = instance;
      this.settings = __spreadValues(__spreadValues({}, autoplaySettings), this.core.settings);
      return this;
    }
    init() {
      if (!this.settings.autoplay) {
        return;
      }
      this.interval = false;
      this.fromAuto = true;
      this.pausedOnTouchDrag = false;
      this.pausedOnSlideChange = false;
      if (this.settings.autoplayControls) {
        this.controls();
      }
      if (this.settings.progressBar) {
        this.core.outer.append(
          '<div class="lg-progress-bar"><div class="lg-progress"></div></div>'
        );
      }
      if (this.settings.slideShowAutoplay) {
        this.core.LGel.once(`${lGEvents.slideItemLoad}.autoplay`, () => {
          this.startAutoPlay();
        });
      }
      this.core.LGel.on(
        `${lGEvents.dragStart}.autoplay touchstart.lg.autoplay`,
        () => {
          if (this.interval) {
            this.stopAutoPlay();
            this.pausedOnTouchDrag = true;
          }
        }
      );
      this.core.LGel.on(
        `${lGEvents.dragEnd}.autoplay touchend.lg.autoplay`,
        () => {
          if (!this.interval && this.pausedOnTouchDrag) {
            this.startAutoPlay();
            this.pausedOnTouchDrag = false;
          }
        }
      );
      this.core.LGel.on(`${lGEvents.beforeSlide}.autoplay`, () => {
        this.showProgressBar();
        if (!this.fromAuto && this.interval) {
          this.stopAutoPlay();
          this.pausedOnSlideChange = true;
        } else {
          this.pausedOnSlideChange = false;
        }
        this.fromAuto = false;
      });
      this.core.LGel.on(`${lGEvents.afterSlide}.autoplay`, () => {
        if (this.pausedOnSlideChange && !this.interval && this.settings.forceSlideShowAutoplay) {
          this.startAutoPlay();
          this.pausedOnSlideChange = false;
        }
      });
      this.showProgressBar();
    }
    showProgressBar() {
      if (this.settings.progressBar && this.fromAuto) {
        const _$progressBar = this.core.outer.find(".lg-progress-bar");
        const _$progress = this.core.outer.find(".lg-progress");
        if (this.interval) {
          _$progress.removeAttr("style");
          _$progressBar.removeClass("lg-start");
          setTimeout(() => {
            _$progress.css(
              "transition",
              "width " + (this.core.settings.speed + this.settings.slideShowInterval) + "ms ease 0s"
            );
            _$progressBar.addClass("lg-start");
          }, 20);
        }
      }
    }
    // Manage autoplay via play/stop buttons
    controls() {
      const _html = `<button aria-label="${this.settings.autoplayPluginStrings["toggleAutoplay"]}" type="button" class="lg-autoplay-button lg-icon"></button>`;
      this.core.outer.find(this.settings.appendAutoplayControlsTo).append(_html);
      this.core.outer.find(".lg-autoplay-button").first().on("click.lg.autoplay", () => {
        if (this.core.outer.hasClass("lg-show-autoplay")) {
          this.stopAutoPlay();
        } else {
          if (!this.interval) {
            this.startAutoPlay();
          }
        }
      });
    }
    // Autostart gallery
    startAutoPlay() {
      this.core.outer.find(".lg-progress").css(
        "transition",
        "width " + (this.core.settings.speed + this.settings.slideShowInterval) + "ms ease 0s"
      );
      this.core.outer.addClass("lg-show-autoplay");
      this.core.outer.find(".lg-progress-bar").addClass("lg-start");
      this.core.LGel.trigger(lGEvents.autoplayStart, {
        index: this.core.index
      });
      this.interval = setInterval(() => {
        if (this.core.index + 1 < this.core.galleryItems.length) {
          this.core.index++;
        } else {
          this.core.index = 0;
        }
        this.core.LGel.trigger(lGEvents.autoplay, {
          index: this.core.index
        });
        this.fromAuto = true;
        this.core.slide(this.core.index, false, false, "next");
      }, this.core.settings.speed + this.settings.slideShowInterval);
    }
    // cancel Autostart
    stopAutoPlay() {
      if (this.interval) {
        this.core.LGel.trigger(lGEvents.autoplayStop, {
          index: this.core.index
        });
        this.core.outer.find(".lg-progress").removeAttr("style");
        this.core.outer.removeClass("lg-show-autoplay");
        this.core.outer.find(".lg-progress-bar").removeClass("lg-start");
      }
      clearInterval(this.interval);
      this.interval = false;
    }
    closeGallery() {
      this.stopAutoPlay();
    }
    destroy() {
      if (this.settings.autoplay) {
        this.core.outer.find(".lg-progress-bar").remove();
      }
      this.core.LGel.off(".lg.autoplay");
      this.core.LGel.off(".autoplay");
    }
  }
  return Autoplay;
});
//# sourceMappingURL=lg-autoplay.umd.js.map
