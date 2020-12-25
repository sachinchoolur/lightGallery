import { DynamicItem } from './lg-utils';

export interface Defaults {
    /**
     * @desc Type of transition between images. lightGallery comes with lots of transition effects such;
     * @default 'lg-slide';
     */
    mode:
        | 'lg-slide'
        | 'lg-fade'
        | 'lg-zoom-in'
        | 'lg-zoom-in-big'
        | 'lg-zoom-out'
        | 'lg-zoom-out-big'
        | 'lg-zoom-out-in'
        | 'lg-zoom-in-out'
        | 'lg-soft-zoom'
        | 'lg-scale-up'
        | 'lg-slide-circular'
        | 'lg-slide-circular-vertical'
        | 'lg-slide-vertical'
        | 'lg-slide-vertical-growth'
        | 'lg-slide-skew-only'
        | 'lg-slide-skew-only-rev'
        | 'lg-slide-skew-only-y'
        | 'lg-slide-skew-only-y-rev'
        | 'lg-slide-skew'
        | 'lg-slide-skew-rev'
        | 'lg-slide-skew-cross'
        | 'lg-slide-skew-cross-rev'
        | 'lg-slide-skew-ver'
        | 'lg-slide-skew-ver-rev'
        | 'lg-slide-skew-ver-cross'
        | 'lg-slide-skew-ver-cross-rev'
        | 'lg-lollipop'
        | 'lg-lollipop-rev'
        | 'lg-rotate'
        | 'lg-rotate-rev'
        | 'lg-tube';
    easing: string;
    cssEasing: string;
    speed: number;
    height: string;
    width: string;
    addClass: string;
    startClass: string;
    backdropDuration: number;

    // Zoom from image animation duration
    startAnimationDuration: number;

    /**
     * @desc - Zoom from image effect - Supports only images
     * Will be false if dynamic option is enabled or galleryID found in the URL
     * Setting startClass will be empty if zoomFromImage is true to avoid css conflicts.
     *
     */
    zoomFromImage: boolean;

    // Set 0, if u don't want to hide the controls
    hideBarsDelay: number;
    showBarsAfter: number;

    supportLegacyBrowser: boolean;

    // If true sub-html will also be hidden along with controls and toolbar if hideBarDelay is more than 0
    hideSubHtml: boolean;

    useLeft: boolean;

    // aria-labelledby attribute fot gallery
    ariaLabelledby: string;

    //aria-describedby attribute for gallery
    ariaDescribedby: string;

    closable: boolean;
    loop: boolean;
    escKey: boolean;
    keyPress: boolean;
    controls: boolean;
    slideEndAnimatoin: boolean;
    hideControlOnEnd: boolean;
    mousewheel: boolean;

    getCaptionFromTitleOrAlt: boolean;

    // .lg-item || '.lg-sub-html'
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

    // 0, 1
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

    // Thumbnail plugin
    exThumbImage: string;
}

export const defaults: Defaults = {
    mode: 'lg-slide',

    // Ex : 'ease'
    cssEasing: 'ease',

    //'for jquery animation'
    easing: 'linear',
    speed: 400,
    height: '100%',
    width: '100%',
    addClass: '',
    startClass: 'lg-start-zoom',
    backdropDuration: 350,

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
    hideSubHtml: true,

    useLeft: false,

    // aria-labelledby attribute fot gallery
    ariaLabelledby: '',

    //aria-describedby attribute for gallery
    ariaDescribedby: '',

    closable: true,
    loop: true,
    escKey: true,
    keyPress: true,
    controls: true,
    slideEndAnimatoin: true,
    hideControlOnEnd: false,
    mousewheel: true,

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
    preload: 1,
    numberOfSlideItemsInDom: 3,
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
    customSlideName: true,

    exThumbImage: '',
};
