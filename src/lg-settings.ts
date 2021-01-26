import { DynamicItem } from './lg-utils';

export type MobileSettings = Exclude<LightGallerySettings, 'mobileSettings'>;
export interface LightGallerySettings {
    /**
     * Type of transition between images.
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

    /**
     * Slide animation CSS easing property
     */
    easing: string;

    /**
     *Transition duration (in ms).
     */
    speed: number;

    /**
     * Height of the gallery.
     * @example '100%' , '300px'
     */
    height: string;

    /**
     * Width of the gallery.
     * @example '100%' , '300px'
     */
    width: string;

    /**
     * Add custom class for gallery container
     * @description this can be used to set different style for different galleries
     */
    addClass: string;

    /**
     * Start animation class for the gallery.
     * @description This can be used to change the zoom effect when the image is loaded
     * This is also applied when navigating to new slides
     * Note -  if startClass will be empty zoomFromImage is true.
     */
    startClass: string;

    /**
     * enable zoom from image effect.
     * @description You need to know the original image size upfront and provide it via data-lg-size attribute as data-lg-size="1920-1280"
     * Supports only images.
     * Will be false if dynamic option is enabled or galleryID found in the URL.
     * startClass will be empty if zoomFromImage is true to avoid css conflicts.
     */
    zoomFromImage: boolean;

    /**
     * Zoom from image animation duration
     */
    startAnimationDuration: number;

    /**
     * Backdrop transition duration.
     * @description Note - Do not change the value of backdrop via css.
     */
    backdropDuration: number;

    /**
     * Configure where the gallery should be appended.
     * @description Useful to create inline galleries and more
     */
    container: HTMLElement;

    /**
     * Delay for hiding gallery controls in ms.
     * @description Pass 0 if you don't want to hide the controls
     */
    hideBarsDelay: number;

    /**
     * Delay in hiding controls for the first time when gallery is opened
     */
    showBarsAfter: number;

    /**
     * Delay slide transitions.
     * @description This is useful if you want to do any action in the current slide before moving to next slide.
     * For example, fading out the captions before going to next slide.
     * .lg-slide-progress class name is added to the current slide immediately after calling the slide method.
     * But transition begins only after the delay
     */
    slideDelay: number;

    /**
     * Support legacy browsers
     * @description Currently this is used only for adding support to srcset attribute via picturefill library
     * If true lightGallery will show warning message to include picturefill library
     */
    supportLegacyBrowser: boolean;

    /**
     * If true sub-html will also be hidden along with controls and toolbar if hideBarDelay is more than 0
     */
    hideSubHtml: boolean;

    /**
     * force lightGallery to use css left property instead of transform.
     */
    useLeft: boolean;

    /**
     * aria-labelledby attribute fot gallery
     */
    ariaLabelledby: string;

    /**
     * aria-describedby attribute for gallery
     */
    ariaDescribedby: string;

    /**
     * If false user won't be abel to close the gallery at all
     * @description This is useful for creating inline galleries.
     */
    closable: boolean;

    /**
     * allows vertical drag/swipe to close gallery
     */
    swipeToClose: boolean;
    /**
     * allows clicks on black area to close gallery.
     */
    closeOnTap: boolean;

    /**
     * If false, close button won't be displayed.
     * @description Useful for creating inline galleries.
     */
    showCloseIcon: boolean;

    /**
     * If false, will disable the ability to loop back to the beginning of the gallery from the last slide.
     */
    loop: boolean;

    /**
     * Whether the LightGallery could be closed by pressing the "Esc" key.
     */
    escKey: boolean;

    /**
     * Enable keyboard navigation
     */
    keyPress: boolean;

    /**
     * If false, prev/next buttons will not be displayed.
     */
    controls: boolean;

    /**
     * Enable slideEnd animation
     */
    slideEndAnimatoin: boolean;

    /**
     * If true, prev/next button will be hidden on first/last image.
     */
    hideControlOnEnd: boolean;

    /**
     * ability to navigate to next/prev slides on mousewheel
     */
    mousewheel: boolean;

    /**
     * Option to get captions from alt or title tags.
     */
    getCaptionFromTitleOrAlt: boolean;

    /**
     * control where the sub-html should be appended.
     */
    appendSubHtmlTo: '.lg-sub-html' | '.lg-item';

    /**
     * Set to true if the selector in "data-sub-html" should use the current item as its origin.
     */
    subHtmlSelectorRelative: boolean;

    /**
     * number of preload slides
     * @description will exicute only after the current slide is fully loaded.
     * for example you click on 4th image and if preload = 1 then 3rd slide and 5th
     * slide will be loaded in the background after the 4th slide is fully loaded..
     * if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.
     */
    preload: number;

    /**
     * Control how many slide items should be kept in dom at a time
     * @description To improve performance by reducing number of gallery items in the dom,
     * lightGallery keeps only the lowest possible number of slides in the dom at a time.
     * This has a minimum value of 3
     */
    numberOfSlideItemsInDom: number;

