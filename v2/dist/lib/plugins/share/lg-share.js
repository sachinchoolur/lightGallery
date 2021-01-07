"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Share = void 0;
var lg_share_settings_1 = require("./lg-share-settings");
var lg_share_utils_1 = require("./lg-share-utils");
var lg_share_markup_1 = require("./lg-share-markup");
var lg_fb_share_utils_1 = require("./lg-fb-share-utils");
var lg_twitter_share_utils_1 = require("./lg-twitter-share-utils");
var lg_pinterest_share_utils_1 = require("./lg-pinterest-share-utils");
var Share = /** @class */ (function () {
    function Share(instance) {
        // get lightGallery core plugin data
        this.core = instance;
        // extend module default settings with lightGallery core settings
        this.s = Object.assign({}, lg_share_settings_1.shareSettings);
        this.init();
        return this;
    }
    Share.prototype.init = function () {
        lg_share_markup_1.default(this.core.outer);
        this.core.outer
            .find('.lg-share .lg-dropdown')
            .append(this.getShareListHtml());
        this.core.LGel.on('onAfterSlide.lg.tm', this.onAfterSlide.bind(this));
    };
    Share.prototype.getShareListHtml = function () {
        var shareHtml = '';
        shareHtml += this.s.facebook
            ? lg_share_utils_1.getShareListHTML('facebook', this.s.facebookDropdownText)
            : '';
        shareHtml += this.s.twitter
            ? lg_share_utils_1.getShareListHTML('twitter', this.s.twitterDropdownText)
            : '';
        shareHtml += this.s.pinterest
            ? lg_share_utils_1.getShareListHTML('pinterest', this.s.pinterestDropdownText)
            : '';
        return shareHtml;
    };
    Share.prototype.onAfterSlide = function (event) {
        var _this = this;
        var index = event.detail.index;
        console.log('calling');
        setTimeout(function () {
            lg_fb_share_utils_1.setFacebookShareLink(_this.core.outer.find('.lg-share-facebook'), _this.core.galleryItems[index]);
            lg_twitter_share_utils_1.setTwitterShareLink(_this.core.outer.find('.lg-share-twitter'), _this.core.galleryItems[index]);
            lg_pinterest_share_utils_1.setPinterestShareLink(_this.core.outer.find('.lg-share-pinterest'), _this.core.galleryItems[index]);
        }, 100);
    };
    return Share;
}());
exports.Share = Share;
window.lgModules = window.lgModules || {};
window.lgModules.share = Share;
//# sourceMappingURL=lg-share.js.map