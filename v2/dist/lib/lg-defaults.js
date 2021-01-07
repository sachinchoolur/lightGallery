"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = void 0;
exports.defaults = {
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
//# sourceMappingURL=lg-defaults.js.map