"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LG = exports.lgQuery = void 0;
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
        return this.selector;
    };
    lgQuery.prototype.removeAttr = function (attr) {
        this._each(function (el) {
            el.removeAttribute(attr);
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
        if (!this.selector || !Array.isArray(lgQuery.eventListeners[event])) {
            return this;
        }
        lgQuery.eventListeners[event].forEach(function (listener) {
            _this.selector.removeEventListener(event.split('.')[0], listener);
        });
        lgQuery.eventListeners[event] = [];
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
        return {
            left: rect.left + this.scrollLeft(),
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
exports.lgQuery = lgQuery;
function LG(selector) {
    return new lgQuery(selector);
}
exports.LG = LG;
//# sourceMappingURL=lgQuery.js.map