var t, i;
(t = this),
    (i = function (t, i) {
        /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        const s = (t, i) =>
            'method' === i.kind && i.descriptor && !('value' in i.descriptor)
                ? {
                      ...i,
                      finisher(s) {
                          s.createProperty(i.key, t);
                      },
                  }
                : {
                      kind: 'field',
                      key: Symbol(),
                      placement: 'own',
                      descriptor: {},
                      originalKey: i.key,
                      initializer() {
                          'function' == typeof i.initializer &&
                              (this[i.key] = i.initializer.call(this));
                      },
                      finisher(s) {
                          s.createProperty(i.key, t);
                      },
                  };
        /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
        /*!
         * lightgallery | 2.0.0-beta.3 | May 6th 2021
         * http://sachinchoolur.github.io/lightGallery/
         * Copyright (c) 2020 Sachin Neravath;
         * @license GPLv3
         */
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
        var e = function () {
            return (e =
                Object.assign ||
                function (t) {
                    for (var i, s = 1, e = arguments.length; s < e; s++)
                        for (var n in (i = arguments[s]))
                            Object.prototype.hasOwnProperty.call(i, n) &&
                                (t[n] = i[n]);
                    return t;
                }).apply(this, arguments);
        };
        !(function () {
            if ('function' == typeof window.CustomEvent) return !1;
            window.CustomEvent = function (t, i) {
                i = i || { bubbles: !1, cancelable: !1, detail: null };
                var s = document.createEvent('CustomEvent');
                return (
                    s.initCustomEvent(t, i.bubbles, i.cancelable, i.detail), s
                );
            };
        })(),
            Element.prototype.matches ||
                (Element.prototype.matches =
                    Element.prototype.msMatchesSelector ||
                    Element.prototype.webkitMatchesSelector);
        var n = (function () {
            function t(t) {
                return (
                    (this.cssVenderPrefixes = [
                        'TransitionDuration',
                        'TransitionTimingFunction',
                        'Transform',
                        'Transition',
                    ]),
                    (this.selector = this._getSelector(t)),
                    (this.firstElement = this._getFirstEl()),
                    this
                );
            }
            return (
                (t.generateUUID = function () {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                        /[xy]/g,
                        function (t) {
                            var i = (16 * Math.random()) | 0;
                            return ('x' == t ? i : (3 & i) | 8).toString(16);
                        },
                    );
                }),
                (t.prototype._getSelector = function (t, i) {
                    return (
                        void 0 === i && (i = document),
                        'string' != typeof t
                            ? t
                            : ((i = i || document),
                              '#' === t.substring(0, 1)
                                  ? i.querySelector(t)
                                  : i.querySelectorAll(t))
                    );
                }),
                (t.prototype._each = function (t) {
                    return this.selector
                        ? (void 0 !== this.selector.length
                              ? [].forEach.call(this.selector, t)
                              : t(this.selector, 0),
                          this)
                        : this;
                }),
                (t.prototype._setCssVendorPrefix = function (t, i, s) {
                    var e = i.replace(/-([a-z])/gi, function (t, i) {
                        return i.toUpperCase();
                    });
                    -1 !== this.cssVenderPrefixes.indexOf(e)
                        ? ((t.style[
                              e.charAt(0).toLowerCase() + e.slice(1)
                          ] = s),
                          (t.style['webkit' + e] = s),
                          (t.style['moz' + e] = s),
                          (t.style['ms' + e] = s),
                          (t.style['o' + e] = s))
                        : (t.style[e] = s);
                }),
                (t.prototype._getFirstEl = function () {
                    return this.selector && void 0 !== this.selector.length
                        ? this.selector[0]
                        : this.selector;
                }),
                (t.prototype.isEventMatched = function (t, i) {
                    var s = i.split('.');
                    return t
                        .split('.')
                        .filter(function (t) {
                            return t;
                        })
                        .every(function (t) {
                            return -1 !== s.indexOf(t);
                        });
                }),
                (t.prototype.attr = function (t, i) {
                    return void 0 === i
                        ? this.firstElement
                            ? this.firstElement.getAttribute(t)
                            : ''
                        : (this._each(function (s) {
                              s.setAttribute(t, i);
                          }),
                          this);
                }),
                (t.prototype.find = function (t) {
                    return o(this._getSelector(t, this.selector));
                }),
                (t.prototype.first = function () {
                    return this.selector && void 0 !== this.selector.length
                        ? o(this.selector[0])
                        : o(this.selector);
                }),
                (t.prototype.eq = function (t) {
                    return o(this.selector[t]);
                }),
                (t.prototype.parent = function () {
                    return o(this.selector.parentElement);
                }),
                (t.prototype.get = function () {
                    return this._getFirstEl();
                }),
                (t.prototype.removeAttr = function (t) {
                    var i = t.split(' ');
                    return (
                        this._each(function (t) {
                            i.forEach(function (i) {
                                return t.removeAttribute(i);
                            });
                        }),
                        this
                    );
                }),
                (t.prototype.wrap = function (t) {
                    if (!this.firstElement) return this;
                    var i = document.createElement('div');
                    return (
                        (i.className = t),
                        this.firstElement.parentNode.insertBefore(
                            i,
                            this.firstElement,
                        ),
                        this.firstElement.parentNode.removeChild(
                            this.firstElement,
                        ),
                        i.appendChild(this.firstElement),
                        this
                    );
                }),
                (t.prototype.addClass = function (t) {
                    return (
                        void 0 === t && (t = ''),
                        this._each(function (i) {
                            t.split(' ').forEach(function (t) {
                                i.classList.add(t);
                            });
                        }),
                        this
                    );
                }),
                (t.prototype.removeClass = function (t) {
                    return (
                        this._each(function (i) {
                            t.split(' ').forEach(function (t) {
                                i.classList.remove(t);
                            });
                        }),
                        this
                    );
                }),
                (t.prototype.hasClass = function (t) {
                    return (
                        !!this.firstElement &&
                        this.firstElement.classList.contains(t)
                    );
                }),
                (t.prototype.hasAttribute = function (t) {
                    return (
                        !!this.firstElement && this.firstElement.hasAttribute(t)
                    );
                }),
                (t.prototype.toggleClass = function (t) {
                    return this.firstElement
                        ? (this.hasClass(t)
                              ? this.removeClass(t)
                              : this.addClass(t),
                          this)
                        : this;
                }),
                (t.prototype.css = function (t, i) {
                    var s = this;
                    return (
                        this._each(function (e) {
                            s._setCssVendorPrefix(e, t, i);
                        }),
                        this
                    );
                }),
                (t.prototype.on = function (i, s) {
                    var e = this;
                    return this.selector
                        ? (i.split(' ').forEach(function (i) {
                              Array.isArray(t.eventListeners[i]) ||
                                  (t.eventListeners[i] = []),
                                  t.eventListeners[i].push(s),
                                  e.selector.addEventListener(
                                      i.split('.')[0],
                                      s,
                                  );
                          }),
                          this)
                        : this;
                }),
                (t.prototype.once = function (t, i) {
                    var s = this;
                    return (
                        this.on(t, function () {
                            s.off(t), i(t);
                        }),
                        this
                    );
                }),
                (t.prototype.off = function (i) {
                    var s = this;
                    return this.selector
                        ? (Object.keys(t.eventListeners).forEach(function (e) {
                              s.isEventMatched(i, e) &&
                                  (t.eventListeners[e].forEach(function (t) {
                                      s.selector.removeEventListener(
                                          e.split('.')[0],
                                          t,
                                      );
                                  }),
                                  (t.eventListeners[e] = []));
                          }),
                          this)
                        : this;
                }),
                (t.prototype.trigger = function (t, i) {
                    if (!this.firstElement) return this;
                    var s = new CustomEvent(t.split('.')[0], {
                        detail: i || null,
                    });
                    return this.firstElement.dispatchEvent(s), this;
                }),
                (t.prototype.load = function (t) {
                    var i = this;
                    return (
                        fetch(t).then(function (t) {
                            i.selector.innerHTML = t;
                        }),
                        this
                    );
                }),
                (t.prototype.html = function (t) {
                    return void 0 === t
                        ? this.firstElement
                            ? this.firstElement.innerHTML
                            : ''
                        : (this._each(function (i) {
                              i.innerHTML = t;
                          }),
                          this);
                }),
                (t.prototype.append = function (t) {
                    return (
                        this._each(function (i) {
                            'string' == typeof t
                                ? i.insertAdjacentHTML('beforeend', t)
                                : i.appendChild(t);
                        }),
                        this
                    );
                }),
                (t.prototype.prepend = function (t) {
                    return (
                        this._each(function (i) {
                            i.insertAdjacentHTML('afterbegin', t);
                        }),
                        this
                    );
                }),
                (t.prototype.remove = function () {
                    return (
                        this._each(function (t) {
                            t.parentNode.removeChild(t);
                        }),
                        this
                    );
                }),
                (t.prototype.empty = function () {
                    return (
                        this._each(function (t) {
                            t.innerHTML = '';
                        }),
                        this
                    );
                }),
                (t.prototype.scrollTop = function (t) {
                    return void 0 !== t
                        ? ((document.body.scrollTop = t),
                          (document.documentElement.scrollTop = t),
                          this)
                        : window.pageYOffset ||
                              document.documentElement.scrollTop ||
                              document.body.scrollTop ||
                              0;
                }),
                (t.prototype.scrollLeft = function (t) {
                    return void 0 !== t
                        ? ((document.body.scrollLeft = t),
                          (document.documentElement.scrollLeft = t),
                          this)
                        : window.pageXOffset ||
                              document.documentElement.scrollLeft ||
                              document.body.scrollLeft ||
                              0;
                }),
                (t.prototype.offset = function () {
                    if (!this.firstElement) return { left: 0, top: 0 };
                    var t = this.firstElement.getBoundingClientRect(),
                        i = o('body').style().marginLeft;
                    return {
                        left: t.left - parseFloat(i) + this.scrollLeft(),
                        top: t.top + this.scrollTop(),
                    };
                }),
                (t.prototype.style = function () {
                    return this.firstElement
                        ? this.firstElement.currentStyle ||
                              window.getComputedStyle(this.firstElement)
                        : {};
                }),
                (t.prototype.width = function () {
                    var t = this.style();
                    return (
                        this.firstElement.clientWidth -
                        parseFloat(t.paddingLeft) -
                        parseFloat(t.paddingRight)
                    );
                }),
                (t.prototype.height = function () {
                    var t = this.style();
                    return (
                        this.firstElement.clientHeight -
                        parseFloat(t.paddingTop) -
                        parseFloat(t.paddingBottom)
                    );
                }),
                (t.eventListeners = {}),
                t
            );
        })();
        function o(t) {
            return new n(t);
        }
        var r = [
            'src',
            'sources',
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
            'iframeTitle',
            'twitterShareUrl',
            'pinterestShareUrl',
            'pinterestText',
            'fbHtml',
            'disqusIdentifier',
            'disqusUrl',
        ];
        function h(t) {
            return 'href' === t
                ? 'src'
                : (t = (t =
                      (t = t.replace('data-', '')).charAt(0).toLowerCase() +
                      t.slice(1)).replace(/-([a-z])/g, function (t) {
                      return t[1].toUpperCase();
                  }));
        }
        var l = function (t, i, s, e) {
                void 0 === s && (s = 0);
                var n = o(t).attr('data-lg-size') || e;
                if (n) {
                    var r = n.split(',');
                    if (r[1])
                        for (
                            var h = window.innerWidth, l = 0;
                            l < r.length;
                            l++
                        ) {
                            var a = r[l];
                            if (parseInt(a.split('-')[2], 10) > h) {
                                n = a;
                                break;
                            }
                            l === r.length - 1 && (n = a);
                        }
                    var c = n.split('-'),
                        u = parseInt(c[0], 10),
                        g = parseInt(c[1], 10),
                        d = i.width(),
                        f = i.height() - s,
                        m = Math.min(d, u),
                        v = Math.min(f, g),
                        p = Math.min(m / u, v / g);
                    return { width: u * p, height: g * p };
                }
            },
            a = function (t, i, s, e, n) {
                if (n) {
                    var r = o(t).find('img').first(),
                        h = i.get().getBoundingClientRect(),
                        l = h.width,
                        a = i.height() - (s + e),
                        c = r.width(),
                        u = r.height(),
                        g = r.style(),
                        d =
                            (l - c) / 2 -
                            r.offset().left +
                            (parseFloat(g.paddingLeft) || 0) +
                            (parseFloat(g.borderLeft) || 0) +
                            o(window).scrollLeft() +
                            h.left,
                        f =
                            (a - u) / 2 -
                            r.offset().top +
                            (parseFloat(g.paddingTop) || 0) +
                            (parseFloat(g.borderTop) || 0) +
                            o(window).scrollTop() +
                            s;
                    return (
                        'translate3d(' +
                        (d *= -1) +
                        'px, ' +
                        (f *= -1) +
                        'px, 0) scale3d(' +
                        c / n.width +
                        ', ' +
                        u / n.height +
                        ', 1)'
                    );
                }
            },
            c = function (t, i, s, e) {
                return (
                    '<div class="lg-video-cont lg-has-iframe" style="width:' +
                    i +
                    '; height: ' +
                    s +
                    '">\n                    <iframe class="lg-object" frameborder="0" ' +
                    (e ? 'title="' + e + '"' : '') +
                    ' src="' +
                    t +
                    '"  allowfullscreen="true"></iframe>\n                </div>'
                );
            },
            u = function (t, i, s, e, n, o) {
                var r =
                        '<img ' +
                        s +
                        ' ' +
                        (e ? 'srcset=' + e : '') +
                        '  ' +
                        (n ? 'sizes=' + n : '') +
                        ' class="lg-object lg-image" data-index="' +
                        t +
                        '" src="' +
                        i +
                        '" />',
                    h = '';
                return (
                    o &&
                        (h = ('string' == typeof o ? JSON.parse(o) : o).map(
                            function (t) {
                                var i = '';
                                return (
                                    Object.keys(t).forEach(function (s) {
                                        i += ' ' + s + '="' + t[s] + '"';
                                    }),
                                    '<source ' + i + '></source>'
                                );
                            },
                        )),
                    '' + h + r
                );
            },
            g = function (t) {
                for (var i = [], s = [], e = '', n = 0; n < t.length; n++) {
                    var o = t[n].split(' ');
                    '' === o[0] && o.splice(0, 1), s.push(o[0]), i.push(o[1]);
                }
                for (var r = window.innerWidth, h = 0; h < i.length; h++)
                    if (parseInt(i[h], 10) > r) {
                        e = s[h];
                        break;
                    }
                return e;
            },
            d = function (t) {
                return !!t && !!t.complete && 0 !== t.naturalWidth;
            },
            f = function (t, i, s, e) {
                return (
                    '<div class="lg-video-cont ' +
                    (e && e.youtube
                        ? 'lg-has-youtube'
                        : e && e.vimeo
                        ? 'lg-has-vimeo'
                        : 'lg-has-html5') +
                    '" style="' +
                    s +
                    '">\n                <div class="lg-video-play-button">\n                <svg\n                    viewBox="0 0 20 20"\n                    preserveAspectRatio="xMidYMid"\n                    focusable="false"\n                    aria-labelledby="Play video"\n                    role="img"\n                    class="lg-video-play-icon"\n                >\n                    <title>Play video</title>\n                    <polygon class="lg-video-play-icon-inner" points="1,0 20,10 1,20"></polygon>\n                </svg>\n                <svg class="lg-video-play-icon-bg" viewBox="0 0 50 50" focusable="false">\n                    <circle cx="50%" cy="50%" r="20"></circle></svg>\n                <svg class="lg-video-play-icon-circle" viewBox="0 0 50 50" focusable="false">\n                    <circle cx="50%" cy="50%" r="20"></circle>\n                </svg>\n            </div>\n            ' +
                    (i || '') +
                    '\n            <img class="lg-object lg-video-poster" src="' +
                    t +
                    '" />\n        </div>'
                );
            },
            m = function (t, i, s, e) {
                var n = [],
                    l = (function () {
                        for (var t = 0, i = 0, s = arguments.length; i < s; i++)
                            t += arguments[i].length;
                        var e = Array(t),
                            n = 0;
                        for (i = 0; i < s; i++)
                            for (
                                var o = arguments[i], r = 0, h = o.length;
                                r < h;
                                r++, n++
                            )
                                e[n] = o[r];
                        return e;
                    })(r, i);
                return (
                    [].forEach.call(t, function (t) {
                        for (var i = {}, r = 0; r < t.attributes.length; r++) {
                            var a = t.attributes[r];
                            if (a.specified) {
                                var c = h(a.name),
                                    u = '';
                                l.indexOf(c) > -1 && (u = c),
                                    u && (i[u] = a.value);
                            }
                        }
                        var g = o(t),
                            d = g.find('img').first().attr('alt'),
                            f = g.attr('title'),
                            m = e
                                ? g.attr(e)
                                : g.find('img').first().attr('src');
                        (i.thumb = m),
                            s && !i.subHtml && (i.subHtml = f || d || ''),
                            (i.alt = d || f || ''),
                            n.push(i);
                    }),
                    n
                );
            },
            v = function () {
                var t,
                    i = !1;
                return (
                    (t =
                        navigator.userAgent ||
                        navigator.vendor ||
                        window.opera),
                    (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                        t,
                    ) ||
                        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                            t.substr(0, 4),
                        )) &&
                        (i = !0),
                    i
                );
            },
            p = {
                mode: 'lg-slide',
                easing: 'ease',
                speed: 400,
                height: '100%',
                width: '100%',
                addClass: '',
                startClass: 'lg-start-zoom',
                backdropDuration: 300,
                container: document.body,
                startAnimationDuration: 400,
                zoomFromOrigin: !0,
                hideBarsDelay: 0,
                showBarsAfter: 1e4,
                slideDelay: 0,
                supportLegacyBrowser: !0,
                allowMediaOverlap: !1,
                videoMaxSize: '1280-720',
                defaultCaptionHeight: 0,
                ariaLabelledby: '',
                ariaDescribedby: '',
                closable: !0,
                swipeToClose: !0,
                closeOnTap: !0,
                showCloseIcon: !0,
                showMaximizeIcon: !1,
                loop: !0,
                escKey: !0,
                keyPress: !0,
                controls: !0,
                slideEndAnimation: !0,
                hideControlOnEnd: !1,
                mousewheel: !1,
                getCaptionFromTitleOrAlt: !0,
                appendSubHtmlTo: '.lg-sub-html',
                subHtmlSelectorRelative: !1,
                preload: 2,
                numberOfSlideItemsInDom: 10,
                showAfterLoad: !0,
                selector: '',
                selectWithin: '',
                nextHtml: '',
                prevHtml: '',
                index: 0,
                iframeWidth: '100%',
                iframeHeight: '100%',
                download: !0,
                counter: !0,
                appendCounterTo: '.lg-toolbar',
                swipeThreshold: 50,
                enableSwipe: !0,
                enableDrag: !0,
                dynamic: !1,
                dynamicEl: [],
                extraProps: [],
                galleryId: '1',
                customSlideName: !1,
                exThumbImage: '',
                isMobile: void 0,
                mobileSettings: {
                    controls: !1,
                    showCloseIcon: !1,
                    download: !1,
                },
                plugins: [],
            },
            b = 'lgAfterAppendSlide',
            w = 'lgInit',
            y = 'lgHasVideo',
            x = 'lgContainerResize',
            k = 'lgUpdateSlides',
            T = 'lgAfterAppendSubHtml',
            z = 'lgBeforeOpen',
            M = 'lgAfterOpen',
            j = 'lgSlideItemLoad',
            S = 'lgBeforeSlide',
            O = 'lgAfterSlide',
            I = 'lgPosterClick',
            A = 'lgDragStart',
            C = 'lgDragMove',
            F = 'lgDragEnd',
            _ = 'lgBeforeNextSlide',
            D = 'lgBeforePrevSlide',
            B = 'lgBeforeClose',
            E = 'lgAfterClose',
            H = 0,
            N = (function () {
                function t(t, i) {
                    if (
                        (void 0 === i && (i = {}),
                        (this.lgOpened = !1),
                        (this.index = 0),
                        (this.plugins = []),
                        (this.lGalleryOn = !1),
                        (this.lgBusy = !1),
                        (this.currentItemsInDom = []),
                        (this.prevScrollTop = 0),
                        (this.isDummyImageRemoved = !1),
                        (this.mediaContainerPosition = { top: 0, bottom: 0 }),
                        H++,
                        (this.lgId = H),
                        (this.el = t),
                        (this.LGel = o(t)),
                        (this.settings = e(e({}, p), i)),
                        this.settings.isMobile &&
                        'function' == typeof this.settings.isMobile
                            ? this.settings.isMobile()
                            : v())
                    ) {
                        var s = e(
                            e({}, this.settings.mobileSettings),
                            i.mobileSettings,
                        );
                        this.settings = e(e({}, this.settings), s);
                    }
                    if (
                        this.settings.dynamic &&
                        void 0 !== this.settings.dynamicEl &&
                        !Array.isArray(this.settings.dynamicEl)
                    )
                        throw 'When using dynamic mode, you must also define dynamicEl as an Array.';
                    return (
                        this.settings.slideEndAnimation &&
                            (this.settings.hideControlOnEnd = !1),
                        this.settings.closable ||
                            (this.settings.swipeToClose = !1),
                        (this.zoomFromOrigin = this.settings.zoomFromOrigin),
                        (this.galleryItems = this.getItems()),
                        this.settings.dynamic && (this.zoomFromOrigin = !1),
                        (this.settings.preload = Math.min(
                            this.settings.preload,
                            this.galleryItems.length,
                        )),
                        this.init(),
                        this
                    );
                }
                return (
                    (t.prototype.init = function () {
                        var t = this;
                        if (
                            (this.addSlideVideoInfo(this.galleryItems),
                            this.buildFromHash() || this.buildStructure(),
                            this.LGel.trigger(w, { instance: this }),
                            this.settings.keyPress && this.keyPress(),
                            setTimeout(function () {
                                t.enableDrag(), t.enableSwipe();
                            }, 50),
                            this.galleryItems.length > 1 &&
                                (this.arrow(),
                                this.settings.mousewheel && this.mousewheel()),
                            !this.settings.dynamic)
                        )
                            for (
                                var i = function (i) {
                                        var e = s.items[i],
                                            r = o(e),
                                            h = n.generateUUID();
                                        r.attr('data-lg-id', h).on(
                                            'click.lgcustom-item-' + h,
                                            function (s) {
                                                s.preventDefault();
                                                var n = t.settings.index || i;
                                                t.openGallery(n, e);
                                            },
                                        );
                                    },
                                    s = this,
                                    e = 0;
                                e < this.items.length;
                                e++
                            )
                                i(e);
                    }),
                    (t.prototype.buildModules = function () {
                        var t = this,
                            i = 0;
                        return (
                            this.settings.plugins.forEach(function (s) {
                                i++,
                                    setTimeout(function () {
                                        t.plugins.push(new s(t, o));
                                    }, 10 * i);
                            }),
                            10 * i
                        );
                    }),
                    (t.prototype.getSlideItem = function (t) {
                        return o(this.getSlideItemId(t));
                    }),
                    (t.prototype.getSlideItemId = function (t) {
                        return '#lg-item-' + this.lgId + '-' + t;
                    }),
                    (t.prototype.getIdName = function (t) {
                        return t + '-' + this.lgId;
                    }),
                    (t.prototype.getElementById = function (t) {
                        return o('#' + this.getIdName(t));
                    }),
                    (t.prototype.buildStructure = function () {
                        var t = this;
                        if (this.$container && this.$container.get()) return 0;
                        var i = '',
                            s = '';
                        this.settings.controls &&
                            this.galleryItems.length > 1 &&
                            (i =
                                '<button type="button" id="' +
                                this.getIdName('lg-prev') +
                                '" aria-label="Previous slide" class="lg-prev lg-icon"> ' +
                                this.settings.prevHtml +
                                ' </button>\n                <button type="button" id="' +
                                this.getIdName('lg-next') +
                                '" aria-label="Next slide" class="lg-next lg-icon"> ' +
                                this.settings.nextHtml +
                                ' </button>'),
                            '.lg-sub-html' === this.settings.appendSubHtmlTo &&
                                (s =
                                    '<div class="lg-sub-html" role="status" aria-live="polite"></div>');
                        var e = '';
                        this.settings.allowMediaOverlap &&
                            (e += 'lg-media-overlap ');
                        var n = this.settings.ariaLabelledby
                                ? 'aria-labelledby="' +
                                  this.settings.ariaLabelledby +
                                  '"'
                                : '',
                            r = this.settings.ariaDescribedby
                                ? 'aria-describedby="' +
                                  this.settings.ariaDescribedby +
                                  '"'
                                : '',
                            h =
                                'lg-container ' +
                                this.settings.addClass +
                                ' ' +
                                (document.body !== this.settings.container
                                    ? 'lg-inline'
                                    : ''),
                            l =
                                this.settings.closable &&
                                this.settings.showCloseIcon
                                    ? '<button type="button" aria-label="Close gallery" id="' +
                                      this.getIdName('lg-close') +
                                      '" class="lg-close lg-icon"></button>'
                                    : '',
                            a = this.settings.showMaximizeIcon
                                ? '<button type="button" aria-label="Toggle maximize" id="' +
                                  this.getIdName('lg-maximize') +
                                  '" class="lg-maximize lg-icon"></button>'
                                : '',
                            c =
                                '\n        <div class="' +
                                h +
                                '" id="' +
                                this.getIdName('lg-container') +
                                '" tabindex="-1" aria-modal="true" ' +
                                n +
                                ' ' +
                                r +
                                ' role="dialog"\n        >\n            <div id="' +
                                this.getIdName('lg-backdrop') +
                                '" class="lg-backdrop"></div>\n\n            <div id="' +
                                this.getIdName('lg-outer') +
                                '" class="lg-outer lg-hide-items ' +
                                e +
                                ' ">\n                    <div id="' +
                                this.getIdName('lg-content') +
                                '" class="lg" style="width: ' +
                                this.settings.width +
                                '; height:' +
                                this.settings.height +
                                '">\n                        <div id="' +
                                this.getIdName('lg-inner') +
                                '" class="lg-inner"></div>\n                        <div id="' +
                                this.getIdName('lg-toolbar') +
                                '" class="lg-toolbar lg-group">\n                        ' +
                                a +
                                '\n                        ' +
                                l +
                                '\n                    </div>\n                    ' +
                                i +
                                '\n                    <div id="' +
                                this.getIdName('lg-components') +
                                '" class="lg-components">\n                        ' +
                                s +
                                '\n                    </div>\n                </div> \n            </div>\n        </div>\n        ';
                        return (
                            o(this.settings.container)
                                .css('position', 'relative')
                                .append(c),
                            (this.outer = this.getElementById('lg-outer')),
                            (this.$lgContent = this.getElementById(
                                'lg-content',
                            )),
                            (this.$lgComponents = this.getElementById(
                                'lg-components',
                            )),
                            (this.$backdrop = this.getElementById(
                                'lg-backdrop',
                            )),
                            (this.$container = this.getElementById(
                                'lg-container',
                            )),
                            (this.$inner = this.getElementById('lg-inner')),
                            (this.$toolbar = this.getElementById('lg-toolbar')),
                            this.$backdrop.css(
                                'transition-duration',
                                this.settings.backdropDuration + 'ms',
                            ),
                            this.outer.addClass('lg-use-css3'),
                            this.outer.addClass('lg-css3'),
                            this.outer.addClass(this.settings.mode),
                            this.settings.enableDrag &&
                                this.galleryItems.length > 1 &&
                                this.outer.addClass('lg-grab'),
                            this.settings.showAfterLoad &&
                                this.outer.addClass('lg-show-after-load'),
                            this.$inner.css(
                                'transition-timing-function',
                                this.settings.easing,
                            ),
                            this.$inner.css(
                                'transition-duration',
                                this.settings.speed + 'ms',
                            ),
                            this.settings.download &&
                                this.$toolbar.append(
                                    '<a id="' +
                                        this.getIdName('lg-download') +
                                        '" target="_blank" aria-label="Download" download class="lg-download lg-icon"></a>',
                                ),
                            this.counter(),
                            o(window).on(
                                'resize.lg.global' +
                                    this.lgId +
                                    ' orientationchange.lg.global' +
                                    this.lgId,
                                function () {
                                    t.refreshOnResize();
                                },
                            ),
                            this.hideBars(),
                            this.manageCloseGallery(),
                            this.toggleMaximize(),
                            this.buildModules()
                        );
                    }),
                    (t.prototype.refreshOnResize = function () {
                        if (this.lgOpened) {
                            var t = this.galleryItems[this.index].t,
                                i = this.getMediaContainerPosition(),
                                s = i.top,
                                e = i.bottom;
                            if (
                                ((this.currentImageSize = l(
                                    this.items[this.index],
                                    this.$lgContent,
                                    s + e,
                                    t && this.settings.videoMaxSize,
                                )),
                                t &&
                                    this.resizeVideoSlide(
                                        this.index,
                                        this.currentImageSize,
                                    ),
                                this.zoomFromOrigin &&
                                    !this.isDummyImageRemoved)
                            ) {
                                var n = this.getDummyImgStyles(
                                    this.currentImageSize,
                                );
                                this.outer
                                    .find('.lg-current .lg-dummy-img')
                                    .first()
                                    .attr('style', n);
                            }
                            this.LGel.trigger(x);
                        }
                    }),
                    (t.prototype.resizeVideoSlide = function (t, i) {
                        var s = this.getVideoContStyle(i);
                        this.getSlideItem(t)
                            .find('.lg-video-cont')
                            .attr('style', s);
                    }),
                    (t.prototype.updateSlides = function (t, i) {
                        if (
                            (this.index > t.length - 1 &&
                                (this.index = t.length - 1),
                            1 === t.length && (this.index = 0),
                            t.length)
                        ) {
                            var s = this.galleryItems[i].src;
                            this.addSlideVideoInfo(t),
                                (this.galleryItems = t),
                                this.$inner.empty(),
                                (this.currentItemsInDom = []);
                            var e = 0;
                            this.galleryItems.some(function (t, i) {
                                return t.src === s && ((e = i), !0);
                            }),
                                (this.currentItemsInDom = this.organizeSlideItems(
                                    e,
                                    -1,
                                )),
                                this.loadContent(e, !0),
                                this.getSlideItem(e).addClass('lg-current'),
                                (this.index = e),
                                this.updateCurrentCounter(e),
                                this.updateCounterTotal(),
                                this.LGel.trigger(k);
                        } else this.closeGallery();
                    }),
                    (t.prototype.getItems = function () {
                        if (((this.items = []), this.settings.dynamic))
                            return this.settings.dynamicEl || [];
                        if ('this' === this.settings.selector)
                            this.items.push(this.el);
                        else if (this.settings.selector)
                            if ('string' == typeof this.settings.selector)
                                if (this.settings.selectWithin) {
                                    var t = o(this.settings.selectWithin);
                                    this.items = t
                                        .find(this.settings.selector)
                                        .get();
                                } else
                                    this.items = this.el.querySelectorAll(
                                        this.settings.selector,
                                    );
                            else this.items = this.settings.selector;
                        else this.items = this.el.children;
                        return m(
                            this.items,
                            this.settings.extraProps,
                            this.settings.getCaptionFromTitleOrAlt,
                            this.settings.exThumbImage,
                        );
                    }),
                    (t.prototype.openGallery = function (t, i) {
                        var s = this;
                        if (
                            (void 0 === t && (t = this.settings.index),
                            !this.lgOpened)
                        ) {
                            (this.lgOpened = !0),
                                this.outer.get().focus(),
                                this.outer.removeClass('lg-hide-items'),
                                this.$container.addClass('lg-show');
                            var e = this.getItemsToBeInsertedToDom(t, t);
                            this.currentItemsInDom = e;
                            var n = '';
                            e.forEach(function (t) {
                                n =
                                    n +
                                    '<div id="' +
                                    t +
                                    '" class="lg-item"></div>';
                            }),
                                this.$inner.append(n),
                                this.addHtml(t);
                            var r = '';
                            this.mediaContainerPosition = this.getMediaContainerPosition();
                            var h = this.mediaContainerPosition,
                                c = h.top,
                                u = h.bottom;
                            this.settings.allowMediaOverlap ||
                                this.setMediaContainerPosition(c, u),
                                this.zoomFromOrigin &&
                                    i &&
                                    ((this.currentImageSize = l(
                                        i,
                                        this.$lgContent,
                                        c + u,
                                        this.galleryItems[this.index].t &&
                                            this.settings.videoMaxSize,
                                    )),
                                    (r = a(
                                        i,
                                        this.$lgContent,
                                        c,
                                        u,
                                        this.currentImageSize,
                                    ))),
                                (this.zoomFromOrigin && r) ||
                                    (this.outer.addClass(
                                        this.settings.startClass,
                                    ),
                                    this.getSlideItem(t).removeClass(
                                        'lg-complete',
                                    ));
                            var g = this.settings.zoomFromOrigin
                                ? 100
                                : this.settings.backdropDuration;
                            setTimeout(function () {
                                s.outer.addClass('lg-components-open');
                            }, g),
                                this.LGel.trigger(z),
                                this.getSlideItem(t).addClass('lg-current'),
                                (this.lGalleryOn = !1),
                                (this.index = t),
                                (this.prevScrollTop = o(window).scrollTop()),
                                setTimeout(function () {
                                    if (s.zoomFromOrigin && r) {
                                        var i = s.getSlideItem(t);
                                        i.css('transform', r),
                                            setTimeout(function () {
                                                i
                                                    .addClass(
                                                        'lg-start-progress lg-start-end-progress',
                                                    )
                                                    .css(
                                                        'transition-duration',
                                                        s.settings
                                                            .startAnimationDuration +
                                                            'ms',
                                                    ),
                                                    s.outer.addClass(
                                                        'lg-zoom-from-image',
                                                    );
                                            }),
                                            setTimeout(function () {
                                                i.css(
                                                    'transform',
                                                    'translate3d(0, 0, 0)',
                                                );
                                            }, 100);
                                    }
                                    setTimeout(function () {
                                        s.$backdrop.addClass('in'),
                                            s.$container.addClass('lg-show-in');
                                    }, 10),
                                        (s.zoomFromOrigin && r) ||
                                            setTimeout(function () {
                                                s.outer.addClass('lg-visible');
                                            }, s.settings.backdropDuration),
                                        s.slide(t, !1, !1, !1),
                                        s.LGel.trigger(M);
                                }),
                                o(document.body).addClass('lg-on');
                        }
                    }),
                    (t.prototype.getMediaContainerPosition = function () {
                        if (this.settings.allowMediaOverlap)
                            return { top: 0, bottom: 0 };
                        var t = this.$toolbar.get().clientHeight || 0,
                            i =
                                this.settings.defaultCaptionHeight ||
                                this.outer.find('.lg-sub-html').get()
                                    .clientHeight,
                            s = this.outer.find('.lg-thumb-outer').get();
                        return { top: t, bottom: (s ? s.clientHeight : 0) + i };
                    }),
                    (t.prototype.setMediaContainerPosition = function (t, i) {
                        void 0 === t && (t = 0),
                            void 0 === i && (i = 0),
                            this.$inner
                                .css('top', t + 'px')
                                .css('bottom', i + 'px');
                    }),
                    (t.prototype.buildFromHash = function () {
                        var t = this,
                            i = window.location.hash;
                        if (i.indexOf('lg=' + this.settings.galleryId) > 0) {
                            o(document.body).addClass('lg-from-hash'),
                                (this.zoomFromOrigin = !1);
                            var s = this.getIndexFromUrl(i),
                                e = this.buildStructure();
                            return (
                                setTimeout(function () {
                                    t.openGallery(s);
                                }, e),
                                !0
                            );
                        }
                    }),
                    (t.prototype.hideBars = function () {
                        var t = this;
                        setTimeout(function () {
                            t.outer.removeClass('lg-hide-items'),
                                t.settings.hideBarsDelay > 0 &&
                                    (t.outer.on(
                                        'mousemove.lg click.lg touchstart.lg',
                                        function () {
                                            t.outer.removeClass(
                                                'lg-hide-items',
                                            ),
                                                clearTimeout(t.hideBarTimeout),
                                                (t.hideBarTimeout = setTimeout(
                                                    function () {
                                                        t.outer.addClass(
                                                            'lg-hide-items',
                                                        );
                                                    },
                                                    t.settings.hideBarsDelay,
                                                ));
                                        },
                                    ),
                                    t.outer.trigger('mousemove.lg'));
                        }, this.settings.showBarsAfter);
                    }),
                    (t.prototype.initPictureFill = function (t) {
                        if (this.settings.supportLegacyBrowser)
                            try {
                                picturefill({ elements: [t.get()] });
                            } catch (t) {
                                console.warn(
                                    'lightGallery :- If you want srcset or picture tag to be supported for older browser please include picturefil javascript library in your document.',
                                );
                            }
                    }),
                    (t.prototype.counter = function () {
                        if (this.settings.counter) {
                            var t =
                                '<div class="lg-counter" role="status" aria-live="polite">\n                <span id="' +
                                this.getIdName('lg-counter-current') +
                                '" class="lg-counter-current">' +
                                (this.index + 1) +
                                ' </span> / \n                <span id="' +
                                this.getIdName('lg-counter-all') +
                                '" class="lg-counter-all">' +
                                this.galleryItems.length +
                                ' </span></div>';
                            this.outer
                                .find(this.settings.appendCounterTo)
                                .append(t);
                        }
                    }),
                    (t.prototype.addHtml = function (t) {
                        var i, s;
                        if (
                            (this.galleryItems[t].subHtmlUrl
                                ? (s = this.galleryItems[t].subHtmlUrl)
                                : (i = this.galleryItems[t].subHtml),
                            !s)
                        )
                            if (i) {
                                var e = i.substring(0, 1);
                                ('.' !== e && '#' !== e) ||
                                    (i =
                                        this.settings.subHtmlSelectorRelative &&
                                        !this.settings.dynamic
                                            ? o(this.items)
                                                  .eq(t)
                                                  .find(i)
                                                  .first()
                                                  .html()
                                            : o(i).first().html());
                            } else i = '';
                        if ('.lg-sub-html' === this.settings.appendSubHtmlTo)
                            s
                                ? this.outer.find('.lg-sub-html').load(s)
                                : this.outer.find('.lg-sub-html').html(i);
                        else {
                            var n = o(this.getSlideItemId(t));
                            s
                                ? n.load(s)
                                : n.append(
                                      '<div class="lg-sub-html">' +
                                          i +
                                          '</div>',
                                  );
                        }
                        null != i &&
                            ('' === i
                                ? this.outer
                                      .find(this.settings.appendSubHtmlTo)
                                      .addClass('lg-empty-html')
                                : this.outer
                                      .find(this.settings.appendSubHtmlTo)
                                      .removeClass('lg-empty-html')),
                            this.LGel.trigger(T, { index: t });
                    }),
                    (t.prototype.preload = function (t) {
                        for (
                            var i = 1;
                            i <= this.settings.preload &&
                            !(i >= this.galleryItems.length - t);
                            i++
                        )
                            this.loadContent(t + i, !1);
                        for (
                            var s = 1;
                            s <= this.settings.preload && !(t - s < 0);
                            s++
                        )
                            this.loadContent(t - s, !1);
                    }),
                    (t.prototype.getDummyImgStyles = function (t) {
                        return t
                            ? 'width:' +
                                  t.width +
                                  'px; \n                margin-left: -' +
                                  t.width / 2 +
                                  'px;\n                margin-top: -' +
                                  t.height / 2 +
                                  'px; \n                height:' +
                                  t.height +
                                  'px'
                            : '';
                    }),
                    (t.prototype.getVideoContStyle = function (t) {
                        return t
                            ? 'width:' +
                                  t.width +
                                  'px; \n                height:' +
                                  t.height +
                                  'px'
                            : '';
                    }),
                    (t.prototype.getDummyImageContent = function (t, i, s) {
                        var e;
                        if (
                            (this.settings.dynamic || (e = o(this.items).eq(i)),
                            e)
                        ) {
                            var n = void 0;
                            n = this.settings.exThumbImage
                                ? e.attr(this.settings.exThumbImage)
                                : e.find('img').first().attr('src');
                            var r =
                                '<img ' +
                                s +
                                ' style="' +
                                this.getDummyImgStyles(this.currentImageSize) +
                                '" class="lg-dummy-img" src="' +
                                n +
                                '" />';
                            return t.addClass('lg-first-slide'), r;
                        }
                        return '';
                    }),
                    (t.prototype.setImgMarkup = function (t, i, s) {
                        var e = this.galleryItems[s],
                            n = e.alt,
                            o = e.srcset,
                            r = e.sizes,
                            h = e.sources,
                            l = n ? 'alt="' + n + '"' : '',
                            a =
                                '<picture class="lg-img-wrap"> ' +
                                (!this.lGalleryOn &&
                                this.zoomFromOrigin &&
                                this.currentImageSize
                                    ? this.getDummyImageContent(i, s, l)
                                    : u(s, t, l, o, r, h)) +
                                '</picture>';
                        i.prepend(a);
                    }),
                    (t.prototype.onLgObjectLoad = function (t, i, s, e, n) {
                        var o = this;
                        n && this.LGel.trigger(j, { index: i, delay: s || 0 }),
                            t
                                .find('.lg-object')
                                .first()
                                .on('load.lg', function () {
                                    o.handleLgObjectLoad(t, i, s, e, n);
                                }),
                            setTimeout(function () {
                                t.find('.lg-object')
                                    .first()
                                    .on('error.lg', function () {
                                        t.addClass('lg-complete lg-complete_'),
                                            t.html(
                                                '<span class="lg-error-msg">Oops... Failed to load content...</span>',
                                            );
                                    });
                            }, e);
                    }),
                    (t.prototype.handleLgObjectLoad = function (t, i, s, e, n) {
                        var o = this;
                        setTimeout(function () {
                            t.addClass('lg-complete lg-complete_'),
                                n ||
                                    o.LGel.trigger(j, {
                                        index: i,
                                        delay: s || 0,
                                    });
                        }, e);
                    }),
                    (t.prototype.isVideo = function (t, i) {
                        if (!t)
                            return this.galleryItems[i].video
                                ? { html5: !0 }
                                : void console.error(
                                      'lightGallery :- data-src is not provided on slide item ' +
                                          (i + 1) +
                                          '. Please make sure the selector property is properly configured. More info - http://sachinchoolur.github.io/lightGallery/demos/html-markup.html',
                                  );
                        var s = t.match(
                                /\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i,
                            ),
                            e = t.match(
                                /\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)/i,
                            ),
                            n = t.match(
                                /https?:\/\/(.+)?(wistia\.com|wi\.st)\/(medias|embed)\/([0-9a-z\-_]+)(.*)/,
                            );
                        return s
                            ? { youtube: s }
                            : e
                            ? { vimeo: e }
                            : n
                            ? { wistia: n }
                            : void 0;
                    }),
                    (t.prototype.addSlideVideoInfo = function (t) {
                        var i = this;
                        t.forEach(function (t, s) {
                            t.t = i.isVideo(t.src, s);
                        });
                    }),
                    (t.prototype.loadContent = function (t, i) {
                        var s = this,
                            e = this.galleryItems[t],
                            n = o(this.getSlideItemId(t)),
                            r = e.poster,
                            h = e.srcset,
                            a = e.sizes,
                            m = e.sources,
                            v = e.src,
                            p = e.video,
                            w = p && 'string' == typeof p ? JSON.parse(p) : p;
                        if (e.responsive) {
                            var x = e.responsive.split(',');
                            v = g(x) || v;
                        }
                        var k = e.t,
                            T = '',
                            z = !!e.iframe;
                        if (!n.hasClass('lg-loaded')) {
                            if (k) {
                                var M = this.mediaContainerPosition,
                                    j = M.top,
                                    S = M.bottom,
                                    O = l(
                                        this.items[t],
                                        this.$lgContent,
                                        j + S,
                                        k && this.settings.videoMaxSize,
                                    );
                                T = this.getVideoContStyle(O);
                            }
                            if (z) {
                                var I = c(
                                    v,
                                    this.settings.iframeWidth,
                                    this.settings.iframeHeight,
                                    e.iframeTitle,
                                );
                                n.prepend(I);
                            } else if (r) {
                                var A = '',
                                    C = !this.lGalleryOn,
                                    F =
                                        !this.lGalleryOn &&
                                        this.zoomFromOrigin &&
                                        this.currentImageSize;
                                F && (A = this.getDummyImageContent(n, t, '')),
                                    (I = f(r, A || '', T, k)),
                                    n.prepend(I);
                                var _ =
                                    (F
                                        ? this.settings.startAnimationDuration
                                        : this.settings.backdropDuration) + 100;
                                setTimeout(function () {
                                    s.LGel.trigger(y, {
                                        index: t,
                                        src: v,
                                        html5Video: w,
                                        hasPoster: !0,
                                        isFirstSlide: C,
                                    });
                                }, _);
                            } else if (k)
                                (I =
                                    '<div class="lg-video-cont " style="' +
                                    T +
                                    '"></div>'),
                                    n.prepend(I),
                                    this.LGel.trigger(y, {
                                        index: t,
                                        src: v,
                                        html5Video: w,
                                        hasPoster: !1,
                                    });
                            else if ((this.setImgMarkup(v, n, t), h || m)) {
                                var D = n.find('.lg-object');
                                this.initPictureFill(D);
                            }
                            this.LGel.trigger(b, { index: t }),
                                this.lGalleryOn &&
                                    '.lg-sub-html' !==
                                        this.settings.appendSubHtmlTo &&
                                    this.addHtml(t);
                        }
                        var B = 0,
                            E = 0;
                        this.lGalleryOn ||
                            (E =
                                this.zoomFromOrigin && this.currentImageSize
                                    ? this.settings.startAnimationDuration + 10
                                    : this.settings.backdropDuration + 10),
                            E &&
                                !o(document.body).hasClass('lg-from-hash') &&
                                (B = E),
                            !this.lGalleryOn &&
                                this.zoomFromOrigin &&
                                this.currentImageSize &&
                                (setTimeout(function () {
                                    n.removeClass(
                                        'lg-start-end-progress lg-start-progress',
                                    ).removeAttr('style');
                                }, this.settings.startAnimationDuration + 100),
                                n.hasClass('lg-loaded') ||
                                    setTimeout(function () {
                                        if (
                                            (n
                                                .find('.lg-img-wrap')
                                                .append(
                                                    u(
                                                        t,
                                                        v,
                                                        '',
                                                        h,
                                                        a,
                                                        e.sources,
                                                    ),
                                                ),
                                            h || m)
                                        ) {
                                            var i = n.find('.lg-object');
                                            s.initPictureFill(i);
                                        }
                                        s.onLgObjectLoad(n, t, E, B, !0);
                                        var o = n.find('.lg-object').first();
                                        d(o.get())
                                            ? s.loadContentOnLoad(t, n, B)
                                            : o.on(
                                                  'load.lg error.lg',
                                                  function () {
                                                      s.loadContentOnLoad(
                                                          t,
                                                          n,
                                                          B,
                                                      );
                                                  },
                                              );
                                    }, this.settings.startAnimationDuration +
                                        100)),
                            n.addClass('lg-loaded'),
                            this.onLgObjectLoad(n, t, E, B, !1),
                            k &&
                                k.html5 &&
                                !r &&
                                n.addClass('lg-complete lg-complete_'),
                            (this.zoomFromOrigin && this.currentImageSize) ||
                                !n.hasClass('lg-complete_') ||
                                this.lGalleryOn ||
                                setTimeout(function () {
                                    n.addClass('lg-complete');
                                }, this.settings.backdropDuration),
                            (this.lGalleryOn = !0),
                            !0 === i &&
                                (n.hasClass('lg-complete_')
                                    ? this.preload(t)
                                    : n
                                          .find('.lg-object')
                                          .first()
                                          .on('load.lg error.lg', function () {
                                              s.preload(t);
                                          }));
                    }),
                    (t.prototype.loadContentOnLoad = function (t, i, s) {
                        var e = this;
                        setTimeout(function () {
                            i.find('.lg-dummy-img').remove(),
                                i.removeClass('lg-first-slide'),
                                (e.isDummyImageRemoved = !0),
                                e.preload(t);
                        }, s + 300);
                    }),
                    (t.prototype.getItemsToBeInsertedToDom = function (
                        t,
                        i,
                        s,
                    ) {
                        var e = this;
                        void 0 === s && (s = 0);
                        var n = [],
                            o = Math.max(s, 3);
                        o = Math.min(o, this.galleryItems.length);
                        var r = 'lg-item-' + this.lgId + '-' + i;
                        if (this.galleryItems.length <= 3)
                            return (
                                this.galleryItems.forEach(function (t, i) {
                                    n.push('lg-item-' + e.lgId + '-' + i);
                                }),
                                n
                            );
                        if (t < (this.galleryItems.length - 1) / 2) {
                            for (var h = t; h > t - o / 2 && h >= 0; h--)
                                n.push('lg-item-' + this.lgId + '-' + h);
                            var l = n.length;
                            for (h = 0; h < o - l; h++)
                                n.push(
                                    'lg-item-' + this.lgId + '-' + (t + h + 1),
                                );
                        } else {
                            for (
                                h = t;
                                h <= this.galleryItems.length - 1 &&
                                h < t + o / 2;
                                h++
                            )
                                n.push('lg-item-' + this.lgId + '-' + h);
                            for (l = n.length, h = 0; h < o - l; h++)
                                n.push(
                                    'lg-item-' + this.lgId + '-' + (t - h - 1),
                                );
                        }
                        return (
                            this.settings.loop &&
                                (t === this.galleryItems.length - 1
                                    ? n.push('lg-item-' + this.lgId + '-0')
                                    : 0 === t &&
                                      n.push(
                                          'lg-item-' +
                                              this.lgId +
                                              '-' +
                                              (this.galleryItems.length - 1),
                                      )),
                            -1 === n.indexOf(r) &&
                                n.push('lg-item-' + this.lgId + '-' + i),
                            n
                        );
                    }),
                    (t.prototype.organizeSlideItems = function (t, i) {
                        var s = this,
                            e = this.getItemsToBeInsertedToDom(
                                t,
                                i,
                                this.settings.numberOfSlideItemsInDom,
                            );
                        return (
                            e.forEach(function (t) {
                                -1 === s.currentItemsInDom.indexOf(t) &&
                                    s.$inner.append(
                                        '<div id="' +
                                            t +
                                            '" class="lg-item"></div>',
                                    );
                            }),
                            this.currentItemsInDom.forEach(function (t) {
                                -1 === e.indexOf(t) && o('#' + t).remove();
                            }),
                            e
                        );
                    }),
                    (t.prototype.getPreviousSlideIndex = function () {
                        var t = 0;
                        try {
                            var i = this.outer
                                .find('.lg-current')
                                .first()
                                .attr('id');
                            t = parseInt(i.split('-')[3]) || 0;
                        } catch (i) {
                            t = 0;
                        }
                        return t;
                    }),
                    (t.prototype.setDownloadValue = function (t) {
                        if (this.settings.download) {
                            var i = this.galleryItems[t],
                                s =
                                    !1 !== i.downloadUrl &&
                                    (i.downloadUrl || i.src);
                            s &&
                                !i.iframe &&
                                this.getElementById('lg-download').attr(
                                    'href',
                                    s,
                                );
                        }
                    }),
                    (t.prototype.makeSlideAnimation = function (t, i, s) {
                        var e = this;
                        this.lGalleryOn && s.addClass('lg-slide-progress'),
                            setTimeout(function () {
                                e.outer.addClass('lg-no-trans'),
                                    e.outer
                                        .find('.lg-item')
                                        .removeClass(
                                            'lg-prev-slide lg-next-slide',
                                        ),
                                    'prev' === t
                                        ? (i.addClass('lg-prev-slide'),
                                          s.addClass('lg-next-slide'))
                                        : (i.addClass('lg-next-slide'),
                                          s.addClass('lg-prev-slide')),
                                    setTimeout(function () {
                                        e.outer
                                            .find('.lg-item')
                                            .removeClass('lg-current'),
                                            i.addClass('lg-current'),
                                            e.outer.removeClass('lg-no-trans');
                                    }, 50);
                            }, this.settings.slideDelay);
                    }),
                    (t.prototype.slide = function (t, i, s, e) {
                        var n = this,
                            o = this.getPreviousSlideIndex();
                        if (
                            ((this.currentItemsInDom = this.organizeSlideItems(
                                t,
                                o,
                            )),
                            !this.lGalleryOn || o !== t)
                        ) {
                            var r = this.galleryItems.length;
                            if (!this.lgBusy) {
                                this.settings.counter &&
                                    this.updateCurrentCounter(t);
                                var h = this.getSlideItem(t),
                                    a = this.getSlideItem(o),
                                    c = this.galleryItems[t],
                                    u = c.t;
                                if (
                                    (this.outer.attr(
                                        'data-lg-slide-type',
                                        this.getSlideType(c),
                                    ),
                                    this.setDownloadValue(t),
                                    u)
                                ) {
                                    var g = this.mediaContainerPosition,
                                        d = g.top,
                                        f = g.bottom,
                                        m = l(
                                            this.items[t],
                                            this.$lgContent,
                                            d + f,
                                            u && this.settings.videoMaxSize,
                                        );
                                    this.resizeVideoSlide(t, m);
                                }
                                if (
                                    (this.LGel.trigger(S, {
                                        prevIndex: o,
                                        index: t,
                                        fromTouch: !!i,
                                        fromThumb: !!s,
                                    }),
                                    (this.lgBusy = !0),
                                    clearTimeout(this.hideBarTimeout),
                                    this.arrowDisable(t),
                                    e ||
                                        (t < o
                                            ? (e = 'prev')
                                            : t > o && (e = 'next')),
                                    i)
                                ) {
                                    this.outer
                                        .find('.lg-item')
                                        .removeClass(
                                            'lg-prev-slide lg-current lg-next-slide',
                                        );
                                    var v = void 0,
                                        p = void 0;
                                    r > 2
                                        ? ((v = t - 1),
                                          (p = t + 1),
                                          ((0 === t && o === r - 1) ||
                                              (t === r - 1 && 0 === o)) &&
                                              ((p = 0), (v = r - 1)))
                                        : ((v = 0), (p = 1)),
                                        'prev' === e
                                            ? this.getSlideItem(p).addClass(
                                                  'lg-next-slide',
                                              )
                                            : this.getSlideItem(v).addClass(
                                                  'lg-prev-slide',
                                              ),
                                        h.addClass('lg-current');
                                } else this.makeSlideAnimation(e, h, a);
                                this.lGalleryOn || this.loadContent(t, !0),
                                    setTimeout(function () {
                                        n.lGalleryOn && n.loadContent(t, !0),
                                            '.lg-sub-html' ===
                                                n.settings.appendSubHtmlTo &&
                                                n.addHtml(t);
                                    }, (this.lGalleryOn
                                        ? this.settings.speed + 50
                                        : 50) +
                                        (i ? 0 : this.settings.slideDelay)),
                                    setTimeout(function () {
                                        (n.lgBusy = !1),
                                            a.removeClass('lg-slide-progress'),
                                            n.LGel.trigger(O, {
                                                prevIndex: o,
                                                index: t,
                                                fromTouch: i,
                                                fromThumb: s,
                                            });
                                    }, (this.lGalleryOn
                                        ? this.settings.speed + 100
                                        : 100) +
                                        (i ? 0 : this.settings.slideDelay));
                            }
                            this.index = t;
                        }
                    }),
                    (t.prototype.updateCurrentCounter = function (t) {
                        this.getElementById('lg-counter-current').html(
                            t + 1 + '',
                        );
                    }),
                    (t.prototype.updateCounterTotal = function () {
                        this.getElementById('lg-counter-all').html(
                            this.galleryItems.length + '',
                        );
                    }),
                    (t.prototype.getSlideType = function (t) {
                        return t.t ? 'video' : t.iframe ? 'iframe' : 'image';
                    }),
                    (t.prototype.touchMove = function (t, i) {
                        var s = i.pageX - t.pageX,
                            e = i.pageY - t.pageY,
                            n = !1;
                        if (
                            (this.swipeDirection
                                ? (n = !0)
                                : Math.abs(s) > 15
                                ? ((this.swipeDirection = 'horizontal'),
                                  (n = !0))
                                : Math.abs(e) > 15 &&
                                  ((this.swipeDirection = 'vertical'),
                                  (n = !0)),
                            n)
                        ) {
                            var o = this.getSlideItem(this.index);
                            if ('horizontal' === this.swipeDirection) {
                                this.outer.addClass('lg-dragging'),
                                    this.setTranslate(o, s, 0);
                                var r = o.get().offsetWidth,
                                    h =
                                        (15 * r) / 100 -
                                        Math.abs((10 * s) / 100);
                                this.setTranslate(
                                    this.outer.find('.lg-prev-slide').first(),
                                    -r + s - h,
                                    0,
                                ),
                                    this.setTranslate(
                                        this.outer
                                            .find('.lg-next-slide')
                                            .first(),
                                        r + s + h,
                                        0,
                                    );
                            } else if (
                                'vertical' === this.swipeDirection &&
                                this.settings.swipeToClose
                            ) {
                                this.$container.addClass(
                                    'lg-dragging-vertical',
                                );
                                var l = 1 - Math.abs(e) / window.innerHeight;
                                this.$backdrop.css('opacity', l);
                                var a =
                                    1 - Math.abs(e) / (2 * window.innerWidth);
                                this.setTranslate(o, 0, e, a, a),
                                    Math.abs(e) > 100 &&
                                        this.outer
                                            .addClass('lg-hide-items')
                                            .removeClass('lg-components-open');
                            }
                        }
                    }),
                    (t.prototype.touchEnd = function (t, i, s) {
                        var e,
                            n = this;
                        'lg-slide' !== this.settings.mode &&
                            this.outer.addClass('lg-slide'),
                            setTimeout(function () {
                                n.$container.removeClass(
                                    'lg-dragging-vertical',
                                ),
                                    n.outer
                                        .removeClass(
                                            'lg-dragging lg-hide-items',
                                        )
                                        .addClass('lg-components-open');
                                var r = !0;
                                if ('horizontal' === n.swipeDirection) {
                                    e = t.pageX - i.pageX;
                                    var h = Math.abs(t.pageX - i.pageX);
                                    e < 0 && h > n.settings.swipeThreshold
                                        ? (n.goToNextSlide(!0), (r = !1))
                                        : e > 0 &&
                                          h > n.settings.swipeThreshold &&
                                          (n.goToPrevSlide(!0), (r = !1));
                                } else if ('vertical' === n.swipeDirection) {
                                    if (
                                        ((e = Math.abs(t.pageY - i.pageY)),
                                        n.settings.closable &&
                                            n.settings.swipeToClose &&
                                            e > 100)
                                    )
                                        return void n.closeGallery();
                                    n.$backdrop.css('opacity', 1);
                                }
                                if (
                                    (n.outer
                                        .find('.lg-item')
                                        .removeAttr('style'),
                                    r && Math.abs(t.pageX - i.pageX) < 5)
                                ) {
                                    var l = o(s.target);
                                    n.isPosterElement(l) && n.LGel.trigger(I);
                                }
                                n.swipeDirection = void 0;
                            }),
                            setTimeout(function () {
                                n.outer.hasClass('lg-dragging') ||
                                    'lg-slide' === n.settings.mode ||
                                    n.outer.removeClass('lg-slide');
                            }, this.settings.speed + 100);
                    }),
                    (t.prototype.enableSwipe = function () {
                        var t = this,
                            i = {},
                            s = {},
                            e = !1,
                            n = !1;
                        this.settings.enableSwipe &&
                            (this.$inner.on('touchstart.lg', function (s) {
                                s.preventDefault();
                                var e = t.getSlideItem(t.index);
                                (!o(s.target).hasClass('lg-item') &&
                                    !e.get().contains(s.target)) ||
                                    t.outer.hasClass('lg-zoomed') ||
                                    t.lgBusy ||
                                    1 !== s.targetTouches.length ||
                                    ((n = !0),
                                    (t.touchAction = 'swipe'),
                                    t.manageSwipeClass(),
                                    (i = {
                                        pageX: s.targetTouches[0].pageX,
                                        pageY: s.targetTouches[0].pageY,
                                    }));
                            }),
                            this.$inner.on('touchmove.lg', function (o) {
                                o.preventDefault(),
                                    n &&
                                        'swipe' === t.touchAction &&
                                        1 === o.targetTouches.length &&
                                        ((s = {
                                            pageX: o.targetTouches[0].pageX,
                                            pageY: o.targetTouches[0].pageY,
                                        }),
                                        t.touchMove(i, s),
                                        (e = !0));
                            }),
                            this.$inner.on('touchend.lg', function (r) {
                                if ('swipe' === t.touchAction) {
                                    if (e) (e = !1), t.touchEnd(s, i, r);
                                    else if (n) {
                                        var h = o(r.target);
                                        t.isPosterElement(h) &&
                                            t.LGel.trigger(I);
                                    }
                                    (t.touchAction = void 0), (n = !1);
                                }
                            }));
                    }),
                    (t.prototype.enableDrag = function () {
                        var t = this,
                            i = {},
                            s = {},
                            e = !1,
                            n = !1;
                        this.settings.enableDrag &&
                            (this.outer.on('mousedown.lg', function (s) {
                                var n = t.getSlideItem(t.index);
                                (o(s.target).hasClass('lg-item') ||
                                    n.get().contains(s.target)) &&
                                    (t.outer.hasClass('lg-zoomed') ||
                                        t.lgBusy ||
                                        (s.preventDefault(),
                                        t.lgBusy ||
                                            (t.manageSwipeClass(),
                                            (i = {
                                                pageX: s.pageX,
                                                pageY: s.pageY,
                                            }),
                                            (e = !0),
                                            (t.outer.get().scrollLeft += 1),
                                            (t.outer.get().scrollLeft -= 1),
                                            t.outer
                                                .removeClass('lg-grab')
                                                .addClass('lg-grabbing'),
                                            t.LGel.trigger(A))));
                            }),
                            o(window).on(
                                'mousemove.lg.global' + this.lgId,
                                function (o) {
                                    e &&
                                        t.lgOpened &&
                                        ((n = !0),
                                        (s = {
                                            pageX: o.pageX,
                                            pageY: o.pageY,
                                        }),
                                        t.touchMove(i, s),
                                        t.LGel.trigger(C));
                                },
                            ),
                            o(window).on(
                                'mouseup.lg.global' + this.lgId,
                                function (r) {
                                    if (t.lgOpened) {
                                        var h = o(r.target);
                                        n
                                            ? ((n = !1),
                                              t.touchEnd(s, i, r),
                                              t.LGel.trigger(F))
                                            : t.isPosterElement(h) &&
                                              t.LGel.trigger(I),
                                            e &&
                                                ((e = !1),
                                                t.outer
                                                    .removeClass('lg-grabbing')
                                                    .addClass('lg-grab'));
                                    }
                                },
                            ));
                    }),
                    (t.prototype.manageSwipeClass = function () {
                        var t = this.index + 1,
                            i = this.index - 1;
                        this.settings.loop &&
                            this.galleryItems.length > 2 &&
                            (0 === this.index
                                ? (i = this.galleryItems.length - 1)
                                : this.index === this.galleryItems.length - 1 &&
                                  (t = 0)),
                            this.outer
                                .find('.lg-item')
                                .removeClass('lg-next-slide lg-prev-slide'),
                            i > -1 &&
                                this.getSlideItem(i).addClass('lg-prev-slide'),
                            this.getSlideItem(t).addClass('lg-next-slide');
                    }),
                    (t.prototype.goToNextSlide = function (t) {
                        var i = this,
                            s = this.settings.loop;
                        t && this.galleryItems.length < 3 && (s = !1),
                            this.lgBusy ||
                                (this.index + 1 < this.galleryItems.length
                                    ? (this.index++,
                                      this.LGel.trigger(_, {
                                          index: this.index,
                                      }),
                                      this.slide(this.index, !!t, !1, 'next'))
                                    : s
                                    ? ((this.index = 0),
                                      this.LGel.trigger(_, {
                                          index: this.index,
                                      }),
                                      this.slide(this.index, !!t, !1, 'next'))
                                    : this.settings.slideEndAnimation &&
                                      !t &&
                                      (this.outer.addClass('lg-right-end'),
                                      setTimeout(function () {
                                          i.outer.removeClass('lg-right-end');
                                      }, 400)));
                    }),
                    (t.prototype.goToPrevSlide = function (t) {
                        var i = this,
                            s = this.settings.loop;
                        t && this.galleryItems.length < 3 && (s = !1),
                            this.lgBusy ||
                                (this.index > 0
                                    ? (this.index--,
                                      this.LGel.trigger(D, {
                                          index: this.index,
                                          fromTouch: t,
                                      }),
                                      this.slide(this.index, !!t, !1, 'prev'))
                                    : s
                                    ? ((this.index =
                                          this.galleryItems.length - 1),
                                      this.LGel.trigger(D, {
                                          index: this.index,
                                          fromTouch: t,
                                      }),
                                      this.slide(this.index, !!t, !1, 'prev'))
                                    : this.settings.slideEndAnimation &&
                                      !t &&
                                      (this.outer.addClass('lg-left-end'),
                                      setTimeout(function () {
                                          i.outer.removeClass('lg-left-end');
                                      }, 400)));
                    }),
                    (t.prototype.keyPress = function () {
                        var t = this;
                        o(window).on('keydown.lg.global' + this.lgId, function (
                            i,
                        ) {
                            t.lgOpened &&
                                !0 === t.settings.escKey &&
                                27 === i.keyCode &&
                                (i.preventDefault(),
                                t.settings.allowMediaOverlap &&
                                t.outer.hasClass('lg-can-toggle') &&
                                t.outer.hasClass('lg-components-open')
                                    ? t.outer.removeClass('lg-components-open')
                                    : t.closeGallery()),
                                t.lgOpened &&
                                    t.galleryItems.length > 1 &&
                                    (37 === i.keyCode &&
                                        (i.preventDefault(), t.goToPrevSlide()),
                                    39 === i.keyCode &&
                                        (i.preventDefault(),
                                        t.goToNextSlide()));
                        });
                    }),
                    (t.prototype.arrow = function () {
                        var t = this;
                        this.getElementById('lg-prev').on(
                            'click.lg',
                            function () {
                                t.goToPrevSlide();
                            },
                        ),
                            this.getElementById('lg-next').on(
                                'click.lg',
                                function () {
                                    t.goToNextSlide();
                                },
                            );
                    }),
                    (t.prototype.arrowDisable = function (t) {
                        if (
                            !this.settings.loop &&
                            this.settings.hideControlOnEnd
                        ) {
                            var i = this.getElementById('lg-prev'),
                                s = this.getElementById('lg-next');
                            t + 1 < this.galleryItems.length
                                ? i
                                      .removeAttr('disabled')
                                      .removeClass('disabled')
                                : i
                                      .attr('disabled', 'disabled')
                                      .addClass('disabled'),
                                t > 0
                                    ? s
                                          .removeAttr('disabled')
                                          .removeClass('disabled')
                                    : s
                                          .attr('disabled', 'disabled')
                                          .addClass('disabled');
                        }
                    }),
                    (t.prototype.getIndexFromUrl = function (t) {
                        void 0 === t && (t = window.location.hash);
                        var i = t.split('&slide=')[1],
                            s = 0;
                        if (this.settings.customSlideName) {
                            for (var e = 0; e < this.galleryItems.length; e++)
                                if (this.galleryItems[e].slideName === i) {
                                    s = e;
                                    break;
                                }
                        } else s = parseInt(i, 10);
                        return isNaN(s) ? 0 : s;
                    }),
                    (t.prototype.setTranslate = function (t, i, s, e, n) {
                        void 0 === e && (e = 1),
                            void 0 === n && (n = 1),
                            t.css(
                                'transform',
                                'translate3d(' +
                                    i +
                                    'px, ' +
                                    s +
                                    'px, 0px) scale3d(' +
                                    e +
                                    ', ' +
                                    n +
                                    ', 1)',
                            );
                    }),
                    (t.prototype.mousewheel = function () {
                        var t = this;
                        this.outer.on('mousewheel.lg', function (i) {
                            i.deltaY &&
                                (i.deltaY > 0
                                    ? t.goToPrevSlide()
                                    : t.goToNextSlide(),
                                i.preventDefault());
                        });
                    }),
                    (t.prototype.isSlideElement = function (t) {
                        return (
                            t.hasClass('lg-outer') ||
                            t.hasClass('lg-item') ||
                            t.hasClass('lg-img-wrap')
                        );
                    }),
                    (t.prototype.isPosterElement = function (t) {
                        var i = this.getSlideItem(this.index)
                            .find('.lg-video-play-button')
                            .get();
                        return (
                            t.hasClass('lg-video-poster') ||
                            t.hasClass('lg-video-play-button') ||
                            (i && i.contains(t.get()))
                        );
                    }),
                    (t.prototype.toggleMaximize = function () {
                        var t = this;
                        this.getElementById('lg-maximize').on(
                            'click.lg',
                            function () {
                                t.$container.toggleClass('lg-inline'),
                                    t.refreshOnResize();
                            },
                        );
                    }),
                    (t.prototype.manageCloseGallery = function () {
                        var t = this;
                        if (this.settings.closable) {
                            var i = !1;
                            this.getElementById('lg-close').on(
                                'click.lg',
                                function () {
                                    t.closeGallery();
                                },
                            ),
                                this.settings.closeOnTap &&
                                    (this.outer.on('mousedown.lg', function (
                                        s,
                                    ) {
                                        var e = o(s.target);
                                        i = !!t.isSlideElement(e);
                                    }),
                                    this.outer.on('mousemove.lg', function () {
                                        i = !1;
                                    }),
                                    this.outer.on('mouseup.lg', function (s) {
                                        var e = o(s.target);
                                        t.isSlideElement(e) &&
                                            i &&
                                            (t.outer.hasClass('lg-dragging') ||
                                                t.closeGallery());
                                    }));
                        }
                    }),
                    (t.prototype.closeGallery = function (t) {
                        var i = this;
                        if (!this.lgOpened || (!this.settings.closable && !t))
                            return 0;
                        this.LGel.trigger(B),
                            o(window).scrollTop(this.prevScrollTop);
                        var s,
                            e = this.items[this.index];
                        if (this.zoomFromOrigin && e) {
                            var n = this.mediaContainerPosition,
                                r = n.top,
                                h = n.bottom,
                                c = l(
                                    e,
                                    this.$lgContent,
                                    r + h,
                                    this.galleryItems[this.index].t &&
                                        this.settings.videoMaxSize,
                                );
                            s = a(e, this.$lgContent, r, h, c);
                        }
                        this.zoomFromOrigin && s
                            ? (this.outer.addClass(
                                  'lg-closing lg-zoom-from-image',
                              ),
                              this.getSlideItem(this.index)
                                  .addClass('lg-start-end-progress')
                                  .css(
                                      'transition-duration',
                                      this.settings.startAnimationDuration +
                                          'ms',
                                  )
                                  .css('transform', s))
                            : (this.outer.addClass('lg-hide-items'),
                              this.outer.removeClass('lg-zoom-from-image')),
                            this.destroyModules(),
                            (this.lGalleryOn = !1),
                            (this.isDummyImageRemoved = !1),
                            (this.zoomFromOrigin = this.settings.zoomFromOrigin),
                            clearTimeout(this.hideBarTimeout),
                            (this.hideBarTimeout = !1),
                            o(document.body).removeClass('lg-on lg-from-hash'),
                            this.outer.removeClass(
                                'lg-visible lg-components-open',
                            ),
                            this.$backdrop.removeClass('in').css('opacity', 0);
                        var u =
                            this.zoomFromOrigin && s
                                ? Math.max(
                                      this.settings.startAnimationDuration,
                                      this.settings.backdropDuration,
                                  )
                                : this.settings.backdropDuration;
                        return (
                            this.$container.removeClass('lg-show-in'),
                            setTimeout(function () {
                                i.zoomFromOrigin &&
                                    s &&
                                    i.outer.removeClass('lg-zoom-from-image'),
                                    i.$container.removeClass('lg-show'),
                                    i.$backdrop
                                        .removeAttr('style')
                                        .css(
                                            'transition-duration',
                                            i.settings.backdropDuration + 'ms',
                                        ),
                                    i.outer.removeClass(
                                        'lg-closing ' + i.settings.startClass,
                                    ),
                                    i
                                        .getSlideItem(i.index)
                                        .removeClass('lg-start-end-progress'),
                                    i.$inner.empty(),
                                    i.lgOpened &&
                                        i.LGel.trigger(E, { instance: i }),
                                    i.LGel.get().focus(),
                                    (i.lgOpened = !1);
                            }, u + 100),
                            u + 100
                        );
                    }),
                    (t.prototype.destroyModules = function (t) {
                        for (var i in (this.plugins.forEach(function (i) {
                            try {
                                t
                                    ? i.destroy()
                                    : i.closeGallery && i.closeGallery();
                            } catch (t) {
                                console.warn(
                                    'lightGallery:- make sure lightGallery module is properly destroyed',
                                );
                            }
                        }),
                        this.plugins))
                            if (this.plugins[i])
                                try {
                                    t
                                        ? this.plugins[i].destroy()
                                        : this.plugins[i].closeGallery &&
                                          this.plugins[i].closeGallery();
                                } catch (t) {
                                    console.warn(
                                        'lightGallery:- make sure lightGallery ' +
                                            i +
                                            ' module is properly destroyed',
                                    );
                                }
                    }),
                    (t.prototype.destroy = function () {
                        var t = this,
                            i = this.closeGallery(!0);
                        setTimeout(function () {
                            if ((t.destroyModules(!0), !t.settings.dynamic))
                                for (var i = 0; i < t.items.length; i++) {
                                    var s = o(t.items[i]);
                                    s.off(
                                        'click.lgcustom-item-' +
                                            s.attr('data-lg-id'),
                                    );
                                }
                            o(window).off('.lg.global' + t.lgId),
                                t.LGel.off('.lg'),
                                t.$container.remove();
                        }, i);
                    }),
                    t
                );
            })();
        function P(t, i) {
            if (t)
                try {
                    return new N(t, i);
                } catch (t) {
                    console.error('lightGallery has not initiated properly', t);
                }
        }
        var q = function (t, i, s, e) {
            for (
                var n,
                    o = arguments.length,
                    r =
                        o < 3
                            ? i
                            : null === e
                            ? (e = Object.getOwnPropertyDescriptor(i, s))
                            : e,
                    h = t.length - 1;
                h >= 0;
                h--
            )
                (n = t[h]) &&
                    (r = (o < 3 ? n(r) : o > 3 ? n(i, s, r) : n(i, s)) || r);
            return o > 3 && r && Object.defineProperty(i, s, r), r;
        };
        (t.LightGallery = class extends i.LitElement {
            constructor() {
                super(...arguments), (this.settings = {});
            }
            firstUpdated() {
                (this.container = this.renderRoot.querySelector('#container')),
                    console.log(this.container.children);
                const t = this.shadowRoot
                        .querySelector('slot')
                        .assignedNodes({ flatten: !0 }),
                    i = {
                        selector: Array.prototype.filter.call(
                            t,
                            (t) => t.nodeType == Node.ELEMENT_NODE,
                        ),
                    };
                P(this, { ...this.settings, ...i }), console.log(this);
            }
            render() {
                return i.html`
            <div id="container">
                <slot></slot>
            </div>
        `;
            }
        }),
            q(
                [
                    (function (t) {
                        return (i, e) =>
                            void 0 !== e
                                ? ((t, i, s) => {
                                      i.constructor.createProperty(s, t);
                                  })(t, i, e)
                                : s(t, i);
                    })({
                        type: Object,
                        converter: (t, i) => {
                            console.log(t), console.log(i);
                            const s = JSON.parse(t);
                            return console.log('convertedVal', s), s;
                        },
                    }),
                ],
                t.LightGallery.prototype,
                'settings',
                void 0,
            ),
            (t.LightGallery = q(
                [
                    ((t) => (i) =>
                        'function' == typeof i
                            ? ((t, i) => (
                                  window.customElements.define(t, i), i
                              ))(t, i)
                            : ((t, i) => {
                                  const { kind: s, elements: e } = i;
                                  return {
                                      kind: s,
                                      elements: e,
                                      finisher(i) {
                                          window.customElements.define(t, i);
                                      },
                                  };
                              })(t, i))('light-gallery'),
                ],
                t.LightGallery,
            )),
            Object.defineProperty(t, 'i', { value: !0 });
    }),
    'object' == typeof exports && 'undefined' != typeof module
        ? i(exports, require('lit'))
        : 'function' == typeof define && define.amd
        ? define(['exports', 'lit'], i)
        : i(
              ((t =
                  'undefined' != typeof globalThis
                      ? globalThis
                      : t || self).lightgallery = {}),
              t.lit,
          );
