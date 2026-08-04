import {
    SPRING_BOUNCE_DAMPING,
    clampPanToStage,
    fitImageSize,
    getActualSizeScale as getNaturalSizeScale,
    getPanBounds,
    getPinchPan,
    getRotatedVisualSize,
    getPinchScale,
    shouldCloseOnPinch,
    getPointerDistance,
    getWindowedVelocity,
    project,
    pushVelocitySample,
    type Velocity,
    type VelocitySample,
} from '@lightgallery/headless';

import { runSprings } from '../../lg-spring-runner';

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
    touches: { pageY: number; pageX: number }[];
    pageY: number;
}
interface PossibleCords {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

const ZOOM_TRANSITION_DURATION = 500;

export default class Zoom {
    private core: LightGallery;
    private settings: ZoomSettings;
    private $LG!: LgQuery;
    private imageReset!: number | boolean;
    zoomableTimeout: any;
    positionChanged!: boolean;
    zoomInProgress!: boolean;
    pageX!: number;
    pageY!: number;
    scale!: number;

    containerRect!: ClientRect;
    dragAllowedAxises!: DragAllowedAxises;
    top!: number;
    left!: number;
    scrollTop!: number;
    private cancelZoomSpring?: () => void;
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
                  this.settings.zoomPluginStrings['zoomOut']
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
            if (!this.isImageSlide(this.core.index)) {
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

    getDragCords(e: MouseEvent): Coords {
        return {
            x: e.pageX,
            y: e.pageY,
        };
    }
    getSwipeCords(e: TouchEvent): Coords {
        const x = e.touches[0].pageX;
        const y = e.touches[0].pageY;
        return {
            x,
            y,
        };
    }

    getDragAllowedAxises(scale: number, scaleDiff?: number): DragAllowedAxises {
        if (!this.containerRect) {
            return {
                allowX: false,
                allowY: false,
            };
        }
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first()
            .get();

        let height = 0;
        let width = 0;
        const rect = $image.getBoundingClientRect();
        if (scale) {
            const visual = this.getVisualImageSize(
                $image,
                $image.offsetWidth,
                $image.offsetHeight,
            );
            height = visual.height * scale;
            width = visual.width * scale;
        } else if (scaleDiff) {
            height = rect.height + scaleDiff * rect.height;
            width = rect.width + scaleDiff * rect.width;
        } else if (this.core.currentImageSize) {
            // Rendered size, transform-independent: the actual-size
            // machinery rewrites the element's layout after a zoom
            // (reset-transition !important transform, natural-px swap),
            // so a rect read races it — the fitted size scaled by the
            // live zoom is stable in every mode.
            const visual = this.getVisualImageSize(
                $image,
                this.core.currentImageSize.width,
                this.core.currentImageSize.height,
            );
            height = visual.height * this.scale;
            width = visual.width * this.scale;
        } else {
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

    setZoomEssentials(): void {
        this.containerRect = this.core.$content.get().getBoundingClientRect();
    }

    /**
     * @desc Image zoom
     * Translate the wrap and scale the image to get better user experience
     *
     * @param {String} scale - Zoom decrement/increment value
     */
    zoomImage(
        scale: number,
        scaleDiff: number,
        reposition: boolean,
        resetToMax: boolean,
    ): void {
        if (!this.containerRect || Math.abs(scaleDiff) <= 0) return;

        const offsetX = this.containerRect.width / 2 + this.containerRect.left;

        const offsetY =
            this.containerRect.height / 2 +
            this.containerRect.top +
            this.scrollTop;

        let originalX;
        let originalY;

        if (scale === 1) {
            this.positionChanged = false;
        }

        const dragAllowedAxises = this.getDragAllowedAxises(0, scaleDiff);

        const { allowY, allowX } = dragAllowedAxises;
        if (this.positionChanged) {
            originalX = this.left / (this.scale - scaleDiff);
            originalY = this.top / (this.scale - scaleDiff);
            this.pageX = offsetX - originalX;
            this.pageY = offsetY - originalY;

            this.positionChanged = false;
        }

        const possibleSwipeCords = this.getPossibleSwipeDragCords(scaleDiff);

        let x;
        let y;
        let _x = offsetX - this.pageX;
        let _y = offsetY - this.pageY;

        if (scale - scaleDiff > 1) {
            const scaleVal = (scale - scaleDiff) / Math.abs(scaleDiff);
            _x =
                (scaleDiff < 0 ? -_x : _x) +
                this.left * (scaleVal + (scaleDiff < 0 ? -1 : 1));
            _y =
                (scaleDiff < 0 ? -_y : _y) +
                this.top * (scaleVal + (scaleDiff < 0 ? -1 : 1));
            x = _x / scaleVal;
            y = _y / scaleVal;
        } else {
            const scaleVal = (scale - scaleDiff) * scaleDiff;
            x = _x * scaleVal;
            y = _y * scaleVal;
        }

        if (reposition) {
            if (allowX) {
                if (this.isBeyondPossibleLeft(x, possibleSwipeCords.minX)) {
                    x = possibleSwipeCords.minX;
                } else if (
                    this.isBeyondPossibleRight(x, possibleSwipeCords.maxX)
                ) {
                    x = possibleSwipeCords.maxX;
                }
            } else {
                if (scale > 1) {
                    if (x < possibleSwipeCords.minX) {
                        x = possibleSwipeCords.minX;
                    } else if (x > possibleSwipeCords.maxX) {
                        x = possibleSwipeCords.maxX;
                    }
                }
            }
            // @todo fix this
            if (allowY) {
                if (this.isBeyondPossibleTop(y, possibleSwipeCords.minY)) {
                    y = possibleSwipeCords.minY;
                } else if (
                    this.isBeyondPossibleBottom(y, possibleSwipeCords.maxY)
                ) {
                    y = possibleSwipeCords.maxY;
                }
            } else {
                // If the translate value based on index of beyond the viewport, utilize the available space to prevent image being cut out
                if (scale > 1) {
                    //If image goes beyond viewport top, use the minim possible translate value
                    if (y < possibleSwipeCords.minY) {
                        y = possibleSwipeCords.minY;
                    } else if (y > possibleSwipeCords.maxY) {
                        y = possibleSwipeCords.maxY;
                    }
                }
            }
        }

        this.setZoomStyles({
            x: x,
            y: y,
            scale,
        });

        this.left = x;
        this.top = y;

        if (resetToMax) {
            this.setZoomImageSize();
        }
    }

    resetImageTranslate(index: number): void {
        if (!this.isImageSlide(index)) {
            return;
        }
        const $image = this.core.getSlideItem(index).find('.lg-image').first();
        this.imageReset = false;
        $image.removeClass(
            'reset-transition reset-transition-y reset-transition-x',
        );
        this.core.outer.removeClass('lg-actual-size');
        $image.css('width', 'auto').css('height', 'auto');
        setTimeout(() => {
            $image.removeClass('no-transition');
        }, 10);
    }

    setZoomImageSize(delay: number = ZOOM_TRANSITION_DURATION): void {
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first();

        // The natural-px swap must wait out the running zoom animation
        // (button bounce or gesture settle) — firing mid-flight cuts it.
        // Both timers also stand down if a NEW gesture grabbed the image
        // meanwhile: swapping to natural px (and the reset-transition
        // !important rules) mid-pinch freezes the visible zoom and
        // corrupts the release clamp's layout measurements.
        setTimeout(() => {
            if (this.core.touchAction) {
                return;
            }
            const actualSizeScale = this.getCurrentImageActualSizeScale();

            if (this.scale >= actualSizeScale) {
                $image.addClass('no-transition');
                this.imageReset = true;
            }
        }, delay);

        setTimeout(() => {
            if (this.core.touchAction) {
                return;
            }
            const actualSizeScale = this.getCurrentImageActualSizeScale();

            if (this.scale >= actualSizeScale) {
                const dragAllowedAxises = this.getDragAllowedAxises(this.scale);

                $image
                    .css(
                        'width',
                        ($image.get() as HTMLImageElement).naturalWidth + 'px',
                    )
                    .css(
                        'height',
                        ($image.get() as HTMLImageElement).naturalHeight + 'px',
                    );

                this.core.outer.addClass('lg-actual-size');

                if (dragAllowedAxises.allowX && dragAllowedAxises.allowY) {
                    $image.addClass('reset-transition');
                } else if (
                    dragAllowedAxises.allowX &&
                    !dragAllowedAxises.allowY
                ) {
                    $image.addClass('reset-transition-x');
                } else if (
                    !dragAllowedAxises.allowX &&
                    dragAllowedAxises.allowY
                ) {
                    $image.addClass('reset-transition-y');
                }
            }
        }, delay + 50);
    }

    /**
     * @desc apply scale3d to image and translate to image wrap
     * @param {style} X,Y and scale
     */
    setZoomStyles(style: { x: number; y: number; scale: number }): void {
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
    }

    /**
     * @param index - Index of the current slide
     * @param event - event will be available only if the function is called on clicking/taping the imags
     */
    setActualSize(index: number, event?: ZoomTouchEvent): void {
        if (this.zoomInProgress) {
            return;
        }
        this.zoomInProgress = true;
        const currentItem = this.core.galleryItems[this.core.index];
        this.resetImageTranslate(index);
        setTimeout(() => {
            // Allow zoom only on image
            if (
                !currentItem.src ||
                this.core.outer.hasClass('lg-first-slide-loading')
            ) {
                return;
            }
            const scale = this.getCurrentImageActualSizeScale();
            const prevScale = this.scale;
            if (this.core.outer.hasClass('lg-zoomed')) {
                this.scale = 1;
            } else {
                this.scale = this.getScale(scale);
            }
            this.setPageCords(event);

            this.beginZoom(this.scale);
            this.zoomImage(this.scale, this.scale - prevScale, true, true);
        }, 50);
        setTimeout(() => {
            this.core.outer.removeClass('lg-grabbing').addClass('lg-grab');
        }, 60);
        setTimeout(() => {
            this.zoomInProgress = false;
        }, ZOOM_TRANSITION_DURATION + 110);
    }

    getNaturalWidth(index: number): number {
        const $image = this.core.getSlideItem(index).find('.lg-image').first();

        const naturalWidth = this.core.galleryItems[index].width;
        return naturalWidth
            ? parseFloat(naturalWidth)
            : undefined || ($image.get() as any).naturalWidth;
    }

    getActualSizeScale(naturalWidth: number, width: number): number {
        let scale;
        if (naturalWidth >= width) {
            scale = getNaturalSizeScale(naturalWidth, width);
        } else {
            // Documented deviation from the shared helper: 2.x never
            // zooms an image rendered above its natural size below the
            // fitted scale.
            scale = 1;
        }
        return scale;
    }

    getCurrentImageActualSizeScale(): number {
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first();
        const image = $image.get() as HTMLImageElement;
        // The FITTED width is the stable denominator in every mode. The
        // element's offsetWidth reads the current layout — after the
        // actual-size swap that IS naturalWidth, and dividing by it
        // returns 1: settleIntoBounds would then clamp a tap on a
        // zoomed image into a full animated un-zoom back to fit.
        let width = this.core.currentImageSize?.width;
        if (!width) {
            if (this.core.outer.hasClass('lg-actual-size')) {
                // zoomFromOrigin:false, dynamic mode and items without
                // lg-size never populate currentImageSize — recompute the
                // contain-fit analytically from the stage box instead of
                // trusting the swapped element's layout.
                if (!this.containerRect) {
                    this.setZoomEssentials();
                }
                width = fitImageSize(
                    {
                        width: image.naturalWidth,
                        height: image.naturalHeight,
                    },
                    this.containerRect.width,
                    this.containerRect.height,
                ).width;
            } else {
                width = image.offsetWidth;
            }
        }
        const naturalWidth = this.getNaturalWidth(this.core.index) || width;
        return this.getActualSizeScale(naturalWidth, width);
    }

    getPageCords(event?: ZoomTouchEvent): Coords {
        const cords: Coords = {} as Coords;
        if (event) {
            cords.x = event.pageX || event.touches[0].pageX;
            cords.y = event.pageY || event.touches[0].pageY;
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
            if (event.touches.length === 1 && $target.hasClass('lg-image')) {
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

        this.core.LGel.on(
            `${lGEvents.containerResize}.zoom ${lGEvents.rotateRight}.zoom ${lGEvents.rotateLeft}.zoom ${lGEvents.flipHorizontal}.zoom ${lGEvents.flipVertical}.zoom`,
            () => {
                if (
                    !this.core.lgOpened ||
                    !this.isImageSlide(this.core.index) ||
                    this.core.touchAction
                ) {
                    return;
                }
                // A release spring runs with touchAction unset — left
                // running it would overwrite the reset below from its
                // next frame and finish at the OLD layout's clamp target.
                this.stopZoomSpring();
                const _LGel = this.core
                    .getSlideItem(this.core.index)
                    .find('.lg-img-wrap')
                    .first();
                this.top = 0;
                this.left = 0;
                this.setZoomEssentials();
                this.setZoomSwipeStyles(_LGel, { x: 0, y: 0 });
                this.positionChanged = true;
            },
        );
        // Update zoom on resize and orientationchange
        this.$LG(window).on(`scroll.lg.zoom.global${this.core.lgId}`, () => {
            if (!this.core.lgOpened) return;
            this.scrollTop = this.$LG(window).scrollTop();
        });

        this.core.getElementById('lg-zoom-out').on('click.lg', () => {
            // Allow zoom only on image
            if (!this.isImageSlide(this.core.index)) {
                return;
            }

            let timeout = 0;
            if (this.imageReset) {
                this.resetImageTranslate(this.core.index);
                timeout = 50;
            }
            setTimeout(() => {
                let scale = this.scale - this.settings.scale;

                if (scale < 1) {
                    scale = 1;
                }
                this.beginZoom(scale);
                this.zoomImage(
                    scale,
                    -this.settings.scale,
                    true,
                    !this.settings.infiniteZoom,
                );
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
                this.zoomInProgress = false;
                this.resetZoom(prevIndex);
                this.resetImageTranslate(prevIndex);
                if (this.isImageSlide(this.core.index)) {
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
        this.zoomInProgress = false;
    }

    zoomIn(): void {
        // Allow zoom only on image
        if (!this.isImageSlide(this.core.index)) {
            return;
        }

        let scale = this.scale + this.settings.scale;

        if (!this.settings.infiniteZoom) {
            scale = this.getScale(scale);
        }
        this.beginZoom(scale);
        this.zoomImage(
            scale,
            Math.min(this.settings.scale, scale - this.scale),
            true,
            !this.settings.infiniteZoom,
        );
    }

    // Reset zoom effect
    resetZoom(index?: number): void {
        this.stopZoomSpring();
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

    /** Stop a running release spring; state stays at its live values. */
    stopZoomSpring(): void {
        if (this.cancelZoomSpring) {
            this.cancelZoomSpring();
            this.cancelZoomSpring = undefined;
        }
    }

    /**
     * Any gesture end must leave the image inside its pan bounds: a tap
     * interrupts a settling spring (stopZoomSpring at its touchstart),
     * and if it never turns into a drag nothing else re-clamps — the
     * fused pinch pan can legitimately be far outside mid-settle.
     * Springs home from wherever the interruption stopped it; a no-op
     * when already in bounds (the common tap).
     */
    settleIntoBounds(): void {
        // Absolute bounds from the transform-inclusive rendered size
        // (position-independent — the interrupted position may be far
        // out of bounds). Per axis the LEGAL ANCHOR range is
        // ±|imageSize − containerSize| / 2 whether or not the image
        // overflows: button/double-tap zooms deliberately park a
        // non-overflowing axis off-center to keep the tapped point
        // visible, and a plain tap must not recenter it. Only the
        // overflowing-Y floor is stage-aware (vacated strip).
        this.setZoomEssentials();
        const rect = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first()
            .get()
            .getBoundingClientRect();
        // The interrupted spring may also have been mid-SCALE (a pinch
        // release gliding into [1, actual size]); a stranded scale would
        // skip the actual-size machinery its completion owns. Project
        // the rendered sizes to the clamped target scale
        // (transform-invariant: rect × target / current).
        const actualSizeScale = this.getCurrentImageActualSizeScale();
        // infiniteZoom lifts the actual-size ceiling everywhere else —
        // a tap interrupting a glide above it must not spring the scale
        // back down to the cap.
        const targetScale = this.settings.infiniteZoom
            ? Math.max(this.scale, 1)
            : Math.min(Math.max(this.scale, 1), Math.max(actualSizeScale, 1));
        const sizeRatio = this.scale > 0 ? targetScale / this.scale : 1;
        const width = rect.width * sizeRatio;
        const height = rect.height * sizeRatio;
        const { bottom } = this.core.mediaContainerPosition;
        const halfX = Math.abs(width - this.containerRect.width) / 2;
        const halfY = Math.abs(height - this.containerRect.height) / 2;
        const floorY =
            height > this.containerRect.height
                ? Math.min(-halfY + bottom, halfY)
                : -halfY;
        const targetX = Math.min(Math.max(this.left, -halfX), halfX);
        const targetY = Math.min(Math.max(this.top, floorY), halfY);
        if (
            Math.abs(targetX - this.left) < 1 &&
            Math.abs(targetY - this.top) < 1 &&
            Math.abs(targetScale - this.scale) < 0.001
        ) {
            return;
        }
        this.core.outer.addClass('lg-zoom-drag-transition lg-zoom-dragging');
        this.stopZoomSpring();
        this.cancelZoomSpring = runSprings(
            [
                { from: this.scale, velocity: 0, target: targetScale },
                { from: this.left, velocity: 0, target: targetX },
                { from: this.top, velocity: 0, target: targetY },
            ],
            ([scale, x, y]) => {
                this.left = x!;
                this.top = y!;
                this.setZoomStyles({ x: x!, y: y!, scale: scale! });
            },
            () => {
                this.cancelZoomSpring = undefined;
                this.core.outer.removeClass(
                    'lg-zoom-dragging lg-zoom-drag-transition',
                );
                // Mirror the pinch-release completion machinery.
                if (
                    targetScale > 1 &&
                    targetScale >= Math.max(actualSizeScale, 1)
                ) {
                    this.setZoomImageSize(0);
                }
            },
        );
    }

    getTouchDistance(e: TouchEvent): number {
        return getPointerDistance(
            { x: e.touches[0].pageX, y: e.touches[0].pageY },
            { x: e.touches[1].pageX, y: e.touches[1].pageY },
        );
    }

    /**
     * Pinch midpoint relative to the stage centre — the focal anchor the
     * whole gesture projects through.
     */
    private getPinchMidPoint(e: TouchEvent): Coords {
        const centerX = this.containerRect.width / 2 + this.containerRect.left;
        const centerY =
            this.containerRect.height / 2 +
            this.containerRect.top +
            this.scrollTop;
        return {
            x: (e.touches[0].pageX + e.touches[1].pageX) / 2 - centerX,
            y: (e.touches[0].pageY + e.touches[1].pageY) / 2 - centerY,
        };
    }

    /**
     * Clamp a pan into the stage-aware bounds at the given scale,
     * measured from the untransformed layout size (offset dimensions
     * ignore transforms, so this stays correct mid-gesture). Y matches
     * `getPossibleSwipeDragCords`: the vacated components strip belongs
     * to the stage, so the pan-up floor sits where the image's bottom
     * edge meets the SCREEN bottom, not the content box.
     */
    /**
     * Bounds-relevant size of the image: layout offsets swapped and
     * shrunk by the rotate plugin's wrapper transform when present —
     * at 90°/270° the visual width runs along the layout height, and
     * offsets don't see transforms.
     */
    getVisualImageSize(
        $image: HTMLElement,
        width: number,
        height: number,
    ): { width: number; height: number } {
        const rotateWrap = $image.closest<HTMLElement>('.lg-img-rotate');
        return getRotatedVisualSize(width, height, rotateWrap?.style.transform);
    }

    clampPinchPan(pan: Coords, scale: number): Coords {
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first()
            .get();
        const visual = this.getVisualImageSize(
            $image,
            $image.offsetWidth,
            $image.offsetHeight,
        );
        const bounds = getPanBounds(
            visual.width,
            visual.height,
            this.containerRect.width,
            this.containerRect.height,
            scale,
        );
        return clampPanToStage(
            pan,
            bounds,
            this.core.mediaContainerPosition.bottom,
        );
    }

    pinchZoom(): void {
        let startDist = 0;
        let pinchStarted = false;
        let initScale = 1;
        let startMaxScale = 1;
        let startPan: Coords = { x: 0, y: 0 };
        let startMid: Coords = { x: 0, y: 0 };
        // Largest scale the gesture reached — the pinch-to-close guard
        // (an over-then-under pinch is a correction, not a dismissal).
        let maxGestureScale = 1;
        // The midpoint's live position and velocity samples: two fingers
        // moving together pan the image (fused zoom-and-pan), and the
        // release springs inherit the midpoint's momentum.
        let lastMid: Coords = { x: 0, y: 0 };
        let midSamples: VelocitySample[] = [];

        let $item = this.core.getSlideItem(this.core.index);

        this.core.outer.on('touchstart.lg', (e) => {
            $item = this.core.getSlideItem(this.core.index);
            if (!this.isImageSlide(this.core.index)) {
                return;
            }
            if (e.touches.length === 2) {
                e.preventDefault();
                if (this.core.outer.hasClass('lg-first-slide-loading')) {
                    return;
                }
                this.stopZoomSpring();
                this.setZoomEssentials();
                initScale = this.scale || 1;
                startPan = { x: this.left, y: this.top };
                startMid = this.getPinchMidPoint(e);
                // Same choreography as zoomDrag/zoomSwipe: the
                // lg-zoom-dragging kill rule (0ms !important) makes the
                // transforms track the fingers 1:1 while both classes are
                // on; releasing drops only lg-zoom-dragging so the
                // lg-zoom-drag-transition settle ease animates the snap.
                this.core.outer.addClass(
                    'lg-zoom-drag-transition lg-zoom-dragging',
                );

                this.setPageCords(e);
                this.resetImageTranslate(this.core.index);
                // One snapshot serves the whole gesture: measured AFTER
                // the translate reset restores the fitted layout size
                // (actual-size mode renders at natural px), and the
                // fitted size cannot change mid-pinch (the resize recalc
                // stands down while touchAction is set). Live frames
                // must not pay a layout read.
                startMaxScale = this.getCurrentImageActualSizeScale();

                this.core.touchAction = 'pinch';

                startDist = this.getTouchDistance(e);
                maxGestureScale = initScale;
                lastMid = startMid;
                midSamples = [{ x: startMid.x, y: startMid.y, t: Date.now() }];
            }
        });

        this.core.$inner.on('touchmove.lg', (e) => {
            if (
                e.touches.length === 2 &&
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
                    // With pinch-to-close armed (setting on, closable,
                    // gesture never over fit) the under-fit squeeze is
                    // free — the shrink is the close affordance;
                    // otherwise it resists with friction.
                    const closeArmed =
                        this.core.settings.pinchToClose &&
                        this.core.settings.closable &&
                        maxGestureScale <= 1;
                    const _scale = getPinchScale(
                        startDist,
                        endDist,
                        initScale,
                        startMaxScale,
                        this.settings.infiniteZoom,
                        closeArmed,
                    );
                    // 4-decimal precision: at 2 decimals a slow pinch
                    // quantizes into visible ~16px steps on a 1600px
                    // image.
                    const scale =
                        Math.round((_scale + Number.EPSILON) * 10000) / 10000;
                    // Project from the gesture-start state so the image
                    // point under the fingers stays put on every frame —
                    // and follows the fingers: the midpoint's travel pans
                    // 1:1 (fused zoom-and-pan).
                    const mid = this.getPinchMidPoint(e);
                    lastMid = mid;
                    midSamples = pushVelocitySample(midSamples, {
                        x: mid.x,
                        y: mid.y,
                        t: Date.now(),
                    });
                    const pan = getPinchPan(
                        mid,
                        startMid,
                        startPan,
                        initScale,
                        scale,
                    );
                    // The pan stays FREE while the pinch is live —
                    // iOS keeps the focal point glued under the fingers
                    // with no bounds interference during the gesture
                    // (live-clamping against scale-dependent bounds
                    // reads as a drift wobble); the release spring
                    // lands it inside the stage bounds.
                    this.left = pan.x;
                    this.top = pan.y;
                    this.setZoomStyles({ x: pan.x, y: pan.y, scale });
                    maxGestureScale = Math.max(maxGestureScale, scale);
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
                if (
                    shouldCloseOnPinch({
                        scale: this.scale,
                        maxGestureScale,
                        pinchToClose: this.core.settings.pinchToClose,
                        closable: this.core.settings.closable,
                    })
                ) {
                    // Hand off from fit: the close pipeline strips zoom
                    // styles synchronously (destroyModules → resetZoom),
                    // so the close animation starts from the reset state.
                    this.core.outer.removeClass('lg-zoom-dragging');
                    this.resetZoom();
                    this.core.closeGallery();
                } else if (this.scale <= 1) {
                    // The under-fit squeeze springs back to fit exactly
                    // like the over-fit snap. lg-zoomed drops now (swipe
                    // availability and chrome state flip at release);
                    // the drag classes stay so per-frame styles apply
                    // uncut, and resetZoom's style strip at settle lands
                    // as a visual no-op (state is at scale 1 / pan 0).
                    this.core.outer.removeClass('lg-zoomed');
                    this.stopZoomSpring();
                    this.cancelZoomSpring = runSprings(
                        [
                            { from: this.scale, velocity: 0, target: 1 },
                            { from: this.left, velocity: 0, target: 0 },
                            { from: this.top, velocity: 0, target: 0 },
                        ],
                        ([scale, x, y]) => {
                            this.left = x!;
                            this.top = y!;
                            this.setZoomStyles({
                                x: x!,
                                y: y!,
                                scale: scale!,
                            });
                        },
                        () => {
                            this.cancelZoomSpring = undefined;
                            this.core.outer.removeClass('lg-zoom-dragging');
                            this.resetZoom();
                        },
                    );
                } else {
                    // Snap into [1, actual size] and re-project the pan
                    // through the same focal anchor — carried to the
                    // midpoint's last position and projected along its
                    // momentum — clamped into the exact bounds for the
                    // landed scale. The gesture-start snapshot keeps the
                    // cap identical to the live frames'. Velocity-seeded
                    // springs animate the snap (bounce only where the
                    // clamp cut the glide); transitions stand down until
                    // they settle.
                    const actualSizeScale = startMaxScale;
                    const targetScale = Math.min(
                        this.scale,
                        Math.max(actualSizeScale, 1),
                    );
                    const midVelocity = getWindowedVelocity(
                        midSamples,
                        Date.now(),
                    );
                    const basePan = getPinchPan(
                        lastMid,
                        startMid,
                        startPan,
                        initScale,
                        targetScale,
                    );
                    const glide = {
                        x: basePan.x + project(midVelocity.x),
                        y: basePan.y + project(midVelocity.y),
                    };
                    const pan = this.clampPinchPan(glide, targetScale);
                    // Buttons re-derive their anchor from left/top.
                    this.positionChanged = true;
                    this.manageActualPixelClassNames();
                    this.core.outer.addClass('lg-zoomed');

                    this.stopZoomSpring();
                    this.cancelZoomSpring = runSprings(
                        [
                            {
                                from: this.scale,
                                velocity: 0,
                                target: targetScale,
                            },
                            {
                                from: this.left,
                                velocity: midVelocity.x,
                                target: pan.x,
                                dampingRatio:
                                    pan.x !== glide.x
                                        ? SPRING_BOUNCE_DAMPING
                                        : 1,
                            },
                            {
                                from: this.top,
                                velocity: midVelocity.y,
                                target: pan.y,
                                dampingRatio:
                                    pan.y !== glide.y
                                        ? SPRING_BOUNCE_DAMPING
                                        : 1,
                            },
                        ],
                        ([scale, x, y]) => {
                            this.left = x!;
                            this.top = y!;
                            this.setZoomStyles({
                                x: x!,
                                y: y!,
                                scale: scale!,
                            });
                        },
                        () => {
                            this.cancelZoomSpring = undefined;
                            this.core.outer.removeClass(
                                'lg-zoom-dragging lg-zoom-drag-transition',
                            );
                            if (targetScale >= actualSizeScale) {
                                this.setZoomImageSize(0);
                            }
                        },
                    );
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
        velocity: Velocity,
    ): void {
        const _LGel = this.core
            .getSlideItem(this.core.index)
            .find('.lg-img-wrap')
            .first();
        const possibleSwipeCords = this.getPossibleSwipeDragCords();

        // Where the fingers left the image (rubber-banding included).
        const current = this.getZoomSwipeCords(
            startCoords,
            endCoords,
            allowX,
            allowY,
            possibleSwipeCords,
        );

        // Project the momentum, then clamp into the pan bounds. A
        // clamped axis settles with a soft bounce; a free one glides.
        const clampAxis = (value: number, min: number, max: number): number =>
            Math.min(Math.max(value, max), min);
        const targetX = allowX
            ? clampAxis(
                  current.x + project(velocity.x),
                  possibleSwipeCords.minX,
                  possibleSwipeCords.maxX,
              )
            : this.left;
        const targetY = allowY
            ? clampAxis(
                  current.y + project(velocity.y),
                  possibleSwipeCords.minY,
                  possibleSwipeCords.maxY,
              )
            : this.top;

        this.positionChanged = true;
        if (
            Math.abs(targetX - current.x) < 1 &&
            Math.abs(targetY - current.y) < 1
        ) {
            this.left = targetX;
            this.top = targetY;
            this.setZoomSwipeStyles(_LGel, { x: targetX, y: targetY });
            this.core.outer.removeClass(
                'lg-zoom-dragging lg-zoom-drag-transition',
            );
            return;
        }

        // The spring drives every frame — CSS transitions stand down
        // until it settles.
        this.core.outer.addClass('lg-zoom-dragging');
        this.stopZoomSpring();
        this.cancelZoomSpring = runSprings(
            [
                {
                    from: current.x,
                    velocity: velocity.x,
                    target: targetX,
                    dampingRatio:
                        targetX !== current.x + project(velocity.x)
                            ? SPRING_BOUNCE_DAMPING
                            : 1,
                },
                {
                    from: current.y,
                    velocity: velocity.y,
                    target: targetY,
                    dampingRatio:
                        targetY !== current.y + project(velocity.y)
                            ? SPRING_BOUNCE_DAMPING
                            : 1,
                },
            ],
            ([x, y]) => {
                this.left = x!;
                this.top = y!;
                this.setZoomSwipeStyles(_LGel, { x: x!, y: y! });
            },
            () => {
                this.cancelZoomSpring = undefined;
                this.core.outer.removeClass(
                    'lg-zoom-dragging lg-zoom-drag-transition',
                );
            },
        );
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
            distance.y = this.top + (endCoords.y - startCoords.y);
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
            distance.x = this.left + (endCoords.x - startCoords.x);
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

    isImageSlide(index: number): boolean {
        const currentItem = this.core.galleryItems[index];
        return this.core.getSlideType(currentItem) === 'image';
    }

    getPossibleSwipeDragCords(scale?: number): PossibleCords {
        const $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first();

        const imgRect = $image.get().getBoundingClientRect();

        let imageHeight = imgRect.height;
        let imageWidth = imgRect.width;

        if (scale) {
            imageHeight = imageHeight + scale * imageHeight;
            imageWidth = imageWidth + scale * imageWidth;
        }

        // Stage-aware bounds: the components strip (thumbnails+caption)
        // VACATES when zoomed, so the visible stage extends below the
        // content box to the screen bottom. The `+ bottom` floor stops
        // the pan-up exactly where the image's bottom edge meets the
        // SCREEN bottom — a symmetric content-box clamp would strand a
        // strip-height gap of black where the thumbnails were.
        const { bottom } = this.core.mediaContainerPosition;
        const minY = (imageHeight - this.containerRect.height) / 2;
        const maxY = (this.containerRect.height - imageHeight) / 2 + bottom;

        const minX = (imageWidth - this.containerRect.width) / 2;

        const maxX = (this.containerRect.width - imageWidth) / 2;

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

        let samples: VelocitySample[] = [];
        let possibleSwipeCords: PossibleCords;

        let _LGel: lgQuery;

        let $item = this.core.getSlideItem(this.core.index);

        this.core.$inner.on('touchstart.lg', (e) => {
            // Allow zoom only on image
            if (!this.isImageSlide(this.core.index)) {
                return;
            }
            $item = this.core.getSlideItem(this.core.index);
            if (
                (this.$LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target)) &&
                e.touches.length === 1 &&
                this.core.outer.hasClass('lg-zoomed')
            ) {
                e.preventDefault();
                this.stopZoomSpring();
                // A previous swipe hijacked by a pinch never reaches its
                // touchend — stale isMoved/endCoords would make the NEXT
                // tap run touchendZoom on garbage deltas.
                isMoved = false;
                endCoords = {} as Coords;
                const startPoint = this.getSwipeCords(e);
                samples = [{ x: startPoint.x, y: startPoint.y, t: Date.now() }];
                this.core.touchAction = 'zoomSwipe';
                _LGel = this.core
                    .getSlideItem(this.core.index)
                    .find('.lg-img-wrap')
                    .first();

                const dragAllowedAxises = this.getDragAllowedAxises(0);

                allowY = dragAllowedAxises.allowY;
                allowX = dragAllowedAxises.allowX;
                // Always captured: touchend runs on these whenever the
                // finger moved, and axis-gated capture fed it undefined
                // coords when both axes measured locked.
                startCoords = this.getSwipeCords(e);

                possibleSwipeCords = this.getPossibleSwipeDragCords();

                // reset opacity and transition duration
                this.core.outer.addClass(
                    'lg-zoom-dragging lg-zoom-drag-transition',
                );
            }
        });

        this.core.$inner.on('touchmove.lg', (e) => {
            if (
                e.touches.length === 1 &&
                this.core.touchAction === 'zoomSwipe' &&
                (this.$LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))
            ) {
                e.preventDefault();
                this.core.touchAction = 'zoomSwipe';

                endCoords = this.getSwipeCords(e);
                samples = pushVelocitySample(samples, {
                    x: endCoords.x,
                    y: endCoords.y,
                    t: Date.now(),
                });

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
                e.preventDefault();
                this.core.touchAction = undefined;
                this.core.outer.removeClass('lg-zoom-dragging');
                if (!isMoved) {
                    // The touchstart stopped any settling spring — a tap
                    // must not strand an out-of-bounds position.
                    this.settleIntoBounds();
                    return;
                }
                isMoved = false;
                this.touchendZoom(
                    startCoords,
                    endCoords,
                    allowX,
                    allowY,
                    getWindowedVelocity(samples, Date.now()),
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

        let dragSamples: VelocitySample[] = [];

        let possibleSwipeCords: PossibleCords;

        let _LGel: lgQuery;

        this.core.outer.on('mousedown.lg.zoom', (e) => {
            // Allow zoom only on image
            if (!this.isImageSlide(this.core.index)) {
                return;
            }
            const $item = this.core.getSlideItem(this.core.index);
            if (
                this.$LG(e.target).hasClass('lg-item') ||
                $item.get().contains(e.target)
            ) {
                // Only a drag that can actually take over may kill a
                // settling spring — an (often emulated) mousedown on an
                // un-zoomed image would strand the under-fit reset
                // mid-flight (zoomSwipe guards the same way).
                if (this.core.outer.hasClass('lg-zoomed')) {
                    this.stopZoomSpring();
                }
                dragSamples = [{ x: e.pageX, y: e.pageY, t: Date.now() }];
                _LGel = this.core
                    .getSlideItem(this.core.index)
                    .find('.lg-img-wrap')
                    .first();

                const dragAllowedAxises = this.getDragAllowedAxises(0);

                allowY = dragAllowedAxises.allowY;
                allowX = dragAllowedAxises.allowX;

                if (this.core.outer.hasClass('lg-zoomed')) {
                    if (
                        this.$LG(e.target).hasClass('lg-object') &&
                        (allowX || allowY)
                    ) {
                        e.preventDefault();
                        startCoords = this.getDragCords(e);

                        possibleSwipeCords = this.getPossibleSwipeDragCords();

                        isDragging = true;

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
                    endCoords = this.getDragCords(e);
                    dragSamples = pushVelocitySample(dragSamples, {
                        x: endCoords.x,
                        y: endCoords.y,
                        t: Date.now(),
                    });

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
                isDragging = false;
                this.core.outer.removeClass('lg-zoom-dragging');

                // Fix for chrome mouse move on click
                if (
                    isMoved &&
                    (startCoords.x !== endCoords.x ||
                        startCoords.y !== endCoords.y)
                ) {
                    endCoords = this.getDragCords(e);

                    this.touchendZoom(
                        startCoords,
                        endCoords,
                        allowX,
                        allowY,
                        getWindowedVelocity(dragSamples, Date.now()),
                    );
                } else {
                    // The mousedown stopped any settling spring — a
                    // click must not strand an out-of-bounds position.
                    this.settleIntoBounds();
                }

                isMoved = false;
            }

            this.core.outer.removeClass('lg-grabbing').addClass('lg-grab');
        });
    }

    closeGallery(): void {
        this.resetZoom();
        this.zoomInProgress = false;
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
