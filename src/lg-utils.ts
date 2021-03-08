import { $LG, lgQuery } from './lgQuery';
import { VideoSource } from './plugins/video/lg-video';
import { VideoInfo } from './types';
export interface ImageSize {
    width: number;
    height: number;
}

export interface ImageSources {
    media?: string;
    srcset: string;
    sizes?: string;
    type?: string;
}

export interface DynamicItem {
    /**
     * url of the media
     */
    src: string;

    /**
     * Source attributes for the picture element
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source#attributes
     */
    sources: ImageSources[];

    /**
     * Thumbnail url
     */
    thumb: string;

    /**
     * alt attribute for the image
     */
    alt: string;

    /**
     * Title attribute for the video
     */
    title: string;

    /**
     * Title for iframe
     */
    iframeTitle: string;

    /**
     * Caption for the slide
     * @description You can either pass the HTML markup or the ID or class name of the element which contains the captions
     */
    subHtml: string;

    /**
     * url of the file which contain the sub html.
     * @description Note - Does not support Internet Explorer browser
     */
    subHtmlUrl: string;

    /**
     * Video source
     */
    video: VideoSource;

    /**
     * Poster url
     */
    poster: string;

    /**
     * Custom slide name to use in the url when hash plugin is enabled
     */
    slideName: string;

    /**
     * List of images and viewport's max width separated by comma.
     * @description Ex: img/1-375.jpg 375, img/1-480.jpg 480, img/1-757.jpg 757.
     */
    responsive: string;

    /**
     * srcset attribute values for the main image
     */
    srcset: string;

    /**
     * srcset sizes attribute for the main image
     */
    sizes: string;

    /**
     * Set true is you want to open your url in an iframe
     */
    iframe: boolean;

    /**
     * Download url for your image/video.
     * @description Pass false if you want to hide the download button.
     */
    downloadUrl: string | boolean;

    /**
     * Actual size of the image in px.
     * @description This is used in zoom plugin to see the actual size of the image when double taped on the image.
     */
    width: string;

    /**
     * Facebook share URL.
     * @description Specify only if you want to provide separate share URL for the specific slide. By default, current browser URL is taken.
     */
    facebookShareUrl: string;

    /**
     * Tweet text
     */
    tweetText: string;

    /**
     * Twitter share URL.
     * @description Specify only if you want to provide separate share URL for the specific slide. By default, current browser URL will be taken.
     */
    twitterShareUrl: string;

    /**
     * Pinterest share URL.
     * @description Specify only if you want to provide separate share URL for the specific slide. By default, current browser URL will be taken.
     * Note: Pinterest requires absolute URL
     */
    pinterestShareUrl: string;

    /**
     * Description for Pinterest post.
     */
    pinterestText: string;

    __slideVideoInfo?: VideoInfo;
    [key: string]: any;
}

const defaultDynamicOptions = [
    'src',
    'sources',
    'subHtml',
    'subHtmlUrl',
    'html',
    'video',
    'poster',
    'slideName',
    'responsive',
    'srcset',
    'sizes',
    'iframe',
    'downloadUrl',
    'width',
    'facebookShareUrl',
    'tweetText',
    'iframeTitle',
    'twitterShareUrl',
    'pinterestShareUrl',
    'pinterestText',
];

// Convert html data-attribute to camalcase
export function convertToData(attr: string): string {
    // FInd a way for lgsize
    if (attr === 'href') {
        return 'src';
    }
    attr = attr.replace('data-', '');
    attr = attr.charAt(0).toLowerCase() + attr.slice(1);
    attr = attr.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

    return attr;
}

