"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToData = void 0;
var lgQuery_1 = require("./lgQuery");
var defaultDynamicOptions = [
    'src',
    'subHtml',
    'subHtmlUrl',
    'html',
    'video',
    'poster',
    'slideName',
    'responsive',
    'srcset',
    'sizes',
    'iframe',
    'downloadUrl',
    'width',
    'facebookShareUrl',
    'tweetText',
    'witterShareUrl',
    'googleplusUhareUrl',
    'pinterestShareUrl',
    'pinterestText',
];
// Convert html data-attribute to camalcase
function convertToData(attr) {
    // FInd a way for lgsize
    if (attr === 'href') {
        return 'src';
    }
    attr = attr.replace('data-', '');
    attr = attr.charAt(0).toLowerCase() + attr.slice(1);
    attr = attr.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    return attr;
}
exports.convertToData = convertToData;
var utils = {
    /**
     * @desc get possible width and height from the lgSize attribute. Used for ZoomFromImage option
     * @param {jQuery Element} $el
     * @returns {Object} Computed Width and Computed Height
     */
    getSize: function (el) {
        var LGel = lgQuery_1.LG(el);
        var lgSize = LGel.attr('data-lg-size');
        if (!lgSize) {
            return;
        }
        var size = lgSize.split('-');
        var width = parseInt(size[0], 10);
        var height = parseInt(size[1], 10);
        var wWidth = document.body.clientWidth;
        var wHeight = window.innerHeight;
        var maxWidth = Math.min(wWidth, width);
        var maxHeight = Math.min(wHeight, height);
        var srcWidth = LGel.width();
        var srcHeight = LGel.height();
        var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
        return {
            width: srcWidth * ratio,
            height: srcHeight * ratio,
        };
    },
    /**
     * @desc Get transform value based on the imageSize. Used for ZoomFromImage option
     * @param {jQuery Element}
     * @returns {String} Transform CSS string
     */
    getTransform: function (el, imageSize) {
        if (!imageSize) {
            return;
        }
        var LGel = lgQuery_1.LG(el);
        var wWidth = document.body.clientWidth;
        // using innerWidth to include mobile safari bottom bar
        var wHeight = window.innerHeight;
        var elWidth = LGel.width();
        var elHeight = LGel.height();
        var elStyle = LGel.style();
        var x = (wWidth - elWidth) / 2 -
            (LGel.offset().left +
                parseFloat(elStyle.paddingLeft) +
                parseFloat(elStyle.borderLeft));
        var y = (wHeight - elHeight) / 2 -
            (LGel.offset().top +
                parseFloat(elStyle.paddingTop) +
                parseFloat(elStyle.borderTop)) +
            lgQuery_1.LG(window).scrollTop();
        var scX = elWidth / imageSize.width;
        var scY = elHeight / imageSize.height;
        return ('translate3d(' +
            (x *= -1) +
            'px, ' +
            (y *= -1) +
            'px, 0) scale3d(' +
            scX +
            ', ' +
            scY +
            ', 1)');
    },
    getIframeMarkup: function (src, iframeMaxWidth) {
        return "<div class=\"lg-video-cont lg-has-iframe\" style=\"max-width:" + iframeMaxWidth + "\">\n                    <div class=\"lg-video\">\n                        <iframe class=\"lg-object\" frameborder=\"0\" src=\"" + src + "\"  allowfullscreen=\"true\"></iframe>\n                    </div>\n                </div>";
    },
    // Get src from responsive src
    getResponsiveSrc: function (srcItms) {
        var rsWidth = [];
        var rsSrc = [];
        var src = '';
        for (var i = 0; i < srcItms.length; i++) {
            var _src = srcItms[i].split(' ');
            // Manage empty space
            if (_src[0] === '') {
                _src.splice(0, 1);
            }
            rsSrc.push(_src[0]);
            rsWidth.push(_src[1]);
        }
        var wWidth = window.innerWidth;
        for (var j = 0; j < rsWidth.length; j++) {
            if (parseInt(rsWidth[j], 10) > wWidth) {
                src = rsSrc[j];
                break;
            }
        }
        return src;
    },
    getVideoPosterMarkup: function (_poster, _isVideo) {
        var videoClass = '';
        if (_isVideo && _isVideo.youtube) {
            videoClass = 'lg-has-youtube';
        }
        else if (_isVideo && _isVideo.vimeo) {
            videoClass = 'lg-has-vimeo';
        }
        else {
            videoClass = 'lg-has-html5';
        }
        return "<div class=\"lg-video-cont " + videoClass + "\"><div class=\"lg-video\"><span class=\"lg-video-play\"></span><img class=\"lg-object lg-has-poster\" src=\"" + _poster + "\" /></div></div>";
    },
    /**
     * @desc Create dynamic elements array from gallery items when dynamic option is false
     * It helps to avoid frequent DOM interaction
     * and avoid multiple checks for dynamic elments
     *
     * @returns {Array} dynamicEl
     */
    getDynamicOptions: function (items, extraProps, getCaptionFromTitleOrAlt) {
        var dynamicElements = [];
        var availableDynamicOptions = __spreadArrays(defaultDynamicOptions, extraProps);
        [].forEach.call(items, function (item) {
            var dynamicEl = {};
            for (var i = 0; i < item.attributes.length; i++) {
                var attr = item.attributes[i];
                if (attr.specified) {
                    var dynamicAttr = convertToData(attr.name);
                    var label = '';
                    if (availableDynamicOptions.indexOf(dynamicAttr) > -1) {
                        label = dynamicAttr;
                    }
                    if (label) {
                        dynamicEl[label] = attr.value;
                    }
                }
            }
            var currentItem = lgQuery_1.LG(item);
            var alt = currentItem.find('img').first().attr('alt');
            var title = currentItem.attr('title');
            if (getCaptionFromTitleOrAlt && !dynamicEl.subHtml) {
                dynamicEl.subHtml = title || alt || '';
            }
            dynamicEl.alt = alt || title || '';
            dynamicElements.push(dynamicEl);
        });
        return dynamicElements;
    },
};
exports.default = utils;
//# sourceMappingURL=lg-utils.js.map