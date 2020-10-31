declare global {
    interface Window {
        lgModules: any;
        lightGallery: (
            el: HTMLElement,
            options: Partial<Defaults>,
        ) => LightGallery | undefined;
    }
}

import utils, { DynamicItem, ImageSize } from './lg-utils';
import { LG, lgQuery } from './lgQuery';

// @ref - https://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio
import { Defaults, defaults } from './lg-defaults';
import picturefill from 'picturefill';

type SlideDirection = 'next' | 'prev';
interface Coords {
    pageX: number;
    pageY: number;
}
export interface VideoInfo {
    html5?: boolean;
    youtube?: string[];
    vimeo?: string[];
    wistia?: string[];
}

let lgId = 0;
window.lgModules = {};

class LightGallery {
    private lgId: number;
    private el: HTMLElement;
    private LGel: lgQuery;
    private lgOpened = false;
    private s: Defaults;

    private index = 0;

    // lightGallery modules
    private modules: any = {};

    // false when lightGallery load first slide content;
    private lGalleryOn = false;

    // True when a slide animation is in progress
    private lgBusy = false;

    // Type of touch action - {swipe, zoomSwipe, pinch}
    private touchAction?: 'swipe' | 'zoomSwipe' | 'pinch';

    // Direction of swipe/drag - {horizontal, vertical}
    private swipeDirection?: 'horizontal' | 'vertical';

    // Timeout function for hiding controls;
    private hideBarTimeout: any;

    private currentItemsInDom: string[] = [];

    private galleryItems: DynamicItem[];

    private outer: lgQuery = (undefined as unknown) as lgQuery;

    private items: any;

    // Scroll top value before lightGallery is opened
    private prevScrollTop = 0;

    constructor(element: HTMLElement, options: Partial<Defaults>) {
        lgId++;
        this.lgId = lgId;

        this.el = element;
        this.LGel = LG(element);

        // lightGallery settings
        this.s = Object.assign({}, defaults, options);

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

        // Gallery items
        this.galleryItems = this.getItems();

        // At the moement, Zoom from image doesn't support dynamic options
        // @todo add zoomFromImage support for dynamic images
        if (this.s.dynamic) {
            this.s.zoomFromImage = false;
        }

        // s.preload should not be grater than $item.length
        if (
            this.s.preload &&
            this.s.preload > (this.s.dynamicEl || []).length
        ) {
            this.s.preload = (this.s.dynamicEl || []).length;
        }

        this.init();

        return this;
    }

