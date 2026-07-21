/*!
 * lightgallery | 2.9.0 | July 21st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
const shareSettings = {
  share: true,
  facebook: true,
  facebookDropdownText: "Facebook",
  twitter: true,
  twitterDropdownText: "Twitter",
  pinterest: true,
  pinterestDropdownText: "Pinterest",
  additionalShareOptions: [],
  sharePluginStrings: { share: "Share" }
};
function getFacebookShareLink(galleryItem) {
  const facebookBaseUrl = "//www.facebook.com/sharer/sharer.php?u=";
  return facebookBaseUrl + encodeURIComponent(galleryItem.facebookShareUrl || window.location.href);
}
function getTwitterShareLink(galleryItem) {
  const twitterBaseUrl = "//twitter.com/intent/tweet?text=";
  const url = encodeURIComponent(
    galleryItem.twitterShareUrl || window.location.href
  );
  const text = galleryItem.tweetText;
  return twitterBaseUrl + text + "&url=" + url;
}
function getPinterestShareLink(galleryItem) {
  const pinterestBaseUrl = "http://www.pinterest.com/pin/create/button/?url=";
  const description = galleryItem.pinterestText;
  const media = encodeURIComponent(galleryItem.src);
  const url = encodeURIComponent(
    galleryItem.pinterestShareUrl || window.location.href
  );
  return pinterestBaseUrl + url + "&media=" + media + "&description=" + description;
}
const lGEvents = {
  afterSlide: "lgAfterSlide"
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
class Share {
  constructor(instance) {
    this.shareOptions = [];
    this.core = instance;
    this.settings = __spreadValues(__spreadValues({}, shareSettings), this.core.settings);
    return this;
  }
  init() {
    if (!this.settings.share) {
      return;
    }
    this.shareOptions = [
      ...this.getDefaultShareOptions(),
      ...this.settings.additionalShareOptions
    ];
    this.setLgShareMarkup();
    this.core.outer.find(".lg-share .lg-dropdown").append(this.getShareListHtml());
    this.core.LGel.on(
      `${lGEvents.afterSlide}.share`,
      this.onAfterSlide.bind(this)
    );
  }
  getShareListHtml() {
    let shareHtml = "";
    this.shareOptions.forEach((shareOption) => {
      shareHtml += shareOption.dropdownHTML;
    });
    return shareHtml;
  }
  setLgShareMarkup() {
    this.core.$toolbar.append(
      `<button type="button" aria-label="${this.settings.sharePluginStrings["share"]}" aria-haspopup="true" aria-expanded="false" class="lg-share lg-icon">
                <ul class="lg-dropdown" style="position: absolute;"></ul></button>`
    );
    this.core.outer.append('<div class="lg-dropdown-overlay"></div>');
    const $shareButton = this.core.outer.find(".lg-share");
    $shareButton.first().on("click.lg", () => {
      this.core.outer.toggleClass("lg-dropdown-active");
      if (this.core.outer.hasClass("lg-dropdown-active")) {
        this.core.outer.attr("aria-expanded", true);
      } else {
        this.core.outer.attr("aria-expanded", false);
      }
    });
    this.core.outer.find(".lg-dropdown-overlay").first().on("click.lg", () => {
      this.core.outer.removeClass("lg-dropdown-active");
      this.core.outer.attr("aria-expanded", false);
    });
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
    this.core.outer.find(".lg-dropdown-overlay").remove();
    this.core.outer.find(".lg-share").remove();
    this.core.LGel.off(".lg.share");
    this.core.LGel.off(".share");
  }
}
export {
  Share as default
};
//# sourceMappingURL=lg-share.es5.js.map
