"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightGallery = void 0;
var lg_utils_1 = require("./lg-utils");
var lgQuery_1 = require("./lgQuery");
window.LG = lgQuery_1.LG;
// @ref - https://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio
// @ref - https://2ality.com/2017/04/setting-up-multi-platform-packages.html
var lg_defaults_1 = require("./lg-defaults");
var lgId = 0;
window.lgModules = window.lgModules || {};
var LightGallery = /** @class */ (function () {
    function LightGallery(element, options) {
        this.lgOpened = false;
        this.index = 0;
        // lightGallery modules
        this.modules = {};
        // false when lightGallery load first slide content;
        this.lGalleryOn = false;
        // True when a slide animation is in progress
        this.lgBusy = false;
        this.currentItemsInDom = [];
        // Scroll top value before lightGallery is opened
        this.prevScrollTop = 0;
        lgId++;
        this.lgId = lgId;
        this.el = element;
        this.LGel = lgQuery_1.LG(element);
        // lightGallery settings
        this.s = Object.assign({}, lg_defaults_1.defaults, options);
        // When using dynamic mode, ensure dynamicEl is an array
        if (this.s.dynamic &&
            this.s.dynamicEl !== undefined &&
            !Array.isArray(this.s.dynamicEl)) {
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
        if (this.s.preload &&
            this.s.preload > (this.s.dynamicEl || []).length) {
            this.s.preload = (this.s.dynamicEl || []).length;
        }
        this.init();
        return this;
    }
    LightGallery.prototype.init = function () {
        var _this = this;
        this.addSlideVideoInfo(this.galleryItems);
        var fromHash = this.buildFromHash();
        var openGalleryAfter = 0;
        if (!fromHash) {
            openGalleryAfter = this.buildStructure();
        }
        if (this.s.dynamic) {
            var index_1 = this.s.index || 0;
            setTimeout(function () {
                _this.openGallery(index_1);
            }, openGalleryAfter);
        }
        else {
            var _loop_1 = function (index) {
                var element = this_1.items[index];
                // Using different namespace for click because click event should not unbind if selector is same object('this')
                // @todo manage all event listners - should have namespace that represent element
                lgQuery_1.LG(element).on("click.lgcustom-item-" + index, function (e) {
                    e.preventDefault();
                    var currentItemIndex = _this.s.index || index;
                    var transform;
                    if (_this.s.zoomFromImage) {
                        var imageSize = lg_utils_1.default.getSize(element);
                        transform = lg_utils_1.default.getTransform(element, imageSize);
                    }
                    _this.openGallery(currentItemIndex, transform);
                });
            };
            var this_1 = this;
            // Using for loop instead of using bubbling as the items can be any html element.
            for (var index = 0; index < this.items.length; index++) {
                _loop_1(index);
            }
        }
    };
    LightGallery.prototype.buildModules = function () {
        var _this = this;
        // module constructor
        // Modules are build incrementally.
        // Gallery should be opened only once all the modules are initialized.
        // use moduleBuildTimeout to make sure this
        var numberOfModules = 0;
        var _loop_2 = function (key) {
            numberOfModules++;
            (function (num) {
                setTimeout(function () {
                    _this.modules[key] = new window.lgModules[key](_this);
                }, 10 * num);
            })(numberOfModules);
        };
        for (var key in window.lgModules) {
            _loop_2(key);
        }
        return numberOfModules * 10;
    };
    LightGallery.prototype.getSlideItem = function (index) {
        return lgQuery_1.LG(this.getSlideItemId(index));
    };
    LightGallery.prototype.getSlideItemId = function (index) {
        return "#lg-item-" + this.lgId + "-" + index;
    };
    LightGallery.prototype.getById = function (id) {
        return id + "-" + this.lgId;
    };
    LightGallery.prototype.buildStructure = function () {
        var _this = this;
        var container = lgQuery_1.LG("#" + this.getById('lg-container')).get();
        if (container && container.length) {
            return 0;
        }
        var controls = '';
        var subHtmlCont = '';
        // Create controls
        if (this.s.controls && this.galleryItems.length > 1) {
            controls = "<div class=\"lg-actions\">\n                <button type=\"button\" id=\"" + this.getById('lg-prev') + "\" aria-label=\"Previous slide\" class=\"lg-prev lg-icon\"> " + this.s.prevHtml + " </button>\n                <button type=\"button\" id=\"" + this.getById('lg-next') + "\" aria-label=\"Next slide\" class=\"lg-next lg-icon\"> " + this.s.nextHtml + " </button>\n                </div>";
        }
        if (this.s.appendSubHtmlTo === '.lg-sub-html') {
            subHtmlCont =
                '<div class="lg-sub-html" role="status" aria-live="polite"></div>';
        }
        var addClasses = '';
        if (this.s.hideSubHtml) {
            // Do not remove space before last single quote
            addClasses += 'lg-hide-sub-html ';
        }
        var ariaLabelledby = this.s.ariaLabelledby
            ? 'aria-labelledby="' + this.s.ariaLabelledby + '"'
            : '';
        var ariaDescribedby = this.s.ariaDescribedby
            ? 'aria-describedby="' + this.s.ariaDescribedby + '"'
            : '';
        var template = "\n        <div class=\"lg-container\" id=\"" + this.getById('lg-container') + "\" tabindex=\"-1\" aria-modal=\"true\" " + ariaLabelledby + " " + ariaDescribedby + " role=\"dialog\"\n        >\n            <div id=\"" + this.getById('lg-backdrop') + "\" class=\"lg-backdrop\"></div>\n\n            <div id=\"" + this.getById('lg-outer') + "\" class=\"lg-outer lg-hide-items " + this.s.addClass + " " + addClasses + "\">\n                    <div class=\"lg\" style=\"width: " + this.s.width + "; height:" + this.s.height + "\">\n                        <div id=\"" + this.getById('lg-inner') + "\" class=\"lg-inner\"></div>\n                        <div id=\"" + this.getById('lg-toolbar') + "\" class=\"lg-toolbar lg-group\">\n                        <button type=\"button\" aria-label=\"Close gallery\" id=\"" + this.getById('lg-close') + "\" class=\"lg-close lg-icon\"></button>\n                    </div>\n                    " + controls + "\n                    " + subHtmlCont + "\n                </div> \n            </div>\n        </div>\n        ";
        lgQuery_1.LG(document.body).append(template);
        this.outer = lgQuery_1.LG("#" + this.getById('lg-outer'));
        this.outer.get().focus();
        if (this.s.useLeft) {
            this.outer.addClass('lg-use-left');
            // Set mode lg-slide if use left is true;
            this.s.mode = 'lg-slide';
        }
        else {
            this.outer.addClass('lg-use-css3');
        }
        // add Class for css support and transition mode
        if (this.doCss()) {
            this.outer.addClass('lg-css3');
        }
        else {
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
            var $inner = lgQuery_1.LG("#" + this.getById('lg-inner'));
            $inner.css('transition-timing-function', this.s.cssEasing);
            $inner.css('transition-duration', this.s.speed + 'ms');
        }
        if (this.s.download) {
            this.outer
                .find('.lg-toolbar')
                .append("<a id=\"" + this.getById('lg-download') + "\" target=\"_blank\" aria-label=\"Download\" download class=\"lg-download lg-icon\"></a>");
        }
        this.counter();
        lgQuery_1.LG(window).on('resize.lg orientationchange.lg', function () {
            if (_this.s.zoomFromImage && !_this.s.dynamic) {
                var imgStyle = _this.getDummyImgStyles();
                _this.outer
                    .find('.lg-current .lg-dummy-img')
                    .first()
                    .attr('style', imgStyle);
            }
        });
        this.hideBars();
        this.closeGallery();
        return this.buildModules();
    };
    // Append new slides dynamically while gallery is open
    // Items has to in the form of an array of dynamicEl
    LightGallery.prototype.appendSlides = function (items) {
        this.galleryItems = this.galleryItems.concat(items);
        lgQuery_1.LG("#" + this.getById('lg-counter-all')).html(this.galleryItems.length + '');
        this.LGel.trigger('appendSlides.lg', { items: items });
    };
    // Get gallery items based on multiple conditions
    // @todo - remove this.$items
    LightGallery.prototype.getItems = function () {
        // Gallery items
        this.items = [];
        if (!this.s.dynamic) {
            if (this.s.selector === 'this') {
                this.items.push(this.el);
            }
            else if (this.s.selector) {
                if (this.s.selectWithin) {
                    var selectWithin = lgQuery_1.LG(this.s.selectWithin);
                    this.items = selectWithin.find(this.s.selector).get();
                }
                else {
                    this.items = this.el.querySelectorAll(this.s.selector);
                }
            }
            else {
                this.items = this.el.children;
            }
            return lg_utils_1.default.getDynamicOptions(this.items, this.s.extraProps, this.s.getCaptionFromTitleOrAlt);
        }
        else {
            return this.s.dynamicEl || [];
        }
    };
    /**
     * Build Gallery
     * @param {Number} index  - index of the slide
     * @param {String} transform - Css transform value when zoomFromImage is enabled
     */
    LightGallery.prototype.openGallery = function (index, transform) {
        var _this = this;
        // prevent accidental double execution
        if (this.lgOpened)
            return;
        this.lgOpened = true;
        var backdrop = lgQuery_1.LG("#" + this.getById('lg-backdrop'));
        var container = lgQuery_1.LG("#" + this.getById('lg-container'));
        this.outer.removeClass('lg-hide-items');
        if (!this.s.zoomFromImage || !transform) {
            this.outer.addClass(this.s.startClass);
        }
        else if (this.s.zoomFromImage && transform) {
            this.outer.addClass('lg-zoom-from-image');
        }
        backdrop.css('transition-duration', this.s.backdropDuration + 'ms');
        var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, index);
        this.currentItemsInDom = itemsToBeInsertedToDom;
        var items = '';
        itemsToBeInsertedToDom.forEach(function (item) {
            items = items + ("<div id=\"" + item + "\" class=\"lg-item\"></div>");
        });
        lgQuery_1.LG("#" + this.getById('lg-inner')).append(items);
        if (!this.s.zoomFromImage || !transform) {
            this.getSlideItem(index).removeClass('lg-complete');
        }
        this.LGel.trigger('onBeforeOpen.lg');
        // add class lg-current to remove initial transition
        this.getSlideItem(index).addClass('lg-current');
        this.lGalleryOn = false;
        setTimeout(function () {
            // Store the current scroll top value to scroll back after closing the gallery..
            _this.prevScrollTop = lgQuery_1.LG(window).scrollTop();
            _this.index = index;
            // Need to check both zoomFromImage and transform values as we need to set set the
            // default opening animation if user missed to add the lg-size attribute
            if (_this.s.zoomFromImage && transform) {
                _this.getSlideItem(index)
                    .addClass('start-end-progress')
                    .css('transform', transform)
                    .css('transition-duration', _this.s.startAnimationDuration + 'ms');
                setTimeout(function () {
                    _this.getSlideItem(index).css('transform', 'translate3d(0, 0, 0) translate3d(0, 0, 0)');
                }, 100);
            }
            container.addClass('lg-show');
            setTimeout(function () {
                backdrop.addClass('in');
                container.addClass('lg-show-in');
            }, 10);
            // lg-visible class resets gallery opacity to 1
            if (!_this.s.zoomFromImage || !transform) {
                setTimeout(function () {
                    _this.outer.addClass('lg-visible');
                }, _this.s.backdropDuration);
            }
            // initiate slide function
            _this.slide(index, false, false, false);
            _this.LGel.trigger('onAfterOpen.lg');
            if (_this.s.keyPress) {
                _this.keyPress();
            }
            setTimeout(function () {
                _this.enableDrag();
                _this.enableSwipe();
            }, 50);
            if (_this.galleryItems.length > 1) {
                _this.arrow();
                if (_this.s.mousewheel) {
                    _this.mousewheel();
                }
            }
        });
        lgQuery_1.LG(document.body).addClass('lg-on');
    };
    // Build Gallery if gallery id exist in the URL
    LightGallery.prototype.buildFromHash = function () {
        var _this = this;
        // if dynamic option is enabled execute immediately
        var _hash = window.location.hash;
        if (_hash.indexOf('lg=' + this.s.galleryId) > 0) {
            // This class is used to remove the initial animation if galleryId present in the URL
            lgQuery_1.LG(document.body).addClass('lg-from-hash');
            var index_2 = this.getIndexFromUrl(_hash);
            var openGalleryAfter = this.buildStructure();
            setTimeout(function () {
                _this.openGallery(index_2);
            }, openGalleryAfter);
            return true;
        }
    };
    LightGallery.prototype.hideBars = function () {
        var _this = this;
        // Hide controllers if mouse doesn't move for some period
        setTimeout(function () {
            _this.outer.removeClass('lg-hide-items');
            if (_this.s.hideBarsDelay > 0) {
                _this.outer.on('mousemove.lg click.lg touchstart.lg', function () {
                    _this.outer.removeClass('lg-hide-items');
                    clearTimeout(_this.hideBarTimeout);
                    // Timeout will be cleared on each slide movement also
                    _this.hideBarTimeout = setTimeout(function () {
                        _this.outer.addClass('lg-hide-items');
                    }, _this.s.hideBarsDelay);
                });
                _this.outer.trigger('mousemove.lg');
            }
        }, this.s.showBarsAfter);
    };
    // Find css3 support
    LightGallery.prototype.doCss = function () {
        var supported = false;
        var transition = [
            'transition',
            'MozTransition',
            'WebkitTransition',
            'OTransition',
            'msTransition',
            'KhtmlTransition',
        ];
        var root = document.documentElement;
        for (var i = 0; i < transition.length; i++) {
            if (transition[i] in root.style) {
                supported = true;
                break;
            }
        }
        return supported;
    };
    /**
     *  @desc Create image counter
     *  Ex: 1/10
     */
    LightGallery.prototype.counter = function () {
        if (this.s.counter) {
            var counterHtml = "<div class=\"lg-counter\" role=\"status\" aria-live=\"polite\">\n                <span id=\"" + this.getById('lg-counter-current') + "\" class=\"lg-counter-current\">" + (this.index + 1) + " </span> / \n                <span id=\"" + this.getById('lg-counter-all') + "\" class=\"lg-counter-all\">" + this.galleryItems.length + " </span></div>";
            this.outer.find(this.s.appendCounterTo).append(counterHtml);
        }
    };
    /**
     *  @desc add sub-html into the slide
     *  @param {Number} index - index of the slide
     */
    LightGallery.prototype.addHtml = function (index) {
        var subHtml;
        var subHtmlUrl;
        if (this.galleryItems[index].subHtmlUrl) {
            subHtmlUrl = this.galleryItems[index].subHtmlUrl;
        }
        else {
            subHtml = this.galleryItems[index].subHtml;
        }
        if (!subHtmlUrl) {
            if (subHtml) {
                // get first letter of subhtml
                // if first letter starts with . or # get the html form the jQuery object
                var fL = subHtml.substring(0, 1);
                if (fL === '.' || fL === '#') {
                    if (this.s.subHtmlSelectorRelative && !this.s.dynamic) {
                        subHtml = lgQuery_1.LG(this.items)
                            .eq(index)
                            .find(subHtml)
                            .first()
                            .html();
                    }
                    else {
                        subHtml = lgQuery_1.LG(subHtml).first().html();
                    }
                }
            }
            else {
                subHtml = '';
            }
        }
        if (this.s.appendSubHtmlTo === '.lg-sub-html') {
            if (subHtmlUrl) {
                this.outer.find('.lg-sub-html').load(subHtmlUrl);
            }
            else {
                this.outer.find('.lg-sub-html').html(subHtml);
            }
        }
        else {
            var currentSlide = lgQuery_1.LG(this.getSlideItemId(index));
            if (subHtmlUrl) {
                currentSlide.load(subHtmlUrl);
            }
            else {
                currentSlide.append("<div class=\"lg-sub-html\">" + subHtml + "</div>");
            }
        }
        // Add lg-empty-html class if title doesn't exist
        if (typeof subHtml !== 'undefined' && subHtml !== null) {
            if (subHtml === '') {
                this.outer
                    .find(this.s.appendSubHtmlTo)
                    .addClass('lg-empty-html');
            }
            else {
                this.outer
                    .find(this.s.appendSubHtmlTo)
                    .removeClass('lg-empty-html');
            }
        }
        this.LGel.trigger('onAfterAppendSubHtml.lg', { index: index });
    };
    /**
     *  @desc Preload slides
     *  @param {Number} index - index of the slide
     * @todo preload not working for the first slide, Also, should work for the first and last slide as well
     */
    LightGallery.prototype.preload = function (index) {
        for (var i = 1; i <= this.s.preload; i++) {
            if (i >= this.galleryItems.length - index) {
                break;
            }
            this.loadContent(index + i, false, false);
        }
        for (var j = 1; j <= this.s.preload; j++) {
            if (index - j < 0) {
                break;
            }
            this.loadContent(index - j, false, false);
        }
    };
    LightGallery.prototype.getDummyImgStyles = function (imageSize) {
        imageSize =
            imageSize || lg_utils_1.default.getSize(lgQuery_1.LG(this.items).eq(this.index).get());
        if (!imageSize)
            return '';
        return "width:" + imageSize.width + "px; \n                margin-left: -" + imageSize.width / 2 + "px;\n                margin-top: -" + imageSize.height / 2 + "px; \n                height:" + imageSize.height + "px";
    };
    LightGallery.prototype.setImgMarkup = function (src, $currentSlide, index) {
        // Use the thumbnail as dummy image which will be resized to actual image size and
        // displayed on top of actual image
        var _dummyImgSrc;
        var imgContnet = '';
        var imageSize;
        var $currentItem;
        if (!this.s.dynamic) {
            $currentItem = lgQuery_1.LG(this.items).eq(index);
            imageSize = lg_utils_1.default.getSize($currentItem.get());
        }
        var currentDynamicItem = this.galleryItems[index];
        var alt = currentDynamicItem.alt
            ? 'alt="' + currentDynamicItem.alt + '"'
            : '';
        if (!this.lGalleryOn && this.s.zoomFromImage && imageSize) {
            if (imageSize && $currentItem) {
                if (!this.s.exThumbImage) {
                    _dummyImgSrc = $currentItem.find('img').first().attr('src');
                }
                else {
                    _dummyImgSrc = $currentItem.attr(this.s.exThumbImage);
                }
                var imgStyle = this.getDummyImgStyles(imageSize);
                var dummyImgContent = "<img " + alt + " style=\"" + imgStyle + "\" class=\"lg-dummy-img\" src=\"" + _dummyImgSrc + "\" />";
                $currentSlide.addClass('lg-first-slide');
                imgContnet = dummyImgContent;
            }
        }
        else {
            imgContnet = " <img " + alt + " class=\"lg-object lg-image\" data-index=\"" + index + "\" src=\"" + src + "\" /> ";
        }
        var imgMarkup = "<div class=\"lg-img-wrap\"> " + imgContnet + "</div>";
        $currentSlide.prepend(imgMarkup);
    };
    LightGallery.prototype.onLgObjectLoad = function ($el, index, delay, speed, dummyImageLoaded) {
        var _this = this;
        if (dummyImageLoaded) {
            this.LGel.trigger('onSlideItemLoad.lg', {
                index: index,
                delay: delay || 0,
            });
        }
        $el.find('.lg-object')
            .first()
            .on('load.lg error.lg', function () {
            _this.handleLgObjectLoad($el, index, delay, speed, dummyImageLoaded);
        });
    };
    LightGallery.prototype.handleLgObjectLoad = function ($el, index, delay, speed, dummyImageLoaded) {
        var _this = this;
        setTimeout(function () {
            $el.addClass('lg-complete lg-complete_');
            if (!dummyImageLoaded) {
                _this.LGel.trigger('onSlideItemLoad.lg', {
                    index: index,
                    delay: delay || 0,
                });
            }
        }, speed);
    };
    /**
     * @desc Check the given src is video
     * @param {String} src
     * @return {Object} video type
     * Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
     *
     * @todo - this information can be moved to dynamicEl to avoid frequent calls
     */
    LightGallery.prototype.isVideo = function (src, index) {
        if (!src) {
            if (this.galleryItems[index].video) {
                return {
                    html5: true,
                };
            }
            else {
                console.error('lightGallery :- data-src is not provided on slide item ' +
                    (index + 1) +
                    '. Please make sure the selector property is properly configured. More info - http://sachinchoolur.github.io/lightGallery/demos/html-markup.html');
                return;
            }
        }
        var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i);
        var vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
        var wistia = src.match(/https?:\/\/(.+)?(wistia\.com|wi\.st)\/(medias|embed)\/([0-9a-z\-_]+)(.*)/);
        if (youtube) {
            return {
                youtube: youtube,
            };
        }
        else if (vimeo) {
            return {
                vimeo: vimeo,
            };
        }
        else if (wistia) {
            return {
                wistia: wistia,
            };
        }
    };
    // Add video slideInfo
    LightGallery.prototype.addSlideVideoInfo = function (items) {
        var _this = this;
        items.forEach(function (element, index) {
            element.__slideVideoInfo = _this.isVideo(element.src, index);
        });
    };
    /**
     *  @desc Load slide content into slide.
     *  @param {Number} index - index of the slide.
     *  @param {Boolean} rec - if true call loadcontent() function again.
     *  @param {Boolean} firstSlide - For setting the delay.
     */
    LightGallery.prototype.loadContent = function (index, rec, firstSlide) {
        var _this = this;
        var _$img;
        var _src;
        var _poster;
        var currentDynamicItem = this.galleryItems[index];
        var $currentSlide = lgQuery_1.LG(this.getSlideItemId(index));
        if (currentDynamicItem.poster) {
            _poster = currentDynamicItem.poster;
        }
        var _html5Video = currentDynamicItem.video && JSON.parse(currentDynamicItem.video);
        _src = currentDynamicItem.src;
        if (currentDynamicItem.responsive) {
            var srcDyItms = currentDynamicItem.responsive.split(',');
            _src = lg_utils_1.default.getResponsiveSrc(srcDyItms) || _src;
        }
        var _srcset = currentDynamicItem.srcset;
        var _sizes = currentDynamicItem.sizes;
        var iframe = false;
        if (this.galleryItems[index].iframe) {
            iframe = true;
        }
        var imageSize;
        if (!this.s.dynamic) {
            var $currentItem = this.items[index];
            imageSize = lg_utils_1.default.getSize($currentItem);
        }
        // delay for adding complete class. it is 0 except first time.
        var delay = 0;
        if (firstSlide) {
            if (this.s.zoomFromImage && imageSize) {
                delay = this.s.startAnimationDuration + 10;
            }
            else {
                delay = this.s.backdropDuration + 10;
            }
        }
        var videoInfo = currentDynamicItem.__slideVideoInfo;
        if (!$currentSlide.hasClass('lg-loaded')) {
            if (iframe) {
                var markup = lg_utils_1.default.getIframeMarkup(_src, this.s.iframeMaxWidth);
                $currentSlide.prepend(markup);
            }
            else if (_poster) {
                var markup = lg_utils_1.default.getVideoPosterMarkup(_poster, videoInfo);
                $currentSlide.prepend(markup);
                this.LGel.trigger('hasVideo.lg', {
                    index: index,
                    src: _src,
                    html5Video: _html5Video,
                    hasPoster: true,
                });
            }
            else if (videoInfo) {
                var markup = '<div class="lg-video-cont "><div class="lg-video"></div></div>';
                $currentSlide.prepend(markup);
                this.LGel.trigger('hasVideo.lg', {
                    index: index,
                    src: _src,
                    html5Video: _html5Video,
                    hasPoster: false,
                });
            }
            else {
                this.setImgMarkup(_src, $currentSlide, index);
            }
            this.LGel.trigger('onAferAppendSlide.lg', { index: index });
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
                }
                catch (e) {
                    console.warn('lightGallery :- If you want srcset to be supported for older browser please include picturefil version 2 javascript library in your document.');
                }
            }
            if (this.s.appendSubHtmlTo !== '.lg-sub-html') {
                this.addHtml(index);
            }
        }
        // For first time add some delay for displaying the start animation.
        var _speed = 0;
        // Do not change the delay value because it is required for zoom plugin.
        // If gallery opened from direct url (hash) speed value should be 0
        if (delay && !lgQuery_1.LG(document.body).hasClass('lg-from-hash')) {
            _speed = delay;
        }
        // Only for first slide
        if (!this.lGalleryOn && this.s.zoomFromImage && imageSize) {
            setTimeout(function () {
                $currentSlide
                    .removeClass('start-end-progress')
                    .removeAttr('style');
            }, this.s.startAnimationDuration + 100);
            if (!$currentSlide.hasClass('lg-loaded')) {
                setTimeout(function () {
                    $currentSlide
                        .find('.lg-img-wrap')
                        .append("<img class=\"lg-object lg-image\" data-index=\"" + index + "\" src=\"" + _src + "\" />");
                    _this.onLgObjectLoad($currentSlide, index, delay, _speed, true);
                    $currentSlide
                        .find('.lg-object')
                        .first()
                        .on('load.lg error.lg', function () {
                        _this.loadContentOnLoad(index, $currentSlide, _speed);
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
        if ((!this.s.zoomFromImage || !imageSize) &&
            $currentSlide.hasClass('lg-complete_') &&
            firstSlide) {
            setTimeout(function () {
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
                    .on('load.lg error.lg', function () {
                    _this.preload(index);
                });
            }
            else {
                this.preload(index);
            }
        }
    };
    LightGallery.prototype.loadContentOnLoad = function (index, $currentSlide, speed) {
        var _this = this;
        setTimeout(function () {
            $currentSlide.find('.lg-dummy-img').remove();
            $currentSlide.removeClass('lg-first-slide');
            _this.preload(index);
        }, speed + 300);
    };
    LightGallery.prototype.getItemsToBeInsertedToDom = function (index, prevIndex, numberOfItems) {
        var _this = this;
        if (numberOfItems === void 0) { numberOfItems = 0; }
        var itemsToBeInsertedToDom = [];
        // Minimum 2 items should be there
        var possibleNumberOfItems = Math.max(numberOfItems, 3);
        possibleNumberOfItems = Math.min(possibleNumberOfItems, this.galleryItems.length);
        var prevIndexItem = "lg-item-" + this.lgId + "-" + prevIndex;
        if (this.galleryItems.length <= 3) {
            this.galleryItems.forEach(function (element, index) {
                itemsToBeInsertedToDom.push("lg-item-" + _this.lgId + "-" + index);
            });
            return itemsToBeInsertedToDom;
        }
        if (index < (this.galleryItems.length - 1) / 2) {
            for (var idx = index; idx > index - possibleNumberOfItems / 2 && idx >= 0; idx--) {
                itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
            }
            var numberOfExistingItems = itemsToBeInsertedToDom.length;
            for (var idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) {
                itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index + idx + 1));
            }
        }
        else {
            for (var idx = index; idx <= this.galleryItems.length - 1 &&
                idx < index + possibleNumberOfItems / 2; idx++) {
                itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
            }
            var numberOfExistingItems = itemsToBeInsertedToDom.length;
            for (var idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) {
                itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index - idx - 1));
            }
        }
        if (this.s.loop) {
            if (index === this.galleryItems.length - 1) {
                itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + 0);
            }
            else if (index === 0) {
                itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (this.galleryItems.length - 1));
            }
        }
        if (itemsToBeInsertedToDom.indexOf(prevIndexItem) === -1) {
            itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + prevIndex);
        }
        return itemsToBeInsertedToDom;
    };
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
    LightGallery.prototype.slide = function (index, fromTouch, fromThumb, direction) {
        var _this = this;
        var _prevIndex = 0;
        try {
            var currentItemId = this.outer
                .find('.lg-current')
                .first()
                .attr('id');
            _prevIndex = parseInt(currentItemId.split('-')[3]) || 0;
        }
        catch (error) {
            _prevIndex = 0;
        }
        var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, _prevIndex, this.s.numberOfSlideItemsInDom);
        itemsToBeInsertedToDom.forEach(function (item) {
            if (_this.currentItemsInDom.indexOf(item) === -1) {
                lgQuery_1.LG("#" + _this.getById('lg-inner')).append("<div id=\"" + item + "\" class=\"lg-item\"></div>");
            }
        });
        this.currentItemsInDom.forEach(function (item) {
            if (itemsToBeInsertedToDom.indexOf(item) === -1) {
                lgQuery_1.LG("#" + item).remove();
            }
        });
        this.currentItemsInDom = itemsToBeInsertedToDom;
        // Prevent if multiple call
        // Required for hsh plugin
        if (this.lGalleryOn && _prevIndex === index) {
            return;
        }
        var _length = this.galleryItems.length;
        var _time = this.lGalleryOn ? this.s.speed : 0;
        if (!this.lgBusy) {
            if (this.s.download) {
                var _src = this.galleryItems[index].downloadUrl !== false &&
                    (this.galleryItems[index].downloadUrl ||
                        this.galleryItems[index].src);
                if (_src) {
                    lgQuery_1.LG("#" + this.getById('lg-download')).attr('href', _src);
                    this.outer.removeClass('lg-hide-download');
                }
                else {
                    this.outer.addClass('lg-hide-download');
                }
            }
            lgQuery_1.LG(this.el).trigger('onBeforeSlide.lg', {
                prevIndex: _prevIndex,
                index: index,
                fromTouch: fromTouch,
                fromThumb: fromThumb,
            });
            this.lgBusy = true;
            clearTimeout(this.hideBarTimeout);
            // Add title if this.s.appendSubHtmlTo === lg-sub-html
            if (this.s.appendSubHtmlTo === '.lg-sub-html') {
                // wait for slide animation to complete
                setTimeout(function () {
                    _this.addHtml(index);
                }, _time);
            }
            this.arrowDisable(index);
            if (!direction) {
                if (index < _prevIndex) {
                    direction = 'prev';
                }
                else if (index > _prevIndex) {
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
                }
                else {
                    // next slide
                    this.getSlideItem(index).addClass('lg-next-slide');
                    this.getSlideItem(_prevIndex).addClass('lg-prev-slide');
                }
                // give 50 ms for browser to add/remove class
                setTimeout(function () {
                    _this.outer.find('.lg-item').removeClass('lg-current');
                    //this.getSlideItem(_prevIndex).removeClass('lg-current');
                    _this.getSlideItem(index).addClass('lg-current');
                    // reset all transitions
                    _this.outer.removeClass('lg-no-trans');
                }, 50);
            }
            else {
                this.outer
                    .find('.lg-item')
                    .removeClass('lg-prev-slide lg-current lg-next-slide');
                var touchPrev = void 0;
                var touchNext = void 0;
                if (_length > 2) {
                    touchPrev = index - 1;
                    touchNext = index + 1;
                    if (index === 0 && _prevIndex === _length - 1) {
                        // next slide
                        touchNext = 0;
                        touchPrev = _length - 1;
                    }
                    else if (index === _length - 1 && _prevIndex === 0) {
                        // prev slide
                        touchNext = 0;
                        touchPrev = _length - 1;
                    }
                }
                else {
                    touchPrev = 0;
                    touchNext = 1;
                }
                if (direction === 'prev') {
                    this.getSlideItem(touchNext).addClass('lg-next-slide');
                }
                else {
                    this.getSlideItem(touchPrev).addClass('lg-prev-slide');
                }
                this.getSlideItem(index).addClass('lg-current');
            }
            if (this.lGalleryOn) {
                setTimeout(function () {
                    _this.loadContent(index, true, false);
                }, this.s.speed + 50);
                setTimeout(function () {
                    _this.lgBusy = false;
                    _this.LGel.trigger('onAfterSlide.lg', {
                        prevIndex: _prevIndex,
                        index: index,
                        fromTouch: fromTouch,
                        fromThumb: fromThumb,
                    });
                }, this.s.speed);
            }
            else {
                this.loadContent(index, true, true);
                this.lgBusy = false;
                this.LGel.trigger('onAfterSlide.lg', {
                    prevIndex: _prevIndex,
                    index: index,
                    fromTouch: fromTouch,
                    fromThumb: fromThumb,
                });
            }
            if (this.s.counter) {
                lgQuery_1.LG("#" + this.getById('lg-counter-current')).html(index + 1 + '');
            }
        }
        this.index = index;
    };
    LightGallery.prototype.touchMove = function (startCoords, endCoords) {
        var distanceX = endCoords.pageX - startCoords.pageX;
        var distanceY = endCoords.pageY - startCoords.pageY;
        var allowSwipe = false;
        if (this.swipeDirection) {
            allowSwipe = true;
        }
        else {
            if (Math.abs(distanceX) > 15) {
                this.swipeDirection = 'horizontal';
                allowSwipe = true;
            }
            else if (Math.abs(distanceY) > 15) {
                this.swipeDirection = 'vertical';
                allowSwipe = true;
            }
        }
        if (!allowSwipe) {
            return;
        }
        var $currentSlide = this.getSlideItem(this.index);
        if (this.swipeDirection === 'horizontal') {
            // reset opacity and transition duration
            this.outer.addClass('lg-dragging');
            // move current slide
            this.setTranslate($currentSlide, distanceX, 0);
            // move next and prev slide with current slide
            var width = $currentSlide.get().offsetWidth;
            this.setTranslate(this.outer.find('.lg-prev-slide').first(), -width + distanceX, 0);
            this.setTranslate(this.outer.find('.lg-next-slide').first(), width + distanceX, 0);
        }
        else if (this.swipeDirection === 'vertical') {
            var container = lgQuery_1.LG("#" + this.getById('lg-container'));
            container.addClass('lg-dragging-vertical');
            var opacity = 1 - Math.abs(distanceY) / window.innerHeight;
            var backdrop = lgQuery_1.LG("#" + this.getById('lg-backdrop'));
            backdrop.css('opacity', opacity);
            var scale = 1 - Math.abs(distanceY) / (window.innerWidth * 2);
            this.setTranslate($currentSlide, 0, distanceY, scale, scale);
        }
    };
    LightGallery.prototype.touchEnd = function (endCoords, startCoords) {
        var _this = this;
        var distance;
        // keep slide animation for any mode while dragg/swipe
        if (this.s.mode !== 'lg-slide') {
            this.outer.addClass('lg-slide');
        }
        // set transition duration
        setTimeout(function () {
            var container = lgQuery_1.LG("#" + _this.getById('lg-container'));
            var backdrop = lgQuery_1.LG("#" + _this.getById('lg-backdrop'));
            container.removeClass('lg-dragging-vertical');
            _this.outer.removeClass('lg-dragging');
            var triggerClick = true;
            if (_this.swipeDirection === 'horizontal') {
                distance = endCoords.pageX - startCoords.pageX;
                var distanceAbs = Math.abs(endCoords.pageX - startCoords.pageX);
                if (distance < 0 && distanceAbs > _this.s.swipeThreshold) {
                    _this.goToNextSlide(true);
                    triggerClick = false;
                }
                else if (distance > 0 &&
                    distanceAbs > _this.s.swipeThreshold) {
                    _this.goToPrevSlide(true);
                    triggerClick = false;
                }
            }
            else if (_this.swipeDirection === 'vertical') {
                distance = Math.abs(endCoords.pageY - startCoords.pageY);
                if (distance > 100) {
                    _this.destroy();
                    return;
                }
                else {
                    backdrop.css('opacity', 1);
                }
            }
            _this.outer.find('.lg-item').removeAttr('style');
            if (triggerClick &&
                Math.abs(endCoords.pageX - startCoords.pageX) < 5) {
                // Trigger click if distance is less than 5 pix
                _this.LGel.trigger('onSlideClick.lg');
            }
            _this.swipeDirection = undefined;
        });
        // remove slide class once drag/swipe is completed if mode is not slide
        setTimeout(function () {
            if (!_this.outer.hasClass('lg-dragging') &&
                _this.s.mode !== 'lg-slide') {
                _this.outer.removeClass('lg-slide');
            }
        }, this.s.speed + 100);
    };
    LightGallery.prototype.enableSwipe = function () {
        var _this = this;
        var startCoords = {};
        var endCoords = {};
        var isMoved = false;
        var isSwiping = false;
        var inner = lgQuery_1.LG("#" + this.getById('lg-inner'));
        if (this.s.enableSwipe && this.doCss()) {
            inner.on('touchstart.lg', function (e) {
                var $item = _this.getSlideItem(_this.index);
                if ((lgQuery_1.LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target)) &&
                    !_this.outer.hasClass('lg-zoomed') &&
                    !_this.lgBusy &&
                    e.targetTouches.length === 1) {
                    isSwiping = true;
                    _this.touchAction = 'swipe';
                    e.preventDefault();
                    _this.manageSwipeClass();
                    startCoords = {
                        pageX: e.targetTouches[0].pageX,
                        pageY: e.targetTouches[0].pageY,
                    };
                }
            });
            inner.on('touchmove.lg', function (e) {
                if (isSwiping &&
                    _this.touchAction === 'swipe' &&
                    e.targetTouches.length === 1) {
                    e.preventDefault();
                    endCoords = {
                        pageX: e.targetTouches[0].pageX,
                        pageY: e.targetTouches[0].pageY,
                    };
                    _this.touchMove(startCoords, endCoords);
                    isMoved = true;
                }
            });
            inner.on('touchend.lg', function () {
                if (_this.touchAction === 'swipe') {
                    if (isMoved) {
                        isMoved = false;
                        _this.touchEnd(endCoords, startCoords);
                    }
                    else if (isSwiping) {
                        _this.LGel.trigger('onSlideClick.lg');
                    }
                    _this.touchAction = undefined;
                    isSwiping = false;
                }
            });
        }
    };
    LightGallery.prototype.enableDrag = function () {
        var _this = this;
        var startCoords = {};
        var endCoords = {};
        var isDraging = false;
        var isMoved = false;
        if (this.s.enableDrag && this.doCss()) {
            this.outer.on('mousedown.lg', function (e) {
                var $item = _this.getSlideItem(_this.index);
                if (lgQuery_1.LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target)) {
                    if (!_this.outer.hasClass('lg-zoomed') && !_this.lgBusy) {
                        e.preventDefault();
                        if (!_this.lgBusy) {
                            _this.manageSwipeClass();
                            startCoords = {
                                pageX: e.pageX,
                                pageY: e.pageY,
                            };
                            isDraging = true;
                            // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                            _this.outer.get().scrollLeft += 1;
                            _this.outer.get().scrollLeft -= 1;
                            // *
                            _this.outer
                                .removeClass('lg-grab')
                                .addClass('lg-grabbing');
                            _this.LGel.trigger('onDragstart.lg');
                        }
                    }
                }
            });
            lgQuery_1.LG(window).on('mousemove.lg', function (e) {
                if (isDraging) {
                    isMoved = true;
                    endCoords = {
                        pageX: e.pageX,
                        pageY: e.pageY,
                    };
                    _this.touchMove(startCoords, endCoords);
                    _this.LGel.trigger('onDragmove.lg');
                }
            });
            lgQuery_1.LG(window).on('mouseup.lg', function (e) {
                var target = lgQuery_1.LG(e.target);
                if (isMoved) {
                    isMoved = false;
                    _this.touchEnd(endCoords, startCoords);
                    _this.LGel.trigger('onDragend.lg');
                }
                else if (target.hasClass('lg-object') ||
                    target.hasClass('lg-video-play')) {
                    _this.LGel.trigger('onSlideClick.lg');
                }
                // Prevent execution on click
                if (isDraging) {
                    isDraging = false;
                    _this.outer.removeClass('lg-grabbing').addClass('lg-grab');
                }
            });
        }
    };
    LightGallery.prototype.manageSwipeClass = function () {
        var _touchNext = this.index + 1;
        var _touchPrev = this.index - 1;
        if (this.s.loop && this.galleryItems.length > 2) {
            if (this.index === 0) {
                _touchPrev = this.galleryItems.length - 1;
            }
            else if (this.index === this.galleryItems.length - 1) {
                _touchNext = 0;
            }
        }
        this.outer.find('.lg-item').removeClass('lg-next-slide lg-prev-slide');
        if (_touchPrev > -1) {
            this.getSlideItem(_touchPrev).addClass('lg-prev-slide');
        }
        this.getSlideItem(_touchNext).addClass('lg-next-slide');
    };
    /**
     *  @desc Go to next slide
     *  @param {Boolean} fromTouch - true if slide function called via touch event
     */
    LightGallery.prototype.goToNextSlide = function (fromTouch) {
        var _this = this;
        var _loop = this.s.loop;
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
            }
            else {
                if (_loop) {
                    this.index = 0;
                    this.LGel.trigger('onBeforeNextSlide.lg', {
                        index: this.index,
                    });
                    this.slide(this.index, !!fromTouch, false, 'next');
                }
                else if (this.s.slideEndAnimatoin && !fromTouch) {
                    this.outer.addClass('lg-right-end');
                    setTimeout(function () {
                        _this.outer.removeClass('lg-right-end');
                    }, 400);
                }
            }
        }
    };
    /**
     *  @desc Go to previous slide
     *  @param {Boolean} fromTouch - true if slide function called via touch event
     */
    LightGallery.prototype.goToPrevSlide = function (fromTouch) {
        var _this = this;
        var _loop = this.s.loop;
        if (fromTouch && this.galleryItems.length < 3) {
            _loop = false;
        }
        if (!this.lgBusy) {
            if (this.index > 0) {
                this.index--;
                this.LGel.trigger('onBeforePrevSlide.lg', {
                    index: this.index,
                    fromTouch: fromTouch,
                });
                this.slide(this.index, !!fromTouch, false, 'prev');
            }
            else {
                if (_loop) {
                    this.index = this.galleryItems.length - 1;
                    this.LGel.trigger('onBeforePrevSlide.lg', {
                        index: this.index,
                        fromTouch: fromTouch,
                    });
                    this.slide(this.index, !!fromTouch, false, 'prev');
                }
                else if (this.s.slideEndAnimatoin && !fromTouch) {
                    this.outer.addClass('lg-left-end');
                    setTimeout(function () {
                        _this.outer.removeClass('lg-left-end');
                    }, 400);
                }
            }
        }
    };
    LightGallery.prototype.keyPress = function () {
        var _this = this;
        if (this.galleryItems.length > 1) {
            lgQuery_1.LG(window).on('keyup.lg.window', function (e) {
                if (_this.galleryItems.length > 1) {
                    if (e.keyCode === 37) {
                        e.preventDefault();
                        _this.goToPrevSlide();
                    }
                    if (e.keyCode === 39) {
                        e.preventDefault();
                        _this.goToNextSlide();
                    }
                }
            });
        }
        lgQuery_1.LG(window).on('keydown.lg', function (e) {
            if (_this.s.escKey === true && e.keyCode === 27) {
                e.preventDefault();
                if (!_this.outer.hasClass('lg-thumb-open')) {
                    _this.destroy();
                }
                else {
                    _this.outer.removeClass('lg-thumb-open');
                }
            }
        });
    };
    LightGallery.prototype.arrow = function () {
        var _this = this;
        lgQuery_1.LG("#" + this.getById('lg-prev')).on('click.lg', function () {
            _this.goToPrevSlide();
        });
        console.log(lgQuery_1.LG("#" + this.getById('lg-next')));
        lgQuery_1.LG("#" + this.getById('lg-next')).on('click.lg', function () {
            console.log('calling');
            _this.goToNextSlide();
        });
    };
    LightGallery.prototype.arrowDisable = function (index) {
        // Disable arrows if s.hideControlOnEnd is true
        if (!this.s.loop && this.s.hideControlOnEnd) {
            var $prev = lgQuery_1.LG("#" + this.getById('lg-prev'));
            var $next = lgQuery_1.LG("#" + this.getById('lg-next'));
            if (index + 1 < this.galleryItems.length) {
                $prev.removeAttr('disabled').removeClass('disabled');
            }
            else {
                $prev.attr('disabled', 'disabled').addClass('disabled');
            }
            if (index > 0) {
                $next.removeAttr('disabled').removeClass('disabled');
            }
            else {
                $next.attr('disabled', 'disabled').addClass('disabled');
            }
        }
    };
    /**
     * Get index of the slide from custom slideName. Has to be a public method. Used in hash plugin
     * @param {String} hash
     * @returns {Number} Index of the slide.
     */
    LightGallery.prototype.getIndexFromUrl = function (hash) {
        if (hash === void 0) { hash = window.location.hash; }
        var slideName = hash.split('&slide=')[1];
        var _idx = 0;
        if (this.s.customSlideName) {
            for (var index = 0; index < this.galleryItems.length; index++) {
                var dynamicEl = this.galleryItems[index];
                if (dynamicEl.slideName === slideName) {
                    _idx = index;
                    break;
                }
            }
        }
        else {
            _idx = parseInt(slideName, 10);
        }
        return isNaN(_idx) ? 0 : _idx;
    };
    LightGallery.prototype.setTranslate = function ($el, xValue, yValue, scaleX, scaleY) {
        if (scaleX === void 0) { scaleX = 1; }
        if (scaleY === void 0) { scaleY = 1; }
        // jQuery supports Automatic CSS prefixing since version 1.8.0
        if (this.s.useLeft) {
            $el.css('left', xValue + '');
        }
        else {
            $el.css('transform', 'translate3d(' +
                xValue +
                'px, ' +
                yValue +
                'px, 0px) scale3d(' +
                scaleX +
                ', ' +
                scaleY +
                ', 1)');
        }
    };
    LightGallery.prototype.mousewheel = function () {
        var _this = this;
        this.outer.on('mousewheel.lg', function (e) {
            if (!e.deltaY) {
                return;
            }
            if (e.deltaY > 0) {
                _this.goToPrevSlide();
            }
            else {
                _this.goToNextSlide();
            }
            e.preventDefault();
        });
    };
    LightGallery.prototype.closeGallery = function () {
        var _this = this;
        var mousedown = false;
        lgQuery_1.LG("#" + this.getById('lg-close')).on('click.lg', function () {
            _this.destroy();
        });
        if (this.s.closable) {
            // If you drag the slide and release outside gallery gets close on chrome
            // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
            this.outer.on('mousedown.lg', function (e) {
                var target = lgQuery_1.LG(e.target);
                if (target.hasClass('lg-outer') ||
                    target.hasClass('lg-item') ||
                    target.hasClass('lg-img-wrap')) {
                    mousedown = true;
                }
                else {
                    mousedown = false;
                }
            });
            this.outer.on('mousemove.lg', function () {
                mousedown = false;
            });
            this.outer.on('mouseup.lg', function (e) {
                var target = lgQuery_1.LG(e.target);
                if (target.hasClass('lg-outer') ||
                    target.hasClass('lg-item') ||
                    (target.hasClass('lg-img-wrap') && mousedown)) {
                    if (!_this.outer.hasClass('lg-dragging')) {
                        _this.destroy();
                    }
                }
            });
        }
    };
    LightGallery.prototype.destroy = function (d) {
        var _this = this;
        if (!d) {
            this.LGel.trigger('onBeforeClose.lg');
            lgQuery_1.LG(window).scrollTop(this.prevScrollTop);
        }
        var $backdrop = lgQuery_1.LG("#" + this.getById('lg-backdrop'));
        var transform;
        if (!this.s.dynamic) {
            var imageSize = lg_utils_1.default.getSize(this.items[this.index]);
            transform = lg_utils_1.default.getTransform(this.items[this.index], imageSize);
        }
        if (this.s.zoomFromImage && transform) {
            this.outer.addClass('lg-closing lg-zoom-from-image');
            this.getSlideItem(this.index)
                .addClass('start-end-progress')
                .css('transition-duration', this.s.startAnimationDuration + 'ms')
                .css('transform', transform);
        }
        else {
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
                for (var index = 0; index < this.items.length; index++) {
                    var element = this.items[index];
                    // Using different namespace for click because click event should not unbind if selector is same object('this')
                    lgQuery_1.LG(element).off("click.lg-item-" + index + " click.lgcustom-item-" + index);
                }
            }
            // Unbind all events added by lightGallery
            // @todo
            //this.$el.off('.lg.tm');
            for (var key in this.modules) {
                if (this.modules[key]) {
                    try {
                        this.modules[key].destroy();
                    }
                    catch (err) {
                        console.warn("lightGallery:- make sure lightGallery " + key + " module is properly destroyed");
                    }
                }
            }
            lgQuery_1.LG(window).off('lg');
        }
        this.lGalleryOn = false;
        clearTimeout(this.hideBarTimeout);
        this.hideBarTimeout = false;
        lgQuery_1.LG(document.body).removeClass('lg-on lg-from-hash');
        this.outer.removeClass('lg-visible');
        // Resetting opacity to 0 isd required as  vertical swipe to close function adds inline opacity.
        $backdrop.removeClass('in').css('opacity', 0);
        var removeTimeout = this.s.zoomFromImage && transform
            ? this.s.startAnimationDuration
            : this.s.backdropDuration;
        lgQuery_1.LG("#" + this.getById('lg-container')).removeClass('lg-show-in');
        lgQuery_1.LG(window).off('keyup.lg.window');
        lgQuery_1.LG(window).off('keydown.lg');
        // Once the closign animation is completed and gallery is invisible
        setTimeout(function () {
            if (_this.s.zoomFromImage && transform) {
                _this.outer.removeClass('lg-zoom-from-image');
            }
            lgQuery_1.LG("#" + _this.getById('lg-container')).removeClass('lg-show');
            $backdrop.removeAttr('style');
            _this.outer.removeClass("lg-closing " + _this.s.startClass);
            _this.getSlideItem(_this.index).removeClass('start-end-progress');
            lgQuery_1.LG("#" + _this.getById('lg-inner')).empty();
            if (d) {
                if (_this.outer) {
                    _this.outer.remove();
                }
                $backdrop.remove();
            }
            if (!d) {
                _this.LGel.trigger('onCloseAfter.lg');
            }
            _this.LGel.get().focus();
            _this.lgOpened = false;
        }, removeTimeout + 100);
    };
    return LightGallery;
}());
exports.LightGallery = LightGallery;
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
    }
    catch (err) {
        console.error('lightGallery has not initiated properly', err);
    }
};
//# sourceMappingURL=lightgallery.js.map