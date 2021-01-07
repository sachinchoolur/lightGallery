"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullScreen = void 0;
var defaults = {
    fullScreen: true,
};
var LG = window.LG;
var FullScreen = /** @class */ (function () {
    function FullScreen(instance) {
        // get lightGallery core plugin data
        this.core = instance;
        // extend module default settings with lightGallery core settings
        this.s = Object.assign({}, defaults);
        this.init();
        return this;
    }
    FullScreen.prototype.init = function () {
        var fullScreen = '';
        if (this.s.fullScreen) {
            // check for fullscreen browser support
            if (!document.fullscreenEnabled &&
                !document.webkitFullscreenEnabled &&
                !document.mozFullScreenEnabled &&
                !document.msFullscreenEnabled) {
                return;
            }
            else {
                fullScreen =
                    '<button type="button aria-label="Toggle fullscreen" class="lg-fullscreen lg-icon"></button>';
                this.core.outer.find('.lg-toolbar').append(fullScreen);
                this.fullScreen();
            }
        }
    };
    FullScreen.prototype.requestFullscreen = function () {
        var el = document.documentElement;
        if (el.requestFullscreen) {
            el.requestFullscreen();
        }
        else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        }
        else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        }
        else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        }
    };
    FullScreen.prototype.exitFullscreen = function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    };
    // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
    FullScreen.prototype.fullScreen = function () {
        var _this = this;
        LG(document).on('fullscreenchange.lg webkitfullscreenchange.lg mozfullscreenchange.lg MSFullscreenChange.lg', function () {
            if (!_this.core.lgOpened)
                return;
            _this.core.outer.toggleClass('lg-fullscreen-on');
        });
        this.core.outer
            .find('.lg-fullscreen')
            .first()
            .on('click.lg', function () {
            if (!document.fullscreenElement &&
                !document.mozFullScreenElement &&
                !document.webkitFullscreenElement &&
                !document.msFullscreenElement) {
                _this.requestFullscreen();
            }
            else {
                _this.exitFullscreen();
            }
        });
    };
    FullScreen.prototype.destroy = function () {
        // exit from fullscreen if activated
        this.exitFullscreen();
        LG(document).off('fullscreenchange.lg webkitfullscreenchange.lg mozfullscreenchange.lg MSFullscreenChange.lg');
    };
    return FullScreen;
}());
exports.FullScreen = FullScreen;
window.lgModules = window.lgModules || {};
window.lgModules.fullscreen = FullScreen;
//# sourceMappingURL=lg-fullscreen.js.map