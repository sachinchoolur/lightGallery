/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t, i, s, e;
const n = globalThis.trustedTypes,
    o = n ? n.createPolicy('lit-html', { createHTML: (t) => t }) : void 0,
    h = `lit$${(Math.random() + '').slice(9)}$`,
    r = '?' + h,
    l = `<${r}>`,
    a = document,
    c = (t = '') => a.createComment(t),
    u = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
    d = Array.isArray,
    g = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    v = /-->/g,
    f = />/g,
    m = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,
    p = /'/g,
    b = /"/g,
    w = /^(?:script|style|textarea)$/i,
    y = ((t) => (i, ...s) => ({ _$litType$: t, strings: i, values: s }))(1),
    x = Symbol.for('lit-noChange'),
    k = Symbol.for('lit-nothing'),
    T = new WeakMap(),
    S = a.createTreeWalker(a, 129, null, !1),
    z = (t, i) => {
        const s = t.length - 1,
            e = [];
        let n,
            r = 2 === i ? '<svg>' : '',
            a = g;
        for (let i = 0; i < s; i++) {
            const s = t[i];
            let o,
                c,
                u = -1,
                d = 0;
            for (
                ;
                d < s.length &&
                ((a.lastIndex = d), (c = a.exec(s)), null !== c);

            )
                (d = a.lastIndex),
                    a === g
                        ? '!--' === c[1]
                            ? (a = v)
                            : void 0 !== c[1]
                            ? (a = f)
                            : void 0 !== c[2]
                            ? (w.test(c[2]) && (n = RegExp('</' + c[2], 'g')),
                              (a = m))
                            : void 0 !== c[3] && (a = m)
                        : a === m
                        ? '>' === c[0]
                            ? ((a = null != n ? n : g), (u = -1))
                            : void 0 === c[1]
                            ? (u = -2)
                            : ((u = a.lastIndex - c[2].length),
                              (o = c[1]),
                              (a = void 0 === c[3] ? m : '"' === c[3] ? b : p))
                        : a === b || a === p
                        ? (a = m)
                        : a === v || a === f
                        ? (a = g)
                        : ((a = m), (n = void 0));
            const y = a === m && t[i + 1].startsWith('/>') ? ' ' : '';
            r +=
                a === g
                    ? s + l
                    : u >= 0
                    ? (e.push(o), s.slice(0, u) + '$lit$' + s.slice(u) + h + y)
                    : s + h + (-2 === u ? (e.push(void 0), i) : y);
        }
        const c = r + (t[s] || '<?>') + (2 === i ? '</svg>' : '');
        return [void 0 !== o ? o.createHTML(c) : c, e];
    };
class C {
    constructor({ strings: t, _$litType$: i }, s) {
        let e;
        this.parts = [];
        let o = 0,
            l = 0;
        const a = t.length - 1,
            u = this.parts,
            [d, g] = z(t, i);
        if (
            ((this.el = C.createElement(d, s)),
            (S.currentNode = this.el.content),
            2 === i)
        ) {
            const t = this.el.content,
                i = t.firstChild;
            i.remove(), t.append(...i.childNodes);
        }
        for (; null !== (e = S.nextNode()) && u.length < a; ) {
            if (1 === e.nodeType) {
                if (e.hasAttributes()) {
                    const t = [];
                    for (const i of e.getAttributeNames())
                        if (i.endsWith('$lit$') || i.startsWith(h)) {
                            const s = g[l++];
                            if ((t.push(i), void 0 !== s)) {
                                const t = e
                                        .getAttribute(s.toLowerCase() + '$lit$')
                                        .split(h),
                                    i = /([.?@])?(.*)/.exec(s);
                                u.push({
                                    type: 1,
                                    index: o,
                                    name: i[2],
                                    strings: t,
                                    ctor:
                                        '.' === i[1]
                                            ? I
                                            : '?' === i[1]
                                            ? $
                                            : '@' === i[1]
                                            ? E
                                            : O,
                                });
                            } else u.push({ type: 6, index: o });
                        }
                    for (const i of t) e.removeAttribute(i);
                }
                if (w.test(e.tagName)) {
                    const t = e.textContent.split(h),
                        i = t.length - 1;
                    if (i > 0) {
                        e.textContent = n ? n.emptyScript : '';
                        for (let s = 0; s < i; s++)
                            e.append(t[s], c()),
                                S.nextNode(),
                                u.push({ type: 2, index: ++o });
                        e.append(t[i], c());
                    }
                }
            } else if (8 === e.nodeType)
                if (e.data === r) u.push({ type: 2, index: o });
                else {
                    let t = -1;
                    for (; -1 !== (t = e.data.indexOf(h, t + 1)); )
                        u.push({ type: 7, index: o }), (t += h.length - 1);
                }
            o++;
        }
    }
    static createElement(t, i) {
        const s = a.createElement('template');
        return (s.innerHTML = t), s;
    }
}
function M(t, i, s = t, e) {
    var n, o, h, r;
    if (i === x) return i;
    let l =
        void 0 !== e
            ? null === (n = s.Σi) || void 0 === n
                ? void 0
                : n[e]
            : s.Σo;
    const a = u(i) ? void 0 : i._$litDirective$;
    return (
        (null == l ? void 0 : l.constructor) !== a &&
            (null === (o = null == l ? void 0 : l.O) ||
                void 0 === o ||
                o.call(l, !1),
            void 0 === a ? (l = void 0) : ((l = new a(t)), l.T(t, s, e)),
            void 0 !== e
                ? ((null !== (h = (r = s).Σi) && void 0 !== h
                      ? h
                      : (r.Σi = []))[e] = l)
                : (s.Σo = l)),
        void 0 !== l && (i = M(t, l.S(t, i.values), l, e)),
        i
    );
}
class j {
    constructor(t, i) {
        (this.l = []), (this.N = void 0), (this.D = t), (this.M = i);
    }
    u(t) {
        var i;
        const {
                el: { content: s },
                parts: e,
            } = this.D,
            n = (null !== (i = null == t ? void 0 : t.creationScope) &&
            void 0 !== i
                ? i
                : a
            ).importNode(s, !0);
        S.currentNode = n;
        let o = S.nextNode(),
            h = 0,
            r = 0,
            l = e[0];
        for (; void 0 !== l; ) {
            if (h === l.index) {
                let i;
                2 === l.type
                    ? (i = new A(o, o.nextSibling, this, t))
                    : 1 === l.type
                    ? (i = new l.ctor(o, l.name, l.strings, this, t))
                    : 6 === l.type && (i = new N(o, this, t)),
                    this.l.push(i),
                    (l = e[++r]);
            }
            h !== (null == l ? void 0 : l.index) && ((o = S.nextNode()), h++);
        }
        return n;
    }
    v(t) {
        let i = 0;
        for (const s of this.l)
            void 0 !== s &&
                (void 0 !== s.strings
                    ? (s.I(t, s, i), (i += s.strings.length - 2))
                    : s.I(t[i])),
                i++;
    }
}
class A {
    constructor(t, i, s, e) {
        (this.type = 2),
            (this.N = void 0),
            (this.A = t),
            (this.B = i),
            (this.M = s),
            (this.options = e);
    }
    setConnected(t) {
        var i;
        null === (i = this.P) || void 0 === i || i.call(this, t);
    }
    get parentNode() {
        return this.A.parentNode;
    }
    get startNode() {
        return this.A;
    }
    get endNode() {
        return this.B;
    }
    I(t, i = this) {
        (t = M(this, t, i)),
            u(t)
                ? t === k || null == t || '' === t
                    ? (this.H !== k && this.R(), (this.H = k))
                    : t !== this.H && t !== x && this.m(t)
                : void 0 !== t._$litType$
                ? this._(t)
                : void 0 !== t.nodeType
                ? this.$(t)
                : ((t) => {
                      var i;
                      return (
                          d(t) ||
                          'function' ==
                              typeof (null === (i = t) || void 0 === i
                                  ? void 0
                                  : i[Symbol.iterator])
                      );
                  })(t)
                ? this.g(t)
                : this.m(t);
    }
    k(t, i = this.B) {
        return this.A.parentNode.insertBefore(t, i);
    }
    $(t) {
        this.H !== t && (this.R(), (this.H = this.k(t)));
    }
    m(t) {
        const i = this.A.nextSibling;
        null !== i &&
        3 === i.nodeType &&
        (null === this.B
            ? null === i.nextSibling
            : i === this.B.previousSibling)
            ? (i.data = t)
            : this.$(a.createTextNode(t)),
            (this.H = t);
    }
    _(t) {
        var i;
        const { values: s, _$litType$: e } = t,
            n =
                'number' == typeof e
                    ? this.C(t)
                    : (void 0 === e.el &&
                          (e.el = C.createElement(e.h, this.options)),
                      e);
        if ((null === (i = this.H) || void 0 === i ? void 0 : i.D) === n)
            this.H.v(s);
        else {
            const t = new j(n, this),
                i = t.u(this.options);
            t.v(s), this.$(i), (this.H = t);
        }
    }
    C(t) {
        let i = T.get(t.strings);
        return void 0 === i && T.set(t.strings, (i = new C(t))), i;
    }
    g(t) {
        d(this.H) || ((this.H = []), this.R());
        const i = this.H;
        let s,
            e = 0;
        for (const n of t)
            e === i.length
                ? i.push(
                      (s = new A(this.k(c()), this.k(c()), this, this.options)),
                  )
                : (s = i[e]),
                s.I(n),
                e++;
        e < i.length && (this.R(s && s.B.nextSibling, e), (i.length = e));
    }
    R(t = this.A.nextSibling, i) {
        var s;
        for (
            null === (s = this.P) || void 0 === s || s.call(this, !1, !0, i);
            t && t !== this.B;

        ) {
            const i = t.nextSibling;
            t.remove(), (t = i);
        }
    }
}
class O {
    constructor(t, i, s, e, n) {
        (this.type = 1),
            (this.H = k),
            (this.N = void 0),
            (this.V = void 0),
            (this.element = t),
            (this.name = i),
            (this.M = e),
            (this.options = n),
            s.length > 2 || '' !== s[0] || '' !== s[1]
                ? ((this.H = Array(s.length - 1).fill(k)), (this.strings = s))
                : (this.H = k);
    }
    get tagName() {
        return this.element.tagName;
    }
    I(t, i = this, s, e) {
        const n = this.strings;
        let o = !1;
        if (void 0 === n)
            (t = M(this, t, i, 0)),
                (o = !u(t) || (t !== this.H && t !== x)),
                o && (this.H = t);
        else {
            const e = t;
            let h, r;
            for (t = n[0], h = 0; h < n.length - 1; h++)
                (r = M(this, e[s + h], i, h)),
                    r === x && (r = this.H[h]),
                    o || (o = !u(r) || r !== this.H[h]),
                    r === k
                        ? (t = k)
                        : t !== k && (t += (null != r ? r : '') + n[h + 1]),
                    (this.H[h] = r);
        }
        o && !e && this.W(t);
    }
    W(t) {
        t === k
            ? this.element.removeAttribute(this.name)
            : this.element.setAttribute(this.name, null != t ? t : '');
    }
}
class I extends O {
    constructor() {
        super(...arguments), (this.type = 3);
    }
    W(t) {
        this.element[this.name] = t === k ? void 0 : t;
    }
}
class $ extends O {
    constructor() {
        super(...arguments), (this.type = 4);
    }
    W(t) {
        t && t !== k
            ? this.element.setAttribute(this.name, '')
            : this.element.removeAttribute(this.name);
    }
}
class E extends O {
    constructor() {
        super(...arguments), (this.type = 5);
    }
    I(t, i = this) {
        var s;
        if ((t = null !== (s = M(this, t, i, 0)) && void 0 !== s ? s : k) === x)
            return;
        const e = this.H,
            n =
                (t === k && e !== k) ||
                t.capture !== e.capture ||
                t.once !== e.once ||
                t.passive !== e.passive,
            o = t !== k && (e === k || n);
        n && this.element.removeEventListener(this.name, this, e),
            o && this.element.addEventListener(this.name, this, t),
            (this.H = t);
    }
    handleEvent(t) {
        var i, s;
        'function' == typeof this.H
            ? this.H.call(
                  null !==
                      (s =
                          null === (i = this.options) || void 0 === i
                              ? void 0
                              : i.host) && void 0 !== s
                      ? s
                      : this.element,
                  t,
              )
            : this.H.handleEvent(t);
    }
}
class N {
    constructor(t, i, s) {
        (this.element = t),
            (this.type = 6),
            (this.N = void 0),
            (this.V = void 0),
            (this.M = i),
            (this.options = s);
    }
    I(t) {
        M(this, t);
    }
}
null === (i = (t = globalThis).litHtmlPlatformSupport) ||
    void 0 === i ||
    i.call(t, C, A),
    (null !== (s = (e = globalThis).litHtmlVersions) && void 0 !== s
        ? s
        : (e.litHtmlVersions = [])
    ).push('2.0.0-rc.2');
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _ =
        window.ShadowRoot &&
        (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) &&
        'adoptedStyleSheets' in Document.prototype &&
        'replace' in CSSStyleSheet.prototype,
    P = Symbol();
