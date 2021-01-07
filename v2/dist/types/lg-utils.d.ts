import { VideoInfo } from './lightgallery';
export interface ImageSize {
    width: number;
    height: number;
}
export interface DynamicItem {
    src: string;
    alt: string;
    title: string;
    subHtml: string;
    subHtmlUrl: string;
    html: string;
    video: string;
    poster: string;
    slideName: string;
    responsive: string;
    srcset: string;
    sizes: string;
    iframe: string;
    downloadUrl: string | boolean;
    width: string;
    facebookShareUrl: string;
    tweetText: string;
    witterShareUrl: string;
    googleplusUhareUrl: string;
    pinterestShareUrl: string;
    pinterestText: string;
    __slideVideoInfo?: VideoInfo;
    [key: string]: any;
}
export declare function convertToData(attr: string): string;
declare const utils: {
    /**
     * @desc get possible width and height from the lgSize attribute. Used for ZoomFromImage option
     * @param {jQuery Element} $el
     * @returns {Object} Computed Width and Computed Height
     */
    getSize(el: HTMLElement): ImageSize | undefined;
    /**
     * @desc Get transform value based on the imageSize. Used for ZoomFromImage option
     * @param {jQuery Element}
     * @returns {String} Transform CSS string
     */
    getTransform(el: HTMLElement, imageSize?: ImageSize | undefined): string | undefined;
    getIframeMarkup(src: string, iframeMaxWidth: number | string): string;
    getResponsiveSrc(srcItms: string[]): string;
    getVideoPosterMarkup(_poster: string, _isVideo?: VideoInfo | undefined): string;
    /**
     * @desc Create dynamic elements array from gallery items when dynamic option is false
     * It helps to avoid frequent DOM interaction
     * and avoid multiple checks for dynamic elments
     *
     * @returns {Array} dynamicEl
     */
    getDynamicOptions(items: any, extraProps: string[], getCaptionFromTitleOrAlt: boolean): DynamicItem[];
};
export default utils;
