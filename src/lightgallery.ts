import {
    AfterAppendSlideEventDetail,
    AfterAppendSubHtmlDetail,
    BeforeSlideDetail,
    lGEvents,
    SlideItemLoadDetail,
} from './lg-events';
import {
    LightGalleryAllSettings,
    lightGalleryCoreSettings,
    LightGallerySettings,
} from './lg-settings';
import utils, { GalleryItem, ImageSize } from './lg-utils';
import { $LG, lgQuery } from './lgQuery';
import {
    Coords,
    MediaContainerPosition,
    SlideDirection,
    VideoInfo,
} from './types';

declare let picturefill: any;

// @ref - https://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio
// @ref - https://2ality.com/2017/04/setting-up-multi-platform-packages.html

// Unique id for each gallery
let lgId = 0;

export class LightGallery {
    public settings!: LightGalleryAllSettings;
    public galleryItems!: GalleryItem[];

    // Current gallery item
    public lgId!: number;

    public el!: HTMLElement;
    public LGel!: lgQuery;
    public lgOpened = false;

    public index = 0;

    // lightGallery modules
    public plugins: any[] = [];

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

    public $backdrop!: lgQuery;
    public $lgComponents!: lgQuery;

    public $container!: lgQuery;

    public $inner!: lgQuery;
    public $content!: lgQuery;
    public $toolbar!: lgQuery;

    // Scroll top value before lightGallery is opened
    public prevScrollTop = 0;

    private zoomFromOrigin!: boolean;

    private currentImageSize?: ImageSize;

    private isDummyImageRemoved = false;

    private dragOrSwipeEnabled = false;

    public mediaContainerPosition = {
        top: 0,
        bottom: 0,
    };

    constructor(element: HTMLElement, options?: LightGallerySettings) {
        if (!element) {
            return this;
        }
        lgId++;
        this.lgId = lgId;

        this.el = element;
        this.LGel = $LG(element);

        this.generateSettings(options);

        this.buildModules();

        // When using dynamic mode, ensure dynamicEl is an array
        if (
            this.settings.dynamic &&
            this.settings.dynamicEl !== undefined &&
            !Array.isArray(this.settings.dynamicEl)
        ) {
            throw 'When using dynamic mode, you must also define dynamicEl as an Array.';
        }

        this.galleryItems = this.getItems();
        this.normalizeSettings();

        // Gallery items

        this.init();

        this.validateLicense();

        return this;
    }

    private generateSettings(options?: LightGallerySettings) {
        // lightGallery settings
        this.settings = {
            ...lightGalleryCoreSettings,
            ...options,
        } as LightGalleryAllSettings;
        if (
            this.settings.isMobile &&
            typeof this.settings.isMobile === 'function'
                ? this.settings.isMobile()
                : utils.isMobile()
        ) {
            const mobileSettings = {
                ...this.settings.mobileSettings,
                ...this.settings.mobileSettings,
            };
            this.settings = { ...this.settings, ...mobileSettings };
        }
    }

    private normalizeSettings() {
        if (this.settings.slideEndAnimation) {
            this.settings.hideControlOnEnd = false;
        }
        if (!this.settings.closable) {
            this.settings.swipeToClose = false;
        }

        // And reset it on close to get the correct value next time
        this.zoomFromOrigin = this.settings.zoomFromOrigin;

        // At the moment, Zoom from image doesn't support dynamic options
        // @todo add zoomFromOrigin support for dynamic images
        if (this.settings.dynamic) {
            this.zoomFromOrigin = false;
        }

        if (!this.settings.container) {
            this.settings.container = document.body;
        }

        // settings.preload should not be grater than $item.length
        this.settings.preload = Math.min(
            this.settings.preload,
            this.galleryItems.length,
        );
    }

    init(): void {
        this.addSlideVideoInfo(this.galleryItems);

        this.buildStructure();

        this.LGel.trigger(lGEvents.init, {
            instance: this,
        });

        if (this.settings.keyPress) {
            this.keyPress();
        }

        setTimeout(() => {
            this.enableDrag();
            this.enableSwipe();
            this.triggerPosterClick();
        }, 50);

        this.arrow();
        if (this.settings.mousewheel) {
            this.mousewheel();
        }

        if (!this.settings.dynamic) {
            this.openGalleryOnItemClick();
        }
    }

    openGalleryOnItemClick(): void {
        // Using for loop instead of using bubbling as the items can be any html element.
        for (let index = 0; index < this.items.length; index++) {
            const element = this.items[index];
            const $element = $LG(element);
            // Using different namespace for click because click event should not unbind if selector is same object('this')
            // @todo manage all event listners - should have namespace that represent element
            const uuid = lgQuery.generateUUID();
            $element
                .attr('data-lg-id', uuid)
                .on(`click.lgcustom-item-${uuid}`, (e) => {
                    e.preventDefault();
                    const currentItemIndex = this.settings.index || index;
                    this.openGallery(currentItemIndex, element);
                });
        }
    }

    /**
     * Module constructor
     * Modules are build incrementally.
     * Gallery should be opened only once all the modules are initialized.
     * use moduleBuildTimeout to make sure this
     */
    buildModules(): void {
        this.settings.plugins.forEach((plugin) => {
            this.plugins.push(new plugin(this, $LG));
        });
    }

    validateLicense(): void {
        if (!this.settings.licenseKey) {
            console.error('Please provide a valid license key');
        } else if (this.settings.licenseKey === '0000-0000-000-0000') {
            console.warn(
                `lightGallery: ${this.settings.licenseKey} license key is not valid for production use`,
            );
        }
    }

    getSlideItem(index: number): lgQuery {
        return $LG(this.getSlideItemId(index));
    }

    getSlideItemId(index: number): string {
        return `#lg-item-${this.lgId}-${index}`;
    }

    getIdName(id: string): string {
        return `${id}-${this.lgId}`;
    }
    getElementById(id: string): lgQuery {
        return $LG(`#${this.getIdName(id)}`);
    }

    manageSingleSlideClassName(): void {
        if (this.galleryItems.length < 2) {
            this.outer.addClass('lg-single-item');
        } else {
            this.outer.removeClass('lg-single-item');
        }
    }

