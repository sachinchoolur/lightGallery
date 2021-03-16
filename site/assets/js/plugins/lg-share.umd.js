(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.lgShare = {})));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var shareSettings = {
        share: true,
        facebook: true,
        facebookDropdownText: 'Facebook',
        twitter: true,
        twitterDropdownText: 'Twitter',
        pinterest: true,
        pinterestDropdownText: 'Pinterest',
        additionalShareOptions: [],
    };
    //# sourceMappingURL=lg-share-settings.js.map

    function getFacebookShareLink(galleryItem) {
        var facebookBaseUrl = '//www.facebook.com/sharer/sharer.php?u=';
        return (facebookBaseUrl +
            encodeURIComponent(galleryItem.facebookShareUrl || window.location.href));
    }
    //# sourceMappingURL=lg-fb-share-utils.js.map

    function getTwitterShareLink(galleryItem) {
        var twitterBaseUrl = '//twitter.com/intent/tweet?text=';
        var url = encodeURIComponent(galleryItem.twitterShareUrl || window.location.href);
        var text = galleryItem.tweetText;
        return twitterBaseUrl + text + '&url=' + url;
    }
    //# sourceMappingURL=lg-twitter-share-utils.js.map

    function getPinterestShareLink(galleryItem) {
        var pinterestBaseUrl = 'http://www.pinterest.com/pin/create/button/?url=';
        var description = galleryItem.pinterestText;
        var media = encodeURIComponent(galleryItem.src);
        var url = encodeURIComponent(galleryItem.pinterestShareUrl || window.location.href);
        return (pinterestBaseUrl +
            url +
            '&media=' +
            media +
            '&description=' +
            description);
    }
    //# sourceMappingURL=lg-pinterest-share-utils.js.map

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

    var Share = /** @class */ (function () {
        function Share(instance) {
            this.shareOptions = [];
            // get lightGallery core plugin data
            this.core = instance;
            // extend module default settings with lightGallery core settings
            this.settings = Object.assign({}, shareSettings, this.core.settings);
            if (this.settings.share) {
                this.init();
            }
            return this;
        }
        Share.prototype.init = function () {
            this.shareOptions = __spreadArrays(this.getDefaultShareOptions(), this.settings.additionalShareOptions);
            this.setLgShareMarkup();
            this.core.outer
                .find('.lg-share .lg-dropdown')
                .append(this.getShareListHtml());
            this.core.LGel.on(lGEvents.afterSlide + ".share", this.onAfterSlide.bind(this));
        };
        Share.prototype.getShareListHtml = function () {
            var shareHtml = '';
            this.shareOptions.forEach(function (shareOption) {
                shareHtml += shareOption.dropdownHTML;
            });
            return shareHtml;
        };
        Share.prototype.setLgShareMarkup = function () {
            var _this = this;
            this.core.outer.find('.lg-toolbar').append("<button type=\"button aria-label=\"Share\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"lg-share lg-icon\">\n                <ul class=\"lg-dropdown\" style=\"position: absolute;\"></ul></button>");
            this.core.outer
                .find('.lg')
                .append('<div class="lg-dropdown-overlay"></div>');
            var $shareButton = this.core.outer.find('.lg-share');
            $shareButton.first().on('click.lg', function () {
                _this.core.outer.toggleClass('lg-dropdown-active');
                if (_this.core.outer.hasClass('lg-dropdown-active')) {
                    _this.core.outer.attr('aria-expanded', true);
                }
                else {
                    _this.core.outer.attr('aria-expanded', false);
                }
            });
            this.core.outer
                .find('.lg-dropdown-overlay')
                .first()
                .on('click.lg', function () {
                _this.core.outer.removeClass('lg-dropdown-active');
                _this.core.outer.attr('aria-expanded', false);
            });
        };
        Share.prototype.onAfterSlide = function (event) {
            var _this = this;
            var index = event.detail.index;
            var currentItem = this.core.galleryItems[index];
            setTimeout(function () {
                _this.shareOptions.forEach(function (shareOption) {
                    var selector = shareOption.selector;
                    _this.core.outer
                        .find(selector)
                        .attr('href', shareOption.generateLink(currentItem));
                });
            }, 100);
        };
        Share.prototype.getShareListItemHTML = function (type, text) {
            return "<li><a class=\"lg-share-" + type + "\" target=\"_blank\"><span class=\"lg-icon\"></span><span class=\"lg-dropdown-text\">" + text + "</span></a></li>";
        };
        Share.prototype.getDefaultShareOptions = function () {
            return __spreadArrays((this.settings.facebook
                ? [
                    {
                        type: 'facebook',
                        generateLink: getFacebookShareLink,
                        dropdownHTML: this.getShareListItemHTML('facebook', this.settings.facebookDropdownText),
                        selector: '.lg-share-facebook',
                    },
                ]
                : []), (this.settings.twitter
                ? [
                    {
                        type: 'twitter',
                        generateLink: getTwitterShareLink,
                        dropdownHTML: this.getShareListItemHTML('twitter', this.settings.twitterDropdownText),
                        selector: '.lg-share-twitter',
                    },
                ]
                : []), (this.settings.pinterest
                ? [
                    {
                        type: 'pinterest',
                        generateLink: getPinterestShareLink,
                        dropdownHTML: this.getShareListItemHTML('pinterest', this.settings.pinterestDropdownText),
                        selector: '.lg-share-pinterest',
                    },
                ]
                : []));
        };
        Share.prototype.destroy = function () {
            this.core.outer.find('.lg-dropdown-overlay').remove();
            this.core.outer.find('.lg-share').remove();
            this.core.LGel.off('.lg.share');
        };
        return Share;
    }());
    window.lgModules = window.lgModules || {};
    window.lgModules.share = Share;
    //# sourceMappingURL=lg-share.js.map

    exports.Share = Share;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=lg-share.umd.js.map