class U {
    constructor(t, i) {
        if (i !== P)
            throw Error(
                'CSSResult is not constructable. Use `unsafeCSS` or `css` instead.',
            );
        this.cssText = t;
    }
    get styleSheet() {
        return (
            _ &&
                void 0 === this.t &&
                ((this.t = new CSSStyleSheet()),
                this.t.replaceSync(this.cssText)),
            this.t
        );
    }
    toString() {
        return this.cssText;
    }
}
const D = _
    ? (t) => t
    : (t) =>
          t instanceof CSSStyleSheet
              ? ((t) => {
                    let i = '';
                    for (const s of t.cssRules) i += s.cssText;
                    return ((t) => new U(t + '', P))(i);
                })(t)
              : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ var F, B, H, R;
const q = {
        toAttribute(t, i) {
            switch (i) {
                case Boolean:
                    t = t ? '' : null;
                    break;
                case Object:
                case Array:
                    t = null == t ? t : JSON.stringify(t);
            }
            return t;
        },
        fromAttribute(t, i) {
            let s = t;
            switch (i) {
                case Boolean:
                    s = null !== t;
                    break;
                case Number:
                    s = null === t ? null : Number(t);
                    break;
                case Object:
                case Array:
                    try {
                        s = JSON.parse(t);
                    } catch (t) {
                        s = null;
                    }
            }
            return s;
        },
    },
    G = (t, i) => i !== t && (i == i || t == t),
    L = {
        attribute: !0,
        type: String,
        converter: q,
        reflect: !1,
        hasChanged: G,
    };
