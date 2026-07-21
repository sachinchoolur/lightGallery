(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.lgHash = factory());
})(this, function() {
  "use strict";/*!
 * lightgallery | 2.9.0 | July 21st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

  const lGEvents = {
    afterSlide: "lgAfterSlide",
    afterClose: "lgAfterClose"
  };
  const hashSettings = {
    hash: true,
    galleryId: "1",
    customSlideName: false
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
  class Hash {
    constructor(instance, $LG) {
      this.core = instance;
      this.$LG = $LG;
      this.settings = __spreadValues(__spreadValues({}, hashSettings), this.core.settings);
      return this;
    }
    init() {
      if (!this.settings.hash) {
        return;
      }
      this.oldHash = window.location.hash;
      setTimeout(() => {
        this.buildFromHash();
      }, 100);
      this.core.LGel.on(
        `${lGEvents.afterSlide}.hash`,
        this.onAfterSlide.bind(this)
      );
      this.core.LGel.on(
        `${lGEvents.afterClose}.hash`,
        this.onCloseAfter.bind(this)
      );
      this.$LG(window).on(
        `hashchange.lg.hash.global${this.core.lgId}`,
        this.onHashchange.bind(this)
      );
    }
    onAfterSlide(event) {
      let slideName = this.core.galleryItems[event.detail.index].slideName;
      slideName = this.settings.customSlideName ? slideName || event.detail.index : event.detail.index;
      if (history.replaceState) {
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search + "#lg=" + this.settings.galleryId + "&slide=" + slideName
        );
      } else {
        window.location.hash = "lg=" + this.settings.galleryId + "&slide=" + slideName;
      }
    }
    /**
     * Get index of the slide from custom slideName. Has to be a public method. Used in hash plugin
     * @param {String} hash
     * @returns {Number} Index of the slide.
     */
    getIndexFromUrl(hash = window.location.hash) {
      const slideName = hash.split("&slide=")[1];
      let _idx = 0;
      if (this.settings.customSlideName) {
        for (let index = 0; index < this.core.galleryItems.length; index++) {
          const dynamicEl = this.core.galleryItems[index];
          if (dynamicEl.slideName === slideName) {
            _idx = index;
            break;
          }
        }
      } else {
        _idx = parseInt(slideName, 10);
      }
      return isNaN(_idx) ? 0 : _idx;
    }
    // Build Gallery if gallery id exist in the URL
    buildFromHash() {
      const _hash = window.location.hash;
      if (_hash.indexOf("lg=" + this.settings.galleryId) > 0) {
        this.$LG(document.body).addClass("lg-from-hash");
        const index = this.getIndexFromUrl(_hash);
        this.core.openGallery(index);
        return true;
      }
    }
    onCloseAfter() {
      if (this.oldHash && this.oldHash.indexOf("lg=" + this.settings.galleryId) < 0) {
        if (history.replaceState) {
          history.replaceState(null, "", this.oldHash);
        } else {
          window.location.hash = this.oldHash;
        }
      } else {
        if (history.replaceState) {
          history.replaceState(
            null,
            document.title,
            window.location.pathname + window.location.search
          );
        } else {
          window.location.hash = "";
        }
      }
    }
    onHashchange() {
      if (!this.core.lgOpened) return;
      const _hash = window.location.hash;
      const index = this.getIndexFromUrl(_hash);
      if (_hash.indexOf("lg=" + this.settings.galleryId) > -1) {
        this.core.slide(index, false, false);
      } else if (this.core.lGalleryOn) {
        this.core.closeGallery();
      }
    }
    closeGallery() {
      if (this.settings.hash) {
        this.$LG(document.body).removeClass("lg-from-hash");
      }
    }
    destroy() {
      this.core.LGel.off(".lg.hash");
      this.core.LGel.off(".hash");
      this.$LG(window).off(`hashchange.lg.hash.global${this.core.lgId}`);
    }
  }
  return Hash;
});
//# sourceMappingURL=lg-hash.umd.js.map
