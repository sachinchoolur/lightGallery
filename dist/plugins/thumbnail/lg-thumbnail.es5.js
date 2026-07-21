/*!
 * lightgallery | 2.9.0 | July 21st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
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
  loadYouTubeThumbnail: true,
  youTubeThumbSize: 1,
  thumbnailPluginStrings: {
    toggleThumbnails: "Toggle thumbnails"
  }
};
const lGEvents = {
  containerResize: "lgContainerResize",
  updateSlides: "lgUpdateSlides",
  beforeOpen: "lgBeforeOpen",
  beforeSlide: "lgBeforeSlide"
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
class Thumbnail {
  constructor(instance, $LG) {
    this.thumbOuterWidth = 0;
    this.thumbTotalWidth = 0;
    this.translateX = 0;
    this.thumbClickable = false;
    this.core = instance;
    this.$LG = $LG;
    return this;
  }
  init() {
    this.settings = __spreadValues(__spreadValues({}, thumbnailsSettings), this.core.settings);
    this.thumbOuterWidth = 0;
    this.thumbTotalWidth = this.core.galleryItems.length * (this.settings.thumbWidth + this.settings.thumbMargin);
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
      const { index } = event.detail;
      this.animateThumb(index);
    });
    this.core.LGel.on(`${lGEvents.beforeOpen}.thumb`, () => {
      this.thumbOuterWidth = this.core.outer.get().offsetWidth;
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
    this.setThumbItemHtml(
      this.core.galleryItems
    );
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
      }
    });
  }
  // Rebuild thumbnails
  rebuildThumbnails() {
    this.$thumbOuter.addClass("lg-rebuilding-thumbnails");
    setTimeout(() => {
      this.thumbTotalWidth = this.core.galleryItems.length * (this.settings.thumbWidth + this.settings.thumbMargin);
      this.$lgThumb.css("width", this.thumbTotalWidth + "px");
      this.$lgThumb.empty();
      this.setThumbItemHtml(
        this.core.galleryItems
      );
      this.animateThumb(this.core.index);
    }, 50);
    setTimeout(() => {
      this.$thumbOuter.removeClass("lg-rebuilding-thumbnails");
    }, 200);
  }
  // @ts-check
  setTranslate(value) {
    this.$lgThumb.css(
      "transform",
      "translate3d(-" + value + "px, 0px, 0px)"
    );
  }
  getPossibleTransformX(left) {
    if (left > this.thumbTotalWidth - this.thumbOuterWidth) {
      left = this.thumbTotalWidth - this.thumbOuterWidth;
    }
    if (left < 0) {
      left = 0;
    }
    return left;
  }
  animateThumb(index) {
    this.$lgThumb.css(
      "transition-duration",
      this.core.settings.speed + "ms"
    );
    if (this.settings.animateThumb) {
      let position = 0;
      switch (this.settings.currentPagerPosition) {
        case "left":
          position = 0;
          break;
        case "middle":
          position = this.thumbOuterWidth / 2 - this.settings.thumbWidth / 2;
          break;
        case "right":
          position = this.thumbOuterWidth - this.settings.thumbWidth;
      }
      this.translateX = (this.settings.thumbWidth + this.settings.thumbMargin) * index - 1 - position;
      if (this.translateX > this.thumbTotalWidth - this.thumbOuterWidth) {
        this.translateX = this.thumbTotalWidth - this.thumbOuterWidth;
      }
      if (this.translateX < 0) {
        this.translateX = 0;
      }
      this.setTranslate(this.translateX);
    }
  }
  onThumbTouchMove(thumbDragUtils) {
    thumbDragUtils.newTranslateX = this.translateX;
    thumbDragUtils.isMoved = true;
    thumbDragUtils.touchMoveTime = (/* @__PURE__ */ new Date()).valueOf();
    thumbDragUtils.newTranslateX -= thumbDragUtils.cords.endX - thumbDragUtils.cords.startX;
    thumbDragUtils.newTranslateX = this.getPossibleTransformX(
      thumbDragUtils.newTranslateX
    );
    this.setTranslate(thumbDragUtils.newTranslateX);
    this.$thumbOuter.addClass("lg-dragging");
    return thumbDragUtils;
  }
  onThumbTouchEnd(thumbDragUtils) {
    thumbDragUtils.isMoved = false;
    thumbDragUtils.endTime = /* @__PURE__ */ new Date();
    this.$thumbOuter.removeClass("lg-dragging");
    const touchDuration = thumbDragUtils.endTime.valueOf() - thumbDragUtils.startTime.valueOf();
    let distanceXnew = thumbDragUtils.cords.endX - thumbDragUtils.cords.startX;
    let speedX = Math.abs(distanceXnew) / touchDuration;
    if (speedX > 0.15 && thumbDragUtils.endTime.valueOf() - thumbDragUtils.touchMoveTime < 30) {
      speedX += 1;
      if (speedX > 2) {
        speedX += 1;
      }
      speedX = speedX + speedX * (Math.abs(distanceXnew) / this.thumbOuterWidth);
      this.$lgThumb.css(
        "transition-duration",
        Math.min(speedX - 1, 2) + "settings"
      );
      distanceXnew = distanceXnew * speedX;
      this.translateX = this.getPossibleTransformX(
        this.translateX - distanceXnew
      );
      this.setTranslate(this.translateX);
    } else {
      this.translateX = thumbDragUtils.newTranslateX;
    }
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
    div.style.cssText = `width: ${this.settings.thumbWidth}px; height: ${this.settings.thumbHeight}; margin-right: ${this.settings.thumbMargin}px;`;
    const img = document.createElement("img");
    img.alt = alt || "";
    img.setAttribute("data-lg-item-id", index + "");
    img.src = thumbImg;
    div.appendChild(img);
    return div;
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
        const $thumb = this.core.outer.find(".lg-thumb-item");
        const { index } = event.detail;
        $thumb.removeClass("active");
        $thumb.eq(index).addClass("active");
      }
    );
  }
  // Toggle thumbnail bar
  toggleThumbBar() {
    if (this.settings.toggleThumb) {
      this.core.outer.addClass("lg-can-toggle");
      this.core.$toolbar.append(
        '<button type="button" aria-label="' + this.settings.thumbnailPluginStrings["toggleThumbnails"] + '" class="lg-toggle-thumb lg-icon"></button>'
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
