(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.lgComment = {})));
}(this, (function (exports) { 'use strict';

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'afterAppendSlide.lg',
        init: 'init.lg',
        hasVideo: 'hasVideo.lg',
        containerResize: 'containerResize.lg',
        updateSlides: 'updateSlides.lg',
        afterAppendSubHtml: 'afterAppendSubHtml.lg',
        beforeOpen: 'beforeOpen.lg',
        afterOpen: 'afterOpen.lg',
        slideItemLoad: 'slideItemLoad.lg',
        beforeSlide: 'beforeSlide.lg',
        afterSlide: 'afterSlide.lg',
        posterClick: 'posterClick.lg',
        dragStart: 'dragStart.lg',
        dragMove: 'dragMove.lg',
        dragEnd: 'dragEnd.lg',
        beforeNextSlide: 'beforeNextSlide.lg',
        beforePrevSlide: 'beforePrevSlide.lg',
        beforeClose: 'beforeClose.lg',
        afterClose: 'afterClose.lg',
    };
    //# sourceMappingURL=lg-events.js.map

    var commentSettings = {
        commentBox: false,
        fbComments: false,
        disqusComments: false,
        disqusConfig: {
            title: undefined,
            language: 'en',
        },
        commentsMarkup: '<div id="lg-comment-box" class="lg-comment-box lg-fb-comment-box"><div class="lg-comment-header"><h3 class="lg-comment-title">Leave a comment.</h3><span class="lg-comment-close"  class="lg-icon"></span></div><div class="lg-comment-body"></div></div>',
    };
    //# sourceMappingURL=lg-comment-settings.js.map

    /**
     * lightGallery comments module
     * Supports facebook and disqus comments
     *
     * @ref - https://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables
     * @ref - https://github.com/disqus/DISQUS-API-Recipes/blob/master/snippets/js/disqus-reset/disqus_reset.html
     * @ref - https://css-tricks.com/lazy-loading-disqus-comments/
     * @ref - https://developers.facebook.com/docs/plugins/comments/#comments-plugin
     *
     */
    var $LG = window.$LG;
    var CommentBox = /** @class */ (function () {
        function CommentBox(instance) {
            // get lightGallery core plugin data
            this.core = instance;
            // extend module default settings with lightGallery core settings
            this.settings = Object.assign({}, commentSettings, this.core.settings);
            if (this.settings.commentBox) {
                this.init();
            }
            return this;
        }
        CommentBox.prototype.init = function () {
            this.setMarkup();
            this.toggleCommentBox();
            if (this.settings.fbComments) {
                this.addFbComments();
            }
            else if (this.settings.disqusComments) {
                this.addDisqusComments();
            }
        };
        CommentBox.prototype.setMarkup = function () {
            this.core.$lgContent.append(this.settings.commentsMarkup +
                '<div class="lg-comment-overlay"></div>');
            var commentToggleBtn = '<button type="button" aria-label="Toggle comments" class="lg-comment-toggle lg-icon"></button>';
            this.core.$toolbar.append(commentToggleBtn);
        };
        CommentBox.prototype.toggleCommentBox = function () {
            var _this_1 = this;
            this.core.outer
                .find('.lg-comment-toggle')
                .first()
                .on('click.lg.comment', function () {
                _this_1.core.outer.toggleClass('lg-comment-active');
            });
            this.core.outer
                .find('.lg-comment-overlay')
                .first()
                .on('click.lg.comment', function () {
                _this_1.core.outer.removeClass('lg-comment-active');
            });
            this.core.outer
                .find('.lg-comment-close')
                .first()
                .on('click.lg.comment', function () {
                _this_1.core.outer.removeClass('lg-comment-active');
            });
        };
        CommentBox.prototype.addFbComments = function () {
            var _this_1 = this;
            this.core.LGel.on(lGEvents.beforeSlide + ".comment", function (event) {
                var html = _this_1.core.galleryItems[event.detail.index].fbHtml;
                _this_1.core.outer.find('.lg-comment-body').html(html);
            });
            this.core.LGel.on(lGEvents.afterSlide + ".comment", function () {
                try {
                    FB.XFBML.parse();
                }
                catch (err) {
                    $LG(window).on('fbAsyncInit', function () {
                        FB.XFBML.parse();
                    });
                }
            });
        };
        CommentBox.prototype.addDisqusComments = function () {
            var _this_1 = this;
            var $disqusThread = $LG('#disqus_thread');
            $disqusThread.remove();
            this.core.outer
                .find('.lg-comment-body')
                .append('<div id="disqus_thread"></div>');
            this.core.LGel.on(lGEvents.beforeSlide + ".comment", function () {
                $disqusThread.html('');
            });
            this.core.LGel.on(lGEvents.afterSlide + ".comment", function (event) {
                var index = event.detail.index;
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                var _this = _this_1;
                // DISQUS needs sometime to intialize when lightGallery is opened from direct url(hash plugin).
                setTimeout(function () {
                    try {
                        DISQUS.reset({
                            reload: true,
                            config: function () {
                                this.page.identifier =
                                    _this.core.galleryItems[index].disqusIdentifier;
                                this.page.url =
                                    _this.core.galleryItems[index].disqusURL;
                                this.page.title =
                                    _this.settings.disqusConfig.title;
                                this.language =
                                    _this.settings.disqusConfig.language;
                            },
                        });
                    }
                    catch (err) {
                        console.error('Make sure you have included disqus JavaScript code in your document. Ex - https://lg-disqus.disqus.com/admin/install/platforms/universalcode/');
                    }
                }, _this.core.lGalleryOn ? 0 : 1000);
            });
        };
        CommentBox.prototype.destroy = function () {
            this.core.LGel.off('.lg.comment');
        };
        return CommentBox;
    }());
    window.lgModules = window.lgModules || {};
    window.lgModules.commentBox = CommentBox;

    exports.CommentBox = CommentBox;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=lg-comment.umd.js.map
