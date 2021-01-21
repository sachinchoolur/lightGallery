declare global {
    interface Window {
        lgModules: any;
        lightGallery: (
            el: HTMLElement,
            options: Partial<LightGallerySettings>,
        ) => LightGallery | undefined;
    }
}

declare let picturefill: any;

import utils, { DynamicItem, ImageSize } from './lg-utils';
import { LG, lgQuery } from './lgQuery';
declare global {
    interface Window {
        LG: typeof LG;
    }
}
window.LG = LG;

// @ref - https://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio
// @ref - https://2ality.com/2017/04/setting-up-multi-platform-packages.html
import { LightGallerySettings, lightGallerySettings } from './lg-settings';

type SlideDirection = 'next' | 'prev';
export interface Coords {
    pageX: number;
    pageY: number;
}
export interface VideoInfo {
    html5?: boolean;
    youtube?: string[];
    vimeo?: string[];
    wistia?: string[];
    dailymotion?: string[];
}

let lgId = 0;
window.lgModules = window.lgModules || {};

export class LightGallery {
    public s: LightGallerySettings;
    public galleryItems: DynamicItem[];
    public lgId: number;
    public el: HTMLElement;
    public LGel: lgQuery;
    public lgOpened = false;

    public index = 0;

    // lightGallery modules
    public modules: any = {};

    // false when lightGallery load first slide content;
    public lGalleryOn = false;

    // True when a slide animation is in progress
    public lgBusy = false;

    // Type of touch action - {swipe, zoomSwipe, pinch}
    public touchAction?: 'swipe' | 'zoomSwipe' | 'pinch';

    // Direction of swipe/drag - {horizontal, vertical}
    public swipeDirection?: 'horizontal' | 'vertical';

    // Timeout function for hiding controls;
    public hideBarTimeout: any;

    public currentItemsInDom: string[] = [];

    public outer!: lgQuery;

    public items: any;

    // Scroll top value before lightGallery is opened
    private prevScrollTop = 0;

    private zoomFromImage!: boolean;
    private $backdrop!: lgQuery;
    $items: any;

    constructor(
        element: HTMLElement,
        options: Partial<LightGallerySettings> = {},
    ) {
        lgId++;
        this.lgId = lgId;

        this.el = element;
        this.LGel = LG(element);

        // lightGallery settings
        this.s = Object.assign({}, lightGallerySettings, options);
        if (
            this.s.isMobile && typeof this.s.isMobile
                ? this.s.isMobile()
                : utils.isMobile()
        ) {
            const mobileSettings = Object.assign(
                {},
                this.s.mobileSettings,
                options.mobileSettings,
            );
            this.s = Object.assign(this.s, mobileSettings);
        }

        // When using dynamic mode, ensure dynamicEl is an array
        if (
            this.s.dynamic &&
            this.s.dynamicEl !== undefined &&
            !Array.isArray(this.s.dynamicEl)
        ) {
            throw 'When using dynamic mode, you must also define dynamicEl as an Array.';
        }

        if (this.s.slideEndAnimatoin) {
            this.s.hideControlOnEnd = false;
        }

        // Need to disable zoomFromImage if gallery is opened from url (Hash plugin)
        // And reset it on close to get the correct value next time
        this.zoomFromImage = this.s.zoomFromImage;

        // Gallery items
        this.galleryItems = this.getItems();

        // At the moement, Zoom from image doesn't support dynamic options
        // @todo add zoomFromImage support for dynamic images
        if (this.s.dynamic) {
            this.zoomFromImage = false;
        }

        // s.preload should not be grater than $item.length
        this.s.preload = Math.min(this.s.preload, this.galleryItems.length);

        this.init();

        return this;
    }

    init(): void {
        this.addSlideVideoInfo(this.galleryItems);
        const fromHash = this.buildFromHash();

        let openGalleryAfter = 0;

        if (!fromHash) {
            openGalleryAfter = this.buildStructure();
        }

        if (this.s.keyPress) {
            this.keyPress();
        }

        setTimeout(() => {
            this.enableDrag();
            this.enableSwipe();
        }, 50);

        if (this.galleryItems.length > 1) {
            this.arrow();

            if (this.s.mousewheel) {
                this.mousewheel();
            }
        }

        if (this.s.dynamic) {
            const index = this.s.index || 0;

            setTimeout(() => {
                this.openGallery(index);
            }, openGalleryAfter);
        } else {
            // Using for loop instead of using bubbling as the items can be any html element.
            for (let index = 0; index < this.items.length; index++) {
                const element = this.items[index];
                // Using different namespace for click because click event should not unbind if selector is same object('this')
                // @todo manage all event listners - should have namespace that represent element
                LG(element).on(`click.lgcustom-item-${index}`, (e) => {
                    e.preventDefault();
                    const currentItemIndex = this.s.index || index;
                    let transform;
                    if (this.zoomFromImage) {
                        const imageSize = utils.getSize(element);
                        transform = utils.getTransform(element, imageSize);
                    }
                    this.openGallery(currentItemIndex, transform);
                });
            }
        }
    }

    buildModules(): number {
        // module constructor
        // Modules are build incrementally.
        // Gallery should be opened only once all the modules are initialized.
        // use moduleBuildTimeout to make sure this
        let numberOfModules = 0;
        for (const key in window.lgModules) {
            numberOfModules++;
            ((num) => {
                setTimeout(() => {
                    this.modules[key] = new window.lgModules[key](this);
                }, 10 * num);
            })(numberOfModules);
        }

        return numberOfModules * 10;
    }

    getSlideItem(index: number): lgQuery {
        return LG(this.getSlideItemId(index));
    }
    getSlideItemId(index: number): string {
        return `#lg-item-${this.lgId}-${index}`;
    }
    getById(id: string): string {
        return `${id}-${this.lgId}`;
    }

