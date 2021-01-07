(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.lgPager = {})));
}(this, (function (exports) { 'use strict';

    var LG = window.LG;
    var defaults = {
        pager: true,
    };
    var Pager = /** @class */ (function () {
        function Pager(instance) {
            // get lightGallery core plugin data
            this.core = instance;
            // extend module default settings with lightGallery core settings
            this.s = Object.assign({}, defaults, this.core.s);
            if (this.s.pager && this.core.galleryItems.length > 1) {
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
                var $target = LG(event.target);
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
            this.core.LGel.on('onBeforeSlide.lg.pager', function (event) {
                var index = event.detail.index;
                _this.manageActiveClass.call(_this, index);
            });
            this.core.LGel.on('appendSlides.lg.pager', function (event) {
                var items = event.detail.items;
                _this.addNewPagers.call(_this, items);
            });
        };
        Pager.prototype.manageActiveClass = function (index) {
            var $pagerCont = this.core.outer.find('.lg-pager-cont');
            $pagerCont.removeClass('lg-pager-active');
            $pagerCont.eq(index).addClass('lg-pager-active');
        };
        Pager.prototype.addNewPagers = function (items) {
            this.core.outer
                .find('.lg-pager-outer')
                .append(this.getPagerHtml(items));
        };
        Pager.prototype.destroy = function (clear) {
            if (clear) {
                this.core.outer.find('.lg-pager-outer').remove();
                this.core.LGel.off('.lg.pager');
            }
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
