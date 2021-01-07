"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash = void 0;
var LG = window.LG;
var defaults = {
    hash: true,
};
var Hash = /** @class */ (function () {
    function Hash(instance) {
        // get lightGallery core plugin data
        this.core = instance;
        // extend module default settings with lightGallery core settings
        this.s = Object.assign({}, defaults);
        if (this.s.hash) {
            this.oldHash = window.location.hash;
            this.init();
        }
        return this;
    }
    Hash.prototype.init = function () {
        // Change hash value on after each slide transition
        this.core.LGel.on('onAfterSlide.lg', this.onAfterSlide.bind(this));
        this.core.LGel.on('onCloseAfter.lg', this.onCloseAfter.bind(this));
        // Listen hash change and change the slide according to slide value
        LG(window).on('hashchange.lg.hash', this.onHashchange.bind(this));
    };
    Hash.prototype.onAfterSlide = function (event) {
        var slideName = this.core.galleryItems[event.detail.index].slideName;
        slideName = this.core.s.customSlideName
            ? slideName || event.detail.index
            : event.detail.index;
        if (history.replaceState) {
            history.replaceState(null, '', window.location.pathname +
                window.location.search +
                '#lg=' +
                this.core.s.galleryId +
                '&slide=' +
                slideName);
        }
        else {
            window.location.hash =
                'lg=' + this.core.s.galleryId + '&slide=' + slideName;
        }
    };
    Hash.prototype.onCloseAfter = function () {
        // Reset to old hash value
        if (this.oldHash &&
            this.oldHash.indexOf('lg=' + this.core.s.galleryId) < 0) {
            if (history.replaceState) {
                history.replaceState(null, '', this.oldHash);
            }
            else {
                window.location.hash = this.oldHash;
            }
        }
        else {
            if (history.replaceState) {
                history.replaceState(null, document.title, window.location.pathname + window.location.search);
            }
            else {
                window.location.hash = '';
            }
        }
    };
    Hash.prototype.onHashchange = function () {
        if (!this.core.lgOpened)
            return;
        var _hash = window.location.hash;
        var index = this.core.getIndexFromUrl(_hash);
        // it galleryId doesn't exist in the url close the gallery
        if (_hash.indexOf('lg=' + this.core.s.galleryId) > -1) {
            this.core.slide(index, false, false);
        }
        else if (this.core.lGalleryOn) {
            this.core.destroy();
        }
    };
    Hash.prototype.destroy = function () {
        if (!this.s.hash) {
            return;
        }
        this.core.LGel.off('.lg.hash');
    };
    return Hash;
}());
exports.Hash = Hash;
window.lgModules = window.lgModules || {};
window.lgModules.hash = Hash;
//# sourceMappingURL=lg-hash.js.map