    buildStructure(): number {
        const container = (LG(
            `#${this.getById('lg-container')}`,
        ).get() as unknown) as HTMLElement;
        if (container) {
            return 0;
        }
        let controls = '';
        let subHtmlCont = '';

        // Create controls
        if (this.s.controls && this.galleryItems.length > 1) {
            controls = `<button type="button" id="${this.getById(
                'lg-prev',
            )}" aria-label="Previous slide" class="lg-prev lg-icon"> ${
                this.s.prevHtml
            } </button>
                <button type="button" id="${this.getById(
                    'lg-next',
                )}" aria-label="Next slide" class="lg-next lg-icon"> ${
                this.s.nextHtml
            } </button>`;
        }

        if (this.s.appendSubHtmlTo === '.lg-sub-html') {
            subHtmlCont =
                '<div class="lg-sub-html" role="status" aria-live="polite"></div>';
        }

        let addClasses = '';

        if (this.s.hideSubHtml) {
            // Do not remove space before last single quote
            addClasses += 'lg-hide-sub-html ';
        }

        const ariaLabelledby = this.s.ariaLabelledby
            ? 'aria-labelledby="' + this.s.ariaLabelledby + '"'
            : '';
        const ariaDescribedby = this.s.ariaDescribedby
            ? 'aria-describedby="' + this.s.ariaDescribedby + '"'
            : '';

        const containerClassName = `lg-container ${
            document.body !== this.s.container ? 'lg-inline' : ''
        }`;
        const closeIcon = this.s.showCloseIcon
            ? `<button type="button" aria-label="Close gallery" id="${this.getById(
                  'lg-close',
              )}" class="lg-close lg-icon"></button>`
            : '';
        const template = `
        <div class="${containerClassName}" id="${this.getById(
            'lg-container',
        )}" tabindex="-1" aria-modal="true" ${ariaLabelledby} ${ariaDescribedby} role="dialog"
        >
            <div id="${this.getById('lg-backdrop')}" class="lg-backdrop"></div>

            <div id="${this.getById(
                'lg-outer',
            )}" class="lg-outer lg-hide-items ${this.s.addClass} ${addClasses}">
                    <div class="lg" style="width: ${this.s.width}; height:${
            this.s.height
        }">
                        <div id="${this.getById(
                            'lg-inner',
                        )}" class="lg-inner"></div>
                        <div id="${this.getById(
                            'lg-toolbar',
                        )}" class="lg-toolbar lg-group">
                        ${closeIcon}
                    </div>
                    ${controls}
                    ${subHtmlCont}
                </div> 
            </div>
        </div>
        `;

        LG(this.s.container).css('position', 'relative').append(template);
        this.outer = LG(`#${this.getById('lg-outer')}`);
        this.$backdrop = LG(`#${this.getById('lg-backdrop')}`);

        this.$backdrop.css(
            'transition-duration',
            this.s.backdropDuration + 'ms',
        );

        if (this.s.useLeft) {
            this.outer.addClass('lg-use-left');

            // Set mode lg-slide if use left is true;
            this.s.mode = 'lg-slide';
        } else {
            this.outer.addClass('lg-use-css3');
        }

        // add Class for css support and transition mode
        if (this.doCss()) {
            this.outer.addClass('lg-css3');
        } else {
            this.outer.addClass('lg-css');

            // Set speed 0 because no animation will happen if browser doesn't support css3
            this.s.speed = 0;
        }

        this.outer.addClass(this.s.mode);

        if (this.s.enableDrag && this.galleryItems.length > 1) {
            this.outer.addClass('lg-grab');
        }

        if (this.s.showAfterLoad) {
            this.outer.addClass('lg-show-after-load');
        }

        if (this.doCss()) {
            const $inner = LG(`#${this.getById('lg-inner')}`);
            $inner.css('transition-timing-function', this.s.easing);
            $inner.css('transition-duration', this.s.speed + 'ms');
        }

        if (this.s.download) {
            this.outer
                .find('.lg-toolbar')
                .append(
                    `<a id="${this.getById(
                        'lg-download',
                    )}" target="_blank" aria-label="Download" download class="lg-download lg-icon"></a>`,
                );
        }

        this.counter();

        LG(window).on(
            `resize.lg.global${this.lgId} orientationchange.lg.global${this.lgId}`,
            () => {
                if (this.zoomFromImage && !this.s.dynamic && this.lgOpened) {
                    const imgStyle = this.getDummyImgStyles();
                    this.outer
                        .find('.lg-current .lg-dummy-img')
                        .first()
                        .attr('style', imgStyle);
                }
            },
        );

        this.hideBars();

        this.closeGallery();

        return this.buildModules();
    }

    // Append new slides dynamically while gallery is open
    // Items has to in the form of an array of dynamicEl
    appendSlides(items: DynamicItem): void {
        this.galleryItems = this.galleryItems.concat(items);
        LG(`#${this.getById('lg-counter-all')}`).html(
            this.galleryItems.length + '',
        );
        this.LGel.trigger('appendSlides.lg', { items });
    }

    // Get gallery items based on multiple conditions
    // @todo - remove this.$items
    getItems(): DynamicItem[] {
        // Gallery items
        this.items = [];
        if (!this.s.dynamic) {
            if (this.s.selector === 'this') {
                this.items.push(this.el);
            } else if (this.s.selector) {
                if (this.s.selectWithin) {
                    const selectWithin = LG(this.s.selectWithin);
                    this.items = selectWithin.find(this.s.selector).get();
                } else {
                    this.items = this.el.querySelectorAll(this.s.selector);
                }
            } else {
                this.items = this.el.children;
            }
            return utils.getDynamicOptions(
                this.items,
                this.s.extraProps,
                this.s.getCaptionFromTitleOrAlt,
                this.s.exThumbImage,
            );
        } else {
            return this.s.dynamicEl || [];
        }
    }

    /**
     * Build Gallery
     * @param {Number} index  - index of the slide
     * @param {String} transform - Css transform value when zoomFromImage is enabled
     */
    openGallery(index: number, transform?: string): void {
        // prevent accidental double execution
        if (this.lgOpened) return;

        this.lgOpened = true;
        const container = LG(`#${this.getById('lg-container')}`);
        this.outer.get().focus();
        this.outer.removeClass('lg-hide-items');

        if (!this.zoomFromImage || !transform) {
            this.outer.addClass(this.s.startClass);
        } else if (this.zoomFromImage && transform) {
            this.outer.addClass('lg-zoom-from-image');
        }

        const itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(
            index,
            index,
        );
        this.currentItemsInDom = itemsToBeInsertedToDom;

        let items = '';
        itemsToBeInsertedToDom.forEach((item) => {
            items = items + `<div id="${item}" class="lg-item"></div>`;
        });

        LG(`#${this.getById('lg-inner')}`).append(items);
        if (!this.zoomFromImage || !transform) {
            this.getSlideItem(index).removeClass('lg-complete');
        }
        this.LGel.trigger('onBeforeOpen.lg');

        // add class lg-current to remove initial transition
        this.getSlideItem(index).addClass('lg-current');

        this.lGalleryOn = false;
        setTimeout(() => {
            // Store the current scroll top value to scroll back after closing the gallery..
            this.prevScrollTop = LG(window).scrollTop();

            this.index = index;

            // Need to check both zoomFromImage and transform values as we need to set set the
            // default opening animation if user missed to add the lg-size attribute
            if (this.zoomFromImage && transform) {
                this.getSlideItem(index)
                    .addClass('start-end-progress')
                    .css('transform', transform)
                    .css(
                        'transition-duration',
                        this.s.startAnimationDuration + 'ms',
                    );
                setTimeout(() => {
                    this.getSlideItem(index).css(
                        'transform',
                        'translate3d(0, 0, 0) translate3d(0, 0, 0)',
                    );
                }, 100);
            }

            container.addClass('lg-show');
            setTimeout(() => {
                this.$backdrop.addClass('in');
                container.addClass('lg-show-in');
            }, 10);

            // lg-visible class resets gallery opacity to 1
            if (!this.zoomFromImage || !transform) {
                setTimeout(() => {
                    this.outer.addClass('lg-visible');
                }, this.s.backdropDuration);
            }

            // initiate slide function
            this.slide(index, false, false, false);

            this.LGel.trigger('onAfterOpen.lg');
        });

        LG(document.body).addClass('lg-on');
    }

