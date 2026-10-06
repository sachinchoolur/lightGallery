/*!
 * lightgallery | 3.0.0-beta.4 | October 6th 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
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
const DEFAULT_TARGET_ROW_HEIGHT = 180;
const DEFAULT_GAP = 8;
const DEFAULT_MAX_SCALE = 1.75;
function sanitizeRatios(ratios) {
  let warned = false;
  return ratios.map((ratio) => {
    if (Number.isFinite(ratio) && ratio > 0) {
      return ratio;
    }
    if (!warned && typeof console !== "undefined") {
      warned = true;
      console.warn(
        "lightGallery justified layout: invalid aspect ratio, treating as 1 (square). See https://www.lightgalleryjs.com/docs/justified-layout/"
      );
    }
    return 1;
  });
}
function renderRow(options) {
  const { row, firstIndex, top, containerWidth, gap, fill, boxes } = options;
  const height = Math.round(options.height);
  let start = 0;
  row.forEach((ratio, offset) => {
    let width = Math.round(ratio * height);
    if (fill && offset === row.length - 1) {
      width = containerWidth - start;
    }
    boxes[firstIndex + offset] = { top, start, width, height };
    start += width + gap;
  });
  return height;
}
function getJustifiedLayout(options) {
  const {
    containerWidth,
    targetRowHeight = DEFAULT_TARGET_ROW_HEIGHT,
    gap = DEFAULT_GAP,
    lastRow = "start",
    maxScale = DEFAULT_MAX_SCALE
  } = options;
  const ratios = sanitizeRatios(options.ratios);
  const boxes = new Array(ratios.length);
  const maxHeight = targetRowHeight * maxScale;
  const fillHeight = (row2) => {
    const available = containerWidth - gap * (row2.length - 1);
    const ratioSum = row2.reduce((sum, ratio) => sum + ratio, 0);
    return available / ratioSum;
  };
  let top = 0;
  let row = [];
  let firstIndex = 0;
  const closeRow = (height, fill) => {
    const rendered = renderRow({
      row,
      firstIndex,
      top,
      height: Math.min(height, maxHeight),
      containerWidth,
      gap,
      // A clamped row no longer fills the width — never stretch it.
      fill: fill && height <= maxHeight,
      boxes
    });
    top += rendered + gap;
    firstIndex += row.length;
    row = [];
  };
  ratios.forEach((ratio) => {
    row.push(ratio);
    const height = fillHeight(row);
    if (height > targetRowHeight) {
      return;
    }
    const heightWithout = row.length > 1 ? fillHeight(row.slice(0, -1)) : null;
    if (heightWithout !== null && heightWithout - targetRowHeight < targetRowHeight - height) {
      const carried = row.pop();
      closeRow(heightWithout, true);
      row = [carried];
      if (fillHeight(row) <= targetRowHeight) {
        closeRow(fillHeight(row), true);
      }
    } else {
      closeRow(height, true);
    }
  });
  if (row.length > 0) {
    if (lastRow === "hide") {
      row.forEach((_, offset) => {
        boxes[firstIndex + offset] = {
          top: 0,
          start: 0,
          width: 0,
          height: 0
        };
      });
    } else if (lastRow === "justify") {
      closeRow(fillHeight(row), true);
    } else {
      closeRow(targetRowHeight, false);
    }
  }
  return {
    boxes,
    containerHeight: firstIndex > 0 || row.length > 0 ? Math.max(top - gap, 0) : 0
  };
}
function getJustifiedRows(boxes) {
  const rows = [];
  let rowTop = -1;
  boxes.forEach((box, index) => {
    if (box.width === 0 && box.height === 0) {
      return;
    }
    if (!rows.length || box.top !== rowTop) {
      rows.push([]);
      rowTop = box.top;
    }
    rows[rows.length - 1].push(index);
  });
  return rows;
}
function getRevealableItems(rows, isLoaded, reveal) {
  if (reveal === "image") {
    return [].concat(...rows).filter(isLoaded);
  }
  const revealable = [];
  for (const row of rows) {
    if (!row.every(isLoaded)) {
      break;
    }
    revealable.push(...row);
  }
  return revealable;
}
const lGEvents = {
  updateSlides: "lgUpdateSlides"
};
const justifiedSettings = {
  justified: true,
  justifiedRowHeight: 180,
  justifiedGap: 8,
  justifiedLastRow: "start",
  justifiedMaxScale: 1.75,
  justifiedReveal: "row"
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
class Justified {
  constructor(instance, $LG) {
    this.triggers = [];
    this.ratios = [];
    this.layoutWidth = 0;
    this.pendingLoads = [];
    this.rows = [];
    this.loaded = /* @__PURE__ */ new Set();
    this.loadWatchers = /* @__PURE__ */ new Map();
    this.originalContainerStyle = "";
    this.originalTriggerStyles = /* @__PURE__ */ new Map();
    this.core = instance;
    this.$LG = $LG;
    this.settings = __spreadValues(__spreadValues({}, justifiedSettings), this.core.settings);
    return this;
  }
  init() {
    if (!this.settings.justified || this.core.settings.dynamic) {
      return;
    }
    this.collectTriggers();
    if (!this.triggers.length) {
      return;
    }
    this.originalContainerStyle = this.core.el.getAttribute("style") || "";
    this.core.el.classList.add("lg-justified", "lg-justified-reveal");
    this.resolveRatios();
    this.layout();
    this.core.LGel.on(`${lGEvents.updateSlides}.justified`, () => {
      this.pendingLoads.forEach((cancel) => cancel());
      this.pendingLoads = [];
      this.cancelLoadWatchers();
      this.collectTriggers();
      this.resolveRatios();
      this.layout();
    });
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.core.el.clientWidth !== this.layoutWidth) {
          this.layout();
        }
      });
      this.resizeObserver.observe(this.core.el);
    }
  }
  /** Adopt the core's current trigger list into the layout. */
  collectTriggers() {
    this.triggers = Array.prototype.slice.call(this.core.items);
    this.triggers.forEach((trigger) => {
      if (!this.originalTriggerStyles.has(trigger)) {
        this.originalTriggerStyles.set(
          trigger,
          trigger.getAttribute("style") || ""
        );
      }
      trigger.classList.add("lg-justified-item");
    });
  }
  /** Best-known aspect ratio per trigger; unknowns resolve on load. */
  resolveRatios() {
    this.ratios = this.triggers.map((trigger, index) => {
      const size = parseImageSize(
        trigger.getAttribute("data-lg-size") || void 0,
        window.innerWidth
      );
      if (size) {
        return size.width / size.height;
      }
      const img = trigger.querySelector("img");
      if (!img) {
        return 1;
      }
      const width = parseInt(img.getAttribute("width") || "", 10);
      const height = parseInt(img.getAttribute("height") || "", 10);
      if (width > 0 && height > 0) {
        return width / height;
      }
      if (img.complete && img.naturalWidth > 0) {
        return img.naturalWidth / img.naturalHeight;
      }
      this.watchImageLoad(img, index);
      return null;
    });
  }
  /** Relayout once when the last unknown thumbnail resolves. */
  watchImageLoad(img, index) {
    const cancel = () => {
      img.removeEventListener("load", onDone);
      img.removeEventListener("error", onDone);
    };
    const onDone = () => {
      cancel();
      this.pendingLoads = this.pendingLoads.filter((c) => c !== cancel);
      this.ratios[index] = img.naturalWidth > 0 ? img.naturalWidth / img.naturalHeight : 1;
      if (this.ratios.every((ratio) => ratio !== null)) {
        this.layout();
      }
    };
    img.addEventListener("load", onDone);
    img.addEventListener("error", onDone);
    this.pendingLoads.push(cancel);
  }
  layout() {
    const containerWidth = this.core.el.clientWidth;
    if (!containerWidth) {
      return;
    }
    this.layoutWidth = containerWidth;
    const { boxes, containerHeight } = getJustifiedLayout({
      // Unknown ratios render square until their image resolves.
      ratios: this.ratios.map((ratio) => ratio != null ? ratio : 1),
      containerWidth,
      targetRowHeight: this.settings.justifiedRowHeight,
      gap: this.settings.justifiedGap,
      lastRow: this.settings.justifiedLastRow,
      maxScale: this.settings.justifiedMaxScale
    });
    const startSide = this.core.settings.direction === "rtl" ? "right" : "left";
    const endSide = startSide === "left" ? "right" : "left";
    this.core.el.style.height = `${containerHeight}px`;
    this.triggers.forEach((trigger, index) => {
      const box = boxes[index];
      const hidden = box.width === 0 && box.height === 0;
      trigger.classList.toggle("lg-justified-item-hidden", hidden);
      if (hidden) {
        return;
      }
      trigger.style.top = `${box.top}px`;
      trigger.style[startSide] = `${box.start}px`;
      trigger.style[endSide] = "auto";
      trigger.style.width = `${box.width}px`;
      trigger.style.height = `${box.height}px`;
      const img = trigger.querySelector("img");
      if (img && img.hasAttribute("srcset")) {
        img.setAttribute("sizes", `${box.width}px`);
      }
      this.watchLoad(trigger, img);
    });
    this.rows = getJustifiedRows(boxes).map(
      (row) => row.map((index) => this.triggers[index])
    );
    this.reveal();
  }
  /** Track when the trigger's thumbnail has settled (loaded or failed). */
  watchLoad(trigger, img) {
    if (this.loaded.has(trigger) || this.loadWatchers.has(trigger)) {
      return;
    }
    if (!img || img.complete) {
      this.loaded.add(trigger);
      return;
    }
    const onDone = () => {
      cancel();
      this.loaded.add(trigger);
      this.reveal();
    };
    const cancel = () => {
      img.removeEventListener("load", onDone);
      img.removeEventListener("error", onDone);
      this.loadWatchers.delete(trigger);
    };
    img.addEventListener("load", onDone);
    img.addEventListener("error", onDone);
    this.loadWatchers.set(trigger, cancel);
  }
  /**
   * Fade in what may show now (see `justifiedReveal`). Never re-hides:
   * a relayout regroups the rows, already visible triggers stay.
   */
  reveal() {
    getRevealableItems(
      this.rows,
      (trigger) => this.loaded.has(trigger),
      this.settings.justifiedReveal
    ).forEach((trigger) => {
      trigger.classList.add("lg-justified-item-visible");
    });
  }
  cancelLoadWatchers() {
    Array.from(this.loadWatchers.values()).forEach((cancel) => cancel());
  }
  closeGallery() {
  }
  destroy() {
    var _a;
    (_a = this.resizeObserver) == null ? void 0 : _a.disconnect();
    this.pendingLoads.forEach((cancel) => cancel());
    this.pendingLoads = [];
    this.cancelLoadWatchers();
    this.loaded.clear();
    this.rows = [];
    if (!this.triggers.length) {
      return;
    }
    this.core.LGel.off(".justified");
    this.core.el.classList.remove("lg-justified", "lg-justified-reveal");
    if (this.originalContainerStyle) {
      this.core.el.setAttribute("style", this.originalContainerStyle);
    } else {
      this.core.el.removeAttribute("style");
    }
    this.triggers.forEach((trigger) => {
      trigger.classList.remove(
        "lg-justified-item",
        "lg-justified-item-hidden",
        "lg-justified-item-visible"
      );
      const original = this.originalTriggerStyles.get(trigger);
      if (original) {
        trigger.setAttribute("style", original);
      } else {
        trigger.removeAttribute("style");
      }
    });
  }
}
export {
  Justified as default
};
//# sourceMappingURL=lg-justified.es5.js.map
