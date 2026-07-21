/*!
 * lightgallery | 2.9.0 | July 21st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
const lGEvents = {
  beforeOpen: "lgBeforeOpen"
};
const mediumZoomSettings = {
  margin: 40,
  mediumZoom: true,
  backgroundColor: "#000"
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
class MediumZoom {
  constructor(instance, $LG) {
    this.core = instance;
    this.$LG = $LG;
    this.core.getMediaContainerPosition = () => {
      return {
        top: this.settings.margin,
        bottom: this.settings.margin
      };
    };
    const defaultSettings = {
      controls: false,
      download: false,
      counter: false,
      showCloseIcon: false,
      extraProps: ["lgBackgroundColor"],
      closeOnTap: false,
      enableSwipe: false,
      enableDrag: false,
      swipeToClose: false,
      addClass: this.core.settings.addClass + " lg-medium-zoom"
    };
    this.core.settings = __spreadValues(__spreadValues({}, this.core.settings), defaultSettings);
    this.settings = __spreadValues(__spreadValues(__spreadValues({}, mediumZoomSettings), this.core.settings), defaultSettings);
    return this;
  }
  toggleItemClass() {
    for (let index = 0; index < this.core.items.length; index++) {
      const $element = this.$LG(this.core.items[index]);
      $element.toggleClass("lg-medium-zoom-item");
    }
  }
  init() {
    if (!this.settings.mediumZoom) {
      return;
    }
    this.core.LGel.on(`${lGEvents.beforeOpen}.medium`, () => {
      this.core.$backdrop.css(
        "background-color",
        this.core.galleryItems[this.core.index].lgBackgroundColor || this.settings.backgroundColor
      );
    });
    this.toggleItemClass();
    this.core.outer.on("click.lg.medium", () => {
      this.core.closeGallery();
    });
  }
  destroy() {
    this.toggleItemClass();
  }
}
export {
  MediumZoom as default
};
//# sourceMappingURL=lg-medium-zoom.es5.js.map