    // Build Gallery if gallery id exist in the URL
    buildFromHash(): boolean | undefined {
        // if dynamic option is enabled execute immediately
        const _hash = window.location.hash;
        if (_hash.indexOf('lg=' + this.s.galleryId) > 0) {
            // This class is used to remove the initial animation if galleryId present in the URL
            LG(document.body).addClass('lg-from-hash');
            this.zoomFromImage = false;

            const index = this.getIndexFromUrl(_hash);

            const openGalleryAfter = this.buildStructure();

            setTimeout(() => {
                this.openGallery(index);
            }, openGalleryAfter);
            return true;
        }
    }

    hideBars(): void {
        // Hide controllers if mouse doesn't move for some period
        setTimeout(() => {
            this.outer.removeClass('lg-hide-items');
            if (this.s.hideBarsDelay > 0) {
                this.outer.on('mousemove.lg click.lg touchstart.lg', () => {
                    this.outer.removeClass('lg-hide-items');

                    clearTimeout(this.hideBarTimeout);

                    // Timeout will be cleared on each slide movement also
                    this.hideBarTimeout = setTimeout(() => {
                        this.outer.addClass('lg-hide-items');
                    }, this.s.hideBarsDelay);
                });
                this.outer.trigger('mousemove.lg');
            }
        }, this.s.showBarsAfter);
    }

    // Find css3 support
    doCss(): boolean {
        let supported = false;
        const transition = [
            'transition',
            'MozTransition',
            'WebkitTransition',
            'OTransition',
            'msTransition',
            'KhtmlTransition',
        ];
        const root = document.documentElement;
        for (let i = 0; i < transition.length; i++) {
            if (transition[i] in root.style) {
                supported = true;
                break;
            }
        }
        return supported;
    }

    /**
     *  @desc Create image counter
     *  Ex: 1/10
     */
    counter(): void {
        if (this.s.counter) {
            const counterHtml = `<div class="lg-counter" role="status" aria-live="polite">
                <span id="${this.getById(
                    'lg-counter-current',
                )}" class="lg-counter-current">${this.index + 1} </span> / 
                <span id="${this.getById(
                    'lg-counter-all',
                )}" class="lg-counter-all">${
                this.galleryItems.length
            } </span></div>`;
            this.outer.find(this.s.appendCounterTo).append(counterHtml);
        }
    }

    /**
     *  @desc add sub-html into the slide
     *  @param {Number} index - index of the slide
     */
    addHtml(index: number): void {
        let subHtml;
        let subHtmlUrl;
        if (this.galleryItems[index].subHtmlUrl) {
            subHtmlUrl = this.galleryItems[index].subHtmlUrl;
        } else {
            subHtml = this.galleryItems[index].subHtml;
        }

        if (!subHtmlUrl) {
            if (subHtml) {
                // get first letter of subhtml
                // if first letter starts with . or # get the html form the jQuery object
                const fL = subHtml.substring(0, 1);
                if (fL === '.' || fL === '#') {
                    if (this.s.subHtmlSelectorRelative && !this.s.dynamic) {
                        subHtml = LG(this.items)
                            .eq(index)
                            .find(subHtml)
                            .first()
                            .html();
                    } else {
                        subHtml = LG(subHtml).first().html();
                    }
                }
            } else {
                subHtml = '';
            }
        }

        if (this.s.appendSubHtmlTo === '.lg-sub-html') {
            if (subHtmlUrl) {
                this.outer.find('.lg-sub-html').load(subHtmlUrl);
            } else {
                this.outer.find('.lg-sub-html').html(subHtml as string);
            }
        } else {
            const currentSlide = LG(this.getSlideItemId(index));
            if (subHtmlUrl) {
                currentSlide.load(subHtmlUrl);
            } else {
                currentSlide.append(
                    `<div class="lg-sub-html">${subHtml}</div>`,
                );
            }
        }

        // Add lg-empty-html class if title doesn't exist
        if (typeof subHtml !== 'undefined' && subHtml !== null) {
            if (subHtml === '') {
                this.outer
                    .find(this.s.appendSubHtmlTo)
                    .addClass('lg-empty-html');
            } else {
                this.outer
                    .find(this.s.appendSubHtmlTo)
                    .removeClass('lg-empty-html');
            }
        }

        this.LGel.trigger('onAfterAppendSubHtml.lg', { index });
    }

    /**
     *  @desc Preload slides
     *  @param {Number} index - index of the slide
     * @todo preload not working for the first slide, Also, should work for the first and last slide as well
     */
    preload(index: number): void {
        for (let i = 1; i <= this.s.preload; i++) {
            if (i >= this.galleryItems.length - index) {
                break;
            }

            this.loadContent(index + i, false, false);
        }

        for (let j = 1; j <= this.s.preload; j++) {
            if (index - j < 0) {
                break;
            }

            this.loadContent(index - j, false, false);
        }
    }

    getDummyImgStyles(imageSize?: ImageSize): string {
        imageSize =
            imageSize || utils.getSize(LG(this.items).eq(this.index).get());
        if (!imageSize) return '';
        return `width:${imageSize.width}px; 
                margin-left: -${imageSize.width / 2}px;
                margin-top: -${imageSize.height / 2}px; 
                height:${imageSize.height}px`;
    }

    setImgMarkup(src: string, $currentSlide: lgQuery, index: number): void {
        // Use the thumbnail as dummy image which will be resized to actual image size and
        // displayed on top of actual image
        let _dummyImgSrc;
        let imgContnet = '';
        let imageSize;
        let $currentItem;
        if (!this.s.dynamic) {
            $currentItem = LG(this.items).eq(index);
            imageSize = utils.getSize($currentItem.get());
        }
        const currentDynamicItem = this.galleryItems[index];
        const alt = currentDynamicItem.alt
            ? 'alt="' + currentDynamicItem.alt + '"'
            : '';

        if (!this.lGalleryOn && this.zoomFromImage && imageSize) {
            if (imageSize && $currentItem) {
                if (!this.s.exThumbImage) {
                    _dummyImgSrc = $currentItem.find('img').first().attr('src');
                } else {
                    _dummyImgSrc = $currentItem.attr(this.s.exThumbImage);
                }
                const imgStyle = this.getDummyImgStyles(imageSize);
                const dummyImgContent = `<img ${alt} style="${imgStyle}" class="lg-dummy-img" src="${_dummyImgSrc}" />`;

                $currentSlide.addClass('lg-first-slide');

                imgContnet = dummyImgContent;
            }
        } else {
            imgContnet = ` <img ${alt} class="lg-object lg-image" data-index="${index}" src="${src}" /> `;
        }
        const imgMarkup = `<div class="lg-img-wrap"> ${imgContnet}</div>`;
        $currentSlide.prepend(imgMarkup);
    }

