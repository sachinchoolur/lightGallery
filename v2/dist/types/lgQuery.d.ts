interface Offset {
    left: number;
    top: number;
}
export declare class lgQuery {
    static eventListeners: {
        [key: string]: any[];
    };
    private selector;
    private firstElement;
    private cssVenderPrefixes;
    constructor(selector: string | Element);
    private _getSelector;
    private _each;
    private _setCssVendorPrefix;
    private _getFirstEl;
    private isEventMatched;
    attr(attr: string): string;
    attr(attr: string, value: string | number | boolean): this;
    find(selector: any): lgQuery;
    first(): lgQuery;
    eq(index: number): lgQuery;
    parent(): lgQuery;
    get(): HTMLElement;
    removeAttr(attr: string): this;
    wrap(className: string): this;
    addClass(classNames?: string): this;
    removeClass(classNames: string): this;
    hasClass(className: string): boolean;
    hasAttribute(attribute: string): boolean;
    toggleClass(className: string): this;
    css(property: string, value?: string | number): this;
    on(events: string, listener: (e: any) => void): this;
    once(event: string, listener: (e: any) => void): this;
    off(event: string): this;
    trigger(event: string, detail?: any): this;
    load(url: string): this;
    html(): string;
    html(html: string): this;
    append(html: string | HTMLElement): this;
    prepend(html: string): this;
    remove(): this;
    empty(): this;
    scrollTop(): number;
    scrollTop(scrollTop: number): this;
    scrollLeft(): number;
    scrollLeft(scrollLeft?: number): this;
    offset(): Offset;
    style(): CSSStyleDeclaration;
    width(): number;
    height(): number;
}
export declare function LG(selector: any): lgQuery;
export {};
