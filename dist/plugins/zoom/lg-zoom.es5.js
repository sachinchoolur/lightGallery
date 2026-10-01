/*!
 * lightgallery | 3.0.0-beta.2 | October 1st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
const SPRING_SETTLE_DAMPING = 1;
const SPRING_BOUNCE_DAMPING = 0.82;
const SPRING_NATURAL_FREQUENCY = 12;
const DECELERATION_RATE = 0.995;
function project(velocity, decelerationRate = DECELERATION_RATE) {
  return velocity * decelerationRate / (1 - decelerationRate);
}
function stepSpring(state, target, dtMs, {
  dampingRatio = SPRING_SETTLE_DAMPING,
  naturalFrequency = SPRING_NATURAL_FREQUENCY
} = {}) {
  const t = dtMs / 1e3;
  const w0 = naturalFrequency;
  const zeta = Math.min(dampingRatio, 1);
  const x0 = state.position - target;
  const v0 = state.velocity * 1e3;
  const decay = Math.exp(-zeta * w0 * t);
  let x;
  let v;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    const a = x0;
    const b = (v0 + zeta * w0 * x0) / wd;
    const cos = Math.cos(wd * t);
    const sin = Math.sin(wd * t);
    x = decay * (a * cos + b * sin);
    v = decay * ((b * wd - zeta * w0 * a) * cos - (a * wd + zeta * w0 * b) * sin);
  } else {
    const b = v0 + w0 * x0;
    x = decay * (x0 + b * t);
    v = decay * (b - w0 * (x0 + b * t));
  }
  return { position: target + x, velocity: v / 1e3 };
}
function isSpringSettled(state, target, restDelta = 0.3, restVelocity = 0.012) {
  return Math.abs(state.position - target) < restDelta && Math.abs(state.velocity) < restVelocity;
}
function parseImageSize(lgSize, viewportWidth) {
  if (!lgSize) {
    return void 0;
  }
  let size = lgSize;
  const responsiveSizes = lgSize.split(",");
  if (responsiveSizes[1]) {
    for (let i = 0; i < responsiveSizes.length; i++) {
      const candidate = responsiveSizes[i].trim();
      const responsiveWidth = parseInt(candidate.split("-")[2], 10);
      if (responsiveWidth > viewportWidth) {
        size = candidate;
        break;
      }
      if (i === responsiveSizes.length - 1) {
        size = candidate;
      }
    }
  }
  const parts = size.trim().split("-");
  const width = parseInt(parts[0], 10);
  const height = parseInt(parts[1], 10);
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return void 0;
  }
  return { width, height };
}
function fitImageSize(size, containerWidth, containerHeight) {
  const maxWidth = Math.min(containerWidth, size.width);
  const maxHeight = Math.min(containerHeight, size.height);
  const ratio = Math.min(maxWidth / size.width, maxHeight / size.height);
  return { width: size.width * ratio, height: size.height * ratio };
}
const zoomDefaultIcons = {
  zoomIn: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M512 512.667h-86v-86h-42v86h-86v42h86v86h42v-86h86v-42zM406 340.667q80 0 136 56t56 136-56 136-136 56-136-56-56-136 56-136 136-56zM662 340.667l212-212-64-64-212 212v34l-12 12q-76-66-180-66-116 0-197 80t-81 196 81 197 197 81 196-81 80-197q0-104-66-180l12-12h34z"/></svg>',
  zoomOut: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M298 554.667h214v-42h-214v42zM406 340.667q80 0 136 56t56 136-56 136-136 56-136-56-56-136 56-136 136-56zM662 340.667l212-212-64-64-212 212v34l-12 12q-76-66-180-66-116 0-197 80t-81 196 81 197 197 81 196-81 80-197q0-104-66-180l12-12h34z"/></svg>',
  actualSize: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M384 853.334h426.667q53 0 90.5-37.5t37.5-90.5v-426.667q0-53-37.5-90.5t-90.5-37.5h-426.667q-53 0-90.5 37.5t-37.5 90.5v426.667q0 53 37.5 90.5t90.5 37.5zM170.667 675.334v-547.333q0-17.667 12.5-30.167t30.167-12.5h547.333q-13.333-37.667-46.333-61.5t-74.333-23.833h-426.667q-53 0-90.5 37.5t-37.5 90.5v426.667q0 41.333 23.833 74.333t61.5 46.333zM810.667 768h-426.667q-17.667 0-30.167-12.5t-12.5-30.167v-426.667q0-17.667 12.5-30.167t30.167-12.5h426.667q17.667 0 30.167 12.5t12.5 30.167v426.667q0 17.667-12.5 30.167t-30.167 12.5z"/></svg>'
};
function getPanBounds(imageWidth, imageHeight, containerWidth, containerHeight, scale) {
  return {
    maxX: Math.max(0, (imageWidth * scale - containerWidth) / 2),
    maxY: Math.max(0, (imageHeight * scale - containerHeight) / 2)
  };
}
function getActualSizeScale(naturalWidth, renderedWidth) {
  if (!renderedWidth) {
    return 2;
  }
  return naturalWidth / renderedWidth || 2;
}
function getPointZoomPan(point, prevPan, prevScale, newScale) {
  const ratio = newScale / prevScale;
  return {
    x: point.x - (point.x - prevPan.x) * ratio,
    y: point.y - (point.y - prevPan.y) * ratio
  };
}
function clampPanToStage(pan, bounds, stageBottomExtra) {
  const floorY = Math.min(-bounds.maxY + stageBottomExtra, bounds.maxY);
  return {
    x: Math.min(Math.max(pan.x, -bounds.maxX), bounds.maxX),
    y: Math.min(Math.max(pan.y, floorY), bounds.maxY)
  };
}
function getPinchPan(currentMid, startMid, startPan, startScale, scale) {
  const projected = getPointZoomPan(startMid, startPan, startScale, scale);
  return {
    x: projected.x + (currentMid.x - startMid.x),
    y: projected.y + (currentMid.y - startMid.y)
  };
}
function getPointerDistance(a, b) {
  return Math.sqrt(
    (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)
  );
}
const PINCH_UNDER_FRICTION = 0.15;
const PINCH_OVER_FRICTION = 0.05;
function getPinchScale(startDistance, currentDistance, startScale, maxScale, infiniteZoom, pinchToCloseArmed = false) {
  if (startDistance <= 0) {
    return startScale;
  }
  let scale = currentDistance / startDistance * startScale;
  if (scale < 1 && !pinchToCloseArmed) {
    scale = 1 + (scale - 1) * PINCH_UNDER_FRICTION;
  }
  const cap = Math.max(maxScale, 1);
  if (!infiniteZoom && scale > cap) {
    scale = cap + (scale - cap) * PINCH_OVER_FRICTION;
  }
  return scale;
}
function shouldCloseOnPinch(input) {
  return input.pinchToClose && input.closable && input.scale < 1 && input.maxGestureScale <= 1;
}
function parseSrcset(srcset) {
  const candidates = [];
  if (typeof srcset !== "string") {
    return candidates;
  }
  for (const entry of srcset.split(",")) {
    const parts = entry.trim().split(/\s+/);
    const url = parts[0];
    if (!url) {
      continue;
    }
    const descriptor = parts[1];
    if (!descriptor) {
      candidates.push({ url, density: 1 });
      continue;
    }
    const value = parseFloat(descriptor);
    if (Number.isNaN(value) || value <= 0) {
      continue;
    }
    if (descriptor.endsWith("w")) {
      candidates.push({ url, width: value });
    } else if (descriptor.endsWith("x")) {
      candidates.push({ url, density: value });
    }
  }
  return candidates;
}
function matchesMedia(media, viewport) {
  if (!media) {
    return true;
  }
  const condition = /^\(\s*(min|max)-width:\s*([\d.]+)px\s*\)$/.exec(
    media.trim()
  );
  if (!condition) {
    return false;
  }
  const bound = parseFloat(condition[2]);
  return condition[1] === "min" ? viewport.width >= bound : viewport.width <= bound;
}
function getActualSizeWidth(item, viewport, naturalWidth) {
  if (item.width) {
    const declared = parseFloat(item.width);
    if (!Number.isNaN(declared) && declared > 0) {
      return declared;
    }
  }
  let candidates = [];
  const sources = Array.isArray(item.sources) ? item.sources : [];
  for (const source of sources) {
    if (matchesMedia(source.media, viewport)) {
      candidates = parseSrcset(source.srcset);
      break;
    }
  }
  if (!candidates.length && item.srcset) {
    candidates = parseSrcset(item.srcset);
  }
  const widths = candidates.map((candidate) => candidate.width).filter((width) => width !== void 0);
  if (widths.length) {
    return Math.max(...widths);
  }
  const natural = parseImageSize(item.lgSize, viewport.width);
  if (natural && natural.width > 0) {
    return natural.width;
  }
  return naturalWidth;
}
const VELOCITY_WINDOW_MS = 100;
const MIN_DISPLACEMENT = 1;
const MIN_WINDOW_SPAN_MS = 5;
function pushVelocitySample(samples, sample, windowMs = VELOCITY_WINDOW_MS) {
  return [...samples.filter((s) => sample.t - s.t <= windowMs), sample];
}
function getWindowedVelocity(samples, releaseTime, windowMs = VELOCITY_WINDOW_MS) {
  const recent = samples.filter((s) => releaseTime - s.t <= windowMs);
  if (recent.length < 2) {
    return { x: 0, y: 0 };
  }
  const first = recent[0];
  const last = recent[recent.length - 1];
  const dt = last.t - first.t;
  if (dt < MIN_WINDOW_SPAN_MS) {
    return { x: 0, y: 0 };
  }
  const dx = last.x - first.x;
  const dy = last.y - first.y;
  return {
    x: Math.abs(dx) > MIN_DISPLACEMENT ? dx / dt : 0,
    y: Math.abs(dy) > MIN_DISPLACEMENT ? dy / dt : 0
  };
}
function getRotatedVisualSize(width, height, transform) {
  if (!transform) {
    return { width, height };
  }
  const rotate = /rotate\((-?\d+(?:\.\d+)?)deg\)/.exec(transform);
  const scale = /scale3d\((-?\d+(?:\.\d+)?)/.exec(transform);
  const fit = (scale == null ? void 0 : scale[1]) ? Math.abs(parseFloat(scale[1])) : 1;
  const degrees = (rotate == null ? void 0 : rotate[1]) ? parseFloat(rotate[1]) : 0;
  const normalized = (degrees % 360 + 360) % 360;
  return normalized === 90 || normalized === 270 ? { width: height * fit, height: width * fit } : { width: width * fit, height: height * fit };
}
const MAX_FRAME_MS = 64;
function runSprings(tracks, onFrame, onDone) {
  let raf = 0;
  let last = Date.now();
  const states = tracks.map((t) => ({
    position: t.from,
    velocity: t.velocity
  }));
  const frame = () => {
    const now = Date.now();
    const dt = Math.min(Math.max(now - last, 0), MAX_FRAME_MS);
    last = now;
    let settled = true;
    tracks.forEach((t, i) => {
      states[i] = stepSpring(states[i], t.target, dt, t);
      if (!isSpringSettled(states[i], t.target)) {
        settled = false;
      }
    });
    if (settled) {
      onFrame(tracks.map((t) => t.target));
      onDone == null ? void 0 : onDone();
      return;
    }
    onFrame(states.map((s) => s.position));
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}
const zoomSettings = {
  scale: 1,
  zoom: true,
  infiniteZoom: true,
  actualSize: true,
  showZoomInOutIcons: false,
  actualSizeIcons: {
    zoomIn: "lg-zoom-in",
    zoomOut: "lg-zoom-out"
  },
  enableZoomAfter: 300
};
const lGEvents = {
  containerResize: "lgContainerResize",
  beforeOpen: "lgBeforeOpen",
  afterOpen: "lgAfterOpen",
  slideItemLoad: "lgSlideItemLoad",
  afterSlide: "lgAfterSlide",
  rotateLeft: "lgRotateLeft",
  rotateRight: "lgRotateRight",
  flipHorizontal: "lgFlipHorizontal",
  flipVertical: "lgFlipVertical"
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
const ZOOM_TRANSITION_DURATION = 500;
class Zoom {
  constructor(instance, $LG) {
    this.core = instance;
    this.$LG = $LG;
    this.settings = __spreadValues(__spreadValues({}, zoomSettings), this.core.settings);
    return this;
  }
  // Append Zoom controls. Actual size, Zoom-in, Zoom-out
  buildTemplates() {
    var _a, _b, _c, _d, _e, _f;
    const gestureButtons = this.core.settings.showGestureButtons !== false;
    let zoomIcons = gestureButtons && this.settings.showZoomInOutIcons ? `<button id="${this.core.getIdName(
      "lg-zoom-in"
    )}" type="button" aria-label="${(_b = (_a = this.settings.zoomPluginStrings) == null ? void 0 : _a.zoomIn) != null ? _b : this.core.settings.strings.zoomIn}" class="lg-zoom-in lg-icon"></button><button id="${this.core.getIdName(
      "lg-zoom-out"
    )}" type="button" aria-label="${(_d = (_c = this.settings.zoomPluginStrings) == null ? void 0 : _c.zoomOut) != null ? _d : this.core.settings.strings.zoomOut}" class="lg-zoom-out lg-icon"></button>` : "";
    if (gestureButtons && this.settings.actualSize) {
      zoomIcons += `<button id="${this.core.getIdName(
        "lg-actual-size"
      )}" type="button" aria-label="${(_f = (_e = this.settings.zoomPluginStrings) == null ? void 0 : _e.viewActualSize) != null ? _f : this.core.settings.strings.viewActualSize}" class="${this.settings.actualSizeIcons.zoomIn} lg-icon"></button>`;
    }
    this.core.outer.addClass("lg-use-transition-for-zoom");
    this.core.$toolbar.first().append(zoomIcons);
  }
  /**
   * @desc Enable zoom option only once the image is completely loaded
   * If zoomFromOrigin is true, Zoom is enabled once the dummy image has been inserted
   *
   * Zoom styles are defined under lg-zoomable CSS class.
   */
  enableZoom(event) {
    let _speed = this.settings.enableZoomAfter + event.detail.delay;
    if (this.$LG("body").first().hasClass("lg-from-hash") && event.detail.delay) {
      _speed = 0;
    } else {
      this.$LG("body").first().removeClass("lg-from-hash");
    }
    this.zoomableTimeout = setTimeout(() => {
      if (!this.isImageSlide(this.core.index)) {
        return;
      }
      this.core.getSlideItem(event.detail.index).addClass("lg-zoomable");
      if (event.detail.index === this.core.index) {
        this.setZoomEssentials();
      }
    }, _speed + 30);
  }
  enableZoomOnSlideItemLoad() {
    this.core.LGel.on(
      `${lGEvents.slideItemLoad}.zoom`,
      this.enableZoom.bind(this)
    );
  }
  getDragCords(e) {
    return {
      x: e.pageX,
      y: e.pageY
    };
  }
  getSwipeCords(e) {
    const x = e.touches[0].pageX;
    const y = e.touches[0].pageY;
    return {
      x,
      y
    };
  }
  getDragAllowedAxises(scale, scaleDiff) {
    if (!this.containerRect) {
      return {
        allowX: false,
        allowY: false
      };
    }
    const $image = this.core.getSlideItem(this.core.index).find(".lg-image").first().get();
    let height = 0;
    let width = 0;
    const rect = $image.getBoundingClientRect();
    if (scale) {
      const visual = this.getVisualImageSize(
        $image,
        $image.offsetWidth,
        $image.offsetHeight
      );
      height = visual.height * scale;
      width = visual.width * scale;
    } else if (scaleDiff) {
      height = rect.height + scaleDiff * rect.height;
      width = rect.width + scaleDiff * rect.width;
    } else if (this.core.currentImageSize) {
      const visual = this.getVisualImageSize(
        $image,
        this.core.currentImageSize.width,
        this.core.currentImageSize.height
      );
      height = visual.height * this.scale;
      width = visual.width * this.scale;
    } else {
      height = rect.height;
      width = rect.width;
    }
    const allowY = height > this.containerRect.height;
    const allowX = width > this.containerRect.width;
    return {
      allowX,
      allowY
    };
  }
  setZoomEssentials() {
    this.containerRect = this.core.$content.get().getBoundingClientRect();
  }
  /**
   * @desc Image zoom
   * Translate the wrap and scale the image to get better user experience
   *
   * @param {String} scale - Zoom decrement/increment value
   */
  zoomImage(scale, scaleDiff, reposition, resetToMax) {
    if (!this.containerRect || Math.abs(scaleDiff) <= 0) return;
    const offsetX = this.containerRect.width / 2 + this.containerRect.left;
    const offsetY = this.containerRect.height / 2 + this.containerRect.top + this.scrollTop;
    let originalX;
    let originalY;
    if (scale === 1) {
      this.positionChanged = false;
    }
    if (this.positionChanged) {
      const previousScale = this.scale - scaleDiff;
      originalX = previousScale ? this.left / previousScale : 0;
      originalY = previousScale ? this.top / previousScale : 0;
      this.pageX = offsetX - originalX;
      this.pageY = offsetY - originalY;
      this.positionChanged = false;
    }
    let x;
    let y;
    let _x = offsetX - this.pageX;
    let _y = offsetY - this.pageY;
    if (scale - scaleDiff > 1) {
      const scaleVal = (scale - scaleDiff) / Math.abs(scaleDiff);
      _x = (scaleDiff < 0 ? -_x : _x) + this.left * (scaleVal + (scaleDiff < 0 ? -1 : 1));
      _y = (scaleDiff < 0 ? -_y : _y) + this.top * (scaleVal + (scaleDiff < 0 ? -1 : 1));
      x = _x / scaleVal;
      y = _y / scaleVal;
    } else {
      const scaleVal = (scale - scaleDiff) * scaleDiff;
      x = _x * scaleVal;
      y = _y * scaleVal;
    }
    if (reposition) {
      const clamped = this.clampPinchPan({ x, y }, scale);
      x = clamped.x;
      y = clamped.y;
    }
    this.setZoomStyles({
      x,
      y,
      scale
    });
    this.left = x;
    this.top = y;
    if (resetToMax) {
      this.setZoomImageSize();
    }
  }
  resetImageTranslate(index) {
    if (!this.isImageSlide(index)) {
      return;
    }
    const $image = this.core.getSlideItem(index).find(".lg-image").first();
    this.imageReset = false;
    $image.removeClass(
      "reset-transition reset-transition-y reset-transition-x"
    );
    this.core.outer.removeClass("lg-actual-size");
    $image.css("width", "auto").css("height", "auto");
    setTimeout(() => {
      $image.removeClass("no-transition");
    }, 10);
  }
  setZoomImageSize(delay = ZOOM_TRANSITION_DURATION) {
    const $image = this.core.getSlideItem(this.core.index).find(".lg-image").first();
    setTimeout(() => {
      if (this.core.touchAction) {
        return;
      }
      const actualSizeScale = this.getCurrentImageActualSizeScale();
      if (this.scale >= actualSizeScale) {
        $image.addClass("no-transition");
        this.imageReset = true;
      }
    }, delay);
    setTimeout(() => {
      if (this.core.touchAction) {
        return;
      }
      const actualSizeScale = this.getCurrentImageActualSizeScale();
      if (this.scale >= actualSizeScale) {
        const dragAllowedAxises = this.getDragAllowedAxises(this.scale);
        const image = $image.get();
        const referenceWidth = this.getNaturalWidth(this.core.index);
        const referenceHeight = image.naturalWidth > 0 ? referenceWidth * image.naturalHeight / image.naturalWidth : image.naturalHeight;
        $image.css("width", referenceWidth + "px").css("height", referenceHeight + "px");
        this.core.outer.addClass("lg-actual-size");
        if (dragAllowedAxises.allowX && dragAllowedAxises.allowY) {
          $image.addClass("reset-transition");
        } else if (dragAllowedAxises.allowX && !dragAllowedAxises.allowY) {
          $image.addClass("reset-transition-x");
        } else if (!dragAllowedAxises.allowX && dragAllowedAxises.allowY) {
          $image.addClass("reset-transition-y");
        }
      }
    }, delay + 50);
  }
  /**
   * @desc apply scale3d to image and translate to image wrap
   * @param {style} X,Y and scale
   */
  setZoomStyles(style) {
    const $imageWrap = this.core.getSlideItem(this.core.index).find(".lg-img-wrap").first();
    const $image = this.core.getSlideItem(this.core.index).find(".lg-image").first();
    const $dummyImage = this.core.outer.find(".lg-current .lg-dummy-img").first();
    this.scale = style.scale;
    $image.css(
      "transform",
      "scale3d(" + style.scale + ", " + style.scale + ", 1)"
    );
    $dummyImage.css(
      "transform",
      "scale3d(" + style.scale + ", " + style.scale + ", 1)"
    );
    const transform = "translate3d(" + style.x + "px, " + style.y + "px, 0)";
    $imageWrap.css("transform", transform);
  }
  /**
   * @param index - Index of the current slide
   * @param event - event will be available only if the function is called on clicking/taping the imags
   */
  setActualSize(index, event) {
    if (this.zoomInProgress) {
      return;
    }
    this.zoomInProgress = true;
    const currentItem = this.core.galleryItems[this.core.index];
    this.resetImageTranslate(index);
    setTimeout(() => {
      if (!currentItem.src || this.core.outer.hasClass("lg-first-slide-loading")) {
        return;
      }
      const scale = this.getCurrentImageActualSizeScale();
      const prevScale = this.scale;
      if (this.core.outer.hasClass("lg-zoomed")) {
        this.scale = 1;
      } else {
        this.scale = this.getScale(scale);
      }
      this.setPageCords(event);
      this.beginZoom(this.scale);
      this.zoomImage(this.scale, this.scale - prevScale, true, true);
    }, 50);
    setTimeout(() => {
      this.core.outer.removeClass("lg-grabbing").addClass("lg-grab");
    }, 60);
    setTimeout(() => {
      this.zoomInProgress = false;
    }, ZOOM_TRANSITION_DURATION + 110);
  }
  getNaturalWidth(index) {
    const $image = this.core.getSlideItem(index).find(".lg-image").first();
    return getActualSizeWidth(
      this.core.galleryItems[index],
      {
        width: window.innerWidth
      },
      $image.get().naturalWidth
    );
  }
  getActualSizeScale(naturalWidth, width) {
    let scale;
    if (naturalWidth >= width) {
      scale = getActualSizeScale(naturalWidth, width);
    } else {
      scale = 1;
    }
    return scale;
  }
  getCurrentImageActualSizeScale() {
    var _a;
    const $image = this.core.getSlideItem(this.core.index).find(".lg-image").first();
    const image = $image.get();
    let width = (_a = this.core.currentImageSize) == null ? void 0 : _a.width;
    if (!width) {
      if (this.core.outer.hasClass("lg-actual-size")) {
        if (!this.containerRect) {
          this.setZoomEssentials();
        }
        const referenceWidth = this.getNaturalWidth(this.core.index);
        const referenceHeight = image.naturalWidth > 0 ? referenceWidth * image.naturalHeight / image.naturalWidth : image.naturalHeight;
        width = fitImageSize(
          {
            width: referenceWidth,
            height: referenceHeight
          },
          this.containerRect.width,
          this.containerRect.height
        ).width;
      } else {
        width = image.offsetWidth;
      }
    }
    const naturalWidth = this.getNaturalWidth(this.core.index) || width;
    return this.getActualSizeScale(naturalWidth, width);
  }
  getPageCords(event) {
    const cords = {};
    if (event) {
      cords.x = event.pageX || event.touches[0].pageX;
      cords.y = event.pageY || event.touches[0].pageY;
    } else {
      const containerRect = this.core.$content.get().getBoundingClientRect();
      cords.x = containerRect.width / 2 + containerRect.left;
      cords.y = containerRect.height / 2 + this.scrollTop + containerRect.top;
    }
    return cords;
  }
  setPageCords(event) {
    const pageCords = this.getPageCords(event);
    this.pageX = pageCords.x;
    this.pageY = pageCords.y;
  }
  manageActualPixelClassNames() {
    const $actualSize = this.core.getElementById("lg-actual-size");
    $actualSize.removeClass(this.settings.actualSizeIcons.zoomIn).addClass(this.settings.actualSizeIcons.zoomOut);
  }
  // If true, zoomed - in else zoomed out
  beginZoom(scale) {
    this.core.outer.removeClass("lg-zoom-drag-transition lg-zoom-dragging");
    if (scale > 1) {
      this.core.outer.addClass("lg-zoomed");
      this.manageActualPixelClassNames();
    } else {
      this.resetZoom();
    }
    return scale > 1;
  }
  getScale(scale) {
    const actualSizeScale = this.getCurrentImageActualSizeScale();
    if (scale < 1) {
      scale = 1;
    } else if (scale > actualSizeScale) {
      scale = actualSizeScale;
    }
    return scale;
  }
  init() {
    this.core.registerDefaultIcons(zoomDefaultIcons);
    if (!this.settings.zoom) {
      return;
    }
    this.buildTemplates();
    this.enableZoomOnSlideItemLoad();
    let tapped = null;
    this.core.outer.on("dblclick.lg", (event) => {
      if (!this.$LG(event.target).hasClass("lg-image")) {
        return;
      }
      this.setActualSize(this.core.index, event);
    });
    this.core.outer.on("touchstart.lg", (event) => {
      const $target = this.$LG(event.target);
      if (event.touches.length === 1 && $target.hasClass("lg-image")) {
        if (!tapped) {
          tapped = setTimeout(() => {
            tapped = null;
          }, 300);
        } else {
          clearTimeout(tapped);
          tapped = null;
          event.preventDefault();
          this.setActualSize(this.core.index, event);
        }
      }
    });
    this.core.LGel.on(
      `${lGEvents.containerResize}.zoom ${lGEvents.rotateRight}.zoom ${lGEvents.rotateLeft}.zoom ${lGEvents.flipHorizontal}.zoom ${lGEvents.flipVertical}.zoom`,
      () => {
        if (!this.core.lgOpened || !this.isImageSlide(this.core.index) || this.core.touchAction) {
          return;
        }
        this.stopZoomSpring();
        const _LGel = this.core.getSlideItem(this.core.index).find(".lg-img-wrap").first();
        this.top = 0;
        this.left = 0;
        this.setZoomEssentials();
        this.setZoomSwipeStyles(_LGel, { x: 0, y: 0 });
        this.positionChanged = true;
      }
    );
    this.$LG(window).on(`scroll.lg.zoom.global${this.core.lgId}`, () => {
      if (!this.core.lgOpened) return;
      this.scrollTop = this.$LG(window).scrollTop();
    });
    this.core.getElementById("lg-zoom-out").on("click.lg", () => {
      if (!this.isImageSlide(this.core.index)) {
        return;
      }
      let timeout = 0;
      if (this.imageReset) {
        this.resetImageTranslate(this.core.index);
        timeout = 50;
      }
      setTimeout(() => {
        let scale = this.scale - this.settings.scale;
        if (scale < 1) {
          scale = 1;
        }
        this.beginZoom(scale);
        this.zoomImage(
          scale,
          -this.settings.scale,
          true,
          !this.settings.infiniteZoom
        );
      }, timeout);
    });
    this.core.getElementById("lg-zoom-in").on("click.lg", () => {
      this.zoomIn();
    });
    this.core.getElementById("lg-actual-size").on("click.lg", () => {
      this.setActualSize(this.core.index);
    });
    this.core.LGel.on(`${lGEvents.beforeOpen}.zoom`, () => {
      this.core.outer.find(".lg-item").removeClass("lg-zoomable");
    });
    this.core.LGel.on(`${lGEvents.afterOpen}.zoom`, () => {
      this.scrollTop = this.$LG(window).scrollTop();
      this.pageX = this.core.outer.width() / 2;
      this.pageY = this.core.outer.height() / 2 + this.scrollTop;
      this.scale = 1;
    });
    this.core.LGel.on(
      `${lGEvents.afterSlide}.zoom`,
      (event) => {
        const { prevIndex } = event.detail;
        this.scale = 1;
        this.positionChanged = false;
        this.zoomInProgress = false;
        this.resetZoom(prevIndex);
        this.resetImageTranslate(prevIndex);
        if (this.isImageSlide(this.core.index)) {
          this.setZoomEssentials();
        }
      }
    );
    this.zoomDrag();
    this.pinchZoom();
    this.zoomSwipe();
    this.zoomableTimeout = false;
    this.positionChanged = false;
    this.zoomInProgress = false;
  }
  zoomIn() {
    if (!this.isImageSlide(this.core.index)) {
      return;
    }
    let scale = this.scale + this.settings.scale;
    if (!this.settings.infiniteZoom) {
      scale = this.getScale(scale);
    }
    this.beginZoom(scale);
    this.zoomImage(
      scale,
      Math.min(this.settings.scale, scale - this.scale),
      true,
      !this.settings.infiniteZoom
    );
  }
  // Reset zoom effect
  resetZoom(index) {
    this.stopZoomSpring();
    this.core.outer.removeClass("lg-zoomed lg-zoom-drag-transition");
    const $actualSize = this.core.getElementById("lg-actual-size");
    const $item = this.core.getSlideItem(
      index !== void 0 ? index : this.core.index
    );
    $actualSize.removeClass(this.settings.actualSizeIcons.zoomOut).addClass(this.settings.actualSizeIcons.zoomIn);
    $item.find(".lg-img-wrap").first().removeAttr("style");
    $item.find(".lg-image").first().removeAttr("style");
    this.scale = 1;
    this.left = 0;
    this.top = 0;
    this.setPageCords();
  }
  /** Stop a running release spring; state stays at its live values. */
  stopZoomSpring() {
    if (this.cancelZoomSpring) {
      this.cancelZoomSpring();
      this.cancelZoomSpring = void 0;
    }
  }
  /**
   * Any gesture end must leave the image inside its pan bounds: a tap
   * interrupts a settling spring (stopZoomSpring at its touchstart),
   * and if it never turns into a drag nothing else re-clamps, the
   * fused pinch pan can legitimately be far outside mid-settle.
   * Springs home from wherever the interruption stopped it; a no-op
   * when already in bounds (the common tap).
   */
  settleIntoBounds() {
    this.setZoomEssentials();
    const rect = this.core.getSlideItem(this.core.index).find(".lg-image").first().get().getBoundingClientRect();
    const actualSizeScale = this.getCurrentImageActualSizeScale();
    const targetScale = this.settings.infiniteZoom ? Math.max(this.scale, 1) : Math.min(Math.max(this.scale, 1), Math.max(actualSizeScale, 1));
    const sizeRatio = this.scale > 0 ? targetScale / this.scale : 1;
    const width = rect.width * sizeRatio;
    const height = rect.height * sizeRatio;
    const { bottom } = this.core.mediaContainerPosition;
    const halfX = Math.abs(width - this.containerRect.width) / 2;
    const halfY = Math.abs(height - this.containerRect.height) / 2;
    const floorY = height > this.containerRect.height ? Math.min(-halfY + bottom, halfY) : -halfY;
    const targetX = Math.min(Math.max(this.left, -halfX), halfX);
    const targetY = Math.min(Math.max(this.top, floorY), halfY);
    if (Math.abs(targetX - this.left) < 1 && Math.abs(targetY - this.top) < 1 && Math.abs(targetScale - this.scale) < 1e-3) {
      return;
    }
    this.core.outer.addClass("lg-zoom-drag-transition lg-zoom-dragging");
    this.stopZoomSpring();
    this.cancelZoomSpring = runSprings(
      [
        { from: this.scale, velocity: 0, target: targetScale },
        { from: this.left, velocity: 0, target: targetX },
        { from: this.top, velocity: 0, target: targetY }
      ],
      ([scale, x, y]) => {
        this.left = x;
        this.top = y;
        this.setZoomStyles({ x, y, scale });
      },
      () => {
        this.cancelZoomSpring = void 0;
        this.core.outer.removeClass(
          "lg-zoom-dragging lg-zoom-drag-transition"
        );
        if (targetScale > 1 && targetScale >= Math.max(actualSizeScale, 1)) {
          this.setZoomImageSize(0);
        }
      }
    );
  }
  getTouchDistance(e) {
    return getPointerDistance(
      { x: e.touches[0].pageX, y: e.touches[0].pageY },
      { x: e.touches[1].pageX, y: e.touches[1].pageY }
    );
  }
  /**
   * Pinch midpoint relative to the stage centre, the focal anchor the
   * whole gesture projects through.
   */
  getPinchMidPoint(e) {
    const centerX = this.containerRect.width / 2 + this.containerRect.left;
    const centerY = this.containerRect.height / 2 + this.containerRect.top + this.scrollTop;
    return {
      x: (e.touches[0].pageX + e.touches[1].pageX) / 2 - centerX,
      y: (e.touches[0].pageY + e.touches[1].pageY) / 2 - centerY
    };
  }
  /**
   * Clamp a pan into the stage-aware bounds at the given scale,
   * measured from the untransformed layout size (offset dimensions
   * ignore transforms, so this stays correct mid-gesture). Y matches
   * `getPossibleSwipeDragCords`: the vacated components strip belongs
   * to the stage, so the pan-up floor sits where the image's bottom
   * edge meets the SCREEN bottom, not the content box.
   */
  /**
   * Bounds-relevant size of the image: layout offsets swapped and
   * shrunk by the rotate plugin's wrapper transform when present,
   * at 90°/270° the visual width runs along the layout height, and
   * offsets don't see transforms.
   */
  getVisualImageSize($image, width, height) {
    const rotateWrap = $image.closest(".lg-img-rotate");
    return getRotatedVisualSize(width, height, rotateWrap == null ? void 0 : rotateWrap.style.transform);
  }
  clampPinchPan(pan, scale) {
    const $image = this.core.getSlideItem(this.core.index).find(".lg-image").first().get();
    const visual = this.getVisualImageSize(
      $image,
      $image.offsetWidth,
      $image.offsetHeight
    );
    const bounds = getPanBounds(
      visual.width,
      visual.height,
      this.containerRect.width,
      this.containerRect.height,
      scale
    );
    return clampPanToStage(
      pan,
      bounds,
      this.core.mediaContainerPosition.bottom
    );
  }
  pinchZoom() {
    let startDist = 0;
    let pinchStarted = false;
    let initScale = 1;
    let startMaxScale = 1;
    let startPan = { x: 0, y: 0 };
    let startMid = { x: 0, y: 0 };
    let maxGestureScale = 1;
    let lastMid = { x: 0, y: 0 };
    let midSamples = [];
    let $item = this.core.getSlideItem(this.core.index);
    this.core.outer.on("touchstart.lg", (e) => {
      $item = this.core.getSlideItem(this.core.index);
      if (!this.isImageSlide(this.core.index)) {
        return;
      }
      if (e.touches.length === 2) {
        e.preventDefault();
        if (this.core.outer.hasClass("lg-first-slide-loading")) {
          return;
        }
        this.stopZoomSpring();
        this.setZoomEssentials();
        initScale = this.scale || 1;
        startPan = { x: this.left, y: this.top };
        startMid = this.getPinchMidPoint(e);
        this.core.outer.addClass(
          "lg-zoom-drag-transition lg-zoom-dragging"
        );
        this.setPageCords(e);
        this.resetImageTranslate(this.core.index);
        startMaxScale = this.getCurrentImageActualSizeScale();
        this.core.touchAction = "pinch";
        startDist = this.getTouchDistance(e);
        maxGestureScale = initScale;
        lastMid = startMid;
        midSamples = [{ x: startMid.x, y: startMid.y, t: Date.now() }];
      }
    });
    this.core.$inner.on("touchmove.lg", (e) => {
      if (e.touches.length === 2 && this.core.touchAction === "pinch" && (this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target))) {
        e.preventDefault();
        const endDist = this.getTouchDistance(e);
        const distance = startDist - endDist;
        if (!pinchStarted && Math.abs(distance) > 5) {
          pinchStarted = true;
        }
        if (pinchStarted) {
          const closeArmed = this.core.settings.pinchToClose && this.core.settings.closable && maxGestureScale <= 1;
          const _scale = getPinchScale(
            startDist,
            endDist,
            initScale,
            startMaxScale,
            this.settings.infiniteZoom,
            closeArmed
          );
          const scale = Math.round((_scale + Number.EPSILON) * 1e4) / 1e4;
          const mid = this.getPinchMidPoint(e);
          lastMid = mid;
          midSamples = pushVelocitySample(midSamples, {
            x: mid.x,
            y: mid.y,
            t: Date.now()
          });
          const pan = getPinchPan(
            mid,
            startMid,
            startPan,
            initScale,
            scale
          );
          this.left = pan.x;
          this.top = pan.y;
          this.setZoomStyles({ x: pan.x, y: pan.y, scale });
          maxGestureScale = Math.max(maxGestureScale, scale);
        }
      }
    });
    this.core.$inner.on("touchend.lg", (e) => {
      if (this.core.touchAction === "pinch" && (this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target))) {
        pinchStarted = false;
        startDist = 0;
        if (shouldCloseOnPinch({
          scale: this.scale,
          maxGestureScale,
          pinchToClose: this.core.settings.pinchToClose,
          closable: this.core.settings.closable
        })) {
          this.core.outer.removeClass("lg-zoom-dragging");
          this.resetZoom();
          this.core.closeGallery();
        } else if (this.scale <= 1) {
          this.core.outer.removeClass("lg-zoomed");
          this.stopZoomSpring();
          this.cancelZoomSpring = runSprings(
            [
              { from: this.scale, velocity: 0, target: 1 },
              { from: this.left, velocity: 0, target: 0 },
              { from: this.top, velocity: 0, target: 0 }
            ],
            ([scale, x, y]) => {
              this.left = x;
              this.top = y;
              this.setZoomStyles({
                x,
                y,
                scale
              });
            },
            () => {
              this.cancelZoomSpring = void 0;
              this.core.outer.removeClass("lg-zoom-dragging");
              this.resetZoom();
            }
          );
        } else {
          const actualSizeScale = startMaxScale;
          const targetScale = Math.min(
            this.scale,
            Math.max(actualSizeScale, 1)
          );
          const midVelocity = getWindowedVelocity(
            midSamples,
            Date.now()
          );
          const basePan = getPinchPan(
            lastMid,
            startMid,
            startPan,
            initScale,
            targetScale
          );
          const glide = {
            x: basePan.x + project(midVelocity.x),
            y: basePan.y + project(midVelocity.y)
          };
          const pan = this.clampPinchPan(glide, targetScale);
          this.positionChanged = true;
          this.manageActualPixelClassNames();
          this.core.outer.addClass("lg-zoomed");
          this.stopZoomSpring();
          this.cancelZoomSpring = runSprings(
            [
              {
                from: this.scale,
                velocity: 0,
                target: targetScale
              },
              {
                from: this.left,
                velocity: midVelocity.x,
                target: pan.x,
                dampingRatio: pan.x !== glide.x ? SPRING_BOUNCE_DAMPING : 1
              },
              {
                from: this.top,
                velocity: midVelocity.y,
                target: pan.y,
                dampingRatio: pan.y !== glide.y ? SPRING_BOUNCE_DAMPING : 1
              }
            ],
            ([scale, x, y]) => {
              this.left = x;
              this.top = y;
              this.setZoomStyles({
                x,
                y,
                scale
              });
            },
            () => {
              this.cancelZoomSpring = void 0;
              this.core.outer.removeClass(
                "lg-zoom-dragging lg-zoom-drag-transition"
              );
              if (targetScale >= actualSizeScale) {
                this.setZoomImageSize(0);
              }
            }
          );
        }
        this.core.touchAction = void 0;
      }
    });
  }
  touchendZoom(startCoords, endCoords, allowX, allowY, velocity) {
    const _LGel = this.core.getSlideItem(this.core.index).find(".lg-img-wrap").first();
    const possibleSwipeCords = this.getPossibleSwipeDragCords();
    const current = this.getZoomSwipeCords(
      startCoords,
      endCoords,
      allowX,
      allowY,
      possibleSwipeCords
    );
    const clampAxis = (value, min, max) => Math.min(Math.max(value, max), min);
    const targetX = allowX ? clampAxis(
      current.x + project(velocity.x),
      possibleSwipeCords.minX,
      possibleSwipeCords.maxX
    ) : this.left;
    const targetY = allowY ? clampAxis(
      current.y + project(velocity.y),
      possibleSwipeCords.minY,
      possibleSwipeCords.maxY
    ) : this.top;
    this.positionChanged = true;
    if (Math.abs(targetX - current.x) < 1 && Math.abs(targetY - current.y) < 1) {
      this.left = targetX;
      this.top = targetY;
      this.setZoomSwipeStyles(_LGel, { x: targetX, y: targetY });
      this.core.outer.removeClass(
        "lg-zoom-dragging lg-zoom-drag-transition"
      );
      return;
    }
    this.core.outer.addClass("lg-zoom-dragging");
    this.stopZoomSpring();
    this.cancelZoomSpring = runSprings(
      [
        {
          from: current.x,
          velocity: velocity.x,
          target: targetX,
          dampingRatio: targetX !== current.x + project(velocity.x) ? SPRING_BOUNCE_DAMPING : 1
        },
        {
          from: current.y,
          velocity: velocity.y,
          target: targetY,
          dampingRatio: targetY !== current.y + project(velocity.y) ? SPRING_BOUNCE_DAMPING : 1
        }
      ],
      ([x, y]) => {
        this.left = x;
        this.top = y;
        this.setZoomSwipeStyles(_LGel, { x, y });
      },
      () => {
        this.cancelZoomSpring = void 0;
        this.core.outer.removeClass(
          "lg-zoom-dragging lg-zoom-drag-transition"
        );
      }
    );
  }
  getZoomSwipeCords(startCoords, endCoords, allowX, allowY, possibleSwipeCords) {
    const distance = {};
    if (allowY) {
      distance.y = this.top + (endCoords.y - startCoords.y);
      if (this.isBeyondPossibleTop(distance.y, possibleSwipeCords.minY)) {
        const diffMinY = possibleSwipeCords.minY - distance.y;
        distance.y = possibleSwipeCords.minY - diffMinY / 6;
      } else if (this.isBeyondPossibleBottom(distance.y, possibleSwipeCords.maxY)) {
        const diffMaxY = distance.y - possibleSwipeCords.maxY;
        distance.y = possibleSwipeCords.maxY + diffMaxY / 6;
      }
    } else {
      distance.y = this.top;
    }
    if (allowX) {
      distance.x = this.left + (endCoords.x - startCoords.x);
      if (this.isBeyondPossibleLeft(distance.x, possibleSwipeCords.minX)) {
        const diffMinX = possibleSwipeCords.minX - distance.x;
        distance.x = possibleSwipeCords.minX - diffMinX / 6;
      } else if (this.isBeyondPossibleRight(distance.x, possibleSwipeCords.maxX)) {
        const difMaxX = distance.x - possibleSwipeCords.maxX;
        distance.x = possibleSwipeCords.maxX + difMaxX / 6;
      }
    } else {
      distance.x = this.left;
    }
    return distance;
  }
  isBeyondPossibleLeft(x, minX) {
    return x >= minX;
  }
  isBeyondPossibleRight(x, maxX) {
    return x <= maxX;
  }
  isBeyondPossibleTop(y, minY) {
    return y >= minY;
  }
  isBeyondPossibleBottom(y, maxY) {
    return y <= maxY;
  }
  isImageSlide(index) {
    const currentItem = this.core.galleryItems[index];
    return this.core.getSlideType(currentItem) === "image";
  }
  getPossibleSwipeDragCords(scale) {
    const $image = this.core.getSlideItem(this.core.index).find(".lg-image").first();
    const imgRect = $image.get().getBoundingClientRect();
    let imageHeight = imgRect.height;
    let imageWidth = imgRect.width;
    if (scale) {
      imageHeight = imageHeight + scale * imageHeight;
      imageWidth = imageWidth + scale * imageWidth;
    }
    const { bottom } = this.core.mediaContainerPosition;
    const minY = (imageHeight - this.containerRect.height) / 2;
    const maxY = (this.containerRect.height - imageHeight) / 2 + bottom;
    const minX = (imageWidth - this.containerRect.width) / 2;
    const maxX = (this.containerRect.width - imageWidth) / 2;
    const possibleSwipeCords = {
      minY,
      maxY,
      minX,
      maxX
    };
    return possibleSwipeCords;
  }
  setZoomSwipeStyles(LGel, distance) {
    LGel.css(
      "transform",
      "translate3d(" + distance.x + "px, " + distance.y + "px, 0)"
    );
  }
  zoomSwipe() {
    let startCoords = {};
    let endCoords = {};
    let isMoved = false;
    let allowX = false;
    let allowY = false;
    let samples = [];
    let possibleSwipeCords;
    let _LGel;
    let $item = this.core.getSlideItem(this.core.index);
    this.core.$inner.on("touchstart.lg", (e) => {
      if (!this.isImageSlide(this.core.index)) {
        return;
      }
      $item = this.core.getSlideItem(this.core.index);
      if ((this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target)) && e.touches.length === 1 && this.core.outer.hasClass("lg-zoomed")) {
        e.preventDefault();
        this.stopZoomSpring();
        isMoved = false;
        endCoords = {};
        const startPoint = this.getSwipeCords(e);
        samples = [{ x: startPoint.x, y: startPoint.y, t: Date.now() }];
        this.core.touchAction = "zoomSwipe";
        _LGel = this.core.getSlideItem(this.core.index).find(".lg-img-wrap").first();
        const dragAllowedAxises = this.getDragAllowedAxises(0);
        allowY = dragAllowedAxises.allowY;
        allowX = dragAllowedAxises.allowX;
        startCoords = this.getSwipeCords(e);
        possibleSwipeCords = this.getPossibleSwipeDragCords();
        this.core.outer.addClass(
          "lg-zoom-dragging lg-zoom-drag-transition"
        );
      }
    });
    this.core.$inner.on("touchmove.lg", (e) => {
      if (e.touches.length === 1 && this.core.touchAction === "zoomSwipe" && (this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target))) {
        e.preventDefault();
        this.core.touchAction = "zoomSwipe";
        endCoords = this.getSwipeCords(e);
        samples = pushVelocitySample(samples, {
          x: endCoords.x,
          y: endCoords.y,
          t: Date.now()
        });
        const distance = this.getZoomSwipeCords(
          startCoords,
          endCoords,
          allowX,
          allowY,
          possibleSwipeCords
        );
        if (Math.abs(endCoords.x - startCoords.x) > 15 || Math.abs(endCoords.y - startCoords.y) > 15) {
          isMoved = true;
          this.setZoomSwipeStyles(_LGel, distance);
        }
      }
    });
    this.core.$inner.on("touchend.lg", (e) => {
      if (this.core.touchAction === "zoomSwipe" && (this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target))) {
        e.preventDefault();
        this.core.touchAction = void 0;
        this.core.outer.removeClass("lg-zoom-dragging");
        if (!isMoved) {
          this.settleIntoBounds();
          return;
        }
        isMoved = false;
        this.touchendZoom(
          startCoords,
          endCoords,
          allowX,
          allowY,
          getWindowedVelocity(samples, Date.now())
        );
      }
    });
  }
  zoomDrag() {
    let startCoords = {};
    let endCoords = {};
    let isDragging = false;
    let isMoved = false;
    let allowX = false;
    let allowY = false;
    let dragSamples = [];
    let possibleSwipeCords;
    let _LGel;
    this.core.outer.on("mousedown.lg.zoom", (e) => {
      if (!this.isImageSlide(this.core.index)) {
        return;
      }
      const $item = this.core.getSlideItem(this.core.index);
      if (this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target)) {
        if (this.core.outer.hasClass("lg-zoomed")) {
          this.stopZoomSpring();
        }
        dragSamples = [{ x: e.pageX, y: e.pageY, t: Date.now() }];
        _LGel = this.core.getSlideItem(this.core.index).find(".lg-img-wrap").first();
        const dragAllowedAxises = this.getDragAllowedAxises(0);
        allowY = dragAllowedAxises.allowY;
        allowX = dragAllowedAxises.allowX;
        if (this.core.outer.hasClass("lg-zoomed")) {
          if (this.$LG(e.target).hasClass("lg-object") && (allowX || allowY)) {
            e.preventDefault();
            startCoords = this.getDragCords(e);
            possibleSwipeCords = this.getPossibleSwipeDragCords();
            isDragging = true;
            this.core.outer.removeClass("lg-grab").addClass(
              "lg-grabbing lg-zoom-drag-transition lg-zoom-dragging"
            );
          }
        }
      }
    });
    this.$LG(window).on(
      `mousemove.lg.zoom.global${this.core.lgId}`,
      (e) => {
        if (isDragging) {
          isMoved = true;
          endCoords = this.getDragCords(e);
          dragSamples = pushVelocitySample(dragSamples, {
            x: endCoords.x,
            y: endCoords.y,
            t: Date.now()
          });
          const distance = this.getZoomSwipeCords(
            startCoords,
            endCoords,
            allowX,
            allowY,
            possibleSwipeCords
          );
          this.setZoomSwipeStyles(_LGel, distance);
        }
      }
    );
    this.$LG(window).on(`mouseup.lg.zoom.global${this.core.lgId}`, (e) => {
      if (isDragging) {
        isDragging = false;
        this.core.outer.removeClass("lg-zoom-dragging");
        if (isMoved && (startCoords.x !== endCoords.x || startCoords.y !== endCoords.y)) {
          endCoords = this.getDragCords(e);
          this.touchendZoom(
            startCoords,
            endCoords,
            allowX,
            allowY,
            getWindowedVelocity(dragSamples, Date.now())
          );
        } else {
          this.settleIntoBounds();
        }
        isMoved = false;
      }
      this.core.outer.removeClass("lg-grabbing").addClass("lg-grab");
    });
  }
  closeGallery() {
    if (this.imageReset) {
      this.resetImageTranslate(this.core.index);
    }
    this.resetZoom();
    this.zoomInProgress = false;
  }
  destroy() {
    this.$LG(window).off(`.lg.zoom.global${this.core.lgId}`);
    this.core.LGel.off(".lg.zoom");
    this.core.LGel.off(".zoom");
    clearTimeout(this.zoomableTimeout);
    this.zoomableTimeout = false;
  }
}
export {
  Zoom as default
};
//# sourceMappingURL=lg-zoom.es5.js.map