    onLgObjectLoad(
        $el: lgQuery,
        index: number,
        delay: number,
        speed: number,
        dummyImageLoaded: boolean,
    ): void {
        if (dummyImageLoaded) {
            this.LGel.trigger('onSlideItemLoad.lg', {
                index,
                delay: delay || 0,
            });
        }
        $el.find('.lg-object')
            .first()
            .on('load.lg error.lg', () => {
                this.handleLgObjectLoad(
                    $el,
                    index,
                    delay,
                    speed,
                    dummyImageLoaded,
                );
            });
    }
    handleLgObjectLoad(
        $el: lgQuery,
        index: number,
        delay: number,
        speed: number,
        dummyImageLoaded: boolean,
    ): void {
        setTimeout(() => {
            $el.addClass('lg-complete lg-complete_');
            if (!dummyImageLoaded) {
                this.LGel.trigger('onSlideItemLoad.lg', {
                    index,
                    delay: delay || 0,
                });
            }
        }, speed);
    }

    /**
     * @desc Check the given src is video
     * @param {String} src
     * @return {Object} video type
     * Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
     *
     * @todo - this information can be moved to dynamicEl to avoid frequent calls
     */
    isVideo(src: string, index: number): VideoInfo | undefined {
        if (!src) {
            if (this.galleryItems[index].video) {
                return {
                    html5: true,
                };
            } else {
                console.error(
                    'lightGallery :- data-src is not provided on slide item ' +
                        (index + 1) +
                        '. Please make sure the selector property is properly configured. More info - http://sachinchoolur.github.io/lightGallery/demos/html-markup.html',
                );
                return;
            }
        }

        const youtube = src.match(
            /\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i,
        );
        const vimeo = src.match(
            /\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)/i,
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
    }

    // Add video slideInfo
    addSlideVideoInfo(items: DynamicItem[]): void {
        items.forEach((element, index) => {
            element.__slideVideoInfo = this.isVideo(element.src, index);
        });
    }

    /**
     *  @desc Load slide content into slide.
     *  @param {Number} index - index of the slide.
     *  @param {Boolean} rec - if true call loadcontent() function again.
     *  @param {Boolean} firstSlide - For setting the delay.
     */
    loadContent(index: number, rec: boolean, firstSlide: boolean): void {
        let $img;
        const currentDynamicItem = this.galleryItems[index];
        const $currentSlide = LG(this.getSlideItemId(index));

        const { poster, srcset, sizes } = currentDynamicItem;
        let { src } = currentDynamicItem;

        const _html5Video =
            currentDynamicItem.video && JSON.parse(currentDynamicItem.video);

        if (currentDynamicItem.responsive) {
            const srcDyItms = currentDynamicItem.responsive.split(',');
            src = utils.getResponsiveSrc(srcDyItms) || src;
        }

        const iframe = !!currentDynamicItem.iframe;

        let imageSize;
        if (!this.s.dynamic) {
            const $currentItem = this.items[index];
            imageSize = utils.getSize($currentItem);
        }

        const videoInfo = currentDynamicItem.__slideVideoInfo;

        if (!$currentSlide.hasClass('lg-loaded')) {
            if (iframe) {
                const markup = utils.getIframeMarkup(
                    src,
                    this.s.iframeMaxWidth,
                );
                $currentSlide.prepend(markup);
            } else if (poster) {
                const markup = utils.getVideoPosterMarkup(poster, videoInfo);
                $currentSlide.prepend(markup);
                this.LGel.trigger('hasVideo.lg', {
                    index,
                    src: src,
                    html5Video: _html5Video,
                    hasPoster: true,
                });
            } else if (videoInfo) {
                const markup =
                    '<div class="lg-video-cont "><div class="lg-video"></div></div>';
                $currentSlide.prepend(markup);
                this.LGel.trigger('hasVideo.lg', {
                    index,
                    src: src,
                    html5Video: _html5Video,
                    hasPoster: false,
                });
            } else {
                this.setImgMarkup(src, $currentSlide, index);
            }

            this.LGel.trigger('onAferAppendSlide.lg', { index });

            $img = $currentSlide.find('.lg-object');
            if (sizes) {
                $img.attr('sizes', sizes);
            }

            if (srcset) {
                $img.attr('srcset', srcset);
                if (this.s.supportLegacyBrowser) {
                    try {
                        picturefill({
                            elements: [$img.get()],
                        });
                    } catch (e) {
                        console.warn(
                            'lightGallery :- If you want srcset to be supported for older browser please include picturefil javascript library in your document.',
                        );
                    }
                }
            }

            if (this.s.appendSubHtmlTo !== '.lg-sub-html') {
                this.addHtml(index);
            }
        }

        // For first time add some delay for displaying the start animation.
        let _speed = 0;

        // delay for adding complete class. it is 0 except first time.
        let delay = 0;
        if (firstSlide) {
            if (this.zoomFromImage && imageSize) {
                delay = this.s.startAnimationDuration + 10;
            } else {
                delay = this.s.backdropDuration + 10;
            }
        }

        // Do not change the delay value because it is required for zoom plugin.
        // If gallery opened from direct url (hash) speed value should be 0
        if (delay && !LG(document.body).hasClass('lg-from-hash')) {
            _speed = delay;
        }

        // Only for first slide
        if (!this.lGalleryOn && this.zoomFromImage && imageSize) {
            setTimeout(() => {
                $currentSlide
                    .removeClass('start-end-progress')
                    .removeAttr('style');
            }, this.s.startAnimationDuration + 100);
            if (!$currentSlide.hasClass('lg-loaded')) {
                setTimeout(() => {
                    $currentSlide
                        .find('.lg-img-wrap')
                        .append(
                            `<img class="lg-object lg-image" data-index="${index}" src="${src}" />`,
                        );
                    this.onLgObjectLoad(
                        $currentSlide,
                        index,
                        delay,
                        _speed,
                        true,
                    );
                    $currentSlide
                        .find('.lg-object')
                        .first()
                        .on('load.lg error.lg', () => {
                            this.loadContentOnLoad(
                                index,
                                $currentSlide,
                                _speed,
                            );
                        });
                }, this.s.startAnimationDuration + 100);
            }
        }

        // SLide content has been added to dom
        $currentSlide.addClass('lg-loaded');
        this.onLgObjectLoad($currentSlide, index, delay, _speed, false);

        // @todo check load state for html5 videos
        if (videoInfo && videoInfo.html5 && !poster) {
            $currentSlide.addClass('lg-complete lg-complete_');
        }

        // When gallery is opened once content is loaded (second time) need to add lg-complete class for css styling
        if (
            (!this.zoomFromImage || !imageSize) &&
            $currentSlide.hasClass('lg-complete_') &&
            firstSlide
        ) {
            setTimeout(() => {
                $currentSlide.addClass('lg-complete');
            }, this.s.backdropDuration);
        }

        // Content loaded
        // Need to set lGalleryOn before calling preload function
        this.lGalleryOn = true;

        if (rec === true) {
            if (!$currentSlide.hasClass('lg-complete_')) {
                $currentSlide
                    .find('.lg-object')
                    .first()
                    .on('load.lg error.lg', () => {
                        this.preload(index);
                    });
            } else {
                this.preload(index);
            }
        }
    }

    loadContentOnLoad(
        index: number,
        $currentSlide: lgQuery,
        speed: number,
    ): void {
        setTimeout(() => {
            $currentSlide.find('.lg-dummy-img').remove();
            $currentSlide.removeClass('lg-first-slide');
            this.preload(index);
        }, speed + 300);
    }

