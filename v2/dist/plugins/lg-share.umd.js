(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.lgShare = {})));
}(this, (function (exports) { 'use strict';

    var shareSettings = {
        share: true,
        facebook: true,
        facebookDropdownText: 'Facebook',
        twitter: true,
        twitterDropdownText: 'Twitter',
        pinterest: true,
        pinterestDropdownText: 'Pinterest',
    };
    //# sourceMappingURL=lg-share-settings.js.map

    function getShareListHTML(type, text) {
        return "<li><a class=\"lg-share-" + type + "\" target=\"_blank\"><span class=\"lg-icon\"></span><span class=\"lg-dropdown-text\">" + text + "</span></a></li>";
    }
    //# sourceMappingURL=lg-share-utils.js.map

    function setLgShareMarkup (selector) {
        selector.find('.lg-toolbar').append("<button type=\"button aria-label=\"Share\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"lg-share lg-icon\">\n            <ul class=\"lg-dropdown\" style=\"position: absolute;\"></ul></button>");
        selector.find('.lg').append('<div class="lg-dropdown-overlay"></div>');
        var $shareButton = selector.find('.lg-share');
        $shareButton.first().on('click.lg', function () {
            selector.toggleClass('lg-dropdown-active');
            if (selector.hasClass('lg-dropdown-active')) {
                selector.attr('aria-expanded', true);
            }
            else {
                selector.attr('aria-expanded', false);
            }
        });
        selector
            .find('.lg-dropdown-overlay')
            .first()
            .on('click.lg', function () {
            selector.removeClass('lg-dropdown-active');
            selector.attr('aria-expanded', false);
        });
    }
    //# sourceMappingURL=lg-share-markup.js.map

    function getFacebookShareLink(galleryItem) {
        var facebookBaseUrl = '//www.facebook.com/sharer/sharer.php?u=';
        return (facebookBaseUrl +
            encodeURIComponent(galleryItem.facebookShareUrl || window.location.href));
    }
    function setFacebookShareLink(selector, galleryItem) {
        var href = getFacebookShareLink(galleryItem);
        selector.attr('href', href);
    }
    //# sourceMappingURL=lg-fb-share-utils.js.map

    function getTwitterShareLink(galleryItem) {
        var twitterBaseUrl = '//twitter.com/intent/tweet?text=';
        var url = encodeURIComponent(galleryItem.twitterShareUrl || window.location.href);
        var text = galleryItem.tweetText;
        return twitterBaseUrl + text + '&url=' + url;
    }
    function setTwitterShareLink(selector, galleryItem) {
        var href = getTwitterShareLink(galleryItem);
        selector.attr('href', href);
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
    function setPinterestShareLink(selector, galleryItem) {
        var href = getPinterestShareLink(galleryItem);
        selector.attr('href', href);
    }
    //# sourceMappingURL=lg-pinterest-share-utils.js.map

    var Share = /** @class */ (function () {
        function Share(instance) {
            // get lightGallery core plugin data
            this.core = instance;
            // extend module default settings with lightGallery core settings
            this.s = Object.assign({}, shareSettings, this.core.s);
            this.init();
            return this;
        }
        Share.prototype.init = function () {
            setLgShareMarkup(this.core.outer);
            this.core.outer
                .find('.lg-share .lg-dropdown')
                .append(this.getShareListHtml());
            this.core.LGel.on('onAfterSlide.lg.share', this.onAfterSlide.bind(this));
        };
        Share.prototype.getShareListHtml = function () {
            var shareHtml = '';
            shareHtml += this.s.facebook
                ? getShareListHTML('facebook', this.s.facebookDropdownText)
                : '';
            shareHtml += this.s.twitter
                ? getShareListHTML('twitter', this.s.twitterDropdownText)
                : '';
            shareHtml += this.s.pinterest
                ? getShareListHTML('pinterest', this.s.pinterestDropdownText)
                : '';
            return shareHtml;
        };
        Share.prototype.onAfterSlide = function (event) {
            var _this = this;
            var index = event.detail.index;
            console.log('calling');
            setTimeout(function () {
                setFacebookShareLink(_this.core.outer.find('.lg-share-facebook'), _this.core.galleryItems[index]);
                setTwitterShareLink(_this.core.outer.find('.lg-share-twitter'), _this.core.galleryItems[index]);
                setPinterestShareLink(_this.core.outer.find('.lg-share-pinterest'), _this.core.galleryItems[index]);
            }, 100);
        };
        Share.prototype.destroy = function (clear) {
            if (clear) {
                this.core.outer.find('.lg-dropdown-overlay').remove();
                this.core.outer.find('.lg-share').remove();
                this.core.LGel.off('.lg.share');
            }
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
