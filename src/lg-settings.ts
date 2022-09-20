import { GalleryItem } from './lg-utils';
import { LgQuery } from './lgQuery';
import { LightGallery } from './lightgallery';
import { AutoplaySettings } from './plugins/autoplay/lg-autoplay-settings';
import { CommentSettings } from './plugins/comment/lg-comment-settings';
import { FullscreenSettings } from './plugins/fullscreen/lg-fullscreen-settings';
import { HashSettings } from './plugins/hash/lg-hash-settings';
import { PagerSettings } from './plugins/pager/lg-pager-settings';
import { RotateSettings } from './plugins/rotate/lg-rotate-settings';
import { ShareSettings } from './plugins/share/lg-share-settings';
import { ThumbnailsSettings } from './plugins/thumbnail/lg-thumbnail-settings';
import { VideoSettings } from './plugins/video/lg-video-settings';
import { ZoomSettings } from './plugins/zoom/lg-zoom-settings';

type LightGalleryCoreMobileSettings = Exclude<
    LightGalleryCoreSettings,
    'mobileSettings'
>;

// @todo use separate mobile settings for plugins
export interface MobileSettings
    extends LightGalleryCoreMobileSettings,
        Partial<ZoomSettings>,
        Partial<ThumbnailsSettings>,
        Partial<VideoSettings>,
        Partial<AutoplaySettings>,
        Partial<CommentSettings>,
        Partial<FullscreenSettings>,
        Partial<HashSettings>,
        Partial<PagerSettings>,
        Partial<RotateSettings>,
        Partial<ShareSettings> {}

export interface LightGalleryCoreStrings {
    closeGallery: string;
    toggleMaximize: string;
    previousSlide: string;
    nextSlide: string;
    download: string;
    playVideo: string;
}

export type LightGalleryAllSettings = LightGalleryCoreSettings &
    ZoomSettings &
    ThumbnailsSettings &
    VideoSettings &
    AutoplaySettings &
    CommentSettings &
    FullscreenSettings &
    HashSettings &
    PagerSettings &
    RotateSettings &
    ShareSettings;

export type LightGallerySettings = Partial<LightGalleryAllSettings>;

export interface LightGalleryCoreSettings {
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
     * If you are using lightGallery for commercial projects, you need to purchase a commercial license
     * to get the license key. For projects that are compatible with GPLv3 license,
     * please contact us for getting a license key at <a href="mailto:contact@lightgalleryjs.com">contact@lightgalleryjs.com</a>.
     * If you want to test lightGallery before purchasing a commercial license, you can
     * use `0000-0000-000-0000` as a temporary license key
     */

    licenseKey: string;

    /**
     * Height of the gallery.
     * example '100%' , '300px'
     */
    height: string;

    /**
     * Width of the gallery.
     * example '100%' , '300px'
     */
    width: string;

    /**
     * Add custom class for gallery container
     * This can be used to set different style for different galleries
     */
    addClass: string;

    /**
     * Start animation class for the gallery.
     * @description
     * <ul>
     * <li>startClass will be empty zoomFromOrigin is true.</li>
     * <li>This can be used to change the starting effect when the image is loaded</li>
     * <li>This is also applied when navigating to new slides</li>
     * </ul>
     */
    startClass: string;

    /**
     * Enable zoom from origin effect.
     * @description You need to know the original image size upfront and provide it via data-lg-size attribute as <code> data-lg-size="1920-1280</code>"
     *
     * If you don't know, the size of a few images in the list, you can skip the data-lg-size attribute for the particular slides,
     * lightGallery will show the default animation if data-lg-size is not available
     *
     * If you are using responsive images,
     * you can pass a comma separated list of sizes combined with a max-width (up to what size the particular image should be used)
     *
     * example -
     * <code> data-lg-size="240-160-375, 400-267-480, 1600-1067"
     * data-responsive="img-240.jpg 375, img-400.jpg 480"
     * data-src="img-1600.jpg" </code>
     *
     * In the above example, upto 375 width img.240.jpg and lg-size 240-160 will be used.
     * Similarly, upto 480 pixel width size 400-267 and img-400.jpg will be used
     * And above 480, lg-size 1600-1067 and img-1600.jpg will be used
     *
     * <ul>
     * <li>At the moment, zoomFromOrigin options is supported only for image slides.</li>
     * <li>Will be false if dynamic option is enabled or galleryID found in the URL.</li>
     * <li>startClass will be empty if zoomFromOrigin is true to avoid css conflicts.</li>
     * </ul>
     */
    zoomFromOrigin: boolean;

    /**
     * Zoom from image animation duration
     */
    startAnimationDuration: number;

    /**
     * Backdrop transition duration.
     * Note - Do not change the value of backdrop via css.
     */
    backdropDuration: number;