    /**
     * Show Content once it is fully loaded
     */
    showAfterLoad: boolean;

    /**
     * Custom selector property instead of direct children.
     * @description Based on your markup structure, you can specify custom selectors to fetch media data for the gallery
     * Pass "this" to select same element
     * Example - '.my-selector' | '#my-selector' | this
     */
    selector: string;

    /**
     * By default selector element relative to the current gallery.
     * Instead of that you can tell lightGallery to select element relative to another element.
     * Example - '.my-selector-container' | '#my-selector-container'
     * In the code this become selector =  document.querySelector(this.s.selectWithin ).querySelectorAll(this.s.selector);
     */
    selectWithin: string;

    /**
     * Custom html for next control
     */
    nextHtml: string;

    /**
     * Custom html for prev control
     */
    prevHtml: string;

    /**
     * specify which image/video should load initially
     */
    index: false | number;

    /**
     * Set maximum width for iframe.
     */
    iframeMaxWidth: string;

    /**
     * Enable download button.
     * @description By default download url will be taken from data-src/href attribute but it supports only for modern browsers.
     * If you want you can provide another url for download via data-download-url.
     * pass false in data-download-url if you want to hide download button for the particular slide.
     */
    download: boolean;

    /**
     * Whether to show total number of images and index number of currently displayed image.
     */
    counter: boolean;

    /**
     * Where the counter should be appended
     */
    appendCounterTo: string;

    /**
     * By setting the swipeThreshold (in px) you can set how far the user must swipe for the next/prev image.
     */
    swipeThreshold: number;

    /**
     * Enables swipe support for touch devices
     */
    enableSwipe: boolean;

    /**
     * Enables desktop mouse drag support
     */
    enableDrag: boolean;

    /**
     * LightGallery can be instantiated and launched programmatically by setting this option to true and populating dynamicEl option (see below) with the definitions of images.
     */
    dynamic: false;

    /**
     * An array of objects (src, iframe, subHtml, thumb, poster, responsive, srcset sizes) representing gallery elements.
     */
    dynamicEl: DynamicItem[];

    /**
     * Fetch custom properties from the selector
     * @description this is useful for plugin development
     * By default lightGallery fetches and store all the props selectors to
     * reduce frequent dom interaction for fetching props every time.
     *
     * If you need any addition data to be fetched and stored in the galleryItems variable,
     * you can do this just by passing the prop names via extraProps
     * @example
     * HTML:
     * ```html
     * <div id="lightGallery">
     *     <a href="a.jpg" data-custom-prop="abc"><img src="thumb.jpg" /></a>
     *     <a href="a.jpg" data-custom-prop="xyz"><img src="thumb.jpg" /></a>
     * </div>
     * ```
     * ```js
     * lightGallery(document.getElementById('lightGallery'), {
     *     extraProps: ['dataCustomProp']
     * })
     * ```
     */
    extraProps: string[];

    /**
     * Unique id for each gallery.
     * @description It is mandatory when you use hash plugin for multiple galleries on the same page.
     */
    galleryId: number;

    /**
     * Custom slide name to use in the url when hash plugin is enabled
     */
    customSlideName: boolean;

    /**
     * If you want to use external image for thumbnail, 
     * add the path of that image inside "data-" attribute and set value of this option to the name of your custom attribute.
    @example 
    ```html
    <li data-exthumbimage="externalThumb.jpg" data-src="img/img1.jpg"></li>
    ```
    ```js
    {
        exThumbImage: 'data-exthumbimage'
    }
    ```
     */
    exThumbImage: string;

    /**
     * Function to detect mobile devices
     */
    isMobile?: () => boolean;

    /**
     * Separate settings for mobile devices
     * @description Note - this is applied only at the time of loading
     * by default controls and close buttons are disabled on mobile devices.
     * use this options if you want to enable them or change any other settings for mobile devices
     */
    mobileSettings: MobileSettings;
}

export const lightGallerySettings: LightGallerySettings = {
    mode: 'lg-slide',
    easing: 'ease',
    speed: 400,
    height: '100%',
    width: '100%',
    addClass: '',
    startClass: 'lg-start-zoom',
    backdropDuration: 150,
    container: document.body,
    startAnimationDuration: 350,
    zoomFromImage: false,
    hideBarsDelay: 0,
    showBarsAfter: 10000,
    slideDelay: 3000,
    supportLegacyBrowser: true,
    hideSubHtml: false,
    useLeft: false,
    ariaLabelledby: '',
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
    appendSubHtmlTo: '.lg-sub-html',
    subHtmlSelectorRelative: false,
    preload: 2,
    numberOfSlideItemsInDom: 10,
    showAfterLoad: true,
    selector: '',
    selectWithin: '',
    nextHtml: '',
    prevHtml: '',
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
    isMobile: undefined,
    mobileSettings: {
        controls: false,
        showCloseIcon: false,
    } as MobileSettings,
};