class W extends HTMLElement {
    constructor() {
        super(),
            (this.Πi = new Map()),
            (this.Πo = void 0),
            (this.Πl = void 0),
            (this.isUpdatePending = !1),
            (this.hasUpdated = !1),
            (this.Πh = null),
            this.u();
    }
    static addInitializer(t) {
        var i;
        (null !== (i = this.v) && void 0 !== i) || (this.v = []),
            this.v.push(t);
    }
    static get observedAttributes() {
        this.finalize();
        const t = [];
        return (
            this.elementProperties.forEach((i, s) => {
                const e = this.Πp(s, i);
                void 0 !== e && (this.Πm.set(e, s), t.push(e));
            }),
            t
        );
    }
    static createProperty(t, i = L) {
        if (
            (i.state && (i.attribute = !1),
            this.finalize(),
            this.elementProperties.set(t, i),
            !i.noAccessor && !this.prototype.hasOwnProperty(t))
        ) {
            const s = 'symbol' == typeof t ? Symbol() : '__' + t,
                e = this.getPropertyDescriptor(t, s, i);
            void 0 !== e && Object.defineProperty(this.prototype, t, e);
        }
    }
    static getPropertyDescriptor(t, i, s) {
        return {
            get() {
                return this[i];
            },
            set(e) {
                const n = this[t];
                (this[i] = e), this.requestUpdate(t, n, s);
            },
            configurable: !0,
            enumerable: !0,
        };
    }
    static getPropertyOptions(t) {
        return this.elementProperties.get(t) || L;
    }
    static finalize() {
        if (this.hasOwnProperty('finalized')) return !1;
        this.finalized = !0;
        const t = Object.getPrototypeOf(this);
        if (
            (t.finalize(),
            (this.elementProperties = new Map(t.elementProperties)),
            (this.Πm = new Map()),
            this.hasOwnProperty('properties'))
        ) {
            const t = this.properties,
                i = [
                    ...Object.getOwnPropertyNames(t),
                    ...Object.getOwnPropertySymbols(t),
                ];
            for (const s of i) this.createProperty(s, t[s]);
        }
        return (this.elementStyles = this.finalizeStyles(this.styles)), !0;
    }
    static finalizeStyles(t) {
        const i = [];
        if (Array.isArray(t)) {
            const s = new Set(t.flat(1 / 0).reverse());
            for (const t of s) i.unshift(D(t));
        } else void 0 !== t && i.push(D(t));
        return i;
    }
    static Πp(t, i) {
        const s = i.attribute;
        return !1 === s
            ? void 0
            : 'string' == typeof s
            ? s
            : 'string' == typeof t
            ? t.toLowerCase()
            : void 0;
    }
    u() {
        var t;
        (this.Πg = new Promise((t) => (this.enableUpdating = t))),
            (this.L = new Map()),
            this.Π_(),
            this.requestUpdate(),
            null === (t = this.constructor.v) ||
                void 0 === t ||
                t.forEach((t) => t(this));
    }
    addController(t) {
        var i, s;
        (null !== (i = this.ΠU) && void 0 !== i ? i : (this.ΠU = [])).push(t),
            void 0 !== this.renderRoot &&
                this.isConnected &&
                (null === (s = t.hostConnected) || void 0 === s || s.call(t));
    }
    removeController(t) {
        var i;
        null === (i = this.ΠU) ||
            void 0 === i ||
            i.splice(this.ΠU.indexOf(t) >>> 0, 1);
    }
    Π_() {
        this.constructor.elementProperties.forEach((t, i) => {
            this.hasOwnProperty(i) && (this.Πi.set(i, this[i]), delete this[i]);
        });
    }
    createRenderRoot() {
        var t;
        const i =
            null !== (t = this.shadowRoot) && void 0 !== t
                ? t
                : this.attachShadow(this.constructor.shadowRootOptions);
        return (
            ((t, i) => {
                _
                    ? (t.adoptedStyleSheets = i.map((t) =>
                          t instanceof CSSStyleSheet ? t : t.styleSheet,
                      ))
                    : i.forEach((i) => {
                          const s = document.createElement('style');
                          (s.textContent = i.cssText), t.appendChild(s);
                      });
            })(i, this.constructor.elementStyles),
            i
        );
    }
    connectedCallback() {
        var t;
        void 0 === this.renderRoot &&
            (this.renderRoot = this.createRenderRoot()),
            this.enableUpdating(!0),
            null === (t = this.ΠU) ||
                void 0 === t ||
                t.forEach((t) => {
                    var i;
                    return null === (i = t.hostConnected) || void 0 === i
                        ? void 0
                        : i.call(t);
                }),
            this.Πl && (this.Πl(), (this.Πo = this.Πl = void 0));
    }
    enableUpdating(t) {}
    disconnectedCallback() {
        var t;
        null === (t = this.ΠU) ||
            void 0 === t ||
            t.forEach((t) => {
                var i;
                return null === (i = t.hostDisconnected) || void 0 === i
                    ? void 0
                    : i.call(t);
            }),
            (this.Πo = new Promise((t) => (this.Πl = t)));
    }
    attributeChangedCallback(t, i, s) {
        this.K(t, s);
    }
    Πj(t, i, s = L) {
        var e, n;
        const o = this.constructor.Πp(t, s);
        if (void 0 !== o && !0 === s.reflect) {
            const h = (null !==
                (n =
                    null === (e = s.converter) || void 0 === e
                        ? void 0
                        : e.toAttribute) && void 0 !== n
                ? n
                : q.toAttribute)(i, s.type);
            (this.Πh = t),
                null == h ? this.removeAttribute(o) : this.setAttribute(o, h),
                (this.Πh = null);
        }
    }
    K(t, i) {
        var s, e, n;
        const o = this.constructor,
            h = o.Πm.get(t);
        if (void 0 !== h && this.Πh !== h) {
            const t = o.getPropertyOptions(h),
                r = t.converter,
                l =
                    null !==
                        (n =
                            null !==
                                (e =
                                    null === (s = r) || void 0 === s
                                        ? void 0
                                        : s.fromAttribute) && void 0 !== e
                                ? e
                                : 'function' == typeof r
                                ? r
                                : null) && void 0 !== n
                        ? n
                        : q.fromAttribute;
            (this.Πh = h), (this[h] = l(i, t.type)), (this.Πh = null);
        }
    }
    requestUpdate(t, i, s) {
        let e = !0;
        void 0 !== t &&
            ((
                (s = s || this.constructor.getPropertyOptions(t)).hasChanged ||
                G
            )(this[t], i)
                ? (this.L.has(t) || this.L.set(t, i),
                  !0 === s.reflect &&
                      this.Πh !== t &&
                      (void 0 === this.Πk && (this.Πk = new Map()),
                      this.Πk.set(t, s)))
                : (e = !1)),
            !this.isUpdatePending && e && (this.Πg = this.Πq());
    }
    async Πq() {
        this.isUpdatePending = !0;
        try {
            for (await this.Πg; this.Πo; ) await this.Πo;
        } catch (t) {
            Promise.reject(t);
        }
        const t = this.performUpdate();
        return null != t && (await t), !this.isUpdatePending;
    }
    performUpdate() {
        var t;
        if (!this.isUpdatePending) return;
        this.hasUpdated,
            this.Πi &&
                (this.Πi.forEach((t, i) => (this[i] = t)), (this.Πi = void 0));
        let i = !1;
        const s = this.L;
        try {
            (i = this.shouldUpdate(s)),
                i
                    ? (this.willUpdate(s),
                      null === (t = this.ΠU) ||
                          void 0 === t ||
                          t.forEach((t) => {
                              var i;
                              return null === (i = t.hostUpdate) || void 0 === i
                                  ? void 0
                                  : i.call(t);
                          }),
                      this.update(s))
                    : this.Π$();
        } catch (t) {
            throw ((i = !1), this.Π$(), t);
        }
        i && this.E(s);
    }
    willUpdate(t) {}
    E(t) {
        var i;
        null === (i = this.ΠU) ||
            void 0 === i ||
            i.forEach((t) => {
                var i;
                return null === (i = t.hostUpdated) || void 0 === i
                    ? void 0
                    : i.call(t);
            }),
            this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)),
            this.updated(t);
    }
    Π$() {
        (this.L = new Map()), (this.isUpdatePending = !1);
    }
    get updateComplete() {
        return this.getUpdateComplete();
    }
    getUpdateComplete() {
        return this.Πg;
    }
    shouldUpdate(t) {
        return !0;
    }
    update(t) {
        void 0 !== this.Πk &&
            (this.Πk.forEach((t, i) => this.Πj(i, this[i], t)),
            (this.Πk = void 0)),
            this.Π$();
    }
    updated(t) {}
    firstUpdated(t) {}
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var J, Y, V, X, K, Z;
(W.finalized = !0),
    (W.shadowRootOptions = { mode: 'open' }),
    null === (B = (F = globalThis).reactiveElementPlatformSupport) ||
        void 0 === B ||
        B.call(F, { ReactiveElement: W }),
    (null !== (H = (R = globalThis).reactiveElementVersions) && void 0 !== H
        ? H
        : (R.reactiveElementVersions = [])
    ).push('1.0.0-rc.1'),
    (null !== (J = (Z = globalThis).litElementVersions) && void 0 !== J
        ? J
        : (Z.litElementVersions = [])
    ).push('3.0.0-rc.1');
