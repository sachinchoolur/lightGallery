import {
    ThumbnailsDefaults,
    thumbnailsDefaults,
} from './lg-thumbnail-settings';
import { LG, lgQuery } from '../../lgQuery';
import { LightGallery } from '../../lightgallery';
import { DynamicItem } from '../../lg-utils';
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

interface ThumbnailDynamicItem extends DynamicItem {
    thumb: string;
}
export class Thumbnail {
    private core: LightGallery;
    private $thumbOuter: any;
    private $lgThumb: any;
    private thumbOuterWidth = 0;
    private thumbTotalWidth = 0;
    private translateX = 0;
    private thumbClickable = false;
    private s: ThumbnailsDefaults;
    constructor(instance: LightGallery) {
        // get lightGallery core plugin data
        this.core = instance;
        // extend module default settings with lightGallery core settings
        this.s = Object.assign({}, thumbnailsDefaults);

        this.init();

        return this;
    }

    init(): void {
        this.getThumbnails();

        this.thumbOuterWidth = 0;
        this.thumbTotalWidth =
            this.core.galleryItems.length *
            (this.s.thumbWidth + this.s.thumbMargin);

        // Thumbnail animation value
        this.translateX = 0;

        this.setAnimateThumbStyles();

        if (this.s.thumbnail && this.core.galleryItems.length > 1) {
            if (this.s.showThumbByDefault) {
                setTimeout(() => {
                    this.core.outer.addClass('lg-thumb-open');
                }, 700);
            }

            if (this.s.pullCaptionUp) {
                this.core.outer.addClass('lg-pull-caption-up');
            }

            this.build();
            if (this.s.animateThumb && this.core.doCss()) {
                if (this.s.enableThumbDrag) {
                    this.enableThumbDrag();
                }

                if (this.s.enableThumbSwipe) {
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

        const $thumb = this.core.outer.find('.lg-thumb-item');

        this.loadVimeoThumbs($thumb, this.s.vimeoThumbSize);
        this.manageActiveClas();
        this.$lgThumb.first().on('click.lg touchend.lg', (e: CustomEvent) => {
            const $target = LG(e.target);
            if (!$target.hasAttribute('data-lg-item-id')) {
                return;
            }
            setTimeout(() => {
                // In IE9 and bellow touch does not support
                // Go to slide if browser does not support css transitions
                if (
                    (this.thumbClickable && !this.core.lgBusy) ||
                    !this.core.doCss()
                ) {
                    const index = parseInt($target.attr('data-lg-item-id'));
                    console.log(index, $target.attr('data-lg-item-id'));
                    this.core.slide(index, false, true, false);
                }
            }, 50);
        });

        LG(this.core.el).on('onBeforeSlide.lg-tm', (e) => {
            console.log(e, e.detail);
            this.animateThumb(this.core.index);
        });

        this.core.LGel.on('appendSlides.lg-tm', (e) => {
            this.addNewThumbnails(e.detail.items);
        });

        LG(window).on('resize.lg.thumb orientationchange.lg.thumb', () => {
            if (!this.core.lgOpened) return;
            setTimeout(() => {
                this.animateThumb(this.core.index);
                this.thumbOuterWidth = window.innerWidth;
            }, 200);
        });
    }

    setThumbMarkup(): void {
        const html = `<div class="lg-thumb-outer">
        <div class="lg-thumb lg-group">
        </div>
        </div>`;

        this.core.outer.addClass('lg-has-thumb');

        this.core.outer.find('.lg').append(html);

        this.$thumbOuter = this.core.outer.find('.lg-thumb-outer').first();
        this.$lgThumb = this.core.outer.find('.lg-thumb').first();
        this.thumbOuterWidth = window.innerWidth;

        if (this.s.animateThumb) {
            this.core.outer
                .find('.lg-thumb')
                .css('transition-duration', this.core.s.speed + 'ms')
                .css('width', this.thumbTotalWidth + 'px')
                .css('position', 'relative');
            this.$thumbOuter.css('height', this.s.thumbContHeight + 'px');
        }

        this.setThumbItemHtml(
            (this.core.galleryItems as unknown) as ThumbnailDynamicItem[],
        );
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

        LG(window).on('mousemove.lg.thumb', (e) => {
            if (isDragging) {
                thumbDragUtils.cords.endX = e.pageX;

                thumbDragUtils = this.onThumbTouchMove(thumbDragUtils);
            }
        });

        LG(window).on('mouseup.lg.thumb', () => {
            if (thumbDragUtils.isMoved) {
                thumbDragUtils = this.onThumbTouchEnd(thumbDragUtils);
            } else {
                this.thumbClickable = true;
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
            }
        });
    }

    addNewThumbnails(items: ThumbnailDynamicItem[]): void {
        this.appendThumbItems(items);
        this.thumbTotalWidth =
            this.core.galleryItems.length *
            (this.s.thumbWidth + this.s.thumbMargin);
        this.$lgThumb.css('width', this.thumbTotalWidth + 'px');
        this.manageActiveClas();
        this.animateThumb(this.core.index);
    }

    appendThumbItems(items: ThumbnailDynamicItem[]): void {
        this.setThumbItemHtml(items);
    }

    // @ts-check

    setTranslate(value: number): void {
        // jQuery supports Automatic CSS prefixing since jQuery 1.8.0
        this.$lgThumb.css(
            'transform',
            'translate3d(-' + value + 'px, 0px, 0px)',
        );
    }

    getPossibleTransformX(left: number): number {
        if (left > this.thumbTotalWidth - this.thumbOuterWidth) {
            left = this.thumbTotalWidth - this.thumbOuterWidth;
        }

        if (left < 0) {
            left = 0;
        }
        return left;
    }

    animateThumb(index: number): void {
        this.$lgThumb.css('transition-duration', this.core.s.speed + 'ms');
        if (this.s.animateThumb) {
            let position = 0;
            switch (this.s.currentPagerPosition) {
                case 'left':
                    position = 0;
                    break;
                case 'middle':
                    position = this.thumbOuterWidth / 2 - this.s.thumbWidth / 2;
                    break;
                case 'right':
                    position = this.thumbOuterWidth - this.s.thumbWidth;
            }
            this.translateX =
                (this.s.thumbWidth + this.s.thumbMargin) * index - 1 - position;
            if (this.translateX > this.thumbTotalWidth - this.thumbOuterWidth) {
                this.translateX = this.thumbTotalWidth - this.thumbOuterWidth;
            }

            if (this.translateX < 0) {
                this.translateX = 0;
            }

            if (this.core.lGalleryOn) {
                if (!this.core.doCss()) {
                    this.$lgThumb.animate(
                        {
                            left: -this.translateX + 'px',
                        },
                        this.core.s.speed,
                    );
                }
            } else {
                if (!this.core.doCss()) {
                    this.$lgThumb.css('left', -this.translateX + 'px');
                }
            }

            this.setTranslate(this.translateX);
        }
    }

    onThumbTouchMove(thumbDragUtils: ThumbDragUtils): ThumbDragUtils {
        thumbDragUtils.newTranslateX = this.translateX;
        thumbDragUtils.isMoved = true;

        thumbDragUtils.touchMoveTime = new Date().valueOf();

        thumbDragUtils.newTranslateX -=
            thumbDragUtils.cords.endX - thumbDragUtils.cords.startX;

        thumbDragUtils.newTranslateX = this.getPossibleTransformX(
            thumbDragUtils.newTranslateX,
        );

        // move current slide
        this.setTranslate(thumbDragUtils.newTranslateX);
        this.$thumbOuter.addClass('lg-dragging');

        return thumbDragUtils;
    }

    onThumbTouchEnd(thumbDragUtils: ThumbDragUtils): ThumbDragUtils {
        thumbDragUtils.isMoved = false;
        thumbDragUtils.endTime = new Date();
        this.$thumbOuter.removeClass('lg-dragging');

        const touchDuration =
            thumbDragUtils.endTime.valueOf() -
            thumbDragUtils.startTime.valueOf();
        let distanceXnew =
            thumbDragUtils.cords.endX - thumbDragUtils.cords.startX;
        let speedX = Math.abs(distanceXnew) / touchDuration;
        // Some magical numbers
        // Can be improved
        if (
            speedX > 0.15 &&
            thumbDragUtils.endTime.valueOf() - thumbDragUtils.touchMoveTime < 30
        ) {
            let transitionDuration = speedX;
            transitionDuration = Math.max(0.9, transitionDuration);

            speedX += 1;

            if (speedX > 2) {
                speedX += 1;
            }
            speedX =
                speedX +
                speedX * (Math.abs(distanceXnew) / this.thumbOuterWidth);
            this.$lgThumb.css(
                'transition-duration',
                Math.min(speedX - 1, 2) + 's',
            );

            distanceXnew = distanceXnew * speedX;

            this.translateX = this.getPossibleTransformX(
                this.translateX - distanceXnew,
            );
            this.setTranslate(this.translateX);
        } else {
            this.translateX = thumbDragUtils.newTranslateX;
        }
        if (
            Math.abs(thumbDragUtils.cords.endX - thumbDragUtils.cords.startX) <
            this.s.swipeThreshold
        ) {
            this.thumbClickable = true;
        }

        return thumbDragUtils;
    }

    getVimeoErrorThumbSize(size: string): string {
        let vimeoErrorThumbSize = '';
        switch (size) {
            case 'thumbnail_large':
                vimeoErrorThumbSize = '640';
                break;
            case 'thumbnail_medium':
                vimeoErrorThumbSize = '200x150';
                break;
            case 'thumbnail_small':
                vimeoErrorThumbSize = '100x75';
        }
        return vimeoErrorThumbSize;
    }

    getThumbHtml(thumb: any, index: number): string {
        const slideVideoInfo =
            this.core.galleryItems[index].__slideVideoInfo || {};
        let thumbImg;
        let vimeoId = '';

        if (
            slideVideoInfo.youtube ||
            slideVideoInfo.vimeo ||
            slideVideoInfo.dailymotion
        ) {
            if (slideVideoInfo.youtube) {
                if (this.s.loadYoutubeThumbnail) {
                    thumbImg =
                        '//img.youtube.com/vi/' +
                        slideVideoInfo.youtube[1] +
                        '/' +
                        this.s.youtubeThumbSize +
                        '.jpg';
                } else {
                    thumbImg = thumb;
                }
            } else if (slideVideoInfo.vimeo) {
                if (this.s.loadVimeoThumbnail) {
                    const vimeoErrorThumbSize = this.getVimeoErrorThumbSize(
                        this.s.vimeoThumbSize,
                    );
                    thumbImg =
                        '//i.vimeocdn.com/video/error_' +
                        vimeoErrorThumbSize +
                        '.jpg';
                    vimeoId = slideVideoInfo.vimeo[1];
                } else {
                    thumbImg = thumb;
                }
            } else if (slideVideoInfo.dailymotion) {
                if (this.s.loadDailymotionThumbnail) {
                    thumbImg =
                        '//www.dailymotion.com/thumbnail/video/' +
                        slideVideoInfo.dailymotion[1];
                } else {
                    thumbImg = thumb;
                }
            }
        } else {
            thumbImg = thumb;
        }

        return `<div ${
            vimeoId ? 'data-vimeo-id="${vimeoId}"' : ''
        } data-lg-item-id="${index}" class="lg-thumb-item" 
        style="width:${this.s.thumbWidth}px; 
            height: ${this.s.thumbHeight}; 
            margin-right: ${this.s.thumbMargin}px">
            <img data-lg-item-id="${index}" src="${thumbImg}" />
        </div>`;
    }

    setThumbItemHtml(items: ThumbnailDynamicItem[]): void {
        let thumbList = '';
        for (let i = 0; i < items.length; i++) {
            thumbList += this.getThumbHtml(items[i].thumb, i);
        }

        this.$lgThumb.append(thumbList);
    }

    getThumbnails(): void {
        for (let i = 0; i < this.core.items.length; i++) {
            const element = this.core.items[i];
            const thumb = this.s.exThumbImage
                ? LG(element).attr(this.s.exThumbImage)
                : LG(element).find('img').first().attr('src');
            this.core.galleryItems[i].thumb = thumb;
        }
    }

    // @todo - convert to js and ts
    loadVimeoThumbs($thumb: lgQuery, size: string) {
        // Load vimeo thumbnails
        // $thumb.each(function () {
        //     var $this = LG(this);
        //     var vimeoVideoId = $this.attr("data-vimeo-id");
        //     if (vimeoVideoId) {
        //         $.getJSON(
        //             "//www.vimeo.com/api/v2/video/" +
        //                 vimeoVideoId +
        //                 ".json?callback=?",
        //             {
        //                 format: "json",
        //             },
        //             function (data) {
        //                 $this.find("img").attr("src", data[0][size]);
        //             }
        //         );
        //     }
        // });
    }

    setAnimateThumbStyles(): void {
        if (this.s.animateThumb) {
            this.s.thumbHeight = '100%';
            this.core.outer.addClass('lg-animate-thumb');
        }
    }

    // Manage thumbnail active calss
    manageActiveClas(): void {
        const $thumb = this.core.outer.find('.lg-thumb-item');

        // manage active class for thumbnail
        $thumb.eq(this.core.index).addClass('active');
        this.core.LGel.on('onBeforeSlide.lg.tm', () => {
            $thumb.removeClass('active');
            $thumb.eq(this.core.index).addClass('active');
        });
    }

    // Toggle thumbnail bar
    toggleThumbBar(): void {
        if (this.s.toogleThumb) {
            this.core.outer.addClass('lg-can-toggle');
            this.$thumbOuter.append(
                '<span class="lg-toogle-thumb lg-icon"></span>',
            );
            this.core.outer
                .find('.lg-toogle-thumb')
                .first()
                .on('click.lg', () => {
                    this.core.outer.toggleClass('lg-thumb-open');
                });
        }
    }

    thumbKeyPress(): void {
        LG(window).on('keydown.lg.thumb', (e) => {
            if (!this.core.lgOpened) return;

            if (e.keyCode === 38) {
                e.preventDefault();
                this.core.outer.addClass('lg-thumb-open');
            } else if (e.keyCode === 40) {
                e.preventDefault();
                this.core.outer.removeClass('lg-thumb-open');
            }
        });
    }

    destroy(): void {
        if (this.s.thumbnail && this.core.galleryItems.length > 1) {
            LG(window).off('lg.thumb');
            this.$thumbOuter.remove();
            this.core.outer.removeClass('lg-has-thumb');
        }
    }
}
window.lgModules = window.lgModules || {};
window.lgModules.thumbnail = Thumbnail;