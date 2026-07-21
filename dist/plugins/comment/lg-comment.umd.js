(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.lgComment = factory());
})(this, function() {
  "use strict";/*!
 * lightgallery | 2.9.0 | July 21st 2026
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

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
    commentsMarkup: '<div id="lg-comment-box" class="lg-comment-box lg-fb-comment-box"><div class="lg-comment-header"><h3 class="lg-comment-title">Leave a comment.</h3><span class="lg-comment-close lg-icon"></span></div><div class="lg-comment-body"></div></div>',
    commentPluginStrings: {
      toggleComments: "Toggle Comments"
    }
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
      this.core.outer.append(
        this.settings.commentsMarkup + '<div class="lg-comment-overlay"></div>'
      );
      const commentToggleBtn = `<button type="button" aria-label="${this.settings.commentPluginStrings["toggleComments"]}" class="lg-comment-toggle lg-icon"></button>`;
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
                  this.page.url = _this2.core.galleryItems[index].disqusURL;
                  this.page.title = _this2.settings.disqusConfig.title;
                  this.language = _this2.settings.disqusConfig.language;
                }
              });
            } catch (err) {
              console.error(
                "Make sure you have included disqus JavaScript code in your document. Ex - https://lg-disqus.disqus.com/admin/install/platforms/universalcode/"
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
