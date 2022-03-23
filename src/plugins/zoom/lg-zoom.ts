import { ZoomSettings, zoomSettings } from './lg-zoom-settings';
import { LgQuery, lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { lGEvents } from '../../lg-events';

interface Coords {
    x: number;
    y: number;
}

interface DragAllowedAxises {
    allowX: boolean;
    allowY: boolean;
}
interface ZoomTouchEvent {
    pageX: number;
    targetTouches: { pageY: number; pageX: number }[];
    pageY: number;
}
interface PossibleCords {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
export default class Zoom {
    private core: LightGallery;
    private settings: ZoomSettings;
    private $LG!: LgQuery;
    private imageReset!: number | boolean;
    zoomableTimeout: any;
    positionChanged!: boolean;
    pageX!: number;
    pageY!: number;
    scale!: number;

    imageYSize!: number;
    imageXSize!: number;
    containerRect!: ClientRect;
    rotateValue!: number;
    modifierX!: number;
    modifierY!: number;
    dragAllowedAxises!: DragAllowedAxises;
    top!: number;
    left!: number;
    scrollTop!: number;
    constructor(instance: LightGallery, $LG: LgQuery) {
        // get lightGallery core plugin instance
        this.core = instance;
        this.$LG = $LG;

        this.settings = { ...zoomSettings, ...this.core.settings };

        return this;
    }

    // Append Zoom controls. Actual size, Zoom-in, Zoom-out
    buildTemplates(): void {
        let zoomIcons = this.settings.showZoomInOutIcons
            ? `<button id="${this.core.getIdName(
                  'lg-zoom-in',
              )}" type="button" aria-label="${
                  this.settings.zoomPluginStrings['zoomIn']
              }" class="lg-zoom-in lg-icon"></button><button id="${this.core.getIdName(
                  'lg-zoom-out',
              )}" type="button" aria-label="${
                  this.settings.zoomPluginStrings['zoomIn']
              }" class="lg-zoom-out lg-icon"></button>`
            : '';

        if (this.settings.actualSize) {
            zoomIcons += `<button id="${this.core.getIdName(
                'lg-actual-size',
            )}" type="button" aria-label="${
                this.settings.zoomPluginStrings['viewActualSize']
            }" class="${
                this.settings.actualSizeIcons.zoomIn
            } lg-icon"></button>`;
        }

        this.core.outer.addClass('lg-use-transition-for-zoom');

        this.core.$toolbar.first().append(zoomIcons);
    }

    /**
     * @desc Enable zoom option only once the image is completely loaded
     * If zoomFromOrigin is true, Zoom is enabled once the dummy image has been inserted
     *
     * Zoom styles are defined under lg-zoomable CSS class.
     */
    enableZoom(event: CustomEvent): void {
        // delay will be 0 except first time
        let _speed = this.settings.enableZoomAfter + event.detail.delay;

        // set _speed value 0 if gallery opened from direct url and if it is first slide
        if (
            this.$LG('body').first().hasClass('lg-from-hash') &&
            event.detail.delay
        ) {
            // will execute only once
            _speed = 0;
        } else {
            // Remove lg-from-hash to enable starting animation.
            this.$LG('body').first().removeClass('lg-from-hash');
        }

        this.zoomableTimeout = setTimeout(() => {
            if (!this.isImageSlide()) {
                return;
            }
            this.core.getSlideItem(event.detail.index).addClass('lg-zoomable');
            if (event.detail.index === this.core.index) {
                this.setZoomEssentials();
            }
        }, _speed + 30);
    }

    enableZoomOnSlideItemLoad(): void {
        // Add zoomable class
        this.core.LGel.on(
            `${lGEvents.slideItemLoad}.zoom`,
            this.enableZoom.bind(this),
        );
    }

    getModifier(rotateValue: number, axis: string, el: HTMLElement): number {
        const originalRotate = rotateValue;
        rotateValue = Math.abs(rotateValue);
        return 1;
    }

    getImageSize(
        $image: HTMLImageElement,
        rotateValue: number,
        axis: string,
    ): number {
        const rect = $image.getBoundingClientRect();

        if (axis === 'x') {
            return rect.width;
        } else {
            return rect.height;
        }
    }

    getDragCords(e: MouseEvent, rotateValue: number): Coords {
        if (rotateValue === 90) {
            return {
                x: e.pageY,
                y: e.pageX,
            };
        } else {
            return {
                x: e.pageX,
                y: e.pageY,
            };
        }
    }
    getSwipeCords(e: TouchEvent, rotateValue: number): Coords {
        const x = e.targetTouches[0].pageX;
        const y = e.targetTouches[0].pageY;
        if (rotateValue === 90) {
            return {
                x: y,
                y: x,
            };
        } else {
            return {
                x: x,
                y: y,
            };
        }
    }

    /**
     *
     * @param scale When image portratit image is rotated and scaled, check the reset values
     * @returns
     */
    getDragAllowedAxises(scale?: number): DragAllowedAxises {
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first()
            .get();

        let height = 0;
        let width = 0;
        if (scale) {
            scale = scale || 1;
            height = $image.offsetHeight * scale;
            width = $image.offsetWidth * scale;
        } else {
            const rect = $image.getBoundingClientRect();
            height = rect.height;
            width = rect.width;
        }
        const allowY = height > this.containerRect.height;
        const allowX = width > this.containerRect.width;
        return {
            allowX,
            allowY,
        };
    }

    /**
     *
     * @param {Element} el
     * @return matrix(cos(X), sin(X), -sin(X), cos(X), 0, 0);
     * Get the current transform value
     */
    getCurrentTransform(el: HTMLElement): string[] | undefined {
        if (!el) {
            return;
        }
        const st = window.getComputedStyle(el, null);
        const tm =
            st.getPropertyValue('-webkit-transform') ||
            st.getPropertyValue('-moz-transform') ||
            st.getPropertyValue('-ms-transform') ||
            st.getPropertyValue('-o-transform') ||
            st.getPropertyValue('transform') ||
            'none';
        if (tm !== 'none') {
            return tm.split('(')[1].split(')')[0].split(',');
        }
        return;
    }

    getCurrentRotation(el: HTMLElement): number {
        if (!el) {
            return 0;
        }
        const values: string[] | undefined = this.getCurrentTransform(el);
        if (values) {
            return Math.round(
                Math.atan2(parseFloat(values[1]), parseFloat(values[0])) *
                    (180 / Math.PI),
            );
            // If you want rotate in 360
            //return (angle < 0 ? angle + 360 : angle);
        }
        return 0;
    }

    setZoomEssentials(): void {
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first();

        const rotateEl = this.core
            .getSlideItem(this.core.index)
            .find('.lg-img-rotate')
            .first()
            .get();
        this.rotateValue = 0;

        this.imageYSize = this.getImageSize(
            $image.get() as HTMLImageElement,
            this.rotateValue,
            'y',
        );
        this.imageXSize = this.getImageSize(
            $image.get() as HTMLImageElement,
            this.rotateValue,
            'x',
        );
        this.containerRect = this.core.$content.get().getBoundingClientRect();

        this.modifierX = this.getModifier(this.rotateValue, 'X', rotateEl);
        this.modifierY = this.getModifier(this.rotateValue, 'Y', rotateEl);
    }

    /**
     * @desc Image zoom
     * Translate the wrap and scale the image to get better user experience
     *
     * @param {String} scale - Zoom decrement/increment value
     */
    zoomImage(scale: number, out?: boolean): void {
        // Find offset manually to avoid issue after zoom
        const offsetX = this.containerRect.width / 2 + this.containerRect.left;

        const { top, bottom } = this.core.mediaContainerPosition;
        const topBottomSpacing = Math.abs(top + bottom) / 2;

        const offsetY =
            this.containerRect.height / 2 +
            this.containerRect.top +
            this.scrollTop;
        // (this.containerRect.height -
        //     this.imageYSize -
        //     topBottomSpacing * this.modifierX) /
        //     2 +
        // this.scrollTop +
        // this.containerRect.top;

        let originalX;
        let originalY;

        if (scale === 1) {
            this.positionChanged = false;
        }

        const dragAllowedAxises = this.getDragAllowedAxises(scale);

        console.log('dragAllowedAxises', dragAllowedAxises);

        const { allowY, allowX } = dragAllowedAxises;
        if (this.positionChanged) {
            originalX = this.left / this.scale;
            originalY = this.top / (out ? this.scale - 1 : this.scale - 1);
            this.pageX = offsetX - originalX;
            this.pageY = offsetY - originalY;

            this.positionChanged = false;
        }

        const possibleSwipeCords = this.getStaticPossibleSwipeDragCords(scale);

        const _x = offsetX - this.pageX;
        const _y = offsetY - this.pageY;

        let x = (scale - 1) * _x;
        let y = (scale - 1) * _y;
        console.log('possibleSwipeCords', possibleSwipeCords);
        console.log('y', y);
        if (allowX) {
            console.log('allox x');
            if (this.isBeyondPossibleLeft(x, possibleSwipeCords.minX)) {
                console.log('allox x min');
                x = possibleSwipeCords.minX;
            } else if (this.isBeyondPossibleRight(x, possibleSwipeCords.maxX)) {
                x = possibleSwipeCords.maxX;
            }
        } else {
            console.log('!allox');
            if (scale > 1) {
                if (x < possibleSwipeCords.minX) {
                    console.log('!allox x min');
                    x = possibleSwipeCords.minX;
                } else if (x > possibleSwipeCords.maxX) {
                    console.log('!allox x max');
                    x = possibleSwipeCords.maxX;
                }
            }
        }
        // @todo fix this
        if (allowY) {
            console.log('alloy y');
            if (this.isBeyondPossibleTop(y, possibleSwipeCords.minY)) {
                console.log('alloy y min');
                y = possibleSwipeCords.minY;
            } else if (
                this.isBeyondPossibleBottom(y, possibleSwipeCords.maxY)
            ) {
                console.log('alloy y max');
                y = possibleSwipeCords.maxY;
            }
        } else {
            // If the translate value based on index of beyond the viewport, utilize the available space to prevent image being cut out
            if (scale > 1) {
                console.log('!alloy y');
                //If image goes beyond viewport top, use the minim possible translate value
                if (y < possibleSwipeCords.minY) {
                    console.log('!alloy y min');
                    y = possibleSwipeCords.minY;
                } else if (y > possibleSwipeCords.maxY) {
                    console.log('!alloy y max');
                    y = possibleSwipeCords.maxY;
                }
            }
        }

        this.setZoomStyles(
            {
                x: x,
                y: y,
                scale,
            },
            possibleSwipeCords,
            dragAllowedAxises,
        );

        // if (scale === actualSizeScale) {
        //     setTimeout(() => {
        //         if (possibleSwipeCords) {
        //             this.imageReset = scale;
        //             const $image = this.core
        //                 .getSlideItem(this.core.index)
        //                 .find('.lg-image')
        //                 .first();
        //             $image.addClass('reset-transition');
        //             setTimeout(() => {
        //                 if (allowX) {
        //                     x = Math.abs(possibleSwipeCords.minX);
        //                 } else {
        //                     x = Math.abs(possibleSwipeCords.minX)
        //                 }
        //                 if (allowY) {
        //                     const { top } = this.core.mediaContainerPosition;
        //                     y = Math.abs(possibleSwipeCords.minY) - top;
        //                 }
        //                 $image
        //                     .css('maxHeight', 'none')
        //                     .css('maxWidth', 'none')
        //                     .css(
        //                         'transform',
        //                         `translate3d(${Math.abs(x)}px, ${Math.abs(
        //                             y,
        //                         )}px, 0px)`,
        //                     );
        //             }, 10);
        //         }
        //     }, 600);
        // }
    }

    resetImageTranslate(): void {
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first();
        this.imageReset = false;
        $image.removeClass(
            'reset-transition reset-transition-y reset-transition-x',
        );
        $image.css('width', 'auto').css('height', 'auto');
        setTimeout(() => {
            $image.removeClass('no-transition');
        }, 10);
    }

    setZoomImageSize(scale: number): void {
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first();
        setTimeout(() => {
            $image.addClass('no-transition');
            this.imageReset = true;
        }, 500);
        setTimeout(() => {
            const dragAllowedAxises = this.getDragAllowedAxises(this.scale);

            // const translateX = dragAllowedAxises.allowX ? 50 : 0;
            // const translateY = dragAllowedAxises.allowY ? 50 : 0;
            // const resetTransformStyle = `scale3d(1, 1, 1) translate3d(-${translateX}%, -${translateY}%, 0px)`;
            // const leftStyle = `${translateX}%`;
            // const topStyle = `${translateY}%`;
            // $image
            //     .css('width', ($image.get() as any).naturalWidth + 'px')
            //     .css('height', ($image.get() as any).naturalHeight + 'px')
            //     .css('transform', resetTransformStyle)
            //     .css('left', leftStyle)
            //     .css('top', topStyle);

            $image
                .css('width', ($image.get() as any).naturalWidth + 'px')
                .css('height', ($image.get() as any).naturalHeight + 'px');
            if (dragAllowedAxises.allowX && dragAllowedAxises.allowY) {
                $image.addClass('reset-transition');
            } else if (dragAllowedAxises.allowX && !dragAllowedAxises.allowY) {
                $image.addClass('reset-transition-x');
            } else if (!dragAllowedAxises.allowX && dragAllowedAxises.allowY) {
                $image.addClass('reset-transition-y');
            }
        }, 550);
    }

    /**
     * @desc apply scale3d to image and translate to image wrap
     * @param {style} X,Y and scale
     */
    setZoomStyles(
        style: { x: number; y: number; scale: number },
        possibleSwipeCords?: any,
        dragAllowedAxises?: any,
    ): void {
        const { allowY, allowX } = dragAllowedAxises;
        const $imageWrap = this.core
            .getSlideItem(this.core.index)
            .find('.lg-img-wrap')
            .first();
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first();
        const $dummyImage = this.core.outer
            .find('.lg-current .lg-dummy-img')
            .first();
        this.scale = style.scale;
        $image.css(
            'transform',
            'scale3d(' + style.scale + ', ' + style.scale + ', 1)',
        );

        $dummyImage.css(
            'transform',
            'scale3d(' + style.scale + ', ' + style.scale + ', 1)',
        );

        const transform =
            'translate3d(' + style.x + 'px, ' + style.y + 'px, 0)';
        $imageWrap.css('transform', transform);

        this.left = style.x;
        this.top = style.y;
    }

    /**
     * @param index - Index of the current slide
     * @param event - event will be available only if the function is called on clicking/taping the imags
     */
    setActualSize(index: number, event?: ZoomTouchEvent): void {
        const currentItem = this.core.galleryItems[this.core.index];
        this.resetImageTranslate();
        setTimeout(() => {
            // Allow zoom only on image
            if (
                !currentItem.src ||
                this.core.outer.hasClass('lg-first-slide-loading')
            ) {
                return;
            }
            const scale = this.getCurrentImageActualSizeScale();
            if (this.core.outer.hasClass('lg-zoomed')) {
                this.scale = 1;
            } else {
                this.scale = this.getScale(scale);
            }
            this.setPageCords(event);

            this.beginZoom(this.scale);
            this.zoomImage(this.scale);

            if (this.scale >= scale) {
                this.setZoomImageSize(this.scale);
            }

            setTimeout(() => {
                this.core.outer.removeClass('lg-grabbing').addClass('lg-grab');
            }, 10);
        }, 50);
    }

    getNaturalWidth(index: number): number {
        const $image = this.core.getSlideItem(index).find('.lg-image').first();

        const naturalWidth = this.core.galleryItems[index].width;
        return naturalWidth
            ? parseFloat(naturalWidth)
            : undefined || ($image.get() as any).naturalWidth;
    }

    getActualSizeScale(naturalWidth: number, width: number): number {
        let _scale;
        let scale;
        if (naturalWidth >= width) {
            _scale = naturalWidth / width;
            scale = _scale || 2;
        } else {
            scale = 1;
        }
        return scale;
    }

    getCurrentImageActualSizeScale(): number {
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first();
        const width = $image.get().offsetWidth;
        const naturalWidth = this.getNaturalWidth(this.core.index) || width;
        return this.getActualSizeScale(naturalWidth, width);
    }

    getPageCords(event?: ZoomTouchEvent): Coords {
        const cords: Coords = {} as Coords;
        if (event) {
            cords.x = event.pageX || event.targetTouches[0].pageX;
            cords.y = event.pageY || event.targetTouches[0].pageY;
        } else {
            const containerRect = this.core.$content
                .get()
                .getBoundingClientRect();
            cords.x = containerRect.width / 2 + containerRect.left;
            cords.y =
                containerRect.height / 2 + this.scrollTop + containerRect.top;
        }
        return cords;
    }

    setPageCords(event?: ZoomTouchEvent): void {
        const pageCords = this.getPageCords(event);

        this.pageX = pageCords.x;
        this.pageY = pageCords.y;
    }

    manageActualPixelClassNames(): void {
        const $actualSize = this.core.getElementById('lg-actual-size');
        $actualSize
            .removeClass(this.settings.actualSizeIcons.zoomIn)
            .addClass(this.settings.actualSizeIcons.zoomOut);
    }

    // If true, zoomed - in else zoomed out
    beginZoom(scale: number): boolean {
        this.core.outer.removeClass('lg-zoom-drag-transition lg-zoom-dragging');
        if (scale > 1) {
            this.core.outer.addClass('lg-zoomed');
            this.manageActualPixelClassNames();
        } else {
            this.resetZoom();
        }
        return scale > 1;
    }

    getScale(scale: number): number {
        const actualSizeScale = this.getCurrentImageActualSizeScale();
        if (scale < 1) {
            scale = 1;
        } else if (scale > actualSizeScale) {
            scale = actualSizeScale;
        }
        return scale;
    }

    init(): void {
        if (!this.settings.zoom) {
            return;
        }
        this.buildTemplates();
        this.enableZoomOnSlideItemLoad();

        let tapped: ReturnType<typeof setTimeout> | null = null;

        this.core.outer.on('dblclick.lg', (event) => {
            if (!this.$LG(event.target).hasClass('lg-image')) {
                return;
            }
            this.setActualSize(this.core.index, event);
        });

        this.core.outer.on('touchstart.lg', (event) => {
            const $target = this.$LG(event.target);
            if (
                event.targetTouches.length === 1 &&
                $target.hasClass('lg-image')
            ) {
                if (!tapped) {
                    tapped = setTimeout(() => {
                        tapped = null;
                    }, 300);
                } else {
                    clearTimeout(tapped);
                    tapped = null;
                    event.preventDefault();
                    this.setActualSize(this.core.index, event);
                }
            }
        });

        // Update zoom on resize and orientationchange
        this.core.LGel.on(
            `${lGEvents.containerResize}.zoom ${lGEvents.rotateRight}.zoom ${lGEvents.rotateLeft}.zoom ${lGEvents.flipHorizontal}.zoom ${lGEvents.flipVertical}.zoom`,
            () => {
                if (!this.core.lgOpened || !this.isImageSlide()) return;
                this.setPageCords();
                this.setZoomEssentials();
                if (this.scale > 1) {
                    this.zoomImage(this.scale);
                }
            },
        );
        // Update zoom on resize and orientationchange
        this.$LG(window).on(`scroll.lg.zoom.global${this.core.lgId}`, () => {
            if (!this.core.lgOpened) return;
            this.scrollTop = this.$LG(window).scrollTop();
        });

        this.core.getElementById('lg-zoom-out').on('click.lg', () => {
            // Allow zoom only on image
            if (!this.isImageSlide()) {
                return;
            }

            let scale = this.scale - this.settings.scale;
            let timeout = 0;
            if (this.imageReset) {
                this.resetImageTranslate();
                timeout = 50;
            }
            setTimeout(() => {
                if (scale < 1) {
                    scale = 1;
                }
                this.beginZoom(scale);
                this.zoomImage(scale);
            }, timeout);
        });

        this.core.getElementById('lg-zoom-in').on('click.lg', () => {
            this.zoomIn();
        });

        this.core.getElementById('lg-actual-size').on('click.lg', () => {
            this.setActualSize(this.core.index);
        });

        this.core.LGel.on(`${lGEvents.beforeOpen}.zoom`, () => {
            this.core.outer.find('.lg-item').removeClass('lg-zoomable');
        });
        this.core.LGel.on(`${lGEvents.afterOpen}.zoom`, () => {
            this.scrollTop = this.$LG(window).scrollTop();

            // Set the initial value center
            this.pageX = this.core.outer.width() / 2;
            this.pageY = this.core.outer.height() / 2 + this.scrollTop;

            this.scale = 1;
        });

        // Reset zoom on slide change
        this.core.LGel.on(
            `${lGEvents.afterSlide}.zoom`,
            (event: CustomEvent) => {
                const { prevIndex } = event.detail;
                this.scale = 1;
                this.positionChanged = false;
                this.resetZoom(prevIndex);
                if (this.isImageSlide()) {
                    this.setZoomEssentials();
                }
            },
        );

        // Drag option after zoom
        this.zoomDrag();

        this.pinchZoom();

        this.zoomSwipe();

        // Store the zoomable timeout value just to clear it while closing
        this.zoomableTimeout = false;
        this.positionChanged = false;
    }

    zoomIn(): void {
        // Allow zoom only on image
        if (!this.isImageSlide()) {
            return;
        }

        let scale = this.scale + this.settings.scale;

        scale = this.getScale(scale);
        this.beginZoom(scale);
        this.zoomImage(scale);
    }

    // Reset zoom effect
    resetZoom(index?: number): void {
        this.core.outer.removeClass('lg-zoomed lg-zoom-drag-transition');
        const $actualSize = this.core.getElementById('lg-actual-size');
        const $item = this.core.getSlideItem(
            index !== undefined ? index : this.core.index,
        );
        $actualSize
            .removeClass(this.settings.actualSizeIcons.zoomOut)
            .addClass(this.settings.actualSizeIcons.zoomIn);
        $item.find('.lg-img-wrap').first().removeAttr('style');
        $item.find('.lg-image').first().removeAttr('style');
        this.scale = 1;
        this.left = 0;
        this.top = 0;

        // Reset pagx pagy values to center
        this.setPageCords();
    }

    getTouchDistance(e: TouchEvent): number {
        return Math.sqrt(
            (e.targetTouches[0].pageX - e.targetTouches[1].pageX) *
                (e.targetTouches[0].pageX - e.targetTouches[1].pageX) +
                (e.targetTouches[0].pageY - e.targetTouches[1].pageY) *
                    (e.targetTouches[0].pageY - e.targetTouches[1].pageY),
        );
    }

    pinchZoom(): void {
        let startDist = 0;
        let pinchStarted = false;
        let initScale = 1;

        let $item = this.core.getSlideItem(this.core.index);

        this.core.$inner.on('touchstart.lg', (e) => {
            $item = this.core.getSlideItem(this.core.index);
            if (!this.isImageSlide()) {
                return;
            }
            if (
                e.targetTouches.length === 2 &&
                !this.core.outer.hasClass('lg-first-slide-loading') &&
                (this.$LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))
            ) {
                initScale = this.scale || 1;
                this.core.outer.removeClass(
                    'lg-zoom-drag-transition lg-zoom-dragging',
                );

                this.resetImageTranslate();

                this.core.touchAction = 'pinch';

                startDist = this.getTouchDistance(e);
            }
        });

        this.core.$inner.on('touchmove.lg', (e) => {
            if (
                e.targetTouches.length === 2 &&
                this.core.touchAction === 'pinch' &&
                (this.$LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))
            ) {
                e.preventDefault();
                const endDist = this.getTouchDistance(e);

                const distance = startDist - endDist;
                if (!pinchStarted && Math.abs(distance) > 5) {
                    pinchStarted = true;
                }
                if (pinchStarted) {
                    this.scale = Math.max(1, initScale + -distance * 0.008);

                    this.zoomImage(this.scale);
                }
            }
        });

        this.core.$inner.on('touchend.lg', (e) => {
            if (
                this.core.touchAction === 'pinch' &&
                (this.$LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))
            ) {
                pinchStarted = false;
                startDist = 0;
                if (this.scale <= 1) {
                    this.resetZoom();
                } else {
                    this.scale = this.getScale(this.scale);
                    this.zoomImage(this.scale);
                    this.manageActualPixelClassNames();

                    const actualSizeScale = this.getCurrentImageActualSizeScale();

                    if (this.scale >= actualSizeScale) {
                        this.setZoomImageSize(this.scale);
                    }

                    this.core.outer.addClass('lg-zoomed');
                }
                this.core.touchAction = undefined;
            }
        });
    }

    touchendZoom(
        startCoords: Coords,
        endCoords: Coords,
        allowX: boolean,
        allowY: boolean,
        touchDuration: number,
        rotateValue: number,
    ): void {
        let distanceXnew = endCoords.x - startCoords.x;
        let distanceYnew = endCoords.y - startCoords.y;

        let speedX = Math.abs(distanceXnew) / touchDuration + 1;
        let speedY = Math.abs(distanceYnew) / touchDuration + 1;

        if (speedX > 2) {
            speedX += 1;
        }

        if (speedY > 2) {
            speedY += 1;
        }

        distanceXnew = distanceXnew * speedX;
        distanceYnew = distanceYnew * speedY;

        const _LGel = this.core
            .getSlideItem(this.core.index)
            .find('.lg-img-wrap')
            .first();
        const distance: Coords = {} as Coords;

        distance.x = this.left + distanceXnew * this.modifierX;
        distance.y = this.top + distanceYnew * this.modifierY;

        const possibleSwipeCords = this.getPossibleSwipeDragCords(
            rotateValue,
            1,
        );

        if (Math.abs(distanceXnew) > 15 || Math.abs(distanceYnew) > 15) {
            if (allowY) {
                if (
                    this.isBeyondPossibleTop(
                        distance.y,
                        possibleSwipeCords.minY,
                    )
                ) {
                    distance.y = possibleSwipeCords.minY;
                } else if (
                    this.isBeyondPossibleBottom(
                        distance.y,
                        possibleSwipeCords.maxY,
                    )
                ) {
                    distance.y = possibleSwipeCords.maxY;
                }
            }

            if (allowX) {
                if (
                    this.isBeyondPossibleLeft(
                        distance.x,
                        possibleSwipeCords.minX,
                    )
                ) {
                    distance.x = possibleSwipeCords.minX;
                } else if (
                    this.isBeyondPossibleRight(
                        distance.x,
                        possibleSwipeCords.maxX,
                    )
                ) {
                    distance.x = possibleSwipeCords.maxX;
                }
            }

            if (allowY) {
                this.top = distance.y;
            } else {
                distance.y = this.top;
            }

            if (allowX) {
                this.left = distance.x;
            } else {
                distance.x = this.left;
            }

            this.setZoomSwipeStyles(_LGel, distance);

            this.positionChanged = true;
        }
    }

    getZoomSwipeCords(
        startCoords: Coords,
        endCoords: Coords,
        allowX: boolean,
        allowY: boolean,
        possibleSwipeCords: PossibleCords,
    ): Coords {
        const distance: Coords = {} as Coords;
        if (allowY) {
            distance.y =
                this.top + (endCoords.y - startCoords.y) * this.modifierY;
            if (this.isBeyondPossibleTop(distance.y, possibleSwipeCords.minY)) {
                const diffMinY = possibleSwipeCords.minY - distance.y;
                distance.y = possibleSwipeCords.minY - diffMinY / 6;
            } else if (
                this.isBeyondPossibleBottom(distance.y, possibleSwipeCords.maxY)
            ) {
                const diffMaxY = distance.y - possibleSwipeCords.maxY;
                distance.y = possibleSwipeCords.maxY + diffMaxY / 6;
            }
        } else {
            distance.y = this.top;
        }

        if (allowX) {
            distance.x =
                this.left + (endCoords.x - startCoords.x) * this.modifierX;
            if (
                this.isBeyondPossibleLeft(distance.x, possibleSwipeCords.minX)
            ) {
                const diffMinX = possibleSwipeCords.minX - distance.x;
                distance.x = possibleSwipeCords.minX - diffMinX / 6;
            } else if (
                this.isBeyondPossibleRight(distance.x, possibleSwipeCords.maxX)
            ) {
                const difMaxX = distance.x - possibleSwipeCords.maxX;
                distance.x = possibleSwipeCords.maxX + difMaxX / 6;
            }
        } else {
            distance.x = this.left;
        }

        return distance;
    }

    private isBeyondPossibleLeft(x: number, minX: number) {
        return x >= minX;
    }
    private isBeyondPossibleRight(x: number, maxX: number) {
        return x <= maxX;
    }
    private isBeyondPossibleTop(y: number, minY: number) {
        return y >= minY;
    }
    private isBeyondPossibleBottom(y: number, maxY: number) {
        return y <= maxY;
    }

    isImageSlide(): boolean {
        const currentItem = this.core.galleryItems[this.core.index];
        return this.core.getSlideType(currentItem) === 'image';
    }

    getPossibleSwipeDragCords(
        rotateValue: number,
        scale?: number,
    ): PossibleCords {
        const dataScale = scale || this.scale || 1;
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first();
        const elDataScale = $image.hasClass('no-transition')
            ? 1
            : Math.abs(dataScale);

        const { top, bottom } = this.core.mediaContainerPosition;

        const topBottomSpacing = 0;

        // SCale should not conside if transition is reset

        this.imageYSize = this.getImageSize(
            $image.get() as HTMLImageElement,
            this.rotateValue,
            'y',
        );
        this.imageXSize = this.getImageSize(
            $image.get() as HTMLImageElement,
            this.rotateValue,
            'x',
        );

        const minY =
            (this.imageYSize * elDataScale - this.containerRect.height) / 2;
        const maxY =
            (this.containerRect.height - this.imageYSize * elDataScale) / 2 +
            bottom;

        const minX =
            (this.imageXSize * elDataScale - this.containerRect.width) / 2;

        const maxX =
            (this.containerRect.width - this.imageXSize * elDataScale) / 2;

        const possibleSwipeCords = {
            minY: minY,
            maxY: maxY,
            minX: minX,
            maxX: maxX,
        };
        return possibleSwipeCords;
    }

    getStaticPossibleSwipeDragCords(scale?: number): PossibleCords {
        const dataScale = scale || this.scale || 1;
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first();
        const elDataScale = $image.hasClass('no-transition')
            ? 1
            : Math.abs(dataScale);

        const { top, bottom } = this.core.mediaContainerPosition;

        const topBottomSpacing = 0;

        // SCale should not conside if transition is reset
        const imageYSize = $image.get().offsetHeight;
        const imageXSize = $image.get().offsetWidth;

        const minY = (imageYSize * elDataScale - this.containerRect.height) / 2;
        const maxY =
            (this.containerRect.height - imageYSize * elDataScale) / 2 + bottom;

        const minX = (imageXSize * elDataScale - this.containerRect.width) / 2;

        const maxX = (this.containerRect.width - imageXSize * elDataScale) / 2;

        const possibleSwipeCords = {
            minY: minY,
            maxY: maxY,
            minX: minX,
            maxX: maxX,
        };
        return possibleSwipeCords;
    }

    setZoomSwipeStyles(
        LGel: lgQuery,
        distance: { x: number; y: number },
    ): void {
        LGel.css(
            'transform',
            'translate3d(' + distance.x + 'px, ' + distance.y + 'px, 0)',
        );
    }

    zoomSwipe(): void {
        let startCoords = {} as Coords;
        let endCoords = {} as Coords;
        let isMoved = false;

        // Allow x direction drag
        let allowX = false;

        // Allow Y direction drag
        let allowY = false;

        let startTime: Date = new Date();
        let endTime: Date = new Date();
        let possibleSwipeCords: PossibleCords;

        let _LGel: lgQuery;

        let $item = this.core.getSlideItem(this.core.index);

        this.core.$inner.on('touchstart.lg', (e) => {
            // Allow zoom only on image
            if (!this.isImageSlide()) {
                return;
            }
            $item = this.core.getSlideItem(this.core.index);
            if (
                (this.$LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target)) &&
                e.targetTouches.length === 1 &&
                this.core.outer.hasClass('lg-zoomed')
            ) {
                e.preventDefault();
                startTime = new Date();
                this.core.touchAction = 'zoomSwipe';
                _LGel = this.core
                    .getSlideItem(this.core.index)
                    .find('.lg-img-wrap')
                    .first();

                const dragAllowedAxises = this.getDragAllowedAxises();

                allowY = dragAllowedAxises.allowY;
                allowX = dragAllowedAxises.allowX;
                if (allowX || allowY) {
                    startCoords = this.getSwipeCords(
                        e,
                        Math.abs(this.rotateValue),
                    );
                }

                possibleSwipeCords = this.getPossibleSwipeDragCords(
                    this.rotateValue,
                    1,
                );

                // reset opacity and transition duration
                this.core.outer.addClass(
                    'lg-zoom-dragging lg-zoom-drag-transition',
                );
            }
        });

        this.core.$inner.on('touchmove.lg', (e) => {
            if (
                e.targetTouches.length === 1 &&
                this.core.touchAction === 'zoomSwipe' &&
                (this.$LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))
            ) {
                e.preventDefault();
                this.core.touchAction = 'zoomSwipe';

                endCoords = this.getSwipeCords(e, Math.abs(this.rotateValue));

                const distance = this.getZoomSwipeCords(
                    startCoords,
                    endCoords,
                    allowX,
                    allowY,
                    possibleSwipeCords,
                );

                if (
                    Math.abs(endCoords.x - startCoords.x) > 15 ||
                    Math.abs(endCoords.y - startCoords.y) > 15
                ) {
                    isMoved = true;
                    this.setZoomSwipeStyles(_LGel, distance);
                }
            }
        });

        this.core.$inner.on('touchend.lg', (e) => {
            if (
                this.core.touchAction === 'zoomSwipe' &&
                (this.$LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))
            ) {
                this.core.touchAction = undefined;
                this.core.outer.removeClass('lg-zoom-dragging');
                if (!isMoved) {
                    return;
                }
                isMoved = false;
                endTime = new Date();
                const touchDuration = endTime.valueOf() - startTime.valueOf();
                this.touchendZoom(
                    startCoords,
                    endCoords,
                    allowX,
                    allowY,
                    touchDuration,
                    this.rotateValue,
                );
            }
        });
    }

    zoomDrag(): void {
        let startCoords: Coords = {} as Coords;
        let endCoords: Coords = {} as Coords;
        let isDragging = false;
        let isMoved = false;

        // Allow x direction drag
        let allowX = false;

        // Allow Y direction drag
        let allowY = false;

        let startTime: number | Date;
        let endTime;

        let possibleSwipeCords: PossibleCords;

        let _LGel: lgQuery;

        this.core.outer.on('mousedown.lg.zoom', (e) => {
            // Allow zoom only on image
            if (!this.isImageSlide()) {
                return;
            }
            const $item = this.core.getSlideItem(this.core.index);
            if (
                this.$LG(e.target).hasClass('lg-item') ||
                $item.get().contains(e.target)
            ) {
                startTime = new Date();
                _LGel = this.core
                    .getSlideItem(this.core.index)
                    .find('.lg-img-wrap')
                    .first();

                const dragAllowedAxises = this.getDragAllowedAxises();

                allowY = dragAllowedAxises.allowY;
                allowX = dragAllowedAxises.allowX;

                if (this.core.outer.hasClass('lg-zoomed')) {
                    if (
                        this.$LG(e.target).hasClass('lg-object') &&
                        (allowX || allowY)
                    ) {
                        e.preventDefault();
                        startCoords = this.getDragCords(
                            e,
                            Math.abs(this.rotateValue),
                        );

                        possibleSwipeCords = this.getPossibleSwipeDragCords(
                            this.rotateValue,
                            1,
                        );

                        isDragging = true;

                        // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                        this.core.outer.get().scrollLeft += 1;
                        this.core.outer.get().scrollLeft -= 1;

                        this.core.outer
                            .removeClass('lg-grab')
                            .addClass(
                                'lg-grabbing lg-zoom-drag-transition lg-zoom-dragging',
                            );
                        // reset opacity and transition duration
                    }
                }
            }
        });

        this.$LG(window).on(
            `mousemove.lg.zoom.global${this.core.lgId}`,
            (e) => {
                if (isDragging) {
                    isMoved = true;
                    endCoords = this.getDragCords(
                        e,
                        Math.abs(this.rotateValue),
                    );

                    const distance = this.getZoomSwipeCords(
                        startCoords,
                        endCoords,
                        allowX,
                        allowY,
                        possibleSwipeCords,
                    );

                    this.setZoomSwipeStyles(_LGel, distance);
                }
            },
        );

        this.$LG(window).on(`mouseup.lg.zoom.global${this.core.lgId}`, (e) => {
            if (isDragging) {
                endTime = new Date();
                isDragging = false;
                this.core.outer.removeClass('lg-zoom-dragging');

                // Fix for chrome mouse move on click
                if (
                    isMoved &&
                    (startCoords.x !== endCoords.x ||
                        startCoords.y !== endCoords.y)
                ) {
                    endCoords = this.getDragCords(
                        e,
                        Math.abs(this.rotateValue),
                    );

                    const touchDuration =
                        endTime.valueOf() - startTime.valueOf();
                    this.touchendZoom(
                        startCoords,
                        endCoords,
                        allowX,
                        allowY,
                        touchDuration,
                        this.rotateValue,
                    );
                }

                isMoved = false;
            }

            this.core.outer.removeClass('lg-grabbing').addClass('lg-grab');
        });
    }

    closeGallery(): void {
        this.resetZoom();
    }

    destroy(): void {
        // Unbind all events added by lightGallery zoom plugin
        this.$LG(window).off(`.lg.zoom.global${this.core.lgId}`);
        this.core.LGel.off('.lg.zoom');
        this.core.LGel.off('.zoom');
        clearTimeout(this.zoomableTimeout);
        this.zoomableTimeout = false;
    }
}
