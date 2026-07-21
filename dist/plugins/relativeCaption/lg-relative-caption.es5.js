/*!
 * lightgallery | 2.9.0 | July 21st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
const lGEvents = {
  containerResize: "lgContainerResize",
  slideItemLoad: "lgSlideItemLoad",
  beforeSlide: "lgBeforeSlide",
  afterSlide: "lgAfterSlide"
};
const relativeCaptionSettings = {
  relativeCaption: false
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
class RelativeCaption {
  constructor(instance) {
    this.core = instance;
    const defaultSettings = {
      addClass: this.core.settings.addClass + " lg-relative-caption"
    };
    this.core.settings = __spreadValues(__spreadValues({}, this.core.settings), defaultSettings);
    this.settings = __spreadValues(__spreadValues(__spreadValues({}, relativeCaptionSettings), this.core.settings), defaultSettings);
    return this;
  }
  init() {
    if (!this.settings.relativeCaption) {
      return;
    }
    this.core.LGel.on(`${lGEvents.slideItemLoad}.caption`, (event) => {
      const { index, delay } = event.detail;
      setTimeout(() => {
        if (index === this.core.index) {
          this.setRelativeCaption(index);
        }
      }, delay);
    });
    this.core.LGel.on(`${lGEvents.afterSlide}.caption`, (event) => {
      const { index } = event.detail;
      setTimeout(() => {
        const slide = this.core.getSlideItem(index);
        if (slide.hasClass("lg-complete")) {
          this.setRelativeCaption(index);
        }
      });
    });
    this.core.LGel.on(`${lGEvents.beforeSlide}.caption`, (event) => {
      const { index } = event.detail;
      setTimeout(() => {
        const slide = this.core.getSlideItem(index);
        slide.removeClass("lg-show-caption");
      });
    });
    this.core.LGel.on(`${lGEvents.containerResize}.caption`, (event) => {
      this.setRelativeCaption(this.core.index);
    });
  }
  setCaptionStyle(index, rect, slideWrapRect) {
    const $subHtmlInner = this.core.getSlideItem(index).find(".lg-relative-caption-item");
    const $subHtml = this.core.getSlideItem(index).find(".lg-sub-html");
    $subHtml.css("width", `${rect.width}px`).css("left", `${rect.left}px`);
    const subHtmlRect = $subHtmlInner.get().getBoundingClientRect();
    const bottom = slideWrapRect.bottom - rect.bottom - subHtmlRect.height;
    $subHtml.css("top", `auto`).css("bottom", `${Math.max(bottom, 0)}px`);
  }
  setRelativeCaption(index) {
    const slide = this.core.getSlideItem(index);
    if (slide.hasClass("lg-current")) {
      const rect = this.core.getSlideItem(index).find(".lg-object").get().getBoundingClientRect();
      const slideWrapRect = this.core.getSlideItem(index).get().getBoundingClientRect();
      this.setCaptionStyle(index, rect, slideWrapRect);
      slide.addClass("lg-show-caption");
    }
  }
  destroy() {
    this.core.LGel.off(".caption");
  }
}
export {
  RelativeCaption as default
};
//# sourceMappingURL=lg-relative-caption.es5.js.map
