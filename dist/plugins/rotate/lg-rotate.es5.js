/*!
 * lightgallery | 2.9.0 | July 21st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
const lGEvents = {
  slideItemLoad: "lgSlideItemLoad",
  beforeSlide: "lgBeforeSlide",
  rotateLeft: "lgRotateLeft",
  rotateRight: "lgRotateRight",
  flipHorizontal: "lgFlipHorizontal",
  flipVertical: "lgFlipVertical"
};
const rotateSettings = {
  rotate: true,
  rotateSpeed: 400,
  rotateLeft: true,
  rotateRight: true,
  flipHorizontal: true,
  flipVertical: true,
  rotatePluginStrings: {
    flipVertical: "Flip vertical",
    flipHorizontal: "Flip horizontal",
    rotateLeft: "Rotate left",
    rotateRight: "Rotate right"
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
class Rotate {
  constructor(instance, $LG) {
    this.core = instance;
    this.$LG = $LG;
    this.settings = __spreadValues(__spreadValues({}, rotateSettings), this.core.settings);
    return this;
  }
  buildTemplates() {
    let rotateIcons = "";
    if (this.settings.flipVertical) {
      rotateIcons += `<button type="button" id="lg-flip-ver" aria-label="${this.settings.rotatePluginStrings["flipVertical"]}" class="lg-flip-ver lg-icon"></button>`;
    }
    if (this.settings.flipHorizontal) {
      rotateIcons += `<button type="button" id="lg-flip-hor" aria-label="${this.settings.rotatePluginStrings["flipHorizontal"]}" class="lg-flip-hor lg-icon"></button>`;
    }
    if (this.settings.rotateLeft) {
      rotateIcons += `<button type="button" id="lg-rotate-left" aria-label="${this.settings.rotatePluginStrings["rotateLeft"]}" class="lg-rotate-left lg-icon"></button>`;
    }
    if (this.settings.rotateRight) {
      rotateIcons += `<button type="button" id="lg-rotate-right" aria-label="${this.settings.rotatePluginStrings["rotateRight"]}" class="lg-rotate-right lg-icon"></button>`;
    }
    this.core.$toolbar.append(rotateIcons);
  }
  init() {
    if (!this.settings.rotate) {
      return;
    }
    this.buildTemplates();
    this.rotateValuesList = {};
    this.core.LGel.on(`${lGEvents.slideItemLoad}.rotate`, (event) => {
      const { index } = event.detail;
      const rotateEl = this.core.getSlideItem(index).find(".lg-img-rotate").get();
      if (!rotateEl) {
        const imageWrap = this.core.getSlideItem(index).find(".lg-object").first();
        imageWrap.wrap("lg-img-rotate");
        this.core.getSlideItem(this.core.index).find(".lg-img-rotate").css(
          "transition-duration",
          this.settings.rotateSpeed + "ms"
        );
      }
    });
    this.core.outer.find("#lg-rotate-left").first().on("click.lg", this.rotateLeft.bind(this));
    this.core.outer.find("#lg-rotate-right").first().on("click.lg", this.rotateRight.bind(this));
    this.core.outer.find("#lg-flip-hor").first().on("click.lg", this.flipHorizontal.bind(this));
    this.core.outer.find("#lg-flip-ver").first().on("click.lg", this.flipVertical.bind(this));
    this.core.LGel.on(`${lGEvents.beforeSlide}.rotate`, (event) => {
      if (!this.rotateValuesList[event.detail.index]) {
        this.rotateValuesList[event.detail.index] = {
          rotate: 0,
          flipHorizontal: 1,
          flipVertical: 1
        };
      }
    });
  }
  applyStyles() {
    const $image = this.core.getSlideItem(this.core.index).find(".lg-img-rotate").first();
    $image.css(
      "transform",
      "rotate(" + this.rotateValuesList[this.core.index].rotate + "deg) scale3d(" + this.rotateValuesList[this.core.index].flipHorizontal + ", " + this.rotateValuesList[this.core.index].flipVertical + ", 1)"
    );
  }
  rotateLeft() {
    this.rotateValuesList[this.core.index].rotate -= 90;
    this.applyStyles();
    this.triggerEvents(lGEvents.rotateLeft, {
      rotate: this.rotateValuesList[this.core.index].rotate
    });
  }
  rotateRight() {
    this.rotateValuesList[this.core.index].rotate += 90;
    this.applyStyles();
    this.triggerEvents(lGEvents.rotateRight, {
      rotate: this.rotateValuesList[this.core.index].rotate
    });
  }
  getCurrentRotation(el) {
    if (!el) {
      return 0;
    }
    const st = this.$LG(el).style();
    const tm = st.getPropertyValue("-webkit-transform") || st.getPropertyValue("-moz-transform") || st.getPropertyValue("-ms-transform") || st.getPropertyValue("-o-transform") || st.getPropertyValue("transform") || "none";
    if (tm !== "none") {
      const values = tm.split("(")[1].split(")")[0].split(",");
      if (values) {
        const angle = Math.round(
          Math.atan2(values[1], values[0]) * (180 / Math.PI)
        );
        return angle < 0 ? angle + 360 : angle;
      }
    }
    return 0;
  }
  flipHorizontal() {
    const rotateEl = this.core.getSlideItem(this.core.index).find(".lg-img-rotate").first().get();
    const currentRotation = this.getCurrentRotation(rotateEl);
    let rotateAxis = "flipHorizontal";
    if (currentRotation === 90 || currentRotation === 270) {
      rotateAxis = "flipVertical";
    }
    this.rotateValuesList[this.core.index][rotateAxis] *= -1;
    this.applyStyles();
    this.triggerEvents(lGEvents.flipHorizontal, {
      flipHorizontal: this.rotateValuesList[this.core.index][rotateAxis]
    });
  }
  flipVertical() {
    const rotateEl = this.core.getSlideItem(this.core.index).find(".lg-img-rotate").first().get();
    const currentRotation = this.getCurrentRotation(rotateEl);
    let rotateAxis = "flipVertical";
    if (currentRotation === 90 || currentRotation === 270) {
      rotateAxis = "flipHorizontal";
    }
    this.rotateValuesList[this.core.index][rotateAxis] *= -1;
    this.applyStyles();
    this.triggerEvents(lGEvents.flipVertical, {
      flipVertical: this.rotateValuesList[this.core.index][rotateAxis]
    });
  }
  triggerEvents(event, detail) {
    setTimeout(() => {
      this.core.LGel.trigger(event, detail);
    }, this.settings.rotateSpeed + 10);
  }
  isImageOrientationChanged() {
    const rotateValue = this.rotateValuesList[this.core.index];
    const isRotated = Math.abs(rotateValue.rotate) % 360 !== 0;
    const ifFlippedHor = rotateValue.flipHorizontal < 0;
    const ifFlippedVer = rotateValue.flipVertical < 0;
    return isRotated || ifFlippedHor || ifFlippedVer;
  }
  closeGallery() {
    if (this.isImageOrientationChanged()) {
      this.core.getSlideItem(this.core.index).css("opacity", 0);
    }
    this.rotateValuesList = {};
  }
  destroy() {
    this.core.LGel.off(".lg.rotate");
    this.core.LGel.off(".rotate");
  }
}
export {
  Rotate as default
};
//# sourceMappingURL=lg-rotate.es5.js.map
