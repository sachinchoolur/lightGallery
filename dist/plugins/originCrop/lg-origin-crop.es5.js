/*!
 * lightgallery | 3.0.0-beta.5 | October 8th 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
function isUsableOriginRect(rect) {
  return !!rect && Number.isFinite(rect.left) && Number.isFinite(rect.top) && rect.width > 0 && rect.height > 0;
}
function getOriginTransform(input) {
  const { triggerRect, containerRect, top, bottom, imageSize } = input;
  const availableWidth = containerRect.width;
  const availableHeight = containerRect.height - (top + bottom);
  const x = (availableWidth - triggerRect.width) / 2 - triggerRect.left + containerRect.left;
  const y = (availableHeight - triggerRect.height) / 2 - triggerRect.top + top;
  const scaleX = triggerRect.width / imageSize.width;
  const scaleY = triggerRect.height / imageSize.height;
  return `translate3d(${-x}px, ${-y}px, 0) scale3d(${scaleX}, ${scaleY}, 1)`;
}
const WHOLE_IMAGE = { x: 0, y: 0, width: 1, height: 1 };
const FRACTION_EPSILON = 1e-3;
function isWholeImage(rect) {
  return Math.abs(rect.x) < FRACTION_EPSILON && Math.abs(rect.y) < FRACTION_EPSILON && Math.abs(rect.width - 1) < FRACTION_EPSILON && Math.abs(rect.height - 1) < FRACTION_EPSILON;
}
const CENTER_AXIS = { percent: 50, px: 0 };
const CSS_POSITION_CENTER = {
  x: CENTER_AXIS,
  y: CENTER_AXIS
};
const POSITION_KEYWORDS = {
  left: 0,
  top: 0,
  center: 50,
  right: 100,
  bottom: 100
};
function parsePositionAxis(token) {
  const keyword = POSITION_KEYWORDS[token];
  if (keyword !== void 0) {
    return { percent: keyword, px: 0 };
  }
  const percent = /^(-?\d*\.?\d+)%$/.exec(token);
  if (percent) {
    return { percent: parseFloat(percent[1]), px: 0 };
  }
  const px = /^(-?\d*\.?\d+)px$/.exec(token);
  if (px) {
    return { percent: 0, px: parseFloat(px[1]) };
  }
  const calc = /^calc\(\s*(-?\d*\.?\d+)%\s*([+-])\s*(-?\d*\.?\d+)px\s*\)$/.exec(token);
  if (calc) {
    const sign = calc[2] === "-" ? -1 : 1;
    return {
      percent: parseFloat(calc[1]),
      px: sign * parseFloat(calc[3])
    };
  }
  return void 0;
}
function parseCssPosition(value) {
  var _a, _b;
  const layer = (value != null ? value : "").split(",")[0].trim().toLowerCase();
  if (!layer) {
    return CSS_POSITION_CENTER;
  }
  const tokens = (_a = layer.match(/calc\([^)]*\)|\S+/g)) != null ? _a : [];
  if (tokens.length === 2 && (tokens[0] === "top" || tokens[0] === "bottom") && (tokens[1] === "left" || tokens[1] === "right")) {
    tokens.reverse();
  }
  const x = parsePositionAxis((_b = tokens[0]) != null ? _b : "");
  const y = tokens[1] === void 0 ? CENTER_AXIS : parsePositionAxis(tokens[1]);
  if (!x || !y) {
    return CSS_POSITION_CENTER;
  }
  return { x, y };
}
function parseObjectFit(value) {
  const fit = (value != null ? value : "").trim().toLowerCase();
  switch (fit) {
    case "contain":
    case "cover":
    case "none":
    case "scale-down":
      return fit;
    default:
      return "fill";
  }
}
function parseBackgroundFit(value) {
  const layer = (value != null ? value : "").split(",")[0].trim().toLowerCase();
  switch (layer) {
    case "cover":
    case "contain":
      return layer;
    case "auto":
    case "auto auto":
      return "none";
    case "100% 100%":
      return "fill";
    default:
      return void 0;
  }
}
function parseCssUrl(value) {
  var _a;
  const match = /url\(\s*(["']?)(.*?)\1\s*\)/.exec(value != null ? value : "");
  const url = (_a = match == null ? void 0 : match[2]) == null ? void 0 : _a.trim();
  return url || void 0;
}
const ASPECT_EPSILON = 0.01;
function aspectOf(size) {
  return size.width / size.height;
}
function sameAspect(a, b) {
  return Math.abs(a / b - 1) < ASPECT_EPSILON;
}
function centeredCrop(imageAspect, cropAspect) {
  if (sameAspect(imageAspect, cropAspect)) {
    return WHOLE_IMAGE;
  }
  if (cropAspect > imageAspect) {
    const height = imageAspect / cropAspect;
    return { x: 0, y: (1 - height) / 2, width: 1, height };
  }
  const width = cropAspect / imageAspect;
  return { x: (1 - width) / 2, y: 0, width, height: 1 };
}
function resolvePositionAxis(axis, freeSpace) {
  return freeSpace * axis.percent / 100 + axis.px;
}
const uncropped = (box) => ({
  rect: box,
  window: WHOLE_IMAGE,
  region: WHOLE_IMAGE
});
function getOriginWindow(input) {
  var _a;
  const { box, imageSize, thumbSize, position = CSS_POSITION_CENTER } = input;
  let fit = (_a = input.fit) != null ? _a : "fill";
  if (!isUsableOriginRect(box) || !(imageSize.width > 0) || !(imageSize.height > 0)) {
    return uncropped(box);
  }
  const imageAspect = aspectOf(imageSize);
  const knownThumb = thumbSize && thumbSize.width > 0 && thumbSize.height > 0 ? thumbSize : void 0;
  if (!knownThumb && (fit === "none" || fit === "scale-down")) {
    fit = "fill";
  }
  const thumb = knownThumb != null ? knownThumb : imageSize;
  const region = centeredCrop(imageAspect, aspectOf(thumb));
  let scaleX;
  let scaleY;
  switch (fit) {
    case "fill":
      scaleX = box.width / thumb.width;
      scaleY = box.height / thumb.height;
      break;
    case "cover":
      scaleX = scaleY = Math.max(
        box.width / thumb.width,
        box.height / thumb.height
      );
      break;
    case "contain":
      scaleX = scaleY = Math.min(
        box.width / thumb.width,
        box.height / thumb.height
      );
      break;
    case "none":
      scaleX = scaleY = 1;
      break;
    case "scale-down":
      scaleX = scaleY = Math.min(
        1,
        box.width / thumb.width,
        box.height / thumb.height
      );
      break;
  }
  const paintedWidth = thumb.width * scaleX;
  const paintedHeight = thumb.height * scaleY;
  const offsetX = resolvePositionAxis(position.x, box.width - paintedWidth);
  const offsetY = resolvePositionAxis(position.y, box.height - paintedHeight);
  const visibleLeft = Math.max(0, offsetX);
  const visibleTop = Math.max(0, offsetY);
  const visibleRight = Math.min(box.width, offsetX + paintedWidth);
  const visibleBottom = Math.min(box.height, offsetY + paintedHeight);
  if (visibleRight <= visibleLeft || visibleBottom <= visibleTop) {
    return uncropped(box);
  }
  const rect = {
    left: box.left + visibleLeft,
    top: box.top + visibleTop,
    width: visibleRight - visibleLeft,
    height: visibleBottom - visibleTop
  };
  const fileX = (visibleLeft - offsetX) / paintedWidth;
  const fileY = (visibleTop - offsetY) / paintedHeight;
  const window2 = {
    x: region.x + fileX * region.width,
    y: region.y + fileY * region.height,
    width: rect.width / paintedWidth * region.width,
    height: rect.height / paintedHeight * region.height
  };
  return { rect, window: window2, region };
}
function getOriginCropFlight(input) {
  const { triggerRect, containerRect, top, bottom, imageSize, window: window2 } = input;
  const stageLeft = containerRect.left;
  const stageTop = containerRect.top + top;
  const stageWidth = containerRect.width;
  const stageHeight = containerRect.height - (top + bottom);
  const outerX = triggerRect.left + triggerRect.width - (stageLeft + stageWidth);
  const outerY = triggerRect.top + triggerRect.height - (stageTop + stageHeight);
  const innerX = stageWidth - triggerRect.width;
  const innerY = stageHeight - triggerRect.height;
  const scaleX = triggerRect.width / (imageSize.width * window2.width);
  const scaleY = triggerRect.height / (imageSize.height * window2.height);
  const windowX = imageSize.width * (window2.x + window2.width / 2 - 0.5);
  const windowY = imageSize.height * (window2.y + window2.height / 2 - 0.5);
  const x = (triggerRect.width - stageWidth) / 2 - windowX * scaleX;
  const y = (triggerRect.height - stageHeight) / 2 - windowY * scaleY;
  return {
    transform: `translate3d(${x}px, ${y}px, 0) scale3d(${scaleX}, ${scaleY}, 1)`,
    outer: `translate3d(${outerX}px, ${outerY}px, 0)`,
    inner: `translate3d(${innerX}px, ${innerY}px, 0)`
  };
}
const lGEvents = {
  beforeOpen: "lgBeforeOpen",
  beforeClose: "lgBeforeClose",
  afterClose: "lgAfterClose"
};
const originCropSettings = {
  originCrop: true
};
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const STAGE_REST = "translate3d(0, 0, 0)";
const SLIDE_REST = /^(none|translate3d\(0(px)?,\s*0(px)?,\s*0(px)?\))$/;
const FLIP_GRACE = 300;
const TIMING_FUNCTIONS = /[a-z-]+\([^)]*\)|[a-z-]+/gi;
const RECT_EPSILON = 0.5;
function sameRect(a, b) {
  return Math.abs(a.left - b.left) < RECT_EPSILON && Math.abs(a.top - b.top) < RECT_EPSILON && Math.abs(a.width - b.width) < RECT_EPSILON && Math.abs(a.height - b.height) < RECT_EPSILON;
}
function getThumbPaint(thumb, style) {
  if (thumb instanceof HTMLImageElement) {
    return {
      thumbSize: thumb.naturalWidth > 0 ? {
        width: thumb.naturalWidth,
        height: thumb.naturalHeight
      } : void 0,
      fit: parseObjectFit(style.getPropertyValue("object-fit")),
      position: parseCssPosition(
        style.getPropertyValue("object-position")
      )
    };
  }
  return {
    fit: parseBackgroundFit(style.getPropertyValue("background-size")) || "fill",
    position: parseCssPosition(
      style.getPropertyValue("background-position")
    )
  };
}
function getTransformTransition(el, fallbackDuration) {
  const style = window.getComputedStyle(el);
  const properties = style.getPropertyValue("transition-property").split(",").map((property) => property.trim());
  const durations = style.getPropertyValue("transition-duration").split(",").map((duration) => duration.trim());
  const easings = style.getPropertyValue("transition-timing-function").match(TIMING_FUNCTIONS) || [];
  let index = properties.indexOf("transform");
  if (index < 0) {
    index = Math.max(0, properties.indexOf("all"));
  }
  return {
    duration: durations[index % durations.length] || fallbackDuration,
    easing: easings.length ? easings[index % easings.length] : "ease"
  };
}
function createStageBox() {
  const box = document.createElement("div");
  box.className = "lg-origin-crop";
  box.style.position = "absolute";
  box.style.top = "0";
  box.style.right = "0";
  box.style.bottom = "0";
  box.style.left = "0";
  return box;
}
class OriginCrop {
  constructor(instance) {
    this.closing = false;
    this.stageMoved = false;
    this.core = instance;
    this.settings = __spreadValues(__spreadValues({}, originCropSettings), this.core.settings);
    return this;
  }
  init() {
    if (!this.settings.originCrop) {
      return;
    }
    this.wrapStage();
    this.patchCore();
    this.core.LGel.on(
      `${lGEvents.beforeOpen}.originCrop`,
      () => this.onBeforeOpen()
    );
    this.core.LGel.on(
      `${lGEvents.beforeClose}.originCrop`,
      () => this.onBeforeClose()
    );
    this.core.LGel.on(
      `${lGEvents.afterClose}.originCrop`,
      () => this.onAfterClose()
    );
  }
  destroy() {
    this.stopFollowing();
    this.core.LGel.off(".originCrop");
    this.resetStage();
    this.unwrapStage();
    if (this.restoreCore) {
      this.restoreCore();
      this.restoreCore = void 0;
    }
    this.flight = void 0;
  }
  /**
   * Takes over the core's flight hooks: the flight's transform, and the
   * dummy that flies in place of the loading image.
   */
  patchCore() {
    const core = this.core;
    const getCoreTransform = core.getOriginTransform;
    const getCoreDummyStyles = core.getDummyImgStyles;
    const getCoreDummy = core.getDummyImageContent;
    core.getOriginTransform = (element, imageSize) => {
      const flight = this.getFlight(element, imageSize);
      this.flight = flight;
      if (this.closing) {
        this.followClose();
      }
      return flight ? flight.transform : getCoreTransform.call(core, element, imageSize);
    };
    core.getDummyImgStyles = (imageSize) => {
      const region = this.flight && this.flight.region;
      if (!imageSize || !region || isWholeImage(region)) {
        return getCoreDummyStyles.call(core, imageSize);
      }
      return `width:${imageSize.width * region.width}px;
                margin-left: ${imageSize.width * (region.x - 0.5)}px;
                margin-top: ${imageSize.height * (region.y - 0.5)}px;
                height:${imageSize.height * region.height}px`;
    };
    core.getDummyImageContent = ($currentSlide, index, alt) => {
      const content = getCoreDummy.call(core, $currentSlide, index, alt);
      const flight = this.flight;
      if (content || !flight || !flight.dummySrc || core.items[index] !== flight.element) {
        return content;
      }
      const dummy = document.createElement("img");
      dummy.alt = alt || "";
      dummy.src = flight.dummySrc;
      dummy.className = "lg-dummy-img";
      dummy.style.cssText = core.getDummyImgStyles(core.currentImageSize);
      $currentSlide.addClass("lg-first-slide");
      core.outer.addClass("lg-first-slide-loading");
      return dummy;
    };
    this.restoreCore = () => {
      core.getOriginTransform = getCoreTransform;
      core.getDummyImgStyles = getCoreDummyStyles;
      core.getDummyImageContent = getCoreDummy;
    };
  }
  /**
   * The flight from (or back to) a trigger, when the built-in flight
   * cannot land it exactly: a cropped thumbnail, one letterboxed in its
   * box, or a background thumbnail. Undefined otherwise, and the core
   * flies as it always does.
   */
  getFlight(element, imageSize) {
    if (!imageSize || !(imageSize.width > 0) || !(imageSize.height > 0)) {
      return;
    }
    const img = element.querySelector("img");
    const thumb = img || element;
    const bounds = thumb.getBoundingClientRect();
    const box = {
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height
    };
    if (!isUsableOriginRect(box)) {
      return;
    }
    const style = window.getComputedStyle(thumb);
    const dummySrc = img ? void 0 : parseCssUrl(style.getPropertyValue("background-image"));
    if (!img && !dummySrc) {
      return;
    }
    const origin = getOriginWindow(__spreadValues({
      box,
      imageSize
    }, getThumbPaint(thumb, style)));
    const cropped = !isWholeImage(origin.window);
    if (img && !cropped && sameRect(origin.rect, box)) {
      return;
    }
    const outerRect = this.core.outer.get().getBoundingClientRect();
    const containerRect = {
      left: outerRect.left,
      top: outerRect.top,
      width: outerRect.width,
      // Element height, as the core measures it.
      height: this.core.outer.height()
    };
    const { top, bottom } = this.core.mediaContainerPosition;
    const flight = { element, region: origin.region, dummySrc };
    if (!cropped) {
      return __spreadProps(__spreadValues({}, flight), {
        transform: getOriginTransform({
          triggerRect: origin.rect,
          containerRect,
          top,
          bottom,
          imageSize
        })
      });
    }
    const crop = getOriginCropFlight({
      triggerRect: origin.rect,
      containerRect,
      top,
      bottom,
      imageSize,
      window: origin.window
    });
    return __spreadProps(__spreadValues({}, flight), {
      transform: crop.transform,
      stage: { outer: crop.outer, inner: crop.inner }
    });
  }
  /**
   * The opening flight, whose transform the core has just asked for. For
   * a cropped thumbnail the stage crops to the thumbnail before anything
   * shows (the gallery is still transparent), then follows the slide.
   */
  onBeforeOpen() {
    const stage = this.flight && this.flight.stage;
    if (!stage || !this.outerBox) {
      return;
    }
    this.setStage(stage.outer, stage.inner);
    this.outerBox.getBoundingClientRect();
    this.followOpen(this.core.getSlideItem(this.core.index).get());
  }
  /**
   * Follows the opening slide with the stage. Mutation records are
   * delivered at the end of the task that made them, before the browser
   * renders, so the stage moves in the same frame as each of the core's
   * steps: when the core flips the slide to rest, the stage opens with it
   * on the slide's duration and easing; when the core settles the flight,
   * the stage lets go.
   */
  followOpen(slide) {
    this.stopFollowing();
    let flipped = false;
    this.observer = new MutationObserver(() => {
      const flying = slide.classList.contains("lg-start-end-progress");
      if (!flipped && flying && SLIDE_REST.test(slide.style.transform.trim())) {
        flipped = true;
        clearTimeout(this.flipGrace);
        this.setStage(
          STAGE_REST,
          STAGE_REST,
          this.getSlideTransition(slide)
        );
      } else if (flipped && !flying) {
        this.stopFollowing();
        this.resetStage();
      }
    });
    this.observer.observe(slide, {
      attributes: true,
      attributeFilter: ["class", "style"]
    });
    this.flipGrace = setTimeout(() => {
      if (!flipped) {
        this.stopFollowing();
        this.resetStage();
      }
    }, this.core.settings.startAnimationDuration + FLIP_GRACE);
  }
  onBeforeClose() {
    this.stopFollowing();
    this.closing = true;
  }
  /**
   * The closing flight, whose transform the core has just asked for. The
   * core puts the slide on it right after, in the same task; once it has,
   * the stage follows on the slide's duration and easing: onto the
   * thumbnail's box for a cropped thumbnail, else back to rest if an
   * opening flight left it cropped.
   */
  followClose() {
    const stage = this.flight && this.flight.stage;
    if (!stage && !this.stageMoved) {
      return;
    }
    void Promise.resolve().then(() => {
      const slide = this.core.getSlideItem(this.core.index).get();
      if (!this.closing || !slide) {
        return;
      }
      this.setStage(
        stage ? stage.outer : STAGE_REST,
        stage ? stage.inner : STAGE_REST,
        this.getSlideTransition(slide)
      );
    });
  }
  onAfterClose() {
    this.resetStage();
    this.closing = false;
    this.flight = void 0;
  }
  getSlideTransition(slide) {
    return getTransformTransition(
      slide,
      this.core.settings.startAnimationDuration + "ms"
    );
  }
  /**
   * Crops the stage: both boxes hide their overflow and take their
   * transforms, instantly or on a transition.
   */
  setStage(outer, inner, transition) {
    const boxes = [
      [this.outerBox, outer],
      [this.innerBox, inner]
    ];
    boxes.forEach(([box, transform]) => {
      if (!box) {
        return;
      }
      box.style.overflow = "hidden";
      box.style.transitionProperty = transition ? "transform" : "none";
      box.style.transitionDuration = transition ? transition.duration : "";
      box.style.transitionTimingFunction = transition ? transition.easing : "";
      box.style.transform = transform;
    });
    this.stageMoved = true;
  }
  /** Lets go of the crop: the boxes are inert again. */
  resetStage() {
    [this.outerBox, this.innerBox].forEach((box) => {
      if (!box) {
        return;
      }
      box.style.overflow = "";
      box.style.transitionProperty = "";
      box.style.transitionDuration = "";
      box.style.transitionTimingFunction = "";
      box.style.transform = "";
    });
    this.stageMoved = false;
  }
  stopFollowing() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = void 0;
    }
    clearTimeout(this.flipGrace);
    this.flipGrace = void 0;
  }
  wrapStage() {
    const inner = this.core.$inner.get();
    const parent = inner && inner.parentNode;
    if (!parent) {
      return;
    }
    this.outerBox = createStageBox();
    this.innerBox = createStageBox();
    parent.insertBefore(this.outerBox, inner);
    this.outerBox.appendChild(this.innerBox);
    this.innerBox.appendChild(inner);
  }
  unwrapStage() {
    const inner = this.core.$inner.get();
    const outerBox = this.outerBox;
    if (outerBox && inner && outerBox.parentNode) {
      outerBox.parentNode.insertBefore(inner, outerBox);
      outerBox.remove();
    }
    this.outerBox = void 0;
    this.innerBox = void 0;
  }
}
export {
  OriginCrop as default
};
//# sourceMappingURL=lg-origin-crop.es5.js.map
