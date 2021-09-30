import { $LG, lgQuery } from './lgQuery';
import { VideoSource } from './plugins/video/types';
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

export interface GalleryItem {
    /**
     * url of the media
     * @data-attr data-src
     */
    src?: string;

    /**
     * Source attributes for the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source#attributes">picture</a> element
     * @data-attr data-sources
     */
    sources?: ImageSources[];

    /**
     * Thumbnail url
     * @description By default lightGallery uses the image inside gallery selector as thumbnail.
     * But, If you want to use external image for thumbnail,
     * pass the thumbnail url via any data attribute and
     * pass the attribute name via exThumbImage option
     * @example
     * <div id="lightGallery">
     *     <a href="a.jpg" data-external-thumb-image="images/externalThumb.jpg" ><img src="thumb.jpg" /></a>
     * </div>
     *
     * lightGallery(document.getElementById('lightGallery'), {
     *     exThumbImage: 'data-external-thumb-image'
     * })
     * @data-attr data-*
     */
    thumb?: string;

    /**
     * alt attribute for the image
     * @data-attr alt
     */
    alt?: string;

    /**
     * Title attribute for the video
     * @data-attr title
     */
    title?: string;

    /**
     * Title for iframe
     * @data-attr data-iframe-title
     */
    iframeTitle?: string;

    /**
     * Caption for the slide
     * @description You can either pass the HTML markup or the ID or class name of the element which contains the captions
     * @data-attr data-sub-html
     */
    subHtml?: string;

    /**
     * url of the file which contain the sub html.
     * @description Note - Does not support Internet Explorer browser
     * @data-attr data-sub-html-url
     */
    subHtmlUrl?: string;

    /**
     * Video source
     * @data-attr data-video
     */
    video?: VideoSource;

    /**
     * Poster url
     * @data-attr data-poster
     */
    poster?: string;

    /**
     * Custom slide name to use in the url when hash plugin is enabled
     * @data-attr data-slide-name
     */
    slideName?: string;

    /**
     * List of images and viewport's max width separated by comma.
     * @description Ex?: img/1-375.jpg 375, img/1-480.jpg 480, img/1-757.jpg 757.
     * @data-attr data-responsive
     */
    responsive?: string;

    /**
     * srcset attribute values for the main image
     * @data-attr data-srcset
     */
    srcset?: string;

    /**
     * srcset sizes attribute for the main image
     * @data-attr data-sizes
     */
    sizes?: string;

    /**
     * Set true is you want to open your url in an iframe
     * @data-attr data-iframe
     */
    iframe?: boolean;

    /**
     * Download url for your image/video.
     * @description Pass false if you want to disable the download button.
     * @data-attr data-download-url
     */
    downloadUrl?: string | boolean;

    /**
     * Name of the file after it is downloaded.
     * @description The HTML value of the download attribute.
     * There are no restrictions on allowed values, and the browser will automatically
     * detect the correct file extension and add it to the file (.img, .pdf, .txt, .html, etc.).
     * <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download">More info</a>
     * @data-attr data-download
     */
    download?: string | boolean;

    /**
     * Actual size of the image in px.
     * @description This is used in zoom plugin to see the actual size of the image when double taped on the image.
     * @data-attr data-width
     */
    width?: string;

    /**
     * Facebook share URL.
     * @description Specify only if you want to provide separate share URL for the specific slide. By default, current browser URL is taken.
     * @data-attr data-facebook-share-url
     */
    facebookShareUrl?: string;

    /**
     * Tweet text
     * @data-attr data-tweet-text
     */
    tweetText?: string;

    /**
     * Twitter share URL.
     * @description Specify only if you want to provide separate share URL for the specific slide. By default, current browser URL will be taken.
     * @data-attr data-twitter-share-url
     */
    twitterShareUrl?: string;

    /**
     * Pinterest share URL.
     * @description Specify only if you want to provide separate share URL for the specific slide. By default, current browser URL will be taken.
     * Note?: Pinterest requires absolute URL
     * @data-attr data-pinterest-share-url
     */
    pinterestShareUrl?: string;

    /**
     * Description for Pinterest post.
     * @data-attr data-pinterest-text
     */
    pinterestText?: string;

    /**
     * Facebook comments body html
     * @description Please refer <a href="https://developers.facebook.com/docs/plugins/comments/#comments-plugin">facebook official documentation</a> for generating the HTML markup
     * @example
     * <div
     *      class="fb-comments"
     *      data-href="https://www.lightgalleryjs.com/demos/comment-box/#facebook-comments-demo"
     *      data-width="400"
     *      data-numposts="5">
     * </div>
     * @data-attr data-fb-html
     */
    fbHtml?: string;