const utils = {
    /**
     * get possible width and height from the lgSize attribute. Used for ZoomFromOrigin option
     */
    getSize(
        el: HTMLElement,
        container: lgQuery,
        spacing = 0,
        defaultLgSize?: string,
    ): ImageSize | undefined {
        const LGel = $LG(el);
        const lgSize = LGel.attr('data-lg-size') || defaultLgSize;

        if (!lgSize) {
            return;
        }

        const size = lgSize.split('-');

        const width = parseInt(size[0], 10);
        const height = parseInt(size[1], 10);

        const wWidth = container.width();
        const wHeight = container.height() - spacing;

        const maxWidth = Math.min(wWidth, width);
        const maxHeight = Math.min(wHeight, height);

        const ratio = Math.min(maxWidth / width, maxHeight / height);

        return { width: width * ratio, height: height * ratio };
    },

    /**
     * @desc Get transform value based on the imageSize. Used for ZoomFromOrigin option
     * @param {jQuery Element}
     * @returns {String} Transform CSS string
     */
    getTransform(
        el: HTMLElement,
        container: lgQuery,
        top: number,
        bottom: number,
        imageSize?: ImageSize,
    ): string | undefined {
        if (!imageSize) {
            return;
        }
        const LGel = $LG(el).find('img').first();

        const containerRect = container.get().getBoundingClientRect();

        const wWidth = containerRect.width;

        // using innerWidth to include mobile safari bottom bar
        const wHeight = container.height() - (top + bottom);

        const elWidth = LGel.width();
        const elHeight = LGel.height();

        const elStyle = LGel.style();
        let x =
            (wWidth - elWidth) / 2 -
            LGel.offset().left +
            (parseFloat(elStyle.paddingLeft) || 0) +
            (parseFloat(elStyle.borderLeft) || 0) +
            $LG(window).scrollLeft() +
            containerRect.left;
        let y =
            (wHeight - elHeight) / 2 -
            LGel.offset().top +
            (parseFloat(elStyle.paddingTop) || 0) +
            (parseFloat(elStyle.borderTop) || 0) +
            $LG(window).scrollTop() +
            top;

        const scX = elWidth / imageSize.width;
        const scY = elHeight / imageSize.height;

        const transform =
            'translate3d(' +
            (x *= -1) +
            'px, ' +
            (y *= -1) +
            'px, 0) scale3d(' +
            scX +
            ', ' +
            scY +
            ', 1)';
        return transform;
    },

    getIframeMarkup(
        src: string,
        iframeWidth: string,
        iframeHeight: string,
        iframeTitle?: string,
    ): string {
        const title = iframeTitle ? 'title="' + iframeTitle + '"' : '';
        return `<div class="lg-video-cont lg-has-iframe" style="width:${iframeWidth}; height: ${iframeHeight}">
                    <iframe class="lg-object" frameborder="0" ${title} src="${src}"  allowfullscreen="true"></iframe>
                </div>`;
    },

    getImgMarkup(
        index: number,
        src: string,
        alt: string,
        sources?: ImageSources[],
    ): string {
        const imgMarkup = `<img ${alt} class="lg-object lg-image" data-index="${index}" src="${src}" />`;
        let sourceTag = '';
        if (sources) {
            const sourceObj =
                typeof sources === 'string' ? JSON.parse(sources) : sources;

            sourceTag = sourceObj.map((source: any) => {
                let attrs = '';
                Object.keys(source).forEach((key) => {
                    // Do not remove the first space as it is required to separate the attributes
                    attrs += ` ${key}="${source[key]}"`;
                });
                return `<source ${attrs}></source>`;
            });
        }
        return `${sourceTag}${imgMarkup}`;
    },

    // Get src from responsive src
    getResponsiveSrc(srcItms: string[]): string {
        const rsWidth = [];
        const rsSrc = [];
        let src = '';
        for (let i = 0; i < srcItms.length; i++) {
            const _src = srcItms[i].split(' ');

            // Manage empty space
            if (_src[0] === '') {
                _src.splice(0, 1);
            }

            rsSrc.push(_src[0]);
            rsWidth.push(_src[1]);
        }

        const wWidth = window.innerWidth;
        for (let j = 0; j < rsWidth.length; j++) {
            if (parseInt(rsWidth[j], 10) > wWidth) {
                src = rsSrc[j];
                break;
            }
        }
        return src;
    },

    isImageLoaded(img: HTMLImageElement): boolean {
        if (!img) return false;
        // During the onload event, IE correctly identifies any images that
        // weren’t downloaded as not complete. Others should too. Gecko-based
        // browsers act like NS4 in that they report this incorrectly.
        if (!img.complete) {
            return false;
        }

        // However, they do have two very useful properties: naturalWidth and
        // naturalHeight. These give the true size of the image. If it failed
        // to load, either of these should be zero.
        if (img.naturalWidth === 0) {
            return false;
        }

        // No other way of checking: assume it’s ok.
        return true;
    },

    getVideoPosterMarkup(
        _poster: string,
        dummyImg: string,
        videoContStyle: string,
        _isVideo?: VideoInfo,
    ): string {
        let videoClass = '';
        if (_isVideo && _isVideo.youtube) {
            videoClass = 'lg-has-youtube';
        } else if (_isVideo && _isVideo.vimeo) {
            videoClass = 'lg-has-vimeo';
        } else {
            videoClass = 'lg-has-html5';
        }

        return `<div class="lg-video-cont ${videoClass}" style="${videoContStyle}">
                <div class="lg-video-play-button">
                <svg
                    viewBox="0 0 20 20"
                    preserveAspectRatio="xMidYMid"
                    focusable="false"
                    aria-labelledby="Play video"
                    role="img"
                    class="lg-video-play-icon"
                >
                    <title>Play video</title>
                    <polygon class="lg-video-play-icon-inner" points="1,0 20,10 1,20"></polygon>
                </svg>
                <svg class="lg-video-play-icon-bg" viewBox="0 0 50 50" focusable="false">
                    <circle cx="50%" cy="50%" r="20"></circle></svg>
                <svg class="lg-video-play-icon-circle" viewBox="0 0 50 50" focusable="false">
                    <circle cx="50%" cy="50%" r="20"></circle>
                </svg>
            </div>
            ${dummyImg || ''}
            <img class="lg-object lg-video-poster" src="${_poster}" />
        </div>`;
    },

    /**
     * @desc Create dynamic elements array from gallery items when dynamic option is false
     * It helps to avoid frequent DOM interaction
     * and avoid multiple checks for dynamic elments
     *
     * @returns {Array} dynamicEl
     */
    getDynamicOptions(
        items: any,
        extraProps: string[],
        getCaptionFromTitleOrAlt: boolean,
        exThumbImage: string,
    ): DynamicItem[] {
        const dynamicElements: DynamicItem[] = [];
        const availableDynamicOptions = [
            ...defaultDynamicOptions,
            ...extraProps,
        ];
        [].forEach.call(items, (item: HTMLElement) => {
            const dynamicEl: DynamicItem = {} as DynamicItem;
            for (let i = 0; i < item.attributes.length; i++) {
                const attr = item.attributes[i];
                if (attr.specified) {
                    const dynamicAttr = convertToData(attr.name);
                    let label = '';
                    if (availableDynamicOptions.indexOf(dynamicAttr) > -1) {
                        label = dynamicAttr;
                    }
                    if (label) {
                        (dynamicEl as any)[label] = attr.value;
                    }
                }
            }
            const currentItem = $LG(item);
            const alt = currentItem.find('img').first().attr('alt');
            const title = currentItem.attr('title');

            const thumb = exThumbImage
                ? currentItem.attr(exThumbImage)
                : currentItem.find('img').first().attr('src');
            dynamicEl.thumb = thumb;

            if (getCaptionFromTitleOrAlt && !dynamicEl.subHtml) {
                dynamicEl.subHtml = title || alt || '';
            }
            dynamicEl.alt = alt || title || '';
            dynamicElements.push(dynamicEl);
        });
        return dynamicElements;
    },
    isMobile(): boolean {
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
};

export default utils;
