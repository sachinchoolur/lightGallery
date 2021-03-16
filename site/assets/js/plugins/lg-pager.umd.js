(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.lgPager = {})));
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

    var pagerSettings = {
        pager: true,
    };
    //# sourceMappingURL=lg-pager-settings.js.map

    var $LG = window.$LG;
    var Pager = /** @class */ (function () {
        function Pager(instance) {
            // get lightGallery core plugin data
            this.core = instance;
            // extend module default settings with lightGallery core settings
            this.settings = Object.assign({}, pagerSettings, this.core.settings);
            if (this.settings.pager && this.core.galleryItems.length > 1) {
                this.init();
            }
            return this;
        }
        Pager.prototype.getPagerHtml = function (items) {
            var pagerList = '';
            for (var i = 0; i < items.length; i++) {
                pagerList += "<span  data-lg-item-id=\"" + i + "\" class=\"lg-pager-cont\"> \n                    <span data-lg-item-id=\"" + i + "\" class=\"lg-pager\"></span>\n                    <div class=\"lg-pager-thumb-cont\"><span class=\"lg-caret\"></span> <img src=\"" + items[i].thumb + "\" /></div>\n                    </span>";
            }
            return pagerList;
        };
        Pager.prototype.init = function () {
            var _this = this;
            var timeout;
            this.core.outer
                .find('.lg')
                .append('<div class="lg-pager-outer"></div>');
            var $pagerOuter = this.core.outer.find('.lg-pager-outer');
            $pagerOuter.html(this.getPagerHtml(this.core.galleryItems));
            // @todo enable click
            $pagerOuter.first().on('click.lg touchend.lg', function (event) {
                var $target = $LG(event.target);
                if (!$target.hasAttribute('data-lg-item-id')) {
                    return;
                }
                var index = parseInt($target.attr('data-lg-item-id'));
                _this.core.slide(index, false, true, false);
            });
            $pagerOuter.first().on('mouseover.lg', function () {
                clearTimeout(timeout);
                $pagerOuter.addClass('lg-pager-hover');
            });
            $pagerOuter.first().on('mouseout.lg', function () {
                timeout = setTimeout(function () {
                    $pagerOuter.removeClass('lg-pager-hover');
                });
            });
            this.core.LGel.on(lGEvents.beforeSlide + ".pager", function (event) {
                var index = event.detail.index;
                _this.manageActiveClass.call(_this, index);
            });
            this.core.LGel.on(lGEvents.updateSlides + ".pager", function () {
                $pagerOuter.empty();
                $pagerOuter.html(_this.getPagerHtml(_this.core.galleryItems));
                _this.manageActiveClass(_this.core.index);
            });
        };
        Pager.prototype.manageActiveClass = function (index) {
            var $pagerCont = this.core.outer.find('.lg-pager-cont');
            $pagerCont.removeClass('lg-pager-active');
            $pagerCont.eq(index).addClass('lg-pager-active');
        };
        Pager.prototype.destroy = function () {
            this.core.outer.find('.lg-pager-outer').remove();
            this.core.LGel.off('.lg.pager');
        };
        return Pager;
    }());
    window.lgModules = window.lgModules || {};
    window.lgModules.pager = Pager;
    //# sourceMappingURL=lg-pager.js.map

    exports.Pager = Pager;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=lg-pager.umd.js.map
