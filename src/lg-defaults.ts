import { DynamicItem } from './lg-utils';

export type MobileDefaults = Exclude<Defaults, 'mobileSettings'>;
export interface Defaults {
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
    isMobile: () => boolean;

    /**
     * Separate settings for mobile devices
     * @description Note - this is applied only at the time of loading
     * by default controls and close buttons are disabled on mobile devices.
     * use this options if you want to enable them or change any other settings for mobile devices
     */
    mobileSettings: MobileDefaults;
}

export const defaults: Defaults = {
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
    zoomFromImage: true,
    hideBarsDelay: 2000,
    showBarsAfter: 0,
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
    preload: 3,
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
    isMobile: function () {
        let isMobile = false;
        (function (a) {
            if (
                /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                    a,
                ) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                    a.substr(0, 4),
                )
            )
                isMobile = true;
        })(navigator.userAgent || navigator.vendor || (window as any).opera);
        return isMobile;
    },
    mobileSettings: {
        controls: false,
        showCloseIcon: false,
    } as MobileDefaults,
};
