/*!
 * lightgallery | 3.0.0-beta.3 | October 1st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
const rotateDefaultIcons = {
  rotateLeft: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M554 764.667q126-16 213-112t87-226-87-226-213-112v86q92 16 153 87t61 165-61 165-153 87v-166l-194 190 194 194v-132zM302 156.667l62 62q46-34 106-44v-86q-96 12-168 68zM260 384.667q10-58 42-106l-60-60q-56 74-68 166h86zM304 574.667q-36-52-44-106h-86q12 90 70 166z"/></svg>',
  rotateRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M720 278.667q34 46 44 106h86q-12-92-68-166zM554 174.667q60 10 106 44l62-62q-72-56-168-68v86zM850 468.667h-86q-10 60-44 106l62 60q58-72 68-166zM664 702.667l-194-190v166q-92-16-153-87t-61-165 61-165 153-87v-86q-126 16-213 112t-87 226 87 226 213 112v132z"/></svg>',
  flipHorizontal: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M896 554.667l-170-170v128h-300v84h300v128zM298 468.667v-128h300v-84h-300v-128l-170 170z"/></svg>',
  flipVertical: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M384 810.667l170-170h-128v-300h-84v300h-128zM682 212.667h128l-170-170-170 170h128v300h84v-300z"/></svg>'
};
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
  flipVertical: true
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
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let rotateIcons = "";
    if (this.settings.flipVertical) {
      rotateIcons += `<button type="button" id="lg-flip-ver" aria-label="${(_b = (_a = this.settings.rotatePluginStrings) == null ? void 0 : _a.flipVertical) != null ? _b : this.core.settings.strings.flipVertical}" class="lg-flip-ver lg-icon"></button>`;
    }
    if (this.settings.flipHorizontal) {
      rotateIcons += `<button type="button" id="lg-flip-hor" aria-label="${(_d = (_c = this.settings.rotatePluginStrings) == null ? void 0 : _c.flipHorizontal) != null ? _d : this.core.settings.strings.flipHorizontal}" class="lg-flip-hor lg-icon"></button>`;
    }
    if (this.settings.rotateLeft) {
      rotateIcons += `<button type="button" id="lg-rotate-left" aria-label="${(_f = (_e = this.settings.rotatePluginStrings) == null ? void 0 : _e.rotateLeft) != null ? _f : this.core.settings.strings.rotateLeft}" class="lg-rotate-left lg-icon"></button>`;
    }
    if (this.settings.rotateRight) {
      rotateIcons += `<button type="button" id="lg-rotate-right" aria-label="${(_h = (_g = this.settings.rotatePluginStrings) == null ? void 0 : _g.rotateRight) != null ? _h : this.core.settings.strings.rotateRight}" class="lg-rotate-right lg-icon"></button>`;
    }
    this.core.$toolbar.append(rotateIcons);
  }
  init() {
    this.core.registerDefaultIcons(rotateDefaultIcons);
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
    this.$LG(window).on(`resize.lg.rotate.global${this.core.lgId}`, () => {
      if (this.core.lgOpened && this.rotateValuesList[this.core.index] && this.isImageOrientationChanged()) {
        this.applyStyles();
      }
    });
  }
  // At 90/270 degrees the image's rendered width runs vertically, so it
  // must be scaled down to keep fitting the stage; rotation never
  // upscales. Offset dimensions ignore transforms, so measuring stays
  // correct regardless of the current rotation.
  getFitScale() {
    const rotateValue = this.rotateValuesList[this.core.index];
    const normalized = (rotateValue.rotate % 360 + 360) % 360;
    if (normalized !== 90 && normalized !== 270) {
      return 1;
    }
    const $rotateEl = this.core.getSlideItem(this.core.index).find(".lg-img-rotate").first();
    const stage = $rotateEl.get();
    const image = stage && stage.querySelector(".lg-object");
    if (!stage || !image) {
      return 1;
    }
    const imageWidth = image.offsetWidth;
    const imageHeight = image.offsetHeight;
    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;
    if (!imageWidth || !imageHeight || !stageWidth || !stageHeight) {
      return 1;
    }
    return Math.min(stageWidth / imageHeight, stageHeight / imageWidth, 1);
  }
  applyStyles() {
    const $image = this.core.getSlideItem(this.core.index).find(".lg-img-rotate").first();
    const rotateValue = this.rotateValuesList[this.core.index];
    const fitScale = this.getFitScale();
    $image.css(
      "transform",
      "rotate(" + rotateValue.rotate + "deg) scale3d(" + rotateValue.flipHorizontal * fitScale + ", " + rotateValue.flipVertical * fitScale + ", 1)"
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
    if (!this.settings.rotate) return;
    if (this.isImageOrientationChanged()) {
      this.core.getSlideItem(this.core.index).css("opacity", 0);
    }
    this.rotateValuesList = {};
  }
  destroy() {
    this.core.LGel.off(".lg.rotate");
    this.core.LGel.off(".rotate");
    this.$LG(window).off(`.lg.rotate.global${this.core.lgId}`);
  }
}
export {
  Rotate as default
};
//# sourceMappingURL=lg-rotate.es5.js.map