    getItemsToBeInsertedToDom(
        index: number,
        prevIndex: number,
        numberOfItems = 0,
    ): string[] {
        const itemsToBeInsertedToDom: string[] = [];
        // Minimum 2 items should be there
        let possibleNumberOfItems = Math.max(numberOfItems, 3);
        possibleNumberOfItems = Math.min(
            possibleNumberOfItems,
            this.galleryItems.length,
        );
        const prevIndexItem = `lg-item-${this.lgId}-${prevIndex}`;
        if (this.galleryItems.length <= 3) {
            this.galleryItems.forEach((element, index) => {
                itemsToBeInsertedToDom.push(`lg-item-${this.lgId}-${index}`);
            });
            return itemsToBeInsertedToDom;
        }

        if (index < (this.galleryItems.length - 1) / 2) {
            for (
                let idx = index;
                idx > index - possibleNumberOfItems / 2 && idx >= 0;
                idx--
            ) {
                itemsToBeInsertedToDom.push(`lg-item-${this.lgId}-${idx}`);
            }
            const numberOfExistingItems = itemsToBeInsertedToDom.length;
            for (
                let idx = 0;
                idx < possibleNumberOfItems - numberOfExistingItems;
                idx++
            ) {
                itemsToBeInsertedToDom.push(
                    `lg-item-${this.lgId}-${index + idx + 1}`,
                );
            }
        } else {
            for (
                let idx = index;
                idx <= this.galleryItems.length - 1 &&
                idx < index + possibleNumberOfItems / 2;
                idx++
            ) {
                itemsToBeInsertedToDom.push(`lg-item-${this.lgId}-${idx}`);
            }
            const numberOfExistingItems = itemsToBeInsertedToDom.length;
            for (
                let idx = 0;
                idx < possibleNumberOfItems - numberOfExistingItems;
                idx++
            ) {
                itemsToBeInsertedToDom.push(
                    `lg-item-${this.lgId}-${index - idx - 1}`,
                );
            }
        }
        if (this.s.loop) {
            if (index === this.galleryItems.length - 1) {
                itemsToBeInsertedToDom.push(`lg-item-${this.lgId}-${0}`);
            } else if (index === 0) {
                itemsToBeInsertedToDom.push(
                    `lg-item-${this.lgId}-${this.galleryItems.length - 1}`,
                );
            }
        }
        if (itemsToBeInsertedToDom.indexOf(prevIndexItem) === -1) {
            itemsToBeInsertedToDom.push(`lg-item-${this.lgId}-${prevIndex}`);
        }

        return itemsToBeInsertedToDom;
    }

    organizeSlideItems(index: number, prevIndex: number): string[] {
        const itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(
            index,
            prevIndex,
            this.s.numberOfSlideItemsInDom,
        );

        itemsToBeInsertedToDom.forEach((item) => {
            if (this.currentItemsInDom.indexOf(item) === -1) {
                LG(`#${this.getById('lg-inner')}`).append(
                    `<div id="${item}" class="lg-item"></div>`,
                );
            }
        });

        this.currentItemsInDom.forEach((item) => {
            if (itemsToBeInsertedToDom.indexOf(item) === -1) {
                LG(`#${item}`).remove();
            }
        });
        return itemsToBeInsertedToDom;
    }

    /**
     * Get previous index of the slide
     */
    getPreviousSlideIndex(): number {
        let prevIndex = 0;
        try {
            const currentItemId = this.outer
                .find('.lg-current')
                .first()
                .attr('id');
            prevIndex = parseInt(currentItemId.split('-')[3]) || 0;
        } catch (error) {
            prevIndex = 0;
        }
        return prevIndex;
    }

    setDownloadValue(index: number): void {
        if (this.s.download) {
            const currentGalleryItem = this.galleryItems[index];
            const src =
                currentGalleryItem.downloadUrl !== false &&
                (currentGalleryItem.downloadUrl || currentGalleryItem.src);

            if (src) {
                LG(`#${this.getById('lg-download')}`).attr('href', src);
                this.outer.removeClass('lg-hide-download');
            } else {
                this.outer.addClass('lg-hide-download');
            }
        }
    }

    makeSlideAnimation(
        direction: 'next' | 'prev',
        currentSlideItem: lgQuery,
        previousSlideItem: lgQuery,
    ): void {
        // remove all transitions
        this.outer.addClass('lg-no-trans');

        this.outer.find('.lg-item').removeClass('lg-prev-slide lg-next-slide');

        if (direction === 'prev') {
            //prevslide
            currentSlideItem.addClass('lg-prev-slide');
            previousSlideItem.addClass('lg-next-slide');
        } else {
            // next slide
            currentSlideItem.addClass('lg-next-slide');
            previousSlideItem.addClass('lg-prev-slide');
        }

        // give 50 ms for browser to add/remove class
        setTimeout(() => {
            this.outer.find('.lg-item').removeClass('lg-current');

            currentSlideItem.addClass('lg-current');

            // reset all transitions
            this.outer.removeClass('lg-no-trans');
        }, 50);
    }

