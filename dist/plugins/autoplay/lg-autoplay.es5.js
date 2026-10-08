/*!
 * lightgallery | 3.0.0-beta.5 | October 8th 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
const autoplayDefaultIcons = {
  autoplayPlay: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M512 84.667q140 0 241 101t101 241-101 241-241 101-241-101-101-241 101-241 241-101zM512 852.667q176 0 301-125t125-301-125-301-301-125-301 125-125 301 125 301 301 125zM426 234.667v384l256-192z"/></svg>',
  autoplayPause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M554 256.667v340h86v-340h-86zM512 84.667q140 0 241 101t101 241-101 241-241 101-241-101-101-241 101-241 241-101zM512 852.667q176 0 301-125t125-301-125-301-301-125-301 125-125 301 125 301 301 125zM384 256.667v340h86v-340h-86z"/></svg>'
};
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
  appendAutoplayControlsTo: ".lg-toolbar"
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
    this.running = false;
    this.timer = null;
    this.progressTimer = null;
    this.waitingFor = null;
    this.startedFromLoad = false;
    this.core = instance;
    this.settings = __spreadValues(__spreadValues({}, autoplaySettings), this.core.settings);
    return this;
  }
  init() {
    this.core.registerDefaultIcons(autoplayDefaultIcons);
    if (!this.settings.autoplay) {
      return;
    }
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
    this.core.LGel.on(
      `${lGEvents.slideItemLoad}.autoplay`,
      (event) => {
        if (this.settings.slideShowAutoplay && !this.startedFromLoad) {
          this.startedFromLoad = true;
          this.startAutoPlay();
          return;
        }
        if (this.running && this.waitingFor === event.detail.index) {
          this.countdown();
        }
      }
    );
    this.core.LGel.on(
      `${lGEvents.dragStart}.autoplay touchstart.lg.autoplay`,
      () => {
        if (this.running) {
          this.stopAutoPlay();
          this.pausedOnTouchDrag = true;
        }
      }
    );
    this.core.LGel.on(
      `${lGEvents.dragEnd}.autoplay touchend.lg.autoplay`,
      () => {
        if (!this.running && this.pausedOnTouchDrag) {
          this.startAutoPlay();
          this.pausedOnTouchDrag = false;
        }
      }
    );
    this.core.LGel.on(`${lGEvents.beforeSlide}.autoplay`, () => {
      if (!this.fromAuto && this.running) {
        this.stopAutoPlay();
        this.pausedOnSlideChange = true;
      } else {
        this.pausedOnSlideChange = false;
      }
      this.fromAuto = false;
    });
    this.core.LGel.on(`${lGEvents.afterSlide}.autoplay`, () => {
      if (this.pausedOnSlideChange && !this.running && this.settings.forceSlideShowAutoplay) {
        this.startAutoPlay();
        this.pausedOnSlideChange = false;
      }
    });
  }
  cycleDuration() {
    return this.core.settings.speed + this.settings.slideShowInterval;
  }
  /**
   * Restart the progress bar from zero. Two-phase: the bar must paint at
   * width 0 before `lg-start` lands, or a bar that was already full
   * renders full again instead of animating.
   */
  showProgressBar() {
    if (!this.settings.progressBar) {
      return;
    }
    this.resetProgressBar();
    this.progressTimer = setTimeout(() => {
      this.progressTimer = null;
      if (!this.running || this.timer === null) {
        return;
      }
      this.core.outer.find(".lg-progress").css(
        "transition",
        "width " + this.cycleDuration() + "ms ease 0s"
      );
      this.core.outer.find(".lg-progress-bar").addClass("lg-start");
    }, 20);
  }
  resetProgressBar() {
    if (this.progressTimer !== null) {
      clearTimeout(this.progressTimer);
      this.progressTimer = null;
    }
    this.core.outer.find(".lg-progress").removeAttr("style");
    this.core.outer.find(".lg-progress-bar").removeClass("lg-start");
  }
  // Manage autoplay via play/stop buttons
  controls() {
    var _a, _b;
    const _html = `<button aria-label="${(_b = (_a = this.settings.autoplayPluginStrings) == null ? void 0 : _a.toggleAutoplay) != null ? _b : this.core.settings.strings.toggleAutoplay}" type="button" class="lg-autoplay-button lg-icon"></button>`;
    this.core.outer.find(this.settings.appendAutoplayControlsTo).append(_html);
    this.core.outer.find(".lg-autoplay-button").first().on("click.lg.autoplay", () => {
      if (this.core.outer.hasClass("lg-show-autoplay")) {
        this.stopAutoPlay();
      } else {
        if (!this.running) {
          this.startAutoPlay();
        }
      }
    });
  }
  isSlideLoaded(index) {
    return this.core.getSlideItem(index).hasClass("lg-complete_");
  }
  clearTimer() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.waitingFor = null;
  }
  /**
   * Arm the countdown for the slide at `index`. A slide that is still
   * loading holds the countdown (and the progress bar at zero) until its
   * slideItemLoad arrives, so a slow connection never skips past images
   * the viewer has not seen.
   */
  schedule(index) {
    this.clearTimer();
    if (this.isSlideLoaded(index)) {
      this.countdown();
      return;
    }
    this.waitingFor = index;
    this.resetProgressBar();
  }
  countdown() {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.timer = null;
      this.advance();
    }, this.cycleDuration());
    this.showProgressBar();
  }
  advance() {
    if (this.core.lgBusy) {
      this.countdown();
      return;
    }
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
    if (this.running) {
      this.schedule(this.core.index);
    }
  }
  // Autostart gallery
  startAutoPlay() {
    if (this.running) {
      return;
    }
    this.running = true;
    this.core.outer.addClass("lg-show-autoplay");
    this.core.LGel.trigger(lGEvents.autoplayStart, {
      index: this.core.index
    });
    this.schedule(this.core.index);
  }
  // cancel Autostart
  stopAutoPlay() {
    if (this.running) {
      this.core.LGel.trigger(lGEvents.autoplayStop, {
        index: this.core.index
      });
      this.core.outer.removeClass("lg-show-autoplay");
    }
    this.running = false;
    this.clearTimer();
    this.resetProgressBar();
  }
  closeGallery() {
    this.stopAutoPlay();
  }
  destroy() {
    this.stopAutoPlay();
    if (this.settings.autoplay) {
      this.core.outer.find(".lg-progress-bar").remove();
    }
    this.core.LGel.off(".lg.autoplay");
    this.core.LGel.off(".autoplay");
  }
}
export {
  Autoplay as default
};
//# sourceMappingURL=lg-autoplay.es5.js.map
