/*!
 * lightgallery | 0.0.0 | January 16th 2021
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.lightgallery = {})));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    (function () {
        if (typeof window.CustomEvent === 'function')
            return false;
        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: null };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }
        window.CustomEvent = CustomEvent;
    })();
    (function () {
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.msMatchesSelector ||
                    Element.prototype.webkitMatchesSelector;
        }
    })();
    var lgQuery = /** @class */ (function () {
        function lgQuery(selector) {
            this.cssVenderPrefixes = [
                'TransitionDuration',
                'TransitionTimingFunction',
                'Transform',
                'Transition',
            ];
            this.selector = this._getSelector(selector);
            this.firstElement = this._getFirstEl();
            return this;
        }
        lgQuery.prototype._getSelector = function (selector, context) {
            if (context === void 0) { context = document; }
            if (typeof selector !== 'string') {
                return selector;
            }
            context = context || document;
            var fl = selector.substring(0, 1);
            if (fl === '#') {
                return context.querySelector(selector);
            }
            else {
                return context.querySelectorAll(selector);
            }
        };
        lgQuery.prototype._each = function (func) {
            if (!this.selector) {
                return this;
            }
            if (this.selector.length !== undefined) {
                [].forEach.call(this.selector, func);
            }
            else {
                func(this.selector, 0);
            }
            return this;
        };
        lgQuery.prototype._setCssVendorPrefix = function (el, cssProperty, value) {
            var property = cssProperty.replace(/-([a-z])/gi, function (s, group1) {
                return group1.toUpperCase();
            });
            if (this.cssVenderPrefixes.indexOf(property) !== -1) {
                el.style[property.charAt(0).toLowerCase() + property.slice(1)] = value;
                el.style['webkit' + property] = value;
                el.style['moz' + property] = value;
                el.style['ms' + property] = value;
                el.style['o' + property] = value;
            }
            else {
                el.style[property] = value;
            }
        };
        lgQuery.prototype._getFirstEl = function () {
            if (this.selector && this.selector.length !== undefined) {
                return this.selector[0];
            }
            else {
                return this.selector;
            }
        };
        lgQuery.prototype.isEventMatched = function (event, eventName) {
            var eventNamespace = eventName.split('.');
            return event
                .split('.')
                .filter(function (e) { return e; })
                .every(function (e) {
                return eventNamespace.indexOf(e) !== -1;
            });
        };
        lgQuery.prototype.attr = function (attr, value) {
            if (value === undefined) {
                if (!this.firstElement) {
                    return '';
                }
                return this.firstElement.getAttribute(attr);
            }
            this._each(function (el) {
                el.setAttribute(attr, value);
            });
            return this;
        };
        lgQuery.prototype.find = function (selector) {
            return LG(this._getSelector(selector, this.selector));
        };
        lgQuery.prototype.first = function () {
            if (this.selector.length !== undefined) {
                return LG(this.selector[0]);
            }
            else {
                return LG(this.selector);
            }
        };
        lgQuery.prototype.eq = function (index) {
            return LG(this.selector[index]);
        };
        lgQuery.prototype.parent = function () {
            return LG(this.selector.parentElement);
        };
        lgQuery.prototype.get = function () {
            return this._getFirstEl();
        };
        lgQuery.prototype.removeAttr = function (attributes) {
            var attrs = attributes.split(' ');
            this._each(function (el) {
                attrs.forEach(function (attr) { return el.removeAttribute(attr); });
            });
            return this;
        };
        lgQuery.prototype.wrap = function (className) {
            if (!this.firstElement) {
                return this;
            }
            var wrapper = document.createElement('div');
            wrapper.className = className;
            this.firstElement.parentNode.insertBefore(wrapper, this.firstElement);
            this.firstElement.parentNode.removeChild(this.firstElement);
            wrapper.appendChild(this.firstElement);
            return this;
        };
        lgQuery.prototype.addClass = function (classNames) {
            if (classNames === void 0) { classNames = ''; }
            this._each(function (el) {
                // IE doesn't support multiple arguments
                classNames.split(' ').forEach(function (className) {
                    el.classList.add(className);
                });
            });
            return this;
        };
        lgQuery.prototype.removeClass = function (classNames) {
            this._each(function (el) {
                // IE doesn't support multiple arguments
                classNames.split(' ').forEach(function (className) {
                    el.classList.remove(className);
                });
            });
            return this;
        };
        lgQuery.prototype.hasClass = function (className) {
            if (!this.firstElement) {
                return false;
            }
            return this.firstElement.classList.contains(className);
        };
        lgQuery.prototype.hasAttribute = function (attribute) {
            if (!this.firstElement) {
                return false;
            }
            return this.firstElement.hasAttribute(attribute);
        };
        lgQuery.prototype.toggleClass = function (className) {
            if (!this.firstElement) {
                return this;
            }
            if (this.hasClass(className)) {
                this.removeClass(className);
            }
            else {
                this.addClass(className);
            }
            return this;
        };
        lgQuery.prototype.css = function (property, value) {
            var _this = this;
            this._each(function (el) {
                _this._setCssVendorPrefix(el, property, value);
            });
            return this;
        };
        // Need to pass separate namespaces for separate elements
        lgQuery.prototype.on = function (events, listener) {
            var _this = this;
            if (!this.selector) {
                return this;
            }
            events.split(' ').forEach(function (event) {
                if (!Array.isArray(lgQuery.eventListeners[event])) {
                    lgQuery.eventListeners[event] = [];
                }
                lgQuery.eventListeners[event].push(listener);
                _this.selector.addEventListener(event.split('.')[0], listener);
            });
            return this;
        };
        // @todo - test this
        lgQuery.prototype.once = function (event, listener) {
            var _this = this;
            this.on(event, function () {
                _this.off(event);
                listener(event);
            });
            return this;
        };
        lgQuery.prototype.off = function (event) {
            var _this = this;
            if (!this.selector) {
                return this;
            }
            Object.keys(lgQuery.eventListeners).forEach(function (eventName) {
                if (_this.isEventMatched(event, eventName)) {
                    lgQuery.eventListeners[eventName].forEach(function (listener) {
                        _this.selector.removeEventListener(eventName.split('.')[0], listener);
                    });
                    lgQuery.eventListeners[eventName] = [];
                }
            });
            return this;
        };
        lgQuery.prototype.trigger = function (event, detail) {
            if (!this.firstElement) {
                return this;
            }
            var customEvent = new CustomEvent(event.split('.')[0], {
                detail: detail || null,
            });
            this.firstElement.dispatchEvent(customEvent);
            return this;
        };
        // Does not support IE
        lgQuery.prototype.load = function (url) {
            var _this = this;
            fetch(url).then(function (res) {
                _this.selector.innerHTML = res;
            });
            return this;
        };
        lgQuery.prototype.html = function (html) {
            if (html === undefined) {
                if (!this.firstElement) {
                    return '';
                }
                return this.firstElement.innerHTML;
            }
            this._each(function (el) {
                el.innerHTML = html;
            });
            return this;
        };
        lgQuery.prototype.append = function (html) {
            this._each(function (el) {
                if (typeof html === 'string') {
                    el.insertAdjacentHTML('beforeend', html);
                }
                else {
                    el.appendChild(html);
                }
            });
            return this;
        };
        lgQuery.prototype.prepend = function (html) {
            this._each(function (el) {
                el.insertAdjacentHTML('afterbegin', html);
            });
            return this;
        };
        lgQuery.prototype.remove = function () {
            this._each(function (el) {
                el.parentNode.removeChild(el);
            });
            return this;
        };
        lgQuery.prototype.empty = function () {
            this._each(function (el) {
                el.innerHTML = '';
            });
            return this;
        };
        lgQuery.prototype.scrollTop = function (scrollTop) {
            if (scrollTop !== undefined) {
                document.body.scrollTop = scrollTop;
                document.documentElement.scrollTop = scrollTop;
                return this;
            }
            else {
                return (window.pageYOffset ||
                    document.documentElement.scrollTop ||
                    document.body.scrollTop ||
                    0);
            }
        };
        lgQuery.prototype.scrollLeft = function (scrollLeft) {
            if (scrollLeft !== undefined) {
                document.body.scrollLeft = scrollLeft;
                document.documentElement.scrollLeft = scrollLeft;
                return this;
            }
            else {
                return (window.pageXOffset ||
                    document.documentElement.scrollLeft ||
                    document.body.scrollLeft ||
                    0);
            }
        };
        lgQuery.prototype.offset = function () {
            if (!this.firstElement) {
                return {
                    left: 0,
                    top: 0,
                };
            }
            var rect = this.firstElement.getBoundingClientRect();
            var bodyMarginLeft = LG('body').style().marginLeft;
            // Minus body margin - https://stackoverflow.com/questions/30711548/is-getboundingclientrect-left-returning-a-wrong-value
            return {
                left: rect.left - parseFloat(bodyMarginLeft) + this.scrollLeft(),
                top: rect.top + this.scrollTop(),
            };
        };
        lgQuery.prototype.style = function () {
            if (!this.firstElement) {
                return {};
            }
            return (this.firstElement.currentStyle ||
                window.getComputedStyle(this.firstElement));
        };
        // Width without padding and border even if box-sizing is used.
        lgQuery.prototype.width = function () {
            var style = this.style();
            return (this.firstElement.clientWidth -
                parseFloat(style.paddingLeft) -
                parseFloat(style.paddingRight));
        };
        // Height without padding and border even if box-sizing is used.
        lgQuery.prototype.height = function () {
            var style = this.style();
            return (this.firstElement.clientHeight -
                parseFloat(style.paddingTop) -
                parseFloat(style.paddingBottom));
        };
        lgQuery.eventListeners = {};
        return lgQuery;
    }());
    function LG(selector) {
        return new lgQuery(selector);
    }

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
    var utils = {
        /**
         * @desc get possible width and height from the lgSize attribute. Used for ZoomFromImage option
         * @param {jQuery Element} $el
         * @returns {Object} Computed Width and Computed Height
         */
        getSize: function (el) {
            var LGel = LG(el);
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
            var LGel = LG(el);
            var wWidth = document.body.clientWidth;
            // using innerWidth to include mobile safari bottom bar
            var wHeight = window.innerHeight;
            var elWidth = LGel.width();
            var elHeight = LGel.height();
            var elStyle = LGel.style();
            var x = (wWidth - elWidth) / 2 -
                (LGel.offset().left +
                    parseFloat(elStyle.paddingLeft) +
                    parseFloat(elStyle.borderLeft)) +
                LG(window).scrollLeft();
            var y = (wHeight - elHeight) / 2 -
                (LGel.offset().top +
                    parseFloat(elStyle.paddingTop) +
                    parseFloat(elStyle.borderTop)) +
                LG(window).scrollTop();
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
        getDynamicOptions: function (items, extraProps, getCaptionFromTitleOrAlt, exThumbImage) {
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
                var currentItem = LG(item);
                var alt = currentItem.find('img').first().attr('alt');
                var title = currentItem.attr('title');
                var thumb = exThumbImage
                    ? currentItem.attr(exThumbImage)
                    : currentItem.find('img').first().attr('src');
                dynamicEl.thumb = thumb;
                if (getCaptionFromTitleOrAlt && !dynamicEl.subHtml) {
                    dynamicEl.subHtml = title || alt || '';
                }
                dynamicEl.alt = alt || title || '';
                dynamicElements.push(dynamicEl);
            });
            return dynamicElements;
        },
    };

    var defaults = {
        mode: 'lg-slide',
        // Ex : 'ease'
        easing: 'ease',
        /**
         * @default 400
         */
        speed: 400,
        height: '100%',
        width: '100%',
        addClass: '',
        startClass: 'lg-start-zoom',
        backdropDuration: 150,
        container: document.body,
        // Zoom from image animation duration
        startAnimationDuration: 350,
        /**
         * @desc - Zoom from image effect - Supports only images
         * Will be false if dynamic option is enabled or galleryID found in the URL
         * Setting startClass will be empty if zoomFromImage is true to avoid css conflicts.
         *
         */
        zoomFromImage: true,
        // Set 0, if u don't want to hide the controls
        hideBarsDelay: 2000,
        showBarsAfter: 0,
        supportLegacyBrowser: true,
        // If true sub-html will also be hidden along with controls and toolbar if hideBarDelay is more than 0
        hideSubHtml: false,
        useLeft: false,
        // aria-labelledby attribute fot gallery
        ariaLabelledby: '',
        //aria-describedby attribute for gallery
        ariaDescribedby: '',
        closable: true,
        swipeToClose: true,
        closeOnTap: true,
        showCloseIcon: true,
        loop: true,
        escKey: true,
        keyPress: true,
        controls: true,
        slideEndAnimatoin: true,
        hideControlOnEnd: false,
        mousewheel: false,
        getCaptionFromTitleOrAlt: true,
        // .lg-item || '.lg-sub-html'
        appendSubHtmlTo: '.lg-sub-html',
        subHtmlSelectorRelative: false,
        /**
         * @desc number of preload slides
         * will exicute only after the current slide is fully loaded.
         *
         * @ex you clicked on 4th image and if preload = 1 then 3rd slide and 5th
         * slide will be loaded in the background after the 4th slide is fully loaded..
         * if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
         *
         */
        preload: 3,
        numberOfSlideItemsInDom: 10,
        showAfterLoad: true,
        selector: '',
        selectWithin: '',
        nextHtml: '',
        prevHtml: '',
        // 0, 1
        index: false,
        iframeMaxWidth: '100%',
        download: true,
        counter: true,
        appendCounterTo: '.lg-toolbar',
        swipeThreshold: 50,
        enableSwipe: true,
        enableDrag: true,
        dynamic: false,
        dynamicEl: [],
        extraProps: [],
        galleryId: 1,
        customSlideName: false,
        exThumbImage: '',
        isMobile: function () {
            var isMobile = false;
            (function (a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) ||
                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                    isMobile = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            return isMobile;
        },
        mobileSettings: {
            controls: false,
            showCloseIcon: false,
        },
    };

    window.LG = LG;
    var lgId = 0;
    window.lgModules = window.lgModules || {};
    var LightGallery = /** @class */ (function () {
        function LightGallery(element, options) {
            this.lgOpened = false;
            this.index = 0;
            // lightGallery modules
            this.modules = {};
            // false when lightGallery load first slide content;
            this.lGalleryOn = false;
            // True when a slide animation is in progress
            this.lgBusy = false;
            this.currentItemsInDom = [];
            // Scroll top value before lightGallery is opened
            this.prevScrollTop = 0;
            lgId++;
            this.lgId = lgId;
            this.el = element;
            this.LGel = LG(element);
            // lightGallery settings
            this.s = Object.assign({}, defaults, options);
            if (this.s.isMobile()) {
                var mobileSettings = Object.assign({}, this.s.mobileSettings, options.mobileSettings);
                this.s = Object.assign(this.s, mobileSettings);
            }
            // When using dynamic mode, ensure dynamicEl is an array
            if (this.s.dynamic &&
                this.s.dynamicEl !== undefined &&
                !Array.isArray(this.s.dynamicEl)) {
                throw 'When using dynamic mode, you must also define dynamicEl as an Array.';
            }
            if (this.s.slideEndAnimatoin) {
                this.s.hideControlOnEnd = false;
            }
            // Need to disable zoomFromImage if gallery is opened from url (Hash plugin)
            // And reset it on close to get the correct value next time
            this.zoomFromImage = this.s.zoomFromImage;
            // Gallery items
            this.galleryItems = this.getItems();
            // At the moement, Zoom from image doesn't support dynamic options
            // @todo add zoomFromImage support for dynamic images
            if (this.s.dynamic) {
                this.zoomFromImage = false;
            }
            // s.preload should not be grater than $item.length
            this.s.preload = Math.min(this.s.preload, this.galleryItems.length);
            this.init();
            return this;
        }
        LightGallery.prototype.init = function () {
            var _this = this;
            this.addSlideVideoInfo(this.galleryItems);
            var fromHash = this.buildFromHash();
            var openGalleryAfter = 0;
            if (!fromHash) {
                openGalleryAfter = this.buildStructure();
            }
            if (this.s.keyPress) {
                this.keyPress();
            }
            setTimeout(function () {
                _this.enableDrag();
                _this.enableSwipe();
            }, 50);
            if (this.galleryItems.length > 1) {
                this.arrow();
                if (this.s.mousewheel) {
                    this.mousewheel();
                }
            }
            if (this.s.dynamic) {
                var index_1 = this.s.index || 0;
                setTimeout(function () {
                    _this.openGallery(index_1);
                }, openGalleryAfter);
            }
            else {
                var _loop_1 = function (index) {
                    var element = this_1.items[index];
                    // Using different namespace for click because click event should not unbind if selector is same object('this')
                    // @todo manage all event listners - should have namespace that represent element
                    LG(element).on("click.lgcustom-item-" + index, function (e) {
                        e.preventDefault();
                        var currentItemIndex = _this.s.index || index;
                        var transform;
                        if (_this.zoomFromImage) {
                            var imageSize = utils.getSize(element);
                            transform = utils.getTransform(element, imageSize);
                        }
                        _this.openGallery(currentItemIndex, transform);
                    });
                };
                var this_1 = this;
                // Using for loop instead of using bubbling as the items can be any html element.
                for (var index = 0; index < this.items.length; index++) {
                    _loop_1(index);
                }
            }
        };
        LightGallery.prototype.buildModules = function () {
            var _this = this;
            // module constructor
            // Modules are build incrementally.
            // Gallery should be opened only once all the modules are initialized.
            // use moduleBuildTimeout to make sure this
            var numberOfModules = 0;
            var _loop_2 = function (key) {
                numberOfModules++;
                (function (num) {
                    setTimeout(function () {
                        _this.modules[key] = new window.lgModules[key](_this);
                    }, 10 * num);
                })(numberOfModules);
            };
            for (var key in window.lgModules) {
                _loop_2(key);
            }
            return numberOfModules * 10;
        };
        LightGallery.prototype.getSlideItem = function (index) {
            return LG(this.getSlideItemId(index));
        };
        LightGallery.prototype.getSlideItemId = function (index) {
            return "#lg-item-" + this.lgId + "-" + index;
        };
        LightGallery.prototype.getById = function (id) {
            return id + "-" + this.lgId;
        };
        LightGallery.prototype.buildStructure = function () {
            var _this = this;
            var container = LG("#" + this.getById('lg-container')).get();
            if (container) {
                return 0;
            }
            var controls = '';
            var subHtmlCont = '';
            // Create controls
            if (this.s.controls && this.galleryItems.length > 1) {
                controls = "<button type=\"button\" id=\"" + this.getById('lg-prev') + "\" aria-label=\"Previous slide\" class=\"lg-prev lg-icon\"> " + this.s.prevHtml + " </button>\n                <button type=\"button\" id=\"" + this.getById('lg-next') + "\" aria-label=\"Next slide\" class=\"lg-next lg-icon\"> " + this.s.nextHtml + " </button>";
            }
            if (this.s.appendSubHtmlTo === '.lg-sub-html') {
                subHtmlCont =
                    '<div class="lg-sub-html" role="status" aria-live="polite"></div>';
            }
            var addClasses = '';
            if (this.s.hideSubHtml) {
                // Do not remove space before last single quote
                addClasses += 'lg-hide-sub-html ';
            }
            var ariaLabelledby = this.s.ariaLabelledby
                ? 'aria-labelledby="' + this.s.ariaLabelledby + '"'
                : '';
            var ariaDescribedby = this.s.ariaDescribedby
                ? 'aria-describedby="' + this.s.ariaDescribedby + '"'
                : '';
            var containerClassName = "lg-container " + (document.body !== this.s.container ? 'lg-inline' : '');
            var closeIcon = this.s.showCloseIcon
                ? "<button type=\"button\" aria-label=\"Close gallery\" id=\"" + this.getById('lg-close') + "\" class=\"lg-close lg-icon\"></button>"
                : '';
            var template = "\n        <div class=\"" + containerClassName + "\" id=\"" + this.getById('lg-container') + "\" tabindex=\"-1\" aria-modal=\"true\" " + ariaLabelledby + " " + ariaDescribedby + " role=\"dialog\"\n        >\n            <div id=\"" + this.getById('lg-backdrop') + "\" class=\"lg-backdrop\"></div>\n\n            <div id=\"" + this.getById('lg-outer') + "\" class=\"lg-outer lg-hide-items " + this.s.addClass + " " + addClasses + "\">\n                    <div class=\"lg\" style=\"width: " + this.s.width + "; height:" + this.s.height + "\">\n                        <div id=\"" + this.getById('lg-inner') + "\" class=\"lg-inner\"></div>\n                        <div id=\"" + this.getById('lg-toolbar') + "\" class=\"lg-toolbar lg-group\">\n                        " + closeIcon + "\n                    </div>\n                    " + controls + "\n                    " + subHtmlCont + "\n                </div> \n            </div>\n        </div>\n        ";
            LG(this.s.container).css('position', 'relative').append(template);
            this.outer = LG("#" + this.getById('lg-outer'));
            this.outer.get().focus();
            if (this.s.useLeft) {
                this.outer.addClass('lg-use-left');
                // Set mode lg-slide if use left is true;
                this.s.mode = 'lg-slide';
            }
            else {
                this.outer.addClass('lg-use-css3');
            }
            // add Class for css support and transition mode
            if (this.doCss()) {
                this.outer.addClass('lg-css3');
            }
            else {
                this.outer.addClass('lg-css');
                // Set speed 0 because no animation will happen if browser doesn't support css3
                this.s.speed = 0;
            }
            this.outer.addClass(this.s.mode);
            if (this.s.enableDrag && this.galleryItems.length > 1) {
                this.outer.addClass('lg-grab');
            }
            if (this.s.showAfterLoad) {
                this.outer.addClass('lg-show-after-load');
            }
            if (this.doCss()) {
                var $inner = LG("#" + this.getById('lg-inner'));
                $inner.css('transition-timing-function', this.s.easing);
                $inner.css('transition-duration', this.s.speed + 'ms');
            }
            if (this.s.download) {
                this.outer
                    .find('.lg-toolbar')
                    .append("<a id=\"" + this.getById('lg-download') + "\" target=\"_blank\" aria-label=\"Download\" download class=\"lg-download lg-icon\"></a>");
            }
            this.counter();
            LG(window).on("resize.lg.global" + this.lgId + " orientationchange.lg.global" + this.lgId, function () {
                if (_this.zoomFromImage && !_this.s.dynamic && _this.lgOpened) {
                    var imgStyle = _this.getDummyImgStyles();
                    _this.outer
                        .find('.lg-current .lg-dummy-img')
                        .first()
                        .attr('style', imgStyle);
                }
            });
            this.hideBars();
            this.closeGallery();
            return this.buildModules();
        };
        // Append new slides dynamically while gallery is open
        // Items has to in the form of an array of dynamicEl
        LightGallery.prototype.appendSlides = function (items) {
            this.galleryItems = this.galleryItems.concat(items);
            LG("#" + this.getById('lg-counter-all')).html(this.galleryItems.length + '');
            this.LGel.trigger('appendSlides.lg', { items: items });
        };
        // Get gallery items based on multiple conditions
        // @todo - remove this.$items
        LightGallery.prototype.getItems = function () {
            // Gallery items
            this.items = [];
            if (!this.s.dynamic) {
                if (this.s.selector === 'this') {
                    this.items.push(this.el);
                }
                else if (this.s.selector) {
                    if (this.s.selectWithin) {
                        var selectWithin = LG(this.s.selectWithin);
                        this.items = selectWithin.find(this.s.selector).get();
                    }
                    else {
                        this.items = this.el.querySelectorAll(this.s.selector);
                    }
                }
                else {
                    this.items = this.el.children;
                }
                return utils.getDynamicOptions(this.items, this.s.extraProps, this.s.getCaptionFromTitleOrAlt, this.s.exThumbImage);
            }
            else {
                return this.s.dynamicEl || [];
            }
        };
        /**
         * Build Gallery
         * @param {Number} index  - index of the slide
         * @param {String} transform - Css transform value when zoomFromImage is enabled
         */
        LightGallery.prototype.openGallery = function (index, transform) {
            var _this = this;
            // prevent accidental double execution
            if (this.lgOpened)
                return;
            this.lgOpened = true;
            var backdrop = LG("#" + this.getById('lg-backdrop'));
            var container = LG("#" + this.getById('lg-container'));
            this.outer.removeClass('lg-hide-items');
            if (!this.zoomFromImage || !transform) {
                this.outer.addClass(this.s.startClass);
            }
            else if (this.zoomFromImage && transform) {
                this.outer.addClass('lg-zoom-from-image');
            }
            backdrop.css('transition-duration', this.s.backdropDuration + 'ms');
            var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, index);
            this.currentItemsInDom = itemsToBeInsertedToDom;
            var items = '';
            itemsToBeInsertedToDom.forEach(function (item) {
                items = items + ("<div id=\"" + item + "\" class=\"lg-item\"></div>");
            });
            LG("#" + this.getById('lg-inner')).append(items);
            if (!this.zoomFromImage || !transform) {
                this.getSlideItem(index).removeClass('lg-complete');
            }
            this.LGel.trigger('onBeforeOpen.lg');
            // add class lg-current to remove initial transition
            this.getSlideItem(index).addClass('lg-current');
            this.lGalleryOn = false;
            setTimeout(function () {
                // Store the current scroll top value to scroll back after closing the gallery..
                _this.prevScrollTop = LG(window).scrollTop();
                _this.index = index;
                // Need to check both zoomFromImage and transform values as we need to set set the
                // default opening animation if user missed to add the lg-size attribute
                if (_this.zoomFromImage && transform) {
                    _this.getSlideItem(index)
                        .addClass('start-end-progress')
                        .css('transform', transform)
                        .css('transition-duration', _this.s.startAnimationDuration + 'ms');
                    setTimeout(function () {
                        _this.getSlideItem(index).css('transform', 'translate3d(0, 0, 0) translate3d(0, 0, 0)');
                    }, 100);
                }
                container.addClass('lg-show');
                setTimeout(function () {
                    backdrop.addClass('in');
                    container.addClass('lg-show-in');
                }, 10);
                // lg-visible class resets gallery opacity to 1
                if (!_this.zoomFromImage || !transform) {
                    setTimeout(function () {
                        _this.outer.addClass('lg-visible');
                    }, _this.s.backdropDuration);
                }
                // initiate slide function
                _this.slide(index, false, false, false);
                _this.LGel.trigger('onAfterOpen.lg');
            });
            LG(document.body).addClass('lg-on');
        };
        // Build Gallery if gallery id exist in the URL
        LightGallery.prototype.buildFromHash = function () {
            var _this = this;
            // if dynamic option is enabled execute immediately
            var _hash = window.location.hash;
            if (_hash.indexOf('lg=' + this.s.galleryId) > 0) {
                // This class is used to remove the initial animation if galleryId present in the URL
                LG(document.body).addClass('lg-from-hash');
                this.zoomFromImage = false;
                var index_2 = this.getIndexFromUrl(_hash);
                var openGalleryAfter = this.buildStructure();
                setTimeout(function () {
                    _this.openGallery(index_2);
                }, openGalleryAfter);
                return true;
            }
        };
        LightGallery.prototype.hideBars = function () {
            var _this = this;
            // Hide controllers if mouse doesn't move for some period
            setTimeout(function () {
                _this.outer.removeClass('lg-hide-items');
                if (_this.s.hideBarsDelay > 0) {
                    _this.outer.on('mousemove.lg click.lg touchstart.lg', function () {
                        _this.outer.removeClass('lg-hide-items');
                        clearTimeout(_this.hideBarTimeout);
                        // Timeout will be cleared on each slide movement also
                        _this.hideBarTimeout = setTimeout(function () {
                            _this.outer.addClass('lg-hide-items');
                        }, _this.s.hideBarsDelay);
                    });
                    _this.outer.trigger('mousemove.lg');
                }
            }, this.s.showBarsAfter);
        };
        // Find css3 support
        LightGallery.prototype.doCss = function () {
            var supported = false;
            var transition = [
                'transition',
                'MozTransition',
                'WebkitTransition',
                'OTransition',
                'msTransition',
                'KhtmlTransition',
            ];
            var root = document.documentElement;
            for (var i = 0; i < transition.length; i++) {
                if (transition[i] in root.style) {
                    supported = true;
                    break;
                }
            }
            return supported;
        };
        /**
         *  @desc Create image counter
         *  Ex: 1/10
         */
        LightGallery.prototype.counter = function () {
            if (this.s.counter) {
                var counterHtml = "<div class=\"lg-counter\" role=\"status\" aria-live=\"polite\">\n                <span id=\"" + this.getById('lg-counter-current') + "\" class=\"lg-counter-current\">" + (this.index + 1) + " </span> / \n                <span id=\"" + this.getById('lg-counter-all') + "\" class=\"lg-counter-all\">" + this.galleryItems.length + " </span></div>";
                this.outer.find(this.s.appendCounterTo).append(counterHtml);
            }
        };
        /**
         *  @desc add sub-html into the slide
         *  @param {Number} index - index of the slide
         */
        LightGallery.prototype.addHtml = function (index) {
            var subHtml;
            var subHtmlUrl;
            if (this.galleryItems[index].subHtmlUrl) {
                subHtmlUrl = this.galleryItems[index].subHtmlUrl;
            }
            else {
                subHtml = this.galleryItems[index].subHtml;
            }
            if (!subHtmlUrl) {
                if (subHtml) {
                    // get first letter of subhtml
                    // if first letter starts with . or # get the html form the jQuery object
                    var fL = subHtml.substring(0, 1);
                    if (fL === '.' || fL === '#') {
                        if (this.s.subHtmlSelectorRelative && !this.s.dynamic) {
                            subHtml = LG(this.items)
                                .eq(index)
                                .find(subHtml)
                                .first()
                                .html();
                        }
                        else {
                            subHtml = LG(subHtml).first().html();
                        }
                    }
                }
                else {
                    subHtml = '';
                }
            }
            if (this.s.appendSubHtmlTo === '.lg-sub-html') {
                if (subHtmlUrl) {
                    this.outer.find('.lg-sub-html').load(subHtmlUrl);
                }
                else {
                    this.outer.find('.lg-sub-html').html(subHtml);
                }
            }
            else {
                var currentSlide = LG(this.getSlideItemId(index));
                if (subHtmlUrl) {
                    currentSlide.load(subHtmlUrl);
                }
                else {
                    currentSlide.append("<div class=\"lg-sub-html\">" + subHtml + "</div>");
                }
            }
            // Add lg-empty-html class if title doesn't exist
            if (typeof subHtml !== 'undefined' && subHtml !== null) {
                if (subHtml === '') {
                    this.outer
                        .find(this.s.appendSubHtmlTo)
                        .addClass('lg-empty-html');
                }
                else {
                    this.outer
                        .find(this.s.appendSubHtmlTo)
                        .removeClass('lg-empty-html');
                }
            }
            this.LGel.trigger('onAfterAppendSubHtml.lg', { index: index });
        };
        /**
         *  @desc Preload slides
         *  @param {Number} index - index of the slide
         * @todo preload not working for the first slide, Also, should work for the first and last slide as well
         */
        LightGallery.prototype.preload = function (index) {
            for (var i = 1; i <= this.s.preload; i++) {
                if (i >= this.galleryItems.length - index) {
                    break;
                }
                this.loadContent(index + i, false, false);
            }
            for (var j = 1; j <= this.s.preload; j++) {
                if (index - j < 0) {
                    break;
                }
                this.loadContent(index - j, false, false);
            }
        };
        LightGallery.prototype.getDummyImgStyles = function (imageSize) {
            imageSize =
                imageSize || utils.getSize(LG(this.items).eq(this.index).get());
            if (!imageSize)
                return '';
            return "width:" + imageSize.width + "px; \n                margin-left: -" + imageSize.width / 2 + "px;\n                margin-top: -" + imageSize.height / 2 + "px; \n                height:" + imageSize.height + "px";
        };
        LightGallery.prototype.setImgMarkup = function (src, $currentSlide, index) {
            // Use the thumbnail as dummy image which will be resized to actual image size and
            // displayed on top of actual image
            var _dummyImgSrc;
            var imgContnet = '';
            var imageSize;
            var $currentItem;
            if (!this.s.dynamic) {
                $currentItem = LG(this.items).eq(index);
                imageSize = utils.getSize($currentItem.get());
            }
            var currentDynamicItem = this.galleryItems[index];
            var alt = currentDynamicItem.alt
                ? 'alt="' + currentDynamicItem.alt + '"'
                : '';
            if (!this.lGalleryOn && this.zoomFromImage && imageSize) {
                if (imageSize && $currentItem) {
                    if (!this.s.exThumbImage) {
                        _dummyImgSrc = $currentItem.find('img').first().attr('src');
                    }
                    else {
                        _dummyImgSrc = $currentItem.attr(this.s.exThumbImage);
                    }
                    var imgStyle = this.getDummyImgStyles(imageSize);
                    var dummyImgContent = "<img " + alt + " style=\"" + imgStyle + "\" class=\"lg-dummy-img\" src=\"" + _dummyImgSrc + "\" />";
                    $currentSlide.addClass('lg-first-slide');
                    imgContnet = dummyImgContent;
                }
            }
            else {
                imgContnet = " <img " + alt + " class=\"lg-object lg-image\" data-index=\"" + index + "\" src=\"" + src + "\" /> ";
            }
            var imgMarkup = "<div class=\"lg-img-wrap\"> " + imgContnet + "</div>";
            $currentSlide.prepend(imgMarkup);
        };
        LightGallery.prototype.onLgObjectLoad = function ($el, index, delay, speed, dummyImageLoaded) {
            var _this = this;
            if (dummyImageLoaded) {
                this.LGel.trigger('onSlideItemLoad.lg', {
                    index: index,
                    delay: delay || 0,
                });
            }
            $el.find('.lg-object')
                .first()
                .on('load.lg error.lg', function () {
                _this.handleLgObjectLoad($el, index, delay, speed, dummyImageLoaded);
            });
        };
        LightGallery.prototype.handleLgObjectLoad = function ($el, index, delay, speed, dummyImageLoaded) {
            var _this = this;
            setTimeout(function () {
                $el.addClass('lg-complete lg-complete_');
                if (!dummyImageLoaded) {
                    _this.LGel.trigger('onSlideItemLoad.lg', {
                        index: index,
                        delay: delay || 0,
                    });
                }
            }, speed);
        };
        /**
         * @desc Check the given src is video
         * @param {String} src
         * @return {Object} video type
         * Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
         *
         * @todo - this information can be moved to dynamicEl to avoid frequent calls
         */
        LightGallery.prototype.isVideo = function (src, index) {
            if (!src) {
                if (this.galleryItems[index].video) {
                    return {
                        html5: true,
                    };
                }
                else {
                    console.error('lightGallery :- data-src is not provided on slide item ' +
                        (index + 1) +
                        '. Please make sure the selector property is properly configured. More info - http://sachinchoolur.github.io/lightGallery/demos/html-markup.html');
                    return;
                }
            }
            var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i);
            var vimeo = src.match(/\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)/i);
            var wistia = src.match(/https?:\/\/(.+)?(wistia\.com|wi\.st)\/(medias|embed)\/([0-9a-z\-_]+)(.*)/);
            if (youtube) {
                return {
                    youtube: youtube,
                };
            }
            else if (vimeo) {
                return {
                    vimeo: vimeo,
                };
            }
            else if (wistia) {
                return {
                    wistia: wistia,
                };
            }
        };
        // Add video slideInfo
        LightGallery.prototype.addSlideVideoInfo = function (items) {
            var _this = this;
            items.forEach(function (element, index) {
                element.__slideVideoInfo = _this.isVideo(element.src, index);
            });
        };
        /**
         *  @desc Load slide content into slide.
         *  @param {Number} index - index of the slide.
         *  @param {Boolean} rec - if true call loadcontent() function again.
         *  @param {Boolean} firstSlide - For setting the delay.
         */
        LightGallery.prototype.loadContent = function (index, rec, firstSlide) {
            var _this = this;
            var _$img;
            var _src;
            var _poster;
            var currentDynamicItem = this.galleryItems[index];
            var $currentSlide = LG(this.getSlideItemId(index));
            if (currentDynamicItem.poster) {
                _poster = currentDynamicItem.poster;
            }
            var _html5Video = currentDynamicItem.video && JSON.parse(currentDynamicItem.video);
            _src = currentDynamicItem.src;
            if (currentDynamicItem.responsive) {
                var srcDyItms = currentDynamicItem.responsive.split(',');
                _src = utils.getResponsiveSrc(srcDyItms) || _src;
            }
            var _srcset = currentDynamicItem.srcset;
            var _sizes = currentDynamicItem.sizes;
            var iframe = false;
            if (this.galleryItems[index].iframe) {
                iframe = true;
            }
            var imageSize;
            if (!this.s.dynamic) {
                var $currentItem = this.items[index];
                imageSize = utils.getSize($currentItem);
            }
            // delay for adding complete class. it is 0 except first time.
            var delay = 0;
            if (firstSlide) {
                if (this.zoomFromImage && imageSize) {
                    delay = this.s.startAnimationDuration + 10;
                }
                else {
                    delay = this.s.backdropDuration + 10;
                }
            }
            var videoInfo = currentDynamicItem.__slideVideoInfo;
            if (!$currentSlide.hasClass('lg-loaded')) {
                if (iframe) {
                    var markup = utils.getIframeMarkup(_src, this.s.iframeMaxWidth);
                    $currentSlide.prepend(markup);
                }
                else if (_poster) {
                    var markup = utils.getVideoPosterMarkup(_poster, videoInfo);
                    $currentSlide.prepend(markup);
                    this.LGel.trigger('hasVideo.lg', {
                        index: index,
                        src: _src,
                        html5Video: _html5Video,
                        hasPoster: true,
                    });
                }
                else if (videoInfo) {
                    var markup = '<div class="lg-video-cont "><div class="lg-video"></div></div>';
                    $currentSlide.prepend(markup);
                    this.LGel.trigger('hasVideo.lg', {
                        index: index,
                        src: _src,
                        html5Video: _html5Video,
                        hasPoster: false,
                    });
                }
                else {
                    this.setImgMarkup(_src, $currentSlide, index);
                }
                this.LGel.trigger('onAferAppendSlide.lg', { index: index });
                _$img = $currentSlide.find('.lg-object');
                if (_sizes) {
                    _$img.attr('sizes', _sizes);
                }
                if (_srcset) {
                    _$img.attr('srcset', _srcset);
                    if (this.s.supportLegacyBrowser) {
                        try {
                            picturefill({
                                elements: [_$img.get()],
                            });
                        }
                        catch (e) {
                            console.warn('lightGallery :- If you want srcset to be supported for older browser please include picturefil javascript library in your document.');
                        }
                    }
                }
                if (this.s.appendSubHtmlTo !== '.lg-sub-html') {
                    this.addHtml(index);
                }
            }
            // For first time add some delay for displaying the start animation.
            var _speed = 0;
            // Do not change the delay value because it is required for zoom plugin.
            // If gallery opened from direct url (hash) speed value should be 0
            if (delay && !LG(document.body).hasClass('lg-from-hash')) {
                _speed = delay;
            }
            // Only for first slide
            if (!this.lGalleryOn && this.zoomFromImage && imageSize) {
                setTimeout(function () {
                    $currentSlide
                        .removeClass('start-end-progress')
                        .removeAttr('style');
                }, this.s.startAnimationDuration + 100);
                if (!$currentSlide.hasClass('lg-loaded')) {
                    setTimeout(function () {
                        $currentSlide
                            .find('.lg-img-wrap')
                            .append("<img class=\"lg-object lg-image\" data-index=\"" + index + "\" src=\"" + _src + "\" />");
                        _this.onLgObjectLoad($currentSlide, index, delay, _speed, true);
                        $currentSlide
                            .find('.lg-object')
                            .first()
                            .on('load.lg error.lg', function () {
                            _this.loadContentOnLoad(index, $currentSlide, _speed);
                        });
                    }, this.s.startAnimationDuration + 100);
                }
            }
            $currentSlide.addClass('lg-loaded');
            this.onLgObjectLoad($currentSlide, index, delay, _speed, false);
            // @todo check load state for html5 videos
            if (videoInfo && videoInfo.html5 && !_poster) {
                $currentSlide.addClass('lg-complete lg-complete_');
            }
            // When gallery is opened once content is loaded (second time) need to add lg-complete class for css styling
            if ((!this.zoomFromImage || !imageSize) &&
                $currentSlide.hasClass('lg-complete_') &&
                firstSlide) {
                setTimeout(function () {
                    $currentSlide.addClass('lg-complete');
                }, this.s.backdropDuration);
            }
            // Content loaded
            // Need to set lGalleryOn before calling preload function
            this.lGalleryOn = true;
            if (rec === true) {
                if (!$currentSlide.hasClass('lg-complete_')) {
                    $currentSlide
                        .find('.lg-object')
                        .first()
                        .on('load.lg error.lg', function () {
                        _this.preload(index);
                    });
                }
                else {
                    this.preload(index);
                }
            }
        };
        LightGallery.prototype.loadContentOnLoad = function (index, $currentSlide, speed) {
            var _this = this;
            setTimeout(function () {
                $currentSlide.find('.lg-dummy-img').remove();
                $currentSlide.removeClass('lg-first-slide');
                _this.preload(index);
            }, speed + 300);
        };
        LightGallery.prototype.getItemsToBeInsertedToDom = function (index, prevIndex, numberOfItems) {
            var _this = this;
            if (numberOfItems === void 0) { numberOfItems = 0; }
            var itemsToBeInsertedToDom = [];
            // Minimum 2 items should be there
            var possibleNumberOfItems = Math.max(numberOfItems, 3);
            possibleNumberOfItems = Math.min(possibleNumberOfItems, this.galleryItems.length);
            var prevIndexItem = "lg-item-" + this.lgId + "-" + prevIndex;
            if (this.galleryItems.length <= 3) {
                this.galleryItems.forEach(function (element, index) {
                    itemsToBeInsertedToDom.push("lg-item-" + _this.lgId + "-" + index);
                });
                return itemsToBeInsertedToDom;
            }
            if (index < (this.galleryItems.length - 1) / 2) {
                for (var idx = index; idx > index - possibleNumberOfItems / 2 && idx >= 0; idx--) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
                }
                var numberOfExistingItems = itemsToBeInsertedToDom.length;
                for (var idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index + idx + 1));
                }
            }
            else {
                for (var idx = index; idx <= this.galleryItems.length - 1 &&
                    idx < index + possibleNumberOfItems / 2; idx++) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
                }
                var numberOfExistingItems = itemsToBeInsertedToDom.length;
                for (var idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index - idx - 1));
                }
            }
            if (this.s.loop) {
                if (index === this.galleryItems.length - 1) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + 0);
                }
                else if (index === 0) {
                    itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (this.galleryItems.length - 1));
                }
            }
            if (itemsToBeInsertedToDom.indexOf(prevIndexItem) === -1) {
                itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + prevIndex);
            }
            return itemsToBeInsertedToDom;
        };
        /**
        *   @desc slide function for lightgallery
            ** Slide() gets call on start
            ** ** Set lg.on true once slide() function gets called.
            ** Call loadContent() on slide() function inside setTimeout
            ** ** On first slide we do not want any animation like slide of fade
            ** ** So on first slide( if lg.on if false that is first slide) loadContent() should start loading immediately
            ** ** Else loadContent() should wait for the transition to complete.
            ** ** So set timeout s.speed + 50
        <=> ** loadContent() will load slide content in to the particular slide
            ** ** It has recursion (rec) parameter. if rec === true loadContent() will call preload() function.
            ** ** preload will execute only when the previous slide is fully loaded (images iframe)
            ** ** avoid simultaneous image load
        <=> ** Preload() will check for s.preload value and call loadContent() again accoring to preload value
            ** loadContent()  <====> Preload();
        
        *   @param {Number} index - index of the slide
        *   @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
        *   @param {Boolean} fromThumb - true if slide function called via thumbnail click
        *   @param {String} direction - Direction of the slide(next/prev)
        */
        LightGallery.prototype.slide = function (index, fromTouch, fromThumb, direction) {
            var _this = this;
            var _prevIndex = 0;
            try {
                var currentItemId = this.outer
                    .find('.lg-current')
                    .first()
                    .attr('id');
                _prevIndex = parseInt(currentItemId.split('-')[3]) || 0;
            }
            catch (error) {
                _prevIndex = 0;
            }
            var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, _prevIndex, this.s.numberOfSlideItemsInDom);
            itemsToBeInsertedToDom.forEach(function (item) {
                if (_this.currentItemsInDom.indexOf(item) === -1) {
                    LG("#" + _this.getById('lg-inner')).append("<div id=\"" + item + "\" class=\"lg-item\"></div>");
                }
            });
            this.currentItemsInDom.forEach(function (item) {
                if (itemsToBeInsertedToDom.indexOf(item) === -1) {
                    LG("#" + item).remove();
                }
            });
            this.currentItemsInDom = itemsToBeInsertedToDom;
            // Prevent if multiple call
            // Required for hsh plugin
            if (this.lGalleryOn && _prevIndex === index) {
                return;
            }
            var _length = this.galleryItems.length;
            var _time = this.lGalleryOn ? this.s.speed : 0;
            if (!this.lgBusy) {
                if (this.s.download) {
                    var _src = this.galleryItems[index].downloadUrl !== false &&
                        (this.galleryItems[index].downloadUrl ||
                            this.galleryItems[index].src);
                    if (_src) {
                        LG("#" + this.getById('lg-download')).attr('href', _src);
                        this.outer.removeClass('lg-hide-download');
                    }
                    else {
                        this.outer.addClass('lg-hide-download');
                    }
                }
                LG(this.el).trigger('onBeforeSlide.lg', {
                    prevIndex: _prevIndex,
                    index: index,
                    fromTouch: fromTouch,
                    fromThumb: fromThumb,
                });
                this.lgBusy = true;
                clearTimeout(this.hideBarTimeout);
                // Add title if this.s.appendSubHtmlTo === lg-sub-html
                if (this.s.appendSubHtmlTo === '.lg-sub-html') {
                    // wait for slide animation to complete
                    setTimeout(function () {
                        _this.addHtml(index);
                    }, _time);
                }
                this.arrowDisable(index);
                if (!direction) {
                    if (index < _prevIndex) {
                        direction = 'prev';
                    }
                    else if (index > _prevIndex) {
                        direction = 'next';
                    }
                }
                if (!fromTouch) {
                    // remove all transitions
                    this.outer.addClass('lg-no-trans');
                    this.outer
                        .find('.lg-item')
                        .removeClass('lg-prev-slide lg-next-slide');
                    if (direction === 'prev') {
                        //prevslide
                        this.getSlideItem(index).addClass('lg-prev-slide');
                        this.getSlideItem(_prevIndex).addClass('lg-next-slide');
                    }
                    else {
                        // next slide
                        this.getSlideItem(index).addClass('lg-next-slide');
                        this.getSlideItem(_prevIndex).addClass('lg-prev-slide');
                    }
                    // give 50 ms for browser to add/remove class
                    setTimeout(function () {
                        _this.outer.find('.lg-item').removeClass('lg-current');
                        //this.getSlideItem(_prevIndex).removeClass('lg-current');
                        _this.getSlideItem(index).addClass('lg-current');
                        // reset all transitions
                        _this.outer.removeClass('lg-no-trans');
                    }, 50);
                }
                else {
                    this.outer
                        .find('.lg-item')
                        .removeClass('lg-prev-slide lg-current lg-next-slide');
                    var touchPrev = void 0;
                    var touchNext = void 0;
                    if (_length > 2) {
                        touchPrev = index - 1;
                        touchNext = index + 1;
                        if (index === 0 && _prevIndex === _length - 1) {
                            // next slide
                            touchNext = 0;
                            touchPrev = _length - 1;
                        }
                        else if (index === _length - 1 && _prevIndex === 0) {
                            // prev slide
                            touchNext = 0;
                            touchPrev = _length - 1;
                        }
                    }
                    else {
                        touchPrev = 0;
                        touchNext = 1;
                    }
                    if (direction === 'prev') {
                        this.getSlideItem(touchNext).addClass('lg-next-slide');
                    }
                    else {
                        this.getSlideItem(touchPrev).addClass('lg-prev-slide');
                    }
                    this.getSlideItem(index).addClass('lg-current');
                }
                if (this.lGalleryOn) {
                    setTimeout(function () {
                        _this.loadContent(index, true, false);
                    }, this.s.speed + 50);
                    setTimeout(function () {
                        _this.lgBusy = false;
                        _this.LGel.trigger('onAfterSlide.lg', {
                            prevIndex: _prevIndex,
                            index: index,
                            fromTouch: fromTouch,
                            fromThumb: fromThumb,
                        });
                    }, this.s.speed);
                }
                else {
                    this.loadContent(index, true, true);
                    this.lgBusy = false;
                    this.LGel.trigger('onAfterSlide.lg', {
                        prevIndex: _prevIndex,
                        index: index,
                        fromTouch: fromTouch,
                        fromThumb: fromThumb,
                    });
                }
                if (this.s.counter) {
                    LG("#" + this.getById('lg-counter-current')).html(index + 1 + '');
                }
            }
            this.index = index;
        };
        LightGallery.prototype.touchMove = function (startCoords, endCoords) {
            var distanceX = endCoords.pageX - startCoords.pageX;
            var distanceY = endCoords.pageY - startCoords.pageY;
            var allowSwipe = false;
            if (this.swipeDirection) {
                allowSwipe = true;
            }
            else {
                if (Math.abs(distanceX) > 15) {
                    this.swipeDirection = 'horizontal';
                    allowSwipe = true;
                }
                else if (Math.abs(distanceY) > 15) {
                    this.swipeDirection = 'vertical';
                    allowSwipe = true;
                }
            }
            if (!allowSwipe) {
                return;
            }
            var $currentSlide = this.getSlideItem(this.index);
            if (this.swipeDirection === 'horizontal') {
                // reset opacity and transition duration
                this.outer.addClass('lg-dragging');
                // move current slide
                this.setTranslate($currentSlide, distanceX, 0);
                // move next and prev slide with current slide
                var width = $currentSlide.get().offsetWidth;
                var slideWidthAmount = (width * 15) / 100;
                var gutter = slideWidthAmount - Math.abs((distanceX * 10) / 100);
                this.setTranslate(this.outer.find('.lg-prev-slide').first(), -width + distanceX - gutter, 0);
                this.setTranslate(this.outer.find('.lg-next-slide').first(), width + distanceX + gutter, 0);
            }
            else if (this.swipeDirection === 'vertical') {
                if (this.s.swipeToClose) {
                    var container = LG("#" + this.getById('lg-container'));
                    container.addClass('lg-dragging-vertical');
                    var opacity = 1 - Math.abs(distanceY) / window.innerHeight;
                    var backdrop = LG("#" + this.getById('lg-backdrop'));
                    backdrop.css('opacity', opacity);
                    var scale = 1 - Math.abs(distanceY) / (window.innerWidth * 2);
                    this.setTranslate($currentSlide, 0, distanceY, scale, scale);
                    this.outer.addClass('lg-hide-items lg-swipe-closing');
                }
            }
        };
        LightGallery.prototype.touchEnd = function (endCoords, startCoords) {
            var _this = this;
            var distance;
            // keep slide animation for any mode while dragg/swipe
            if (this.s.mode !== 'lg-slide') {
                this.outer.addClass('lg-slide');
            }
            // set transition duration
            setTimeout(function () {
                var container = LG("#" + _this.getById('lg-container'));
                var backdrop = LG("#" + _this.getById('lg-backdrop'));
                container.removeClass('lg-dragging-vertical');
                _this.outer.removeClass('lg-dragging lg-hide-items lg-swipe-closing');
                var triggerClick = true;
                if (_this.swipeDirection === 'horizontal') {
                    distance = endCoords.pageX - startCoords.pageX;
                    var distanceAbs = Math.abs(endCoords.pageX - startCoords.pageX);
                    if (distance < 0 && distanceAbs > _this.s.swipeThreshold) {
                        _this.goToNextSlide(true);
                        triggerClick = false;
                    }
                    else if (distance > 0 &&
                        distanceAbs > _this.s.swipeThreshold) {
                        _this.goToPrevSlide(true);
                        triggerClick = false;
                    }
                }
                else if (_this.swipeDirection === 'vertical') {
                    distance = Math.abs(endCoords.pageY - startCoords.pageY);
                    if (_this.s.closable && _this.s.swipeToClose && distance > 100) {
                        _this.destroy();
                        return;
                    }
                    else {
                        backdrop.css('opacity', 1);
                    }
                }
                _this.outer.find('.lg-item').removeAttr('style');
                if (triggerClick &&
                    Math.abs(endCoords.pageX - startCoords.pageX) < 5) {
                    // Trigger click if distance is less than 5 pix
                    _this.LGel.trigger('onSlideClick.lg');
                }
                _this.swipeDirection = undefined;
            });
            // remove slide class once drag/swipe is completed if mode is not slide
            setTimeout(function () {
                if (!_this.outer.hasClass('lg-dragging') &&
                    _this.s.mode !== 'lg-slide') {
                    _this.outer.removeClass('lg-slide');
                }
            }, this.s.speed + 100);
        };
        LightGallery.prototype.enableSwipe = function () {
            var _this = this;
            var startCoords = {};
            var endCoords = {};
            var isMoved = false;
            var isSwiping = false;
            var inner = LG("#" + this.getById('lg-inner'));
            if (this.s.enableSwipe && this.doCss()) {
                inner.on('touchstart.lg', function (e) {
                    e.preventDefault();
                    var $item = _this.getSlideItem(_this.index);
                    if ((LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target)) &&
                        !_this.outer.hasClass('lg-zoomed') &&
                        !_this.lgBusy &&
                        e.targetTouches.length === 1) {
                        isSwiping = true;
                        _this.touchAction = 'swipe';
                        _this.manageSwipeClass();
                        startCoords = {
                            pageX: e.targetTouches[0].pageX,
                            pageY: e.targetTouches[0].pageY,
                        };
                    }
                });
                inner.on('touchmove.lg', function (e) {
                    e.preventDefault();
                    if (isSwiping &&
                        _this.touchAction === 'swipe' &&
                        e.targetTouches.length === 1) {
                        endCoords = {
                            pageX: e.targetTouches[0].pageX,
                            pageY: e.targetTouches[0].pageY,
                        };
                        _this.touchMove(startCoords, endCoords);
                        isMoved = true;
                    }
                });
                inner.on('touchend.lg', function () {
                    if (_this.touchAction === 'swipe') {
                        if (isMoved) {
                            isMoved = false;
                            _this.touchEnd(endCoords, startCoords);
                        }
                        else if (isSwiping) {
                            _this.LGel.trigger('onSlideClick.lg');
                        }
                        _this.touchAction = undefined;
                        isSwiping = false;
                    }
                });
            }
        };
        LightGallery.prototype.enableDrag = function () {
            var _this = this;
            var startCoords = {};
            var endCoords = {};
            var isDraging = false;
            var isMoved = false;
            if (this.s.enableDrag && this.doCss()) {
                this.outer.on('mousedown.lg', function (e) {
                    var $item = _this.getSlideItem(_this.index);
                    if (LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target)) {
                        if (!_this.outer.hasClass('lg-zoomed') && !_this.lgBusy) {
                            e.preventDefault();
                            if (!_this.lgBusy) {
                                _this.manageSwipeClass();
                                startCoords = {
                                    pageX: e.pageX,
                                    pageY: e.pageY,
                                };
                                isDraging = true;
                                // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                                _this.outer.get().scrollLeft += 1;
                                _this.outer.get().scrollLeft -= 1;
                                // *
                                _this.outer
                                    .removeClass('lg-grab')
                                    .addClass('lg-grabbing');
                                _this.LGel.trigger('onDragstart.lg');
                            }
                        }
                    }
                });
                LG(window).on("mousemove.lg.global" + this.lgId, function (e) {
                    if (isDraging && _this.lgOpened) {
                        isMoved = true;
                        endCoords = {
                            pageX: e.pageX,
                            pageY: e.pageY,
                        };
                        _this.touchMove(startCoords, endCoords);
                        _this.LGel.trigger('onDragmove.lg');
                    }
                });
                LG(window).on("mouseup.lg.global" + this.lgId, function (e) {
                    if (!_this.lgOpened) {
                        return;
                    }
                    var target = LG(e.target);
                    if (isMoved) {
                        isMoved = false;
                        _this.touchEnd(endCoords, startCoords);
                        _this.LGel.trigger('onDragend.lg');
                    }
                    else if (target.hasClass('lg-object') ||
                        target.hasClass('lg-video-play')) {
                        _this.LGel.trigger('onSlideClick.lg');
                    }
                    // Prevent execution on click
                    if (isDraging) {
                        isDraging = false;
                        _this.outer.removeClass('lg-grabbing').addClass('lg-grab');
                    }
                });
            }
        };
        LightGallery.prototype.manageSwipeClass = function () {
            var _touchNext = this.index + 1;
            var _touchPrev = this.index - 1;
            if (this.s.loop && this.galleryItems.length > 2) {
                if (this.index === 0) {
                    _touchPrev = this.galleryItems.length - 1;
                }
                else if (this.index === this.galleryItems.length - 1) {
                    _touchNext = 0;
                }
            }
            this.outer.find('.lg-item').removeClass('lg-next-slide lg-prev-slide');
            if (_touchPrev > -1) {
                this.getSlideItem(_touchPrev).addClass('lg-prev-slide');
            }
            this.getSlideItem(_touchNext).addClass('lg-next-slide');
        };
        /**
         *  @desc Go to next slide
         *  @param {Boolean} fromTouch - true if slide function called via touch event
         */
        LightGallery.prototype.goToNextSlide = function (fromTouch) {
            var _this = this;
            var _loop = this.s.loop;
            if (fromTouch && this.galleryItems.length < 3) {
                _loop = false;
            }
            if (!this.lgBusy) {
                if (this.index + 1 < this.galleryItems.length) {
                    this.index++;
                    this.LGel.trigger('onBeforeNextSlide.lg', {
                        index: this.index,
                    });
                    this.slide(this.index, !!fromTouch, false, 'next');
                }
                else {
                    if (_loop) {
                        this.index = 0;
                        this.LGel.trigger('onBeforeNextSlide.lg', {
                            index: this.index,
                        });
                        this.slide(this.index, !!fromTouch, false, 'next');
                    }
                    else if (this.s.slideEndAnimatoin && !fromTouch) {
                        this.outer.addClass('lg-right-end');
                        setTimeout(function () {
                            _this.outer.removeClass('lg-right-end');
                        }, 400);
                    }
                }
            }
        };
        /**
         *  @desc Go to previous slide
         *  @param {Boolean} fromTouch - true if slide function called via touch event
         */
        LightGallery.prototype.goToPrevSlide = function (fromTouch) {
            var _this = this;
            var _loop = this.s.loop;
            if (fromTouch && this.galleryItems.length < 3) {
                _loop = false;
            }
            if (!this.lgBusy) {
                if (this.index > 0) {
                    this.index--;
                    this.LGel.trigger('onBeforePrevSlide.lg', {
                        index: this.index,
                        fromTouch: fromTouch,
                    });
                    this.slide(this.index, !!fromTouch, false, 'prev');
                }
                else {
                    if (_loop) {
                        this.index = this.galleryItems.length - 1;
                        this.LGel.trigger('onBeforePrevSlide.lg', {
                            index: this.index,
                            fromTouch: fromTouch,
                        });
                        this.slide(this.index, !!fromTouch, false, 'prev');
                    }
                    else if (this.s.slideEndAnimatoin && !fromTouch) {
                        this.outer.addClass('lg-left-end');
                        setTimeout(function () {
                            _this.outer.removeClass('lg-left-end');
                        }, 400);
                    }
                }
            }
        };
        LightGallery.prototype.keyPress = function () {
            var _this = this;
            LG(window).on("keydown.lg.global" + this.lgId, function (e) {
                if (_this.lgOpened && _this.s.escKey === true && e.keyCode === 27) {
                    e.preventDefault();
                    if (!_this.outer.hasClass('lg-thumb-open')) {
                        _this.destroy();
                    }
                    else {
                        _this.outer.removeClass('lg-thumb-open');
                    }
                }
                if (_this.lgOpened && _this.galleryItems.length > 1) {
                    if (e.keyCode === 37) {
                        e.preventDefault();
                        _this.goToPrevSlide();
                    }
                    if (e.keyCode === 39) {
                        e.preventDefault();
                        _this.goToNextSlide();
                    }
                }
            });
        };
        LightGallery.prototype.arrow = function () {
            var _this = this;
            LG("#" + this.getById('lg-prev')).on('click.lg', function () {
                _this.goToPrevSlide();
            });
            console.log(LG("#" + this.getById('lg-next')));
            LG("#" + this.getById('lg-next')).on('click.lg', function () {
                console.log('calling');
                _this.goToNextSlide();
            });
        };
        LightGallery.prototype.arrowDisable = function (index) {
            // Disable arrows if s.hideControlOnEnd is true
            if (!this.s.loop && this.s.hideControlOnEnd) {
                var $prev = LG("#" + this.getById('lg-prev'));
                var $next = LG("#" + this.getById('lg-next'));
                if (index + 1 < this.galleryItems.length) {
                    $prev.removeAttr('disabled').removeClass('disabled');
                }
                else {
                    $prev.attr('disabled', 'disabled').addClass('disabled');
                }
                if (index > 0) {
                    $next.removeAttr('disabled').removeClass('disabled');
                }
                else {
                    $next.attr('disabled', 'disabled').addClass('disabled');
                }
            }
        };
        /**
         * Get index of the slide from custom slideName. Has to be a public method. Used in hash plugin
         * @param {String} hash
         * @returns {Number} Index of the slide.
         */
        LightGallery.prototype.getIndexFromUrl = function (hash) {
            if (hash === void 0) { hash = window.location.hash; }
            var slideName = hash.split('&slide=')[1];
            var _idx = 0;
            if (this.s.customSlideName) {
                for (var index = 0; index < this.galleryItems.length; index++) {
                    var dynamicEl = this.galleryItems[index];
                    if (dynamicEl.slideName === slideName) {
                        _idx = index;
                        break;
                    }
                }
            }
            else {
                _idx = parseInt(slideName, 10);
            }
            return isNaN(_idx) ? 0 : _idx;
        };
        LightGallery.prototype.setTranslate = function ($el, xValue, yValue, scaleX, scaleY) {
            if (scaleX === void 0) { scaleX = 1; }
            if (scaleY === void 0) { scaleY = 1; }
            // jQuery supports Automatic CSS prefixing since version 1.8.0
            if (this.s.useLeft) {
                $el.css('left', xValue + '');
            }
            else {
                $el.css('transform', 'translate3d(' +
                    xValue +
                    'px, ' +
                    yValue +
                    'px, 0px) scale3d(' +
                    scaleX +
                    ', ' +
                    scaleY +
                    ', 1)');
            }
        };
        LightGallery.prototype.mousewheel = function () {
            var _this = this;
            this.outer.on('mousewheel.lg', function (e) {
                if (!e.deltaY) {
                    return;
                }
                if (e.deltaY > 0) {
                    _this.goToPrevSlide();
                }
                else {
                    _this.goToNextSlide();
                }
                e.preventDefault();
            });
        };
        LightGallery.prototype.closeGallery = function () {
            var _this = this;
            if (!this.s.closable)
                return;
            var mousedown = false;
            LG("#" + this.getById('lg-close')).on('click.lg', function () {
                _this.destroy();
            });
            if (this.s.closeOnTap) {
                // If you drag the slide and release outside gallery gets close on chrome
                // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
                this.outer.on('mousedown.lg', function (e) {
                    var target = LG(e.target);
                    if (target.hasClass('lg-outer') ||
                        target.hasClass('lg-item') ||
                        target.hasClass('lg-img-wrap')) {
                        mousedown = true;
                    }
                    else {
                        mousedown = false;
                    }
                });
                this.outer.on('mousemove.lg', function () {
                    mousedown = false;
                });
                this.outer.on('mouseup.lg', function (e) {
                    var target = LG(e.target);
                    if (target.hasClass('lg-outer') ||
                        target.hasClass('lg-item') ||
                        (target.hasClass('lg-img-wrap') && mousedown)) {
                        if (!_this.outer.hasClass('lg-dragging')) {
                            _this.destroy();
                        }
                    }
                });
            }
        };
        LightGallery.prototype.destroy = function (clear) {
            var _this = this;
            if (!clear && !this.s.closable) {
                return;
            }
            if (!clear) {
                this.LGel.trigger('onBeforeClose.lg');
                LG(window).scrollTop(this.prevScrollTop);
            }
            var $backdrop = LG("#" + this.getById('lg-backdrop'));
            var transform;
            if (!this.s.dynamic) {
                var imageSize = utils.getSize(this.items[this.index]);
                transform = utils.getTransform(this.items[this.index], imageSize);
            }
            if (this.zoomFromImage && transform) {
                this.outer.addClass('lg-closing lg-zoom-from-image');
                this.getSlideItem(this.index)
                    .addClass('start-end-progress')
                    .css('transition-duration', this.s.startAnimationDuration + 'ms')
                    .css('transform', transform);
            }
            else {
                this.outer.addClass('lg-hide-items');
                // lg-zoom-from-image is used for setting the opacity to 1 if zoomFromImage is true
                // If the closing item doesn't have the lg-size attribute, remove this class to avoid the closing css conflicts
                this.outer.removeClass('lg-zoom-from-image');
            }
            /**
             * if d is false or undefined destroy will only close the gallery
             * plugins instance remains with the element
             *
             * if d is true destroy will completely remove the plugin
             */
            // Unbind all events added by lightGallery
            // @todo
            //this.$el.off('.lg.tm');
            for (var key in this.modules) {
                if (this.modules[key]) {
                    try {
                        this.modules[key].destroy(clear);
                    }
                    catch (err) {
                        console.warn("lightGallery:- make sure lightGallery " + key + " module is properly destroyed");
                    }
                }
            }
            if (clear) {
                if (!this.s.dynamic) {
                    // only when not using dynamic mode is $items a jquery collection
                    for (var index = 0; index < this.items.length; index++) {
                        var element = this.items[index];
                        // Using different namespace for click because click event should not unbind if selector is same object('this')
                        LG(element).off("click.lgcustom-item-" + index);
                    }
                }
                LG(window).off(".lg.global" + this.lgId);
                this.LGel.off('.lg');
            }
            this.lGalleryOn = false;
            this.zoomFromImage = this.s.zoomFromImage;
            clearTimeout(this.hideBarTimeout);
            this.hideBarTimeout = false;
            LG(document.body).removeClass('lg-on lg-from-hash');
            this.outer.removeClass('lg-visible');
            // Resetting opacity to 0 isd required as  vertical swipe to close function adds inline opacity.
            $backdrop.removeClass('in').css('opacity', 0);
            var removeTimeout = this.zoomFromImage && transform
                ? Math.max(this.s.startAnimationDuration, this.s.backdropDuration)
                : this.s.backdropDuration;
            LG("#" + this.getById('lg-container')).removeClass('lg-show-in');
            // Once the closign animation is completed and gallery is invisible
            setTimeout(function () {
                if (_this.zoomFromImage && transform) {
                    _this.outer.removeClass('lg-zoom-from-image');
                }
                LG("#" + _this.getById('lg-container')).removeClass('lg-show');
                $backdrop.removeAttr('style');
                _this.outer.removeClass("lg-closing " + _this.s.startClass);
                _this.getSlideItem(_this.index).removeClass('start-end-progress');
                LG("#" + _this.getById('lg-inner')).empty();
                if (clear) {
                    if (_this.outer) {
                        _this.outer.remove();
                    }
                    $backdrop.remove();
                }
                if (!clear) {
                    _this.LGel.trigger('onCloseAfter.lg');
                }
                _this.LGel.get().focus();
                _this.lgOpened = false;
            }, removeTimeout + 100);
        };
        return LightGallery;
    }());
    // $.fn.lightGallery = function (options) {
    //     return this.each(function () {
    //         if (!$.data(this, 'lightGallery')) {
    //             $.data(this, 'lightGallery', new LightGallery(this, options));
    //         } else {
    //             try {
    //                 $(this).data('lightGallery').init();
    //             } catch (err) {
    //                 console.error('lightGallery has not initiated properly');
    //             }
    //         }
    //     });
    // };
    window.lightGallery = function (el, options) {
        if (!el) {
            return;
        }
        try {
            return new LightGallery(el, options);
        }
        catch (err) {
            console.error('lightGallery has not initiated properly', err);
        }
    };

    exports.LightGallery = LightGallery;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=lightgallery.umd.js.map