    /**
    *   @desc slide function for lightgallery
        ** Slide() gets call on start
        ** ** Set lg.on true once slide() function gets called.
        ** Call loadContent() on slide() function inside setTimeout
        ** ** On first slide we do not want any animation like slide of fade
        ** ** So on first slide( if lg.on if false that is first slide) loadContent() should start loading immediately
        ** ** Else loadContent() should wait for the transition to complete.
        ** ** So set timeout s.speed + 50
    <=> ** loadContent() will load slide content in to the particular slide
        ** ** It has recursion (rec) parameter. if rec === true loadContent() will call preload() function.
        ** ** preload will execute only when the previous slide is fully loaded (images iframe)
        ** ** avoid simultaneous image load
    <=> ** Preload() will check for s.preload value and call loadContent() again accoring to preload value
        ** loadContent()  <====> Preload();
    
    *   @param {Number} index - index of the slide
    *   @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
    *   @param {Boolean} fromThumb - true if slide function called via thumbnail click
    *   @param {String} direction - Direction of the slide(next/prev)
    */
    slide(
        index: number,
        fromTouch: boolean,
        fromThumb: boolean,
        direction?: SlideDirection | false,
    ): void {
        const prevIndex = this.getPreviousSlideIndex();
        this.currentItemsInDom = this.organizeSlideItems(index, prevIndex);

        // Prevent multiple call, Required for hsh plugin
        if (this.lGalleryOn && prevIndex === index) {
            return;
        }

        const numberOfGalleryItems = this.galleryItems.length;

        if (!this.lgBusy) {
            this.setDownloadValue(index);

            LG(this.el).trigger('onBeforeSlide.lg', {
                prevIndex,
                index,
                fromTouch,
                fromThumb,
            });

            this.lgBusy = true;

            clearTimeout(this.hideBarTimeout);

            // Add title if this.s.appendSubHtmlTo === lg-sub-html
            if (this.s.appendSubHtmlTo === '.lg-sub-html') {
                // wait for slide animation to complete
                setTimeout(
                    () => {
                        this.addHtml(index);
                    },
                    this.lGalleryOn ? this.s.speed + 50 : 50,
                );
            }

            if (this.s.counter) {
                LG(`#${this.getById('lg-counter-current')}`).html(
                    index + 1 + '',
                );
            }

            this.arrowDisable(index);

            if (!direction) {
                if (index < prevIndex) {
                    direction = 'prev';
                } else if (index > prevIndex) {
                    direction = 'next';
                }
            }

            const currentSlideItem = this.getSlideItem(index);
            const previousSlideItem = this.getSlideItem(prevIndex);

            if (!fromTouch) {
                this.makeSlideAnimation(
                    direction as SlideDirection,
                    currentSlideItem,
                    previousSlideItem,
                );
            } else {
                this.outer
                    .find('.lg-item')
                    .removeClass('lg-prev-slide lg-current lg-next-slide');
                let touchPrev;
                let touchNext;
                if (numberOfGalleryItems > 2) {
                    touchPrev = index - 1;
                    touchNext = index + 1;

                    if (index === 0 && prevIndex === numberOfGalleryItems - 1) {
                        // next slide
                        touchNext = 0;
                        touchPrev = numberOfGalleryItems - 1;
                    } else if (
                        index === numberOfGalleryItems - 1 &&
                        prevIndex === 0
                    ) {
                        // prev slide
                        touchNext = 0;
                        touchPrev = numberOfGalleryItems - 1;
                    }
                } else {
                    touchPrev = 0;
                    touchNext = 1;
                }

                if (direction === 'prev') {
                    this.getSlideItem(touchNext).addClass('lg-next-slide');
                } else {
                    this.getSlideItem(touchPrev).addClass('lg-prev-slide');
                }

                currentSlideItem.addClass('lg-current');
            }

            setTimeout(
                () => {
                    this.loadContent(index, true, false);
                },
                this.lGalleryOn ? this.s.speed + 50 : 50,
            );
            setTimeout(
                () => {
                    this.lgBusy = false;
                    this.LGel.trigger('onAfterSlide.lg', {
                        prevIndex: prevIndex,
                        index,
                        fromTouch,
                        fromThumb,
                    });
                },
                this.lGalleryOn ? this.s.speed + 100 : 100,
            );
        }

        this.index = index;
    }

    touchMove(startCoords: Coords, endCoords: Coords): void {
        const distanceX = endCoords.pageX - startCoords.pageX;
        const distanceY = endCoords.pageY - startCoords.pageY;
        let allowSwipe = false;

        if (this.swipeDirection) {
            allowSwipe = true;
        } else {
            if (Math.abs(distanceX) > 15) {
                this.swipeDirection = 'horizontal';
                allowSwipe = true;
            } else if (Math.abs(distanceY) > 15) {
                this.swipeDirection = 'vertical';
                allowSwipe = true;
            }
        }

        if (!allowSwipe) {
            return;
        }

        const $currentSlide = this.getSlideItem(this.index);

        if (this.swipeDirection === 'horizontal') {
            // reset opacity and transition duration
            this.outer.addClass('lg-dragging');

            // move current slide
            this.setTranslate($currentSlide, distanceX, 0);

            // move next and prev slide with current slide
            const width = $currentSlide.get().offsetWidth;
            const slideWidthAmount = (width * 15) / 100;
            const gutter = slideWidthAmount - Math.abs((distanceX * 10) / 100);
            this.setTranslate(
                this.outer.find('.lg-prev-slide').first(),
                -width + distanceX - gutter,
                0,
            );

            this.setTranslate(
                this.outer.find('.lg-next-slide').first(),
                width + distanceX + gutter,
                0,
            );
        } else if (this.swipeDirection === 'vertical') {
            if (this.s.swipeToClose) {
                const container = LG(`#${this.getById('lg-container')}`);
                container.addClass('lg-dragging-vertical');

                const opacity = 1 - Math.abs(distanceY) / window.innerHeight;
                this.$backdrop.css('opacity', opacity);

                const scale = 1 - Math.abs(distanceY) / (window.innerWidth * 2);
                this.setTranslate($currentSlide, 0, distanceY, scale, scale);
                this.outer.addClass('lg-hide-items lg-swipe-closing');
            }
        }
    }

    touchEnd(endCoords: Coords, startCoords: Coords): void {
        let distance;

        // keep slide animation for any mode while dragg/swipe
        if (this.s.mode !== 'lg-slide') {
            this.outer.addClass('lg-slide');
        }

        // set transition duration
        setTimeout(() => {
            const container = LG(`#${this.getById('lg-container')}`);

            container.removeClass('lg-dragging-vertical');
            this.outer.removeClass(
                'lg-dragging lg-hide-items lg-swipe-closing',
            );

            let triggerClick = true;

            if (this.swipeDirection === 'horizontal') {
                distance = endCoords.pageX - startCoords.pageX;
                const distanceAbs = Math.abs(
                    endCoords.pageX - startCoords.pageX,
                );
                if (distance < 0 && distanceAbs > this.s.swipeThreshold) {
                    this.goToNextSlide(true);
                    triggerClick = false;
                } else if (
                    distance > 0 &&
                    distanceAbs > this.s.swipeThreshold
                ) {
                    this.goToPrevSlide(true);
                    triggerClick = false;
                }
            } else if (this.swipeDirection === 'vertical') {
                distance = Math.abs(endCoords.pageY - startCoords.pageY);
                if (this.s.closable && this.s.swipeToClose && distance > 100) {
                    this.destroy();
                    return;
                } else {
                    this.$backdrop.css('opacity', 1);
                }
            }
            this.outer.find('.lg-item').removeAttr('style');

            if (
                triggerClick &&
                Math.abs(endCoords.pageX - startCoords.pageX) < 5
            ) {
                // Trigger click if distance is less than 5 pix
                this.LGel.trigger('onSlideClick.lg');
            }

            this.swipeDirection = undefined;
        });

        // remove slide class once drag/swipe is completed if mode is not slide
        setTimeout(() => {
            if (
                !this.outer.hasClass('lg-dragging') &&
                this.s.mode !== 'lg-slide'
            ) {
                this.outer.removeClass('lg-slide');
            }
        }, this.s.speed + 100);
    }

    enableSwipe(): void {
        let startCoords: Coords = {} as Coords;
        let endCoords: Coords = {} as Coords;
        let isMoved = false;
        let isSwiping = false;
        const inner = LG(`#${this.getById('lg-inner')}`);

        if (this.s.enableSwipe && this.doCss()) {
            inner.on('touchstart.lg', (e) => {
                e.preventDefault();
                const $item = this.getSlideItem(this.index);
                if (
                    (LG(e.target).hasClass('lg-item') ||
                        $item.get().contains(e.target)) &&
                    !this.outer.hasClass('lg-zoomed') &&
                    !this.lgBusy &&
                    e.targetTouches.length === 1
                ) {
                    isSwiping = true;
                    this.touchAction = 'swipe';
                    this.manageSwipeClass();
                    startCoords = {
                        pageX: e.targetTouches[0].pageX,
                        pageY: e.targetTouches[0].pageY,
                    };
                }
            });

            inner.on('touchmove.lg', (e) => {
                e.preventDefault();
                if (
                    isSwiping &&
                    this.touchAction === 'swipe' &&
                    e.targetTouches.length === 1
                ) {
                    endCoords = {
                        pageX: e.targetTouches[0].pageX,
                        pageY: e.targetTouches[0].pageY,
                    };
                    this.touchMove(startCoords, endCoords);
                    isMoved = true;
                }
            });

            inner.on('touchend.lg', () => {
                if (this.touchAction === 'swipe') {
                    if (isMoved) {
                        isMoved = false;
                        this.touchEnd(endCoords, startCoords);
                    } else if (isSwiping) {
                        this.LGel.trigger('onSlideClick.lg');
                    }
                    this.touchAction = undefined;
                    isSwiping = false;
                }
            });
        }
    }

