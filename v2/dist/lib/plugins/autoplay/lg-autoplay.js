"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autoplay = void 0;
var lg_autoplay_settings_1 = require("./lg-autoplay-settings");
/**
 * Creates the autoplay plugin.
 * @param {object} element - lightGallery element
 */
var Autoplay = /** @class */ (function () {
    function Autoplay(instance) {
        // get lightGallery core plugin data
        this.core = instance;
        // extend module default settings with lightGallery core settings
        this.s = Object.assign({}, lg_autoplay_settings_1.autoplaySettings);
        // Execute only if items are above 1
        if (this.core.$items.length < 2) {
            return this;
        }
        this.interval = false;
        // Identify if slide happened from autoplay
        this.fromAuto = true;
        // Identify if autoplay canceled from touch/drag
        this.canceledOnTouch = false;
        // save fourceautoplay value
        this.fourceAutoplayTemp = this.s.fourceAutoplay;
        // do not allow progress bar if browser does not support css3 transitions
        if (!this.core.doCss()) {
            this.s.progressBar = false;
        }
        this.init();
        return this;
    }
    Autoplay.prototype.init = function () {
        var _this = this;
        // append autoplay controls
        if (this.s.autoplayControls) {
            this.controls();
        }
        // Create progress bar
        if (this.s.progressBar) {
            this.core.outer
                .find('.lg')
                .append('<div class="lg-progress-bar"><div class="lg-progress"></div></div>');
        }
        // set progress
        this.progress();
        // Start autoplay
        if (this.s.autoplay) {
            this.core.LGel.once('onSlideItemLoad.lg.tm', function () {
                _this.startAuto();
            });
        }
        // cancel interval on touchstart and dragstart
        this.core.LGel.on('onDragstart.lg.tm touchstart.lg.tm', function () {
            if (_this.interval) {
                _this.cancelAuto();
                _this.canceledOnTouch = true;
            }
        });
        // restore autoplay if autoplay canceled from touchstart / dragstart
        this.core.LGel.on('onDragend.lg.tm touchend.lg.tm onSlideClick.lg.tm', function () {
            if (!_this.interval && _this.canceledOnTouch) {
                _this.startAuto();
                _this.canceledOnTouch = false;
            }
        });
    };
    Autoplay.prototype.progress = function () {
        var _this = this;
        this.core.LGel.on('onBeforeSlide.lg.tm', function () {
            // start progress bar animation
            if (_this.s.progressBar && _this.fromAuto) {
                var _$progressBar_1 = _this.core.outer.find('.lg-progress-bar');
                var _$progress_1 = _this.core.outer.find('.lg-progress');
                if (_this.interval) {
                    _$progress_1.removeAttr('style');
                    _$progressBar_1.removeClass('lg-start');
                    setTimeout(function () {
                        _$progress_1.css('transition', 'width ' +
                            (_this.core.s.speed + _this.s.pause) +
                            'ms ease 0s');
                        _$progressBar_1.addClass('lg-start');
                    }, 20);
                }
            }
            // Remove setinterval if slide is triggered manually and fourceautoplay is false
            if (!_this.fromAuto && !_this.s.fourceAutoplay) {
                _this.cancelAuto();
            }
            _this.fromAuto = false;
        });
    };
    // Manage autoplay via play/stop buttons
    Autoplay.prototype.controls = function () {
        var _this = this;
        var _html = '<span class="lg-autoplay-button lg-icon"></span>';
        // Append autoplay controls
        this.core.outer.find(this.s.appendAutoplayControlsTo).append(_html);
        this.core.outer.find('.lg-autoplay-button').on('click.lg', function () {
            if (_this.core.outer.hasClass('lg-show-autoplay')) {
                _this.cancelAuto();
                _this.s.fourceAutoplay = false;
            }
            else {
                if (!_this.interval) {
                    _this.startAuto();
                    _this.s.fourceAutoplay = _this.fourceAutoplayTemp;
                }
            }
        });
    };
    // Autostart gallery
    Autoplay.prototype.startAuto = function () {
        var _this = this;
        this.core.outer
            .find('.lg-progress')
            .css('transition', 'width ' + (this.core.s.speed + this.s.pause) + 'ms ease 0s');
        this.core.outer.addClass('lg-show-autoplay');
        this.core.outer.find('.lg-progress-bar').addClass('lg-start');
        this.interval = setInterval(function () {
            if (_this.core.index + 1 < _this.core.$items.length) {
                _this.core.index++;
            }
            else {
                _this.core.index = 0;
            }
            _this.fromAuto = true;
            _this.core.slide(_this.core.index, false, false, 'next');
        }, this.core.s.speed + this.s.pause);
    };
    // cancel Autostart
    Autoplay.prototype.cancelAuto = function () {
        clearInterval(this.interval);
        this.interval = false;
        this.core.outer.find('.lg-progress').removeAttr('style');
        this.core.outer.removeClass('lg-show-autoplay');
        this.core.outer.find('.lg-progress-bar').removeClass('lg-start');
    };
    Autoplay.prototype.destroy = function () {
        this.cancelAuto();
        this.core.outer.find('.lg-progress-bar').remove();
    };
    return Autoplay;
}());
exports.Autoplay = Autoplay;
window.lgModules = window.lgModules || {};
window.lgModules.autoplay = Autoplay;
//# sourceMappingURL=lg-autoplay.js.map