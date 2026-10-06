/*!
 * lightgallery | 3.0.0-beta.4 | October 6th 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
const shareDefaultIcons = {
  share: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M768 252.667c68 0 124-56 124-124s-56-126-124-126-124 58-124 126c0 10 0 20 2 28l-302 176c-24-22-54-34-88-34-70 0-128 58-128 128s58 128 128 128c34 0 64-12 88-34l300 174c-2 10-4 20-4 30 0 70 58 128 128 128s128-58 128-128-58-128-128-128c-34 0-64 14-88 36l-300-176c2-10 4-20 4-30s-2-20-4-30l304-176c22 20 52 32 84 32z"/></svg>',
  shareFacebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M512 952.32c-271.462 0-491.52-220.058-491.52-491.52s220.058-491.52 491.52-491.52 491.52 220.058 491.52 491.52-220.058 491.52-491.52 491.52zM628.429 612.659h-73.882c-8.755 0-18.483-11.52-18.483-26.829v-53.35h92.416l-13.978-76.083h-78.438v-228.403h-87.194v228.403h-79.104v76.083h79.104v44.749c0 64.205 44.544 116.378 105.677 116.378h73.882v-80.947z"/></svg>',
  shareX: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><circle cx="512" cy="512" r="491.52"/><path fill="#fff" transform="translate(227 224) scale(24)" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  sharePinterest: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M512 952.32c-271.462 0-491.52-220.058-491.52-491.52s220.058-491.52 491.52-491.52 491.52 220.058 491.52 491.52-220.058 491.52-491.52 491.52zM545.638 344.32c-31.539 2.406-44.749 18.022-69.427 32.973-13.568-71.219-30.157-139.52-79.309-175.206-15.206 107.725 22.221 188.518 39.629 274.381-29.645 49.92 3.533 150.323 66.099 125.645 76.954-30.515-66.662-185.6 29.747-205.005 100.659-20.173 141.773 174.694 79.36 237.978-90.214 91.494-262.502 2.099-241.306-128.87 5.12-32 38.246-41.728 13.21-85.914-57.702 12.8-74.957 58.317-72.704 118.989 3.533 99.328 89.242 168.909 175.155 178.483 108.698 12.083 210.688-39.885 224.819-142.182 15.821-115.405-49.101-240.282-165.274-231.27z"/></svg>'
};
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
function getFacebookShareLink$1(item, currentUrl) {
  return "//www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(item.facebookShareUrl || currentUrl);
}
function getXShareLink(item, currentUrl) {
  var _a;
  const url = encodeURIComponent(item.twitterShareUrl || currentUrl);
  const text = encodeURIComponent((_a = item.tweetText) != null ? _a : "");
  return `//x.com/intent/post?text=${text}&url=${url}`;
}
function getPinterestShareLink$1(item, currentUrl) {
  var _a, _b;
  const media = encodeURIComponent((_a = item.src) != null ? _a : "");
  const url = encodeURIComponent(item.pinterestShareUrl || currentUrl);
  const description = (_b = item.pinterestText) != null ? _b : "";
  return `//www.pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`;
}
function getSharePayload(item, currentUrl) {
  const payload = {
    url: item.shareUrl || item.twitterShareUrl || item.facebookShareUrl || currentUrl
  };
  const title = item.title || item.alt;
  if (title) {
    payload.title = title;
  }
  const text = item.tweetText || item.pinterestText;
  if (text) {
    payload.text = text;
  }
  return payload;
}
function canNativeShare(nav, payload) {
  if (!nav || typeof nav.share !== "function") {
    return false;
  }
  if (typeof nav.canShare === "function") {
    return nav.canShare(payload);
  }
  return true;
}
const shareSettings = {
  share: true,
  facebook: true,
  facebookDropdownText: "Facebook",
  twitter: true,
  twitterDropdownText: "X",
  pinterest: true,
  pinterestDropdownText: "Pinterest",
  additionalShareOptions: []
};
function getFacebookShareLink(galleryItem) {
  return getFacebookShareLink$1(galleryItem, window.location.href);
}
function getTwitterShareLink(galleryItem) {
  return getXShareLink(galleryItem, window.location.href);
}
function getPinterestShareLink(galleryItem) {
  return getPinterestShareLink$1(galleryItem, window.location.href);
}
const lGEvents = {
  afterSlide: "lgAfterSlide",
  beforeClose: "lgBeforeClose"
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
function isTouchDevice() {
  return typeof window !== "undefined" && (navigator.maxTouchPoints > 0 || "ontouchstart" in window);
}
class Share {
  constructor(instance) {
    this.shareOptions = [];
    this.listening = false;
    this.onDocumentPointerDown = (event) => {
      const target = event.target;
      const shareOuter = this.core.outer.find(".lg-share-outer").get();
      if (target && shareOuter && shareOuter.contains(target)) {
        return;
      }
      consumeBackdropPress(event);
      this.setDropdownOpen(false);
    };
    this.onDocumentKeydown = (event) => {
      var _a;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        this.setDropdownOpen(false);
        (_a = this.core.outer.find(".lg-share").get()) == null ? void 0 : _a.focus();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const shareOuter = this.core.outer.find(".lg-share-outer").get();
      const focusable = shareOuter ? Array.from(
        shareOuter.querySelectorAll("button, a[href]")
      ) : [];
      const index = focusable.indexOf(document.activeElement);
      if (index !== -1 && (event.shiftKey ? index === 0 : index === focusable.length - 1)) {
        this.setDropdownOpen(false);
      }
    };
    this.core = instance;
    this.settings = __spreadValues(__spreadValues({}, shareSettings), this.core.settings);
    return this;
  }
  init() {
    this.core.registerDefaultIcons(shareDefaultIcons);
    if (!this.settings.share) {
      return;
    }
    this.shareOptions = [
      ...this.getDefaultShareOptions(),
      ...this.settings.additionalShareOptions
    ];
    this.setLgShareMarkup();
    this.core.outer.find(".lg-share-outer .lg-dropdown").append(this.getShareListHtml());
    this.core.LGel.on(
      `${lGEvents.afterSlide}.share`,
      this.onAfterSlide.bind(this)
    );
    this.core.LGel.on(`${lGEvents.beforeClose}.share`, () => {
      this.setDropdownOpen(false);
    });
  }
  getShareListHtml() {
    let shareHtml = "";
    this.shareOptions.forEach((shareOption) => {
      shareHtml += shareOption.dropdownHTML;
    });
    return shareHtml;
  }
  /**
   * True when the button should try the OS share sheet first. The
   * dropdown stays rendered as the automatic fallback (a `canShare`
   * veto or share failure at click time falls back to the menu).
   */
  prefersNativeShare() {
    var _a;
    const preferNative = (_a = this.settings.preferNativeShare) != null ? _a : isTouchDevice();
    return preferNative && typeof navigator !== "undefined" && typeof navigator.share === "function";
  }
  setLgShareMarkup() {
    var _a, _b;
    const popupAttrs = this.prefersNativeShare() ? "" : 'aria-haspopup="true" aria-expanded="false"';
    this.core.$toolbar.append(
      `<div class="lg-share-outer"><button type="button" aria-label="${(_b = (_a = this.settings.sharePluginStrings) == null ? void 0 : _a.share) != null ? _b : this.core.settings.strings.share}" ${popupAttrs} class="lg-share lg-icon"></button>
                <ul class="lg-dropdown" style="position: absolute;"></ul></div>`
    );
    const $shareButton = this.core.outer.find(".lg-share");
    $shareButton.first().on("click.lg", () => {
      if (this.prefersNativeShare()) {
        const payload = getSharePayload(
          this.core.galleryItems[this.core.index],
          window.location.href
        );
        if (canNativeShare(navigator, payload)) {
          navigator.share(payload).catch(() => void 0);
          return;
        }
      }
      this.setDropdownOpen(
        !this.core.outer.hasClass("lg-dropdown-active")
      );
    });
  }
  /**
   * Open state lives on the outer element, which outlives a close, so an
   * open dropdown would still be open on the next open. While open, the
   * dropdown dismisses like the More options menu: on a press anywhere
   * outside it, on Escape (the gallery stays open) and when focus tabs
   * out of it.
   */
  setDropdownOpen(open) {
    if (open) {
      this.core.outer.addClass("lg-dropdown-active");
    } else {
      this.core.outer.removeClass("lg-dropdown-active");
    }
    this.core.outer.find(".lg-share").first().attr("aria-expanded", open ? "true" : "false");
    this.listenOutside(open);
  }
  listenOutside(on) {
    if (on === this.listening) {
      return;
    }
    this.listening = on;
    if (on) {
      document.addEventListener(
        "pointerdown",
        this.onDocumentPointerDown,
        true
      );
      document.addEventListener("keydown", this.onDocumentKeydown, true);
    } else {
      document.removeEventListener(
        "pointerdown",
        this.onDocumentPointerDown,
        true
      );
      document.removeEventListener(
        "keydown",
        this.onDocumentKeydown,
        true
      );
    }
  }
  onAfterSlide(event) {
    const { index } = event.detail;
    const currentItem = this.core.galleryItems[index];
    setTimeout(() => {
      this.shareOptions.forEach((shareOption) => {
        const selector = shareOption.selector;
        this.core.outer.find(selector).attr("href", shareOption.generateLink(currentItem));
      });
    }, 100);
  }
  getShareListItemHTML(type, text) {
    return `<li><a class="lg-share-${type}" rel="noopener" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">${text}</span></a></li>`;
  }
  getDefaultShareOptions() {
    return [
      ...this.settings.facebook ? [
        {
          type: "facebook",
          generateLink: getFacebookShareLink,
          dropdownHTML: this.getShareListItemHTML(
            "facebook",
            this.settings.facebookDropdownText
          ),
          selector: ".lg-share-facebook"
        }
      ] : [],
      ...this.settings.twitter ? [
        {
          type: "twitter",
          generateLink: getTwitterShareLink,
          dropdownHTML: this.getShareListItemHTML(
            "twitter",
            this.settings.twitterDropdownText
          ),
          selector: ".lg-share-twitter"
        }
      ] : [],
      ...this.settings.pinterest ? [
        {
          type: "pinterest",
          generateLink: getPinterestShareLink,
          dropdownHTML: this.getShareListItemHTML(
            "pinterest",
            this.settings.pinterestDropdownText
          ),
          selector: ".lg-share-pinterest"
        }
      ] : []
    ];
  }
  destroy() {
    this.listenOutside(false);
    this.core.outer.find(".lg-share-outer").remove();
    this.core.LGel.off(".lg.share");
    this.core.LGel.off(".share");
  }
}
export {
  Share as default
};
//# sourceMappingURL=lg-share.es5.js.map