    buildStructure(): void {
        const container = this.$container && this.$container.get();
        if (container) {
            return;
        }
        let controls = '';
        let subHtmlCont = '';

        // Create controls
        if (this.settings.controls) {
            controls = `<button type="button" id="${this.getIdName(
                'lg-prev',
            )}" aria-label="${
                this.settings.strings['previousSlide']
            }" class="lg-prev lg-icon"> ${this.settings.prevHtml} </button>
                <button type="button" id="${this.getIdName(
                    'lg-next',
                )}" aria-label="${
                this.settings.strings['nextSlide']
            }" class="lg-next lg-icon"> ${this.settings.nextHtml} </button>`;
        }

        if (this.settings.appendSubHtmlTo !== '.lg-item') {
            subHtmlCont =
                '<div class="lg-sub-html" role="status" aria-live="polite"></div>';
        }

        let addClasses = '';

        if (this.settings.allowMediaOverlap) {
            // Do not remove space before last single quote
            addClasses += 'lg-media-overlap ';
        }

        const ariaLabelledby = this.settings.ariaLabelledby
            ? 'aria-labelledby="' + this.settings.ariaLabelledby + '"'
            : '';
        const ariaDescribedby = this.settings.ariaDescribedby
            ? 'aria-describedby="' + this.settings.ariaDescribedby + '"'
            : '';

        const containerClassName = `lg-container ${this.settings.addClass} ${
            document.body !== this.settings.container ? 'lg-inline' : ''
        }`;
        const closeIcon =
            this.settings.closable && this.settings.showCloseIcon
                ? `<button type="button" aria-label="${
                      this.settings.strings['closeGallery']
                  }" id="${this.getIdName(
                      'lg-close',
                  )}" class="lg-close lg-icon"></button>`
                : '';
        const maximizeIcon = this.settings.showMaximizeIcon
            ? `<button type="button" aria-label="${
                  this.settings.strings['toggleMaximize']
              }" id="${this.getIdName(
                  'lg-maximize',
              )}" class="lg-maximize lg-icon"></button>`
            : '';
        const template = `
        <div class="${containerClassName}" id="${this.getIdName(
            'lg-container',
        )}" tabindex="-1" aria-modal="true" ${ariaLabelledby} ${ariaDescribedby} role="dialog"
        >
            <div id="${this.getIdName(
                'lg-backdrop',
            )}" class="lg-backdrop"></div>

            <div id="${this.getIdName(
                'lg-outer',
            )}" class="lg-outer lg-use-css3 lg-css3 lg-hide-items ${addClasses} ">

              <div id="${this.getIdName('lg-content')}" class="lg-content">
                <div id="${this.getIdName('lg-inner')}" class="lg-inner">
                </div>
                ${controls}
              </div>
                <div id="${this.getIdName(
                    'lg-toolbar',
                )}" class="lg-toolbar lg-group">
                    ${maximizeIcon}
                    ${closeIcon}
                    </div>
                    ${
                        this.settings.appendSubHtmlTo === '.lg-outer'
                            ? subHtmlCont
                            : ''
                    }
                <div id="${this.getIdName(
                    'lg-components',
                )}" class="lg-components">
                    ${
                        this.settings.appendSubHtmlTo === '.lg-sub-html'
                            ? subHtmlCont
                            : ''
                    }
                </div>
            </div>
        </div>
        `;

        $LG(this.settings.container).append(template);

        if (document.body !== this.settings.container) {
            $LG(this.settings.container).css('position', 'relative');
        }

        this.outer = this.getElementById('lg-outer');
        this.$lgComponents = this.getElementById('lg-components');
        this.$backdrop = this.getElementById('lg-backdrop');
        this.$container = this.getElementById('lg-container');
        this.$inner = this.getElementById('lg-inner');
        this.$content = this.getElementById('lg-content');
        this.$toolbar = this.getElementById('lg-toolbar');

        this.$backdrop.css(
            'transition-duration',
            this.settings.backdropDuration + 'ms',
        );

        let outerClassNames = `${this.settings.mode} `;

        this.manageSingleSlideClassName();

        if (this.settings.enableDrag) {
            outerClassNames += 'lg-grab ';
        }

        this.outer.addClass(outerClassNames);

        this.$inner.css('transition-timing-function', this.settings.easing);
        this.$inner.css('transition-duration', this.settings.speed + 'ms');

        if (this.settings.download) {
            this.$toolbar.append(
                `<a id="${this.getIdName(
                    'lg-download',
                )}" target="_blank" rel="noopener" aria-label="${
                    this.settings.strings['download']
                }" download class="lg-download lg-icon"></a>`,
            );
        }

        this.counter();

        $LG(window).on(
            `resize.lg.global${this.lgId} orientationchange.lg.global${this.lgId}`,
            () => {
                this.refreshOnResize();
            },
        );

        this.hideBars();

        this.manageCloseGallery();
        this.toggleMaximize();

        this.initModules();
    }

    refreshOnResize(): void {
        if (this.lgOpened) {
            const currentGalleryItem = this.galleryItems[this.index];
            const { __slideVideoInfo } = currentGalleryItem;

            this.mediaContainerPosition = this.getMediaContainerPosition();
            const { top, bottom } = this.mediaContainerPosition;
            this.currentImageSize = utils.getSize(
                this.items[this.index],
                this.outer,
                top + bottom,
                __slideVideoInfo && this.settings.videoMaxSize,
            );
            if (__slideVideoInfo) {
                this.resizeVideoSlide(this.index, this.currentImageSize);
            }
            if (this.zoomFromOrigin && !this.isDummyImageRemoved) {
                const imgStyle = this.getDummyImgStyles(this.currentImageSize);
                this.outer
                    .find('.lg-current .lg-dummy-img')
                    .first()
                    .attr('style', imgStyle);
            }
            this.LGel.trigger(lGEvents.containerResize);
        }
    }

    resizeVideoSlide(index: number, imageSize?: ImageSize): void {
        const lgVideoStyle = this.getVideoContStyle(imageSize);
        const currentSlide = this.getSlideItem(index);
        currentSlide.find('.lg-video-cont').attr('style', lgVideoStyle);
    }

    /**
     * Update slides dynamically.
     * Add, edit or delete slides dynamically when lightGallery is opened.
     * Modify the current gallery items and pass it via updateSlides method
     * @note
     * - Do not mutate existing lightGallery items directly.
     * - Always pass new list of gallery items
     * - You need to take care of thumbnails outside the gallery if any
     * - user this method only if you want to update slides when the gallery is opened. Otherwise, use `refresh()` method.
     * @param items Gallery items
     * @param index After the update operation, which slide gallery should navigate to
     * @category lGPublicMethods
     * @example
     * const plugin = lightGallery();
     *
     * // Adding slides dynamically
     * let galleryItems = [
     * // Access existing lightGallery items
     * // galleryItems are automatically generated internally from the gallery HTML markup
     * // or directly from galleryItems when dynamic gallery is used
     *   ...plugin.galleryItems,
     *     ...[
     *       {
     *         src: 'img/img-1.png',
     *           thumb: 'img/thumb1.png',
     *         },
     *     ],
     *   ];
     *   plugin.updateSlides(
     *     galleryItems,
     *     plugin.index,
     *   );
     *
     *
     * // Remove slides dynamically
     * galleryItems = JSON.parse(
     *   JSON.stringify(updateSlideInstance.galleryItems),
     * );
     * galleryItems.shift();
     * updateSlideInstance.updateSlides(galleryItems, 1);
     * @see <a href="/demos/update-slides/">Demo</a>
     */
    updateSlides(items: GalleryItem[], index: number): void {
        if (this.index > items.length - 1) {
            this.index = items.length - 1;
        }
        if (items.length === 1) {
            this.index = 0;
        }
        if (!items.length) {
            this.closeGallery();
            return;
        }
        const currentSrc = this.galleryItems[index].src;
        this.galleryItems = items;
        this.updateControls();
        this.$inner.empty();
        this.currentItemsInDom = [];

        let _index = 0;
        // Find the current index based on source value of the slide
        this.galleryItems.some((galleryItem, itemIndex) => {
            if (galleryItem.src === currentSrc) {
                _index = itemIndex;
                return true;
            }
            return false;
        });

        this.currentItemsInDom = this.organizeSlideItems(_index, -1);
        this.loadContent(_index, true);
        this.getSlideItem(_index).addClass('lg-current');

        this.index = _index;
        this.updateCurrentCounter(_index);
        this.LGel.trigger(lGEvents.updateSlides);
    }