    /**
     * Disqus page identifier
     * @description Please refer official <a href="https://help.disqus.com/en/articles/1717084-javascript-configuration-variables">disqus documentation</a> for more info
     * @data-attr data-disqus-identifier
     */
    disqusIdentifier?: string;

    /**
     * Disqus page url
     * @description Please refer official <a href="https://help.disqus.com/en/articles/1717084-javascript-configuration-variables">disqus documentation</a> for more info
     * @data-attr data-disqus-url
     */
    disqusUrl?: string;

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
    'download',
    'width',
    'facebookShareUrl',
    'tweetText',
    'iframeTitle',
    'twitterShareUrl',
    'pinterestShareUrl',
    'pinterestText',
    'fbHtml',
    'disqusIdentifier',
    'disqusUrl',
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
        let lgSize = LGel.attr('data-lg-size') || defaultLgSize;

        if (!lgSize) {
            return;
        }

        const isResponsiveSizes = lgSize.split(',');
        // if at-least two viewport sizes are available
        if (isResponsiveSizes[1]) {
            const wWidth = window.innerWidth;
            for (let i = 0; i < isResponsiveSizes.length; i++) {
                const size = isResponsiveSizes[i];
                const responsiveWidth = parseInt(size.split('-')[2], 10);
                if (responsiveWidth > wWidth) {
                    lgSize = size;
                    break;
                }

                // take last item as last option
                if (i === isResponsiveSizes.length - 1) {
                    lgSize = size;
                }
            }
        }

        const size = lgSize.split('-');

        const width = parseInt(size[0], 10);
        const height = parseInt(size[1], 10);

        const cWidth = container.width();
        const cHeight = container.height() - spacing;

        const maxWidth = Math.min(cWidth, width);
        const maxHeight = Math.min(cHeight, height);

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
        if (!LGel.get()) {
            return;
        }

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
        iframeWidth: string,
        iframeHeight: string,
        iframeMaxWidth: string,
        iframeMaxHeight: string,
        src?: string,
        iframeTitle?: string,
    ): string {
        const title = iframeTitle ? 'title="' + iframeTitle + '"' : '';
        return `<div class="lg-video-cont lg-has-iframe" style="width:${iframeWidth}; max-width:${iframeMaxWidth}; height: ${iframeHeight}; max-height:${iframeMaxHeight}">
                    <iframe class="lg-object" frameborder="0" ${title} src="${src}"  allowfullscreen="true"></iframe>
                </div>`;
    },

    getImgMarkup(
        index: number,
        src: string,
        altAttr: string,
        srcset?: string,
        sizes?: string,
        sources?: ImageSources[],
    ): string {
        const srcsetAttr = srcset ? `srcset="${srcset}"` : '';
        const sizesAttr = sizes ? `sizes="${sizes}"` : '';
        const imgMarkup = `<img ${altAttr} ${srcsetAttr}  ${sizesAttr} class="lg-object lg-image" data-index="${index}" src="${src}" />`;
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
        playVideoString: string,
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
                    aria-labelledby="${playVideoString}"
                    role="img"
                    class="lg-video-play-icon"
                >
                    <title>${playVideoString}</title>
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
    ): GalleryItem[] {
        const dynamicElements: GalleryItem[] = [];
        const availableDynamicOptions = [
            ...defaultDynamicOptions,
            ...extraProps,
        ];
        [].forEach.call(items, (item: HTMLElement) => {
            const dynamicEl: GalleryItem = {} as GalleryItem;
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
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    },
    /**
     * @desc Check the given src is video
     * @param {String} src
     * @return {Object} video type
     * Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
     *
     * @todo - this information can be moved to dynamicEl to avoid frequent calls
     */

    isVideo(
        src: string,
        isHTML5VIdeo: boolean,
        index: number,
    ): VideoInfo | undefined {
        if (!src) {
            if (isHTML5VIdeo) {
                return {
                    html5: true,
                };
            } else {
                console.error(
                    'lightGallery :- data-src is not provided on slide item ' +
                        (index + 1) +
                        '. Please make sure the selector property is properly configured. More info - https://www.lightgalleryjs.com/demos/html-markup/',
                );
                return;
            }
        }

        const youtube = src.match(
            /\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)([\&|?][\S]*)*/i,
        );
        const vimeo = src.match(
            /\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)(.*)?/i,
        );
        const wistia = src.match(
            /https?:\/\/(.+)?(wistia\.com|wi\.st)\/(medias|embed)\/([0-9a-z\-_]+)(.*)/,
        );

        if (youtube) {
            return {
                youtube,
            };
        } else if (vimeo) {
            return {
                vimeo,
            };
        } else if (wistia) {
            return {
                wistia,
            };
        }
    },
};

export default utils;
