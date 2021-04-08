(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.lgAutoplay = {})));
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

    var autoplaySettings = {
        autoplay: true,
        slideShowAutoplay: false,
        slideShowInterval: 5000,
        progressBar: true,
        forceSlideShowAutoplay: false,
        autoplayControls: true,
        appendAutoplayControlsTo: '.lg-toolbar',
    };
    //# sourceMappingURL=lg-autoplay-settings.js.map

    /**
     * Creates the autoplay plugin.
     * @param {object} element - lightGallery element
     */
    var Autoplay = /** @class */ (function () {
        function Autoplay(instance) {
            // get lightGallery core plugin data
            this.core = instance;
            // extend module default settings with lightGallery core settings
            this.settings = Object.assign({}, autoplaySettings, this.core.settings);
            // Execute only if items are above 1
            if (this.core.galleryItems.length < 2) {
                return this;
            }
            this.interval = false;
            // Identify if slide happened from autoplay
            this.fromAuto = true;
            // Identify if autoplay canceled from touch/drag
            this.pausedOnTouchDrag = false;
            this.pausedOnSlideChange = false;
            if (this.settings.autoplay) {
                this.init();
            }
            return this;
        }
        Autoplay.prototype.init = function () {
            var _this = this;
            // append autoplay controls
            if (this.settings.autoplayControls) {
                this.controls();
            }
            // Create progress bar
            if (this.settings.progressBar) {
                this.core.$lgContent.append('<div class="lg-progress-bar"><div class="lg-progress"></div></div>');
            }
            // Start autoplay
            if (this.settings.slideShowAutoplay) {
                this.core.LGel.once(lGEvents.slideItemLoad + ".autoplay", function () {
                    _this.startAuto();
                });
            }
            // cancel interval on touchstart and dragstart
            this.core.LGel.on(lGEvents.dragStart + ".autoplay touchstart.lg.autoplay", function () {
                if (_this.interval) {
                    _this.cancelAuto();
                    _this.pausedOnTouchDrag = true;
                }
            });
            // restore autoplay if autoplay canceled from touchstart / dragstart
            this.core.LGel.on(lGEvents.dragEnd + ".autoplay touchend.lg.autoplay", function () {
                if (!_this.interval && _this.pausedOnTouchDrag) {
                    _this.startAuto();
                    _this.pausedOnTouchDrag = false;
                }
            });
            this.core.LGel.on(lGEvents.beforeSlide + ".autoplay", function () {
                _this.showProgressBar();
                if (!_this.fromAuto && _this.interval) {
                    _this.cancelAuto();
                    _this.pausedOnSlideChange = true;
                }
                else {
                    _this.pausedOnSlideChange = false;
                }
                _this.fromAuto = false;
            });
            // restore autoplay if autoplay canceled from touchstart / dragstart
            this.core.LGel.on(lGEvents.afterSlide + ".autoplay", function () {
                if (_this.pausedOnSlideChange &&
                    !_this.interval &&
                    _this.settings.forceSlideShowAutoplay) {
                    _this.startAuto();
                    _this.pausedOnSlideChange = false;
                }
            });
            // set progress
            this.showProgressBar();
        };
        Autoplay.prototype.showProgressBar = function () {
            var _this = this;
            if (this.settings.progressBar && this.fromAuto) {
                var _$progressBar_1 = this.core.outer.find('.lg-progress-bar');
                var _$progress_1 = this.core.outer.find('.lg-progress');
                if (this.interval) {
                    _$progress_1.removeAttr('style');
                    _$progressBar_1.removeClass('lg-start');
                    setTimeout(function () {
                        _$progress_1.css('transition', 'width ' +
                            (_this.core.settings.speed +
                                _this.settings.slideShowInterval) +
                            'ms ease 0s');
                        _$progressBar_1.addClass('lg-start');
                    }, 20);
                }
            }
        };
        // Manage autoplay via play/stop buttons
        Autoplay.prototype.controls = function () {
            var _this = this;
            var _html = '<button type="button" class="lg-autoplay-button lg-icon"></button>';
            // Append autoplay controls
            this.core.outer
                .find(this.settings.appendAutoplayControlsTo)
                .append(_html);
            this.core.outer
                .find('.lg-autoplay-button')
                .first()
                .on('click.lg.autoplay', function () {
                if (_this.core.outer.hasClass('lg-show-autoplay')) {
                    _this.cancelAuto();
                }
                else {
                    if (!_this.interval) {
                        _this.startAuto();
                    }
                }
            });
        };
        // Autostart gallery
        Autoplay.prototype.startAuto = function () {
            var _this = this;
            this.core.outer
                .find('.lg-progress')
                .css('transition', 'width ' +
                (this.core.settings.speed +
                    this.settings.slideShowInterval) +
                'ms ease 0s');
            this.core.outer.addClass('lg-show-autoplay');
            this.core.outer.find('.lg-progress-bar').addClass('lg-start');
            this.interval = setInterval(function () {
                if (_this.core.index + 1 < _this.core.galleryItems.length) {
                    _this.core.index++;
                }
                else {
                    _this.core.index = 0;
                }
                _this.fromAuto = true;
                _this.core.slide(_this.core.index, false, false, 'next');
            }, this.core.settings.speed + this.settings.slideShowInterval);
        };
        // cancel Autostart
        Autoplay.prototype.cancelAuto = function () {
            if (this.interval) {
                this.core.outer.find('.lg-progress').removeAttr('style');
                this.core.outer.removeClass('lg-show-autoplay');
                this.core.outer.find('.lg-progress-bar').removeClass('lg-start');
            }
            clearInterval(this.interval);
            this.interval = false;
        };
        Autoplay.prototype.closeGallery = function () {
            this.cancelAuto();
        };
        Autoplay.prototype.destroy = function () {
            if (this.settings.autoplay) {
                this.core.outer.find('.lg-progress-bar').remove();
            }
            // Remove all event listeners added by autoplay plugin
            this.core.LGel.off('.lg.autoplay');
        };
        return Autoplay;
    }());
    window.lgModules = window.lgModules || {};
    window.lgModules.autoplay = Autoplay;

    exports.Autoplay = Autoplay;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=lg-autoplay.umd.js.map