class Q extends W {
    constructor() {
        super(...arguments),
            (this.renderOptions = { host: this }),
            (this.Φt = void 0);
    }
    createRenderRoot() {
        var t, i;
        const s = super.createRenderRoot();
        return (
            (null !== (t = (i = this.renderOptions).renderBefore) &&
                void 0 !== t) ||
                (i.renderBefore = s.firstChild),
            s
        );
    }
    update(t) {
        const i = this.render();
        super.update(t),
            (this.Φt = ((t, i, s) => {
                var e, n;
                const o =
                    null !== (e = null == s ? void 0 : s.renderBefore) &&
                    void 0 !== e
                        ? e
                        : i;
                let h = o._$litPart$;
                if (void 0 === h) {
                    const t =
                        null !== (n = null == s ? void 0 : s.renderBefore) &&
                        void 0 !== n
                            ? n
                            : null;
                    o._$litPart$ = h = new A(
                        i.insertBefore(c(), t),
                        t,
                        void 0,
                        s,
                    );
                }
                return h.I(t), h;
            })(i, this.renderRoot, this.renderOptions));
    }
    connectedCallback() {
        var t;
        super.connectedCallback(),
            null === (t = this.Φt) || void 0 === t || t.setConnected(!0);
    }
    disconnectedCallback() {
        var t;
        super.disconnectedCallback(),
            null === (t = this.Φt) || void 0 === t || t.setConnected(!1);
    }
    render() {
        return x;
    }
}
(Q.finalized = !0),
    (Q._$litElement$ = !0),
    null === (V = (Y = globalThis).litElementHydrateSupport) ||
        void 0 === V ||
        V.call(Y, { LitElement: Q }),
    null === (K = (X = globalThis).litElementPlatformSupport) ||
        void 0 === K ||
        K.call(X, { LitElement: Q });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const tt = (t, i) =>
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
var it = function () {
    return (it =
        Object.assign ||
        function (t) {
            for (var i, s = 1, e = arguments.length; s < e; s++)
                for (var n in (i = arguments[s]))
                    Object.prototype.hasOwnProperty.call(i, n) && (t[n] = i[n]);
            return t;
        }).apply(this, arguments);
};
!(function () {
    if ('function' == typeof window.CustomEvent) return !1;
    window.CustomEvent = function (t, i) {
        i = i || { bubbles: !1, cancelable: !1, detail: null };
        var s = document.createEvent('CustomEvent');
        return s.initCustomEvent(t, i.bubbles, i.cancelable, i.detail), s;
    };
})(),
    Element.prototype.matches ||
        (Element.prototype.matches =
            Element.prototype.msMatchesSelector ||
            Element.prototype.webkitMatchesSelector);
