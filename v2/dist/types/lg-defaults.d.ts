import { DynamicItem } from './lg-utils';
export interface Defaults {
    /**
     * @desc Type of transition between images. lightGallery comes with lots of transition effects such;
     * @default 'lg-slide';
     */
    mode: 'lg-slide' | 'lg-fade' | 'lg-zoom-in' | 'lg-zoom-in-big' | 'lg-zoom-out' | 'lg-zoom-out-big' | 'lg-zoom-out-in' | 'lg-zoom-in-out' | 'lg-soft-zoom' | 'lg-scale-up' | 'lg-slide-circular' | 'lg-slide-circular-vertical' | 'lg-slide-vertical' | 'lg-slide-vertical-growth' | 'lg-slide-skew-only' | 'lg-slide-skew-only-rev' | 'lg-slide-skew-only-y' | 'lg-slide-skew-only-y-rev' | 'lg-slide-skew' | 'lg-slide-skew-rev' | 'lg-slide-skew-cross' | 'lg-slide-skew-cross-rev' | 'lg-slide-skew-ver' | 'lg-slide-skew-ver-rev' | 'lg-slide-skew-ver-cross' | 'lg-slide-skew-ver-cross-rev' | 'lg-lollipop' | 'lg-lollipop-rev' | 'lg-rotate' | 'lg-rotate-rev' | 'lg-tube';
    easing: string;
    cssEasing: string;
    speed: number;
    height: string;
    width: string;
    addClass: string;
    startClass: string;
    backdropDuration: number;
    container: HTMLElement;
    startAnimationDuration: number;
    /**
     * @desc - Zoom from image effect - Supports only images
     * Will be false if dynamic option is enabled or galleryID found in the URL
     * Setting startClass will be empty if zoomFromImage is true to avoid css conflicts.
     *
     */
    zoomFromImage: boolean;
    hideBarsDelay: number;
    showBarsAfter: number;
    supportLegacyBrowser: boolean;
    hideSubHtml: boolean;
    useLeft: boolean;
    ariaLabelledby: string;
    ariaDescribedby: string;
    closable: boolean;
    closeOnTap: boolean;
    loop: boolean;
    escKey: boolean;
    keyPress: boolean;
    controls: boolean;
    slideEndAnimatoin: boolean;
    hideControlOnEnd: boolean;
    mousewheel: boolean;
    getCaptionFromTitleOrAlt: boolean;
    appendSubHtmlTo: string;
    subHtmlSelectorRelative: boolean;
    /**
     * @desc number of preload slides
     * will exicute only after the current slide is fully loaded.
     *
     * @ex you clicked on 4th image and if preload = 1 then 3rd slide and 5th
     * slide will be loaded in the background after the 4th slide is fully loaded..
     * if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
     *
     */
    preload: number;
    numberOfSlideItemsInDom: number;
    showAfterLoad: boolean;
    selector: string;
    selectWithin: string;
    nextHtml: string;
    prevHtml: string;
    index: false;
    iframeMaxWidth: string;
    download: boolean;
    counter: boolean;
    appendCounterTo: string;
    swipeThreshold: number;
    enableSwipe: boolean;
    enableDrag: boolean;
    dynamic: false;
    dynamicEl: DynamicItem[];
    extraProps: string[];
    galleryId: number;
    customSlideName: boolean;
    exThumbImage: string;
}
export declare const defaults: Defaults;
