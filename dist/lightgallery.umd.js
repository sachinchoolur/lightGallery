(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.lightGallery = factory());
})(this, function() {
  "use strict";/*!
 * lightgallery | 3.0.0-beta.2 | October 1st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

  function getVideoInfo(src, hasHtml5Video) {
    if (!src) {
      return hasHtml5Video ? { html5: true } : void 0;
    }
    const youtube = src.match(
      /\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-_%]+)([&|?][\S]*)*/i
    );
    if (youtube) {
      return { youtube: [...youtube] };
    }
    const vimeo = src.match(
      /\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)(.*)?/i
    );
    if (vimeo) {
      return { vimeo: [...vimeo] };
    }
    const wistia = src.match(
      /https?:\/\/(.+)?(wistia\.com|wi\.st)\/(medias|embed)\/([0-9a-z\-_]+)(.*)/
    );
    if (wistia) {
      return { wistia: [...wistia] };
    }
    return hasHtml5Video ? { html5: true } : void 0;
  }
  function getYouTubePosterUrl(videoInfo) {
    if (!(videoInfo == null ? void 0 : videoInfo.youtube)) {
      return void 0;
    }
    return `//img.youtube.com/vi/${videoInfo.youtube[1]}/maxresdefault.jpg`;
  }
  function getFacadePoster(item, videoInfo, loadYouTubePoster) {
    if (!videoInfo || videoInfo.html5) {
      return item.poster || void 0;
    }
    return item.poster || (loadYouTubePoster ? getYouTubePosterUrl(videoInfo) : void 0) || item.thumb || void 0;
  }
  const TESTING_LICENSE_KEY = "0000-0000-000-0000";
  const LICENSE_KEY_PREFIX = "LIG";
  const LICENSE_DOCS = "https://www.lightgalleryjs.com/docs/license/";
  function checkLicenseKey(licenseKey) {
    const key = (licenseKey != null ? licenseKey : "").trim();
    if (!key) {
      return {
        level: "error",
        message: `lightGallery: please provide a valid license key. See ${LICENSE_DOCS}`
      };
    }
    if (key === TESTING_LICENSE_KEY) {
      return {
        level: "warn",
        message: `lightGallery: ${key} license key is not valid for production use. See ${LICENSE_DOCS}`
      };
    }
    if (!key.startsWith(LICENSE_KEY_PREFIX)) {
      return {
        level: "warn",
        message: `lightGallery: this license key is for v1 or v2 and is not valid for v3. Please upgrade to a v3 license. See ${LICENSE_DOCS}`
      };
    }
    return null;
  }
  let pageLicenseKey;
  const loggedNotices = /* @__PURE__ */ new Set();
  function setLicenseKey(licenseKey) {
    pageLicenseKey = licenseKey;
  }
  function resolveLicenseKey(instanceKey) {
    const own = (instanceKey != null ? instanceKey : "").trim();
    if (pageLicenseKey !== void 0 && (!own || own === TESTING_LICENSE_KEY)) {
      return pageLicenseKey;
    }
    return instanceKey != null ? instanceKey : TESTING_LICENSE_KEY;
  }
  function takeLicenseNotice(instanceKey) {
    const notice = checkLicenseKey(resolveLicenseKey(instanceKey));
    if (!notice || loggedNotices.has(notice.message)) return null;
    loggedNotices.add(notice.message);
    return notice;
  }
  function formatSlideAnnouncement(options) {
    const base = options.template.replace("{index}", String(options.index)).replace("{total}", String(options.total));
    const caption = (options.caption || "").replace(/\s+/g, " ").trim();
    return caption ? `${base}, ${caption}` : base;
  }
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
  const SWIPE_AXIS_THRESHOLD = 10;
  const FLICK_VELOCITY = 0.5;
  const FLICK_MIN_DISTANCE = 20;
  const VERTICAL_CLOSE_THRESHOLD = 100;
  const VERTICAL_CLOSE_RATIO = 0.4;
  const VERTICAL_CLOSE_MIN_DRAG = 40;
  const SLIDE_EDGE_FRICTION = 0.35;
  function getEdgeFrictionedDelta(deltaX, hasPrev, hasNext, direction = "ltr") {
    const [towardPrev, towardNext] = direction === "rtl" ? [hasNext, hasPrev] : [hasPrev, hasNext];
    if (deltaX > 0 && !towardPrev || deltaX < 0 && !towardNext) {
      return deltaX * SLIDE_EDGE_FRICTION;
    }
    return deltaX;
  }
  function getSwipeAxis(deltaX, deltaY, current) {
    if (current) {
      return current;
    }
    if (Math.abs(deltaX) > SWIPE_AXIS_THRESHOLD) {
      return "horizontal";
    }
    if (Math.abs(deltaY) > SWIPE_AXIS_THRESHOLD) {
      return "vertical";
    }
    return void 0;
  }
  function getHorizontalDragTransforms(deltaX, slideWidth, direction = "ltr") {
    const slideWidthAmount = slideWidth * 15 / 100;
    const gutter = slideWidthAmount - Math.abs(deltaX * 10 / 100);
    const before = `translate3d(${-slideWidth + deltaX - gutter}px, 0px, 0px)`;
    const after = `translate3d(${slideWidth + deltaX + gutter}px, 0px, 0px)`;
    return {
      current: `translate3d(${deltaX}px, 0px, 0px)`,
      // In RTL the prev slide rests to the physical right (lg-rtl.css
      // flips the resting positions the same way).
      prev: direction === "rtl" ? after : before,
      next: direction === "rtl" ? before : after
    };
  }
  function getVerticalDragEffects(deltaY, viewportWidth, viewportHeight) {
    const distance = Math.abs(deltaY);
    const scale = 1 - distance / (viewportWidth * 2);
    return {
      backdropOpacity: 1 - distance / viewportHeight,
      transform: `translate3d(0px, ${deltaY}px, 0px) scale3d(${scale}, ${scale}, 1)`,
      hideUi: distance > VERTICAL_CLOSE_THRESHOLD
    };
  }
  function getSwipeReleaseVerdict({
    deltaX,
    velocityX,
    threshold,
    flickVelocity = FLICK_VELOCITY,
    viewportWidth,
    direction = "ltr"
  }) {
    const distance = Math.abs(deltaX);
    const directionMatches = deltaX !== 0 && Math.sign(velocityX) === Math.sign(deltaX);
    const projected = deltaX + project(velocityX);
    const passes = distance > threshold || distance > FLICK_MIN_DISTANCE && directionMatches && Math.abs(velocityX) > flickVelocity || viewportWidth !== void 0 && distance > FLICK_MIN_DISTANCE && directionMatches && Math.abs(projected) > viewportWidth / 2;
    if (!passes) {
      return "stay";
    }
    const towardNext = direction === "rtl" ? deltaX > 0 : deltaX < 0;
    return towardNext ? "next" : "prev";
  }
  function shouldCloseOnVerticalDrag(deltaY, velocityY, viewportHeight, options) {
    if (!options.closable || !options.swipeToClose || deltaY === 0) {
      return false;
    }
    if (Math.abs(deltaY) < VERTICAL_CLOSE_MIN_DRAG) {
      return false;
    }
    const projected = deltaY + project(velocityY);
    return Math.sign(projected) === Math.sign(deltaY) && Math.abs(projected) > VERTICAL_CLOSE_RATIO * viewportHeight;
  }
  function resolveSwipeTarget(verdict, currentIndex, slidesCount, loop) {
    if (verdict === "stay") {
      return null;
    }
    const touchLoop = loop && slidesCount >= 3;
    if (verdict === "next") {
      if (currentIndex + 1 < slidesCount) {
        return currentIndex + 1;
      }
      return touchLoop ? 0 : null;
    }
    if (currentIndex > 0) {
      return currentIndex - 1;
    }
    return touchLoop ? slidesCount - 1 : null;
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
  function isUsableOriginRect(rect) {
    return !!rect && Number.isFinite(rect.left) && Number.isFinite(rect.top) && rect.width > 0 && rect.height > 0;
  }
  const CENTER_CLOSE_SCALE = 0.5;
  function getCenterCloseTransform(scale = CENTER_CLOSE_SCALE) {
    return `translate3d(0, 0, 0) scale3d(${scale}, ${scale}, 1)`;
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
  const coreDefaultIcons = {
    close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M810 664.667l-238-238 238-238-60-60-238 238-238-238-60 60 238 238-238 238 60 60 238-238 238 238z"/></svg>',
    // Three dots for the toolbar's More options menu button.
    more: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><circle cx="232" cy="512" r="80"/><circle cx="512" cy="512" r="80"/><circle cx="792" cy="512" r="80"/></svg>',
    prev: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M426.667 768q17.667 0 30.167-12.5t12.5-30.167q0-18-12.667-30.333l-225.667-225.667h665q17.667 0 30.167-12.5t12.5-30.167-12.5-30.167-30.167-12.5h-665l225.667-225.667q12.667-12.333 12.667-30.333 0-17.667-12.5-30.167t-30.167-12.5q-18 0-30.333 12.333l-298.667 298.667q-12.333 13-12.333 30.333t12.333 30.333l298.667 298.667q12.667 12.333 30.333 12.333z"/></svg>',
    next: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M597.333 768q18 0 30.333-12.333l298.667-298.667q12.333-12.333 12.333-30.333t-12.333-30.333l-298.667-298.667q-12.333-12.333-30.333-12.333-18.333 0-30.5 12.167t-12.167 30.5q0 18 12.333 30.333l226 225.667h-665q-17.667 0-30.167 12.5t-12.5 30.167 12.5 30.167 30.167 12.5h665l-226 225.667q-12.333 12.333-12.333 30.333 0 18.333 12.167 30.5t30.5 12.167z"/></svg>',
    download: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M170 128.667h684v-86h-684v86zM682 384.667l-170-172-170 172h128v426h84v-426h128z"/></svg>',
    maximize: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M793.003 768l-225.835-225.835c-16.683-16.683-16.683-43.691 0-60.331s43.691-16.683 60.331 0l225.835 225.835v-153.003c0-23.552 19.115-42.667 42.667-42.667s42.667 19.115 42.667 42.667v256c0 5.803-1.152 11.307-3.243 16.341s-5.163 9.728-9.216 13.781c-0.043 0.043-0.043 0.043-0.085 0.085-3.925 3.925-8.619 7.083-13.781 9.216-5.035 2.091-10.539 3.243-16.341 3.243h-256c-23.552 0-42.667-19.115-42.667-42.667s19.115-42.667 42.667-42.667zM230.997 85.334l225.835 225.835c16.683 16.683 16.683 43.691 0 60.331s-43.691 16.683-60.331 0l-225.835-225.835v153.003c0 23.552-19.115 42.667-42.667 42.667s-42.667-19.115-42.667-42.667v-256c0-23.552 19.115-42.667 42.667-42.667h256c23.552 0 42.667 19.115 42.667 42.667s-19.115 42.667-42.667 42.667z"/></svg>',
    minimize: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M700.331 554.667l225.835 225.835c16.683 16.683 16.683 43.691 0 60.331s-43.691 16.683-60.331 0l-225.835-225.835v153.003c0 23.552-19.115 42.667-42.667 42.667s-42.667-19.115-42.667-42.667v-256c0-5.803 1.152-11.307 3.243-16.341s5.163-9.728 9.216-13.781c0.043-0.043 0.043-0.043 0.085-0.085 3.925-3.925 8.619-7.083 13.781-9.216 5.035-2.091 10.539-3.243 16.341-3.243h256c23.552 0 42.667 19.115 42.667 42.667s-19.115 42.667-42.667 42.667zM158.165 12.502l225.835 225.835v-153.003c0-23.552 19.115-42.667 42.667-42.667s42.667 19.115 42.667 42.667v256c0 5.803-1.152 11.307-3.243 16.341s-5.163 9.728-9.216 13.781c-0.043 0.043-0.043 0.043-0.085 0.085-4.096 4.053-8.789 7.125-13.781 9.216-5.035 2.091-10.539 3.243-16.341 3.243h-256c-23.552 0-42.667-19.115-42.667-42.667s19.115-42.667 42.667-42.667h153.003l-225.835-225.835c-16.683-16.683-16.683-43.691 0-60.331s43.691-16.683 60.331 0z"/></svg>'
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
  const TOOLBAR_PINNED = Number.POSITIVE_INFINITY;
  const TOOLBAR_DEFAULT_PRIORITY = 20;
  const PRIORITY_BY_CLASS = [
    ["lg-close", TOOLBAR_PINNED],
    ["lg-share", 30],
    ["lg-autoplay-button", 30],
    ["lg-download", 30],
    ["lg-fullscreen", 20],
    ["lg-toggle-thumb", 20],
    ["lg-comment-toggle", 20],
    ["lg-maximize", 10],
    ["lg-rotate-left", 10],
    ["lg-rotate-right", 10],
    ["lg-flip-hor", 10],
    ["lg-flip-ver", 10],
    // Gesture duplicates go first: pinch and double-tap do the same.
    ["lg-zoom-in", 0],
    ["lg-zoom-out", 0],
    ["lg-actual-size", 0]
  ];
  function getToolbarItemPriority(classList) {
    const classes = new Set(classList);
    for (const [className, priority] of PRIORITY_BY_CLASS) {
      if (classes.has(className)) {
        return priority;
      }
    }
    return TOOLBAR_DEFAULT_PRIORITY;
  }
  function getToolbarOverflow({
    available,
    reserved,
    moreWidth,
    items
  }) {
    if (available <= 0) {
      return [];
    }
    const total = items.reduce((sum, item) => sum + item.width, 0);
    if (reserved + total <= available) {
      return [];
    }
    const candidates = items.map((item, index) => __spreadProps$1(__spreadValues$1({}, item), { index })).filter((item) => item.priority !== TOOLBAR_PINNED).sort((a, b) => a.priority - b.priority || b.index - a.index);
    let used = reserved + moreWidth + total;
    const moved = [];
    for (const item of candidates) {
      if (used <= available) {
        break;
      }
      moved.push(item.index);
      used -= item.width;
    }
    return moved.sort((a, b) => a - b);
  }
  const BACKDROP_CLASS_NAMES = [
    "lg-outer",
    "lg-item",
    "lg-img-wrap",
    "lg-img-rotate"
  ];
  function consumeBackdropPress(event) {
    var _a;
    const classList = (_a = event.target) == null ? void 0 : _a.classList;
    if (!classList || !BACKDROP_CLASS_NAMES.some((name) => classList.contains(name))) {
      return false;
    }
    event.preventDefault();
    event.stopPropagation();
    return true;
  }
  function onTransitionSettle(element, property, fallbackMs, callback) {
    let settled = false;
    let timer;
    const isOwn = (event) => event.target === element && event.propertyName === property;
    const dispose = () => {
      clearTimeout(timer);
      element.removeEventListener("transitionstart", onStart);
      element.removeEventListener("transitionend", onEnd);
    };
    const settle = () => {
      if (settled) {
        return;
      }
      settled = true;
      dispose();
      callback();
    };
    const onStart = (event) => {
      if (isOwn(event)) {
        clearTimeout(timer);
        timer = setTimeout(settle, fallbackMs);
      }
    };
    const onEnd = (event) => {
      if (isOwn(event)) {
        settle();
      }
    };
    element.addEventListener("transitionstart", onStart);
    element.addEventListener("transitionend", onEnd);
    timer = setTimeout(settle, fallbackMs);
    return () => {
      settled = true;
      dispose();
    };
  }
  const DECODE_TIMEOUT_MS = 500;
  function awaitDecode(img, timeoutMs = DECODE_TIMEOUT_MS) {
    if (typeof img.decode !== "function") {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (!done) {
          done = true;
          clearTimeout(timer);
          resolve();
        }
      };
      const timer = setTimeout(finish, timeoutMs);
      img.decode().then(finish, finish);
    });
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
  const lGEvents = {
    afterAppendSlide: "lgAfterAppendSlide",
    init: "lgInit",
    hasVideo: "lgHasVideo",
    containerResize: "lgContainerResize",
    updateSlides: "lgUpdateSlides",
    afterAppendSubHtml: "lgAfterAppendSubHtml",
    beforeOpen: "lgBeforeOpen",
    afterOpen: "lgAfterOpen",
    slideItemLoad: "lgSlideItemLoad",
    beforeSlide: "lgBeforeSlide",
    afterSlide: "lgAfterSlide",
    posterClick: "lgPosterClick",
    dragStart: "lgDragStart",
    dragMove: "lgDragMove",
    dragEnd: "lgDragEnd",
    beforeNextSlide: "lgBeforeNextSlide",
    beforePrevSlide: "lgBeforePrevSlide",
    beforeClose: "lgBeforeClose",
    afterClose: "lgAfterClose"
  };
  const lightGalleryCoreSettings = {
    mode: "lg-slide",
    easing: "ease",
    speed: 400,
    licenseKey: "0000-0000-000-0000",
    height: "100%",
    width: "100%",
    addClass: "",
    startClass: "lg-start-zoom",
    backdropDuration: 300,
    container: "",
    startAnimationDuration: 400,
    zoomFromOrigin: true,
    hideBarsDelay: 0,
    showBarsAfter: 1e4,
    slideDelay: 0,
    supportLegacyBrowser: true,
    allowMediaOverlap: false,
    videoMaxSize: "1280-720",
    loadYouTubePoster: true,
    defaultCaptionHeight: 0,
    ariaLabelledby: "",
    ariaDescribedby: "",
    ariaAnnouncements: true,
    resetScrollPosition: true,
    hideScrollbar: false,
    closable: true,
    swipeToClose: true,
    closeOnTap: true,
    showCloseIcon: true,
    showMaximizeIcon: false,
    loop: true,
    escKey: true,
    keyPress: true,
    trapFocus: true,
    controls: true,
    slideEndAnimation: true,
    hideControlOnEnd: false,
    mousewheel: false,
    direction: "ltr",
    getCaptionFromTitleOrAlt: true,
    appendSubHtmlTo: ".lg-sub-html",
    subHtmlSelectorRelative: false,
    preload: 2,
    numberOfSlideItemsInDom: 10,
    selector: "",
    selectWithin: "",
    nextHtml: "",
    prevHtml: "",
    index: 0,
    iframeWidth: "100%",
    iframeHeight: "100%",
    iframeMaxWidth: "100%",
    iframeMaxHeight: "100%",
    download: true,
    counter: true,
    appendCounterTo: ".lg-toolbar",
    swipeThreshold: 50,
    flickVelocity: 0.5,
    pinchToClose: true,
    enableSwipe: true,
    enableDrag: true,
    dynamic: false,
    dynamicEl: [],
    extraProps: [],
    exThumbImage: "",
    toolbarOverflow: true,
    showGestureButtons: true,
    isMobile: void 0,
    mobileSettings: {
      controls: false,
      showCloseIcon: false,
      download: false,
      showGestureButtons: false
    },
    plugins: [],
    strings: {
      closeGallery: "Close gallery",
      toggleMaximize: "Toggle maximize",
      previousSlide: "Previous slide",
      nextSlide: "Next slide",
      download: "Download",
      playVideo: "Play video",
      mediaLoadingFailed: "Oops... Failed to load content...",
      galleryLabel: "Gallery",
      slideAnnouncement: "Image {index} of {total}",
      moreOptions: "More options",
      share: "Share",
      toggleThumbnails: "Toggle thumbnails",
      toggleAutoplay: "Toggle Autoplay",
      toggleFullscreen: "Toggle Fullscreen",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      viewActualSize: "View actual size",
      rotateLeft: "Rotate left",
      rotateRight: "Rotate right",
      flipHorizontal: "Flip horizontal",
      flipVertical: "Flip vertical",
      toggleComments: "Toggle Comments"
    },
    icons: {}
  };
  const schedule = typeof requestAnimationFrame === "function" ? (callback) => requestAnimationFrame(callback) : (callback) => window.setTimeout(callback, 16);
  const cancel = typeof cancelAnimationFrame === "function" ? (handle) => cancelAnimationFrame(handle) : (handle) => window.clearTimeout(handle);
  function toolbarButtons(toolbar, more) {
    return Array.from(toolbar.querySelectorAll(".lg-icon")).filter(
      (button) => {
        var _a;
        return button !== more && !button.closest(".lg-toolbar-menu, .lg-dropdown") && !((_a = button.parentElement) == null ? void 0 : _a.closest(".lg-icon"));
      }
    );
  }
  function visibleIconMarkup(button) {
    var _a, _b, _c;
    const icons = Array.from(button.querySelectorAll(".lg-ci"));
    if (!icons.length) {
      return (_b = (_a = button.querySelector("svg")) == null ? void 0 : _a.outerHTML) != null ? _b : "";
    }
    const shown = (_c = icons.find(
      (icon) => window.getComputedStyle(icon).display !== "none"
    )) != null ? _c : icons[0];
    return shown.outerHTML;
  }
  class ToolbarOverflow {
    constructor(toolbar, options) {
      this.toolbar = toolbar;
      this.options = options;
      this.menu = null;
      this.frame = 0;
      this.movedSignature = "";
      this.widths = /* @__PURE__ */ new WeakMap();
      this.requestUpdate = () => {
        if (this.frame) {
          return;
        }
        this.frame = schedule(() => {
          this.frame = 0;
          this.update();
        });
      };
      this.onMoreClick = () => {
        if (this.menu) {
          this.close(true);
        } else {
          this.open();
        }
      };
      this.onMenuKeydown = (event) => {
        var _a, _b, _c, _d;
        const items = this.items();
        const index = items.indexOf(document.activeElement);
        switch (event.key) {
          case "Escape":
            this.close(true);
            break;
          case "ArrowDown":
            (_a = items[(index + 1) % items.length]) == null ? void 0 : _a.focus();
            break;
          case "ArrowUp":
            (_b = items[(index - 1 + items.length) % items.length]) == null ? void 0 : _b.focus();
            break;
          case "Home":
            (_c = items[0]) == null ? void 0 : _c.focus();
            break;
          case "End":
            (_d = items[items.length - 1]) == null ? void 0 : _d.focus();
            break;
          case "ArrowLeft":
          case "ArrowRight":
            break;
          case "Tab":
            this.close(false);
            return;
          default:
            return;
        }
        event.preventDefault();
        event.stopPropagation();
      };
      this.onDocumentPointerDown = (event) => {
        var _a;
        const target = event.target;
        if (target && (((_a = this.menu) == null ? void 0 : _a.contains(target)) || this.more.contains(target))) {
          return;
        }
        consumeBackdropPress(event);
        this.close(false);
      };
      const more = document.createElement("button");
      more.type = "button";
      more.id = options.id;
      more.className = "lg-more lg-icon";
      more.hidden = true;
      more.setAttribute("aria-label", options.label);
      more.setAttribute("aria-haspopup", "menu");
      more.setAttribute("aria-expanded", "false");
      more.addEventListener("click", this.onMoreClick);
      const close = toolbar.querySelector(".lg-close");
      if (close) {
        close.insertAdjacentElement("afterend", more);
      } else {
        toolbar.insertBefore(more, toolbar.firstChild);
      }
      this.more = more;
      if (typeof ResizeObserver === "function") {
        this.resizeObserver = new ResizeObserver(this.requestUpdate);
        this.resizeObserver.observe(toolbar);
      }
      if (typeof MutationObserver === "function") {
        this.mutationObserver = new MutationObserver((records) => {
          if (records.some(
            (record) => {
              var _a, _b;
              return !((_b = (_a = record.target).closest) == null ? void 0 : _b.call(
                _a,
                ".lg-toolbar-menu"
              ));
            }
          )) {
            this.requestUpdate();
          }
        });
        this.mutationObserver.observe(toolbar, {
          childList: true,
          subtree: true
        });
      }
    }
    /** Re-measure the row and move buttons in or out of the menu. */
    update() {
      var _a, _b;
      const buttons = toolbarButtons(this.toolbar, this.more);
      buttons.forEach((button) => {
        if (!button.hasAttribute("data-lg-overflow")) {
          const width = button.offsetWidth;
          if (width) {
            this.widths.set(button, width);
          }
        }
      });
      const fallback = (_a = buttons.map((button) => this.widths.get(button)).find((width) => !!width)) != null ? _a : 0;
      const counter = this.toolbar.querySelector(".lg-counter");
      const moved = getToolbarOverflow({
        available: this.toolbar.clientWidth,
        reserved: counter ? counter.offsetWidth : 0,
        moreWidth: (_b = this.widths.get(this.more)) != null ? _b : fallback,
        items: buttons.map((button) => {
          var _a2;
          return {
            width: (_a2 = this.widths.get(button)) != null ? _a2 : fallback,
            priority: getToolbarItemPriority(Array.from(button.classList))
          };
        })
      });
      const overflow = new Set(moved);
      buttons.forEach((button, index) => {
        if (overflow.has(index)) {
          button.setAttribute("data-lg-overflow", "");
        } else {
          button.removeAttribute("data-lg-overflow");
        }
      });
      this.more.hidden = overflow.size === 0;
      if (!this.more.hidden && this.more.offsetWidth) {
        this.widths.set(this.more, this.more.offsetWidth);
      }
      const signature = `${buttons.length}:${moved.join(",")}`;
      const changed = signature !== this.movedSignature;
      this.movedSignature = signature;
      if (!overflow.size) {
        this.close(false);
      } else if (this.menu && changed) {
        this.renderMenu();
      }
    }
    /** Close the menu; optionally hand focus back to the More button. */
    close(returnFocus) {
      if (!this.menu) {
        return;
      }
      this.menu.removeEventListener("keydown", this.onMenuKeydown);
      this.menu.remove();
      this.menu = null;
      document.removeEventListener(
        "pointerdown",
        this.onDocumentPointerDown,
        true
      );
      this.more.setAttribute("aria-expanded", "false");
      this.more.removeAttribute("aria-controls");
      if (returnFocus) {
        this.more.focus();
      }
    }
    destroy() {
      var _a, _b;
      this.close(false);
      cancel(this.frame);
      (_a = this.resizeObserver) == null ? void 0 : _a.disconnect();
      (_b = this.mutationObserver) == null ? void 0 : _b.disconnect();
      toolbarButtons(this.toolbar, this.more).forEach(
        (button) => button.removeAttribute("data-lg-overflow")
      );
      this.more.remove();
    }
    open() {
      var _a;
      const menu = document.createElement("div");
      menu.id = `${this.options.id}-menu`;
      menu.className = "lg-toolbar-menu";
      menu.setAttribute("role", "menu");
      menu.setAttribute("aria-label", this.options.label);
      menu.addEventListener("keydown", this.onMenuKeydown);
      this.menu = menu;
      this.renderMenu();
      this.toolbar.appendChild(menu);
      this.more.setAttribute("aria-expanded", "true");
      this.more.setAttribute("aria-controls", menu.id);
      document.addEventListener(
        "pointerdown",
        this.onDocumentPointerDown,
        true
      );
      (_a = this.items()[0]) == null ? void 0 : _a.focus();
    }
    renderMenu() {
      const menu = this.menu;
      if (!menu) {
        return;
      }
      menu.textContent = "";
      toolbarButtons(this.toolbar, this.more).filter((button) => button.hasAttribute("data-lg-overflow")).forEach((button) => {
        var _a;
        const item = document.createElement("button");
        item.type = "button";
        item.className = "lg-toolbar-menu-item";
        item.setAttribute("role", "menuitem");
        const icon = document.createElement("span");
        icon.className = "lg-toolbar-menu-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.innerHTML = visibleIconMarkup(button);
        const label = document.createElement("span");
        label.textContent = (_a = button.getAttribute("aria-label")) != null ? _a : "";
        item.append(icon, label);
        item.addEventListener("click", () => {
          this.close(true);
          button.click();
        });
        menu.appendChild(item);
      });
    }
    items() {
      return this.menu ? Array.from(
        this.menu.querySelectorAll('[role="menuitem"]')
      ) : [];
    }
  }
  const ICON_TARGETS = [
    { selector: ".lg-close", names: ["close"] },
    { selector: ".lg-prev", names: ["prev"] },
    { selector: ".lg-next", names: ["next"] },
    { selector: ".lg-download", names: ["download"] },
    { selector: ".lg-more", names: ["more"] },
    // Shown while `.lg-inline` (prompting maximize) / after maximizing.
    { selector: ".lg-maximize", names: ["maximize", "minimize"] },
    // The actual-size button's CLASS toggles between the two zoom
    // classes as the zoom state changes (2.x swapped the glyph that
    // way), it carries BOTH zoom icons and the class picks one in
    // CSS. Listed before the class-based zoom targets so the id match
    // claims it first (the pass skips already-processed elements).
    { selector: '[id^="lg-actual-size-"]', names: ["zoomIn", "zoomOut"] },
    { selector: ".lg-zoom-in", names: ["zoomIn"] },
    { selector: ".lg-zoom-out", names: ["zoomOut"] },
    // No '.lg-actual-size' target: vanilla's actual-size BUTTON never
    // carries that class (it rides the zoom classes above; the outer
    // gets `lg-actual-size` as a zoom-state class after build). The
    // `actualSize` name serves the framework ports' static button.
    { selector: ".lg-rotate-left", names: ["rotateLeft"] },
    { selector: ".lg-rotate-right", names: ["rotateRight"] },
    { selector: ".lg-flip-hor", names: ["flipHorizontal"] },
    { selector: ".lg-flip-ver", names: ["flipVertical"] },
    { selector: ".lg-share", names: ["share"] },
    { selector: ".lg-share-facebook .lg-icon", names: ["shareFacebook"] },
    { selector: ".lg-share-twitter .lg-icon", names: ["shareX"] },
    { selector: ".lg-share-pinterest .lg-icon", names: ["sharePinterest"] },
    // Shown while idle (prompting play) / while `.lg-show-autoplay`.
    {
      selector: ".lg-autoplay-button",
      names: ["autoplayPlay", "autoplayPause"]
    },
    // Shown while windowed / while `.lg-fullscreen-on`.
    { selector: ".lg-fullscreen", names: ["fullscreen", "fullscreenExit"] },
    { selector: ".lg-comment-toggle", names: ["comment"] },
    { selector: ".lg-comment-close", names: ["commentClose"] },
    { selector: ".lg-toggle-thumb", names: ["toggleThumbnails"] }
  ];
  const toKebab = (name) => name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
  function getCustomIconMarkup(icons, names) {
    if (!names.every((name) => icons[name])) {
      return "";
    }
    return names.map(
      (name) => `<span class="lg-ci lg-ci-${toKebab(
        name
      )}" aria-hidden="true">${icons[name]}</span>`
    ).join("");
  }
  function applyCustomIcons(container, defaults, overrides) {
    ICON_TARGETS.forEach(({ selector, names }) => {
      const source = overrides && names.every((name) => overrides[name]) ? overrides : defaults;
      const markup = getCustomIconMarkup(source, names);
      if (!markup) {
        return;
      }
      container.querySelectorAll(selector).forEach((element) => {
        if (element.classList.contains("lg-icon-custom")) {
          return;
        }
        element.classList.add("lg-icon-custom");
        element.insertAdjacentHTML("afterbegin", markup);
      });
    });
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
  function initLgPolyfills() {
    (function() {
      if (typeof window.CustomEvent === "function") return false;
      function CustomEvent2(event, params) {
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: null
        };
        const evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(
          event,
          params.bubbles,
          params.cancelable,
          params.detail
        );
        return evt;
      }
      window.CustomEvent = CustomEvent2;
    })();
    (function() {
      if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
      }
    })();
  }
  const _lgQuery = class _lgQuery2 {
    constructor(selector) {
      this.cssVenderPrefixes = [
        "TransitionDuration",
        "TransitionTimingFunction",
        "Transform",
        "Transition"
      ];
      this.selector = this._getSelector(selector);
      this.firstElement = this._getFirstEl();
      return this;
    }
    static generateUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c) {
          const r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
          return v.toString(16);
        }
      );
    }
    _getSelector(selector, context = document) {
      if (typeof selector !== "string") {
        return selector;
      }
      context = context || document;
      const fl = selector.substring(0, 1);
      if (fl === "#") {
        return context.querySelector(selector);
      } else {
        return context.querySelectorAll(selector);
      }
    }
    _each(func) {
      if (!this.selector) {
        return this;
      }
      if (this.selector.length !== void 0) {
        [].forEach.call(this.selector, func);
      } else {
        func(this.selector, 0);
      }
      return this;
    }
    _setCssVendorPrefix(el, cssProperty, value) {
      if (cssProperty.startsWith("--")) {
        el.style.setProperty(cssProperty, String(value));
        return;
      }
      const property = cssProperty.replace(/-([a-z])/gi, function(s, group1) {
        return group1.toUpperCase();
      });
      if (this.cssVenderPrefixes.indexOf(property) !== -1) {
        el.style[property.charAt(0).toLowerCase() + property.slice(1)] = value;
        el.style["webkit" + property] = value;
        el.style["moz" + property] = value;
        el.style["ms" + property] = value;
        el.style["o" + property] = value;
      } else {
        el.style[property] = value;
      }
    }
    _getFirstEl() {
      if (this.selector && this.selector.length !== void 0) {
        return this.selector[0];
      } else {
        return this.selector;
      }
    }
    isEventMatched(event, eventName) {
      const eventNamespace = eventName.split(".");
      return event.split(".").filter((e) => e).every((e) => {
        return eventNamespace.indexOf(e) !== -1;
      });
    }
    attr(attr, value) {
      if (value === void 0) {
        if (!this.firstElement) {
          return "";
        }
        return this.firstElement.getAttribute(attr);
      }
      this._each((el) => {
        el.setAttribute(attr, value);
      });
      return this;
    }
    find(selector) {
      return $LG(this._getSelector(selector, this.selector));
    }
    first() {
      if (this.selector && this.selector.length !== void 0) {
        return $LG(this.selector[0]);
      } else {
        return $LG(this.selector);
      }
    }
    eq(index) {
      return $LG(this.selector[index]);
    }
    parent() {
      return $LG(this.selector.parentElement);
    }
    get() {
      return this._getFirstEl();
    }
    removeAttr(attributes) {
      const attrs = attributes.split(" ");
      this._each((el) => {
        attrs.forEach((attr) => el.removeAttribute(attr));
      });
      return this;
    }
    wrap(className) {
      if (!this.firstElement) {
        return this;
      }
      const wrapper = document.createElement("div");
      wrapper.className = className;
      this.firstElement.parentNode.insertBefore(wrapper, this.firstElement);
      this.firstElement.parentNode.removeChild(this.firstElement);
      wrapper.appendChild(this.firstElement);
      return this;
    }
    addClass(classNames = "") {
      this._each((el) => {
        classNames.split(" ").forEach((className) => {
          if (className) {
            el.classList.add(className);
          }
        });
      });
      return this;
    }
    removeClass(classNames) {
      this._each((el) => {
        classNames.split(" ").forEach((className) => {
          if (className) {
            el.classList.remove(className);
          }
        });
      });
      return this;
    }
    hasClass(className) {
      if (!this.firstElement) {
        return false;
      }
      return this.firstElement.classList.contains(className);
    }
    hasAttribute(attribute) {
      if (!this.firstElement) {
        return false;
      }
      return this.firstElement.hasAttribute(attribute);
    }
    toggleClass(className) {
      if (!this.firstElement) {
        return this;
      }
      if (this.hasClass(className)) {
        this.removeClass(className);
      } else {
        this.addClass(className);
      }
      return this;
    }
    css(property, value) {
      this._each((el) => {
        this._setCssVendorPrefix(el, property, value);
      });
      return this;
    }
    // Need to pass separate namespaces for separate elements
    on(events, listener) {
      if (!this.selector) {
        return this;
      }
      events.split(" ").forEach((event) => {
        if (!Array.isArray(_lgQuery2.eventListeners[event])) {
          _lgQuery2.eventListeners[event] = [];
        }
        _lgQuery2.eventListeners[event].push(listener);
        this.selector.addEventListener(event.split(".")[0], listener);
      });
      return this;
    }
    // @todo - test this
    once(event, listener) {
      this.on(event, () => {
        this.off(event);
        listener(event);
      });
      return this;
    }
    off(event) {
      if (!this.selector) {
        return this;
      }
      Object.keys(_lgQuery2.eventListeners).forEach((eventName) => {
        if (this.isEventMatched(event, eventName)) {
          _lgQuery2.eventListeners[eventName].forEach((listener) => {
            this.selector.removeEventListener(
              eventName.split(".")[0],
              listener
            );
          });
          _lgQuery2.eventListeners[eventName] = [];
        }
      });
      return this;
    }
    trigger(event, detail) {
      if (!this.firstElement) {
        return this;
      }
      const customEvent = new CustomEvent(event.split(".")[0], {
        detail: detail || null
      });
      this.firstElement.dispatchEvent(customEvent);
      return this;
    }
    // Does not support IE
    load(url) {
      fetch(url).then((res) => res.text()).then((html) => {
        this.selector.innerHTML = html;
      });
      return this;
    }
    html(html) {
      if (html === void 0) {
        if (!this.firstElement) {
          return "";
        }
        return this.firstElement.innerHTML;
      }
      this._each((el) => {
        el.innerHTML = html;
      });
      return this;
    }
    append(html) {
      this._each((el) => {
        if (typeof html === "string") {
          el.insertAdjacentHTML("beforeend", html);
        } else {
          el.appendChild(html);
        }
      });
      return this;
    }
    prepend(html) {
      this._each((el) => {
        if (typeof html === "string") {
          el.insertAdjacentHTML("afterbegin", html);
        } else if (html instanceof HTMLElement) {
          el.insertBefore(html.cloneNode(true), el.firstChild);
        }
      });
      return this;
    }
    remove() {
      this._each((el) => {
        el.parentNode.removeChild(el);
      });
      return this;
    }
    empty() {
      this._each((el) => {
        el.innerHTML = "";
      });
      return this;
    }
    scrollTop(scrollTop) {
      if (scrollTop !== void 0) {
        document.body.scrollTop = scrollTop;
        document.documentElement.scrollTop = scrollTop;
        return this;
      } else {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      }
    }
    scrollLeft(scrollLeft) {
      if (scrollLeft !== void 0) {
        document.body.scrollLeft = scrollLeft;
        document.documentElement.scrollLeft = scrollLeft;
        return this;
      } else {
        return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
      }
    }
    offset() {
      if (!this.firstElement) {
        return {
          left: 0,
          top: 0
        };
      }
      const rect = this.firstElement.getBoundingClientRect();
      const bodyMarginLeft = $LG("body").style().marginLeft;
      return {
        left: rect.left - parseFloat(bodyMarginLeft) + this.scrollLeft(),
        top: rect.top + this.scrollTop()
      };
    }
    style() {
      if (!this.firstElement) {
        return {};
      }
      return this.firstElement.currentStyle || window.getComputedStyle(this.firstElement);
    }
    // Width without padding and border even if box-sizing is used.
    width() {
      const style = this.style();
      return this.firstElement.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    }
    // Height without padding and border even if box-sizing is used.
    height() {
      const style = this.style();
      return this.firstElement.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    }
  };
  _lgQuery.eventListeners = {};
  let lgQuery = _lgQuery;
  function $LG(selector) {
    initLgPolyfills();
    return new lgQuery(selector);
  }
  const defaultDynamicOptions = [
    "src",
    "sources",
    "subHtml",
    "subHtmlUrl",
    "html",
    "video",
    "poster",
    "slideName",
    "responsive",
    "srcset",
    "sizes",
    "iframe",
    "downloadUrl",
    "download",
    "width",
    "shareUrl",
    "facebookShareUrl",
    "tweetText",
    "iframeTitle",
    "twitterShareUrl",
    "pinterestShareUrl",
    "pinterestText",
    "fbHtml",
    "disqusIdentifier",
    "disqusUrl"
  ];
  function convertToData(attr) {
    if (attr === "href") {
      return "src";
    }
    attr = attr.replace("data-", "");
    attr = attr.charAt(0).toLowerCase() + attr.slice(1);
    attr = attr.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    return attr;
  }
  const utils = {
    /**
     * Fetches HTML content from a given URL and inserts it into a specified element.
     *
     * @param url - The URL to fetch the HTML content from.
     * @param element - The DOM element (jQuery object) to insert the HTML content into.
     * @param insertMethod - The method to insert the HTML ('append' or 'replace').
     */
    fetchCaptionFromUrl(url, element, insertMethod) {
      fetch(url).then((response) => response.text()).then((htmlContent) => {
        if (insertMethod === "append") {
          const contentDiv = `<div class="lg-sub-html">${htmlContent}</div>`;
          element.append(contentDiv);
        } else {
          element.html(htmlContent);
        }
      });
    },
    /**
     * get possible width and height from the lgSize attribute. Used for ZoomFromOrigin option
     */
    getSize(el, container, spacing = 0, defaultLgSize) {
      const LGel = $LG(el);
      const lgSize = LGel.attr("data-lg-size") || defaultLgSize;
      const parsed = parseImageSize(lgSize, window.innerWidth);
      if (!parsed) {
        return;
      }
      return fitImageSize(
        parsed,
        container.width(),
        container.height() - spacing
      );
    },
    /**
     * @desc Get transform value based on the imageSize. Used for ZoomFromOrigin option
     * @param {jQuery Element}
     * @returns {String} Transform CSS string
     */
    getTransform(el, container, top, bottom, imageSize) {
      if (!imageSize || imageSize.width <= 0 || imageSize.height <= 0) {
        return;
      }
      const LGel = $LG(el).find("img").first();
      if (!LGel.get()) {
        return;
      }
      const containerRect = container.get().getBoundingClientRect();
      const rect = LGel.get().getBoundingClientRect();
      const triggerRect = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      };
      if (!isUsableOriginRect(triggerRect)) {
        return;
      }
      return getOriginTransform({
        triggerRect,
        containerRect: {
          left: containerRect.left,
          top: containerRect.top,
          width: containerRect.width,
          // Element height, not rect height, includes the mobile
          // safari bottom bar handling this always had.
          height: container.height()
        },
        top,
        bottom,
        imageSize
      });
    },
    getIframeMarkup(iframeWidth, iframeHeight, iframeMaxWidth, iframeMaxHeight, src, iframeTitle) {
      const title = iframeTitle ? 'title="' + iframeTitle + '"' : "";
      return `<div class="lg-media-cont lg-has-iframe" style="width:${iframeWidth}; max-width:${iframeMaxWidth}; height: ${iframeHeight}; max-height:${iframeMaxHeight}">
                    <iframe class="lg-object" frameborder="0" ${title} src="${src}"  allowfullscreen="true"></iframe>
                </div>`;
    },
    getImgMarkup(index, src, altAttr, srcset, sizes, sources) {
      const srcsetAttr = srcset ? `srcset="${srcset}"` : "";
      const sizesAttr = sizes ? `sizes="${sizes}"` : "";
      const imgMarkup = `<img ${altAttr} ${srcsetAttr}  ${sizesAttr} class="lg-object lg-image" data-index="${index}" src="${src}" />`;
      let sourceTag = "";
      if (sources) {
        const sourceObj = typeof sources === "string" ? JSON.parse(sources) : sources;
        sourceTag = sourceObj.map((source) => {
          let attrs = "";
          Object.keys(source).forEach((key) => {
            attrs += ` ${key}="${source[key]}"`;
          });
          return `<source ${attrs}></source>`;
        });
      }
      return `${sourceTag}${imgMarkup}`;
    },
    // Get src from responsive src
    getResponsiveSrc(srcItms) {
      const rsWidth = [];
      const rsSrc = [];
      let src = "";
      for (let i = 0; i < srcItms.length; i++) {
        const _src = srcItms[i].split(" ");
        if (_src[0] === "") {
          _src.splice(0, 1);
        }
        rsSrc.push(_src[0]);
        rsWidth.push(_src[1]);
      }
      const wWidth = window.innerWidth;
      for (let j = 0; j < rsWidth.length; j++) {
        if (parseInt(rsWidth[j], 10) > wWidth) {
          src = rsSrc[j];
          break;
        }
      }
      return src;
    },
    isImageLoaded(img) {
      if (!img) return false;
      if (!img.complete) {
        return false;
      }
      if (img.naturalWidth === 0) {
        return false;
      }
      return true;
    },
    getVideoPosterMarkup(_poster, dummyImg, videoContStyle, playVideoString, _isVideo) {
      let videoClass = "";
      if (_isVideo && _isVideo.youtube) {
        videoClass = "lg-has-youtube";
      } else if (_isVideo && _isVideo.vimeo) {
        videoClass = "lg-has-vimeo";
      } else if (_isVideo && _isVideo.wistia) {
        videoClass = "lg-has-wistia";
      } else {
        videoClass = "lg-has-html5";
      }
      let _dummy = dummyImg;
      if (typeof dummyImg !== "string") {
        _dummy = dummyImg.outerHTML;
      }
      return `<div class="lg-video-cont ${videoClass}" style="${videoContStyle}">
                <div class="lg-video-play-button">
                <svg
                    viewBox="0 0 20 20"
                    preserveAspectRatio="xMidYMid"
                    focusable="false"
                    aria-labelledby="${playVideoString}"
                    role="img"
                    class="lg-video-play-icon"
                >
                    <title>${playVideoString}</title>
                    <polygon class="lg-video-play-icon-inner" points="1,0 20,10 1,20"></polygon>
                </svg>
                <svg class="lg-video-play-icon-bg" viewBox="0 0 50 50" focusable="false">
                    <circle cx="50%" cy="50%" r="20"></circle></svg>
                <svg class="lg-video-play-icon-circle" viewBox="0 0 50 50" focusable="false">
                    <circle cx="50%" cy="50%" r="20"></circle>
                </svg>
            </div>
            ${_dummy}
            <img class="lg-object lg-video-poster" src="${_poster}" />
        </div>`;
    },
    getFocusableElements(container) {
      const elements = container.querySelectorAll(
        'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
      );
      const visibleElements = [].filter.call(
        elements,
        (element) => {
          const style = window.getComputedStyle(element);
          return style.display !== "none" && style.visibility !== "hidden" && // Hidden or moved into the toolbar's More menu, whatever
          // the stylesheet says about their display.
          !element.closest("[hidden], [data-lg-overflow]");
        }
      );
      return visibleElements;
    },
    /**
     * @desc Create dynamic elements array from gallery items when dynamic option is false
     * It helps to avoid frequent DOM interaction
     * and avoid multiple checks for dynamic elments
     *
     * @returns {Array} dynamicEl
     */
    getDynamicOptions(items, extraProps, getCaptionFromTitleOrAlt, exThumbImage) {
      const dynamicElements = [];
      const availableDynamicOptions = [
        ...defaultDynamicOptions,
        ...extraProps
      ];
      [].forEach.call(items, (item) => {
        const dynamicEl = {};
        for (let i = 0; i < item.attributes.length; i++) {
          const attr = item.attributes[i];
          if (attr.specified) {
            const dynamicAttr = convertToData(attr.name);
            let label = "";
            if (availableDynamicOptions.indexOf(dynamicAttr) > -1) {
              label = dynamicAttr;
            }
            if (label) {
              dynamicEl[label] = attr.value;
            }
          }
        }
        if (typeof dynamicEl.sources === "string") {
          try {
            dynamicEl.sources = JSON.parse(dynamicEl.sources);
          } catch (e) {
            console.warn(
              "lightGallery :- data-sources must be a JSON array of picture source objects. See https://www.lightgalleryjs.com/docs/responsive-loading/"
            );
            delete dynamicEl.sources;
          }
        }
        const currentItem = $LG(item);
        const alt = currentItem.find("img").first().attr("alt");
        const title = currentItem.attr("title");
        const thumb = exThumbImage ? currentItem.attr(exThumbImage) : currentItem.find("img").first().attr("src");
        dynamicEl.thumb = thumb;
        if (getCaptionFromTitleOrAlt && !dynamicEl.subHtml) {
          dynamicEl.subHtml = title || alt || "";
        }
        dynamicEl.alt = alt || title || "";
        dynamicElements.push(dynamicEl);
      });
      return dynamicElements;
    },
    isMobile() {
      return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    },
    /**
     * @desc Check the given src is video
     * @param {String} src
     * @return {Object} video type
     * Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
     *
     * @todo - this information can be moved to dynamicEl to avoid frequent calls
     */
    isVideo(src, isHTML5VIdeo, index) {
      if (!src) {
        if (isHTML5VIdeo) {
          return {
            html5: true
          };
        } else {
          console.error(
            "lightGallery :- data-src is not provided on slide item " + (index + 1) + ". Please make sure the selector property is properly configured. More info - https://www.lightgalleryjs.com/demos/html-markup/"
          );
          return;
        }
      }
      return getVideoInfo(src, false);
    }
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
  let lgId = 0;
  class LightGallery {
    constructor(element, options) {
      this.lgOpened = false;
      this.index = 0;
      this.plugins = [];
      this.lGalleryOn = false;
      this.lgBusy = false;
      this.defaultIcons = __spreadValues({}, coreDefaultIcons);
      this.swipeSamples = [];
      this.currentItemsInDom = [];
      this.prevScrollTop = 0;
      this.bodyPaddingRight = 0;
      this.isDummyImageRemoved = false;
      this.dragOrSwipeEnabled = false;
      this.mediaContainerPosition = {
        top: 0,
        bottom: 0
      };
      if (!element) {
        return this;
      }
      lgId++;
      this.lgId = lgId;
      this.el = element;
      this.LGel = $LG(element);
      this.generateSettings(options);
      this.buildModules();
      if (this.settings.dynamic && this.settings.dynamicEl !== void 0 && !Array.isArray(this.settings.dynamicEl)) {
        throw "When using dynamic mode, you must also define dynamicEl as an Array.";
      }
      this.galleryItems = this.getItems();
      this.normalizeSettings();
      this.init();
      this.validateLicense();
      return this;
    }
    generateSettings(options) {
      var _a;
      this.settings = __spreadProps(__spreadValues(__spreadValues({}, lightGalleryCoreSettings), options), {
        // Strings merge per-key (headless resolveSettings parity), // a partial override keeps every other default.
        strings: __spreadValues(__spreadValues({}, lightGalleryCoreSettings.strings), (_a = options == null ? void 0 : options.strings) != null ? _a : {})
      });
      if (this.settings.isMobile && typeof this.settings.isMobile === "function" ? this.settings.isMobile() : utils.isMobile()) {
        const mobileSettings = __spreadValues({}, this.settings.mobileSettings);
        this.settings = __spreadValues(__spreadValues({}, this.settings), mobileSettings);
      }
      if (typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        this.settings = __spreadProps(__spreadValues({}, this.settings), {
          speed: 0,
          backdropDuration: 0,
          startAnimationDuration: 0,
          zoomFromOrigin: false,
          slideEndAnimation: false
        });
      }
    }
    normalizeSettings() {
      if (this.settings.direction === "auto") {
        this.settings.direction = typeof window !== "undefined" && typeof window.getComputedStyle === "function" && window.getComputedStyle(this.el).direction === "rtl" ? "rtl" : "ltr";
      }
      if (this.settings.slideEndAnimation) {
        this.settings.hideControlOnEnd = false;
      }
      if (!this.settings.closable) {
        this.settings.swipeToClose = false;
      }
      this.zoomFromOrigin = this.settings.zoomFromOrigin;
      if (this.settings.dynamic) {
        this.zoomFromOrigin = false;
      }
      if (this.settings.container) {
        const { container } = this.settings;
        if (typeof container === "function") {
          this.settings.container = container();
        } else if (typeof container === "string") {
          const el = document.querySelector(container);
          this.settings.container = el != null ? el : document.body;
        }
      } else {
        this.settings.container = document.body;
      }
      this.settings.preload = Math.min(
        this.settings.preload,
        this.galleryItems.length
      );
    }
    init() {
      this.addSlideVideoInfo(this.galleryItems);
      this.buildStructure();
      this.LGel.trigger(lGEvents.init, {
        instance: this
      });
      if (this.settings.keyPress) {
        this.keyPress();
      }
      setTimeout(() => {
        this.enableDrag();
        this.enableSwipe();
        this.triggerPosterClick();
      }, 50);
      this.arrow();
      if (this.settings.mousewheel) {
        this.mousewheel();
      }
      if (!this.settings.dynamic) {
        this.openGalleryOnItemClick();
      }
    }
    openGalleryOnItemClick() {
      for (let index = 0; index < this.items.length; index++) {
        const element = this.items[index];
        const $element = $LG(element);
        const uuid = lgQuery.generateUUID();
        $element.attr("data-lg-id", uuid).on(`click.lgcustom-item-${uuid}`, (e) => {
          e.preventDefault();
          const currentItemIndex = this.settings.index || index;
          this.openGallery(currentItemIndex, element);
        });
      }
    }
    /**
     * Module constructor
     * Modules are build incrementally.
     * Gallery should be opened only once all the modules are initialized.
     * use moduleBuildTimeout to make sure this
     */
    buildModules() {
      this.settings.plugins.forEach((plugin) => {
        this.plugins.push(new plugin(this, $LG));
      });
    }
    validateLicense() {
      const notice = takeLicenseNotice(this.settings.licenseKey);
      if (notice) console[notice.level](notice.message);
    }
    getSlideItem(index) {
      return $LG(this.getSlideItemId(index));
    }
    getSlideItemId(index) {
      return `#lg-item-${this.lgId}-${index}`;
    }
    getIdName(id) {
      return `${id}-${this.lgId}`;
    }
    getElementById(id) {
      return $LG(`#${this.getIdName(id)}`);
    }
    manageSingleSlideClassName() {
      if (this.galleryItems.length < 2) {
        this.outer.addClass("lg-single-item");
      } else {
        this.outer.removeClass("lg-single-item");
      }
    }
    buildStructure() {
      const container = this.$container && this.$container.get();
      if (container) {
        return;
      }
      let controls = "";
      let subHtmlCont = "";
      if (this.settings.controls) {
        controls = `<button type="button" id="${this.getIdName(
          "lg-prev"
        )}" aria-label="${this.settings.strings["previousSlide"]}" class="lg-prev lg-icon"> ${this.settings.prevHtml} </button>
                <button type="button" id="${this.getIdName(
          "lg-next"
        )}" aria-label="${this.settings.strings["nextSlide"]}" class="lg-next lg-icon"> ${this.settings.nextHtml} </button>`;
      }
      if (this.settings.appendSubHtmlTo !== ".lg-item") {
        subHtmlCont = this.settings.ariaAnnouncements ? '<div class="lg-sub-html"></div>' : '<div class="lg-sub-html" role="status" aria-live="polite"></div>';
      }
      let addClasses = "";
      if (this.settings.allowMediaOverlap) {
        addClasses += "lg-media-overlap ";
      }
      const ariaLabelledby = this.settings.ariaLabelledby ? 'aria-labelledby="' + this.settings.ariaLabelledby + '"' : `aria-label="${this.settings.strings["galleryLabel"]}"`;
      const ariaDescribedby = this.settings.ariaDescribedby ? 'aria-describedby="' + this.settings.ariaDescribedby + '"' : "";
      const containerClassName = `lg-container ${this.settings.addClass} ${document.body !== this.settings.container ? "lg-inline" : ""}`;
      const closeIcon = this.settings.closable && this.settings.showCloseIcon ? `<button type="button" aria-label="${this.settings.strings["closeGallery"]}" id="${this.getIdName(
        "lg-close"
      )}" class="lg-close lg-icon"></button>` : "";
      const maximizeIcon = this.settings.showMaximizeIcon ? `<button type="button" aria-label="${this.settings.strings["toggleMaximize"]}" id="${this.getIdName(
        "lg-maximize"
      )}" class="lg-maximize lg-icon"></button>` : "";
      const template = `
        <div class="${containerClassName}" id="${this.getIdName(
        "lg-container"
      )}" tabindex="-1" aria-modal="true" ${ariaLabelledby} ${ariaDescribedby} role="dialog" dir="${this.getDirection()}"
        >
            <div id="${this.getIdName(
        "lg-backdrop"
      )}" class="lg-backdrop"></div>
            ${this.settings.ariaAnnouncements ? `<div id="${this.getIdName(
        "lg-announcer"
      )}" class="lg-announcer" role="status" aria-live="polite"></div>` : ""}

            <div id="${this.getIdName(
        "lg-outer"
      )}" class="lg-outer lg-use-css3 lg-css3 lg-hide-items ${addClasses} ">

              <div id="${this.getIdName("lg-content")}" class="lg-content">
                <div id="${this.getIdName("lg-inner")}" class="lg-inner">
                </div>
                ${controls}
              </div>
                <div id="${this.getIdName(
        "lg-toolbar"
      )}" class="lg-toolbar lg-group">
                    ${maximizeIcon}
                    ${closeIcon}
                    </div>
                    ${this.settings.appendSubHtmlTo === ".lg-outer" ? subHtmlCont : ""}
                <div id="${this.getIdName(
        "lg-components"
      )}" class="lg-components">
                    ${this.settings.appendSubHtmlTo === ".lg-sub-html" ? subHtmlCont : ""}
                </div>
            </div>
        </div>
        `;
      $LG(this.settings.container).append(template);
      if (document.body !== this.settings.container) {
        $LG(this.settings.container).css("position", "relative");
      }
      this.outer = this.getElementById("lg-outer");
      this.$lgComponents = this.getElementById("lg-components");
      this.$backdrop = this.getElementById("lg-backdrop");
      this.$container = this.getElementById("lg-container");
      this.$inner = this.getElementById("lg-inner");
      this.$content = this.getElementById("lg-content");
      this.$toolbar = this.getElementById("lg-toolbar");
      this.$backdrop.css(
        "transition-duration",
        this.settings.backdropDuration + "ms"
      );
      let outerClassNames = `${this.settings.mode} `;
      this.manageSingleSlideClassName();
      if (this.settings.enableDrag) {
        outerClassNames += "lg-grab ";
      }
      this.outer.addClass(outerClassNames);
      this.$inner.css("transition-timing-function", this.settings.easing);
      this.$inner.css("transition-duration", this.settings.speed + "ms");
      this.$inner.css("--lg-speed", this.settings.speed + "ms");
      if (this.settings.download) {
        this.$toolbar.append(
          `<a id="${this.getIdName(
            "lg-download"
          )}" target="_blank" rel="noopener" aria-label="${this.settings.strings["download"]}" download class="lg-download lg-icon"></a>`
        );
      }
      this.counter();
      $LG(window).on(
        `resize.lg.global${this.lgId} orientationchange.lg.global${this.lgId}`,
        () => {
          this.refreshOnResize();
        }
      );
      this.hideBars();
      this.manageCloseGallery();
      this.toggleMaximize();
      this.initModules();
      if (this.settings.toolbarOverflow) {
        this.toolbarOverflow = new ToolbarOverflow(this.$toolbar.get(), {
          id: this.getIdName("lg-more"),
          label: this.settings.strings.moreOptions
        });
        const update = () => {
          var _a;
          return (_a = this.toolbarOverflow) == null ? void 0 : _a.update();
        };
        this.LGel.on(`${lGEvents.afterOpen}.lg`, update);
        this.LGel.on(`${lGEvents.afterSlide}.lg`, update);
        this.LGel.on(`${lGEvents.containerResize}.lg`, update);
        this.LGel.on(
          `${lGEvents.beforeClose}.lg`,
          () => {
            var _a;
            return (_a = this.toolbarOverflow) == null ? void 0 : _a.close(false);
          }
        );
      }
      applyCustomIcons(
        this.$container.get(),
        this.defaultIcons,
        this.settings.icons
      );
    }
    /**
     * Merge a plugin's built-in icon SVGs into the default set (called
     * from plugin `init()`, before the icon pass runs). Consumer
     * `settings.icons` still win over anything registered here.
     */
    registerDefaultIcons(icons) {
      this.defaultIcons = __spreadValues(__spreadValues({}, this.defaultIcons), icons);
    }
    /**
     * Cache the fitted (contain) size of a slide's media. Every consumer
     * of `currentImageSize` measures against the CURRENT slide: the
     * actual-size zoom divides the natural width by it, and the
     * zoom-from-origin close flight positions against it. Recomputed on
     * every slide change, not just at open — one cached landscape size
     * makes a portrait slide zoom to the wrong scale and then snap to
     * its real size when the natural-px swap lands.
     */
    updateCurrentImageSize(index) {
      const { __slideVideoInfo } = this.galleryItems[index];
      const { top, bottom } = this.mediaContainerPosition;
      this.currentImageSize = utils.getSize(
        this.items[index],
        this.outer,
        top + bottom,
        __slideVideoInfo && this.settings.videoMaxSize
      );
    }
    refreshOnResize() {
      if (this.lgOpened) {
        const currentGalleryItem = this.galleryItems[this.index];
        const { __slideVideoInfo } = currentGalleryItem;
        this.mediaContainerPosition = this.getMediaContainerPosition();
        this.updateCurrentImageSize(this.index);
        if (__slideVideoInfo) {
          this.resizeVideoSlide(this.index, this.currentImageSize);
        }
        if (this.zoomFromOrigin && !this.isDummyImageRemoved) {
          const imgStyle = this.getDummyImgStyles(this.currentImageSize);
          this.outer.find(".lg-current .lg-dummy-img").first().attr("style", imgStyle);
        }
        this.LGel.trigger(lGEvents.containerResize);
      }
    }
    resizeVideoSlide(index, imageSize) {
      const lgVideoStyle = this.getVideoContStyle(imageSize);
      const currentSlide = this.getSlideItem(index);
      currentSlide.find(".lg-video-cont").attr("style", lgVideoStyle);
    }
    /**
     * Update slides dynamically.
     * Add, edit or delete slides dynamically when lightGallery is opened.
     * Modify the current gallery items and pass it via updateSlides method
     * @note
     * - Do not mutate existing lightGallery items directly.
     * - Always pass new list of gallery items
     * - You need to take care of thumbnails outside the gallery if any
     * - user this method only if you want to update slides when the gallery is opened. Otherwise, use `refresh()` method.
     * @param items Gallery items
     * @param index After the update operation, which slide gallery should navigate to
     * @category lGPublicMethods
     * @example
     * const plugin = lightGallery();
     *
     * // Adding slides dynamically
     * let galleryItems = [
     * // Access existing lightGallery items
     * // galleryItems are automatically generated internally from the gallery HTML markup
     * // or directly from galleryItems when dynamic gallery is used
     *   ...plugin.galleryItems,
     *     ...[
     *       {
     *         src: 'img/img-1.png',
     *           thumb: 'img/thumb1.png',
     *         },
     *     ],
     *   ];
     *   plugin.updateSlides(
     *     galleryItems,
     *     plugin.index,
     *   );
     *
     *
     * // Remove slides dynamically
     * galleryItems = JSON.parse(
     *   JSON.stringify(updateSlideInstance.galleryItems),
     * );
     * galleryItems.shift();
     * updateSlideInstance.updateSlides(galleryItems, 1);
     * @see <a href="/demos/update-slides/">Demo</a>
     */
    updateSlides(items, index) {
      if (this.index > items.length - 1) {
        this.index = items.length - 1;
      }
      if (items.length === 1) {
        this.index = 0;
      }
      if (!items.length) {
        this.closeGallery();
        return;
      }
      const currentSrc = this.galleryItems[index].src;
      this.galleryItems = items;
      this.updateControls();
      this.$inner.empty();
      this.currentItemsInDom = [];
      let _index = 0;
      this.galleryItems.some((galleryItem, itemIndex) => {
        if (galleryItem.src === currentSrc) {
          _index = itemIndex;
          return true;
        }
        return false;
      });
      this.currentItemsInDom = this.organizeSlideItems(_index, -1);
      this.loadContent(_index, true);
      this.getSlideItem(_index).addClass("lg-current");
      this.index = _index;
      this.updateCurrentCounter(_index);
      this.LGel.trigger(lGEvents.updateSlides);
    }
    // Get gallery items based on multiple conditions
    getItems() {
      this.items = [];
      if (!this.settings.dynamic) {
        if (this.settings.selector === "this") {
          this.items.push(this.el);
        } else if (this.settings.selector) {
          if (typeof this.settings.selector === "string") {
            if (this.settings.selectWithin) {
              const selectWithin = $LG(this.settings.selectWithin);
              this.items = selectWithin.find(this.settings.selector).get();
            } else {
              this.items = this.el.querySelectorAll(
                this.settings.selector
              );
            }
          } else {
            this.items = this.settings.selector;
          }
        } else {
          this.items = this.el.children;
        }
        return utils.getDynamicOptions(
          this.items,
          this.settings.extraProps,
          this.settings.getCaptionFromTitleOrAlt,
          this.settings.exThumbImage
        );
      } else {
        return this.settings.dynamicEl || [];
      }
    }
    shouldHideScrollbar() {
      return this.settings.hideScrollbar && document.body === this.settings.container;
    }
    hideScrollbar() {
      if (!this.shouldHideScrollbar()) {
        return;
      }
      this.bodyPaddingRight = parseFloat($LG("body").style().paddingRight);
      const bodyRect = document.documentElement.getBoundingClientRect();
      const scrollbarWidth = window.innerWidth - bodyRect.width;
      $LG(document.body).css(
        "padding-right",
        scrollbarWidth + this.bodyPaddingRight + "px"
      );
      $LG(document.body).addClass("lg-overlay-open");
    }
    resetScrollBar() {
      if (!this.shouldHideScrollbar()) {
        return;
      }
      $LG(document.body).css("padding-right", this.bodyPaddingRight + "px");
      $LG(document.body).removeClass("lg-overlay-open");
    }
    /**
     * Open lightGallery.
     * Open gallery with specific slide by passing index of the slide as parameter.
     * @category lGPublicMethods
     * @param {Number} index  - index of the slide
     * @param {HTMLElement} element - Which image lightGallery should zoom from
     *
     * @example
     * const $dynamicGallery = document.getElementById('dynamic-gallery-demo');
     * const dynamicGallery = lightGallery($dynamicGallery, {
     *     dynamic: true,
     *     dynamicEl: [
     *         {
     *              src: 'img/1.jpg',
     *              thumb: 'img/thumb-1.jpg',
     *              subHtml: '<h4>Image 1 title</h4><p>Image 1 descriptions.</p>',
     *         },
     *         ...
     *     ],
     * });
     * $dynamicGallery.addEventListener('click', function () {
     *     // Starts with third item.(Optional).
     *     // This is useful if you want use dynamic mode with
     *     // custom thumbnails (thumbnails outside gallery),
     *     dynamicGallery.openGallery(2);
     * });
     *
     */
    openGallery(index = this.settings.index, element) {
      if (this.lgOpened) return;
      this.lgOpened = true;
      this.outer.removeClass("lg-hide-items");
      this.hideScrollbar();
      this.$container.addClass("lg-show");
      const itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(
        index,
        index
      );
      this.currentItemsInDom = itemsToBeInsertedToDom;
      let items = "";
      itemsToBeInsertedToDom.forEach((item) => {
        items = items + `<div id="${item}" class="lg-item"></div>`;
      });
      this.$inner.append(items);
      this.addHtml(index);
      let transform = "";
      this.mediaContainerPosition = this.getMediaContainerPosition();
      const { top, bottom } = this.mediaContainerPosition;
      if (!this.settings.allowMediaOverlap) {
        this.setMediaContainerPosition(top, bottom);
      }
      const { __slideVideoInfo } = this.galleryItems[index];
      if (this.zoomFromOrigin && element) {
        this.currentImageSize = utils.getSize(
          element,
          this.outer,
          top + bottom,
          __slideVideoInfo && this.settings.videoMaxSize
        );
        transform = this.getOriginTransform(element, this.currentImageSize);
      }
      if (!this.zoomFromOrigin || !transform) {
        this.outer.addClass(this.settings.startClass);
        this.getSlideItem(index).removeClass("lg-complete");
      }
      const timeout = this.settings.zoomFromOrigin ? 100 : this.settings.backdropDuration;
      setTimeout(() => {
        this.outer.addClass("lg-components-open");
      }, timeout);
      this.index = index;
      this.LGel.trigger(lGEvents.beforeOpen);
      this.getSlideItem(index).addClass("lg-current");
      this.lGalleryOn = false;
      this.prevScrollTop = $LG(window).scrollTop();
      if (this.settings.trapFocus && document.body === this.settings.container) {
        this.prevActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : void 0;
      }
      setTimeout(() => {
        if (this.zoomFromOrigin && transform) {
          const currentSlide = this.getSlideItem(index);
          currentSlide.css("transform", transform);
          setTimeout(() => {
            currentSlide.addClass("lg-start-progress lg-start-end-progress").css(
              "transition-duration",
              this.settings.startAnimationDuration + "ms"
            );
            this.outer.addClass("lg-zoom-from-image");
          });
          setTimeout(() => {
            currentSlide.css("transform", "translate3d(0, 0, 0)");
          }, 100);
        }
        setTimeout(() => {
          this.$backdrop.addClass("in");
          this.$container.addClass("lg-show-in");
        }, 10);
        setTimeout(() => {
          if (this.settings.trapFocus && document.body === this.settings.container) {
            this.trapFocus();
          }
        }, this.settings.backdropDuration + 50);
        if (!this.zoomFromOrigin || !transform) {
          setTimeout(() => {
            this.outer.addClass("lg-visible");
          }, this.settings.backdropDuration);
        }
        this.slide(index, false, false, false);
        this.LGel.trigger(lGEvents.afterOpen);
      });
      if (document.body === this.settings.container) {
        $LG("html").addClass("lg-on");
      }
    }
    /**
     * The zoom-from-origin transform for a trigger: it lands the slide on
     * the trigger's thumbnail, the start of the opening flight and the end
     * of the closing one. Undefined when the trigger cannot anchor a flight,
     * and the gallery opens or closes about the stage centre instead.
     * Plugins may replace it on the instance to fly differently.
     */
    getOriginTransform(element, imageSize) {
      const { top, bottom } = this.mediaContainerPosition;
      return utils.getTransform(element, this.outer, top, bottom, imageSize);
    }
    /**
     * Note - Changing the position of the media on every slide transition creates a flickering effect.
     * Therefore, The height of the caption is calculated dynamically, only once based on the first slide caption.
     * if you have dynamic captions for each media,
     * you can provide an appropriate height for the captions via allowMediaOverlap option
     */
    getMediaContainerPosition() {
      if (this.settings.allowMediaOverlap) {
        return {
          top: 0,
          bottom: 0
        };
      }
      const top = this.$toolbar.get().clientHeight || 0;
      const subHtml = this.outer.find(".lg-components .lg-sub-html").get();
      const captionHeight = this.settings.defaultCaptionHeight || subHtml && subHtml.clientHeight || 0;
      const thumbContainer = this.outer.find(".lg-thumb-outer").get();
      const thumbHeight = thumbContainer ? thumbContainer.clientHeight : 0;
      const bottom = thumbHeight + captionHeight;
      return {
        top,
        bottom
      };
    }
    setMediaContainerPosition(top = 0, bottom = 0) {
      this.$content.css("top", top + "px").css("bottom", bottom + "px");
    }
    hideBars() {
      setTimeout(() => {
        this.outer.removeClass("lg-hide-items");
        if (this.settings.hideBarsDelay > 0) {
          this.outer.on("mousemove.lg click.lg touchstart.lg", () => {
            this.outer.removeClass("lg-hide-items");
            clearTimeout(this.hideBarTimeout);
            this.hideBarTimeout = setTimeout(() => {
              this.outer.addClass("lg-hide-items");
            }, this.settings.hideBarsDelay);
          });
          this.outer.trigger("mousemove.lg");
        }
      }, this.settings.showBarsAfter);
    }
    initPictureFill($img) {
      if (this.settings.supportLegacyBrowser) {
        try {
          picturefill({
            elements: [$img.get()]
          });
        } catch (e) {
          console.warn(
            "lightGallery :- If you want srcset or picture tag to be supported for older browser please include picturefil javascript library in your document. See https://www.lightgalleryjs.com/docs/responsive-loading/"
          );
        }
      }
    }
    /**
     *  @desc Create image counter
     *  Ex: 1/10
     */
    counter() {
      if (this.settings.counter) {
        const counterA11yAttrs = this.settings.ariaAnnouncements ? 'aria-hidden="true"' : 'role="status" aria-live="polite"';
        const counterHtml = `<div class="lg-counter" ${counterA11yAttrs}>
                <span id="${this.getIdName(
          "lg-counter-current"
        )}" class="lg-counter-current">${this.index + 1} </span> /
                <span id="${this.getIdName(
          "lg-counter-all"
        )}" class="lg-counter-all">${this.galleryItems.length} </span></div>`;
        this.outer.find(this.settings.appendCounterTo).append(counterHtml);
      }
    }
    /**
     *  @desc add sub-html into the slide
     *  @param {Number} index - index of the slide
     */
    addHtml(index) {
      let subHtml;
      let subHtmlUrl;
      if (this.galleryItems[index].subHtmlUrl) {
        subHtmlUrl = this.galleryItems[index].subHtmlUrl;
      } else {
        subHtml = this.galleryItems[index].subHtml;
      }
      if (!subHtmlUrl) {
        if (subHtml) {
          const fL = subHtml.substring(0, 1);
          if (fL === "." || fL === "#") {
            try {
              if (this.settings.subHtmlSelectorRelative && !this.settings.dynamic) {
                subHtml = $LG(this.items).eq(index).find(subHtml).first().html();
              } else {
                subHtml = $LG(subHtml).first().html();
              }
            } catch (error) {
              console.warn(
                `lightGallery: error processing subHtml selector "${subHtml}". See https://www.lightgalleryjs.com/demos/captions/`
              );
              subHtml = "";
            }
          }
        } else {
          subHtml = "";
        }
      }
      if (this.settings.appendSubHtmlTo !== ".lg-item") {
        if (subHtmlUrl) {
          utils.fetchCaptionFromUrl(
            subHtmlUrl,
            this.outer.find(".lg-sub-html"),
            "replace"
          );
        } else {
          this.outer.find(".lg-sub-html").html(subHtml);
        }
      } else {
        const currentSlide = $LG(this.getSlideItemId(index));
        if (subHtmlUrl) {
          utils.fetchCaptionFromUrl(subHtmlUrl, currentSlide, "append");
        } else {
          currentSlide.append(
            `<div class="lg-sub-html">${subHtml}</div>`
          );
        }
      }
      if (typeof subHtml !== "undefined" && subHtml !== null) {
        if (subHtml === "") {
          this.outer.find(this.settings.appendSubHtmlTo).addClass("lg-empty-html");
        } else {
          this.outer.find(this.settings.appendSubHtmlTo).removeClass("lg-empty-html");
        }
      }
      this.LGel.trigger(
        lGEvents.afterAppendSubHtml,
        {
          index
        }
      );
    }
    /**
     *  @desc Preload slides
     *  @param {Number} index - index of the slide
     * @todo preload not working for the first slide, Also, should work for the first and last slide as well
     */
    preload(index) {
      for (let i = 1; i <= this.settings.preload; i++) {
        if (i >= this.galleryItems.length - index) {
          break;
        }
        this.loadContent(index + i, false);
      }
      for (let j = 1; j <= this.settings.preload; j++) {
        if (index - j < 0) {
          break;
        }
        this.loadContent(index - j, false);
      }
    }
    getDummyImgStyles(imageSize) {
      if (!imageSize) return "";
      return `width:${imageSize.width}px;
                margin-left: -${imageSize.width / 2}px;
                margin-top: -${imageSize.height / 2}px;
                height:${imageSize.height}px`;
    }
    getVideoContStyle(imageSize) {
      if (!imageSize) return "";
      return `width:${imageSize.width}px;
                height:${imageSize.height}px`;
    }
    getDummyImageContent($currentSlide, index, alt) {
      let $currentItem;
      if (!this.settings.dynamic) {
        $currentItem = $LG(this.items).eq(index);
      }
      if ($currentItem) {
        let _dummyImgSrc;
        if (!this.settings.exThumbImage) {
          _dummyImgSrc = $currentItem.find("img").first().attr("src");
        } else {
          _dummyImgSrc = $currentItem.attr(this.settings.exThumbImage);
        }
        if (!_dummyImgSrc) return "";
        const imgStyle = this.getDummyImgStyles(this.currentImageSize);
        const dummyImgContentImg = document.createElement("img");
        dummyImgContentImg.alt = alt || "";
        dummyImgContentImg.src = _dummyImgSrc;
        dummyImgContentImg.className = `lg-dummy-img`;
        dummyImgContentImg.style.cssText = imgStyle;
        $currentSlide.addClass("lg-first-slide");
        this.outer.addClass("lg-first-slide-loading");
        return dummyImgContentImg;
      }
      return "";
    }
    setImgMarkup(src, $currentSlide, index) {
      const currentGalleryItem = this.galleryItems[index];
      const { alt, srcset, sizes, sources } = currentGalleryItem;
      let imgContent = "";
      const altAttr = alt ? 'alt="' + alt + '"' : "";
      if (this.isFirstSlideWithZoomAnimation()) {
        imgContent = this.getDummyImageContent(
          $currentSlide,
          index,
          altAttr
        );
      } else {
        imgContent = utils.getImgMarkup(
          index,
          src,
          altAttr,
          srcset,
          sizes,
          sources
        );
      }
      const picture = document.createElement("picture");
      picture.className = "lg-img-wrap";
      $LG(picture).append(imgContent);
      $currentSlide.prepend(picture);
    }
    onSlideObjectLoad($slide, isHTML5VideoWithoutPoster, onLoad, onError) {
      const mediaObject = $slide.find(".lg-object").first();
      const media = mediaObject.get();
      const gated = (handler) => {
        if (media instanceof HTMLImageElement && typeof media.decode === "function") {
          void awaitDecode(media).then(handler);
        } else {
          handler();
        }
      };
      if (utils.isImageLoaded(media) || isHTML5VideoWithoutPoster) {
        gated(onLoad);
      } else {
        mediaObject.on("load.lg error.lg", () => {
          gated(() => onLoad && onLoad());
        });
        mediaObject.on("error.lg", () => {
          onError && onError();
        });
      }
    }
    /**
     *
     * @param $el Current slide item
     * @param index
     * @param delay Delay is 0 except first time
     * @param speed Speed is same as delay, except it is 0 if gallery is opened via hash plugin
     * @param isFirstSlide
     */
    onLgObjectLoad(currentSlide, index, delay, speed, isFirstSlide, isHTML5VideoWithoutPoster) {
      this.onSlideObjectLoad(
        currentSlide,
        isHTML5VideoWithoutPoster,
        () => {
          this.triggerSlideItemLoad(
            currentSlide,
            index,
            delay,
            speed,
            isFirstSlide
          );
        },
        () => {
          currentSlide.addClass("lg-complete lg-complete_");
          currentSlide.html(
            '<span class="lg-error-msg">' + this.settings.strings["mediaLoadingFailed"] + "</span>"
          );
        }
      );
    }
    triggerSlideItemLoad($currentSlide, index, delay, speed, isFirstSlide) {
      const currentGalleryItem = this.galleryItems[index];
      const _speed = isFirstSlide && this.getSlideType(currentGalleryItem) === "video" && !currentGalleryItem.poster ? speed : 0;
      setTimeout(() => {
        $currentSlide.addClass("lg-complete lg-complete_");
        this.LGel.trigger(lGEvents.slideItemLoad, {
          index,
          delay: delay || 0,
          isFirstSlide
        });
      }, _speed);
    }
    isFirstSlideWithZoomAnimation() {
      return !!(!this.lGalleryOn && this.zoomFromOrigin && this.currentImageSize);
    }
    // Add video slideInfo
    addSlideVideoInfo(items) {
      items.forEach((element, index) => {
        element.__slideVideoInfo = utils.isVideo(
          element.src,
          !!element.video,
          index
        );
        const videoInfo = element.__slideVideoInfo;
        if (!videoInfo) {
          return;
        }
        if (this.settings.videoFacade !== false) {
          element.poster = getFacadePoster(
            element,
            videoInfo,
            this.settings.loadYouTubePoster
          );
        } else if (this.settings.loadYouTubePoster && !element.poster && videoInfo.youtube) {
          element.poster = getYouTubePosterUrl(videoInfo);
        }
      });
    }
    /**
     *  Load slide content into slide.
     *  This is used to load content into slides that is not visible too
     *  @param {Number} index - index of the slide.
     *  @param {Boolean} rec - if true call loadcontent() function again.
     */
    loadContent(index, rec) {
      const currentGalleryItem = this.galleryItems[index];
      const $currentSlide = $LG(this.getSlideItemId(index));
      const { poster, srcset, sizes, sources } = currentGalleryItem;
      let { src } = currentGalleryItem;
      const video = currentGalleryItem.video;
      const _html5Video = video && typeof video === "string" ? JSON.parse(video) : video;
      if (currentGalleryItem.responsive) {
        const srcDyItms = currentGalleryItem.responsive.split(",");
        src = utils.getResponsiveSrc(srcDyItms) || src;
      }
      const videoInfo = currentGalleryItem.__slideVideoInfo;
      let lgVideoStyle = "";
      const iframe = !!currentGalleryItem.iframe;
      const isFirstSlide = !this.lGalleryOn;
      let delay = 0;
      if (isFirstSlide) {
        if (this.zoomFromOrigin && this.currentImageSize) {
          delay = this.settings.startAnimationDuration + 10;
        } else {
          delay = this.settings.backdropDuration + 10;
        }
      }
      if (!$currentSlide.hasClass("lg-loaded")) {
        if (videoInfo) {
          const { top, bottom } = this.mediaContainerPosition;
          const videoSize = utils.getSize(
            this.items[index],
            this.outer,
            top + bottom,
            videoInfo && this.settings.videoMaxSize
          );
          lgVideoStyle = this.getVideoContStyle(videoSize);
        }
        if (iframe) {
          const markup = utils.getIframeMarkup(
            this.settings.iframeWidth,
            this.settings.iframeHeight,
            this.settings.iframeMaxWidth,
            this.settings.iframeMaxHeight,
            src,
            currentGalleryItem.iframeTitle
          );
          $currentSlide.prepend(markup);
        } else if (poster) {
          let dummyImg = "";
          const hasStartAnimation = isFirstSlide && this.zoomFromOrigin && this.currentImageSize;
          if (hasStartAnimation) {
            dummyImg = this.getDummyImageContent(
              $currentSlide,
              index,
              ""
            );
          }
          const markup = utils.getVideoPosterMarkup(
            poster,
            dummyImg || "",
            lgVideoStyle,
            this.settings.strings["playVideo"],
            videoInfo
          );
          $currentSlide.prepend(markup);
        } else if (videoInfo) {
          const markup = `<div class="lg-video-cont " style="${lgVideoStyle}"></div>`;
          $currentSlide.prepend(markup);
        } else {
          this.setImgMarkup(src, $currentSlide, index);
          if (srcset || sources) {
            const $img = $currentSlide.find(".lg-object");
            this.initPictureFill($img);
          }
        }
        if (poster || videoInfo) {
          this.LGel.trigger(lGEvents.hasVideo, {
            index,
            src,
            html5Video: _html5Video,
            hasPoster: !!poster
          });
        }
        this.LGel.trigger(
          lGEvents.afterAppendSlide,
          { index }
        );
        if (this.lGalleryOn && this.settings.appendSubHtmlTo === ".lg-item") {
          this.addHtml(index);
        }
      }
      let _speed = 0;
      if (delay && !$LG(document.body).hasClass("lg-from-hash")) {
        _speed = delay;
      }
      if (this.isFirstSlideWithZoomAnimation()) {
        const settleFlight = (onLanded) => onTransitionSettle(
          $currentSlide.get(),
          "transform",
          this.settings.startAnimationDuration + 100,
          onLanded
        );
        settleFlight(() => {
          $currentSlide.removeClass("lg-start-end-progress lg-start-progress").removeAttr("style");
        });
        if (!$currentSlide.hasClass("lg-loaded")) {
          settleFlight(() => {
            if (this.getSlideType(currentGalleryItem) === "image") {
              const { alt } = currentGalleryItem;
              const altAttr = alt ? 'alt="' + alt + '"' : "";
              $currentSlide.find(".lg-img-wrap").append(
                utils.getImgMarkup(
                  index,
                  src,
                  altAttr,
                  srcset,
                  sizes,
                  currentGalleryItem.sources
                )
              );
              if (srcset || sources) {
                const $img = $currentSlide.find(".lg-object");
                this.initPictureFill($img);
              }
            }
            if (this.getSlideType(currentGalleryItem) === "image" || this.getSlideType(currentGalleryItem) === "video" && poster) {
              this.onLgObjectLoad(
                $currentSlide,
                index,
                delay,
                _speed,
                true,
                false
              );
              this.onSlideObjectLoad(
                $currentSlide,
                !!(videoInfo && videoInfo.html5 && !poster),
                () => {
                  this.loadContentOnFirstSlideLoad(
                    index,
                    $currentSlide,
                    _speed
                  );
                },
                () => {
                  this.loadContentOnFirstSlideLoad(
                    index,
                    $currentSlide,
                    _speed
                  );
                }
              );
            }
          });
        }
      }
      $currentSlide.addClass("lg-loaded");
      if (!this.isFirstSlideWithZoomAnimation() || this.getSlideType(currentGalleryItem) === "video" && !poster) {
        this.onLgObjectLoad(
          $currentSlide,
          index,
          delay,
          _speed,
          isFirstSlide,
          !!(videoInfo && videoInfo.html5 && !poster)
        );
      }
      if ((!this.zoomFromOrigin || !this.currentImageSize) && $currentSlide.hasClass("lg-complete_") && !this.lGalleryOn) {
        setTimeout(() => {
          $currentSlide.addClass("lg-complete");
        }, this.settings.backdropDuration);
      }
      this.lGalleryOn = true;
      if (rec === true) {
        if (!$currentSlide.hasClass("lg-complete_")) {
          $currentSlide.find(".lg-object").first().on("load.lg error.lg", () => {
            this.preload(index);
          });
        } else {
          this.preload(index);
        }
      }
    }
    /**
     * @desc Remove dummy image content and load next slides
     * Called only for the first time if zoomFromOrigin animation is enabled
     * @param index
     * @param $currentSlide
     * @param speed
     */
    loadContentOnFirstSlideLoad(index, $currentSlide, speed) {
      setTimeout(() => {
        $currentSlide.find(".lg-dummy-img").remove();
        $currentSlide.removeClass("lg-first-slide");
        this.outer.removeClass("lg-first-slide-loading");
        this.isDummyImageRemoved = true;
        this.preload(index);
      }, speed + 300);
    }
    getItemsToBeInsertedToDom(index, prevIndex, numberOfItems = 0) {
      const itemsToBeInsertedToDom = [];
      let possibleNumberOfItems = Math.max(numberOfItems, 3);
      possibleNumberOfItems = Math.min(
        possibleNumberOfItems,
        this.galleryItems.length
      );
      const prevIndexItem = `lg-item-${this.lgId}-${prevIndex}`;
      if (this.galleryItems.length <= 3) {
        this.galleryItems.forEach((_element, index2) => {
          itemsToBeInsertedToDom.push(`lg-item-${this.lgId}-${index2}`);
        });
        return itemsToBeInsertedToDom;
      }
      if (index < (this.galleryItems.length - 1) / 2) {
        for (let idx = index; idx > index - possibleNumberOfItems / 2 && idx >= 0; idx--) {
          itemsToBeInsertedToDom.push(`lg-item-${this.lgId}-${idx}`);
        }
        const numberOfExistingItems = itemsToBeInsertedToDom.length;
        for (let idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) {
          itemsToBeInsertedToDom.push(
            `lg-item-${this.lgId}-${index + idx + 1}`
          );
        }
      } else {
        for (let idx = index; idx <= this.galleryItems.length - 1 && idx < index + possibleNumberOfItems / 2; idx++) {
          itemsToBeInsertedToDom.push(`lg-item-${this.lgId}-${idx}`);
        }
        const numberOfExistingItems = itemsToBeInsertedToDom.length;
        for (let idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) {
          itemsToBeInsertedToDom.push(
            `lg-item-${this.lgId}-${index - idx - 1}`
          );
        }
      }
      if (this.settings.loop) {
        if (index === this.galleryItems.length - 1) {
          itemsToBeInsertedToDom.push(`lg-item-${this.lgId}-${0}`);
        } else if (index === 0) {
          itemsToBeInsertedToDom.push(
            `lg-item-${this.lgId}-${this.galleryItems.length - 1}`
          );
        }
      }
      if (itemsToBeInsertedToDom.indexOf(prevIndexItem) === -1) {
        itemsToBeInsertedToDom.push(`lg-item-${this.lgId}-${prevIndex}`);
      }
      return itemsToBeInsertedToDom;
    }
    organizeSlideItems(index, prevIndex) {
      var _a, _b;
      const itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(
        index,
        prevIndex,
        (_b = (_a = this.settings.virtualization) == null ? void 0 : _a.slides) != null ? _b : this.settings.numberOfSlideItemsInDom
      );
      itemsToBeInsertedToDom.forEach((item) => {
        if (this.currentItemsInDom.indexOf(item) === -1) {
          this.$inner.append(`<div id="${item}" class="lg-item"></div>`);
        }
      });
      this.currentItemsInDom.forEach((item) => {
        if (itemsToBeInsertedToDom.indexOf(item) === -1) {
          $LG(`#${item}`).remove();
        }
      });
      return itemsToBeInsertedToDom;
    }
    /**
     * Get previous index of the slide
     */
    getPreviousSlideIndex() {
      let prevIndex = 0;
      try {
        const currentItemId = this.outer.find(".lg-current").first().attr("id");
        prevIndex = parseInt(currentItemId.split("-")[3]) || 0;
      } catch (error) {
        prevIndex = 0;
      }
      return prevIndex;
    }
    setDownloadValue(index) {
      if (this.settings.download) {
        const currentGalleryItem = this.galleryItems[index];
        const hideDownloadBtn = currentGalleryItem.downloadUrl === false || currentGalleryItem.downloadUrl === "false";
        if (hideDownloadBtn) {
          this.outer.addClass("lg-hide-download");
        } else {
          const $download = this.getElementById("lg-download");
          this.outer.removeClass("lg-hide-download");
          $download.attr(
            "href",
            currentGalleryItem.downloadUrl || currentGalleryItem.src
          );
          if (currentGalleryItem.download) {
            $download.attr("download", currentGalleryItem.download);
          }
        }
      }
    }
    makeSlideAnimation(direction, currentSlideItem, previousSlideItem) {
      if (this.lGalleryOn) {
        previousSlideItem.addClass("lg-slide-progress");
      }
      setTimeout(
        () => {
          this.outer.addClass("lg-no-trans");
          this.outer.find(".lg-item").removeClass("lg-prev-slide lg-next-slide");
          if (direction === "prev") {
            currentSlideItem.addClass("lg-prev-slide");
            previousSlideItem.addClass("lg-next-slide");
          } else {
            currentSlideItem.addClass("lg-next-slide");
            previousSlideItem.addClass("lg-prev-slide");
          }
          setTimeout(() => {
            this.outer.find(".lg-item").removeClass("lg-current");
            currentSlideItem.addClass("lg-current");
            this.outer.removeClass("lg-no-trans");
          }, 50);
        },
        this.lGalleryOn ? this.settings.slideDelay : 0
      );
    }
    /**
     * Goto a specific slide.
     * @param {Number} index - index of the slide
     * @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
     * @param {Boolean} fromThumb - true if slide function called via thumbnail click
     * @param {String} direction - Direction of the slide(next/prev)
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  // to go to 3rd slide
     *  plugin.slide(2);
     *
     */
    slide(index, fromTouch, fromThumb, direction) {
      const prevIndex = this.getPreviousSlideIndex();
      this.currentItemsInDom = this.organizeSlideItems(index, prevIndex);
      if (this.lGalleryOn && prevIndex === index) {
        return;
      }
      const numberOfGalleryItems = this.galleryItems.length;
      if (!this.lgBusy) {
        if (this.settings.counter) {
          this.updateCurrentCounter(index);
        }
        this.announceSlide(index);
        const currentSlideItem = this.getSlideItem(index);
        const previousSlideItem = this.getSlideItem(prevIndex);
        const currentGalleryItem = this.galleryItems[index];
        const videoInfo = currentGalleryItem.__slideVideoInfo;
        this.outer.attr(
          "data-lg-slide-type",
          this.getSlideType(currentGalleryItem)
        );
        this.setDownloadValue(index);
        this.updateCurrentImageSize(index);
        if (videoInfo) {
          const { top, bottom } = this.mediaContainerPosition;
          const videoSize = utils.getSize(
            this.items[index],
            this.outer,
            top + bottom,
            videoInfo && this.settings.videoMaxSize
          );
          this.resizeVideoSlide(index, videoSize);
        }
        this.LGel.trigger(lGEvents.beforeSlide, {
          prevIndex,
          index,
          fromTouch: !!fromTouch,
          fromThumb: !!fromThumb
        });
        this.lgBusy = true;
        clearTimeout(this.hideBarTimeout);
        this.arrowDisable(index);
        if (!direction) {
          if (index < prevIndex) {
            direction = "prev";
          } else if (index > prevIndex) {
            direction = "next";
          }
        }
        if (!fromTouch) {
          this.makeSlideAnimation(
            direction,
            currentSlideItem,
            previousSlideItem
          );
        } else {
          this.outer.find(".lg-item").removeClass("lg-prev-slide lg-current lg-next-slide");
          let touchPrev;
          let touchNext;
          if (numberOfGalleryItems > 2) {
            touchPrev = index - 1;
            touchNext = index + 1;
            if (index === 0 && prevIndex === numberOfGalleryItems - 1) {
              touchNext = 0;
              touchPrev = numberOfGalleryItems - 1;
            } else if (index === numberOfGalleryItems - 1 && prevIndex === 0) {
              touchNext = 0;
              touchPrev = numberOfGalleryItems - 1;
            }
          } else {
            touchPrev = 0;
            touchNext = 1;
          }
          if (direction === "prev") {
            this.getSlideItem(touchNext).addClass("lg-next-slide");
          } else {
            this.getSlideItem(touchPrev).addClass("lg-prev-slide");
          }
          currentSlideItem.addClass("lg-current");
        }
        if (!this.lGalleryOn) {
          this.loadContent(index, true);
        } else {
          setTimeout(() => {
            this.loadContent(index, true);
            if (this.settings.appendSubHtmlTo !== ".lg-item") {
              this.addHtml(index);
            }
          }, this.settings.speed + 50 + (fromTouch ? 0 : this.settings.slideDelay));
        }
        setTimeout(() => {
          this.lgBusy = false;
          previousSlideItem.removeClass("lg-slide-progress");
          this.LGel.trigger(lGEvents.afterSlide, {
            prevIndex,
            index,
            fromTouch,
            fromThumb
          });
        }, (this.lGalleryOn ? this.settings.speed + 100 : 100) + (fromTouch ? 0 : this.settings.slideDelay));
      }
      this.index = index;
    }
    updateCurrentCounter(index) {
      this.getElementById("lg-counter-current").html(index + 1 + "");
    }
    /**
     * Plain-text caption of a slide for the aria-live announcer. Resolves
     * the same sources addHtml uses (inline subHtml markup or a selector)
     * and strips the markup down to readable text. Remote captions
     * (subHtmlUrl) are skipped, announcing can't wait on a fetch.
     */
    getSlideCaptionText(index) {
      const currentGalleryItem = this.galleryItems[index];
      if (!currentGalleryItem || currentGalleryItem.subHtmlUrl) {
        return "";
      }
      let subHtml = currentGalleryItem.subHtml || "";
      const firstLetter = subHtml.substring(0, 1);
      if (firstLetter === "." || firstLetter === "#") {
        try {
          if (this.settings.subHtmlSelectorRelative && !this.settings.dynamic) {
            subHtml = $LG(this.items).eq(index).find(subHtml).first().html();
          } else {
            subHtml = $LG(subHtml).first().html();
          }
        } catch (error) {
          subHtml = "";
        }
      }
      if (!subHtml) {
        return "";
      }
      const container = document.createElement("div");
      container.innerHTML = subHtml;
      return container.textContent || "";
    }
    /**
     * Update the polite live region with the shown slide's position and
     * caption ("Image X of Y, caption"). The single announcement source,
     * counter and caption bar are not live regions while this is enabled.
     */
    announceSlide(index) {
      if (!this.settings.ariaAnnouncements) {
        return;
      }
      const announcer = this.getElementById("lg-announcer").get();
      if (!announcer) {
        return;
      }
      announcer.textContent = formatSlideAnnouncement({
        template: this.settings.strings["slideAnnouncement"],
        index: index + 1,
        total: this.galleryItems.length,
        caption: this.getSlideCaptionText(index)
      });
    }
    updateCounterTotal() {
      this.getElementById("lg-counter-all").html(
        this.galleryItems.length + ""
      );
    }
    getSlideType(item) {
      if (item.__slideVideoInfo) {
        return "video";
      } else if (item.iframe) {
        return "iframe";
      } else {
        return "image";
      }
    }
    /** Stop a running release spring; visuals stay at the live frame. */
    stopSlideSpring() {
      if (this.cancelSlideSpring) {
        this.cancelSlideSpring();
        this.cancelSlideSpring = void 0;
      }
    }
    touchMove(startCoords, endCoords, e) {
      const distanceX = endCoords.pageX - startCoords.pageX;
      const distanceY = endCoords.pageY - startCoords.pageY;
      this.swipeSamples = pushVelocitySample(this.swipeSamples, {
        x: endCoords.pageX,
        y: endCoords.pageY,
        t: Date.now()
      });
      this.swipeDirection = getSwipeAxis(
        distanceX,
        distanceY,
        this.swipeDirection
      );
      if (!this.swipeDirection) {
        return;
      }
      const $currentSlide = this.getSlideItem(this.index);
      if (this.swipeDirection === "horizontal") {
        e == null ? void 0 : e.preventDefault();
        this.outer.addClass("lg-dragging");
        const transforms = getHorizontalDragTransforms(
          this.getEdgeDragDelta(distanceX),
          $currentSlide.get().offsetWidth,
          this.getDirection()
        );
        $currentSlide.css("transform", transforms.current);
        this.outer.find(".lg-prev-slide").first().css("transform", transforms.prev);
        this.outer.find(".lg-next-slide").first().css("transform", transforms.next);
      } else if (this.swipeDirection === "vertical") {
        if (this.settings.swipeToClose) {
          e == null ? void 0 : e.preventDefault();
          this.$container.addClass("lg-dragging-vertical");
          const effects = getVerticalDragEffects(
            distanceY,
            window.innerWidth,
            window.innerHeight
          );
          this.$backdrop.css("opacity", effects.backdropOpacity);
          $currentSlide.css("transform", effects.transform);
          if (effects.hideUi) {
            this.outer.addClass("lg-hide-items").removeClass("lg-components-open");
          }
        }
      }
    }
    /**
     * The horizontal delta as rendered: rubber-banded when the drag
     * points past the first/last slide with nothing there (loop counts).
     */
    getEdgeDragDelta(distanceX) {
      const count = this.galleryItems.length;
      return getEdgeFrictionedDelta(
        distanceX,
        resolveSwipeTarget(
          "prev",
          this.index,
          count,
          this.settings.loop
        ) !== null,
        resolveSwipeTarget(
          "next",
          this.index,
          count,
          this.settings.loop
        ) !== null,
        this.getDirection()
      );
    }
    /** Resolved reading direction ('auto' is resolved at init). */
    getDirection() {
      return this.settings.direction === "rtl" ? "rtl" : "ltr";
    }
    /**
     * Spring the dragged slides back to rest, seeded with the release
     * velocity. Returns false (no spring) for sub-pixel drags.
     */
    springSlidesBack(deltaX, velocityX) {
      if (Math.abs(deltaX) < 1) {
        return false;
      }
      const $currentSlide = this.getSlideItem(this.index);
      const $prev = this.outer.find(".lg-prev-slide").first();
      const $next = this.outer.find(".lg-next-slide").first();
      const width = $currentSlide.get().offsetWidth;
      this.stopSlideSpring();
      this.cancelSlideSpring = runSprings(
        [{ from: deltaX, velocity: velocityX, target: 0 }],
        ([x]) => {
          const transforms = getHorizontalDragTransforms(
            x,
            width,
            this.getDirection()
          );
          $currentSlide.css("transform", transforms.current);
          $prev.css("transform", transforms.prev);
          $next.css("transform", transforms.next);
        },
        () => {
          this.cancelSlideSpring = void 0;
          this.endDragVisuals();
        }
      );
      return true;
    }
    /**
     * Carry the release velocity into a gesture navigation: navigate
     * immediately (events, counter and busy-lock on time; fromTouch
     * classes flip underneath, inline transforms keep the visuals),
     * then spring the same drag geometry until the arriving slide lands
     * at rest. Falls back to a snap-back when navigation declines
     * (busy, or an edge without loop, the 2.x end animation plays).
     */
    springSlideNavigation(verdict, deltaX, velocityX) {
      const $current = this.getSlideItem(this.index);
      const $prev = this.outer.find(".lg-prev-slide").first();
      const $next = this.outer.find(".lg-next-slide").first();
      const width = $current.get().offsetWidth;
      if (!width) {
        return false;
      }
      const prevIndex = this.index;
      if (verdict === "next") {
        this.goToNextSlide(true);
      } else {
        this.goToPrevSlide(true);
      }
      if (this.index === prevIndex) {
        return this.springSlidesBack(deltaX, velocityX);
      }
      const target = (verdict === "next" ? -1 : 1) * (this.getDirection() === "rtl" ? -1 : 1) * (width * 115 / 110);
      this.stopSlideSpring();
      this.cancelSlideSpring = runSprings(
        [{ from: deltaX, velocity: velocityX, target }],
        ([x]) => {
          const transforms = getHorizontalDragTransforms(
            x,
            width,
            this.getDirection()
          );
          $current.css("transform", transforms.current);
          $prev.css("transform", transforms.prev);
          $next.css("transform", transforms.next);
        },
        () => {
          this.cancelSlideSpring = void 0;
          this.endDragVisuals();
        }
      );
      return true;
    }
    /**
     * Hand the slides back to CSS after a gesture. The inline transforms
     * go first, while lg-dragging still pins transition-duration to 0s,
     * so the snap from the released position to the slide's resting
     * place lands in a single frame. Dropping the class first animates
     * that snap instead, and the outgoing slide is seen travelling back
     * toward the centre while its fade is still running.
     */
    endDragVisuals() {
      this.outer.find(".lg-item").removeAttr("style");
      if (this.settings.mode !== "lg-slide") {
        this.outer.removeClass("lg-slide");
      }
      void this.outer.get().offsetHeight;
      this.outer.removeClass("lg-dragging");
    }
    /**
     * Spring a non-closing vertical drag back to rest, slide transform
     * and backdrop opacity together, seeded with the release velocity.
     */
    springVerticalRestore(deltaY, velocityY) {
      if (Math.abs(deltaY) < 1) {
        return false;
      }
      const $currentSlide = this.getSlideItem(this.index);
      this.stopSlideSpring();
      this.$container.addClass("lg-dragging-vertical");
      this.cancelSlideSpring = runSprings(
        [{ from: deltaY, velocity: velocityY, target: 0 }],
        ([y]) => {
          const effects = getVerticalDragEffects(
            y,
            window.innerWidth,
            window.innerHeight
          );
          this.$backdrop.css("opacity", effects.backdropOpacity);
          $currentSlide.css("transform", effects.transform);
        },
        () => {
          this.cancelSlideSpring = void 0;
          this.$container.removeClass("lg-dragging-vertical");
          this.endDragVisuals();
          this.$backdrop.css("opacity", 1);
        }
      );
      return true;
    }
    touchEnd(endCoords, startCoords, event) {
      const releaseVelocity = getWindowedVelocity(
        this.swipeSamples,
        Date.now()
      );
      if (this.settings.mode !== "lg-slide") {
        this.outer.addClass("lg-slide");
      }
      setTimeout(() => {
        this.$container.removeClass("lg-dragging-vertical");
        this.outer.removeClass("lg-hide-items").addClass("lg-components-open");
        let triggerClick = true;
        let springing = false;
        if (this.swipeDirection === "horizontal") {
          const verdict = getSwipeReleaseVerdict({
            deltaX: endCoords.pageX - startCoords.pageX,
            velocityX: releaseVelocity.x,
            threshold: this.settings.swipeThreshold,
            flickVelocity: this.settings.flickVelocity,
            viewportWidth: this.outer.get().offsetWidth,
            direction: this.getDirection()
          });
          const renderedDeltaX = this.getEdgeDragDelta(
            endCoords.pageX - startCoords.pageX
          );
          if (verdict === "next" || verdict === "prev") {
            triggerClick = false;
            springing = this.springSlideNavigation(
              verdict,
              renderedDeltaX,
              releaseVelocity.x
            );
          } else {
            springing = this.springSlidesBack(
              renderedDeltaX,
              releaseVelocity.x
            );
          }
        } else if (this.swipeDirection === "vertical") {
          if (shouldCloseOnVerticalDrag(
            endCoords.pageY - startCoords.pageY,
            releaseVelocity.y,
            window.innerHeight,
            {
              closable: this.settings.closable,
              swipeToClose: this.settings.swipeToClose
            }
          )) {
            this.closeGallery();
            return;
          }
          if (this.settings.swipeToClose) {
            springing = this.springVerticalRestore(
              endCoords.pageY - startCoords.pageY,
              releaseVelocity.y
            );
          }
        }
        if (!springing) {
          this.endDragVisuals();
          this.$backdrop.css("opacity", 1);
        }
        if (triggerClick && Math.abs(endCoords.pageX - startCoords.pageX) < 5) {
          const target = $LG(event.target);
          if (this.isPosterElement(target)) {
            this.LGel.trigger(lGEvents.posterClick);
          }
        }
        this.swipeDirection = void 0;
      });
      setTimeout(() => {
        if (!this.outer.hasClass("lg-dragging") && this.settings.mode !== "lg-slide") {
          this.outer.removeClass("lg-slide");
        }
      }, this.settings.speed + 100);
    }
    enableSwipe() {
      let startCoords = {};
      let endCoords = {};
      let isMoved = false;
      let isSwiping = false;
      if (this.settings.enableSwipe) {
        this.$inner.on("touchstart.lg", (e) => {
          this.dragOrSwipeEnabled = true;
          const $item = this.getSlideItem(this.index);
          if (($LG(e.target).hasClass("lg-item") || $item.get().contains(e.target)) && !this.outer.hasClass("lg-zoomed") && !this.lgBusy && e.touches.length === 1) {
            isSwiping = true;
            this.touchAction = "swipe";
            isMoved = false;
            endCoords = {};
            this.stopSlideSpring();
            this.manageSwipeClass();
            this.swipeSamples = [
              {
                x: e.touches[0].pageX,
                y: e.touches[0].pageY,
                t: Date.now()
              }
            ];
            startCoords = {
              pageX: e.touches[0].pageX,
              pageY: e.touches[0].pageY
            };
          }
        });
        this.$inner.on("touchmove.lg", (e) => {
          if (isSwiping && this.touchAction === "swipe" && e.touches.length === 1) {
            endCoords = {
              pageX: e.touches[0].pageX,
              pageY: e.touches[0].pageY
            };
            this.touchMove(startCoords, endCoords, e);
            isMoved = true;
          }
        });
        this.$inner.on("touchend.lg", (event) => {
          if (this.touchAction === "swipe") {
            if (isMoved) {
              isMoved = false;
              this.touchEnd(endCoords, startCoords, event);
            } else if (isSwiping) {
              const target = $LG(event.target);
              if (this.isPosterElement(target)) {
                this.LGel.trigger(lGEvents.posterClick);
              }
            }
            this.touchAction = void 0;
            isSwiping = false;
          }
        });
      }
    }
    enableDrag() {
      let startCoords = {};
      let endCoords = {};
      let isDraging = false;
      let isMoved = false;
      if (this.settings.enableDrag) {
        this.outer.on("mousedown.lg", (e) => {
          this.dragOrSwipeEnabled = true;
          const $item = this.getSlideItem(this.index);
          if ($LG(e.target).hasClass("lg-item") || $item.get().contains(e.target)) {
            if (!this.outer.hasClass("lg-zoomed") && !this.lgBusy) {
              e.preventDefault();
              this.stopSlideSpring();
              this.manageSwipeClass();
              this.swipeSamples = [
                { x: e.pageX, y: e.pageY, t: Date.now() }
              ];
              startCoords = {
                pageX: e.pageX,
                pageY: e.pageY
              };
              isDraging = true;
              this.outer.get().scrollLeft += 1;
              this.outer.get().scrollLeft -= 1;
              this.outer.removeClass("lg-grab").addClass("lg-grabbing");
              this.LGel.trigger(lGEvents.dragStart);
            }
          }
        });
        $LG(window).on(`mousemove.lg.global${this.lgId}`, (e) => {
          if (isDraging && this.lgOpened) {
            isMoved = true;
            endCoords = {
              pageX: e.pageX,
              pageY: e.pageY
            };
            this.touchMove(startCoords, endCoords);
            this.LGel.trigger(lGEvents.dragMove);
          }
        });
        $LG(window).on(`mouseup.lg.global${this.lgId}`, (event) => {
          if (!this.lgOpened) {
            return;
          }
          const target = $LG(event.target);
          if (isMoved) {
            isMoved = false;
            this.touchEnd(endCoords, startCoords, event);
            this.LGel.trigger(lGEvents.dragEnd);
          } else if (this.isPosterElement(target)) {
            this.LGel.trigger(lGEvents.posterClick);
          }
          if (isDraging) {
            isDraging = false;
            this.outer.removeClass("lg-grabbing").addClass("lg-grab");
          }
        });
      }
    }
    triggerPosterClick() {
      this.$inner.on("click.lg", (event) => {
        if (!this.dragOrSwipeEnabled && this.isPosterElement($LG(event.target))) {
          this.LGel.trigger(lGEvents.posterClick);
        }
      });
    }
    manageSwipeClass() {
      let _touchNext = this.index + 1;
      let _touchPrev = this.index - 1;
      if (this.settings.loop && this.galleryItems.length > 2) {
        if (this.index === 0) {
          _touchPrev = this.galleryItems.length - 1;
        } else if (this.index === this.galleryItems.length - 1) {
          _touchNext = 0;
        }
      }
      this.outer.find(".lg-item").removeClass("lg-next-slide lg-prev-slide");
      if (_touchPrev > -1) {
        this.getSlideItem(_touchPrev).addClass("lg-prev-slide");
      }
      this.getSlideItem(_touchNext).addClass("lg-next-slide");
    }
    /**
     * Go to next slide
     * @param {Boolean} fromTouch - true if slide function called via touch event
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  plugin.goToNextSlide();
     * @see <a href="/demos/methods/">Demo</a>
     */
    goToNextSlide(fromTouch) {
      let _loop = this.settings.loop;
      if (fromTouch && this.galleryItems.length < 3) {
        _loop = false;
      }
      if (!this.lgBusy) {
        if (this.index + 1 < this.galleryItems.length) {
          this.index++;
          this.LGel.trigger(lGEvents.beforeNextSlide, {
            index: this.index
          });
          this.slide(this.index, !!fromTouch, false, "next");
        } else {
          if (_loop) {
            this.index = 0;
            this.LGel.trigger(lGEvents.beforeNextSlide, {
              index: this.index
            });
            this.slide(this.index, !!fromTouch, false, "next");
          } else if (this.settings.slideEndAnimation && !fromTouch) {
            this.outer.addClass("lg-right-end");
            setTimeout(() => {
              this.outer.removeClass("lg-right-end");
            }, 400);
          }
        }
      }
    }
    /**
     * Go to previous slides
     * @param {Boolean} fromTouch - true if slide function called via touch event
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery({});
     *  plugin.goToPrevSlide();
     * @see <a href="/demos/methods/">Demo</a>
     *
     */
    goToPrevSlide(fromTouch) {
      let _loop = this.settings.loop;
      if (fromTouch && this.galleryItems.length < 3) {
        _loop = false;
      }
      if (!this.lgBusy) {
        if (this.index > 0) {
          this.index--;
          this.LGel.trigger(lGEvents.beforePrevSlide, {
            index: this.index,
            fromTouch
          });
          this.slide(this.index, !!fromTouch, false, "prev");
        } else {
          if (_loop) {
            this.index = this.galleryItems.length - 1;
            this.LGel.trigger(lGEvents.beforePrevSlide, {
              index: this.index,
              fromTouch
            });
            this.slide(this.index, !!fromTouch, false, "prev");
          } else if (this.settings.slideEndAnimation && !fromTouch) {
            this.outer.addClass("lg-left-end");
            setTimeout(() => {
              this.outer.removeClass("lg-left-end");
            }, 400);
          }
        }
      }
    }
    keyPress() {
      $LG(window).on(`keydown.lg.global${this.lgId}`, (e) => {
        if (this.lgOpened && this.settings.escKey === true && e.keyCode === 27) {
          e.preventDefault();
          if (this.settings.allowMediaOverlap && this.outer.hasClass("lg-can-toggle") && this.outer.hasClass("lg-components-open")) {
            this.outer.removeClass("lg-components-open");
          } else {
            this.closeGallery();
          }
        }
        if (this.lgOpened && this.galleryItems.length > 1) {
          const rtl = this.getDirection() === "rtl";
          if (e.keyCode === 37) {
            e.preventDefault();
            if (rtl) {
              this.goToNextSlide();
            } else {
              this.goToPrevSlide();
            }
          }
          if (e.keyCode === 39) {
            e.preventDefault();
            if (rtl) {
              this.goToPrevSlide();
            } else {
              this.goToNextSlide();
            }
          }
        }
      });
    }
    arrow() {
      this.getElementById("lg-prev").on("click.lg", () => {
        this.goToPrevSlide();
      });
      this.getElementById("lg-next").on("click.lg", () => {
        this.goToNextSlide();
      });
    }
    arrowDisable(index) {
      if (!this.settings.loop && this.settings.hideControlOnEnd) {
        const $prev = this.getElementById("lg-prev");
        const $next = this.getElementById("lg-next");
        if (index + 1 === this.galleryItems.length) {
          $next.attr("disabled", "disabled").addClass("disabled");
        } else {
          $next.removeAttr("disabled").removeClass("disabled");
        }
        if (index === 0) {
          $prev.attr("disabled", "disabled").addClass("disabled");
        } else {
          $prev.removeAttr("disabled").removeClass("disabled");
        }
      }
    }
    setTranslate($el, xValue, yValue, scaleX = 1, scaleY = 1) {
      $el.css(
        "transform",
        "translate3d(" + xValue + "px, " + yValue + "px, 0px) scale3d(" + scaleX + ", " + scaleY + ", 1)"
      );
    }
    mousewheel() {
      let lastCall = 0;
      this.outer.on("wheel.lg", (e) => {
        if (!e.deltaY || this.galleryItems.length < 2) {
          return;
        }
        e.preventDefault();
        const now = (/* @__PURE__ */ new Date()).getTime();
        if (now - lastCall < 1e3) {
          return;
        }
        lastCall = now;
        if (e.deltaY > 0) {
          this.goToNextSlide();
        } else if (e.deltaY < 0) {
          this.goToPrevSlide();
        }
      });
    }
    isSlideElement(target) {
      return target.hasClass("lg-outer") || target.hasClass("lg-item") || target.hasClass("lg-img-wrap") || target.hasClass("lg-img-rotate");
    }
    isPosterElement(target) {
      const playButton = this.getSlideItem(this.index).find(".lg-video-play-button").get();
      return target.hasClass("lg-video-poster") || target.hasClass("lg-video-play-button") || playButton && playButton.contains(target.get());
    }
    /**
     * Maximize minimize inline gallery.
     * @category lGPublicMethods
     */
    toggleMaximize() {
      this.getElementById("lg-maximize").on("click.lg", () => {
        this.$container.toggleClass("lg-inline");
        this.refreshOnResize();
      });
    }
    invalidateItems() {
      for (let index = 0; index < this.items.length; index++) {
        const element = this.items[index];
        const $element = $LG(element);
        $element.off(`click.lgcustom-item-${$element.attr("data-lg-id")}`);
      }
    }
    trapFocus() {
      this.$container.get().focus({
        preventScroll: true
      });
      $LG(window).on(`keydown.lg.global${this.lgId}`, (e) => {
        if (!this.lgOpened) {
          return;
        }
        const isTabPressed = e.key === "Tab" || e.keyCode === 9;
        if (!isTabPressed) {
          return;
        }
        const focusableEls = utils.getFocusableElements(
          this.$container.get()
        );
        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls[focusableEls.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus();
            e.preventDefault();
          }
        }
      });
    }
    manageCloseGallery() {
      if (!this.settings.closable) return;
      let mousedown = false;
      this.getElementById("lg-close").on("click.lg", () => {
        this.closeGallery();
      });
      if (this.settings.closeOnTap) {
        this.outer.on("mousedown.lg", (e) => {
          const target = $LG(e.target);
          if (this.isSlideElement(target)) {
            mousedown = true;
          } else {
            mousedown = false;
          }
        });
        this.outer.on("mousemove.lg", () => {
          mousedown = false;
        });
        this.outer.on("mouseup.lg", (e) => {
          const target = $LG(e.target);
          if (this.isSlideElement(target) && mousedown) {
            if (!this.outer.hasClass("lg-dragging")) {
              this.closeGallery();
            }
          }
        });
      }
    }
    /**
     * Close lightGallery if it is opened.
     *
     * @description If closable is false in the settings, you need to pass true via closeGallery method to force close gallery
     * @return returns the estimated time to close gallery completely including the close animation duration
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  plugin.closeGallery();
     *
     */
    closeGallery(force) {
      if (!this.lgOpened || !this.settings.closable && !force) {
        return 0;
      }
      this.LGel.trigger(lGEvents.beforeClose);
      if (this.settings.resetScrollPosition && !this.settings.hideScrollbar) {
        $LG(window).scrollTop(this.prevScrollTop);
      }
      const currentItem = this.items[this.index];
      let transform;
      if (this.zoomFromOrigin && currentItem) {
        const { top, bottom } = this.mediaContainerPosition;
        const { __slideVideoInfo, poster } = this.galleryItems[this.index];
        const imageSize = utils.getSize(
          currentItem,
          this.outer,
          top + bottom,
          __slideVideoInfo && poster && this.settings.videoMaxSize
        );
        transform = this.getOriginTransform(currentItem, imageSize);
      }
      if (!transform) {
        transform = getCenterCloseTransform();
        this.outer.addClass("lg-close-to-center");
      }
      if (transform) {
        this.outer.addClass("lg-closing lg-zoom-from-image");
        this.getSlideItem(this.index).addClass("lg-start-end-progress").css(
          "transition-duration",
          this.settings.startAnimationDuration + "ms"
        ).css("transform", transform);
      } else {
        this.outer.addClass("lg-hide-items");
        this.outer.removeClass("lg-zoom-from-image");
      }
      this.destroyModules();
      this.lGalleryOn = false;
      this.isDummyImageRemoved = false;
      this.zoomFromOrigin = this.settings.zoomFromOrigin;
      clearTimeout(this.hideBarTimeout);
      this.hideBarTimeout = false;
      $LG("html").removeClass("lg-on");
      this.outer.removeClass("lg-visible lg-components-open");
      this.$backdrop.removeClass("in").css("opacity", 0);
      const removeTimeout = transform ? Math.max(
        this.settings.startAnimationDuration,
        this.settings.backdropDuration
      ) : this.settings.backdropDuration;
      this.$container.removeClass("lg-show-in");
      setTimeout(() => {
        if (transform) {
          this.outer.removeClass("lg-zoom-from-image");
        }
        this.$container.removeClass("lg-show");
        this.resetScrollBar();
        this.$backdrop.removeAttr("style").css(
          "transition-duration",
          this.settings.backdropDuration + "ms"
        );
        this.outer.removeClass(
          `lg-closing lg-close-to-center ${this.settings.startClass}`
        );
        this.getSlideItem(this.index).removeClass("lg-start-end-progress");
        this.$inner.empty();
        const announcer = this.getElementById("lg-announcer").get();
        if (announcer) {
          announcer.textContent = "";
        }
        if (this.lgOpened) {
          this.LGel.trigger(lGEvents.afterClose, {
            instance: this
          });
        }
        if (this.$container.get()) {
          this.$container.get().blur();
        }
        if (this.prevActiveElement && this.prevActiveElement.isConnected) {
          this.prevActiveElement.focus({ preventScroll: true });
        }
        this.prevActiveElement = void 0;
        this.lgOpened = false;
      }, removeTimeout + 100);
      return removeTimeout + 100;
    }
    initModules() {
      this.plugins.forEach((module2) => {
        try {
          module2.init();
        } catch (err) {
          console.warn(
            `lightGallery:- make sure lightGallery module is properly initiated. See https://www.lightgalleryjs.com/docs/methods/`
          );
        }
      });
    }
    destroyModules(destroy) {
      this.plugins.forEach((module2) => {
        try {
          if (destroy) {
            module2.destroy();
          } else {
            module2.closeGallery && module2.closeGallery();
          }
        } catch (err) {
          console.warn(
            `lightGallery:- make sure lightGallery module is properly destroyed. See https://www.lightgalleryjs.com/docs/methods/`
          );
        }
      });
    }
    /**
     * Refresh lightGallery with new set of children.
     *
     * @description This is useful to update the gallery when the child elements are changed without calling destroy method.
     *
     * If you are using dynamic mode, you can pass the modified array of dynamicEl as the first parameter to refresh the dynamic gallery
     * @see <a href="/demos/dynamic-mode/">Demo</a>
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  // Delete or add children, then call
     *  plugin.refresh();
     *
     */
    refresh(galleryItems) {
      if (!this.settings.dynamic) {
        this.invalidateItems();
      }
      if (galleryItems) {
        this.galleryItems = galleryItems;
      } else {
        this.galleryItems = this.getItems();
      }
      this.updateControls();
      this.openGalleryOnItemClick();
      this.LGel.trigger(lGEvents.updateSlides);
    }
    updateControls() {
      this.addSlideVideoInfo(this.galleryItems);
      this.updateCounterTotal();
      this.manageSingleSlideClassName();
    }
    destroyGallery() {
      var _a;
      this.destroyModules(true);
      if (!this.settings.dynamic) {
        this.invalidateItems();
      }
      $LG(window).off(`.lg.global${this.lgId}`);
      this.LGel.off(".lg");
      (_a = this.toolbarOverflow) == null ? void 0 : _a.destroy();
      this.toolbarOverflow = void 0;
      this.$container.remove();
    }
    /**
     * Destroy lightGallery.
     * Destroy lightGallery and its plugin instances completely
     *
     * @description This method also calls CloseGallery function internally. Returns the time takes to completely close and destroy the instance.
     * In case if you want to re-initialize lightGallery right after destroying it, initialize it only once the destroy process is completed.
     * You can use refresh method most of the times.
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  plugin.destroy();
     *
     */
    destroy() {
      const closeTimeout = this.closeGallery(true);
      if (closeTimeout) {
        setTimeout(this.destroyGallery.bind(this), closeTimeout);
      } else {
        this.destroyGallery();
      }
      return closeTimeout;
    }
  }
  function lightGallery(el, options) {
    return new LightGallery(el, options);
  }
  lightGallery.setLicenseKey = setLicenseKey;
  return lightGallery;
});
//# sourceMappingURL=lightgallery.umd.js.map