    init() {
        this.addSlideVideoInfo(this.galleryItems);
        const fromHash = this.buildFromHash();

        let openGalleryAfter = 0;

        if (!fromHash) {
            openGalleryAfter = this.buildStructure();
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
                    if (this.s.zoomFromImage) {
                        const imageSize = utils.getSize(element);
                        transform = utils.getTransform(element, imageSize);
                    }
                    this.openGallery(currentItemIndex, transform);
                });
            }
        }
    }

    buildModules() {
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

    getSlideItem(index: number) {
        return LG(this.getSlideItemId(index));
    }
    getSlideItemId(index: number) {
        return `#lg-item-${this.lgId}-${index}`;
    }
    getById(id: string) {
        return `${id}-${this.lgId}`;
    }

    buildStructure() {
        const container = LG(`#${this.getById('lg-container')}`).get();
        if (container && container.length) {
            return 0;
        }
        let controls = '';
        let subHtmlCont = '';

        // Create controls
        if (this.s.controls && this.galleryItems.length > 1) {
            controls = `<div class="lg-actions">
                <button id="${this.getById(
                    'lg-prev',
                )}" class="lg-prev lg-icon"> ${this.s.prevHtml} </button>
                <button id="${this.getById(
                    'lg-next',
                )}" class="lg-next lg-icon"> ${this.s.nextHtml} </button>
                </div>`;
        }

        if (this.s.appendSubHtmlTo === '.lg-sub-html') {
            subHtmlCont = '<div class="lg-sub-html"></div>';
        }

        let addClasses = '';

        if (this.s.hideSubHtml) {
            // Do not remove space before last single quote
            addClasses += 'lg-hide-sub-html ';
        }

        const template = `
        <div class="lg-container" id="${this.getById('lg-container')}">
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
                        <span id="${this.getById(
                            'lg-close',
                        )}" class="lg-close lg-icon"></span>
                    </div>
                    ${controls}
                    ${subHtmlCont}
                </div> 
            </div>
        </div>
        `;

        LG(document.body).append(template);
        this.outer = LG(`#${this.getById('lg-outer')}`);

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
            $inner.css('transition-timing-function', this.s.cssEasing);
            $inner.css('transition-duration', this.s.speed + 'ms');
        }

        if (this.s.download) {
            this.outer
                .find('.lg-toolbar')
                .append(
                    `<a id="${this.getById(
                        'lg-download',
                    )}" target="_blank" download class="lg-download lg-icon"></a>`,
                );
        }

        this.counter();

        LG(window).on('resize.lg orientationchange.lg', () => {
            if (this.s.zoomFromImage && !this.s.dynamic) {
                const imgStyle = this.getDummyImgStyles();
                this.outer
                    .find('.lg-current .lg-dummy-img')
                    .first()
                    .attr('style', imgStyle);
            }
        });

        this.hideBars();

        this.closeGallery();

        return this.buildModules();
    }

    // Append new slides dynamically while gallery is open
    // Items has to in the form of an array of dynamicEl
    appendSlides(items: DynamicItem) {
        this.galleryItems = this.galleryItems.concat(items);
        LG(`#${this.getById('lg-counter-all')}`).html(
            this.galleryItems.length + '',
        );
        this.LGel.trigger('appendSlides.lg', { items });
    }

    // Get gallery items based on multiple conditions
    // @todo - remove this.$items
    getItems() {
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
                this.s.getCaptionFromTitleOrAlt,
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
    openGallery(index: number, transform?: string) {
        // prevent accidental double execution
        if (this.lgOpened) return;

        this.lgOpened = true;

        const backdrop = LG(`#${this.getById('lg-backdrop')}`);
        const container = LG(`#${this.getById('lg-container')}`);
        this.outer.removeClass('lg-hide-items');

        if (!this.s.zoomFromImage || !transform) {
            this.outer.addClass(this.s.startClass);
        } else if (this.s.zoomFromImage && transform) {
            this.outer.addClass('lg-zoom-from-image');
        }

        backdrop.css('transition-duration', this.s.backdropDuration + 'ms');

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
        if (!this.s.zoomFromImage || !transform) {
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
            if (this.s.zoomFromImage && transform) {
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
            setTimeout(function () {
                backdrop.addClass('in');
                container.addClass('lg-show-in');
            }, 10);

            // lg-visible class resets gallery opacity to 1
            if (!this.s.zoomFromImage || !transform) {
                setTimeout(() => {
                    this.outer.addClass('lg-visible');
                }, this.s.backdropDuration);
            }

            // initiate slide function
            this.slide(index, false, false, false);

            this.LGel.trigger('onAfterOpen.lg');

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
        });

        LG(document.body).addClass('lg-on');
    }

    // Build Gallery if gallery id exist in the URL
    buildFromHash() {
        // if dynamic option is enabled execute immediately
        const _hash = window.location.hash;
        if (_hash.indexOf('lg=' + this.s.galleryId) > 0) {
            // This class is used to remove the initial animation if galleryId present in the URL
            LG(document.body).addClass('lg-from-hash');

            const index = this.getIndexFromUrl(_hash);

            const openGalleryAfter = this.buildStructure();

            setTimeout(() => {
                this.openGallery(index);
            }, openGalleryAfter);
            return true;
        }
    }

    hideBars() {
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
    doCss() {
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
    counter() {
        if (this.s.counter) {
            const counterHtml = `<div class="lg-counter">
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
    addHtml(index: number) {
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
                this.outer.find('.lg-sub-html').html(subHtml);
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
    preload(index: number) {
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

    getDummyImgStyles(imageSize?: ImageSize) {
        imageSize =
            imageSize || utils.getSize(LG(this.items).eq(this.index).get());
        if (!imageSize) return '';
        return `width:${imageSize.width}px; 
                margin-left: -${imageSize.width / 2}px;
                margin-top: -${imageSize.height / 2}px; 
                height:${imageSize.height}px`;
    }

    setImgMarkup(src: string, $currentSlide: lgQuery, index: number) {
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
        if (!this.lGalleryOn && this.s.zoomFromImage && imageSize) {
            if (imageSize && $currentItem) {
                if (!this.s.exThumbImage) {
                    _dummyImgSrc = $currentItem.find('img').first().attr('src');
                } else {
                    _dummyImgSrc = $currentItem.attr(this.s.exThumbImage);
                }
                const imgStyle = this.getDummyImgStyles(imageSize);
                const dummyImgContent = `<img style="${imgStyle}" class="lg-dummy-img" src="${_dummyImgSrc}" />`;

                $currentSlide.addClass('lg-first-slide');

                imgContnet = dummyImgContent;
            }
        } else {
            imgContnet = ` <img class="lg-object lg-image" data-index="${index}" src="${src}" /> `;
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
    ) {
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
    ) {
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
        const vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
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
    addSlideVideoInfo(items: DynamicItem[]) {
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
    loadContent(index: number, rec: boolean, firstSlide: boolean) {
        let _$img;
        let _src: string;
        let _poster;
        const currentDynamicItem = this.galleryItems[index];
        const $currentSlide = LG(this.getSlideItemId(index));

        if (currentDynamicItem.poster) {
            _poster = currentDynamicItem.poster;
        }

        const _html5Video =
            currentDynamicItem.video &&
            jQuery.parseJSON(currentDynamicItem.video);
        _src = currentDynamicItem.src;

        if (currentDynamicItem.responsive) {
            const srcDyItms = currentDynamicItem.responsive.split(',');
            _src = utils.getResponsiveSrc(srcDyItms) || _src;
        }

        const _srcset = currentDynamicItem.srcset;
        const _sizes = currentDynamicItem.sizes;

        let iframe = false;
        if (this.galleryItems[index].iframe) {
            iframe = true;
        }

        let imageSize;
        if (!this.s.dynamic) {
            const $currentItem = this.items[index];
            imageSize = utils.getSize($currentItem);
        }

        // delay for adding complete class. it is 0 except first time.
        let delay = 0;
        if (firstSlide) {
            if (this.s.zoomFromImage && imageSize) {
                delay = this.s.startAnimationDuration + 10;
            } else {
                delay = this.s.backdropDuration + 10;
            }
        }

        const videoInfo = currentDynamicItem.__slideVideoInfo;
        if (!$currentSlide.hasClass('lg-loaded')) {
            if (iframe) {
                const markup = utils.getIframeMarkup(
                    _src,
                    this.s.iframeMaxWidth,
                );
                $currentSlide.prepend(markup);
            } else if (_poster) {
                const markup = utils.getVideoPosterMarkup(_poster, videoInfo);
                $currentSlide.prepend(markup);
                this.LGel.trigger('hasVideo.lg', {
                    index,
                    src: _src,
                    html5Video: _html5Video,
                    hasPoster: true,
                });
            } else if (videoInfo) {
                const markup =
                    '<div class="lg-video-cont "><div class="lg-video"></div></div>';
                $currentSlide.prepend(markup);
                this.LGel.trigger('hasVideo.lg', {
                    index,
                    src: _src,
                    html5Video: _html5Video,
                    hasPoster: false,
                });
            } else {
                this.setImgMarkup(_src, $currentSlide, index);
            }

            this.LGel.trigger('onAferAppendSlide.lg', { index });

            _$img = $currentSlide.find('.lg-object');
            if (_sizes) {
                _$img.attr('sizes', _sizes);
            }

            if (_srcset) {
                _$img.attr('srcset', _srcset);
                console.log(_$img.get());
                try {
                    picturefill({
                        elements: [_$img.get()],
                    });
                } catch (e) {
                    console.warn(
                        'lightGallery :- If you want srcset to be supported for older browser please include picturefil version 2 javascript library in your document.',
                    );
                }
            }

            if (this.s.appendSubHtmlTo !== '.lg-sub-html') {
                this.addHtml(index);
            }
        }

        // For first time add some delay for displaying the start animation.
        let _speed = 0;

        // Do not change the delay value because it is required for zoom plugin.
        // If gallery opened from direct url (hash) speed value should be 0
        if (delay && !LG(document.body).hasClass('lg-from-hash')) {
            _speed = delay;
        }

        // Only for first slide
        if (!this.lGalleryOn && this.s.zoomFromImage && imageSize) {
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
                            `<img class="lg-object lg-image" data-index="${index}" src="${_src}" />`,
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

        $currentSlide.addClass('lg-loaded');

        this.onLgObjectLoad($currentSlide, index, delay, _speed, false);

        // @todo check load state for html5 videos
        if (videoInfo && videoInfo.html5 && !_poster) {
            $currentSlide.addClass('lg-complete lg-complete_');
        }

        // When gallery is opened once content is loaded (second time) need to add lg-complete class for css styling
        if (
            (!this.s.zoomFromImage || !imageSize) &&
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

    loadContentOnLoad(index: number, $currentSlide: lgQuery, speed: number) {
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
    ) {
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
        direction: SlideDirection | false,
    ) {
        let _prevIndex = 0;
        try {
            _prevIndex =
                this.outer
                    .find('.lg-current')
                    .first()
                    .attr('id')
                    .split('-')[3] || 0;
        } catch (error) {
            _prevIndex = 0;
        }

        const itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(
            index,
            _prevIndex,
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
        this.currentItemsInDom = itemsToBeInsertedToDom;

        // Prevent if multiple call
        // Required for hsh plugin
        if (this.lGalleryOn && _prevIndex === index) {
            return;
        }

        const _length = this.galleryItems.length;
        const _time = this.lGalleryOn ? this.s.speed : 0;

        if (!this.lgBusy) {
            if (this.s.download) {
                const _src =
                    this.galleryItems[index].downloadUrl !== false &&
                    (this.galleryItems[index].downloadUrl ||
                        this.galleryItems[index].src);

                if (_src) {
                    LG(`#${this.getById('lg-download')}`).attr(
                        'href',
                        _src as string,
                    );
                    this.outer.removeClass('lg-hide-download');
                } else {
                    this.outer.addClass('lg-hide-download');
                }
            }

            LG(this.el).trigger('onBeforeSlide.lg', {
                prevIndex: _prevIndex,
                index,
                fromTouch,
                fromThumb,
            });

            this.lgBusy = true;

            clearTimeout(this.hideBarTimeout);

            // Add title if this.s.appendSubHtmlTo === lg-sub-html
            if (this.s.appendSubHtmlTo === '.lg-sub-html') {
                // wait for slide animation to complete
                setTimeout(() => {
                    this.addHtml(index);
                }, _time);
            }

            this.arrowDisable(index);

            if (!direction) {
                if (index < _prevIndex) {
                    direction = 'prev';
                } else if (index > _prevIndex) {
                    direction = 'next';
                }
            }

            if (!fromTouch) {
                // remove all transitions
                this.outer.addClass('lg-no-trans');

                this.outer
                    .find('.lg-item')
                    .removeClass('lg-prev-slide lg-next-slide');

                if (direction === 'prev') {
                    //prevslide
                    this.getSlideItem(index).addClass('lg-prev-slide');
                    this.getSlideItem(_prevIndex).addClass('lg-next-slide');
                } else {
                    // next slide
                    this.getSlideItem(index).addClass('lg-next-slide');
                    this.getSlideItem(_prevIndex).addClass('lg-prev-slide');
                }

                // give 50 ms for browser to add/remove class
                setTimeout(() => {
                    this.outer.find('.lg-item').removeClass('lg-current');

                    //this.getSlideItem(_prevIndex).removeClass('lg-current');
                    this.getSlideItem(index).addClass('lg-current');

                    // reset all transitions
                    this.outer.removeClass('lg-no-trans');
                }, 50);
            } else {
                this.outer
                    .find('.lg-item')
                    .removeClass('lg-prev-slide lg-current lg-next-slide');
                let touchPrev;
                let touchNext;
                if (_length > 2) {
                    touchPrev = index - 1;
                    touchNext = index + 1;

                    if (index === 0 && _prevIndex === _length - 1) {
                        // next slide
                        touchNext = 0;
                        touchPrev = _length - 1;
                    } else if (index === _length - 1 && _prevIndex === 0) {
                        // prev slide
                        touchNext = 0;
                        touchPrev = _length - 1;
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

                this.getSlideItem(index).addClass('lg-current');
            }
            if (this.lGalleryOn) {
                setTimeout(() => {
                    this.loadContent(index, true, false);
                }, this.s.speed + 50);

                setTimeout(() => {
                    this.lgBusy = false;
                    this.LGel.trigger('onAfterSlide.lg', {
                        prevIndex: _prevIndex,
                        index,
                        fromTouch,
                        fromThumb,
                    });
                }, this.s.speed);
            } else {
                this.loadContent(index, true, true);

                this.lgBusy = false;
                this.LGel.trigger('onAfterSlide.lg', {
                    prevIndex: _prevIndex,
                    index,
                    fromTouch,
                    fromThumb,
                });
            }

            if (this.s.counter) {
                LG(`#${this.getById('lg-counter-current')}`).html(
                    index + 1 + '',
                );
            }
        }

        this.index = index;
    }

    touchMove(startCoords: Coords, endCoords: Coords) {
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
            this.setTranslate(
                this.outer.find('.lg-prev-slide').first(),
                -width + distanceX,
                0,
            );
            this.setTranslate(
                this.outer.find('.lg-next-slide').first(),
                width + distanceX,
                0,
            );
        } else if (this.swipeDirection === 'vertical') {
            const container = LG(`#${this.getById('lg-container')}`);
            container.addClass('lg-dragging-vertical');

            const opacity = 1 - Math.abs(distanceY) / window.innerHeight;
            const backdrop = LG(`#${this.getById('lg-backdrop')}`);
            backdrop.css('opacity', opacity);

            const scale = 1 - Math.abs(distanceY) / (window.innerWidth * 2);
            this.setTranslate($currentSlide, 0, distanceY, scale, scale);
        }
    }

    touchEnd(endCoords: Coords, startCoords: Coords) {
        let distance;

        // keep slide animation for any mode while dragg/swipe
        if (this.s.mode !== 'lg-slide') {
            this.outer.addClass('lg-slide');
        }

        // set transition duration
        setTimeout(() => {
            const container = LG(`#${this.getById('lg-container')}`);
            const backdrop = LG(`#${this.getById('lg-backdrop')}`);

            container.removeClass('lg-dragging-vertical');
            this.outer.removeClass('lg-dragging');

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
                if (distance > 100) {
                    this.destroy();
                    return;
                } else {
                    backdrop.css('opacity', 1);
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

    enableSwipe() {
        let startCoords: Coords = {} as Coords;
        let endCoords: Coords = {} as Coords;
        let isMoved = false;
        let isSwiping = false;
        const inner = LG(`#${this.getById('lg-inner')}`);

        if (this.s.enableSwipe && this.doCss()) {
            inner.on('touchstart.lg', (e) => {
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
                    e.preventDefault();
                    this.manageSwipeClass();
                    startCoords = {
                        pageX: e.targetTouches[0].pageX,
                        pageY: e.targetTouches[0].pageY,
                    };
                }
            });

            inner.on('touchmove.lg', (e) => {
                if (
                    isSwiping &&
                    this.touchAction === 'swipe' &&
                    e.targetTouches.length === 1
                ) {
                    e.preventDefault();
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

    enableDrag() {
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

            LG(window).on('mousemove.lg', (e) => {
                if (isDraging) {
                    isMoved = true;
                    endCoords = {
                        pageX: e.pageX,
                        pageY: e.pageY,
                    };
                    this.touchMove(startCoords, endCoords);
                    this.LGel.trigger('onDragmove.lg');
                }
            });

            LG(window).on('mouseup.lg', (e) => {
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

    manageSwipeClass() {
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
    goToNextSlide(fromTouch?: boolean) {
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
    goToPrevSlide(fromTouch?: boolean) {
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

    keyPress() {
        if (this.galleryItems.length > 1) {
            LG(window).on('keyup.lg.window', (e) => {
                if (this.galleryItems.length > 1) {
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

        LG(window).on('keydown.lg', (e) => {
            if (this.s.escKey === true && e.keyCode === 27) {
                e.preventDefault();
                if (!this.outer.hasClass('lg-thumb-open')) {
                    this.destroy();
                } else {
                    this.outer.removeClass('lg-thumb-open');
                }
            }
        });
    }

    arrow() {
        LG(`#${this.getById('lg-prev')}`).on('click.lg', () => {
            this.goToPrevSlide();
        });

        LG(`#${this.getById('lg-next')}`).on('click.lg', () => {
            this.goToNextSlide();
        });
    }

    arrowDisable(index: number) {
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
    ) {
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

    mousewheel() {
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

    closeGallery() {
        let mousedown = false;
        LG(`#${this.getById('lg-close')}`).on('click.lg', () => {
            this.destroy();
        });

        if (this.s.closable) {
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

    destroy(d?: boolean) {
        if (!d) {
            this.LGel.trigger('onBeforeClose.lg');
            LG(window).scrollTop(this.prevScrollTop);
        }

        const $backdrop = LG(`#${this.getById('lg-backdrop')}`);

        let transform: string | undefined;
        if (!this.s.dynamic) {
            const imageSize = utils.getSize(this.items[this.index]);
            transform = utils.getTransform(this.items[this.index], imageSize);
        }
        if (this.s.zoomFromImage && transform) {
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

        if (d) {
            if (!this.s.dynamic) {
                // only when not using dynamic mode is $items a jquery collection
                for (let index = 0; index < this.items.length; index++) {
                    const element = this.items[index];

                    // Using different namespace for click because click event should not unbind if selector is same object('this')
                    LG(element).off(
                        `click.lg-item-${index} click.lgcustom-item-${index}`,
                    );
                }
            }

            // Unbind all events added by lightGallery
            // @todo
            //this.$el.off('.lg.tm');

            for (const key in this.modules) {
                if (this.modules[key]) {
                    try {
                        this.modules[key].destroy();
                    } catch (err) {
                        console.warn(
                            `lightGallery:- make sure lightGallery ${key} module is properly destroyed`,
                        );
                    }
                }
            }
            LG(window).off('.lg');
        }

        this.lGalleryOn = false;

        clearTimeout(this.hideBarTimeout);
        this.hideBarTimeout = false;
        LG(document.body).removeClass('lg-on lg-from-hash');

        this.outer.removeClass('lg-visible');

        // Resetting opacity to 0 isd required as  vertical swipe to close function adds inline opacity.
        $backdrop.removeClass('in').css('opacity', 0);

        const removeTimeout =
            this.s.zoomFromImage && transform
                ? this.s.startAnimationDuration
                : this.s.backdropDuration;
        LG(`#${this.getById('lg-container')}`).removeClass('lg-show-in');

        LG(window).off('keyup.lg.window');
        LG(window).off('keydown.lg');

        // Once the closign animation is completed and gallery is invisible
        setTimeout(() => {
            if (this.s.zoomFromImage && transform) {
                this.outer.removeClass('lg-zoom-from-image');
            }
            LG(`#${this.getById('lg-container')}`).removeClass('lg-show');
            $backdrop.removeAttr('style');

            this.outer.removeClass(`lg-closing ${this.s.startClass}`);

            this.getSlideItem(this.index).removeClass('start-end-progress');
            LG(`#${this.getById('lg-inner')}`).empty();

            if (d) {
                if (this.outer) {
                    this.outer.remove();
                }

                $backdrop.remove();
            }
            if (!d) {
                this.LGel.trigger('onCloseAfter.lg');
            }

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
