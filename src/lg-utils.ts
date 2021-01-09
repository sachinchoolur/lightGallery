import { LG } from './lgQuery';
import { VideoInfo } from './lightgallery';
export interface ImageSize {
    width: number;
    height: number;
}

export interface DynamicItem {
    src: string;
    alt: string;
    // @desc Video title
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

const defaultDynamicOptions = [
    'src',
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
    'witterShareUrl',
    'googleplusUhareUrl',
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
     * @desc get possible width and height from the lgSize attribute. Used for ZoomFromImage option
     * @param {jQuery Element} $el
     * @returns {Object} Computed Width and Computed Height
     */
    getSize(el: HTMLElement): ImageSize | undefined {
        const LGel = LG(el);
        const lgSize = LGel.attr('data-lg-size');

        if (!lgSize) {
            return;
        }

        const size = lgSize.split('-');

        const width = parseInt(size[0], 10);
        const height = parseInt(size[1], 10);

        const wWidth = document.body.clientWidth;
        const wHeight = window.innerHeight;

        const maxWidth = Math.min(wWidth, width);
        const maxHeight = Math.min(wHeight, height);

        const srcWidth = LGel.width();
        const srcHeight = LGel.height();

        const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

        return {
            width: srcWidth * ratio,
            height: srcHeight * ratio,
        };
    },

    /**
     * @desc Get transform value based on the imageSize. Used for ZoomFromImage option
     * @param {jQuery Element}
     * @returns {String} Transform CSS string
     */
    getTransform(el: HTMLElement, imageSize?: ImageSize): string | undefined {
        if (!imageSize) {
            return;
        }
        const LGel = LG(el);

        const wWidth = document.body.clientWidth;

        // using innerWidth to include mobile safari bottom bar
        const wHeight = window.innerHeight;

        const elWidth = LGel.width();
        const elHeight = LGel.height();

        const elStyle = LGel.style();

        let x =
            (wWidth - elWidth) / 2 -
            (LGel.offset().left +
                parseFloat(elStyle.paddingLeft) +
                parseFloat(elStyle.borderLeft)) +
            LG(window).scrollLeft();
        let y =
            (wHeight - elHeight) / 2 -
            (LGel.offset().top +
                parseFloat(elStyle.paddingTop) +
                parseFloat(elStyle.borderTop)) +
            LG(window).scrollTop();

        const scX = elWidth / imageSize.width;
        const scY = elHeight / imageSize.height;

        return (
            'translate3d(' +
            (x *= -1) +
            'px, ' +
            (y *= -1) +
            'px, 0) scale3d(' +
            scX +
            ', ' +
            scY +
            ', 1)'
        );
    },

    getIframeMarkup(src: string, iframeMaxWidth: number | string): string {
        return `<div class="lg-video-cont lg-has-iframe" style="max-width:${iframeMaxWidth}">
                    <div class="lg-video">
                        <iframe class="lg-object" frameborder="0" src="${src}"  allowfullscreen="true"></iframe>
                    </div>
                </div>`;
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

    getVideoPosterMarkup(_poster: string, _isVideo?: VideoInfo): string {
        let videoClass = '';
        if (_isVideo && _isVideo.youtube) {
            videoClass = 'lg-has-youtube';
        } else if (_isVideo && _isVideo.vimeo) {
            videoClass = 'lg-has-vimeo';
        } else {
            videoClass = 'lg-has-html5';
        }

        return `<div class="lg-video-cont ${videoClass}"><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="${_poster}" /></div></div>`;
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
            const currentItem = LG(item);
            const alt = currentItem.find('img').first().attr('alt');
            const title = currentItem.attr('title');
            if (getCaptionFromTitleOrAlt && !dynamicEl.subHtml) {
                dynamicEl.subHtml = title || alt || '';
            }
            dynamicEl.alt = alt || title || '';
            dynamicElements.push(dynamicEl);
        });
        return dynamicElements;
    },
};

export default utils;
