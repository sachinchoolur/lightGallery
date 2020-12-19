import { ZoomDefaults, zoomDefaults } from './lg-zoom-settings';
import { LG, lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
interface Coords {
    x: number;
    y: number;
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
export class Zoom {
    private core: LightGallery;
    private s: ZoomDefaults;
    zoomableTimeout: any;
    positionChanged!: boolean;
    pageX!: number;
    pageY!: number;
    scale!: number;
    constructor(instance: LightGallery) {
        this.core = instance;

        this.s = Object.assign({}, zoomDefaults);

        if (this.s.zoom && this.core.doCss()) {
            this.init();

            // Store the zoomable timeout value just to clear it while closing
            this.zoomableTimeout = false;
            this.positionChanged = false;

            // Set the initial value center
            this.pageX = this.core.outer.width() / 2;
            this.pageY = this.core.outer.height() / 2 + LG(window).scrollTop();

            this.scale = 1;
        }

        return this;
    }

    // Append Zoom controls. Actual size, Zoom-in, Zoom-out
    buildTemplates(): void {
        let zoomIcons =
            '<span class="lg-zoom-in lg-icon"></span><span class="lg-zoom-out lg-icon"></span>';

        if (this.s.actualSize) {
            zoomIcons += '<span class="lg-actual-size lg-icon"></span>';
        }

        // CSS transition performace is poor in Chrome version < 54
        // So use CSS left property for zoom transition.
        if (this.s.useLeftForZoom) {
            this.core.outer.addClass('lg-use-left-for-zoom');
        } else {
            this.core.outer.addClass('lg-use-transition-for-zoom');
        }

        this.core.outer.find('.lg-toolbar').first().append(zoomIcons);
    }

    /**
     * @desc Enable zoom option only once the image is completely loaded
     * If zoomFromImage is true, Zoom is enabled once the dummy image has been inserted
     *
     * Zoom styles are defined under lg-zoomable CSS class.
     */
    enableZoom(event: CustomEvent): void {
        // delay will be 0 except first time
        let _speed = this.s.enableZoomAfter + event.detail.delay;

        // set _speed value 0 if gallery opened from direct url and if it is first slide
        if (LG('body').first().hasClass('lg-from-hash') && event.detail.delay) {
            // will execute only once
            _speed = 0;
        } else {
            // Remove lg-from-hash to enable starting animation.
            LG('body').first().removeClass('lg-from-hash');
        }

        this.zoomableTimeout = setTimeout(() => {
            this.core.getSlideItem(event.detail.index).addClass('lg-zoomable');
        }, _speed + 30);
    }

    enableZoomOnSlideItemLoad(): void {
        // Add zoomable class
        this.core.LGel.on(
            'onSlideItemLoad.lg.tm.zoom',
            this.enableZoom.bind(this),
        );
    }

    /**
     * @desc Image zoom
     * Translate the wrap and scale the image to get better user experience
     *
     * @param {String} scale - Zoom decrement/increment value
     */
    zoomImage(scale: number): void {
        const $image = this.core.outer.find('.lg-current .lg-image').first();
        const imageNode = $image.get();
        if (!imageNode) return;

        // Find offset manually to avoid issue after zoom
        const offsetX = (this.core.outer.width() - imageNode.offsetWidth) / 2;
        const offsetY =
            (this.core.outer.height() - imageNode.offsetHeight) / 2 +
            LG(window).scrollTop();

        let originalX;
        let originalY;

        if (scale === 1) {
            this.positionChanged = false;
        }

        if (this.positionChanged) {
            originalX =
                parseFloat($image.parent().attr('data-x')) /
                (parseFloat($image.attr('data-scale')) - 1);
            originalY =
                parseFloat($image.parent().attr('data-y')) /
                (parseFloat($image.attr('data-scale')) - 1);

            this.pageX = originalX + offsetX;
            this.pageY = originalY + offsetY;

            this.positionChanged = false;
        }

        const _x = this.pageX - offsetX;
        const _y = this.pageY - offsetY;

        const x = (scale - 1) * _x;
        const y = (scale - 1) * _y;

        this.setZoomStyles({
            x: x,
            y: y,
            scale: scale,
        });
    }

    /**
     * @desc apply scale3d to image and translate to image wrap
     * @param {style} X,Y and scale
     */
    setZoomStyles(style: { x: number; y: number; scale: number }): void {
        const $image = this.core.outer.find('.lg-current .lg-image').first();
        const $dummyImage = this.core.outer
            .find('.lg-current .lg-dummy-img')
            .first();
        const $imageWrap = $image.parent();

        $image
            .attr('data-scale', style.scale + '')
            .css(
                'transform',
                'scale3d(' + style.scale + ', ' + style.scale + ', 1)',
            );

        $dummyImage.css(
            'transform',
            'scale3d(' + style.scale + ', ' + style.scale + ', 1)',
        );

        if (this.s.useLeftForZoom) {
            $imageWrap.css('left', -style.x + 'px');
            $imageWrap.css('top', -style.y + 'px');
        } else {
            const transform =
                'translate3d(-' + style.x + 'px, -' + style.y + 'px, 0)';
            $imageWrap.css('transform', transform);
        }

        $imageWrap.attr('data-x', style.x).attr('data-y', style.y);
    }

    /**
     * @param index - Index of the current slide
     * @param event - event will be available only if the function is called on clicking/taping the imags
     */
    setActualSize(index: number, event?: ZoomTouchEvent): void {
        const $image = this.core.getSlideItem(index).find('.lg-image').first();
        const width = $image.get().offsetWidth;
        const naturalWidth = this.getNaturalWidth(index) || width;
        const scale = this.getActualSizeScale(naturalWidth, width);
        if (this.core.outer.hasClass('lg-zoomed')) {
            this.scale = 1;
        } else {
            this.scale = this.getScale(scale);
        }
        this.setPageCords(event);

        this.beginZoom(this.scale);
        this.zoomImage(this.scale);

        setTimeout(() => {
            this.core.outer.removeClass('lg-grabbing').addClass('lg-grab');
        }, 10);
    }

    getNaturalWidth(index: number): number {
        const $image = this.core.getSlideItem(index).find('.lg-image').first();
        let naturalWidth;

        // @todo if possible remove dynamic check
        if (this.core.s.dynamic) {
            naturalWidth = this.core.s.dynamicEl[index].width;
        } else {
            naturalWidth = LG(this.core.items).eq(index).attr('data-width');
        }
        return naturalWidth || $image.get().naturalWidth;
    }

    getActualSizeScale(naturalWidth: number, width: number): number {
        let _scale;
        let scale;
        if (naturalWidth > width) {
            _scale = naturalWidth / width;
            scale = _scale || 2;
        } else {
            scale = 1;
        }
        return scale;
    }

    getPageCords(event?: ZoomTouchEvent): Coords {
        const cords: Coords = {} as Coords;
        if (event) {
            cords.x = event.pageX || event.targetTouches[0].pageX;
            cords.y = event.pageY || event.targetTouches[0].pageY;
        } else {
            cords.x = this.core.outer.width() / 2;
            cords.y = this.core.outer.height() / 2 + LG(window).scrollTop();
        }
        return cords;
    }

    setPageCords(event?: ZoomTouchEvent): void {
        const pageCords = this.getPageCords(event);

        this.pageX = pageCords.x;
        this.pageY = pageCords.y;
    }

    beginZoom(scale: number): void {
        this.core.outer.removeClass('lg-zoom-drag-transition');
        if (scale > 1) {
            this.core.outer.addClass('lg-zoomed');
        } else {
            this.resetZoom();
        }
    }

    getScale(scale: number): number {
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first();
        const width = $image.get().offsetWidth;
        const naturalWidth = this.getNaturalWidth(this.core.index) || width;
        const actualSizeScale = this.getActualSizeScale(naturalWidth, width);
        if (scale < 1) {
            scale = 1;
        } else if (scale > actualSizeScale) {
            scale = actualSizeScale;
        }
        return scale;
    }

    init(): void {
        this.buildTemplates();
        this.enableZoomOnSlideItemLoad();

        let tapped: ReturnType<typeof setTimeout> | null = null;

        this.core.outer.on('dblclick', (event) => {
            if (!LG(event.target).hasClass('lg-image')) {
                return;
            }
            this.setActualSize(this.core.index, event);
        });

        this.core.outer.on('touchstart', (event) => {
            const $target = LG(event.target);
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
                    this.setActualSize(this.core.index, event);
                }

                event.preventDefault();
            }
        });

        // Update zoom on resize and orientationchange
        LG(window).on('resize.lg.zoom orientationchange.lg.zoom', () => {
            if (!this.core.lgOpened) return;
            this.setPageCords();
            this.zoomImage(this.scale);
        });

        this.core.outer
            .find('.lg-zoom-out')
            .first()
            .on('click.lg', () => {
                if (this.core.outer.find('.lg-current .lg-image').first()) {
                    this.scale -= this.s.scale;

                    this.scale = this.getScale(this.scale);
                    this.beginZoom(this.scale);
                    this.zoomImage(this.scale);
                }
            });

        this.core.outer
            .find('.lg-zoom-in')
            .first()
            .on('click.lg', () => {
                if (this.core.outer.find('.lg-current .lg-image').first()) {
                    this.scale += this.s.scale;

                    this.scale = this.getScale(this.scale);
                    this.beginZoom(this.scale);
                    this.zoomImage(this.scale);
                }
            });

        this.core.outer
            .find('.lg-actual-size')
            .first()
            .on('click.lg', () => {
                this.setActualSize(this.core.index);
            });

        this.core.LGel.on('onBeforeOpen.lg.tm', () => {
            this.core.outer.find('.lg-item').first().removeClass('lg-zoomable');
        });

        // Reset zoom on slide change
        this.core.LGel.on('onBeforeSlide.lg', () => {
            this.scale = 1;
            this.resetZoom();
        });

        // Drag option after zoom
        this.zoomDrag();

        this.pinchZoom();

        this.zoomSwipe();
    }

    // Reset zoom effect
    resetZoom(): void {
        this.core.outer.removeClass('lg-zoomed lg-zoom-drag-transition');
        this.core.outer
            .find('.lg-img-wrap')
            .first()
            .removeAttr('style data-x data-y');
        this.core.outer
            .find('.lg-image')
            .first()
            .removeAttr('style data-scale');

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

        const inner = LG(`#${this.core.getById('lg-inner')}`);
        let $item = this.core.getSlideItem(this.core.index);

        inner.on('touchstart.lg', (e) => {
            $item = this.core.getSlideItem(this.core.index);
            if (
                e.targetTouches.length === 2 &&
                (LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))
            ) {
                initScale = this.scale || 1;
                this.core.outer.removeClass(
                    'lg-zoom-drag-transition lg-zoom-dragging',
                );

                this.core.touchAction = 'pinch';

                startDist = this.getTouchDistance(e);
            }
        });

        inner.on('touchmove.lg', (e) => {
            if (
                e.targetTouches.length === 2 &&
                this.core.touchAction === 'pinch' &&
                (LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))
            ) {
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

        inner.on('touchend.lg', (e) => {
            if (
                this.core.touchAction === 'pinch' &&
                (LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))
            ) {
                pinchStarted = false;
                startDist = 0;
                if (this.scale <= 1) {
                    this.resetZoom();
                } else {
                    this.scale = this.getScale(this.scale);
                    this.zoomImage(this.scale);

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
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-object')
            .first();
        const dataX = parseFloat(_LGel.attr('data-x')) || 0;
        const dataY = parseFloat(_LGel.attr('data-y')) || 0;
        const distance: Coords = {} as Coords;

        distance.x = -Math.abs(dataX) + distanceXnew;
        distance.y = -Math.abs(dataY) + distanceYnew;

        const $cont = this.core.outer.find('.lg');
        const possibleSwipeCords = this.getPossibleSwipeCords($image, $cont);

        if (Math.abs(distanceXnew) > 15 || Math.abs(distanceYnew) > 15) {
            if (allowY) {
                if (distance.y <= -possibleSwipeCords.maxY) {
                    distance.y = -possibleSwipeCords.maxY;
                } else if (distance.y >= -possibleSwipeCords.minY) {
                    distance.y = -possibleSwipeCords.minY;
                }
            }

            if (allowX) {
                if (distance.x <= -possibleSwipeCords.maxX) {
                    distance.x = -possibleSwipeCords.maxX;
                } else if (distance.x >= -possibleSwipeCords.minX) {
                    distance.x = -possibleSwipeCords.minX;
                }
            }

            if (allowY) {
                _LGel.attr('data-y', Math.abs(distance.y));
            } else {
                const dataY = parseFloat(_LGel.attr('data-y')) || 0;

                distance.y = -Math.abs(dataY);
            }

            if (allowX) {
                _LGel.attr('data-x', Math.abs(distance.x));
            } else {
                const dataX = parseFloat(_LGel.attr('data-x')) || 0;
                distance.x = -Math.abs(dataX);
            }

            this.setZoomSwipeStyles(_LGel, distance);

            this.positionChanged = true;
        }
    }

    getZoomSwipeCords(
        startCoords: Coords,
        endCoords: Coords,
        allowX: any,
        allowY: any,
        possibleSwipeCords: PossibleCords,
        dataY: number,
        dataX: number,
    ): Coords {
        const distance: Coords = {} as Coords;
        if (allowY) {
            distance.y = -Math.abs(dataY) + (endCoords.y - startCoords.y);

            if (distance.y <= -possibleSwipeCords.maxY) {
                const diffMaxY = -possibleSwipeCords.maxY - distance.y;
                distance.y = -possibleSwipeCords.maxY - diffMaxY / 6;
            } else if (distance.y >= -possibleSwipeCords.minY) {
                const diffMinY = distance.y - -possibleSwipeCords.minY;
                distance.y = -possibleSwipeCords.minY + diffMinY / 6;
            }
        } else {
            distance.y = -Math.abs(dataY);
        }

        if (allowX) {
            distance.x = -Math.abs(dataX) + (endCoords.x - startCoords.x);
            if (distance.x <= -possibleSwipeCords.maxX) {
                const diffMaxX = -possibleSwipeCords.maxX - distance.x;
                distance.x = -possibleSwipeCords.maxX - diffMaxX / 6;
            } else if (distance.x >= -possibleSwipeCords.minX) {
                const diffMinX = distance.x - -possibleSwipeCords.minX;
                distance.x = -possibleSwipeCords.minX + diffMinX / 6;
            }
        } else {
            distance.x = -Math.abs(dataX);
        }

        return distance;
    }

    getPossibleSwipeCords(LGel: lgQuery, $cont: lgQuery): PossibleCords {
        const possibleCords: PossibleCords = {} as PossibleCords;

        const contHeight = $cont.height();
        const contWidth = $cont.width();

        const elInnerHeight = LGel.get().offsetHeight;
        const elInnerWidth = LGel.get().offsetWidth;
        const dataY = parseFloat(LGel.attr('data-scale')) || 1;
        const elDataScale = Math.abs(dataY);

        possibleCords.minY = (contHeight - elInnerHeight) / 2;
        possibleCords.maxY = Math.abs(
            elInnerHeight * elDataScale - contHeight + possibleCords.minY,
        );

        possibleCords.minX = (contWidth - elInnerWidth) / 2;

        possibleCords.maxX = Math.abs(
            elInnerWidth * elDataScale - contWidth + possibleCords.minX,
        );
        return possibleCords;
    }

    setZoomSwipeStyles(
        LGel: { css: (arg0: string, arg1: string | undefined) => void },
        distance: { x: number; y: number },
    ): void {
        if (this.s.useLeftForZoom) {
            LGel.css('left', distance.x + 'px');
            LGel.css('top', distance.y + 'px');
        } else {
            LGel.css(
                'transform',
                'translate3d(' + distance.x + 'px, ' + distance.y + 'px, 0)',
            );
        }
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

        let dataX = 0;
        let dataY = 0;
        let possibleSwipeCords: PossibleCords;

        let _LGel: lgQuery;

        const inner = LG(`#${this.core.getById('lg-inner')}`);
        let $item = this.core.getSlideItem(this.core.index);

        inner.on('touchstart.lg', (e) => {
            $item = this.core.getSlideItem(this.core.index);
            if (
                (LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target)) &&
                e.targetTouches.length === 1 &&
                this.core.outer.hasClass('lg-zoomed')
            ) {
                startTime = new Date();
                this.core.touchAction = 'zoomSwipe';
                const $image = this.core
                    .getSlideItem(this.core.index)
                    .find('.lg-object')
                    .first();

                _LGel = this.core
                    .getSlideItem(this.core.index)
                    .find('.lg-img-wrap')
                    .first();

                allowY =
                    $image.get().offsetHeight *
                        parseFloat($image.attr('data-scale')) >
                    this.core.outer.find('.lg').height();
                allowX =
                    $image.get().offsetWidth *
                        parseFloat($image.attr('data-scale')) >
                    this.core.outer.find('.lg').width();
                if (allowX || allowY) {
                    e.preventDefault();
                    startCoords = {
                        x: e.targetTouches[0].pageX,
                        y: e.targetTouches[0].pageY,
                    };
                }

                dataY = parseFloat(_LGel.attr('data-y'));
                dataX = parseFloat(_LGel.attr('data-x'));

                const $cont = this.core.outer.find('.lg');
                possibleSwipeCords = this.getPossibleSwipeCords($image, $cont);

                // reset opacity and transition duration
                this.core.outer.addClass(
                    'lg-zoom-dragging lg-zoom-drag-transition',
                );
            }
        });

        inner.on('touchmove.lg', (e) => {
            if (
                e.targetTouches.length === 1 &&
                this.core.touchAction === 'zoomSwipe' &&
                (LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))
            ) {
                this.core.touchAction = 'zoomSwipe';

                e.preventDefault();

                endCoords = {
                    x: e.targetTouches[0].pageX,
                    y: e.targetTouches[0].pageY,
                };

                const distance = this.getZoomSwipeCords(
                    startCoords,
                    endCoords,
                    allowX,
                    allowY,
                    possibleSwipeCords,
                    dataY,
                    dataX,
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

        inner.on('touchend.lg', (e) => {
            if (
                this.core.touchAction === 'zoomSwipe' &&
                (LG(e.target).hasClass('lg-item') ||
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

        let dataY: number;
        let dataX: number;
        let _LGel: lgQuery;

        this.core.outer.on('mousedown.lg.zoom', (e) => {
            const $item = this.core.getSlideItem(this.core.index);
            if (
                LG(e.target).hasClass('lg-item') ||
                $item.get().contains(e.target)
            ) {
                startTime = new Date();

                // execute only on .lg-object
                const $image = this.core
                    .getSlideItem(this.core.index)
                    .find('.lg-object')
                    .first();
                _LGel = this.core
                    .getSlideItem(this.core.index)
                    .find('.lg-img-wrap')
                    .first();

                allowY =
                    $image.get().offsetHeight *
                        parseFloat($image.attr('data-scale')) >
                    this.core.outer.find('.lg').height();
                allowX =
                    $image.get().offsetWidth *
                        parseFloat($image.attr('data-scale')) >
                    this.core.outer.find('.lg').width();

                if (this.core.outer.hasClass('lg-zoomed')) {
                    if (
                        LG(e.target).hasClass('lg-object') &&
                        (allowX || allowY)
                    ) {
                        e.preventDefault();
                        startCoords = {
                            x: e.pageX,
                            y: e.pageY,
                        };

                        const $cont = this.core.outer.find('.lg');
                        possibleSwipeCords = this.getPossibleSwipeCords(
                            $image,
                            $cont,
                        );

                        isDragging = true;

                        dataY = parseFloat(_LGel.attr('data-y'));
                        dataX = parseFloat(_LGel.attr('data-x'));

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

        LG(window).on('mousemove.lg.zoom', (e) => {
            if (isDragging) {
                isMoved = true;
                endCoords = {
                    x: e.pageX,
                    y: e.pageY,
                };

                const distance = this.getZoomSwipeCords(
                    startCoords,
                    endCoords,
                    allowX,
                    allowY,
                    possibleSwipeCords,
                    dataY,
                    dataX,
                );

                this.setZoomSwipeStyles(_LGel, distance);
            }
        });

        LG(window).on('mouseup.lg.zoom', (e) => {
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
                    endCoords = {
                        x: e.pageX,
                        y: e.pageY,
                    };
                    const touchDuration =
                        endTime.valueOf() - startTime.valueOf();
                    this.touchendZoom(
                        startCoords,
                        endCoords,
                        allowX,
                        allowY,
                        touchDuration,
                    );
                }

                isMoved = false;
            }

            this.core.outer.removeClass('lg-grabbing').addClass('lg-grab');
        });
    }

    destroy(): void {
        // Unbind all events added by lightGallery zoom plugin
        this.core.LGel.off('.lg.zoom');
        LG(window).off('.lg.zoom');
        this.core.outer.find('.lg-item').first().off('.lg.zoom');
        this.core.LGel.off('.lg.tm.zoom');
        this.resetZoom();
        clearTimeout(this.zoomableTimeout);
        this.zoomableTimeout = false;
    }
}

window.lgModules.zoom = Zoom;
