var thumbnailsDefaults = {
    thumbnail: true,
    animateThumb: true,
    currentPagerPosition: 'middle',
    thumbWidth: 100,
    thumbHeight: '80px',
    thumbContHeight: 100,
    thumbMargin: 5,
    exThumbImage: false,
    showThumbByDefault: true,
    toggleThumb: true,
    pullCaptionUp: true,
    enableThumbDrag: true,
    enableThumbSwipe: true,
    swipeThreshold: 10,
    loadYoutubeThumbnail: true,
    youtubeThumbSize: 1,
    loadVimeoThumbnail: true,
    vimeoThumbSize: 'thumbnail_small',
    loadDailymotionThumbnail: true,
};
//# sourceMappingURL=lg-thumbnail-settings.js.map

var LG = window.LG;
var Thumbnail = /** @class */ (function () {
    function Thumbnail(instance) {
        this.thumbOuterWidth = 0;
        this.thumbTotalWidth = 0;
        this.translateX = 0;
        this.thumbClickable = false;
        // get lightGallery core plugin data
        this.core = instance;
        // extend module default settings with lightGallery core settings
        this.s = Object.assign({}, thumbnailsDefaults, this.core.s);
        this.init();
        return this;
    }
    Thumbnail.prototype.init = function () {
        this.getThumbnails();
        this.thumbOuterWidth = 0;
        this.thumbTotalWidth =
            this.core.galleryItems.length *
                (this.s.thumbWidth + this.s.thumbMargin);
        // Thumbnail animation value
        this.translateX = 0;
        this.setAnimateThumbStyles();
        if (this.s.thumbnail && this.core.galleryItems.length > 1) {
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
            }
            else {
                this.thumbClickable = true;
            }
            this.toggleThumbBar();
            this.thumbKeyPress();
        }
    };
    Thumbnail.prototype.build = function () {
        var _this = this;
        this.setThumbMarkup();
        var $thumb = this.core.outer.find('.lg-thumb-item');
        this.loadVimeoThumbs($thumb, this.s.vimeoThumbSize);
        this.manageActiveClas();
        this.$lgThumb.first().on('click.lg touchend.lg', function (e) {
            var $target = LG(e.target);
            if (!$target.hasAttribute('data-lg-item-id')) {
                return;
            }
            setTimeout(function () {
                // In IE9 and bellow touch does not support
                // Go to slide if browser does not support css transitions
                if ((_this.thumbClickable && !_this.core.lgBusy) ||
                    !_this.core.doCss()) {
                    var index = parseInt($target.attr('data-lg-item-id'));
                    console.log(index, $target.attr('data-lg-item-id'));
                    _this.core.slide(index, false, true, false);
                }
            }, 50);
        });
        this.core.LGel.on('onBeforeSlide.lg.thumb', function (e) {
            console.log(e, e.detail);
            _this.animateThumb(_this.core.index);
        });
        this.core.LGel.on('onAfterOpen.lg.thumb', function (e) {
            if (_this.s.showThumbByDefault) {
                var timeout = _this.core.s.zoomFromImage
                    ? _this.core.s.startAnimationDuration
                    : _this.core.s.backdropDuration;
                setTimeout(function () {
                    _this.core.outer.addClass('lg-thumb-open');
                }, timeout + 200);
            }
        });
        this.core.LGel.on('onBeforeClose.lg.thumb', function (e) {
            _this.core.outer.removeClass('lg-thumb-open');
        });
        this.core.LGel.on('appendSlides.lg.thumb', function (e) {
            _this.addNewThumbnails(e.detail.items);
        });
        LG(window).on("resize.lg.thumb.global" + this.core.lgId + " orientationchange.lg.thumb.global" + this.core.lgId, function () {
            if (!_this.core.lgOpened)
                return;
            setTimeout(function () {
                _this.animateThumb(_this.core.index);
                _this.thumbOuterWidth = window.innerWidth;
            }, 200);
        });
    };
    Thumbnail.prototype.setThumbMarkup = function () {
        var html = "<div class=\"lg-thumb-outer\">\n        <div class=\"lg-thumb lg-group\">\n        </div>\n        </div>";
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
        this.setThumbItemHtml(this.core.galleryItems);
    };
    Thumbnail.prototype.enableThumbDrag = function () {
        var _this = this;
        var thumbDragUtils = {
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
        var isDragging = false;
        this.$thumbOuter.addClass('lg-grab');
        this.core.outer
            .find('.lg-thumb')
            .first()
            .on('mousedown.lg.thumb', function (e) {
            if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                // execute only on .lg-object
                e.preventDefault();
                thumbDragUtils.cords.startX = e.pageX;
                thumbDragUtils.startTime = new Date();
                _this.thumbClickable = false;
                isDragging = true;
                // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                _this.core.outer.get().scrollLeft += 1;
                _this.core.outer.get().scrollLeft -= 1;
                // *
                _this.$thumbOuter
                    .removeClass('lg-grab')
                    .addClass('lg-grabbing');
            }
        });
        LG(window).on("mousemove.lg.thumb.global" + this.core.lgId, function (e) {
            if (!_this.core.lgOpened)
                return;
            if (isDragging) {
                thumbDragUtils.cords.endX = e.pageX;
                thumbDragUtils = _this.onThumbTouchMove(thumbDragUtils);
            }
        });
        LG(window).on("mouseup.lg.thumb.global" + this.core.lgId, function () {
            if (!_this.core.lgOpened)
                return;
            if (thumbDragUtils.isMoved) {
                thumbDragUtils = _this.onThumbTouchEnd(thumbDragUtils);
            }
            else {
                _this.thumbClickable = true;
            }
            if (isDragging) {
                isDragging = false;
                _this.$thumbOuter.removeClass('lg-grabbing').addClass('lg-grab');
            }
        });
    };
    Thumbnail.prototype.enableThumbSwipe = function () {
        var _this = this;
        var thumbDragUtils = {
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
        this.$lgThumb.on('touchstart.lg', function (e) {
            if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                e.preventDefault();
                thumbDragUtils.cords.startX = e.targetTouches[0].pageX;
                _this.thumbClickable = false;
                thumbDragUtils.startTime = new Date();
            }
        });
        this.$lgThumb.on('touchmove.lg', function (e) {
            if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                e.preventDefault();
                thumbDragUtils.cords.endX = e.targetTouches[0].pageX;
                thumbDragUtils = _this.onThumbTouchMove(thumbDragUtils);
            }
        });
        this.$lgThumb.on('touchend.lg', function () {
            if (thumbDragUtils.isMoved) {
                thumbDragUtils = _this.onThumbTouchEnd(thumbDragUtils);
            }
            else {
                _this.thumbClickable = true;
            }
        });
    };
    Thumbnail.prototype.addNewThumbnails = function (items) {
        this.appendThumbItems(items);
        this.thumbTotalWidth =
            this.core.galleryItems.length *
                (this.s.thumbWidth + this.s.thumbMargin);
        this.$lgThumb.css('width', this.thumbTotalWidth + 'px');
        this.manageActiveClas();
        this.animateThumb(this.core.index);
    };
    Thumbnail.prototype.appendThumbItems = function (items) {
        this.setThumbItemHtml(items);
    };
    // @ts-check
    Thumbnail.prototype.setTranslate = function (value) {
        // jQuery supports Automatic CSS prefixing since jQuery 1.8.0
        this.$lgThumb.css('transform', 'translate3d(-' + value + 'px, 0px, 0px)');
    };
    Thumbnail.prototype.getPossibleTransformX = function (left) {
        if (left > this.thumbTotalWidth - this.thumbOuterWidth) {
            left = this.thumbTotalWidth - this.thumbOuterWidth;
        }
        if (left < 0) {
            left = 0;
        }
        return left;
    };
    Thumbnail.prototype.animateThumb = function (index) {
        this.$lgThumb.css('transition-duration', this.core.s.speed + 'ms');
        if (this.s.animateThumb) {
            var position = 0;
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
                    this.$lgThumb.animate({
                        left: -this.translateX + 'px',
                    }, this.core.s.speed);
                }
            }
            else {
                if (!this.core.doCss()) {
                    this.$lgThumb.css('left', -this.translateX + 'px');
                }
            }
            this.setTranslate(this.translateX);
        }
    };
    Thumbnail.prototype.onThumbTouchMove = function (thumbDragUtils) {
        thumbDragUtils.newTranslateX = this.translateX;
        thumbDragUtils.isMoved = true;
        thumbDragUtils.touchMoveTime = new Date().valueOf();
        thumbDragUtils.newTranslateX -=
            thumbDragUtils.cords.endX - thumbDragUtils.cords.startX;
        thumbDragUtils.newTranslateX = this.getPossibleTransformX(thumbDragUtils.newTranslateX);
        // move current slide
        this.setTranslate(thumbDragUtils.newTranslateX);
        this.$thumbOuter.addClass('lg-dragging');
        return thumbDragUtils;
    };
    Thumbnail.prototype.onThumbTouchEnd = function (thumbDragUtils) {
        thumbDragUtils.isMoved = false;
        thumbDragUtils.endTime = new Date();
        this.$thumbOuter.removeClass('lg-dragging');
        var touchDuration = thumbDragUtils.endTime.valueOf() -
            thumbDragUtils.startTime.valueOf();
        var distanceXnew = thumbDragUtils.cords.endX - thumbDragUtils.cords.startX;
        var speedX = Math.abs(distanceXnew) / touchDuration;
        // Some magical numbers
        // Can be improved
        if (speedX > 0.15 &&
            thumbDragUtils.endTime.valueOf() - thumbDragUtils.touchMoveTime < 30) {
            speedX += 1;
            if (speedX > 2) {
                speedX += 1;
            }
            speedX =
                speedX +
                    speedX * (Math.abs(distanceXnew) / this.thumbOuterWidth);
            this.$lgThumb.css('transition-duration', Math.min(speedX - 1, 2) + 's');
            distanceXnew = distanceXnew * speedX;
            this.translateX = this.getPossibleTransformX(this.translateX - distanceXnew);
            this.setTranslate(this.translateX);
        }
        else {
            this.translateX = thumbDragUtils.newTranslateX;
        }
        if (Math.abs(thumbDragUtils.cords.endX - thumbDragUtils.cords.startX) <
            this.s.swipeThreshold) {
            this.thumbClickable = true;
        }
        return thumbDragUtils;
    };
    Thumbnail.prototype.getVimeoErrorThumbSize = function (size) {
        var vimeoErrorThumbSize = '';
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
    };
    Thumbnail.prototype.getThumbHtml = function (thumb, index) {
        var slideVideoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
        var thumbImg;
        var vimeoId = '';
        if (slideVideoInfo.youtube ||
            slideVideoInfo.vimeo ||
            slideVideoInfo.dailymotion) {
            if (slideVideoInfo.youtube) {
                if (this.s.loadYoutubeThumbnail) {
                    thumbImg =
                        '//img.youtube.com/vi/' +
                            slideVideoInfo.youtube[1] +
                            '/' +
                            this.s.youtubeThumbSize +
                            '.jpg';
                }
                else {
                    thumbImg = thumb;
                }
            }
            else if (slideVideoInfo.vimeo) {
                if (this.s.loadVimeoThumbnail) {
                    var vimeoErrorThumbSize = this.getVimeoErrorThumbSize(this.s.vimeoThumbSize);
                    thumbImg =
                        '//i.vimeocdn.com/video/error_' +
                            vimeoErrorThumbSize +
                            '.jpg';
                    vimeoId = slideVideoInfo.vimeo[1];
                }
                else {
                    thumbImg = thumb;
                }
            }
            else if (slideVideoInfo.dailymotion) {
                if (this.s.loadDailymotionThumbnail) {
                    thumbImg =
                        '//www.dailymotion.com/thumbnail/video/' +
                            slideVideoInfo.dailymotion[1];
                }
                else {
                    thumbImg = thumb;
                }
            }
        }
        else {
            thumbImg = thumb;
        }
        return "<div " + (vimeoId ? 'data-vimeo-id="${vimeoId}"' : '') + " data-lg-item-id=\"" + index + "\" class=\"lg-thumb-item\" \n        style=\"width:" + this.s.thumbWidth + "px; \n            height: " + this.s.thumbHeight + "; \n            margin-right: " + this.s.thumbMargin + "px\">\n            <img data-lg-item-id=\"" + index + "\" src=\"" + thumbImg + "\" />\n        </div>";
    };
    Thumbnail.prototype.setThumbItemHtml = function (items) {
        var thumbList = '';
        for (var i = 0; i < items.length; i++) {
            thumbList += this.getThumbHtml(items[i].thumb, i);
        }
        this.$lgThumb.append(thumbList);
    };
    Thumbnail.prototype.getThumbnails = function () {
        for (var i = 0; i < this.core.items.length; i++) {
            var element = this.core.items[i];
            var thumb = this.s.exThumbImage
                ? LG(element).attr(this.s.exThumbImage)
                : LG(element).find('img').first().attr('src');
            this.core.galleryItems[i].thumb = thumb;
        }
    };
    // @todo - convert to js and ts
    Thumbnail.prototype.loadVimeoThumbs = function ($thumb, size) {
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
    };
    Thumbnail.prototype.setAnimateThumbStyles = function () {
        if (this.s.animateThumb) {
            this.s.thumbHeight = '100%';
            this.core.outer.addClass('lg-animate-thumb');
        }
    };
    // Manage thumbnail active calss
    Thumbnail.prototype.manageActiveClas = function () {
        var _this = this;
        var $thumb = this.core.outer.find('.lg-thumb-item');
        // manage active class for thumbnail
        $thumb.eq(this.core.index).addClass('active');
        this.core.LGel.on('onBeforeSlide.lg.thumb', function () {
            $thumb.removeClass('active');
            $thumb.eq(_this.core.index).addClass('active');
        });
    };
    // Toggle thumbnail bar
    Thumbnail.prototype.toggleThumbBar = function () {
        var _this = this;
        if (this.s.toggleThumb) {
            this.core.outer.addClass('lg-can-toggle');
            this.$thumbOuter.append('<button type="button" aria-label="Toggle thumbnails" class="lg-toggle-thumb lg-icon"></button>');
            this.core.outer
                .find('.lg-toggle-thumb')
                .first()
                .on('click.lg', function () {
                _this.core.outer.toggleClass('lg-thumb-open');
            });
        }
    };
    Thumbnail.prototype.thumbKeyPress = function () {
        var _this = this;
        LG(window).on("keydown.lg.thumb.global" + this.core.lgId, function (e) {
            if (!_this.core.lgOpened)
                return;
            if (e.keyCode === 38) {
                e.preventDefault();
                _this.core.outer.addClass('lg-thumb-open');
            }
            else if (e.keyCode === 40) {
                e.preventDefault();
                _this.core.outer.removeClass('lg-thumb-open');
            }
        });
    };
    Thumbnail.prototype.destroy = function (clear) {
        if (clear && this.s.thumbnail && this.core.galleryItems.length > 1) {
            LG(window).off(".lg.thumb.global" + this.core.lgId);
            this.core.LGel.off('.lg.thumb');
            this.$thumbOuter.remove();
            this.core.outer.removeClass('lg-has-thumb');
        }
    };
    return Thumbnail;
}());
window.lgModules = window.lgModules || {};
window.lgModules.thumbnail = Thumbnail;

export { Thumbnail };
//# sourceMappingURL=lg-thumbnail.es5.js.map