    /**
     * Configure where the gallery should be appended.
     * Useful to create inline galleries and more
     * It is an empty string in the default settings and later assigned to document.body to avoid accessing document for SSR
     */
    container: HTMLElement | '';

    /**
     * Delay for hiding gallery controls in ms.
     * Pass <code>0</code> if you don't want to hide the controls
     */
    hideBarsDelay: number;

    /**
     * Delay in hiding controls for the first time when gallery is opened
     */
    showBarsAfter: number;

    /**
     * Delay slide transitions.
     * @description This is useful if you want to do any action in the current slide before moving to next slide.
     * <section>
     * For example, fading out the captions before going to next slide.
     * <code>.lg-slide-progress</code> class name is added to the current slide immediately after calling the slide method.
     * But transition begins only after the delay
     * </section>
     */
    slideDelay: number;

    /**
     * Support legacy browsers
     * @description Currently this is used only for adding support to srcset attribute via picturefill library
     * If true lightGallery will show warning message to include picturefill library
     */
    supportLegacyBrowser: boolean;

    /**
     * If true, toolbar, captions and thumbnails will not overlap with media element
     * This will not effect thumbnails if animateThumb is false
     * Also, toggle thumbnails button is not displayed if allowMediaOverlap is false
     * <section>
     * Note - Changing the position of the media on every slide transition creates a flickering effect.
     * Therefore, the height of the caption is calculated dynamically, only once based on the first slide caption.
     * </section>
     * <section>
     * if you have dynamic captions for each media,
     * you can provide an appropriate height for the captions via allowMediaOverlap option
     * </section>
     */
    allowMediaOverlap: boolean;

    /**
     * Video max size.
     * @description This can be over-written by passing specific size via data-lg-size attribute
     * Recommended video resolution and & aspect ratios <a href="https://support.google.com/youtube/answer/6375112">https://support.google.com/youtube/answer/6375112</a>
     */
    videoMaxSize: string;

    /**
     * Automatically load poster image for YouTube videos
     */
    loadYouTubePoster: boolean;

    /**
     * Height of the caption for calculating allowMediaOverlap positions
     * Note - this is only used to find the position of media item if allowMediaOverlap is true.
     * Not for setting height of the captions
     * Set 0 if you want to calculate the height of captions dynamically
     */
    defaultCaptionHeight: number;

    /**
     * aria-labelledby attribute fot gallery
     */
    ariaLabelledby: string;

    /**
     * aria-describedby attribute for gallery
     */
    ariaDescribedby: string;

    /**
     * Hide scrollbar when gallery is opened
     * @version V2.5.0
     */
    hideScrollbar: boolean;

    /**
     * Reset to previous scrollPosition when lightGallery is closed
     * @description By default, lightGallery doesn't hide the scrollbar for a smooth opening transition.
     * If a user changes the scroll position, lightGallery resets it to the previous value
     * @version V2.5.0
     */
    resetScrollPosition: boolean;

    /**
     * If false user won't be abel to close the gallery at all
     * This is useful for creating inline galleries.
     */
    closable: boolean;

    /**
     * allows vertical drag/swipe to close gallery
     * <code>false</code> if option <code>closable</code> is <code>false</code>
     */
    swipeToClose: boolean;
    /**
     * allows clicks on black area to close gallery.
     */
    closeOnTap: boolean;

    /**
     * If false, close button won't be displayed.
     * Useful for creating inline galleries.
     */
    showCloseIcon: boolean;

    /**
     * Show maximize icon.
     * Useful for creating inline galleries.
     */
    showMaximizeIcon: boolean;

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
     * Trap focus within the lightGallery
     * @version V2.5.0
     */
    trapFocus: boolean;

    /**
     * If false, prev/next buttons will not be displayed.
     */
    controls: boolean;

    /**
     * Enable slideEnd animation
     */
    slideEndAnimation: boolean;

    /**
     * If true, prev/next button will be hidden on first/last image.
     * @description Note - this option will be ignored if <code>loop</code> or <code>slideEndAnimation</code> is set to true
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
     * If you choose '.lg-outer', you are responsible for placing the div at the right position.
     * '.lg-outer' is useful if you want show custom HTML outside the normal gallery
     */
    appendSubHtmlTo: '.lg-sub-html' | '.lg-item' | '.lg-outer';

    /**
     * Set to true if the selector in "data-sub-html" should use the current item as its origin.
     */
    subHtmlSelectorRelative: boolean;

    /**
     * number of preload slides
     * @description will exicute only after the current slide is fully loaded.
     * for example, if you click on 4th image and if preload = 1 then 3rd slide and 5th
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
     * Custom selector property instead of direct children.
     * @description Based on your markup structure, you can specify custom selectors to fetch media data for the gallery
     * Pass "this" to select same element
     * You can also pass HTMLCollection directly
     * Example - '.my-selector' | '#my-selector' | this | document.querySelectorAll('.my-selector')
     */
    selector: string | HTMLCollection[];

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
     * specify which slide should load initially
     */
    index: number;