var st = (function () {
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
                ? ((t.style[e.charAt(0).toLowerCase() + e.slice(1)] = s),
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
            return et(this._getSelector(t, this.selector));
        }),
        (t.prototype.first = function () {
            return this.selector && void 0 !== this.selector.length
                ? et(this.selector[0])
                : et(this.selector);
        }),
        (t.prototype.eq = function (t) {
            return et(this.selector[t]);
        }),
        (t.prototype.parent = function () {
            return et(this.selector.parentElement);
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
                this.firstElement.parentNode.insertBefore(i, this.firstElement),
                this.firstElement.parentNode.removeChild(this.firstElement),
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
                !!this.firstElement && this.firstElement.classList.contains(t)
            );
        }),
        (t.prototype.hasAttribute = function (t) {
            return !!this.firstElement && this.firstElement.hasAttribute(t);
        }),
        (t.prototype.toggleClass = function (t) {
            return this.firstElement
                ? (this.hasClass(t) ? this.removeClass(t) : this.addClass(t),
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
                          e.selector.addEventListener(i.split('.')[0], s);
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
            var s = new CustomEvent(t.split('.')[0], { detail: i || null });
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
                i = et('body').style().marginLeft;
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
function et(t) {
    return new st(t);
}
var nt = [
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
function ot(t) {
    return 'href' === t
        ? 'src'
        : (t = (t =
              (t = t.replace('data-', '')).charAt(0).toLowerCase() +
              t.slice(1)).replace(/-([a-z])/g, function (t) {
              return t[1].toUpperCase();
          }));
}
var ht = function (t, i, s, e) {
        void 0 === s && (s = 0);
        var n = et(t).attr('data-lg-size') || e;
        if (n) {
            var o = n.split(',');
            if (o[1])
                for (var h = window.innerWidth, r = 0; r < o.length; r++) {
                    var l = o[r];
                    if (parseInt(l.split('-')[2], 10) > h) {
                        n = l;
                        break;
                    }
                    r === o.length - 1 && (n = l);
                }
            var a = n.split('-'),
                c = parseInt(a[0], 10),
                u = parseInt(a[1], 10),
                d = i.width(),
                g = i.height() - s,
                v = Math.min(d, c),
                f = Math.min(g, u),
                m = Math.min(v / c, f / u);
            return { width: c * m, height: u * m };
        }
    },
    rt = function (t, i, s, e, n) {
        if (n) {
            var o = et(t).find('img').first(),
                h = i.get().getBoundingClientRect(),
                r = h.width,
                l = i.height() - (s + e),
                a = o.width(),
                c = o.height(),
                u = o.style(),
                d =
                    (r - a) / 2 -
                    o.offset().left +
                    (parseFloat(u.paddingLeft) || 0) +
                    (parseFloat(u.borderLeft) || 0) +
                    et(window).scrollLeft() +
                    h.left,
                g =
                    (l - c) / 2 -
                    o.offset().top +
                    (parseFloat(u.paddingTop) || 0) +
                    (parseFloat(u.borderTop) || 0) +
                    et(window).scrollTop() +
                    s;
            return (
                'translate3d(' +
                (d *= -1) +
                'px, ' +
                (g *= -1) +
                'px, 0) scale3d(' +
                a / n.width +
                ', ' +
                c / n.height +
                ', 1)'
            );
        }
    },
    lt = function (t, i, s, e) {
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
    at = function (t, i, s, e, n, o) {
        var h =
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
            r = '';
        o &&
            (r = ('string' == typeof o ? JSON.parse(o) : o).map(function (t) {
                var i = '';
                return (
                    Object.keys(t).forEach(function (s) {
                        i += ' ' + s + '="' + t[s] + '"';
                    }),
                    '<source ' + i + '></source>'
                );
            }));
        return '' + r + h;
    },
    ct = function (t) {
        for (var i = [], s = [], e = '', n = 0; n < t.length; n++) {
            var o = t[n].split(' ');
            '' === o[0] && o.splice(0, 1), s.push(o[0]), i.push(o[1]);
        }
        for (var h = window.innerWidth, r = 0; r < i.length; r++)
            if (parseInt(i[r], 10) > h) {
                e = s[r];
                break;
            }
        return e;
    },
    ut = function (t) {
        return !!t && !!t.complete && 0 !== t.naturalWidth;
    },
    dt = function (t, i, s, e) {
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
    gt = function (t, i, s, e) {
        var n = [],
            o = (function () {
                for (var t = 0, i = 0, s = arguments.length; i < s; i++)
                    t += arguments[i].length;
                var e = Array(t),
                    n = 0;
                for (i = 0; i < s; i++)
                    for (
                        var o = arguments[i], h = 0, r = o.length;
                        h < r;
                        h++, n++
                    )
                        e[n] = o[h];
                return e;
            })(nt, i);
        return (
            [].forEach.call(t, function (t) {
                for (var i = {}, h = 0; h < t.attributes.length; h++) {
                    var r = t.attributes[h];
                    if (r.specified) {
                        var l = ot(r.name),
                            a = '';
                        o.indexOf(l) > -1 && (a = l), a && (i[a] = r.value);
                    }
                }
                var c = et(t),
                    u = c.find('img').first().attr('alt'),
                    d = c.attr('title'),
                    g = e ? c.attr(e) : c.find('img').first().attr('src');
                (i.thumb = g),
                    s && !i.subHtml && (i.subHtml = d || u || ''),
                    (i.alt = u || d || ''),
                    n.push(i);
            }),
            n
        );
    },
    vt = function () {
        var t = !1;
        return (
            (function (i) {
                (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                    i,
                ) ||
                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                        i.substr(0, 4),
                    )) &&
                    (t = !0);
            })(navigator.userAgent || navigator.vendor || window.opera),
            t
        );
    },
    ft = {
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
        mobileSettings: { controls: !1, showCloseIcon: !1, download: !1 },
        plugins: [],
    },
    mt = 'lgAfterAppendSlide',
    pt = 'lgInit',
    bt = 'lgHasVideo',
    wt = 'lgContainerResize',
    yt = 'lgUpdateSlides',
    xt = 'lgAfterAppendSubHtml',
    kt = 'lgBeforeOpen',
    Tt = 'lgAfterOpen',
    St = 'lgSlideItemLoad',
    zt = 'lgBeforeSlide',
    Ct = 'lgAfterSlide',
    Mt = 'lgPosterClick',
    jt = 'lgDragStart',
    At = 'lgDragMove',
    Ot = 'lgDragEnd',
    It = 'lgBeforeNextSlide',
    $t = 'lgBeforePrevSlide',
    Et = 'lgBeforeClose',
    Nt = 'lgAfterClose',
    _t = 0,
    Pt = (function () {
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
                _t++,
                (this.lgId = _t),
                (this.el = t),
                (this.LGel = et(t)),
                (this.settings = it(it({}, ft), i)),
                this.settings.isMobile &&
                'function' == typeof this.settings.isMobile
                    ? this.settings.isMobile()
                    : vt())
            ) {
                var s = it(
                    it({}, this.settings.mobileSettings),
                    i.mobileSettings,
                );
                this.settings = it(it({}, this.settings), s);
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
                this.settings.closable || (this.settings.swipeToClose = !1),
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
                    this.LGel.trigger(pt, { instance: this }),
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
                                    n = et(e),
                                    o = st.generateUUID();
                                n.attr('data-lg-id', o).on(
                                    'click.lgcustom-item-' + o,
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
                                t.plugins.push(new s(t, et));
                            }, 10 * i);
                    }),
                    10 * i
                );
            }),
            (t.prototype.getSlideItem = function (t) {
                return et(this.getSlideItemId(t));
            }),
            (t.prototype.getSlideItemId = function (t) {
                return '#lg-item-' + this.lgId + '-' + t;
            }),
            (t.prototype.getIdName = function (t) {
                return t + '-' + this.lgId;
            }),
            (t.prototype.getElementById = function (t) {
                return et('#' + this.getIdName(t));
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
                this.settings.allowMediaOverlap && (e += 'lg-media-overlap ');
                var n = this.settings.ariaLabelledby
                        ? 'aria-labelledby="' +
                          this.settings.ariaLabelledby +
                          '"'
                        : '',
                    o = this.settings.ariaDescribedby
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
                    r =
                        this.settings.closable && this.settings.showCloseIcon
                            ? '<button type="button" aria-label="Close gallery" id="' +
                              this.getIdName('lg-close') +
                              '" class="lg-close lg-icon"></button>'
                            : '',
                    l = this.settings.showMaximizeIcon
                        ? '<button type="button" aria-label="Toggle maximize" id="' +
                          this.getIdName('lg-maximize') +
                          '" class="lg-maximize lg-icon"></button>'
                        : '',
                    a =
                        '\n        <div class="' +
                        h +
                        '" id="' +
                        this.getIdName('lg-container') +
                        '" tabindex="-1" aria-modal="true" ' +
                        n +
                        ' ' +
                        o +
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
                        l +
                        '\n                        ' +
                        r +
                        '\n                    </div>\n                    ' +
                        i +
                        '\n                    <div id="' +
                        this.getIdName('lg-components') +
                        '" class="lg-components">\n                        ' +
                        s +
                        '\n                    </div>\n                </div> \n            </div>\n        </div>\n        ';
                return (
                    et(this.settings.container)
                        .css('position', 'relative')
                        .append(a),
                    (this.outer = this.getElementById('lg-outer')),
                    (this.$lgContent = this.getElementById('lg-content')),
                    (this.$lgComponents = this.getElementById('lg-components')),
                    (this.$backdrop = this.getElementById('lg-backdrop')),
                    (this.$container = this.getElementById('lg-container')),
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
                    et(window).on(
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
                    var t = this.galleryItems[this.index].i,
                        i = this.getMediaContainerPosition(),
                        s = i.top,
                        e = i.bottom;
                    if (
                        ((this.currentImageSize = ht(
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
                        this.zoomFromOrigin && !this.isDummyImageRemoved)
                    ) {
                        var n = this.getDummyImgStyles(this.currentImageSize);
                        this.outer
                            .find('.lg-current .lg-dummy-img')
                            .first()
                            .attr('style', n);
                    }
                    this.LGel.trigger(wt);
                }
            }),
            (t.prototype.resizeVideoSlide = function (t, i) {
                var s = this.getVideoContStyle(i);
                this.getSlideItem(t).find('.lg-video-cont').attr('style', s);
            }),
            (t.prototype.updateSlides = function (t, i) {
                if (
                    (this.index > t.length - 1 && (this.index = t.length - 1),
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
                        this.LGel.trigger(yt);
                } else this.closeGallery();
            }),
            (t.prototype.getItems = function () {
                if (((this.items = []), this.settings.dynamic))
                    return this.settings.dynamicEl || [];
                if ('this' === this.settings.selector) this.items.push(this.el);
                else if (this.settings.selector)
                    if ('string' == typeof this.settings.selector)
                        if (this.settings.selectWithin) {
                            var t = et(this.settings.selectWithin);
                            this.items = t.find(this.settings.selector).get();
                        } else
                            this.items = this.el.querySelectorAll(
                                this.settings.selector,
                            );
                    else this.items = this.settings.selector;
                else this.items = this.el.children;
                return gt(
                    this.items,
                    this.settings.extraProps,
                    this.settings.getCaptionFromTitleOrAlt,
                    this.settings.exThumbImage,
                );
            }),
            (t.prototype.openGallery = function (t, i) {
                var s = this;
                if (
                    (void 0 === t && (t = this.settings.index), !this.lgOpened)
                ) {
                    (this.lgOpened = !0),
                        this.outer.get().focus(),
                        this.outer.removeClass('lg-hide-items'),
                        this.$container.addClass('lg-show');
                    var e = this.getItemsToBeInsertedToDom(t, t);
                    this.currentItemsInDom = e;
                    var n = '';
                    e.forEach(function (t) {
                        n = n + '<div id="' + t + '" class="lg-item"></div>';
                    }),
                        this.$inner.append(n),
                        this.addHtml(t);
                    var o = '';
                    this.mediaContainerPosition = this.getMediaContainerPosition();
                    var h = this.mediaContainerPosition,
                        r = h.top,
                        l = h.bottom;
                    this.settings.allowMediaOverlap ||
                        this.setMediaContainerPosition(r, l),
                        this.zoomFromOrigin &&
                            i &&
                            ((this.currentImageSize = ht(
                                i,
                                this.$lgContent,
                                r + l,
                                this.galleryItems[this.index].i &&
                                    this.settings.videoMaxSize,
                            )),
                            (o = rt(
                                i,
                                this.$lgContent,
                                r,
                                l,
                                this.currentImageSize,
                            ))),
                        (this.zoomFromOrigin && o) ||
                            (this.outer.addClass(this.settings.startClass),
                            this.getSlideItem(t).removeClass('lg-complete'));
                    var a = this.settings.zoomFromOrigin
                        ? 100
                        : this.settings.backdropDuration;
                    setTimeout(function () {
                        s.outer.addClass('lg-components-open');
                    }, a),
                        this.LGel.trigger(kt),
                        this.getSlideItem(t).addClass('lg-current'),
                        (this.lGalleryOn = !1),
                        (this.index = t),
                        (this.prevScrollTop = et(window).scrollTop()),
                        setTimeout(function () {
                            if (s.zoomFromOrigin && o) {
                                var i = s.getSlideItem(t);
                                i.css('transform', o),
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
                                (s.zoomFromOrigin && o) ||
                                    setTimeout(function () {
                                        s.outer.addClass('lg-visible');
                                    }, s.settings.backdropDuration),
                                s.slide(t, !1, !1, !1),
                                s.LGel.trigger(Tt);
                        }),
                        et(document.body).addClass('lg-on');
                }
            }),
            (t.prototype.getMediaContainerPosition = function () {
                if (this.settings.allowMediaOverlap)
                    return { top: 0, bottom: 0 };
                var t = this.$toolbar.get().clientHeight || 0,
                    i =
                        this.settings.defaultCaptionHeight ||
                        this.outer.find('.lg-sub-html').get().clientHeight,
                    s = this.outer.find('.lg-thumb-outer').get();
                return { top: t, bottom: (s ? s.clientHeight : 0) + i };
            }),
            (t.prototype.setMediaContainerPosition = function (t, i) {
                void 0 === t && (t = 0),
                    void 0 === i && (i = 0),
                    this.$inner.css('top', t + 'px').css('bottom', i + 'px');
            }),
            (t.prototype.buildFromHash = function () {
                var t = this,
                    i = window.location.hash;
                if (i.indexOf('lg=' + this.settings.galleryId) > 0) {
                    et(document.body).addClass('lg-from-hash'),
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
                                    t.outer.removeClass('lg-hide-items'),
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
                    this.outer.find(this.settings.appendCounterTo).append(t);
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
                                    ? et(this.items)
                                          .eq(t)
                                          .find(i)
                                          .first()
                                          .html()
                                    : et(i).first().html());
                    } else i = '';
                if ('.lg-sub-html' === this.settings.appendSubHtmlTo)
                    s
                        ? this.outer.find('.lg-sub-html').load(s)
                        : this.outer.find('.lg-sub-html').html(i);
                else {
                    var n = et(this.getSlideItemId(t));
                    s
                        ? n.load(s)
                        : n.append('<div class="lg-sub-html">' + i + '</div>');
                }
                null != i &&
                    ('' === i
                        ? this.outer
                              .find(this.settings.appendSubHtmlTo)
                              .addClass('lg-empty-html')
                        : this.outer
                              .find(this.settings.appendSubHtmlTo)
                              .removeClass('lg-empty-html')),
                    this.LGel.trigger(xt, { index: t });
            }),
            (t.prototype.preload = function (t) {
                for (
                    var i = 1;
                    i <= this.settings.preload &&
                    !(i >= this.galleryItems.length - t);
                    i++
                )
                    this.loadContent(t + i, !1);
                for (var s = 1; s <= this.settings.preload && !(t - s < 0); s++)
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
                if ((this.settings.dynamic || (e = et(this.items).eq(i)), e)) {
                    var n = void 0;
                    n = this.settings.exThumbImage
                        ? e.attr(this.settings.exThumbImage)
                        : e.find('img').first().attr('src');
                    var o =
                        '<img ' +
                        s +
                        ' style="' +
                        this.getDummyImgStyles(this.currentImageSize) +
                        '" class="lg-dummy-img" src="' +
                        n +
                        '" />';
                    return t.addClass('lg-first-slide'), o;
                }
                return '';
            }),
            (t.prototype.setImgMarkup = function (t, i, s) {
                var e = this.galleryItems[s],
                    n = e.alt,
                    o = e.srcset,
                    h = e.sizes,
                    r = e.sources,
                    l = n ? 'alt="' + n + '"' : '',
                    a =
                        '<picture class="lg-img-wrap"> ' +
                        (!this.lGalleryOn &&
                        this.zoomFromOrigin &&
                        this.currentImageSize
                            ? this.getDummyImageContent(i, s, l)
                            : at(s, t, l, o, h, r)) +
                        '</picture>';
                i.prepend(a);
            }),
            (t.prototype.onLgObjectLoad = function (t, i, s, e, n) {
                var o = this;
                n && this.LGel.trigger(St, { index: i, delay: s || 0 }),
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
                        n || o.LGel.trigger(St, { index: i, delay: s || 0 });
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
                    t.i = i.isVideo(t.src, s);
                });
            }),
            (t.prototype.loadContent = function (t, i) {
                var s = this,
                    e = this.galleryItems[t],
                    n = et(this.getSlideItemId(t)),
                    o = e.poster,
                    h = e.srcset,
                    r = e.sizes,
                    l = e.sources,
                    a = e.src,
                    c = e.video,
                    u = c && 'string' == typeof c ? JSON.parse(c) : c;
                if (e.responsive) {
                    var d = e.responsive.split(',');
                    a = ct(d) || a;
                }
                var g = e.i,
                    v = '',
                    f = !!e.iframe;
                if (!n.hasClass('lg-loaded')) {
                    if (g) {
                        var m = this.mediaContainerPosition,
                            p = m.top,
                            b = m.bottom,
                            w = ht(
                                this.items[t],
                                this.$lgContent,
                                p + b,
                                g && this.settings.videoMaxSize,
                            );
                        v = this.getVideoContStyle(w);
                    }
                    if (f) {
                        var y = lt(
                            a,
                            this.settings.iframeWidth,
                            this.settings.iframeHeight,
                            e.iframeTitle,
                        );
                        n.prepend(y);
                    } else if (o) {
                        var x = '',
                            k = !this.lGalleryOn,
                            T =
                                !this.lGalleryOn &&
                                this.zoomFromOrigin &&
                                this.currentImageSize;
                        T && (x = this.getDummyImageContent(n, t, ''));
                        y = dt(o, x || '', v, g);
                        n.prepend(y);
                        var S =
                            (T
                                ? this.settings.startAnimationDuration
                                : this.settings.backdropDuration) + 100;
                        setTimeout(function () {
                            s.LGel.trigger(bt, {
                                index: t,
                                src: a,
                                html5Video: u,
                                hasPoster: !0,
                                isFirstSlide: k,
                            });
                        }, S);
                    } else if (g) {
                        y =
                            '<div class="lg-video-cont " style="' +
                            v +
                            '"></div>';
                        n.prepend(y),
                            this.LGel.trigger(bt, {
                                index: t,
                                src: a,
                                html5Video: u,
                                hasPoster: !1,
                            });
                    } else if ((this.setImgMarkup(a, n, t), h || l)) {
                        var z = n.find('.lg-object');
                        this.initPictureFill(z);
                    }
                    this.LGel.trigger(mt, { index: t }),
                        this.lGalleryOn &&
                            '.lg-sub-html' !== this.settings.appendSubHtmlTo &&
                            this.addHtml(t);
                }
                var C = 0,
                    M = 0;
                this.lGalleryOn ||
                    (M =
                        this.zoomFromOrigin && this.currentImageSize
                            ? this.settings.startAnimationDuration + 10
                            : this.settings.backdropDuration + 10),
                    M && !et(document.body).hasClass('lg-from-hash') && (C = M),
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
                                        .append(at(t, a, '', h, r, e.sources)),
                                    h || l)
                                ) {
                                    var i = n.find('.lg-object');
                                    s.initPictureFill(i);
                                }
                                s.onLgObjectLoad(n, t, M, C, !0);
                                var o = n.find('.lg-object').first();
                                ut(o.get())
                                    ? s.loadContentOnLoad(t, n, C)
                                    : o.on('load.lg error.lg', function () {
                                          s.loadContentOnLoad(t, n, C);
                                      });
                            }, this.settings.startAnimationDuration + 100)),
                    n.addClass('lg-loaded'),
                    this.onLgObjectLoad(n, t, M, C, !1),
                    g &&
                        g.html5 &&
                        !o &&
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
            (t.prototype.getItemsToBeInsertedToDom = function (t, i, s) {
                var e = this;
                void 0 === s && (s = 0);
                var n = [],
                    o = Math.max(s, 3);
                o = Math.min(o, this.galleryItems.length);
                var h = 'lg-item-' + this.lgId + '-' + i;
                if (this.galleryItems.length <= 3)
                    return (
                        this.galleryItems.forEach(function (t, i) {
                            n.push('lg-item-' + e.lgId + '-' + i);
                        }),
                        n
                    );
                if (t < (this.galleryItems.length - 1) / 2) {
                    for (var r = t; r > t - o / 2 && r >= 0; r--)
                        n.push('lg-item-' + this.lgId + '-' + r);
                    var l = n.length;
                    for (r = 0; r < o - l; r++)
                        n.push('lg-item-' + this.lgId + '-' + (t + r + 1));
                } else {
                    for (
                        r = t;
                        r <= this.galleryItems.length - 1 && r < t + o / 2;
                        r++
                    )
                        n.push('lg-item-' + this.lgId + '-' + r);
                    for (l = n.length, r = 0; r < o - l; r++)
                        n.push('lg-item-' + this.lgId + '-' + (t - r - 1));
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
                    -1 === n.indexOf(h) &&
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
                                '<div id="' + t + '" class="lg-item"></div>',
                            );
                    }),
                    this.currentItemsInDom.forEach(function (t) {
                        -1 === e.indexOf(t) && et('#' + t).remove();
                    }),
                    e
                );
            }),
            (t.prototype.getPreviousSlideIndex = function () {
                var t = 0;
                try {
                    var i = this.outer.find('.lg-current').first().attr('id');
                    t = parseInt(i.split('-')[3]) || 0;
                } catch (i) {
                    t = 0;
                }
                return t;
            }),
            (t.prototype.setDownloadValue = function (t) {
                if (this.settings.download) {
                    var i = this.galleryItems[t],
                        s = !1 !== i.downloadUrl && (i.downloadUrl || i.src);
                    s &&
                        !i.iframe &&
                        this.getElementById('lg-download').attr('href', s);
                }
            }),
            (t.prototype.makeSlideAnimation = function (t, i, s) {
                var e = this;
                this.lGalleryOn && s.addClass('lg-slide-progress'),
                    setTimeout(function () {
                        e.outer.addClass('lg-no-trans'),
                            e.outer
                                .find('.lg-item')
                                .removeClass('lg-prev-slide lg-next-slide'),
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
                    ((this.currentItemsInDom = this.organizeSlideItems(t, o)),
                    !this.lGalleryOn || o !== t)
                ) {
                    var h = this.galleryItems.length;
                    if (!this.lgBusy) {
                        this.settings.counter && this.updateCurrentCounter(t);
                        var r = this.getSlideItem(t),
                            l = this.getSlideItem(o),
                            a = this.galleryItems[t],
                            c = a.i;
                        if (
                            (this.outer.attr(
                                'data-lg-slide-type',
                                this.getSlideType(a),
                            ),
                            this.setDownloadValue(t),
                            c)
                        ) {
                            var u = this.mediaContainerPosition,
                                d = u.top,
                                g = u.bottom,
                                v = ht(
                                    this.items[t],
                                    this.$lgContent,
                                    d + g,
                                    c && this.settings.videoMaxSize,
                                );
                            this.resizeVideoSlide(t, v);
                        }
                        if (
                            (this.LGel.trigger(zt, {
                                prevIndex: o,
                                index: t,
                                fromTouch: !!i,
                                fromThumb: !!s,
                            }),
                            (this.lgBusy = !0),
                            clearTimeout(this.hideBarTimeout),
                            this.arrowDisable(t),
                            e || (t < o ? (e = 'prev') : t > o && (e = 'next')),
                            i)
                        ) {
                            this.outer
                                .find('.lg-item')
                                .removeClass(
                                    'lg-prev-slide lg-current lg-next-slide',
                                );
                            var f = void 0,
                                m = void 0;
                            h > 2
                                ? ((f = t - 1),
                                  (m = t + 1),
                                  ((0 === t && o === h - 1) ||
                                      (t === h - 1 && 0 === o)) &&
                                      ((m = 0), (f = h - 1)))
                                : ((f = 0), (m = 1)),
                                'prev' === e
                                    ? this.getSlideItem(m).addClass(
                                          'lg-next-slide',
                                      )
                                    : this.getSlideItem(f).addClass(
                                          'lg-prev-slide',
                                      ),
                                r.addClass('lg-current');
                        } else this.makeSlideAnimation(e, r, l);
                        this.lGalleryOn || this.loadContent(t, !0),
                            setTimeout(function () {
                                n.lGalleryOn && n.loadContent(t, !0),
                                    '.lg-sub-html' ===
                                        n.settings.appendSubHtmlTo &&
                                        n.addHtml(t);
                            }, (this.lGalleryOn
                                ? this.settings.speed + 50
                                : 50) + (i ? 0 : this.settings.slideDelay)),
                            setTimeout(function () {
                                (n.lgBusy = !1),
                                    l.removeClass('lg-slide-progress'),
                                    n.LGel.trigger(Ct, {
                                        prevIndex: o,
                                        index: t,
                                        fromTouch: i,
                                        fromThumb: s,
                                    });
                            }, (this.lGalleryOn
                                ? this.settings.speed + 100
                                : 100) + (i ? 0 : this.settings.slideDelay));
                    }
                    this.index = t;
                }
            }),
            (t.prototype.updateCurrentCounter = function (t) {
                this.getElementById('lg-counter-current').html(t + 1 + '');
            }),
            (t.prototype.updateCounterTotal = function () {
                this.getElementById('lg-counter-all').html(
                    this.galleryItems.length + '',
                );
            }),
            (t.prototype.getSlideType = function (t) {
                return t.i ? 'video' : t.iframe ? 'iframe' : 'image';
            }),
            (t.prototype.touchMove = function (t, i) {
                var s = i.pageX - t.pageX,
                    e = i.pageY - t.pageY,
                    n = !1;
                if (
                    (this.swipeDirection
                        ? (n = !0)
                        : Math.abs(s) > 15
                        ? ((this.swipeDirection = 'horizontal'), (n = !0))
                        : Math.abs(e) > 15 &&
                          ((this.swipeDirection = 'vertical'), (n = !0)),
                    n)
                ) {
                    var o = this.getSlideItem(this.index);
                    if ('horizontal' === this.swipeDirection) {
                        this.outer.addClass('lg-dragging'),
                            this.setTranslate(o, s, 0);
                        var h = o.get().offsetWidth,
                            r = (15 * h) / 100 - Math.abs((10 * s) / 100);
                        this.setTranslate(
                            this.outer.find('.lg-prev-slide').first(),
                            -h + s - r,
                            0,
                        ),
                            this.setTranslate(
                                this.outer.find('.lg-next-slide').first(),
                                h + s + r,
                                0,
                            );
                    } else if (
                        'vertical' === this.swipeDirection &&
                        this.settings.swipeToClose
                    ) {
                        this.$container.addClass('lg-dragging-vertical');
                        var l = 1 - Math.abs(e) / window.innerHeight;
                        this.$backdrop.css('opacity', l);
                        var a = 1 - Math.abs(e) / (2 * window.innerWidth);
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
                        n.$container.removeClass('lg-dragging-vertical'),
                            n.outer
                                .removeClass('lg-dragging lg-hide-items')
                                .addClass('lg-components-open');
                        var o = !0;
                        if ('horizontal' === n.swipeDirection) {
                            e = t.pageX - i.pageX;
                            var h = Math.abs(t.pageX - i.pageX);
                            e < 0 && h > n.settings.swipeThreshold
                                ? (n.goToNextSlide(!0), (o = !1))
                                : e > 0 &&
                                  h > n.settings.swipeThreshold &&
                                  (n.goToPrevSlide(!0), (o = !1));
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
                            (n.outer.find('.lg-item').removeAttr('style'),
                            o && Math.abs(t.pageX - i.pageX) < 5)
                        ) {
                            var r = et(s.target);
                            n.isPosterElement(r) && n.LGel.trigger(Mt);
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
                        (!et(s.target).hasClass('lg-item') &&
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
                    this.$inner.on('touchend.lg', function (o) {
                        if ('swipe' === t.touchAction) {
                            if (e) (e = !1), t.touchEnd(s, i, o);
                            else if (n) {
                                var h = et(o.target);
                                t.isPosterElement(h) && t.LGel.trigger(Mt);
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
                        (et(s.target).hasClass('lg-item') ||
                            n.get().contains(s.target)) &&
                            (t.outer.hasClass('lg-zoomed') ||
                                t.lgBusy ||
                                (s.preventDefault(),
                                t.lgBusy ||
                                    (t.manageSwipeClass(),
                                    (i = { pageX: s.pageX, pageY: s.pageY }),
                                    (e = !0),
                                    (t.outer.get().scrollLeft += 1),
                                    (t.outer.get().scrollLeft -= 1),
                                    t.outer
                                        .removeClass('lg-grab')
                                        .addClass('lg-grabbing'),
                                    t.LGel.trigger(jt))));
                    }),
                    et(window).on('mousemove.lg.global' + this.lgId, function (
                        o,
                    ) {
                        e &&
                            t.lgOpened &&
                            ((n = !0),
                            (s = { pageX: o.pageX, pageY: o.pageY }),
                            t.touchMove(i, s),
                            t.LGel.trigger(At));
                    }),
                    et(window).on('mouseup.lg.global' + this.lgId, function (
                        o,
                    ) {
                        if (t.lgOpened) {
                            var h = et(o.target);
                            n
                                ? ((n = !1),
                                  t.touchEnd(s, i, o),
                                  t.LGel.trigger(Ot))
                                : t.isPosterElement(h) && t.LGel.trigger(Mt),
                                e &&
                                    ((e = !1),
                                    t.outer
                                        .removeClass('lg-grabbing')
                                        .addClass('lg-grab'));
                        }
                    }));
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
                    i > -1 && this.getSlideItem(i).addClass('lg-prev-slide'),
                    this.getSlideItem(t).addClass('lg-next-slide');
            }),
            (t.prototype.goToNextSlide = function (t) {
                var i = this,
                    s = this.settings.loop;
                t && this.galleryItems.length < 3 && (s = !1),
                    this.lgBusy ||
                        (this.index + 1 < this.galleryItems.length
                            ? (this.index++,
                              this.LGel.trigger(It, { index: this.index }),
                              this.slide(this.index, !!t, !1, 'next'))
                            : s
                            ? ((this.index = 0),
                              this.LGel.trigger(It, { index: this.index }),
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
                              this.LGel.trigger($t, {
                                  index: this.index,
                                  fromTouch: t,
                              }),
                              this.slide(this.index, !!t, !1, 'prev'))
                            : s
                            ? ((this.index = this.galleryItems.length - 1),
                              this.LGel.trigger($t, {
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
                et(window).on('keydown.lg.global' + this.lgId, function (i) {
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
                                (i.preventDefault(), t.goToNextSlide()));
                });
            }),
            (t.prototype.arrow = function () {
                var t = this;
                this.getElementById('lg-prev').on('click.lg', function () {
                    t.goToPrevSlide();
                }),
                    this.getElementById('lg-next').on('click.lg', function () {
                        t.goToNextSlide();
                    });
            }),
            (t.prototype.arrowDisable = function (t) {
                if (!this.settings.loop && this.settings.hideControlOnEnd) {
                    var i = this.getElementById('lg-prev'),
                        s = this.getElementById('lg-next');
                    t + 1 < this.galleryItems.length
                        ? i.removeAttr('disabled').removeClass('disabled')
                        : i.attr('disabled', 'disabled').addClass('disabled'),
                        t > 0
                            ? s.removeAttr('disabled').removeClass('disabled')
                            : s
                                  .attr('disabled', 'disabled')
                                  .addClass('disabled');
                }
            }),
            (t.prototype.getIndexFromUrl = function (t) {
                void 0 === t && (t = window.location.hash);
                var i = t.split('&slide=')[1],
                    s = 0;
                if (this.settings.customSlideName)
                    for (var e = 0; e < this.galleryItems.length; e++) {
                        if (this.galleryItems[e].slideName === i) {
                            s = e;
                            break;
                        }
                    }
                else s = parseInt(i, 10);
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
                        (i.deltaY > 0 ? t.goToPrevSlide() : t.goToNextSlide(),
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
                this.getElementById('lg-maximize').on('click.lg', function () {
                    t.$container.toggleClass('lg-inline'), t.refreshOnResize();
                });
            }),
            (t.prototype.manageCloseGallery = function () {
                var t = this;
                if (this.settings.closable) {
                    var i = !1;
                    this.getElementById('lg-close').on('click.lg', function () {
                        t.closeGallery();
                    }),
                        this.settings.closeOnTap &&
                            (this.outer.on('mousedown.lg', function (s) {
                                var e = et(s.target);
                                i = !!t.isSlideElement(e);
                            }),
                            this.outer.on('mousemove.lg', function () {
                                i = !1;
                            }),
                            this.outer.on('mouseup.lg', function (s) {
                                var e = et(s.target);
                                t.isSlideElement(e) &&
                                    i &&
                                    (t.outer.hasClass('lg-dragging') ||
                                        t.closeGallery());
                            }));
                }
            }),
            (t.prototype.closeGallery = function (t) {
                var i = this;
                if (!this.lgOpened || (!this.settings.closable && !t)) return 0;
                this.LGel.trigger(Et), et(window).scrollTop(this.prevScrollTop);
                var s,
                    e = this.items[this.index];
                if (this.zoomFromOrigin && e) {
                    var n = this.mediaContainerPosition,
                        o = n.top,
                        h = n.bottom,
                        r = ht(
                            e,
                            this.$lgContent,
                            o + h,
                            this.galleryItems[this.index].i &&
                                this.settings.videoMaxSize,
                        );
                    s = rt(e, this.$lgContent, o, h, r);
                }
                this.zoomFromOrigin && s
                    ? (this.outer.addClass('lg-closing lg-zoom-from-image'),
                      this.getSlideItem(this.index)
                          .addClass('lg-start-end-progress')
                          .css(
                              'transition-duration',
                              this.settings.startAnimationDuration + 'ms',
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
                    et(document.body).removeClass('lg-on lg-from-hash'),
                    this.outer.removeClass('lg-visible lg-components-open'),
                    this.$backdrop.removeClass('in').css('opacity', 0);
                var l =
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
                            i.lgOpened && i.LGel.trigger(Nt, { instance: i }),
                            i.LGel.get().focus(),
                            (i.lgOpened = !1);
                    }, l + 100),
                    l + 100
                );
            }),
            (t.prototype.destroyModules = function (t) {
                for (var i in (this.plugins.forEach(function (i) {
                    try {
                        t ? i.destroy() : i.closeGallery && i.closeGallery();
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
                            var s = et(t.items[i]);
                            s.off(
                                'click.lgcustom-item-' + s.attr('data-lg-id'),
                            );
                        }
                    et(window).off('.lg.global' + t.lgId),
                        t.LGel.off('.lg'),
                        t.$container.remove();
                }, i);
            }),
            t
        );
    })();
function Ut(t, i) {
    if (t)
        try {
            return new Pt(t, i);
        } catch (t) {
            console.error('lightGallery has not initiated properly', t);
        }
}
var Dt = function (t, i, s, e) {
    for (
        var n,
            o = arguments.length,
            h =
                o < 3
                    ? i
                    : null === e
                    ? (e = Object.getOwnPropertyDescriptor(i, s))
                    : e,
            r = t.length - 1;
        r >= 0;
        r--
    )
        (n = t[r]) && (h = (o < 3 ? n(h) : o > 3 ? n(i, s, h) : n(i, s)) || h);
    return o > 3 && h && Object.defineProperty(i, s, h), h;
};
let Ft = class extends Q {
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
        Ut(this, { ...this.settings, ...i }), console.log(this);
    }
    render() {
        return y`
            <div id="container">
                <slot></slot>
            </div>
        `;
    }
};
Dt(
    [
        (function (t) {
            return (i, s) =>
                void 0 !== s
                    ? ((t, i, s) => {
                          i.constructor.createProperty(s, t);
                      })(t, i, s)
                    : tt(t, i);
        })({
            type: Object,
            converter: (t, i) => {
                console.log(t), console.log(i);
                const s = JSON.parse(t);
                return console.log('convertedVal', s), s;
            },
        }),
    ],
    Ft.prototype,
    'settings',
    void 0,
),
    (Ft = Dt(
        [
            ((t) => (i) =>
                'function' == typeof i
                    ? ((t, i) => (window.customElements.define(t, i), i))(t, i)
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
        Ft,
    ));
export { Ft as LightGallery };
