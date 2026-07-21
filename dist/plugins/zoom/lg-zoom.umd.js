(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.lgZoom = factory());
})(this, function() {
  "use strict";/*!
 * lightgallery | 2.9.0 | July 21st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

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
    enableZoomAfter: 300,
    zoomPluginStrings: {
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      viewActualSize: "View actual size"
    }
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
      let zoomIcons = this.settings.showZoomInOutIcons ? `<button id="${this.core.getIdName(
        "lg-zoom-in"
      )}" type="button" aria-label="${this.settings.zoomPluginStrings["zoomIn"]}" class="lg-zoom-in lg-icon"></button><button id="${this.core.getIdName(
        "lg-zoom-out"
      )}" type="button" aria-label="${this.settings.zoomPluginStrings["zoomOut"]}" class="lg-zoom-out lg-icon"></button>` : "";
      if (this.settings.actualSize) {
        zoomIcons += `<button id="${this.core.getIdName(
          "lg-actual-size"
        )}" type="button" aria-label="${this.settings.zoomPluginStrings["viewActualSize"]}" class="${this.settings.actualSizeIcons.zoomIn} lg-icon"></button>`;
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
        height = $image.offsetHeight * scale;
        width = $image.offsetWidth * scale;
      } else if (scaleDiff) {
        height = rect.height + scaleDiff * rect.height;
        width = rect.width + scaleDiff * rect.width;
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
      const dragAllowedAxises = this.getDragAllowedAxises(0, scaleDiff);
      const { allowY, allowX } = dragAllowedAxises;
      if (this.positionChanged) {
        originalX = this.left / (this.scale - scaleDiff);
        originalY = this.top / (this.scale - scaleDiff);
        this.pageX = offsetX - originalX;
        this.pageY = offsetY - originalY;
        this.positionChanged = false;
      }
      const possibleSwipeCords = this.getPossibleSwipeDragCords(scaleDiff);
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
        if (allowX) {
          if (this.isBeyondPossibleLeft(x, possibleSwipeCords.minX)) {
            x = possibleSwipeCords.minX;
          } else if (this.isBeyondPossibleRight(x, possibleSwipeCords.maxX)) {
            x = possibleSwipeCords.maxX;
          }
        } else {
          if (scale > 1) {
            if (x < possibleSwipeCords.minX) {
              x = possibleSwipeCords.minX;
            } else if (x > possibleSwipeCords.maxX) {
              x = possibleSwipeCords.maxX;
            }
          }
        }
        if (allowY) {
          if (this.isBeyondPossibleTop(y, possibleSwipeCords.minY)) {
            y = possibleSwipeCords.minY;
          } else if (this.isBeyondPossibleBottom(y, possibleSwipeCords.maxY)) {
            y = possibleSwipeCords.maxY;
          }
        } else {
          if (scale > 1) {
            if (y < possibleSwipeCords.minY) {
              y = possibleSwipeCords.minY;
            } else if (y > possibleSwipeCords.maxY) {
              y = possibleSwipeCords.maxY;
            }
          }
        }
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
    setZoomImageSize() {
      const $image = this.core.getSlideItem(this.core.index).find(".lg-image").first();
      setTimeout(() => {
        const actualSizeScale = this.getCurrentImageActualSizeScale();
        if (this.scale >= actualSizeScale) {
          $image.addClass("no-transition");
          this.imageReset = true;
        }
      }, ZOOM_TRANSITION_DURATION);
      setTimeout(() => {
        const actualSizeScale = this.getCurrentImageActualSizeScale();
        if (this.scale >= actualSizeScale) {
          const dragAllowedAxises = this.getDragAllowedAxises(this.scale);
          $image.css(
            "width",
            $image.get().naturalWidth + "px"
          ).css(
            "height",
            $image.get().naturalHeight + "px"
          );
          this.core.outer.addClass("lg-actual-size");
          if (dragAllowedAxises.allowX && dragAllowedAxises.allowY) {
            $image.addClass("reset-transition");
          } else if (dragAllowedAxises.allowX && !dragAllowedAxises.allowY) {
            $image.addClass("reset-transition-x");
          } else if (!dragAllowedAxises.allowX && dragAllowedAxises.allowY) {
            $image.addClass("reset-transition-y");
          }
        }
      }, ZOOM_TRANSITION_DURATION + 50);
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
      const naturalWidth = this.core.galleryItems[index].width;
      return naturalWidth ? parseFloat(naturalWidth) : $image.get().naturalWidth;
    }
    getActualSizeScale(naturalWidth, width) {
      let _scale;
      let scale;
      if (naturalWidth >= width) {
        _scale = naturalWidth / width;
        scale = _scale || 2;
      } else {
        scale = 1;
      }
      return scale;
    }
    getCurrentImageActualSizeScale() {
      const $image = this.core.getSlideItem(this.core.index).find(".lg-image").first();
      const width = $image.get().offsetWidth;
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
    getTouchDistance(e) {
      return Math.sqrt(
        (e.touches[0].pageX - e.touches[1].pageX) * (e.touches[0].pageX - e.touches[1].pageX) + (e.touches[0].pageY - e.touches[1].pageY) * (e.touches[0].pageY - e.touches[1].pageY)
      );
    }
    pinchZoom() {
      let startDist = 0;
      let pinchStarted = false;
      let initScale = 1;
      let prevScale = 0;
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
          initScale = this.scale || 1;
          this.core.outer.removeClass(
            "lg-zoom-drag-transition lg-zoom-dragging"
          );
          this.setPageCords(e);
          this.resetImageTranslate(this.core.index);
          this.core.touchAction = "pinch";
          startDist = this.getTouchDistance(e);
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
            prevScale = this.scale;
            const _scale = Math.max(1, initScale + -distance * 0.02);
            this.scale = Math.round((_scale + Number.EPSILON) * 100) / 100;
            const diff = this.scale - prevScale;
            this.zoomImage(
              this.scale,
              Math.round((diff + Number.EPSILON) * 100) / 100,
              false,
              false
            );
          }
        }
      });
      this.core.$inner.on("touchend.lg", (e) => {
        if (this.core.touchAction === "pinch" && (this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target))) {
          pinchStarted = false;
          startDist = 0;
          if (this.scale <= 1) {
            this.resetZoom();
          } else {
            const actualSizeScale = this.getCurrentImageActualSizeScale();
            if (this.scale >= actualSizeScale) {
              let scaleDiff = actualSizeScale - this.scale;
              if (scaleDiff === 0) {
                scaleDiff = 0.01;
              }
              this.zoomImage(actualSizeScale, scaleDiff, false, true);
            }
            this.manageActualPixelClassNames();
            this.core.outer.addClass("lg-zoomed");
          }
          this.core.touchAction = void 0;
        }
      });
    }
    touchendZoom(startCoords, endCoords, allowX, allowY, touchDuration) {
      let distanceXnew = endCoords.x - startCoords.x;
      let distanceYnew = endCoords.y - startCoords.y;
      let speedX = Math.abs(distanceXnew) / touchDuration + 1;
      let speedY = Math.abs(distanceYnew) / touchDuration + 1;
      if (speedX > 2) {
        speedX += 1;
      }
      if (speedY > 2) {
        speedY += 1;
      }
      distanceXnew = distanceXnew * speedX;
      distanceYnew = distanceYnew * speedY;
      const _LGel = this.core.getSlideItem(this.core.index).find(".lg-img-wrap").first();
      const distance = {};
      distance.x = this.left + distanceXnew;
      distance.y = this.top + distanceYnew;
      const possibleSwipeCords = this.getPossibleSwipeDragCords();
      if (Math.abs(distanceXnew) > 15 || Math.abs(distanceYnew) > 15) {
        if (allowY) {
          if (this.isBeyondPossibleTop(
            distance.y,
            possibleSwipeCords.minY
          )) {
            distance.y = possibleSwipeCords.minY;
          } else if (this.isBeyondPossibleBottom(
            distance.y,
            possibleSwipeCords.maxY
          )) {
            distance.y = possibleSwipeCords.maxY;
          }
        }
        if (allowX) {
          if (this.isBeyondPossibleLeft(
            distance.x,
            possibleSwipeCords.minX
          )) {
            distance.x = possibleSwipeCords.minX;
          } else if (this.isBeyondPossibleRight(
            distance.x,
            possibleSwipeCords.maxX
          )) {
            distance.x = possibleSwipeCords.maxX;
          }
        }
        if (allowY) {
          this.top = distance.y;
        } else {
          distance.y = this.top;
        }
        if (allowX) {
          this.left = distance.x;
        } else {
          distance.x = this.left;
        }
        this.setZoomSwipeStyles(_LGel, distance);
        this.positionChanged = true;
      }
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
      const { bottom } = this.core.mediaContainerPosition;
      const imgRect = $image.get().getBoundingClientRect();
      let imageHeight = imgRect.height;
      let imageWidth = imgRect.width;
      if (scale) {
        imageHeight = imageHeight + scale * imageHeight;
        imageWidth = imageWidth + scale * imageWidth;
      }
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
      let startTime = /* @__PURE__ */ new Date();
      let endTime = /* @__PURE__ */ new Date();
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
          startTime = /* @__PURE__ */ new Date();
          this.core.touchAction = "zoomSwipe";
          _LGel = this.core.getSlideItem(this.core.index).find(".lg-img-wrap").first();
          const dragAllowedAxises = this.getDragAllowedAxises(0);
          allowY = dragAllowedAxises.allowY;
          allowX = dragAllowedAxises.allowX;
          if (allowX || allowY) {
            startCoords = this.getSwipeCords(e);
          }
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
            return;
          }
          isMoved = false;
          endTime = /* @__PURE__ */ new Date();
          const touchDuration = endTime.valueOf() - startTime.valueOf();
          this.touchendZoom(
            startCoords,
            endCoords,
            allowX,
            allowY,
            touchDuration
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
      let startTime;
      let endTime;
      let possibleSwipeCords;
      let _LGel;
      this.core.outer.on("mousedown.lg.zoom", (e) => {
        if (!this.isImageSlide(this.core.index)) {
          return;
        }
        const $item = this.core.getSlideItem(this.core.index);
        if (this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target)) {
          startTime = /* @__PURE__ */ new Date();
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
          endTime = /* @__PURE__ */ new Date();
          isDragging = false;
          this.core.outer.removeClass("lg-zoom-dragging");
          if (isMoved && (startCoords.x !== endCoords.x || startCoords.y !== endCoords.y)) {
            endCoords = this.getDragCords(e);
            const touchDuration = endTime.valueOf() - startTime.valueOf();
            this.touchendZoom(
              startCoords,
              endCoords,
              allowX,
              allowY,
              touchDuration
            );
          }
          isMoved = false;
        }
        this.core.outer.removeClass("lg-grabbing").addClass("lg-grab");
      });
    }
    closeGallery() {
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
  return Zoom;
});
//# sourceMappingURL=lg-zoom.umd.js.map
