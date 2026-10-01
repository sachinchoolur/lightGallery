(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.lgComment = factory());
})(this, function() {
  "use strict";/*!
 * lightgallery | 3.0.0-beta.3 | October 1st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

  const commentDefaultIcons = {
    comment: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M938.667 448.128v21.205c0 0.725-0.043 1.621-0.085 2.475-5.803 99.755-47.488 190.336-112.725 258.176-68.352 71.125-162.731 117.419-268.843 123.264-0.683 0.043-1.536 0.085-2.347 0.085h-20.864c-59.947 0.683-122.965-13.227-181.931-43.008-52.181-26.496-97.749-63.488-133.931-108.16-56.405-69.717-89.899-158.080-89.941-253.696-0.597-54.4 10.795-111.36 35.157-165.419l-75.605-226.859c-2.816-8.363-3.072-17.835 0-26.965 7.467-22.357 31.616-34.432 53.973-26.965l226.731 75.563c49.493-22.485 105.984-35.243 165.376-35.115 58.539 0.384 115.797 13.141 168.149 36.949 81.579 37.163 151.040 101.248 193.749 186.667 27.477 53.291 43.307 115.84 43.136 181.803zM853.333 447.872c0.128-52.267-12.459-101.333-33.664-142.464-34.176-68.352-88.832-118.827-153.259-148.139-41.387-18.859-86.827-28.971-133.376-29.269-52.096-0.128-101.163 12.459-142.293 33.664-10.624 5.504-22.528 6.059-33.067 2.56l-162.261-54.101 54.101 162.261c3.755 11.221 2.56 22.912-2.389 32.725-23.552 46.677-34.304 96.171-33.792 142.421 0.043 76.331 26.411 145.92 70.955 200.917 28.629 35.371 64.768 64.725 106.24 85.76 46.592 23.552 96.085 34.304 142.336 33.792h19.456c83.712-4.565 158.037-41.003 212.011-97.152 51.285-53.376 84.139-124.416 89.003-202.795z"/></svg>',
    commentClose: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="translate(0, 960) scale(1, -1)" d="M810 664.667l-238-238 238-238-60-60-238 238-238-238-60 60 238 238-238 238 60 60 238-238 238 238z"/></svg>'
  };
  const lGEvents = {
    beforeSlide: "lgBeforeSlide",
    afterSlide: "lgAfterSlide"
  };
  const commentSettings = {
    commentBox: false,
    fbComments: false,
    disqusComments: false,
    disqusConfig: {
      title: void 0,
      language: "en"
    },
    commentsMarkup: '<div id="lg-comment-box" class="lg-comment-box lg-fb-comment-box"><div class="lg-comment-header"><h3 class="lg-comment-title">Leave a comment.</h3><span class="lg-comment-close lg-icon"></span></div><div class="lg-comment-body"></div></div>'
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
  class CommentBox {
    constructor(instance, $LG) {
      this.core = instance;
      this.$LG = $LG;
      this.settings = __spreadValues(__spreadValues({}, commentSettings), this.core.settings);
      return this;
    }
    init() {
      this.core.registerDefaultIcons(commentDefaultIcons);
      if (!this.settings.commentBox) {
        return;
      }
      this.setMarkup();
      this.toggleCommentBox();
      if (this.settings.fbComments) {
        this.addFbComments();
      } else if (this.settings.disqusComments) {
        this.addDisqusComments();
      }
    }
    setMarkup() {
      var _a, _b;
      this.core.outer.append(
        this.settings.commentsMarkup + '<div class="lg-comment-overlay"></div>'
      );
      const commentToggleBtn = `<button type="button" aria-label="${(_b = (_a = this.settings.commentPluginStrings) == null ? void 0 : _a.toggleComments) != null ? _b : this.core.settings.strings.toggleComments}" class="lg-comment-toggle lg-icon"></button>`;
      this.core.$toolbar.append(commentToggleBtn);
    }
    toggleCommentBox() {
      this.core.outer.find(".lg-comment-toggle").first().on("click.lg.comment", () => {
        this.core.outer.toggleClass("lg-comment-active");
      });
      this.core.outer.find(".lg-comment-overlay").first().on("click.lg.comment", () => {
        this.core.outer.removeClass("lg-comment-active");
      });
      this.core.outer.find(".lg-comment-close").first().on("click.lg.comment", () => {
        this.core.outer.removeClass("lg-comment-active");
      });
    }
    addFbComments() {
      const _this = this;
      this.core.LGel.on(`${lGEvents.beforeSlide}.comment`, (event) => {
        const html = this.core.galleryItems[event.detail.index].fbHtml;
        this.core.outer.find(".lg-comment-body").html(html);
      });
      this.core.LGel.on(`${lGEvents.afterSlide}.comment`, function() {
        try {
          FB.XFBML.parse();
        } catch (err) {
          _this.$LG(window).on("fbAsyncInit", function() {
            FB.XFBML.parse();
          });
        }
      });
    }
    addDisqusComments() {
      const $disqusThread = this.$LG("#disqus_thread");
      $disqusThread.remove();
      this.core.outer.find(".lg-comment-body").append('<div id="disqus_thread"></div>');
      this.core.LGel.on(`${lGEvents.beforeSlide}.comment`, () => {
        $disqusThread.html("");
      });
      this.core.LGel.on(`${lGEvents.afterSlide}.comment`, (event) => {
        const { index } = event.detail;
        const _this2 = this;
        setTimeout(
          function() {
            try {
              DISQUS.reset({
                reload: true,
                config: function() {
                  this.page.identifier = _this2.core.galleryItems[index].disqusIdentifier;
                  this.page.url = _this2.core.galleryItems[index].disqusUrl;
                  this.page.title = _this2.settings.disqusConfig.title;
                  this.language = _this2.settings.disqusConfig.language;
                }
              });
            } catch (err) {
              console.error(
                "lightGallery: make sure you have included the Disqus JavaScript code in your document. See https://www.lightgalleryjs.com/docs/settings/#comment-box-plugin"
              );
            }
          },
          _this2.core.lGalleryOn ? 0 : 1e3
        );
      });
    }
    destroy() {
      this.core.LGel.off(".lg.comment");
      this.core.LGel.off(".comment");
    }
  }
  return CommentBox;
});
//# sourceMappingURL=lg-comment.umd.js.map
