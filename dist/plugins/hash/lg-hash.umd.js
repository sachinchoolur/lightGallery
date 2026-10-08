(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.lgHash = factory());
})(this, function() {
  "use strict";/*!
 * lightgallery | 3.0.0-beta.5 | October 8th 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

  function createHistoryHashDriver(win) {
    return {
      kind: "history",
      getHash: () => win.location.hash || "",
      replaceHash: (hash) => win.history.replaceState(
        null,
        "",
        win.location.pathname + win.location.search + hash
      ),
      clearHash: () => win.history.replaceState(
        null,
        "",
        win.location.pathname + win.location.search
      ),
      subscribe: (onChange) => {
        win.addEventListener("hashchange", onChange);
        return () => win.removeEventListener("hashchange", onChange);
      }
    };
  }
  function settleNavigateResult(result) {
    var _a, _b, _c, _d;
    const promises = result;
    (_b = (_a = promises == null ? void 0 : promises.committed) == null ? void 0 : _a.catch) == null ? void 0 : _b.call(_a, () => void 0);
    (_d = (_c = promises == null ? void 0 : promises.finished) == null ? void 0 : _c.catch) == null ? void 0 : _d.call(_c, () => void 0);
  }
  function createNavigationHashDriver(win, navigation) {
    const getHash = () => {
      var _a;
      const url = (_a = navigation.currentEntry) == null ? void 0 : _a.url;
      if (typeof url === "string") {
        const index = url.indexOf("#");
        return index === -1 ? "" : url.slice(index);
      }
      return win.location.hash || "";
    };
    return {
      kind: "navigation",
      getHash,
      replaceHash: (hash) => settleNavigateResult(
        navigation.navigate(
          win.location.pathname + win.location.search + hash,
          { history: "replace", state: { lgHash: hash } }
        )
      ),
      clearHash: () => (
        // Not navigate(): a destination without a fragment is a
        // *cross-document* navigation (the same-document fast path
        // requires the destination to have one), so clearing the hash
        // through it reloads the page every time a gallery closes.
        // replaceState drops the fragment in place, and the entry
        // change still reaches `currententrychange` subscribers.
        win.history.replaceState(
          null,
          "",
          win.location.pathname + win.location.search
        )
      ),
      subscribe: (onChange) => {
        navigation.addEventListener("currententrychange", onChange);
        return () => navigation.removeEventListener("currententrychange", onChange);
      }
    };
  }
  function createHashDriver(win, preference = "auto") {
    const navigation = win.navigation;
    const navigationCapable = !!navigation && typeof navigation.navigate === "function" && typeof navigation.addEventListener === "function" && typeof navigation.removeEventListener === "function";
    if (preference !== "history" && navigationCapable) {
      return createNavigationHashDriver(win, navigation);
    }
    return createHistoryHashDriver(win);
  }
  const lGEvents = {
    afterSlide: "lgAfterSlide",
    afterClose: "lgAfterClose"
  };
  const hashSettings = {
    hash: true,
    hashDriver: "auto",
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
      this.driver = createHashDriver(
        window,
        this.settings.hashDriver
      );
      this.oldHash = this.driver.getHash();
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
      this.unsubscribeDriver = this.driver.subscribe(
        this.onHashchange.bind(this)
      );
    }
    onAfterSlide(event) {
      let slideName = this.core.galleryItems[event.detail.index].slideName;
      slideName = this.settings.customSlideName ? slideName || event.detail.index : event.detail.index;
      this.driver.replaceHash(
        "#lg=" + this.settings.galleryId + "&slide=" + slideName
      );
    }
    /**
     * Get index of the slide from custom slideName. Has to be a public method. Used in hash plugin
     * @param {String} hash
     * @returns {Number} Index of the slide.
     */
    getIndexFromUrl(hash = this.driver.getHash()) {
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
      const _hash = this.driver.getHash();
      if (_hash.indexOf("lg=" + this.settings.galleryId) > 0) {
        this.$LG(document.body).addClass("lg-from-hash");
        const index = this.getIndexFromUrl(_hash);
        this.core.openGallery(index);
        return true;
      }
    }
    onCloseAfter() {
      if (this.oldHash && this.oldHash.indexOf("lg=" + this.settings.galleryId) < 0) {
        this.driver.replaceHash(this.oldHash);
      } else {
        this.driver.clearHash();
      }
    }
    onHashchange() {
      if (!this.core.lgOpened) return;
      const _hash = this.driver.getHash();
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
      var _a;
      this.core.LGel.off(".lg.hash");
      this.core.LGel.off(".hash");
      (_a = this.unsubscribeDriver) == null ? void 0 : _a.call(this);
      this.unsubscribeDriver = void 0;
    }
  }
  return Hash;
});
//# sourceMappingURL=lg-hash.umd.js.map
