(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.lgHash = {})));
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

    var hashSettings = {
        hash: true,
    };
    //# sourceMappingURL=lg-hash-settings.js.map

    var $LG = window.$LG;
    var Hash = /** @class */ (function () {
        function Hash(instance) {
            // get lightGallery core plugin data
            this.core = instance;
            // extend module default settings with lightGallery core settings
            this.settings = Object.assign({}, hashSettings, this.core.settings);
            if (this.settings.hash) {
                this.oldHash = window.location.hash;
                this.init();
            }
            return this;
        }
        Hash.prototype.init = function () {
            // Change hash value on after each slide transition
            this.core.LGel.on(lGEvents.afterSlide + ".hash", this.onAfterSlide.bind(this));
            this.core.LGel.on(lGEvents.afterClose + ".hash", this.onCloseAfter.bind(this));
            // Listen hash change and change the slide according to slide value
            $LG(window).on("hashchange.lg.hash.global" + this.core.lgId, this.onHashchange.bind(this));
        };
        Hash.prototype.onAfterSlide = function (event) {
            var slideName = this.core.galleryItems[event.detail.index].slideName;
            slideName = this.core.settings.customSlideName
                ? slideName || event.detail.index
                : event.detail.index;
            if (history.replaceState) {
                history.replaceState(null, '', window.location.pathname +
                    window.location.search +
                    '#lg=' +
                    this.core.settings.galleryId +
                    '&slide=' +
                    slideName);
            }
            else {
                window.location.hash =
                    'lg=' + this.core.settings.galleryId + '&slide=' + slideName;
            }
        };
        Hash.prototype.onCloseAfter = function () {
            // Reset to old hash value
            if (this.oldHash &&
                this.oldHash.indexOf('lg=' + this.core.settings.galleryId) < 0) {
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
            if (_hash.indexOf('lg=' + this.core.settings.galleryId) > -1) {
                this.core.slide(index, false, false);
            }
            else if (this.core.lGalleryOn) {
                this.core.closeGallery();
            }
        };
        Hash.prototype.closeGallery = function () {
            if (!this.settings.hash) {
                return;
            }
        };
        Hash.prototype.destroy = function () {
            this.core.LGel.off('.lg.hash');
            $LG(window).off("hashchange.lg.hash.global" + this.core.lgId);
        };
        return Hash;
    }());
    window.lgModules = window.lgModules || {};
    window.lgModules.hash = Hash;
    //# sourceMappingURL=lg-hash.js.map

    exports.Hash = Hash;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=lg-hash.umd.js.map