    /**
     * Set width for iframe.
     */
    iframeWidth: string;

    /**
     * Set height for iframe.
     */
    iframeHeight: string;

    /**
     * Set max width for iframe.
     */
    iframeMaxWidth: string;

    /**
     * Set max height for iframe.
     */
    iframeMaxHeight: string;

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
    dynamic: boolean;

    /**
     * An array of objects (src, iframe, subHtml, thumb, poster, responsive, srcset sizes) representing gallery elements.
     */
    dynamicEl: GalleryItem[];

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
     * <div id="lightGallery">
     *     <a href="a.jpg" data-custom-prop="abc"><img src="thumb.jpg" /></a>
     *     <a href="a.jpg" data-custom-prop="xyz"><img src="thumb.jpg" /></a>
     * </div>
     * JS:
     * lightGallery(document.getElementById('lightGallery'), {
     *     extraProps: ['customProp']
     * })
     * // Note - If you are using dynamic mode, you can pass any custom prop in the galleryItem
     * lightGallery(document.getElementById('lightGallery'), {
     *     dynamic: true,
     *     dynamicEl: [{
     *         src: 'img/img1.jpg',
     *         customProp:'abc',
     *     }]
     * })
     *
     */
    extraProps: string[];

    /**
     * Option to fetch different thumbnail image other than first image
     * @description If you want to use external image for thumbnail,
     * add the path of that image inside "data-" attribute
     * and set value of this option to the name of your custom attribute.
     *
     * @example
     * <div id="lightGallery">
     *     <a href="a.jpg" data-external-thumb-image="images/externalThumb.jpg" ><img src="thumb.jpg" /></a>
     * </div>
     *
     * lightGallery(document.getElementById('lightGallery'), {
     *     exThumbImage: 'data-external-thumb-image'
     * })
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
     * Note - mobileSettings does not merge default values, You need to provide all mobileSettings including default values
     */
    mobileSettings: Partial<MobileSettings>;

    /**
     * Aria label strings for lightGallery core modules.
     * @description This can be useful if you want to localize the lightGallery strings to other languages.
     * Use your own service to translate the strings and pass it via settings.strings
     * You can find dedicated strings option for all lightGallery modules in their respective documentation.
     */
    strings: LightGalleryCoreStrings;

    plugins: (new (instance: LightGallery, $LG: LgQuery) => any)[];
}

export const lightGalleryCoreSettings: LightGalleryCoreSettings = {
    mode: 'lg-slide',
    easing: 'ease',
    speed: 400,
    licenseKey: '0000-0000-000-0000',
    height: '100%',
    width: '100%',
    addClass: '',
    startClass: 'lg-start-zoom',
    backdropDuration: 300,
    container: '',
    startAnimationDuration: 400,
    zoomFromOrigin: true,
    hideBarsDelay: 0,
    showBarsAfter: 10000,
    slideDelay: 0,
    supportLegacyBrowser: true,
    allowMediaOverlap: false,
    videoMaxSize: '1280-720',
    loadYouTubePoster: true,
    defaultCaptionHeight: 0,
    ariaLabelledby: '',
    ariaDescribedby: '',
    resetScrollPosition: true,
    hideScrollbar: false,
    closable: true,
    swipeToClose: true,
    closeOnTap: true,
    showCloseIcon: true,
    showMaximizeIcon: false,
    loop: true,
    escKey: true,
    keyPress: true,
    trapFocus: true,
    controls: true,
    slideEndAnimation: true,
    hideControlOnEnd: false,
    mousewheel: false,
    getCaptionFromTitleOrAlt: true,
    appendSubHtmlTo: '.lg-sub-html',
    subHtmlSelectorRelative: false,
    preload: 2,
    numberOfSlideItemsInDom: 10,
    selector: '',
    selectWithin: '',
    nextHtml: '',
    prevHtml: '',
    index: 0,
    iframeWidth: '100%',
    iframeHeight: '100%',
    iframeMaxWidth: '100%',
    iframeMaxHeight: '100%',
    download: true,
    counter: true,
    appendCounterTo: '.lg-toolbar',
    swipeThreshold: 50,
    enableSwipe: true,
    enableDrag: true,
    dynamic: false,
    dynamicEl: [],
    extraProps: [],
    exThumbImage: '',
    isMobile: undefined,
    mobileSettings: {
        controls: false,
        showCloseIcon: false,
        download: false,
    } as MobileSettings,
    plugins: [],
    strings: {
        closeGallery: 'Close gallery',
        toggleMaximize: 'Toggle maximize',
        previousSlide: 'Previous slide',
        nextSlide: 'Next slide',
        download: 'Download',
        playVideo: 'Play video',
    } as LightGalleryCoreStrings,
};
