interface Offset {
    left: number;
    top: number;
}

(function () {
    if (typeof window.CustomEvent === 'function') return false;

    function CustomEvent(event: string, params: any) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(
            event,
            params.bubbles,
            params.cancelable,
            params.detail,
        );
        return evt;
    }

    window.CustomEvent = CustomEvent as any;
})();
export class lgQuery {
    static eventListeners: { [key: string]: any[] } = {};
    private selector: any;
    private cssVenderPrefixes: string[] = [
        'TransitionDuration',
        'TransitionTimingFunction',
        'Transform',
        'Transition',
    ];
    constructor(selector: string | Element) {
        this.selector = this._getSelector(selector);
        return this;
    }

    _getSelector(
        selector: string | Element,
        context: Element | Document = document,
    ): Element | null | NodeListOf<Element> {
        if (typeof selector !== 'string') {
            return selector;
        }
        context = context || document;
        const fl = selector.substring(0, 1);
        if (fl === '#') {
            return context.querySelector(selector);
        } else {
            return context.querySelectorAll(selector);
        }
    }

    _each(
        func: (
            elements: Element | NodeListOf<Element> | null,
            index: number,
        ) => void,
    ): this {
        if (!this.selector) {
            return this;
        }
        if (this.selector.length !== undefined) {
            [].forEach.call(this.selector, func);
        } else {
            func(this.selector, 0);
        }
        return this;
    }

    _setCssVendorPrefix(
        el: any,
        cssProperty: string,
        value?: string | number,
    ): void {
        const property = cssProperty.replace(/-([a-z])/gi, function (
            s,
            group1,
        ) {
            return group1.toUpperCase();
        });
        if (this.cssVenderPrefixes.indexOf(property) !== -1) {
            el.style[
                property.charAt(0).toLowerCase() + property.slice(1)
            ] = value;
            el.style['webkit' + property] = value;
            el.style['moz' + property] = value;
            el.style['ms' + property] = value;
            el.style['o' + property] = value;
        } else {
            el.style[property] = value;
        }
    }

    attr(attr: string): string;
    attr(attr: string, value: string): this;
    attr(attr: string, value?: string): string | this {
        if (value === undefined) {
            if (!this.selector) {
                return '';
            }
            return this.selector.getAttribute(attr);
        }
        this._each((el: any) => {
            el.setAttribute(attr, value);
        });
        return this;
    }

    find(selector: any): lgQuery {
        return LG(this._getSelector(selector, this.selector));
    }

    first(): lgQuery {
        if (this.selector.length !== undefined) {
            return LG(this.selector[0]);
        } else {
            return LG(this.selector);
        }
    }

    eq(index: number): lgQuery {
        return LG(this.selector[index]);
    }

    get() {
        return this.selector;
    }

    removeAttr(attr: string): this {
        this._each((el: any) => {
            el.removeAttribute(attr);
        });
        return this;
    }

    wrap(className: string): this {
        if (!this.selector) {
            return this;
        }
        const wrapper = document.createElement('div');
        wrapper.className = className;
        this.selector.parentNode.insertBefore(wrapper, this.selector);
        this.selector.parentNode.removeChild(this.selector);
        wrapper.appendChild(this.selector);
        return this;
    }

    addClass(classNames = ''): this {
        this._each((el: any) => {
            // IE doesn't support multiple arguments
            classNames.split(' ').forEach((className) => {
                el.classList.add(className);
            });
        });
        return this;
    }

    removeClass(classNames: string): this {
        this._each((el: any) => {
            // IE doesn't support multiple arguments
            classNames.split(' ').forEach((className) => {
                el.classList.remove(className);
            });
        });
        return this;
    }

    hasClass(className: string): boolean {
        if (!this.selector) {
            return false;
        }
        return this.selector.classList.contains(className);
    }

