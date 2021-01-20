/*!
 * lightgallery | 0.0.0 | January 16th 2021
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.lgRotate = {})));
}(this, (function (exports) { 'use strict';

    var LG = window.LG;
    var rotateSettings = {
        rotate: true,
        rotateLeft: true,
        rotateRight: true,
        flipHorizontal: true,
        flipVertical: true,
    };
    var Rotate = /** @class */ (function () {
        function Rotate(instance) {
            // get lightGallery core plugin data
            this.core = instance;
            // extend module default settings with lightGallery core settings
            this.s = Object.assign({}, rotateSettings, this.core.s);
            if (this.s.rotate && this.core.doCss()) {
                this.init();
            }
            return this;
        }
        Rotate.prototype.buildTemplates = function () {
            var rotateIcons = '';
            if (this.s.flipVertical) {
                rotateIcons +=
                    '<button type="button" id="lg-flip-ver" aria-label="flip vertical" class="lg-flip-ver lg-icon"></button>';
            }
            if (this.s.flipHorizontal) {
                rotateIcons +=
                    '<button type="button" id="lg-flip-hor" aria-label="Flip horizontal" class="lg-flip-hor lg-icon"></button>';
            }
            if (this.s.rotateLeft) {
                rotateIcons +=
                    '<button type="button" id="lg-rotate-left" aria-label="Rotate left" class="lg-rotate-left lg-icon"></button>';
            }
            if (this.s.rotateRight) {
                rotateIcons +=
                    '<button type="button" id="lg-rotate-right" aria-label="Rotate right" class="lg-rotate-right lg-icon"></button>';
            }
            this.core.outer.find('.lg-toolbar').append(rotateIcons);
        };
        Rotate.prototype.init = function () {
            var _this = this;
            this.buildTemplates();
            // Save rotate config for each item to persist its rotate, flip values
            // even after navigating to diferent slides
            this.rotateValuesList = {};
            // event triggered after appending slide content
            this.core.LGel.on('onAferAppendSlide.lg.rotate', function (event) {
                var index = event.detail.index;
                var imageWrap = _this.core
                    .getSlideItem(index)
                    .find('.lg-img-wrap')
                    .first();
                imageWrap.wrap('lg-img-rotate');
            });
            this.core.outer
                .find('#lg-rotate-left')
                .first()
                .on('click.lg', this.rotateLeft.bind(this));
            this.core.outer
                .find('#lg-rotate-right')
                .first()
                .on('click.lg', this.rotateRight.bind(this));
            this.core.outer
                .find('#lg-flip-hor')
                .first()
                .on('click.lg', this.flipHorizontal.bind(this));
            this.core.outer
                .find('#lg-flip-ver')
                .first()
                .on('click.lg', this.flipVertical.bind(this));
            // Reset rotate on slide change
            this.core.LGel.on('onBeforeSlide.lg.rotate', function (event) {
                if (!_this.rotateValuesList[event.detail.index]) {
                    _this.rotateValuesList[event.detail.index] = {
                        rotate: 0,
                        flipHorizontal: 1,
                        flipVertical: 1,
                    };
                }
            });
        };
        Rotate.prototype.applyStyles = function () {
            var $image = this.core
                .getSlideItem(this.core.index)
                .find('.lg-img-rotate')
                .first();
            $image.css('transform', 'rotate(' +
                this.rotateValuesList[this.core.index].rotate +
                'deg)' +
                ' scale3d(' +
                this.rotateValuesList[this.core.index].flipHorizontal +
                ', ' +
                this.rotateValuesList[this.core.index].flipVertical +
                ', 1)');
        };
        Rotate.prototype.rotateLeft = function () {
            this.rotateValuesList[this.core.index].rotate -= 90;
            this.applyStyles();
        };
        Rotate.prototype.rotateRight = function () {
            this.rotateValuesList[this.core.index].rotate += 90;
            this.applyStyles();
        };
        Rotate.prototype.getCurrentRotation = function (el) {
            if (!el) {
                return 0;
            }
            var st = LG(el).style();
            var tm = st.getPropertyValue('-webkit-transform') ||
                st.getPropertyValue('-moz-transform') ||
                st.getPropertyValue('-ms-transform') ||
                st.getPropertyValue('-o-transform') ||
                st.getPropertyValue('transform') ||
                'none';
            if (tm !== 'none') {
                var values = tm.split('(')[1].split(')')[0].split(',');
                if (values) {
                    var angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
                    return angle < 0 ? angle + 360 : angle;
                }
            }
            return 0;
        };
        Rotate.prototype.flipHorizontal = function () {
            var rotateEl = this.core
                .getSlideItem(this.core.index)
                .find('.lg-img-rotate')
                .first()
                .get();
            var currentRotation = this.getCurrentRotation(rotateEl);
            var rotateAxis = 'flipHorizontal';
            if (currentRotation === 90 || currentRotation === 270) {
                rotateAxis = 'flipVertical';
            }
            this.rotateValuesList[this.core.index][rotateAxis] *= -1;
            this.applyStyles();
        };
        Rotate.prototype.flipVertical = function () {
            var rotateEl = this.core
                .getSlideItem(this.core.index)
                .find('.lg-img-rotate')
                .first()
                .get();
            var currentRotation = this.getCurrentRotation(rotateEl);
            var rotateAxis = 'flipVertical';
            if (currentRotation === 90 || currentRotation === 270) {
                rotateAxis = 'flipHorizontal';
            }
            this.rotateValuesList[this.core.index][rotateAxis] *= -1;
            this.applyStyles();
        };
        Rotate.prototype.destroy = function (clear) {
            this.rotateValuesList = {};
            if (clear) {
                // Unbind all events added by lightGallery rotate plugin
                this.core.LGel.off('.lg.rotate');
            }
        };
        return Rotate;
    }());
    window.lgModules = window.lgModules || {};
    window.lgModules.rotate = Rotate;

    exports.Rotate = Rotate;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=lg-rotate.umd.js.map