    // Get gallery items based on multiple conditions
    getItems(): GalleryItem[] {
        // Gallery items
        this.items = [];
        if (!this.settings.dynamic) {
            if (this.settings.selector === 'this') {
                this.items.push(this.el);
            } else if (this.settings.selector) {
                if (typeof this.settings.selector === 'string') {
                    if (this.settings.selectWithin) {
                        const selectWithin = $LG(this.settings.selectWithin);
                        this.items = selectWithin
                            .find(this.settings.selector)
                            .get();
                    } else {
                        this.items = this.el.querySelectorAll(
                            this.settings.selector,
                        );
                    }
                } else {
                    this.items = this.settings.selector;
                }
            } else {
                this.items = this.el.children;
            }
            return utils.getDynamicOptions(
                this.items,
                this.settings.extraProps,
                this.settings.getCaptionFromTitleOrAlt,
                this.settings.exThumbImage,
            );
        } else {
            return this.settings.dynamicEl || [];
        }
    }

    /**
     * Open lightGallery.
     * Open gallery with specific slide by passing index of the slide as parameter.
     * @category lGPublicMethods
     * @param {Number} index  - index of the slide
     * @param {HTMLElement} element - Which image lightGallery should zoom from
     *
     * @example
     * const $dynamicGallery = document.getElementById('dynamic-gallery-demo');
     * const dynamicGallery = lightGallery($dynamicGallery, {
     *     dynamic: true,
     *     dynamicEl: [
     *         {
     *              src: 'img/1.jpg',
     *              thumb: 'img/thumb-1.jpg',
     *              subHtml: '<h4>Image 1 title</h4><p>Image 1 descriptions.</p>',
     *         },
     *         ...
     *     ],
     * });
     * $dynamicGallery.addEventListener('click', function () {
     *     // Starts with third item.(Optional).
     *     // This is useful if you want use dynamic mode with
     *     // custom thumbnails (thumbnails outside gallery),
     *     dynamicGallery.openGallery(2);
     * });
     *
     */
    openGallery(index = this.settings.index, element?: HTMLElement): void {
        // prevent accidental double execution
        if (this.lgOpened) return;
        this.lgOpened = true;
        this.outer.get().focus();
        this.outer.removeClass('lg-hide-items');

        // Add display block, but still has opacity 0
        this.$container.addClass('lg-show');

        const itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(
            index,
            index,
        );
        this.currentItemsInDom = itemsToBeInsertedToDom;

        let items = '';
        itemsToBeInsertedToDom.forEach((item) => {
            items = items + `<div id="${item}" class="lg-item"></div>`;
        });

        this.$inner.append(items);
        this.addHtml(index);
        let transform: string | undefined = '';
        this.mediaContainerPosition = this.getMediaContainerPosition();
        const { top, bottom } = this.mediaContainerPosition;
        if (!this.settings.allowMediaOverlap) {
            this.setMediaContainerPosition(top, bottom);
        }
        const { __slideVideoInfo } = this.galleryItems[index];
        if (this.zoomFromOrigin && element) {
            this.currentImageSize = utils.getSize(
                element,
                this.outer,
                top + bottom,
                __slideVideoInfo && this.settings.videoMaxSize,
            );
            transform = utils.getTransform(
                element,
                this.outer,
                top,
                bottom,
                this.currentImageSize,
            );
        }
        if (!this.zoomFromOrigin || !transform) {
            this.outer.addClass(this.settings.startClass);
            this.getSlideItem(index).removeClass('lg-complete');
        }
        const timeout = this.settings.zoomFromOrigin
            ? 100
            : this.settings.backdropDuration;
        setTimeout(() => {
            this.outer.addClass('lg-components-open');
        }, timeout);
        this.index = index;
        this.LGel.trigger(lGEvents.beforeOpen);

        // add class lg-current to remove initial transition
        this.getSlideItem(index).addClass('lg-current');

        this.lGalleryOn = false;
        // Store the current scroll top value to scroll back after closing the gallery..
        this.prevScrollTop = $LG(window).scrollTop();

        setTimeout(() => {
            // Need to check both zoomFromOrigin and transform values as we need to set set the
            // default opening animation if user missed to add the lg-size attribute

            if (this.zoomFromOrigin && transform) {
                const currentSlide = this.getSlideItem(index);
                currentSlide.css('transform', transform);
                setTimeout(() => {
                    currentSlide
                        .addClass('lg-start-progress lg-start-end-progress')
                        .css(
                            'transition-duration',
                            this.settings.startAnimationDuration + 'ms',
                        );
                    this.outer.addClass('lg-zoom-from-image');
                });
                setTimeout(() => {
                    currentSlide.css('transform', 'translate3d(0, 0, 0)');
                }, 100);
            }

            setTimeout(() => {
                this.$backdrop.addClass('in');
                this.$container.addClass('lg-show-in');
            }, 10);

            // lg-visible class resets gallery opacity to 1
            if (!this.zoomFromOrigin || !transform) {
                setTimeout(() => {
                    this.outer.addClass('lg-visible');
                }, this.settings.backdropDuration);
            }

            // initiate slide function
            this.slide(index, false, false, false);

            this.LGel.trigger(lGEvents.afterOpen);
        });

        if (document.body === this.settings.container) {
            $LG('html').addClass('lg-on');
        }
    }

    /**
     * Note - Changing the position of the media on every slide transition creates a flickering effect.
     * Therefore, The height of the caption is calculated dynamically, only once based on the first slide caption.
     * if you have dynamic captions for each media,
     * you can provide an appropriate height for the captions via allowMediaOverlap option
     */
    public getMediaContainerPosition(): MediaContainerPosition {
        if (this.settings.allowMediaOverlap) {
            return {
                top: 0,
                bottom: 0,
            };
        }
        const top = this.$toolbar.get().clientHeight || 0;
        const subHtml = this.outer.find('.lg-components .lg-sub-html').get();
        const captionHeight =
            this.settings.defaultCaptionHeight ||
            (subHtml && subHtml.clientHeight) ||
            0;
        const thumbContainer = this.outer.find('.lg-thumb-outer').get();
        const thumbHeight = thumbContainer ? thumbContainer.clientHeight : 0;
        const bottom = thumbHeight + captionHeight;
        return {
            top,
            bottom,
        };
    }

    private setMediaContainerPosition(top = 0, bottom = 0): void {
        this.$content.css('top', top + 'px').css('bottom', bottom + 'px');
    }

    hideBars(): void {
        // Hide controllers if mouse doesn't move for some period
        setTimeout(() => {
            this.outer.removeClass('lg-hide-items');
            if (this.settings.hideBarsDelay > 0) {
                this.outer.on('mousemove.lg click.lg touchstart.lg', () => {
                    this.outer.removeClass('lg-hide-items');

                    clearTimeout(this.hideBarTimeout);

                    // Timeout will be cleared on each slide movement also
                    this.hideBarTimeout = setTimeout(() => {
                        this.outer.addClass('lg-hide-items');
                    }, this.settings.hideBarsDelay);
                });
                this.outer.trigger('mousemove.lg');
            }
        }, this.settings.showBarsAfter);
    }

    initPictureFill($img: lgQuery): void {
        if (this.settings.supportLegacyBrowser) {
            try {
                picturefill({
                    elements: [$img.get()],
                });
            } catch (e) {
                console.warn(
                    'lightGallery :- If you want srcset or picture tag to be supported for older browser please include picturefil javascript library in your document.',
                );
            }
        }
    }