    css(property: string, value?: string | number): this {
        this._each((el: any) => {
            this._setCssVendorPrefix(el, property, value);
        });
        return this;
    }
    // Need to pass separate namespaces for separate elements
    on(events: string, listener: (e: any) => void): this {
        if (!this.selector) {
            return this;
        }
        events.split(' ').forEach((event: string) => {
            if (!Array.isArray(lgQuery.eventListeners[event])) {
                lgQuery.eventListeners[event] = [];
            }
            lgQuery.eventListeners[event].push(listener);
            this.selector.addEventListener(event.split('.')[0], listener);
        });

        return this;
    }
    off(event: string): this {
        if (!this.selector || !Array.isArray(lgQuery.eventListeners[event])) {
            return this;
        }
        lgQuery.eventListeners[event].forEach((listener) => {
            this.selector.removeEventListener(event.split('.')[0], listener);
        });
        lgQuery.eventListeners[event] = [];
        return this;
    }
    trigger(event: string, detail?: any): this {
        if (!this.selector) {
            return this;
        }

        const customEvent = new CustomEvent(event.split('.')[0], {
            detail: detail || null,
        });
        this.selector.dispatchEvent(customEvent);
        return this;
    }

    // Does not support IE
    load(url: string): this {
        fetch(url).then((res) => {
            this.selector.innerHTML = res;
        });
        return this;
    }

    html(): string;
    html(html: string): this;
    html(html?: string): string | this {
        if (html === undefined) {
            if (!this.selector) {
                return '';
            }
            return this.selector.innerHTML;
        }
        this._each((el: any) => {
            el.innerHTML = html;
        });
        return this;
    }
    append(html: string): this {
        this._each((el: any) => {
            el.insertAdjacentHTML('beforeend', html);
        });
        return this;
    }
    prepend(html: string): this {
        this._each((el: any) => {
            el.insertAdjacentHTML('afterbegin', html);
        });
        return this;
    }
    remove(): this {
        this._each((el: any) => {
            el.parentNode.removeChild(el);
        });
        return this;
    }
    empty(): this {
        this._each((el: any) => {
            el.innerHTML = '';
        });
        return this;
    }
    // Supports only window
    scrollTop(): number;
    scrollTop(scrollTop: number): this;
    scrollTop(scrollTop?: number): number | this {
        if (scrollTop !== undefined) {
            document.body.scrollTop = scrollTop;
            document.documentElement.scrollTop = scrollTop;
            return this;
        } else {
            return (
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0
            );
        }
    }
    // Supports only window
    scrollLeft(): number;
    scrollLeft(scrollLeft?: number): this;
    scrollLeft(scrollLeft?: number): number | this {
        if (scrollLeft !== undefined) {
            document.body.scrollLeft = scrollLeft;
            document.documentElement.scrollLeft = scrollLeft;
            return this;
        } else {
            return (
                window.pageXOffset ||
                document.documentElement.scrollLeft ||
                document.body.scrollLeft ||
                0
            );
        }
    }
    offset(): Offset {
        if (!this.selector) {
            return {
                left: 0,
                top: 0,
            };
        }
        const rect = this.selector.getBoundingClientRect();
        return {
            left: rect.left + this.scrollLeft(),
            top: rect.top + this.scrollTop(),
        };
    }
    style(): CSSStyleDeclaration {
        if (!this.selector) {
            return {} as CSSStyleDeclaration;
        }
        return (
            this.selector.currentStyle || window.getComputedStyle(this.selector)
        );
    }
    // Width without padding and border even if box-sizing is used.
    width(): number {
        const style = this.style();
        return (
            this.selector.clientWidth -
            parseFloat(style.paddingLeft) -
            parseFloat(style.paddingRight)
        );
    }
    // Height without padding and border even if box-sizing is used.
    height(): number {
        const style = this.style();
        return (
            this.selector.clientHeight -
            parseFloat(style.paddingTop) -
            parseFloat(style.paddingBottom)
        );
    }
}

export function LG(selector: any): lgQuery {
    return new lgQuery(selector);
}
