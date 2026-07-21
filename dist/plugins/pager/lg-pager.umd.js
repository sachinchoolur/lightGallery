(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.lgPager = factory());
})(this, function() {
  "use strict";/*!
 * lightgallery | 2.9.0 | July 21st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

  const lGEvents = {
    updateSlides: "lgUpdateSlides",
    beforeSlide: "lgBeforeSlide"
  };
  const pagerSettings = {
    pager: true
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
  class Pager {
    constructor(instance, $LG) {
      this.core = instance;
      this.$LG = $LG;
      this.settings = __spreadValues(__spreadValues({}, pagerSettings), this.core.settings);
      return this;
    }
    getPagerHtml(items) {
      let pagerList = "";
      for (let i = 0; i < items.length; i++) {
        pagerList += `<span  data-lg-item-id="${i}" class="lg-pager-cont"> 
                    <span data-lg-item-id="${i}" class="lg-pager"></span>
                    <div class="lg-pager-thumb-cont"><span class="lg-caret"></span> <img src="${items[i].thumb}" /></div>
                    </span>`;
      }
      return pagerList;
    }
    init() {
      if (!this.settings.pager) {
        return;
      }
      let timeout;
      this.core.$lgComponents.prepend('<div class="lg-pager-outer"></div>');
      const $pagerOuter = this.core.outer.find(".lg-pager-outer");
      $pagerOuter.html(this.getPagerHtml(this.core.galleryItems));
      $pagerOuter.first().on("click.lg touchend.lg", (event) => {
        const $target = this.$LG(event.target);
        if (!$target.hasAttribute("data-lg-item-id")) {
          return;
        }
        const index = parseInt($target.attr("data-lg-item-id"));
        this.core.slide(index, false, true, false);
      });
      $pagerOuter.first().on("mouseover.lg", () => {
        clearTimeout(timeout);
        $pagerOuter.addClass("lg-pager-hover");
      });
      $pagerOuter.first().on("mouseout.lg", () => {
        timeout = setTimeout(() => {
          $pagerOuter.removeClass("lg-pager-hover");
        });
      });
      this.core.LGel.on(`${lGEvents.beforeSlide}.pager`, (event) => {
        const { index } = event.detail;
        this.manageActiveClass.call(this, index);
      });
      this.core.LGel.on(`${lGEvents.updateSlides}.pager`, () => {
        $pagerOuter.empty();
        $pagerOuter.html(this.getPagerHtml(this.core.galleryItems));
        this.manageActiveClass(this.core.index);
      });
    }
    manageActiveClass(index) {
      const $pagerCont = this.core.outer.find(".lg-pager-cont");
      $pagerCont.removeClass("lg-pager-active");
      $pagerCont.eq(index).addClass("lg-pager-active");
    }
    destroy() {
      this.core.outer.find(".lg-pager-outer").remove();
      this.core.LGel.off(".lg.pager");
      this.core.LGel.off(".pager");
    }
  }
  return Pager;
});
//# sourceMappingURL=lg-pager.umd.js.map
