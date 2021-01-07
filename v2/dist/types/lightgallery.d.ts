declare global {
    interface Window {
        lgModules: any;
        lightGallery: (el: HTMLElement, options: Partial<Defaults>) => LightGallery | undefined;
    }
}
import { DynamicItem, ImageSize } from './lg-utils';
import { LG, lgQuery } from './lgQuery';
declare global {
    interface Window {
        LG: typeof LG;
    }
}
import { Defaults } from './lg-defaults';
declare type SlideDirection = 'next' | 'prev';
export interface Coords {
    pageX: number;
    pageY: number;
}
export interface VideoInfo {
    html5?: boolean;
    youtube?: string[];
    vimeo?: string[];
    wistia?: string[];
    dailymotion?: string[];
}
export declare class LightGallery {
    s: Defaults;
    galleryItems: DynamicItem[];
    lgId: number;
    el: HTMLElement;
    LGel: lgQuery;
    lgOpened: boolean;
    index: number;
    modules: any;
    lGalleryOn: boolean;
    lgBusy: boolean;
    touchAction?: 'swipe' | 'zoomSwipe' | 'pinch';
    swipeDirection?: 'horizontal' | 'vertical';
    hideBarTimeout: any;
    currentItemsInDom: string[];
    outer: lgQuery;
    items: any;
    private prevScrollTop;
    private zoomFromImage;
    $items: any;
    constructor(element: HTMLElement, options: Partial<Defaults>);
    init(): void;
    buildModules(): number;
    getSlideItem(index: number): lgQuery;
    getSlideItemId(index: number): string;
    getById(id: string): string;
    buildStructure(): number;
    appendSlides(items: DynamicItem): void;
    getItems(): DynamicItem[];
    /**
     * Build Gallery
     * @param {Number} index  - index of the slide
     * @param {String} transform - Css transform value when zoomFromImage is enabled
     */
    openGallery(index: number, transform?: string): void;
    buildFromHash(): boolean | undefined;
    hideBars(): void;
    doCss(): boolean;
    /**
     *  @desc Create image counter
     *  Ex: 1/10
     */
    counter(): void;
    /**
     *  @desc add sub-html into the slide
     *  @param {Number} index - index of the slide
     */
    addHtml(index: number): void;
    /**
     *  @desc Preload slides
     *  @param {Number} index - index of the slide
     * @todo preload not working for the first slide, Also, should work for the first and last slide as well
     */
    preload(index: number): void;
    getDummyImgStyles(imageSize?: ImageSize): string;
    setImgMarkup(src: string, $currentSlide: lgQuery, index: number): void;
    onLgObjectLoad($el: lgQuery, index: number, delay: number, speed: number, dummyImageLoaded: boolean): void;
    handleLgObjectLoad($el: lgQuery, index: number, delay: number, speed: number, dummyImageLoaded: boolean): void;
    /**
     * @desc Check the given src is video
     * @param {String} src
     * @return {Object} video type
     * Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
     *
     * @todo - this information can be moved to dynamicEl to avoid frequent calls
     */
    isVideo(src: string, index: number): VideoInfo | undefined;
    addSlideVideoInfo(items: DynamicItem[]): void;
    /**
     *  @desc Load slide content into slide.
     *  @param {Number} index - index of the slide.
     *  @param {Boolean} rec - if true call loadcontent() function again.
     *  @param {Boolean} firstSlide - For setting the delay.
     */
    loadContent(index: number, rec: boolean, firstSlide: boolean): void;
    loadContentOnLoad(index: number, $currentSlide: lgQuery, speed: number): void;
    getItemsToBeInsertedToDom(index: number, prevIndex: number, numberOfItems?: number): string[];
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
    slide(index: number, fromTouch: boolean, fromThumb: boolean, direction?: SlideDirection | false): void;
    touchMove(startCoords: Coords, endCoords: Coords): void;
    touchEnd(endCoords: Coords, startCoords: Coords): void;
    enableSwipe(): void;
    enableDrag(): void;
    manageSwipeClass(): void;
    /**
     *  @desc Go to next slide
     *  @param {Boolean} fromTouch - true if slide function called via touch event
     */
    goToNextSlide(fromTouch?: boolean): void;
    /**
     *  @desc Go to previous slide
     *  @param {Boolean} fromTouch - true if slide function called via touch event
     */
    goToPrevSlide(fromTouch?: boolean): void;
    keyPress(): void;
    arrow(): void;
    arrowDisable(index: number): void;
    /**
     * Get index of the slide from custom slideName. Has to be a public method. Used in hash plugin
     * @param {String} hash
     * @returns {Number} Index of the slide.
     */
    getIndexFromUrl(hash?: string): number;
    setTranslate($el: lgQuery, xValue: number, yValue: number, scaleX?: number, scaleY?: number): void;
    mousewheel(): void;
    closeGallery(): void;
    destroy(clear?: boolean): void;
}
export {};
