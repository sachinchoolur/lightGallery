(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.lgComment = {})));
}(this, (function (exports) { 'use strict';

    var commentDefaults = {
        commentBox: true,
        fbComments: false,
        disqusComments: true,
        disqusConfig: {
            title: undefined,
            language: 'en',
        },
        fbCommentsMarkup: '<div id="lg-comment-box" class="lg-comment-box lg-fb-comment-box"><div class="lg-comment-header"><h3 class="lg-comment-title">Leave a comment.</h3><span id="lg-comment-close"  class="lg-icon"></span></div><div id="lg-comment-body"></div></div>',
    };
    //# sourceMappingURL=lg-comment-settings.js.map

    /**
     * @desc lightGallery comments module
     * Supports facebook and disqus comments
     *
     * @ref - https://paulund.co.uk/add-google-comments-to-your-site
     * @ref - https://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables
     * @ref - https://github.com/disqus/DISQUS-API-Recipes/blob/master/snippets/js/disqus-reset/disqus_reset.html
     * @ref - https://css-tricks.com/lazy-loading-disqus-comments/
     *
     */
    var LG = window.LG;
    var CommentBox = /** @class */ (function () {
        function CommentBox(instance) {
            // get lightGallery core plugin data
            this.core = instance;
            // extend module default settings with lightGallery core settings
            this.s = Object.assign({}, commentDefaults, this.core.s);
            if (this.s.commentBox) {
                this.init();
            }
            return this;
        }
        CommentBox.prototype.init = function () {
            this.setMarkup();
            this.toggleCommentBox();
            if (this.s.fbComments) {
                this.addFbComments();
            }
            else if (this.s.disqusComments) {
                this.addDisqusComments();
            }
        };
        CommentBox.prototype.setMarkup = function () {
            this.core.outer
                .find('.lg')
                .append(this.s.fbCommentsMarkup + '<div id="lg-comment-overlay"></div>');
            var commentToggleBtn = '<span id="lg-comment-toggle" class="lg-icon"></span>';
            this.core.outer.find('.lg-toolbar').append(commentToggleBtn);
        };
        CommentBox.prototype.toggleCommentBox = function () {
            var _this_1 = this;
            LG('#lg-comment-toggle').on('click.lg.comment', function () {
                _this_1.core.outer.toggleClass('lg-comment-active');
            });
            LG('#lg-comment-overlay').on('click.lg.comment', function () {
                _this_1.core.outer.removeClass('lg-comment-active');
            });
            LG('#lg-comment-close').on('click.lg.comment', function () {
                _this_1.core.outer.removeClass('lg-comment-active');
            });
        };
        CommentBox.prototype.addFbComments = function () {
            var _this_1 = this;
            this.core.LGel.on('onBeforeSlide.lg.comment', function (event) {
                var index = event.detail.index;
                LG('#lg-comment-body').html(LG(_this_1.core.items).eq(index).attr('data-fb-html'));
            });
            this.core.LGel.on('onAfterSlide.lg.comment', function () {
                try {
                    FB.XFBML.parse();
                }
                catch (err) {
                    LG(window).on('fbAsyncInit', function () {
                        FB.XFBML.parse();
                    });
                }
            });
        };
        CommentBox.prototype.addDisqusComments = function () {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            var _this = this;
            var $disqusThread = LG('#disqus_thread');
            $disqusThread.remove();
            LG('#lg-comment-body').append('<div id="disqus_thread"></div>');
            this.core.LGel.on('onBeforeSlide.lg.comment', function () {
                $disqusThread.html('');
            });
            this.core.LGel.on('onAfterSlide.lg.comment', function (event) {
                var index = event.detail.index;
                // DISQUS needs sometime to intialize when lightGallery is opened from direct url(hash plugin).
                setTimeout(function () {
                    try {
                        DISQUS.reset({
                            reload: true,
                            config: function () {
                                this.page.identifier = LG(_this.core.items)
                                    .eq(index)
                                    .attr('data-disqus-identifier');
                                this.page.url = LG(_this.core.items)
                                    .eq(index)
                                    .attr('data-disqus-url');
                                this.page.title = this.s.disqusConfig.title;
                                this.language = this.s.disqusConfig.language;
                            },
                        });
                    }
                    catch (err) {
                        console.error('Make sure you have included disqus JavaScript code in your document. Ex - https://lg-disqus.disqus.com/admin/install/platforms/universalcode/');
                    }
                }, _this.core.lGalleryOn ? 0 : 1000);
            });
        };
        CommentBox.prototype.destroy = function (clear) {
            if (clear) {
                this.core.LGel.off('.lg.comment');
            }
        };
        return CommentBox;
    }());
    window.lgModules = window.lgModules || {};
    window.lgModules.commentBox = CommentBox;
    //# sourceMappingURL=lg-comment.js.map

    exports.CommentBox = CommentBox;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=lg-comment.umd.js.map