    enableDrag(): void {
        let startCoords: Coords = {} as Coords;
        let endCoords: Coords = {} as Coords;
        let isDraging = false;
        let isMoved = false;
        if (this.s.enableDrag && this.doCss()) {
            this.outer.on('mousedown.lg', (e) => {
                const $item = this.getSlideItem(this.index);
                if (
                    LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target)
                ) {
                    if (!this.outer.hasClass('lg-zoomed') && !this.lgBusy) {
                        e.preventDefault();
                        if (!this.lgBusy) {
                            this.manageSwipeClass();
                            startCoords = {
                                pageX: e.pageX,
                                pageY: e.pageY,
                            };
                            isDraging = true;

                            // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                            this.outer.get().scrollLeft += 1;
                            this.outer.get().scrollLeft -= 1;

                            // *

                            this.outer
                                .removeClass('lg-grab')
                                .addClass('lg-grabbing');

                            this.LGel.trigger('onDragstart.lg');
                        }
                    }
                }
            });

            LG(window).on(`mousemove.lg.global${this.lgId}`, (e) => {
                if (isDraging && this.lgOpened) {
                    isMoved = true;
                    endCoords = {
                        pageX: e.pageX,
                        pageY: e.pageY,
                    };
                    this.touchMove(startCoords, endCoords);
                    this.LGel.trigger('onDragmove.lg');
                }
            });

            LG(window).on(`mouseup.lg.global${this.lgId}`, (e) => {
                if (!this.lgOpened) {
                    return;
                }
                const target = LG(e.target);
                if (isMoved) {
                    isMoved = false;
                    this.touchEnd(endCoords, startCoords);
                    this.LGel.trigger('onDragend.lg');
                } else if (
                    target.hasClass('lg-object') ||
                    target.hasClass('lg-video-play')
                ) {
                    this.LGel.trigger('onSlideClick.lg');
                }

                // Prevent execution on click
                if (isDraging) {
                    isDraging = false;
                    this.outer.removeClass('lg-grabbing').addClass('lg-grab');
                }
            });
        }
    }

    manageSwipeClass(): void {
        let _touchNext = this.index + 1;
        let _touchPrev = this.index - 1;
        if (this.s.loop && this.galleryItems.length > 2) {
            if (this.index === 0) {
                _touchPrev = this.galleryItems.length - 1;
            } else if (this.index === this.galleryItems.length - 1) {
                _touchNext = 0;
            }
        }

        this.outer.find('.lg-item').removeClass('lg-next-slide lg-prev-slide');
        if (_touchPrev > -1) {
            this.getSlideItem(_touchPrev).addClass('lg-prev-slide');
        }

        this.getSlideItem(_touchNext).addClass('lg-next-slide');
    }

    /**
     *  @desc Go to next slide
     *  @param {Boolean} fromTouch - true if slide function called via touch event
     */
    goToNextSlide(fromTouch?: boolean): void {
        let _loop = this.s.loop;
        if (fromTouch && this.galleryItems.length < 3) {
            _loop = false;
        }

        if (!this.lgBusy) {
            if (this.index + 1 < this.galleryItems.length) {
                this.index++;
                this.LGel.trigger('onBeforeNextSlide.lg', {
                    index: this.index,
                });
                this.slide(this.index, !!fromTouch, false, 'next');
            } else {
                if (_loop) {
                    this.index = 0;
                    this.LGel.trigger('onBeforeNextSlide.lg', {
                        index: this.index,
                    });
                    this.slide(this.index, !!fromTouch, false, 'next');
                } else if (this.s.slideEndAnimatoin && !fromTouch) {
                    this.outer.addClass('lg-right-end');
                    setTimeout(() => {
                        this.outer.removeClass('lg-right-end');
                    }, 400);
                }
            }
        }
    }

    /**
     *  @desc Go to previous slide
     *  @param {Boolean} fromTouch - true if slide function called via touch event
     */
    goToPrevSlide(fromTouch?: boolean): void {
        let _loop = this.s.loop;
        if (fromTouch && this.galleryItems.length < 3) {
            _loop = false;
        }

        if (!this.lgBusy) {
            if (this.index > 0) {
                this.index--;
                this.LGel.trigger('onBeforePrevSlide.lg', {
                    index: this.index,
                    fromTouch,
                });
                this.slide(this.index, !!fromTouch, false, 'prev');
            } else {
                if (_loop) {
                    this.index = this.galleryItems.length - 1;
                    this.LGel.trigger('onBeforePrevSlide.lg', {
                        index: this.index,
                        fromTouch,
                    });
                    this.slide(this.index, !!fromTouch, false, 'prev');
                } else if (this.s.slideEndAnimatoin && !fromTouch) {
                    this.outer.addClass('lg-left-end');
                    setTimeout(() => {
                        this.outer.removeClass('lg-left-end');
                    }, 400);
                }
            }
        }
    }

    keyPress(): void {
        LG(window).on(`keydown.lg.global${this.lgId}`, (e) => {
            if (this.lgOpened && this.s.escKey === true && e.keyCode === 27) {
                e.preventDefault();
                if (!this.outer.hasClass('lg-thumb-open')) {
                    this.destroy();
                } else {
                    this.outer.removeClass('lg-thumb-open');
                }
            }
            if (this.lgOpened && this.galleryItems.length > 1) {
                if (e.keyCode === 37) {
                    e.preventDefault();
                    this.goToPrevSlide();
                }

                if (e.keyCode === 39) {
                    e.preventDefault();
                    this.goToNextSlide();
                }
            }
        });
    }

    arrow(): void {
        LG(`#${this.getById('lg-prev')}`).on('click.lg', () => {
            this.goToPrevSlide();
        });
        LG(`#${this.getById('lg-next')}`).on('click.lg', () => {
            this.goToNextSlide();
        });
    }

    arrowDisable(index: number): void {
        // Disable arrows if s.hideControlOnEnd is true
        if (!this.s.loop && this.s.hideControlOnEnd) {
            const $prev = LG(`#${this.getById('lg-prev')}`);
            const $next = LG(`#${this.getById('lg-next')}`);
            if (index + 1 < this.galleryItems.length) {
                $prev.removeAttr('disabled').removeClass('disabled');
            } else {
                $prev.attr('disabled', 'disabled').addClass('disabled');
            }

            if (index > 0) {
                $next.removeAttr('disabled').removeClass('disabled');
            } else {
                $next.attr('disabled', 'disabled').addClass('disabled');
            }
        }
    }

    /**
     * Get index of the slide from custom slideName. Has to be a public method. Used in hash plugin
     * @param {String} hash
     * @returns {Number} Index of the slide.
     */
    getIndexFromUrl(hash = window.location.hash): number {
        const slideName = hash.split('&slide=')[1];
        let _idx = 0;

        if (this.s.customSlideName) {
            for (let index = 0; index < this.galleryItems.length; index++) {
                const dynamicEl = this.galleryItems[index];
                if (dynamicEl.slideName === slideName) {
                    _idx = index;
                    break;
                }
            }
        } else {
            _idx = parseInt(slideName, 10);
        }

        return isNaN(_idx) ? 0 : _idx;
    }

    setTranslate(
        $el: lgQuery,
        xValue: number,
        yValue: number,
        scaleX = 1,
        scaleY = 1,
    ): void {
        // jQuery supports Automatic CSS prefixing since version 1.8.0
        if (this.s.useLeft) {
            $el.css('left', xValue + '');
        } else {
            $el.css(
                'transform',
                'translate3d(' +
                    xValue +
                    'px, ' +
                    yValue +
                    'px, 0px) scale3d(' +
                    scaleX +
                    ', ' +
                    scaleY +
                    ', 1)',
            );
        }
    }

    mousewheel(): void {
        this.outer.on('mousewheel.lg', (e) => {
            if (!e.deltaY) {
                return;
            }

            if (e.deltaY > 0) {
                this.goToPrevSlide();
            } else {
                this.goToNextSlide();
            }

            e.preventDefault();
        });
    }

    closeGallery(): void {
        if (!this.s.closable) return;
        let mousedown = false;
        LG(`#${this.getById('lg-close')}`).on('click.lg', () => {
            this.destroy();
        });

        if (this.s.closeOnTap) {
            // If you drag the slide and release outside gallery gets close on chrome
            // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
            this.outer.on('mousedown.lg', (e) => {
                const target = LG(e.target);
                if (
                    target.hasClass('lg-outer') ||
                    target.hasClass('lg-item') ||
                    target.hasClass('lg-img-wrap')
                ) {
                    mousedown = true;
                } else {
                    mousedown = false;
                }
            });

            this.outer.on('mousemove.lg', () => {
                mousedown = false;
            });

            this.outer.on('mouseup.lg', (e) => {
                const target = LG(e.target);
                if (
                    target.hasClass('lg-outer') ||
                    target.hasClass('lg-item') ||
                    (target.hasClass('lg-img-wrap') && mousedown)
                ) {
                    if (!this.outer.hasClass('lg-dragging')) {
                        this.destroy();
                    }
                }
            });
        }
    }

    destroy(clear?: boolean): void {
        if (!clear && !this.s.closable) {
            return;
        }
        if (!clear) {
            this.LGel.trigger('onBeforeClose.lg');
            LG(window).scrollTop(this.prevScrollTop);
        }

        let transform: string | undefined;
        if (!this.s.dynamic) {
            const imageSize = utils.getSize(this.items[this.index]);
            transform = utils.getTransform(this.items[this.index], imageSize);
        }
        if (this.zoomFromImage && transform) {
            this.outer.addClass('lg-closing lg-zoom-from-image');
            this.getSlideItem(this.index)
                .addClass('start-end-progress')
                .css(
                    'transition-duration',
                    this.s.startAnimationDuration + 'ms',
                )
                .css('transform', transform);
        } else {
            this.outer.addClass('lg-hide-items');
            // lg-zoom-from-image is used for setting the opacity to 1 if zoomFromImage is true
            // If the closing item doesn't have the lg-size attribute, remove this class to avoid the closing css conflicts
            this.outer.removeClass('lg-zoom-from-image');
        }
        /**
         * if d is false or undefined destroy will only close the gallery
         * plugins instance remains with the element
         *
         * if d is true destroy will completely remove the plugin
         */

        // Unbind all events added by lightGallery
        // @todo
        //this.$el.off('.lg.tm');

        for (const key in this.modules) {
            if (this.modules[key]) {
                try {
                    this.modules[key].destroy(clear);
                } catch (err) {
                    console.warn(
                        `lightGallery:- make sure lightGallery ${key} module is properly destroyed`,
                    );
                }
            }
        }

        if (clear) {
            if (!this.s.dynamic) {
                // only when not using dynamic mode is $items a jquery collection
                for (let index = 0; index < this.items.length; index++) {
                    const element = this.items[index];

                    // Using different namespace for click because click event should not unbind if selector is same object('this')
                    LG(element).off(`click.lgcustom-item-${index}`);
                }
            }
            LG(window).off(`.lg.global${this.lgId}`);
            this.LGel.off('.lg');
        }

        this.lGalleryOn = false;
        this.zoomFromImage = this.s.zoomFromImage;

        clearTimeout(this.hideBarTimeout);
        this.hideBarTimeout = false;
        LG(document.body).removeClass('lg-on lg-from-hash');

        this.outer.removeClass('lg-visible');

        // Resetting opacity to 0 isd required as  vertical swipe to close function adds inline opacity.
        this.$backdrop.removeClass('in').css('opacity', 0);

        const removeTimeout =
            this.zoomFromImage && transform
                ? Math.max(
                      this.s.startAnimationDuration,
                      this.s.backdropDuration,
                  )
                : this.s.backdropDuration;
        LG(`#${this.getById('lg-container')}`).removeClass('lg-show-in');

        // Once the closign animation is completed and gallery is invisible
        setTimeout(() => {
            if (this.zoomFromImage && transform) {
                this.outer.removeClass('lg-zoom-from-image');
            }
            LG(`#${this.getById('lg-container')}`).removeClass('lg-show');

            // Need to remove inline opacity as it is used in the stylesheet as well
            this.$backdrop
                .removeAttr('style')
                .css('transition-duration', this.s.backdropDuration + 'ms');

            this.outer.removeClass(`lg-closing ${this.s.startClass}`);

            this.getSlideItem(this.index).removeClass('start-end-progress');
            LG(`#${this.getById('lg-inner')}`).empty();

            if (clear) {
                LG(`#${this.getById('lg-container')}`).remove();
            }
            if (!clear) {
                this.LGel.trigger('onCloseAfter.lg');
            }
            this.LGel.get().focus();

            this.lgOpened = false;
        }, removeTimeout + 100);
    }
}

// $.fn.lightGallery = function (options) {
//     return this.each(function () {
//         if (!$.data(this, 'lightGallery')) {
//             $.data(this, 'lightGallery', new LightGallery(this, options));
//         } else {
//             try {
//                 $(this).data('lightGallery').init();
//             } catch (err) {
//                 console.error('lightGallery has not initiated properly');
//             }
//         }
//     });
// };
window.lightGallery = function (el, options) {
    if (!el) {
        return;
    }
    try {
        return new LightGallery(el, options);
    } catch (err) {
        console.error('lightGallery has not initiated properly', err);
    }
};