    /**
     *  @desc Create image counter
     *  Ex: 1/10
     */
    counter(): void {
        if (this.settings.counter) {
            const counterHtml = `<div class="lg-counter" role="status" aria-live="polite">
                <span id="${this.getIdName(
                    'lg-counter-current',
                )}" class="lg-counter-current">${this.index + 1} </span> /
                <span id="${this.getIdName(
                    'lg-counter-all',
                )}" class="lg-counter-all">${
                this.galleryItems.length
            } </span></div>`;
            this.outer.find(this.settings.appendCounterTo).append(counterHtml);
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
                // get first letter of sub-html
                // if first letter starts with . or # get the html form the jQuery object
                const fL = subHtml.substring(0, 1);
                if (fL === '.' || fL === '#') {
                    if (
                        this.settings.subHtmlSelectorRelative &&
                        !this.settings.dynamic
                    ) {
                        subHtml = $LG(this.items)
                            .eq(index)
                            .find(subHtml)
                            .first()
                            .html();
                    } else {
                        subHtml = $LG(subHtml).first().html();
                    }
                }
            } else {
                subHtml = '';
            }
        }

        if (this.settings.appendSubHtmlTo !== '.lg-item') {
            if (subHtmlUrl) {
                this.outer.find('.lg-sub-html').load(subHtmlUrl);
            } else {
                this.outer.find('.lg-sub-html').html(subHtml as string);
            }
        } else {
            const currentSlide = $LG(this.getSlideItemId(index));
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
                    .find(this.settings.appendSubHtmlTo)
                    .addClass('lg-empty-html');
            } else {
                this.outer
                    .find(this.settings.appendSubHtmlTo)
                    .removeClass('lg-empty-html');
            }
        }

        this.LGel.trigger<AfterAppendSubHtmlDetail>(
            lGEvents.afterAppendSubHtml,
            {
                index,
            },
        );
    }

    /**
     *  @desc Preload slides
     *  @param {Number} index - index of the slide
     * @todo preload not working for the first slide, Also, should work for the first and last slide as well
     */
    preload(index: number): void {
        for (let i = 1; i <= this.settings.preload; i++) {
            if (i >= this.galleryItems.length - index) {
                break;
            }

            this.loadContent(index + i, false);
        }

        for (let j = 1; j <= this.settings.preload; j++) {
            if (index - j < 0) {
                break;
            }

            this.loadContent(index - j, false);
        }
    }

    getDummyImgStyles(imageSize?: ImageSize): string {
        if (!imageSize) return '';
        return `width:${imageSize.width}px;
                margin-left: -${imageSize.width / 2}px;
                margin-top: -${imageSize.height / 2}px;
                height:${imageSize.height}px`;
    }
    getVideoContStyle(imageSize?: ImageSize): string {
        if (!imageSize) return '';
        return `width:${imageSize.width}px;
                height:${imageSize.height}px`;
    }

    getDummyImageContent(
        $currentSlide: lgQuery,
        index: number,
        alt: string,
    ): string {
        let $currentItem;
        if (!this.settings.dynamic) {
            $currentItem = $LG(this.items).eq(index);
        }
        if ($currentItem) {
            let _dummyImgSrc;
            if (!this.settings.exThumbImage) {
                _dummyImgSrc = $currentItem.find('img').first().attr('src');
            } else {
                _dummyImgSrc = $currentItem.attr(this.settings.exThumbImage);
            }
            if (!_dummyImgSrc) return '';
            const imgStyle = this.getDummyImgStyles(this.currentImageSize);
            const dummyImgContent = `<img ${alt} style="${imgStyle}" class="lg-dummy-img" src="${_dummyImgSrc}" />`;

            $currentSlide.addClass('lg-first-slide');
            this.outer.addClass('lg-first-slide-loading');

            return dummyImgContent;
        }
        return '';
    }

    setImgMarkup(src: string, $currentSlide: lgQuery, index: number): void {
        const currentGalleryItem = this.galleryItems[index];
        const { alt, srcset, sizes, sources } = currentGalleryItem;

        // Use the thumbnail as dummy image which will be resized to actual image size and
        // displayed on top of actual image
        let imgContent = '';
        const altAttr = alt ? 'alt="' + alt + '"' : '';

        if (this.isFirstSlideWithZoomAnimation()) {
            imgContent = this.getDummyImageContent(
                $currentSlide,
                index,
                altAttr,
            );
        } else {
            imgContent = utils.getImgMarkup(
                index,
                src,
                altAttr,
                srcset,
                sizes,
                sources,
            );
        }
        const imgMarkup = `<picture class="lg-img-wrap"> ${imgContent}</picture>`;
        $currentSlide.prepend(imgMarkup);
    }

    onSlideObjectLoad(
        $slide: lgQuery,
        isHTML5VideoWithoutPoster: boolean,
        onLoad: () => void,
        onError: () => void,
    ): void {
        const mediaObject = $slide.find('.lg-object').first();
        if (
            utils.isImageLoaded(mediaObject.get() as HTMLImageElement) ||
            isHTML5VideoWithoutPoster
        ) {
            onLoad();
        } else {
            mediaObject.on('load.lg error.lg', () => {
                onLoad && onLoad();
            });
            mediaObject.on('error.lg', () => {
                onError && onError();
            });
        }
    }

    /**
     *
     * @param $el Current slide item
     * @param index
     * @param delay Delay is 0 except first time
     * @param speed Speed is same as delay, except it is 0 if gallery is opened via hash plugin
     * @param isFirstSlide
     */
    onLgObjectLoad(
        currentSlide: lgQuery,
        index: number,
        delay: number,
        speed: number,
        isFirstSlide: boolean,
        isHTML5VideoWithoutPoster: boolean,
    ): void {
        this.onSlideObjectLoad(
            currentSlide,
            isHTML5VideoWithoutPoster,
            () => {
                this.triggerSlideItemLoad(
                    currentSlide,
                    index,
                    delay,
                    speed,
                    isFirstSlide,
                );
            },
            () => {
                currentSlide.addClass('lg-complete lg-complete_');
                currentSlide.html(
                    '<span class="lg-error-msg">Oops... Failed to load content...</span>',
                );
            },
        );
    }

    triggerSlideItemLoad(
        $currentSlide: lgQuery,
        index: number,
        delay: number,
        speed: number,
        isFirstSlide: boolean,
    ): void {
        const currentGalleryItem = this.galleryItems[index];

        // Adding delay for video slides without poster for better performance and user experience
        // Videos should start playing once once the gallery is completely loaded
        const _speed =
            isFirstSlide &&
            this.getSlideType(currentGalleryItem) === 'video' &&
            !currentGalleryItem.poster
                ? speed
                : 0;
        setTimeout(() => {
            $currentSlide.addClass('lg-complete lg-complete_');
            this.LGel.trigger<SlideItemLoadDetail>(lGEvents.slideItemLoad, {
                index,
                delay: delay || 0,
                isFirstSlide,
            });
        }, _speed);
    }

    isFirstSlideWithZoomAnimation(): boolean {
        return !!(
            !this.lGalleryOn &&
            this.zoomFromOrigin &&
            this.currentImageSize
        );
    }

    // Add video slideInfo
    addSlideVideoInfo(items: GalleryItem[]): void {
        items.forEach((element, index) => {
            element.__slideVideoInfo = utils.isVideo(
                element.src as string,
                !!element.video,
                index,
            );
            if (
                element.__slideVideoInfo &&
                this.settings.loadYouTubePoster &&
                !element.poster &&
                element.__slideVideoInfo.youtube
            ) {
                element.poster = `//img.youtube.com/vi/${element.__slideVideoInfo.youtube[1]}/maxresdefault.jpg`;
            }
        });
    }

    /**
     *  Load slide content into slide.
     *  This is used to load content into slides that is not visible too
     *  @param {Number} index - index of the slide.
     *  @param {Boolean} rec - if true call loadcontent() function again.
     */
    loadContent(index: number, rec: boolean): void {
        const currentGalleryItem = this.galleryItems[index];
        const $currentSlide = $LG(this.getSlideItemId(index));

        const { poster, srcset, sizes, sources } = currentGalleryItem;
        let { src } = currentGalleryItem;

        const video = currentGalleryItem.video;

        const _html5Video =
            video && typeof video === 'string' ? JSON.parse(video) : video;

        if (currentGalleryItem.responsive) {
            const srcDyItms = currentGalleryItem.responsive.split(',');
            src = utils.getResponsiveSrc(srcDyItms) || src;
        }

        const videoInfo = currentGalleryItem.__slideVideoInfo;
        let lgVideoStyle = '';

        const iframe = !!currentGalleryItem.iframe;

        const isFirstSlide = !this.lGalleryOn;

        // delay for adding complete class. it is 0 except first time.
        let delay = 0;
        if (isFirstSlide) {
            if (this.zoomFromOrigin && this.currentImageSize) {
                delay = this.settings.startAnimationDuration + 10;
            } else {
                delay = this.settings.backdropDuration + 10;
            }
        }

        if (!$currentSlide.hasClass('lg-loaded')) {
            if (videoInfo) {
                const { top, bottom } = this.mediaContainerPosition;
                const videoSize = utils.getSize(
                    this.items[index],
                    this.outer,
                    top + bottom,
                    videoInfo && this.settings.videoMaxSize,
                );
                lgVideoStyle = this.getVideoContStyle(videoSize);
            }
            if (iframe) {
                const markup = utils.getIframeMarkup(
                    this.settings.iframeWidth,
                    this.settings.iframeHeight,
                    this.settings.iframeMaxWidth,
                    this.settings.iframeMaxHeight,
                    src,
                    currentGalleryItem.iframeTitle,
                );
                $currentSlide.prepend(markup);
            } else if (poster) {
                let dummyImg = '';
                const hasStartAnimation =
                    isFirstSlide &&
                    this.zoomFromOrigin &&
                    this.currentImageSize;
                if (hasStartAnimation) {
                    dummyImg = this.getDummyImageContent(
                        $currentSlide,
                        index,
                        '',
                    );
                }

                const markup = utils.getVideoPosterMarkup(
                    poster,
                    dummyImg || '',
                    lgVideoStyle,
                    this.settings.strings['playVideo'],
                    videoInfo,
                );
                $currentSlide.prepend(markup);
            } else if (videoInfo) {
                const markup = `<div class="lg-video-cont " style="${lgVideoStyle}"></div>`;
                $currentSlide.prepend(markup);
            } else {
                this.setImgMarkup(src as string, $currentSlide, index);
                if (srcset || sources) {
                    const $img = $currentSlide.find('.lg-object');
                    this.initPictureFill($img);
                }
            }
            if (poster || videoInfo) {
                this.LGel.trigger(lGEvents.hasVideo, {
                    index,
                    src: src,
                    html5Video: _html5Video,
                    hasPoster: !!poster,
                });
            }

            this.LGel.trigger<AfterAppendSlideEventDetail>(
                lGEvents.afterAppendSlide,
                { index },
            );

            if (
                this.lGalleryOn &&
                this.settings.appendSubHtmlTo === '.lg-item'
            ) {
                this.addHtml(index);
            }
        }

        // For first time add some delay for displaying the start animation.
        let _speed = 0;

        // Do not change the delay value because it is required for zoom plugin.
        // If gallery opened from direct url (hash) speed value should be 0
        if (delay && !$LG(document.body).hasClass('lg-from-hash')) {
            _speed = delay;
        }

        // Only for first slide and zoomFromOrigin is enabled
        if (this.isFirstSlideWithZoomAnimation()) {
            setTimeout(() => {
                $currentSlide
                    .removeClass('lg-start-end-progress lg-start-progress')
                    .removeAttr('style');
            }, this.settings.startAnimationDuration + 100);
            if (!$currentSlide.hasClass('lg-loaded')) {
                setTimeout(() => {
                    if (this.getSlideType(currentGalleryItem) === 'image') {
                        $currentSlide
                            .find('.lg-img-wrap')
                            .append(
                                utils.getImgMarkup(
                                    index,
                                    src as string,
                                    '',
                                    srcset,
                                    sizes,
                                    currentGalleryItem.sources,
                                ),
                            );
                        if (srcset || sources) {
                            const $img = $currentSlide.find('.lg-object');
                            this.initPictureFill($img);
                        }
                    }
                    if (
                        this.getSlideType(currentGalleryItem) === 'image' ||
                        (this.getSlideType(currentGalleryItem) === 'video' &&
                            poster)
                    ) {
                        this.onLgObjectLoad(
                            $currentSlide,
                            index,
                            delay,
                            _speed,
                            true,
                            false,
                        );

                        // load remaining slides once the slide is completely loaded
                        this.onSlideObjectLoad(
                            $currentSlide,
                            !!(videoInfo && videoInfo.html5 && !poster),
                            () => {
                                this.loadContentOnFirstSlideLoad(
                                    index,
                                    $currentSlide,
                                    _speed,
                                );
                            },
                            () => {
                                this.loadContentOnFirstSlideLoad(
                                    index,
                                    $currentSlide,
                                    _speed,
                                );
                            },
                        );
                    }
                }, this.settings.startAnimationDuration + 100);
            }
        }

        // SLide content has been added to dom
        $currentSlide.addClass('lg-loaded');

        if (
            !this.isFirstSlideWithZoomAnimation() ||
            (this.getSlideType(currentGalleryItem) === 'video' && !poster)
        ) {
            this.onLgObjectLoad(
                $currentSlide,
                index,
                delay,
                _speed,
                isFirstSlide,
                !!(videoInfo && videoInfo.html5 && !poster),
            );
        }

        // When gallery is opened once content is loaded (second time) need to add lg-complete class for css styling
        if (
            (!this.zoomFromOrigin || !this.currentImageSize) &&
            $currentSlide.hasClass('lg-complete_') &&
            !this.lGalleryOn
        ) {
            setTimeout(() => {
                $currentSlide.addClass('lg-complete');
            }, this.settings.backdropDuration);
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

    /**
     * @desc Remove dummy image content and load next slides
     * Called only for the first time if zoomFromOrigin animation is enabled
     * @param index
     * @param $currentSlide
     * @param speed
     */
    loadContentOnFirstSlideLoad(
        index: number,
        $currentSlide: lgQuery,
        speed: number,
    ): void {
        setTimeout(() => {
            $currentSlide.find('.lg-dummy-img').remove();
            $currentSlide.removeClass('lg-first-slide');
            this.outer.removeClass('lg-first-slide-loading');
            this.isDummyImageRemoved = true;
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
            this.galleryItems.forEach((_element, index) => {
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
        if (this.settings.loop) {
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
            this.settings.numberOfSlideItemsInDom,
        );

        itemsToBeInsertedToDom.forEach((item) => {
            if (this.currentItemsInDom.indexOf(item) === -1) {
                this.$inner.append(`<div id="${item}" class="lg-item"></div>`);
            }
        });

        this.currentItemsInDom.forEach((item) => {
            if (itemsToBeInsertedToDom.indexOf(item) === -1) {
                $LG(`#${item}`).remove();
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
        if (this.settings.download) {
            const currentGalleryItem = this.galleryItems[index];
            const hideDownloadBtn =
                currentGalleryItem.downloadUrl === false ||
                currentGalleryItem.downloadUrl === 'false';
            if (hideDownloadBtn) {
                this.outer.addClass('lg-hide-download');
            } else {
                const $download = this.getElementById('lg-download');
                this.outer.removeClass('lg-hide-download');
                $download.attr(
                    'href',
                    currentGalleryItem.downloadUrl ||
                        (currentGalleryItem.src as string),
                );
                if (currentGalleryItem.download) {
                    $download.attr('download', currentGalleryItem.download);
                }
            }
        }
    }

    makeSlideAnimation(
        direction: 'next' | 'prev',
        currentSlideItem: lgQuery,
        previousSlideItem: lgQuery,
    ): void {
        if (this.lGalleryOn) {
            previousSlideItem.addClass('lg-slide-progress');
        }
        setTimeout(
            () => {
                // remove all transitions
                this.outer.addClass('lg-no-trans');

                this.outer
                    .find('.lg-item')
                    .removeClass('lg-prev-slide lg-next-slide');

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
            },
            this.lGalleryOn ? this.settings.slideDelay : 0,
        );
    }

    /**
     * Goto a specific slide.
     * @param {Number} index - index of the slide
     * @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
     * @param {Boolean} fromThumb - true if slide function called via thumbnail click
     * @param {String} direction - Direction of the slide(next/prev)
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  // to go to 3rd slide
     *  plugin.slide(2);
     *
     */
    slide(
        index: number,
        fromTouch?: boolean,
        fromThumb?: boolean,
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
            if (this.settings.counter) {
                this.updateCurrentCounter(index);
            }

            const currentSlideItem = this.getSlideItem(index);
            const previousSlideItem = this.getSlideItem(prevIndex);

            const currentGalleryItem = this.galleryItems[index];
            const videoInfo = currentGalleryItem.__slideVideoInfo;

            this.outer.attr(
                'data-lg-slide-type',
                this.getSlideType(currentGalleryItem),
            );
            this.setDownloadValue(index);

            if (videoInfo) {
                const { top, bottom } = this.mediaContainerPosition;
                const videoSize = utils.getSize(
                    this.items[index],
                    this.outer,
                    top + bottom,
                    videoInfo && this.settings.videoMaxSize,
                );
                this.resizeVideoSlide(index, videoSize);
            }

            this.LGel.trigger<BeforeSlideDetail>(lGEvents.beforeSlide, {
                prevIndex,
                index,
                fromTouch: !!fromTouch,
                fromThumb: !!fromThumb,
            });

            this.lgBusy = true;

            clearTimeout(this.hideBarTimeout);

            this.arrowDisable(index);

            if (!direction) {
                if (index < prevIndex) {
                    direction = 'prev';
                } else if (index > prevIndex) {
                    direction = 'next';
                }
            }

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

            // Do not put load content in set timeout as it needs to load immediately when the gallery is opened
            if (!this.lGalleryOn) {
                this.loadContent(index, true);
            } else {
                setTimeout(() => {
                    this.loadContent(index, true);
                    // Add title if this.settings.appendSubHtmlTo === lg-sub-html
                    if (this.settings.appendSubHtmlTo !== '.lg-item') {
                        this.addHtml(index);
                    }
                }, this.settings.speed + 50 + (fromTouch ? 0 : this.settings.slideDelay));
            }

            setTimeout(() => {
                this.lgBusy = false;
                previousSlideItem.removeClass('lg-slide-progress');
                this.LGel.trigger(lGEvents.afterSlide, {
                    prevIndex: prevIndex,
                    index,
                    fromTouch,
                    fromThumb,
                });
            }, (this.lGalleryOn ? this.settings.speed + 100 : 100) + (fromTouch ? 0 : this.settings.slideDelay));
        }

        this.index = index;
    }

    updateCurrentCounter(index: number): void {
        this.getElementById('lg-counter-current').html(index + 1 + '');
    }

    updateCounterTotal(): void {
        this.getElementById('lg-counter-all').html(
            this.galleryItems.length + '',
        );
    }

    getSlideType(item: GalleryItem): 'video' | 'iframe' | 'image' {
        if (item.__slideVideoInfo) {
            return 'video';
        } else if (item.iframe) {
            return 'iframe';
        } else {
            return 'image';
        }
    }

    touchMove(startCoords: Coords, endCoords: Coords, e?: TouchEvent): void {
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
            e?.preventDefault();
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
            if (this.settings.swipeToClose) {
                e?.preventDefault();
                this.$container.addClass('lg-dragging-vertical');

                const opacity = 1 - Math.abs(distanceY) / window.innerHeight;
                this.$backdrop.css('opacity', opacity);

                const scale = 1 - Math.abs(distanceY) / (window.innerWidth * 2);
                this.setTranslate($currentSlide, 0, distanceY, scale, scale);
                if (Math.abs(distanceY) > 100) {
                    this.outer
                        .addClass('lg-hide-items')
                        .removeClass('lg-components-open');
                }
            }
        }
    }

    touchEnd(endCoords: Coords, startCoords: Coords, event: TouchEvent): void {
        let distance;

        // keep slide animation for any mode while dragg/swipe
        if (this.settings.mode !== 'lg-slide') {
            this.outer.addClass('lg-slide');
        }

        // set transition duration
        setTimeout(() => {
            this.$container.removeClass('lg-dragging-vertical');
            this.outer
                .removeClass('lg-dragging lg-hide-items')
                .addClass('lg-components-open');

            let triggerClick = true;

            if (this.swipeDirection === 'horizontal') {
                distance = endCoords.pageX - startCoords.pageX;
                const distanceAbs = Math.abs(
                    endCoords.pageX - startCoords.pageX,
                );
                if (
                    distance < 0 &&
                    distanceAbs > this.settings.swipeThreshold
                ) {
                    this.goToNextSlide(true);
                    triggerClick = false;
                } else if (
                    distance > 0 &&
                    distanceAbs > this.settings.swipeThreshold
                ) {
                    this.goToPrevSlide(true);
                    triggerClick = false;
                }
            } else if (this.swipeDirection === 'vertical') {
                distance = Math.abs(endCoords.pageY - startCoords.pageY);
                if (
                    this.settings.closable &&
                    this.settings.swipeToClose &&
                    distance > 100
                ) {
                    this.closeGallery();
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
                const target = $LG(event.target);
                if (this.isPosterElement(target)) {
                    this.LGel.trigger(lGEvents.posterClick);
                }
            }

            this.swipeDirection = undefined;
        });

        // remove slide class once drag/swipe is completed if mode is not slide
        setTimeout(() => {
            if (
                !this.outer.hasClass('lg-dragging') &&
                this.settings.mode !== 'lg-slide'
            ) {
                this.outer.removeClass('lg-slide');
            }
        }, this.settings.speed + 100);
    }

    enableSwipe(): void {
        let startCoords: Coords = {} as Coords;
        let endCoords: Coords = {} as Coords;
        let isMoved = false;
        let isSwiping = false;

        if (this.settings.enableSwipe) {
            this.$inner.on('touchstart.lg', (e) => {
                this.dragOrSwipeEnabled = true;
                const $item = this.getSlideItem(this.index);
                if (
                    ($LG(e.target).hasClass('lg-item') ||
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

            this.$inner.on('touchmove.lg', (e) => {
                if (
                    isSwiping &&
                    this.touchAction === 'swipe' &&
                    e.targetTouches.length === 1
                ) {
                    endCoords = {
                        pageX: e.targetTouches[0].pageX,
                        pageY: e.targetTouches[0].pageY,
                    };
                    this.touchMove(startCoords, endCoords, e);
                    isMoved = true;
                }
            });

            this.$inner.on('touchend.lg', (event: TouchEvent) => {
                if (this.touchAction === 'swipe') {
                    if (isMoved) {
                        isMoved = false;
                        this.touchEnd(endCoords, startCoords, event);
                    } else if (isSwiping) {
                        const target = $LG(event.target);
                        if (this.isPosterElement(target)) {
                            this.LGel.trigger(lGEvents.posterClick);
                        }
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
        if (this.settings.enableDrag) {
            this.outer.on('mousedown.lg', (e) => {
                this.dragOrSwipeEnabled = true;
                const $item = this.getSlideItem(this.index);
                if (
                    $LG(e.target).hasClass('lg-item') ||
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

                            this.LGel.trigger(lGEvents.dragStart);
                        }
                    }
                }
            });

            $LG(window).on(`mousemove.lg.global${this.lgId}`, (e) => {
                if (isDraging && this.lgOpened) {
                    isMoved = true;
                    endCoords = {
                        pageX: e.pageX,
                        pageY: e.pageY,
                    };
                    this.touchMove(startCoords, endCoords);
                    this.LGel.trigger(lGEvents.dragMove);
                }
            });

            $LG(window).on(`mouseup.lg.global${this.lgId}`, (event) => {
                if (!this.lgOpened) {
                    return;
                }
                const target = $LG(event.target);
                if (isMoved) {
                    isMoved = false;
                    this.touchEnd(endCoords, startCoords, event);
                    this.LGel.trigger(lGEvents.dragEnd);
                } else if (this.isPosterElement(target)) {
                    this.LGel.trigger(lGEvents.posterClick);
                }

                // Prevent execution on click
                if (isDraging) {
                    isDraging = false;
                    this.outer.removeClass('lg-grabbing').addClass('lg-grab');
                }
            });
        }
    }

    triggerPosterClick(): void {
        this.$inner.on('click.lg', (event) => {
            if (
                !this.dragOrSwipeEnabled &&
                this.isPosterElement($LG(event.target))
            ) {
                this.LGel.trigger(lGEvents.posterClick);
            }
        });
    }

    manageSwipeClass(): void {
        let _touchNext = this.index + 1;
        let _touchPrev = this.index - 1;
        if (this.settings.loop && this.galleryItems.length > 2) {
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
     * Go to next slide
     * @param {Boolean} fromTouch - true if slide function called via touch event
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  plugin.goToNextSlide();
     * @see <a href="/demos/methods/">Demo</a>
     */
    goToNextSlide(fromTouch?: boolean): void {
        let _loop = this.settings.loop;
        if (fromTouch && this.galleryItems.length < 3) {
            _loop = false;
        }

        if (!this.lgBusy) {
            if (this.index + 1 < this.galleryItems.length) {
                this.index++;
                this.LGel.trigger(lGEvents.beforeNextSlide, {
                    index: this.index,
                });
                this.slide(this.index, !!fromTouch, false, 'next');
            } else {
                if (_loop) {
                    this.index = 0;
                    this.LGel.trigger(lGEvents.beforeNextSlide, {
                        index: this.index,
                    });
                    this.slide(this.index, !!fromTouch, false, 'next');
                } else if (this.settings.slideEndAnimation && !fromTouch) {
                    this.outer.addClass('lg-right-end');
                    setTimeout(() => {
                        this.outer.removeClass('lg-right-end');
                    }, 400);
                }
            }
        }
    }

    /**
     * Go to previous slides
     * @param {Boolean} fromTouch - true if slide function called via touch event
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery({});
     *  plugin.goToPrevSlide();
     * @see <a href="/demos/methods/">Demo</a>
     *
     */
    goToPrevSlide(fromTouch?: boolean): void {
        let _loop = this.settings.loop;
        if (fromTouch && this.galleryItems.length < 3) {
            _loop = false;
        }

        if (!this.lgBusy) {
            if (this.index > 0) {
                this.index--;
                this.LGel.trigger(lGEvents.beforePrevSlide, {
                    index: this.index,
                    fromTouch,
                });
                this.slide(this.index, !!fromTouch, false, 'prev');
            } else {
                if (_loop) {
                    this.index = this.galleryItems.length - 1;
                    this.LGel.trigger(lGEvents.beforePrevSlide, {
                        index: this.index,
                        fromTouch,
                    });
                    this.slide(this.index, !!fromTouch, false, 'prev');
                } else if (this.settings.slideEndAnimation && !fromTouch) {
                    this.outer.addClass('lg-left-end');
                    setTimeout(() => {
                        this.outer.removeClass('lg-left-end');
                    }, 400);
                }
            }
        }
    }

    keyPress(): void {
        $LG(window).on(`keydown.lg.global${this.lgId}`, (e) => {
            if (
                this.lgOpened &&
                this.settings.escKey === true &&
                e.keyCode === 27
            ) {
                e.preventDefault();
                if (
                    this.settings.allowMediaOverlap &&
                    this.outer.hasClass('lg-can-toggle') &&
                    this.outer.hasClass('lg-components-open')
                ) {
                    this.outer.removeClass('lg-components-open');
                } else {
                    this.closeGallery();
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
        this.getElementById('lg-prev').on('click.lg', () => {
            this.goToPrevSlide();
        });
        this.getElementById('lg-next').on('click.lg', () => {
            this.goToNextSlide();
        });
    }

    arrowDisable(index: number): void {
        // Disable arrows if settings.hideControlOnEnd is true
        if (!this.settings.loop && this.settings.hideControlOnEnd) {
            const $prev = this.getElementById('lg-prev');
            const $next = this.getElementById('lg-next');
            if (index + 1 === this.galleryItems.length) {
                $next.attr('disabled', 'disabled').addClass('disabled');
            } else {
                $next.removeAttr('disabled').removeClass('disabled');
            }

            if (index === 0) {
                $prev.attr('disabled', 'disabled').addClass('disabled');
            } else {
                $prev.removeAttr('disabled').removeClass('disabled');
            }
        }
    }

    setTranslate(
        $el: lgQuery,
        xValue: number,
        yValue: number,
        scaleX = 1,
        scaleY = 1,
    ): void {
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

    mousewheel(): void {
        let lastCall = 0;
        this.outer.on('wheel.lg', (e) => {
            if (!e.deltaY || this.galleryItems.length < 2) {
                return;
            }
            e.preventDefault();
            const now = new Date().getTime();
            if (now - lastCall < 1000) {
                return;
            }
            lastCall = now;
            if (e.deltaY > 0) {
                this.goToNextSlide();
            } else if (e.deltaY < 0) {
                this.goToPrevSlide();
            }
        });
    }

    isSlideElement(target: lgQuery): boolean {
        return (
            target.hasClass('lg-outer') ||
            target.hasClass('lg-item') ||
            target.hasClass('lg-img-wrap')
        );
    }

    isPosterElement(target: lgQuery): boolean {
        const playButton = this.getSlideItem(this.index)
            .find('.lg-video-play-button')
            .get();
        return (
            target.hasClass('lg-video-poster') ||
            target.hasClass('lg-video-play-button') ||
            (playButton && playButton.contains(target.get()))
        );
    }

    /**
     * Maximize minimize inline gallery.
     * @category lGPublicMethods
     */
    toggleMaximize(): void {
        this.getElementById('lg-maximize').on('click.lg', () => {
            this.$container.toggleClass('lg-inline');
            this.refreshOnResize();
        });
    }

    invalidateItems(): void {
        for (let index = 0; index < this.items.length; index++) {
            const element = this.items[index];
            const $element = $LG(element);
            $element.off(`click.lgcustom-item-${$element.attr('data-lg-id')}`);
        }
    }

    manageCloseGallery(): void {
        if (!this.settings.closable) return;
        let mousedown = false;
        this.getElementById('lg-close').on('click.lg', () => {
            this.closeGallery();
        });

        if (this.settings.closeOnTap) {
            // If you drag the slide and release outside gallery gets close on chrome
            // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
            this.outer.on('mousedown.lg', (e) => {
                const target = $LG(e.target);
                if (this.isSlideElement(target)) {
                    mousedown = true;
                } else {
                    mousedown = false;
                }
            });

            this.outer.on('mousemove.lg', () => {
                mousedown = false;
            });

            this.outer.on('mouseup.lg', (e) => {
                const target = $LG(e.target);
                if (this.isSlideElement(target) && mousedown) {
                    if (!this.outer.hasClass('lg-dragging')) {
                        this.closeGallery();
                    }
                }
            });
        }
    }

    /**
     * Close lightGallery if it is opened.
     *
     * @description If closable is false in the settings, you need to pass true via closeGallery method to force close gallery
     * @return returns the estimated time to close gallery completely including the close animation duration
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  plugin.closeGallery();
     *
     */
    closeGallery(force?: boolean): number {
        if (!this.lgOpened || (!this.settings.closable && !force)) {
            return 0;
        }
        this.LGel.trigger(lGEvents.beforeClose);
        $LG(window).scrollTop(this.prevScrollTop);

        const currentItem = this.items[this.index];
        let transform: string | undefined;
        if (this.zoomFromOrigin && currentItem) {
            const { top, bottom } = this.mediaContainerPosition;
            const { __slideVideoInfo, poster } = this.galleryItems[this.index];
            const imageSize = utils.getSize(
                currentItem,
                this.outer,
                top + bottom,
                __slideVideoInfo && poster && this.settings.videoMaxSize,
            );
            transform = utils.getTransform(
                currentItem,
                this.outer,
                top,
                bottom,
                imageSize,
            );
        }
        if (this.zoomFromOrigin && transform) {
            this.outer.addClass('lg-closing lg-zoom-from-image');
            this.getSlideItem(this.index)
                .addClass('lg-start-end-progress')
                .css(
                    'transition-duration',
                    this.settings.startAnimationDuration + 'ms',
                )
                .css('transform', transform);
        } else {
            this.outer.addClass('lg-hide-items');
            // lg-zoom-from-image is used for setting the opacity to 1 if zoomFromOrigin is true
            // If the closing item doesn't have the lg-size attribute, remove this class to avoid the closing css conflicts
            this.outer.removeClass('lg-zoom-from-image');
        }

        // Unbind all events added by lightGallery
        // @todo
        //this.$el.off('.lg.tm');

        this.destroyModules();

        this.lGalleryOn = false;
        this.isDummyImageRemoved = false;
        this.zoomFromOrigin = this.settings.zoomFromOrigin;

        clearTimeout(this.hideBarTimeout);
        this.hideBarTimeout = false;
        $LG('html').removeClass('lg-on');

        this.outer.removeClass('lg-visible lg-components-open');

        // Resetting opacity to 0 isd required as  vertical swipe to close function adds inline opacity.
        this.$backdrop.removeClass('in').css('opacity', 0);

        const removeTimeout =
            this.zoomFromOrigin && transform
                ? Math.max(
                      this.settings.startAnimationDuration,
                      this.settings.backdropDuration,
                  )
                : this.settings.backdropDuration;
        this.$container.removeClass('lg-show-in');

        // Once the closign animation is completed and gallery is invisible
        setTimeout(() => {
            if (this.zoomFromOrigin && transform) {
                this.outer.removeClass('lg-zoom-from-image');
            }
            this.$container.removeClass('lg-show');

            // Need to remove inline opacity as it is used in the stylesheet as well
            this.$backdrop
                .removeAttr('style')
                .css(
                    'transition-duration',
                    this.settings.backdropDuration + 'ms',
                );

            this.outer.removeClass(`lg-closing ${this.settings.startClass}`);

            this.getSlideItem(this.index).removeClass('lg-start-end-progress');
            this.$inner.empty();
            if (this.lgOpened) {
                this.LGel.trigger(lGEvents.afterClose, {
                    instance: this,
                });
            }
            if (this.outer.get()) {
                this.outer.get().blur();
            }

            this.lgOpened = false;
        }, removeTimeout + 100);
        return removeTimeout + 100;
    }

    initModules(): void {
        this.plugins.forEach((module) => {
            try {
                module.init();
            } catch (err) {
                console.warn(
                    `lightGallery:- make sure lightGallery module is properly initiated`,
                );
            }
        });
    }

    destroyModules(destroy?: true): void {
        this.plugins.forEach((module) => {
            try {
                if (destroy) {
                    module.destroy();
                } else {
                    module.closeGallery && module.closeGallery();
                }
            } catch (err) {
                console.warn(
                    `lightGallery:- make sure lightGallery module is properly destroyed`,
                );
            }
        });
    }

    /**
     * Refresh lightGallery with new set of children.
     *
     * @description This is useful to update the gallery when the child elements are changed without calling destroy method.
     *
     * If you are using dynamic mode, you can pass the modified array of dynamicEl as the first parameter to refresh the dynamic gallery
     * @see <a href="/demos/dynamic-mode/">Demo</a>
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  // Delete or add children, then call
     *  plugin.refresh();
     *
     */
    refresh(galleryItems?: GalleryItem[]): void {
        if (!this.settings.dynamic) {
            this.invalidateItems();
        }
        if (galleryItems) {
            this.galleryItems = galleryItems;
        } else {
            this.galleryItems = this.getItems();
        }
        this.updateControls();
        this.openGalleryOnItemClick();
        this.LGel.trigger(lGEvents.updateSlides);
    }

    updateControls(): void {
        this.addSlideVideoInfo(this.galleryItems);
        this.updateCounterTotal();
        this.manageSingleSlideClassName();
    }

    /**
     * Destroy lightGallery.
     * Destroy lightGallery and its plugin instances completely
     *
     * @description This method also calls CloseGallery function internally. Returns the time takes to completely close and destroy the instance.
     * In case if you want to re-initialize lightGallery right after destroying it, initialize it only once the destroy process is completed.
     * You can use refresh method most of the times.
     * @category lGPublicMethods
     * @example
     *  const plugin = lightGallery();
     *  plugin.destroy();
     *
     */
    destroy(): number {
        const closeTimeout = this.closeGallery(true);
        setTimeout(() => {
            this.destroyModules(true);
            if (!this.settings.dynamic) {
                this.invalidateItems();
            }
            $LG(window).off(`.lg.global${this.lgId}`);
            this.LGel.off('.lg');
            this.$container.remove();
        }, closeTimeout);
        return closeTimeout;
    }
}
