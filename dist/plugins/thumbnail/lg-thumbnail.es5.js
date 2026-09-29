/*!
 * lightgallery | 3.0.0-beta.1 | September 29th 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
const SPRING_SETTLE_DAMPING = 1;
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
const SLIDE_EDGE_FRICTION = 0.35;
const thumbnailDefaultIcons = {
  toggleThumbnails: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M682 84.667v172h172v-172h-172zM682 340.667v172h172v-172h-172zM426 596.667v172h172v-172h-172zM682 768.667h172v-172h-172v172zM426 340.667v172h172v-172h-172zM170 340.667v172h172v-172h-172zM170 84.667v172h172v-172h-172zM426 84.667v172h172v-172h-172zM170 596.667v172h172v-172h-172z"/></svg>'
};
var __defProp$1 = Object.defineProperty;
var __defProps$1 = Object.defineProperties;
var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function getElasticThumbTranslate(raw, totalWidth, stripWidth, friction = SLIDE_EDGE_FRICTION) {
  const max = Math.max(0, totalWidth - stripWidth);
  if (raw < 0) {
    return raw * friction;
  }
  if (raw > max) {
    return max + (raw - max) * friction;
  }
  return raw;
}
function getThumbTotalWidth(count, thumbWidth, thumbMargin) {
  return count * (thumbWidth + thumbMargin);
}
function clampThumbTranslate(translate, totalWidth, stripWidth) {
  const max = Math.max(0, totalWidth - stripWidth);
  return Math.min(Math.max(translate, 0), max);
}
function getThumbWindow(options) {
  const { translate, stripWidth, thumbWidth, thumbMargin, count } = options;
  const unit = thumbWidth + thumbMargin;
  if (count <= 0 || unit <= 0) {
    return { start: 0, end: -1, leadingPad: 0, trailingPad: 0 };
  }
  const overscan = options.overscan === "auto" || options.overscan === void 0 ? Math.max(1, Math.ceil(stripWidth / unit)) : Math.max(0, options.overscan);
  const clampedTranslate = clampThumbTranslate(
    translate,
    getThumbTotalWidth(count, thumbWidth, thumbMargin),
    stripWidth
  );
  const firstVisible = Math.floor(clampedTranslate / unit);
  const lastVisible = Math.ceil((clampedTranslate + stripWidth) / unit) - 1;
  const start = Math.max(0, firstVisible - overscan);
  const end = Math.min(count - 1, lastVisible + overscan);
  return {
    start,
    end,
    leadingPad: start * unit,
    trailingPad: (count - 1 - end) * unit
  };
}
function getThumbCorridorWindow(options) {
  const _a = options, { from, to } = _a, geometry = __objRest(_a, ["from", "to"]);
  const a = getThumbWindow(__spreadProps$1(__spreadValues$1({}, geometry), { translate: from }));
  const b = getThumbWindow(__spreadProps$1(__spreadValues$1({}, geometry), { translate: to }));
  const start = Math.min(a.start, b.start);
  const end = Math.max(a.end, b.end);
  const unit = options.thumbWidth + options.thumbMargin;
  if (end < start) {
    return { start: 0, end: -1, leadingPad: 0, trailingPad: 0 };
  }
  return {
    start,
    end,
    leadingPad: start * unit,
    trailingPad: (options.count - 1 - end) * unit
  };
}
function getScrubThumbIndex(translate, totalWidth, stripWidth, count) {
  const max = totalWidth - stripWidth;
  if (count <= 1 || max <= 0) {
    return 0;
  }
  const clamped = clampThumbTranslate(translate, totalWidth, stripWidth);
  return Math.round(clamped / max * (count - 1));
}
function getActiveThumbTranslate(index, thumbWidth, thumbMargin, stripWidth, totalWidth, pagerPosition, direction = "ltr") {
  const logicalPosition = direction === "rtl" && pagerPosition !== "middle" ? pagerPosition === "left" ? "right" : "left" : pagerPosition;
  let position = 0;
  switch (logicalPosition) {
    case "left":
      position = 0;
      break;
    case "middle":
      position = stripWidth / 2 - thumbWidth / 2;
      break;
    case "right":
      position = stripWidth - thumbWidth;
  }
  const translate = (thumbWidth + thumbMargin) * index - 1 - position;
  return clampThumbTranslate(translate, totalWidth, stripWidth);
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
const thumbnailsSettings = {
  thumbnail: true,
  animateThumb: true,
  currentPagerPosition: "middle",
  alignThumbnails: "middle",
  thumbWidth: 100,
  thumbHeight: "80px",
  thumbMargin: 5,
  appendThumbnailsTo: ".lg-components",
  toggleThumb: false,
  enableThumbDrag: true,
  enableThumbSwipe: true,
  thumbnailSwipeThreshold: 10,
  scrubThumbnails: false,
  loadYouTubeThumbnail: true,
  youTubeThumbSize: 1
};
const lGEvents = {
  containerResize: "lgContainerResize",
  updateSlides: "lgUpdateSlides",
  beforeOpen: "lgBeforeOpen",
  afterOpen: "lgAfterOpen",
  beforeSlide: "lgBeforeSlide"
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
class Thumbnail {
  constructor(instance, $LG) {
    this.thumbOuterWidth = 0;
    this.thumbTotalWidth = 0;
    this.translateX = 0;
    this.thumbClickable = false;
    this.instantThumb = false;
    this.dragSamples = [];
    this.liveTranslateX = 0;
    this.scrubActive = false;
    this.scrubIndex = -1;
    this.core = instance;
    this.$LG = $LG;
    return this;
  }
  init() {
    this.core.registerDefaultIcons(thumbnailDefaultIcons);
    this.settings = __spreadValues(__spreadValues({}, thumbnailsSettings), this.core.settings);
    this.thumbOuterWidth = 0;
    this.thumbTotalWidth = getThumbTotalWidth(
      this.core.galleryItems.length,
      this.settings.thumbWidth,
      this.settings.thumbMargin
    );
    this.translateX = 0;
    this.setAnimateThumbStyles();
    if (!this.core.settings.allowMediaOverlap) {
      this.settings.toggleThumb = false;
    }
    if (this.settings.thumbnail) {
      this.build();
      if (this.settings.animateThumb) {
        if (this.settings.enableThumbDrag) {
          this.enableThumbDrag();
        }
        if (this.settings.enableThumbSwipe) {
          this.enableThumbSwipe();
        }
        this.thumbClickable = false;
      } else {
        this.thumbClickable = true;
      }
      this.toggleThumbBar();
      this.thumbKeyPress();
    }
  }
  build() {
    this.setThumbMarkup();
    this.manageActiveClassOnSlideChange();
    this.$lgThumb.first().on("click.lg touchend.lg", (e) => {
      const $target = this.$LG(e.target);
      if (!$target.hasAttribute("data-lg-item-id")) {
        return;
      }
      setTimeout(() => {
        if (this.thumbClickable && !this.core.lgBusy) {
          const index = parseInt($target.attr("data-lg-item-id"));
          this.core.slide(index, false, true, false);
        }
      }, 50);
    });
    this.core.LGel.on(`${lGEvents.beforeSlide}.thumb`, (event) => {
      if (this.scrubActive) {
        return;
      }
      const { index } = event.detail;
      this.animateThumb(index);
    });
    this.core.LGel.on(`${lGEvents.beforeOpen}.thumb`, () => {
      this.thumbOuterWidth = this.core.outer.get().offsetWidth;
      this.instantThumb = true;
    });
    this.core.LGel.on(`${lGEvents.afterOpen}.thumb`, () => {
      this.instantThumb = false;
    });
    this.core.LGel.on(`${lGEvents.updateSlides}.thumb`, () => {
      this.rebuildThumbnails();
    });
    this.core.LGel.on(`${lGEvents.containerResize}.thumb`, () => {
      if (!this.core.lgOpened) return;
      setTimeout(() => {
        this.thumbOuterWidth = this.core.outer.get().offsetWidth;
        this.animateThumb(this.core.index);
        this.thumbOuterWidth = this.core.outer.get().offsetWidth;
      }, 50);
    });
  }
  setThumbMarkup() {
    let thumbOuterClassNames = "lg-thumb-outer ";
    if (this.settings.alignThumbnails) {
      thumbOuterClassNames += `lg-thumb-align-${this.settings.alignThumbnails}`;
    }
    const html = `<div class="${thumbOuterClassNames}">
        <div class="lg-thumb lg-group">
        </div>
        </div>`;
    this.core.outer.addClass("lg-has-thumb");
    if (this.settings.appendThumbnailsTo === ".lg-components") {
      this.core.$lgComponents.append(html);
    } else {
      this.core.outer.append(html);
    }
    this.$thumbOuter = this.core.outer.find(".lg-thumb-outer").first();
    this.$lgThumb = this.core.outer.find(".lg-thumb").first();
    if (this.settings.animateThumb) {
      this.core.outer.find(".lg-thumb").css("transition-duration", this.core.settings.speed + "ms").css("width", this.thumbTotalWidth + "px").css("position", "relative");
    }
    this.renderThumbItems();
  }
  enableThumbDrag() {
    let thumbDragUtils = {
      cords: {
        startX: 0,
        endX: 0
      },
      isMoved: false,
      newTranslateX: 0,
      startTime: /* @__PURE__ */ new Date(),
      endTime: /* @__PURE__ */ new Date(),
      touchMoveTime: 0
    };
    let isDragging = false;
    this.$thumbOuter.addClass("lg-grab");
    this.core.outer.find(".lg-thumb").first().on("mousedown.lg.thumb", (e) => {
      if (this.thumbTotalWidth > this.thumbOuterWidth) {
        e.preventDefault();
        this.onThumbDragStart(e.pageX);
        thumbDragUtils.cords.startX = e.pageX;
        thumbDragUtils.startTime = /* @__PURE__ */ new Date();
        this.thumbClickable = false;
        isDragging = true;
        this.core.outer.get().scrollLeft += 1;
        this.core.outer.get().scrollLeft -= 1;
        this.$thumbOuter.removeClass("lg-grab").addClass("lg-grabbing");
      }
    });
    this.$LG(window).on(
      `mousemove.lg.thumb.global${this.core.lgId}`,
      (e) => {
        if (!this.core.lgOpened) return;
        if (isDragging) {
          thumbDragUtils.cords.endX = e.pageX;
          thumbDragUtils = this.onThumbTouchMove(thumbDragUtils);
        }
      }
    );
    this.$LG(window).on(`mouseup.lg.thumb.global${this.core.lgId}`, () => {
      if (!this.core.lgOpened) return;
      if (thumbDragUtils.isMoved) {
        thumbDragUtils = this.onThumbTouchEnd(thumbDragUtils);
      } else {
        this.thumbClickable = true;
        this.endScrub();
      }
      if (isDragging) {
        isDragging = false;
        this.$thumbOuter.removeClass("lg-grabbing").addClass("lg-grab");
      }
    });
  }
  enableThumbSwipe() {
    let thumbDragUtils = {
      cords: {
        startX: 0,
        endX: 0
      },
      isMoved: false,
      newTranslateX: 0,
      startTime: /* @__PURE__ */ new Date(),
      endTime: /* @__PURE__ */ new Date(),
      touchMoveTime: 0
    };
    this.$lgThumb.on("touchstart.lg", (e) => {
      if (this.thumbTotalWidth > this.thumbOuterWidth) {
        e.preventDefault();
        this.onThumbDragStart(e.targetTouches[0].pageX);
        thumbDragUtils.cords.startX = e.targetTouches[0].pageX;
        this.thumbClickable = false;
        thumbDragUtils.startTime = /* @__PURE__ */ new Date();
      }
    });
    this.$lgThumb.on("touchmove.lg", (e) => {
      if (this.thumbTotalWidth > this.thumbOuterWidth) {
        e.preventDefault();
        thumbDragUtils.cords.endX = e.targetTouches[0].pageX;
        thumbDragUtils = this.onThumbTouchMove(thumbDragUtils);
      }
    });
    this.$lgThumb.on("touchend.lg", () => {
      if (thumbDragUtils.isMoved) {
        thumbDragUtils = this.onThumbTouchEnd(thumbDragUtils);
      } else {
        this.thumbClickable = true;
        this.endScrub();
      }
    });
  }
  // Rebuild thumbnails
  rebuildThumbnails() {
    this.$thumbOuter.addClass("lg-rebuilding-thumbnails");
    setTimeout(() => {
      this.thumbTotalWidth = getThumbTotalWidth(
        this.core.galleryItems.length,
        this.settings.thumbWidth,
        this.settings.thumbMargin
      );
      this.$lgThumb.css("width", this.thumbTotalWidth + "px");
      this.$lgThumb.empty();
      this.renderThumbItems();
      this.animateThumb(this.core.index);
    }, 50);
    setTimeout(() => {
      this.$thumbOuter.removeClass("lg-rebuilding-thumbnails");
    }, 200);
  }
  // @ts-check
  setTranslate(value) {
    const x = this.isRtl() ? value : -value;
    this.$lgThumb.css("transform", "translate3d(" + x + "px, 0px, 0px)");
  }
  isRtl() {
    return this.core.settings.direction === "rtl";
  }
  getPossibleTransformX(left) {
    return clampThumbTranslate(
      left,
      this.thumbTotalWidth,
      this.thumbOuterWidth
    );
  }
  animateThumb(index) {
    if (this.cancelThumbSpring) {
      this.cancelThumbSpring();
      this.cancelThumbSpring = void 0;
    }
    this.$lgThumb.css(
      "transition-duration",
      this.instantThumb ? "0ms" : this.core.settings.speed + "ms"
    );
    if (this.settings.animateThumb) {
      this.translateX = getActiveThumbTranslate(
        index,
        this.settings.thumbWidth,
        this.settings.thumbMargin,
        this.thumbOuterWidth,
        this.thumbTotalWidth,
        this.settings.currentPagerPosition,
        this.isRtl() ? "rtl" : "ltr"
      );
      this.liveTranslateX = this.translateX;
      this.setTranslate(this.translateX);
      if (this.isThumbWindowed()) {
        this.renderThumbItems(index);
      }
    }
  }
  canScrub() {
    return this.settings.scrubThumbnails && this.settings.animateThumb;
  }
  /**
   * A scrub session starts on the first actual strip movement and
   * ends when the release glide settles (or the plugin dies). While
   * it runs: slide transitions are visually off (`lg-thumb-scrubbing`
   * CSS), the core's transition timers collapse (`speed` 0) so the
   * landed slide's content loads without the navigation lag, and the
   * strip's own slide-change re-centering stands down.
   */
  beginScrub() {
    if (this.scrubActive) {
      return;
    }
    this.scrubActive = true;
    this.scrubIndex = this.core.index;
    this.scrubSavedSpeed = this.core.settings.speed;
    this.core.settings.speed = 0;
    this.core.outer.addClass("lg-thumb-scrubbing");
  }
  endScrub() {
    if (!this.scrubActive) {
      return;
    }
    this.scrubActive = false;
    this.scrubIndex = -1;
    if (this.scrubSavedSpeed !== void 0) {
      this.core.settings.speed = this.scrubSavedSpeed;
      this.scrubSavedSpeed = void 0;
    }
    this.core.outer.removeClass("lg-thumb-scrubbing");
  }
  /** Live translate → slide, on drag frames and glide frames alike. */
  scrubTo(translate) {
    const index = getScrubThumbIndex(
      translate,
      this.thumbTotalWidth,
      this.thumbOuterWidth,
      this.core.galleryItems.length
    );
    if (index === this.scrubIndex) {
      return;
    }
    this.scrubIndex = index;
    this.core.lgBusy = false;
    this.core.slide(index, true, true, false);
  }
  /**
   * Drag-start seam (plan 010 physics): a press mid-glide takes over
   * from the live position, and the velocity window restarts.
   */
  onThumbDragStart(pageX) {
    if (this.cancelThumbSpring) {
      this.cancelThumbSpring();
      this.cancelThumbSpring = void 0;
      this.translateX = this.liveTranslateX;
    }
    this.liveTranslateX = this.translateX;
    this.dragSamples = pushVelocitySample([], {
      x: pageX,
      y: 0,
      t: Date.now()
    });
  }
  onThumbTouchMove(thumbDragUtils) {
    thumbDragUtils.isMoved = true;
    thumbDragUtils.touchMoveTime = (/* @__PURE__ */ new Date()).valueOf();
    this.dragSamples = pushVelocitySample(this.dragSamples, {
      x: thumbDragUtils.cords.endX,
      y: 0,
      t: Date.now()
    });
    const dragDelta = thumbDragUtils.cords.endX - thumbDragUtils.cords.startX;
    thumbDragUtils.newTranslateX = getElasticThumbTranslate(
      this.translateX + (this.isRtl() ? dragDelta : -dragDelta),
      this.thumbTotalWidth,
      this.thumbOuterWidth
    );
    this.liveTranslateX = thumbDragUtils.newTranslateX;
    this.setTranslate(thumbDragUtils.newTranslateX);
    this.$thumbOuter.addClass("lg-dragging");
    if (this.canScrub()) {
      this.beginScrub();
      this.scrubTo(this.liveTranslateX);
    }
    if (this.isThumbWindowed() && this.renderedThumbWindow) {
      const rendered = this.renderedThumbWindow;
      if (this.liveTranslateX < rendered.leadingPad || this.liveTranslateX + this.thumbOuterWidth > this.thumbTotalWidth - rendered.trailingPad) {
        this.renderThumbItems(this.core.index, {
          from: this.liveTranslateX,
          to: this.liveTranslateX
        });
      }
    }
    return thumbDragUtils;
  }
  onThumbTouchEnd(thumbDragUtils) {
    thumbDragUtils.isMoved = false;
    thumbDragUtils.endTime = /* @__PURE__ */ new Date();
    this.$thumbOuter.removeClass("lg-dragging");
    const pointerVelocityX = getWindowedVelocity(
      this.dragSamples,
      Date.now()
    ).x;
    const translateVelocity = this.isRtl() ? pointerVelocityX : -pointerVelocityX;
    const from = this.liveTranslateX;
    const target = this.getPossibleTransformX(
      from + project(translateVelocity)
    );
    this.$lgThumb.css("transition-duration", "0ms");
    if (this.isThumbWindowed()) {
      this.renderThumbItems(this.core.index, { from, to: target });
    }
    this.cancelThumbSpring = runSprings(
      [{ from, velocity: translateVelocity, target }],
      ([value]) => {
        this.liveTranslateX = value;
        this.setTranslate(value);
        if (this.scrubActive) {
          this.scrubTo(value);
        }
      },
      () => {
        this.cancelThumbSpring = void 0;
        this.translateX = target;
        this.endScrub();
        this.$lgThumb.css(
          "transition-duration",
          this.core.settings.speed + "ms"
        );
        if (this.isThumbWindowed()) {
          this.renderThumbItems();
        }
      }
    );
    if (Math.abs(thumbDragUtils.cords.endX - thumbDragUtils.cords.startX) < this.settings.thumbnailSwipeThreshold) {
      this.thumbClickable = true;
    }
    return thumbDragUtils;
  }
  getThumbHtml(thumb, index, alt) {
    const slideVideoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
    let thumbImg;
    if (slideVideoInfo.youtube) {
      if (this.settings.loadYouTubeThumbnail) {
        thumbImg = "//img.youtube.com/vi/" + slideVideoInfo.youtube[1] + "/" + this.settings.youTubeThumbSize + ".jpg";
      } else {
        thumbImg = thumb;
      }
    } else {
      thumbImg = thumb;
    }
    const div = document.createElement("div");
    div.setAttribute("data-lg-item-id", index + "");
    div.className = `lg-thumb-item ${index === this.core.index ? "active" : ""}`;
    const marginSide = this.isRtl() ? "margin-left" : "margin-right";
    div.style.cssText = `width: ${this.settings.thumbWidth}px; height: ${this.settings.thumbHeight}; ${marginSide}: ${this.settings.thumbMargin}px;`;
    const img = document.createElement("img");
    img.alt = alt || "";
    img.setAttribute("data-lg-item-id", index + "");
    img.src = thumbImg;
    div.appendChild(img);
    return div;
  }
  /**
   * True when the strip renders only a window of thumbs
   * (virtualization.thumbs, plan 010).
   */
  isThumbWindowed() {
    var _a;
    return ((_a = this.core.settings.virtualization) == null ? void 0 : _a.thumbs) !== void 0;
  }
  /**
   * (Re)build the strip contents. Classic mode appends every thumb once;
   * windowed mode renders the visible range plus overscan with spacers
   * preserving the strip geometry, and re-runs at commit points only
   * (open, slide change, drag release, resize, updateSlides), never per
   * pointer move.
   */
  renderThumbItems(activeIndex = this.core.index, corridor) {
    var _a;
    const items = this.core.galleryItems;
    if (!this.isThumbWindowed()) {
      this.setThumbItemHtml(items);
      return;
    }
    const geometry = {
      stripWidth: this.thumbOuterWidth,
      thumbWidth: this.settings.thumbWidth,
      thumbMargin: this.settings.thumbMargin,
      count: items.length,
      overscan: (_a = this.core.settings.virtualization) == null ? void 0 : _a.thumbs
    };
    const thumbWindow = corridor ? getThumbCorridorWindow(__spreadValues(__spreadValues({}, geometry), corridor)) : getThumbWindow(__spreadProps(__spreadValues({}, geometry), { translate: this.translateX }));
    this.renderedThumbWindow = thumbWindow;
    this.$lgThumb.empty();
    if (thumbWindow.leadingPad > 0) {
      this.$lgThumb.append(
        `<div class="lg-thumb-spacer" aria-hidden="true" style="width: ${thumbWindow.leadingPad}px;"></div>`
      );
    }
    for (let i = thumbWindow.start; i <= thumbWindow.end; i++) {
      const thumb = this.getThumbHtml(items[i].thumb, i, items[i].alt);
      if (i === activeIndex) {
        thumb.classList.add("active");
      }
      this.$lgThumb.append(thumb);
    }
    if (thumbWindow.trailingPad > 0) {
      this.$lgThumb.append(
        `<div class="lg-thumb-spacer" aria-hidden="true" style="width: ${thumbWindow.trailingPad}px;"></div>`
      );
    }
  }
  setThumbItemHtml(items) {
    for (let i = 0; i < items.length; i++) {
      const thumb = this.getThumbHtml(items[i].thumb, i, items[i].alt);
      this.$lgThumb.append(thumb);
    }
  }
  setAnimateThumbStyles() {
    if (this.settings.animateThumb) {
      this.core.outer.addClass("lg-animate-thumb");
    }
  }
  // Manage thumbnail active calss
  manageActiveClassOnSlideChange() {
    this.core.LGel.on(
      `${lGEvents.beforeSlide}.thumb`,
      (event) => {
        const { index } = event.detail;
        this.core.outer.find(".lg-thumb-item").removeClass("active");
        this.core.outer.find(`.lg-thumb-item[data-lg-item-id="${index}"]`).addClass("active");
      }
    );
  }
  // Toggle thumbnail bar
  toggleThumbBar() {
    var _a, _b;
    if (this.settings.toggleThumb) {
      this.core.outer.addClass("lg-can-toggle");
      this.core.$toolbar.append(
        '<button type="button" aria-label="' + ((_b = (_a = this.settings.thumbnailPluginStrings) == null ? void 0 : _a.toggleThumbnails) != null ? _b : this.core.settings.strings.toggleThumbnails) + '" class="lg-toggle-thumb lg-icon"></button>'
      );
      this.core.outer.find(".lg-toggle-thumb").first().on("click.lg", () => {
        this.core.outer.toggleClass("lg-components-open");
      });
    }
  }
  thumbKeyPress() {
    this.$LG(window).on(`keydown.lg.thumb.global${this.core.lgId}`, (e) => {
      if (!this.core.lgOpened || !this.settings.toggleThumb) return;
      if (e.keyCode === 38) {
        e.preventDefault();
        this.core.outer.addClass("lg-components-open");
      } else if (e.keyCode === 40) {
        e.preventDefault();
        this.core.outer.removeClass("lg-components-open");
      }
    });
  }
  destroy() {
    this.endScrub();
    if (this.cancelThumbSpring) {
      this.cancelThumbSpring();
      this.cancelThumbSpring = void 0;
    }
    if (this.settings.thumbnail) {
      this.$LG(window).off(`.lg.thumb.global${this.core.lgId}`);
      this.core.LGel.off(".lg.thumb");
      this.core.LGel.off(".thumb");
      this.$thumbOuter.remove();
      this.core.outer.removeClass("lg-has-thumb");
    }
  }
}
export {
  Thumbnail as default
};
//# sourceMappingURL=lg-thumbnail.es5.js.map
