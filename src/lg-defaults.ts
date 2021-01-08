import { DynamicItem } from './lg-utils';

export type MobileDefaults = Exclude<Defaults, 'mobileSettings'>;
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
    cssEasing: string;
    speed: number;
    height: string;
    width: string;
    addClass: string;
    startClass: string;
    backdropDuration: number;

    container: HTMLElement;

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
    swipeToClose: boolean;
    closeOnTap: boolean;
    showCloseIcon: boolean;
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
    // Has a minimum value of 3
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

    isMobile: () => boolean;

    mobileSettings: MobileDefaults;
}

export const defaults: Defaults = {
    mode: 'lg-slide',

    // Ex : 'ease'
    cssEasing: 'ease',
    speed: 400,
    height: '100%',
    width: '100%',
    addClass: '',
    startClass: 'lg-start-zoom',
    backdropDuration: 150,

    container: document.body,

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
    swipeToClose: true,
    closeOnTap: true,
    showCloseIcon: false,
    loop: true,
    escKey: true,
    keyPress: true,
    controls: true,
    slideEndAnimatoin: true,
    hideControlOnEnd: false,
    mousewheel: false,

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
    preload: 3,
    numberOfSlideItemsInDom: 10,
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
