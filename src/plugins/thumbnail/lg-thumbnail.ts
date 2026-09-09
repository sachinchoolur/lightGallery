import {
    clampThumbTranslate,
    getActiveThumbTranslate,
    getElasticThumbTranslate,
    getScrubThumbIndex,
    getThumbCorridorWindow,
    getThumbTotalWidth,
    getThumbWindow,
    type ThumbWindow,
    getWindowedVelocity,
    project,
    pushVelocitySample,
    type VelocitySample,
    thumbnailDefaultIcons,
} from '@lightgallery/headless';

import { runSprings } from '../../lg-spring-runner';

import {
    ThumbnailsSettings,
    thumbnailsSettings,
} from './lg-thumbnail-settings';
import { LgQuery, lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { GalleryItem } from '../../lg-utils';
import { lGEvents } from '../../lg-events';

interface ThumbDragUtils {
    cords: {
        startX: number;
        endX: number;
    };
    isMoved: boolean;
    newTranslateX: number;
    startTime: Date;
    endTime: Date;
    touchMoveTime: number;
}
interface ThumbnailGalleryItem extends GalleryItem {
    thumb: string;
}
export default class Thumbnail {
    private core: LightGallery;
    private $thumbOuter!: lgQuery;
    private $lgThumb!: lgQuery;
    private thumbOuterWidth = 0;
    private thumbTotalWidth = 0;
    private translateX = 0;
    private thumbClickable = false;
    // Strip physics (plan 010): velocity samples for the release fling,
    // the live (frame-written) translate, and the running spring cancel.
    private dragSamples: VelocitySample[] = [];
    private liveTranslateX = 0;
    private cancelThumbSpring?: () => void;
    // Last rendered window (windowed strips), the mid-drag top-up
    // check compares the live translate against this coverage.
    private renderedThumbWindow?: ThumbWindow;
    // Scrub session (scrubThumbnails): while the strip moves it drives
    // the gallery, slide changes are instant and the strip must not
    // re-center itself against the finger.
    private scrubActive = false;
    private scrubIndex = -1;
    private scrubSavedSpeed?: number;
    private settings!: ThumbnailsSettings;
    private $LG!: LgQuery;
    constructor(instance: LightGallery, $LG: LgQuery) {
        // get lightGallery core plugin instance
        this.core = instance;
        this.$LG = $LG;

        return this;
    }

    init(): void {
        this.core.registerDefaultIcons(thumbnailDefaultIcons);
        // extend module default settings with lightGallery core settings
        this.settings = {
            ...thumbnailsSettings,
            ...this.core.settings,
        };
        this.thumbOuterWidth = 0;
        this.thumbTotalWidth = getThumbTotalWidth(
            this.core.galleryItems.length,
            this.settings.thumbWidth,
            this.settings.thumbMargin,
        );

        // Thumbnail animation value
        this.translateX = 0;

        this.setAnimateThumbStyles();

        if (!this.core.settings.allowMediaOverlap) {
            this.settings.toggleThumb = false;
        }

        if (this.settings.thumbnail) {
            this.build();
            if (this.settings.animateThumb) {
                if (this.settings.enableThumbDrag) {
                    this.enableThumbDrag();
                }

                if (this.settings.enableThumbSwipe) {
                    this.enableThumbSwipe();
                }

                this.thumbClickable = false;
            } else {
                this.thumbClickable = true;
            }

            this.toggleThumbBar();
            this.thumbKeyPress();
        }
    }

    build(): void {
        this.setThumbMarkup();
        this.manageActiveClassOnSlideChange();
        this.$lgThumb.first().on('click.lg touchend.lg', (e: CustomEvent) => {
            const $target = this.$LG(e.target);
            if (!$target.hasAttribute('data-lg-item-id')) {
                return;
            }
            setTimeout(() => {
                // In IE9 and bellow touch does not support
                // Go to slide if browser does not support css transitions
                if (this.thumbClickable && !this.core.lgBusy) {
                    const index = parseInt($target.attr('data-lg-item-id'));
                    this.core.slide(index, false, true, false);
                }
            }, 50);
        });

        this.core.LGel.on(`${lGEvents.beforeSlide}.thumb`, (event) => {
            // Mid-scrub the finger owns the strip; re-centering against
            // the scrub's own navigation would fight it.
            if (this.scrubActive) {
                return;
            }
            const { index } = event.detail;
            this.animateThumb(index);
        });
        this.core.LGel.on(`${lGEvents.beforeOpen}.thumb`, () => {
            this.thumbOuterWidth = this.core.outer.get().offsetWidth;
        });

        this.core.LGel.on(`${lGEvents.updateSlides}.thumb`, () => {
            this.rebuildThumbnails();
        });
        this.core.LGel.on(`${lGEvents.containerResize}.thumb`, () => {
            if (!this.core.lgOpened) return;
            setTimeout(() => {
                this.thumbOuterWidth = this.core.outer.get().offsetWidth;
                this.animateThumb(this.core.index);
                this.thumbOuterWidth = this.core.outer.get().offsetWidth;
            }, 50);
        });
    }

    setThumbMarkup(): void {
        let thumbOuterClassNames = 'lg-thumb-outer ';

        if (this.settings.alignThumbnails) {
            thumbOuterClassNames += `lg-thumb-align-${this.settings.alignThumbnails}`;
        }

        const html = `<div class="${thumbOuterClassNames}">
        <div class="lg-thumb lg-group">
        </div>
        </div>`;

        this.core.outer.addClass('lg-has-thumb');

        if (this.settings.appendThumbnailsTo === '.lg-components') {
            this.core.$lgComponents.append(html);
        } else {
            this.core.outer.append(html);
        }

        this.$thumbOuter = this.core.outer.find('.lg-thumb-outer').first();
        this.$lgThumb = this.core.outer.find('.lg-thumb').first();

        if (this.settings.animateThumb) {
            this.core.outer
                .find('.lg-thumb')
                .css('transition-duration', this.core.settings.speed + 'ms')
                .css('width', this.thumbTotalWidth + 'px')
                .css('position', 'relative');
        }

        this.renderThumbItems();
    }

    enableThumbDrag(): void {
        let thumbDragUtils: ThumbDragUtils = {
            cords: {
                startX: 0,
                endX: 0,
            },
            isMoved: false,
            newTranslateX: 0,
            startTime: new Date(),
            endTime: new Date(),
            touchMoveTime: 0,
        };

        let isDragging = false;

        this.$thumbOuter.addClass('lg-grab');

        this.core.outer
            .find('.lg-thumb')
            .first()
            .on('mousedown.lg.thumb', (e) => {
                if (this.thumbTotalWidth > this.thumbOuterWidth) {
                    // execute only on .lg-object
                    e.preventDefault();
                    this.onThumbDragStart(e.pageX);
                    thumbDragUtils.cords.startX = e.pageX;

                    thumbDragUtils.startTime = new Date();
                    this.thumbClickable = false;

                    isDragging = true;

                    // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                    this.core.outer.get().scrollLeft += 1;
                    this.core.outer.get().scrollLeft -= 1;

                    // *
                    this.$thumbOuter
                        .removeClass('lg-grab')
                        .addClass('lg-grabbing');
                }
            });

        this.$LG(window).on(
            `mousemove.lg.thumb.global${this.core.lgId}`,
            (e) => {
                if (!this.core.lgOpened) return;
                if (isDragging) {
                    thumbDragUtils.cords.endX = e.pageX;

                    thumbDragUtils = this.onThumbTouchMove(thumbDragUtils);
                }
            },
        );

        this.$LG(window).on(`mouseup.lg.thumb.global${this.core.lgId}`, () => {
            if (!this.core.lgOpened) return;
            if (thumbDragUtils.isMoved) {
                thumbDragUtils = this.onThumbTouchEnd(thumbDragUtils);
            } else {
                this.thumbClickable = true;
                // A press that took over a scrub glide and released
                // without moving ends the session here, no spring runs.
                this.endScrub();
            }

            if (isDragging) {
                isDragging = false;
                this.$thumbOuter.removeClass('lg-grabbing').addClass('lg-grab');
            }
        });
    }

    enableThumbSwipe(): void {
        let thumbDragUtils: ThumbDragUtils = {
            cords: {
                startX: 0,
                endX: 0,
            },
            isMoved: false,
            newTranslateX: 0,
            startTime: new Date(),
            endTime: new Date(),
            touchMoveTime: 0,
        };

        this.$lgThumb.on('touchstart.lg', (e: TouchEvent) => {
            if (this.thumbTotalWidth > this.thumbOuterWidth) {
                e.preventDefault();
                this.onThumbDragStart(e.targetTouches[0].pageX);
                thumbDragUtils.cords.startX = e.targetTouches[0].pageX;
                this.thumbClickable = false;
                thumbDragUtils.startTime = new Date();
            }
        });

        this.$lgThumb.on('touchmove.lg', (e: TouchEvent) => {
            if (this.thumbTotalWidth > this.thumbOuterWidth) {
                e.preventDefault();
                thumbDragUtils.cords.endX = e.targetTouches[0].pageX;
                thumbDragUtils = this.onThumbTouchMove(thumbDragUtils);
            }
        });

        this.$lgThumb.on('touchend.lg', () => {
            if (thumbDragUtils.isMoved) {
                thumbDragUtils = this.onThumbTouchEnd(thumbDragUtils);
            } else {
                this.thumbClickable = true;
                // A tap that took over a scrub glide ends the session
                // here, no spring runs.
                this.endScrub();
            }
        });
    }

    // Rebuild thumbnails
    rebuildThumbnails(): void {
        // Remove transitions
        this.$thumbOuter.addClass('lg-rebuilding-thumbnails');
        setTimeout(() => {
            this.thumbTotalWidth = getThumbTotalWidth(
                this.core.galleryItems.length,
                this.settings.thumbWidth,
                this.settings.thumbMargin,
            );
            this.$lgThumb.css('width', this.thumbTotalWidth + 'px');
            this.$lgThumb.empty();
            this.renderThumbItems();
            this.animateThumb(this.core.index);
        }, 50);
        setTimeout(() => {
            this.$thumbOuter.removeClass('lg-rebuilding-thumbnails');
        }, 200);
    }

    // @ts-check

    setTranslate(value: number): void {
        // `${-value}` (not '-' + value): elastic overshoot goes negative.
        // The translate scalar lives in logical strip space; in RTL the
        // strip flows right-to-left (lg-rtl.css floats the thumbs right),
        // so scrolling toward higher indexes moves the track right.
        const x = this.isRtl() ? value : -value;
        this.$lgThumb.css('transform', 'translate3d(' + x + 'px, 0px, 0px)');
    }

    private isRtl(): boolean {
        return this.core.settings.direction === 'rtl';
    }

    getPossibleTransformX(left: number): number {
        return clampThumbTranslate(
            left,
            this.thumbTotalWidth,
            this.thumbOuterWidth,
        );
    }

    animateThumb(index: number): void {
        // A slide change owns the strip: stop any release glide first.
        if (this.cancelThumbSpring) {
            this.cancelThumbSpring();
            this.cancelThumbSpring = undefined;
        }
        this.$lgThumb.css(
            'transition-duration',
            this.core.settings.speed + 'ms',
        );
        if (this.settings.animateThumb) {
            this.translateX = getActiveThumbTranslate(
                index,
                this.settings.thumbWidth,
                this.settings.thumbMargin,
                this.thumbOuterWidth,
                this.thumbTotalWidth,
                this.settings.currentPagerPosition,
                this.isRtl() ? 'rtl' : 'ltr',
            );
            this.liveTranslateX = this.translateX;
            this.setTranslate(this.translateX);
            if (this.isThumbWindowed()) {
                this.renderThumbItems(index);
            }
        }
    }

    private canScrub(): boolean {
        return this.settings.scrubThumbnails && this.settings.animateThumb;
    }

    /**
     * A scrub session starts on the first actual strip movement and
     * ends when the release glide settles (or the plugin dies). While
     * it runs: slide transitions are visually off (`lg-thumb-scrubbing`
     * CSS), the core's transition timers collapse (`speed` 0) so the
     * landed slide's content loads without the navigation lag, and the
     * strip's own slide-change re-centering stands down.
     */
    private beginScrub(): void {
        if (this.scrubActive) {
            return;
        }
        this.scrubActive = true;
        this.scrubIndex = this.core.index;
        this.scrubSavedSpeed = this.core.settings.speed;
        this.core.settings.speed = 0;
        this.core.outer.addClass('lg-thumb-scrubbing');
    }

    private endScrub(): void {
        if (!this.scrubActive) {
            return;
        }
        this.scrubActive = false;
        this.scrubIndex = -1;
        if (this.scrubSavedSpeed !== undefined) {
            this.core.settings.speed = this.scrubSavedSpeed;
            this.scrubSavedSpeed = undefined;
        }
        this.core.outer.removeClass('lg-thumb-scrubbing');
    }

    /** Live translate → slide, on drag frames and glide frames alike. */
    private scrubTo(translate: number): void {
        const index = getScrubThumbIndex(
            translate,
            this.thumbTotalWidth,
            this.thumbOuterWidth,
            this.core.galleryItems.length,
        );
        if (index === this.scrubIndex) {
            return;
        }
        this.scrubIndex = index;
        // The busy flag paces animated navigation; a scrub tracks the
        // strip frame by frame, so each step clears it (the fromTouch
        // slide path swaps lg-current immediately).
        this.core.lgBusy = false;
        this.core.slide(index, true, true, false);
    }

    /**
     * Drag-start seam (plan 010 physics): a press mid-glide takes over
     * from the live position, and the velocity window restarts.
     */
    private onThumbDragStart(pageX: number): void {
        if (this.cancelThumbSpring) {
            this.cancelThumbSpring();
            this.cancelThumbSpring = undefined;
            this.translateX = this.liveTranslateX;
        }
        this.liveTranslateX = this.translateX;
        this.dragSamples = pushVelocitySample([], {
            x: pageX,
            y: 0,
            t: Date.now(),
        });
    }

    onThumbTouchMove(thumbDragUtils: ThumbDragUtils): ThumbDragUtils {
        thumbDragUtils.isMoved = true;
        thumbDragUtils.touchMoveTime = new Date().valueOf();
        this.dragSamples = pushVelocitySample(this.dragSamples, {
            x: thumbDragUtils.cords.endX,
            y: 0,
            t: Date.now(),
        });

        // Elastic: overshoot past the edges compresses instead of
        // clamping dead (plan 010 physics).
        // Finger motion maps to the logical scroll offset; the mapping
        // mirrors in RTL together with the applied transform sign.
        const dragDelta =
            thumbDragUtils.cords.endX - thumbDragUtils.cords.startX;
        thumbDragUtils.newTranslateX = getElasticThumbTranslate(
            this.translateX + (this.isRtl() ? dragDelta : -dragDelta),
            this.thumbTotalWidth,
            this.thumbOuterWidth,
        );

        // move current slide
        this.liveTranslateX = thumbDragUtils.newTranslateX;
        this.setTranslate(thumbDragUtils.newTranslateX);
        this.$thumbOuter.addClass('lg-dragging');

        if (this.canScrub()) {
            this.beginScrub();
            this.scrubTo(this.liveTranslateX);
        }

        // Windowed strips: a long finger drag can outrun the rendered
        // window, one rebuild recenters it (rare; routine moves only
        // write the transform).
        if (this.isThumbWindowed() && this.renderedThumbWindow) {
            // Rendered coverage in px straight from the window's pads, // [leadingPad, totalWidth - trailingPad].
            const rendered = this.renderedThumbWindow;
            if (
                this.liveTranslateX < rendered.leadingPad ||
                this.liveTranslateX + this.thumbOuterWidth >
                    this.thumbTotalWidth - rendered.trailingPad
            ) {
                this.renderThumbItems(this.core.index, {
                    from: this.liveTranslateX,
                    to: this.liveTranslateX,
                });
            }
        }

        return thumbDragUtils;
    }

    onThumbTouchEnd(thumbDragUtils: ThumbDragUtils): ThumbDragUtils {
        thumbDragUtils.isMoved = false;
        thumbDragUtils.endTime = new Date();
        this.$thumbOuter.removeClass('lg-dragging');

        // Release physics (plan 010): project the windowed velocity to a
        // fling target, clamp into the strip bounds, and spring there, // bounces off the edge on overshoot, pulls back when released
        // inside the rubber band. (Replaces the 2.x magic-numbers
        // momentum, whose transition-duration carried an invalid
        // '<n>settings' unit and silently never glided.)
        const pointerVelocityX = getWindowedVelocity(
            this.dragSamples,
            Date.now(),
        ).x;
        const translateVelocity = this.isRtl()
            ? pointerVelocityX
            : -pointerVelocityX;
        const from = this.liveTranslateX;
        const target = this.getPossibleTransformX(
            from + project(translateVelocity),
        );
        this.$lgThumb.css('transition-duration', '0ms');
        // Windowed strips: render the whole flight corridor before the
        // glide starts, the destination is known at release, so the
        // spring never crosses unrendered thumbs.
        if (this.isThumbWindowed()) {
            this.renderThumbItems(this.core.index, { from, to: target });
        }
        this.cancelThumbSpring = runSprings(
            [{ from, velocity: translateVelocity, target }],
            ([value]) => {
                this.liveTranslateX = value!;
                this.setTranslate(value!);
                // The glide keeps scrubbing, a flicked strip drives the
                // gallery all the way to where it decelerates.
                if (this.scrubActive) {
                    this.scrubTo(value!);
                }
            },
            () => {
                this.cancelThumbSpring = undefined;
                this.translateX = target;
                this.endScrub();
                this.$lgThumb.css(
                    'transition-duration',
                    this.core.settings.speed + 'ms',
                );
                if (this.isThumbWindowed()) {
                    this.renderThumbItems();
                }
            },
        );

        if (
            Math.abs(thumbDragUtils.cords.endX - thumbDragUtils.cords.startX) <
            this.settings.thumbnailSwipeThreshold
        ) {
            this.thumbClickable = true;
        }

        return thumbDragUtils;
    }

    getThumbHtml(thumb: string, index: number, alt?: string): HTMLElement {
        const slideVideoInfo =
            this.core.galleryItems[index].__slideVideoInfo || {};
        let thumbImg;

        if (slideVideoInfo.youtube) {
            if (this.settings.loadYouTubeThumbnail) {
                thumbImg =
                    '//img.youtube.com/vi/' +
                    slideVideoInfo.youtube[1] +
                    '/' +
                    this.settings.youTubeThumbSize +
                    '.jpg';
            } else {
                thumbImg = thumb;
            }
        } else {
            thumbImg = thumb;
        }

        const div = document.createElement('div');
        div.setAttribute('data-lg-item-id', index + '');
        div.className = `lg-thumb-item ${
            index === this.core.index ? 'active' : ''
        }`;
        const marginSide = this.isRtl() ? 'margin-left' : 'margin-right';
        div.style.cssText = `width: ${this.settings.thumbWidth}px; height: ${this.settings.thumbHeight}; ${marginSide}: ${this.settings.thumbMargin}px;`;
        const img = document.createElement('img');
        img.alt = alt || '';
        img.setAttribute('data-lg-item-id', index + '');
        img.src = thumbImg;
        div.appendChild(img);
        return div;
    }

    /**
     * True when the strip renders only a window of thumbs
     * (virtualization.thumbs, plan 010).
     */
    private isThumbWindowed(): boolean {
        return this.core.settings.virtualization?.thumbs !== undefined;
    }

    /**
     * (Re)build the strip contents. Classic mode appends every thumb once;
     * windowed mode renders the visible range plus overscan with spacers
     * preserving the strip geometry, and re-runs at commit points only
     * (open, slide change, drag release, resize, updateSlides), never per
     * pointer move.
     */
    private renderThumbItems(
        activeIndex = this.core.index,
        corridor?: { from: number; to: number },
    ): void {
        const items = this.core
            .galleryItems as unknown as ThumbnailGalleryItem[];
        if (!this.isThumbWindowed()) {
            this.setThumbItemHtml(items);
            return;
        }
        const geometry = {
            stripWidth: this.thumbOuterWidth,
            thumbWidth: this.settings.thumbWidth,
            thumbMargin: this.settings.thumbMargin,
            count: items.length,
            overscan: this.core.settings.virtualization?.thumbs,
        };
        // A corridor covers a fling's whole flight path (or recenters
        // around the live translate during a long drag).
        const thumbWindow = corridor
            ? getThumbCorridorWindow({ ...geometry, ...corridor })
            : getThumbWindow({ ...geometry, translate: this.translateX });
        this.renderedThumbWindow = thumbWindow;
        this.$lgThumb.empty();
        if (thumbWindow.leadingPad > 0) {
            this.$lgThumb.append(
                `<div class="lg-thumb-spacer" aria-hidden="true" style="width: ${thumbWindow.leadingPad}px;"></div>`,
            );
        }
        for (let i = thumbWindow.start; i <= thumbWindow.end; i++) {
            const thumb = this.getThumbHtml(items[i].thumb, i, items[i].alt);
            if (i === activeIndex) {
                thumb.classList.add('active');
            }
            this.$lgThumb.append(thumb);
        }
        if (thumbWindow.trailingPad > 0) {
            this.$lgThumb.append(
                `<div class="lg-thumb-spacer" aria-hidden="true" style="width: ${thumbWindow.trailingPad}px;"></div>`,
            );
        }
    }

    setThumbItemHtml(items: ThumbnailGalleryItem[]): void {
        for (let i = 0; i < items.length; i++) {
            const thumb = this.getThumbHtml(items[i].thumb, i, items[i].alt);
            this.$lgThumb.append(thumb);
        }
    }

    setAnimateThumbStyles(): void {
        if (this.settings.animateThumb) {
            this.core.outer.addClass('lg-animate-thumb');
        }
    }

    // Manage thumbnail active calss
    manageActiveClassOnSlideChange(): void {
        // manage active class for thumbnail
        this.core.LGel.on(
            `${lGEvents.beforeSlide}.thumb`,
            (event: CustomEvent) => {
                const { index } = event.detail;
                this.core.outer.find('.lg-thumb-item').removeClass('active');
                // Id-based lookup: under a windowed strip the item's DOM
                // position no longer equals its gallery index.
                this.core.outer
                    .find(`.lg-thumb-item[data-lg-item-id="${index}"]`)
                    .addClass('active');
            },
        );
    }

    // Toggle thumbnail bar
    toggleThumbBar(): void {
        if (this.settings.toggleThumb) {
            this.core.outer.addClass('lg-can-toggle');
            this.core.$toolbar.append(
                '<button type="button" aria-label="' +
                    (this.settings.thumbnailPluginStrings?.toggleThumbnails ??
                        this.core.settings.strings.toggleThumbnails) +
                    '" class="lg-toggle-thumb lg-icon"></button>',
            );
            this.core.outer
                .find('.lg-toggle-thumb')
                .first()
                .on('click.lg', () => {
                    this.core.outer.toggleClass('lg-components-open');
                });
        }
    }

    thumbKeyPress(): void {
        this.$LG(window).on(`keydown.lg.thumb.global${this.core.lgId}`, (e) => {
            if (!this.core.lgOpened || !this.settings.toggleThumb) return;

            if (e.keyCode === 38) {
                e.preventDefault();
                this.core.outer.addClass('lg-components-open');
            } else if (e.keyCode === 40) {
                e.preventDefault();
                this.core.outer.removeClass('lg-components-open');
            }
        });
    }

    destroy(): void {
        this.endScrub();
        if (this.cancelThumbSpring) {
            this.cancelThumbSpring();
            this.cancelThumbSpring = undefined;
        }
        if (this.settings.thumbnail) {
            this.$LG(window).off(`.lg.thumb.global${this.core.lgId}`);
            this.core.LGel.off('.lg.thumb');
            this.core.LGel.off('.thumb');
            this.$thumbOuter.remove();
            this.core.outer.removeClass('lg-has-thumb');
        }
    }
}
