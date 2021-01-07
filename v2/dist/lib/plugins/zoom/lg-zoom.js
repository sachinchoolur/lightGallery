"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zoom = void 0;
var lg_zoom_settings_1 = require("./lg-zoom-settings");
var LG = window.LG;
var Zoom = /** @class */ (function () {
    function Zoom(instance) {
        this.core = instance;
        this.s = Object.assign({}, lg_zoom_settings_1.zoomDefaults);
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
    Zoom.prototype.buildTemplates = function () {
        var zoomIcons = '<span class="lg-zoom-in lg-icon"></span><span class="lg-zoom-out lg-icon"></span>';
        if (this.s.actualSize) {
            zoomIcons += '<span class="lg-actual-size lg-icon"></span>';
        }
        // CSS transition performace is poor in Chrome version < 54
        // So use CSS left property for zoom transition.
        if (this.s.useLeftForZoom) {
            this.core.outer.addClass('lg-use-left-for-zoom');
        }
        else {
            this.core.outer.addClass('lg-use-transition-for-zoom');
        }
        this.core.outer.find('.lg-toolbar').first().append(zoomIcons);
    };
    /**
     * @desc Enable zoom option only once the image is completely loaded
     * If zoomFromImage is true, Zoom is enabled once the dummy image has been inserted
     *
     * Zoom styles are defined under lg-zoomable CSS class.
     */
    Zoom.prototype.enableZoom = function (event) {
        var _this = this;
        // delay will be 0 except first time
        var _speed = this.s.enableZoomAfter + event.detail.delay;
        // set _speed value 0 if gallery opened from direct url and if it is first slide
        if (LG('body').first().hasClass('lg-from-hash') && event.detail.delay) {
            // will execute only once
            _speed = 0;
        }
        else {
            // Remove lg-from-hash to enable starting animation.
            LG('body').first().removeClass('lg-from-hash');
        }
        this.zoomableTimeout = setTimeout(function () {
            _this.core.getSlideItem(event.detail.index).addClass('lg-zoomable');
        }, _speed + 30);
    };
    Zoom.prototype.enableZoomOnSlideItemLoad = function () {
        // Add zoomable class
        this.core.LGel.on('onSlideItemLoad.lg.tm.zoom', this.enableZoom.bind(this));
    };
    /**
     * @desc Image zoom
     * Translate the wrap and scale the image to get better user experience
     *
     * @param {String} scale - Zoom decrement/increment value
     */
    Zoom.prototype.zoomImage = function (scale) {
        var $image = this.core.outer.find('.lg-current .lg-image').first();
        var imageNode = $image.get();
        if (!imageNode)
            return;
        // Find offset manually to avoid issue after zoom
        var offsetX = (this.core.outer.width() - imageNode.offsetWidth) / 2;
        var offsetY = (this.core.outer.height() - imageNode.offsetHeight) / 2 +
            LG(window).scrollTop();
        var originalX;
        var originalY;
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
        var _x = this.pageX - offsetX;
        var _y = this.pageY - offsetY;
        var x = (scale - 1) * _x;
        var y = (scale - 1) * _y;
        this.setZoomStyles({
            x: x,
            y: y,
            scale: scale,
        });
    };
    /**
     * @desc apply scale3d to image and translate to image wrap
     * @param {style} X,Y and scale
     */
    Zoom.prototype.setZoomStyles = function (style) {
        var $image = this.core.outer.find('.lg-current .lg-image').first();
        var $dummyImage = this.core.outer
            .find('.lg-current .lg-dummy-img')
            .first();
        var $imageWrap = $image.parent();
        $image
            .attr('data-scale', style.scale + '')
            .css('transform', 'scale3d(' + style.scale + ', ' + style.scale + ', 1)');
        $dummyImage.css('transform', 'scale3d(' + style.scale + ', ' + style.scale + ', 1)');
        if (this.s.useLeftForZoom) {
            $imageWrap.css('left', -style.x + 'px');
            $imageWrap.css('top', -style.y + 'px');
        }
        else {
            var transform = 'translate3d(-' + style.x + 'px, -' + style.y + 'px, 0)';
            $imageWrap.css('transform', transform);
        }
        $imageWrap.attr('data-x', style.x).attr('data-y', style.y);
    };
    /**
     * @param index - Index of the current slide
     * @param event - event will be available only if the function is called on clicking/taping the imags
     */
    Zoom.prototype.setActualSize = function (index, event) {
        var _this = this;
        var $image = this.core.getSlideItem(index).find('.lg-image').first();
        var width = $image.get().offsetWidth;
        var naturalWidth = this.getNaturalWidth(index) || width;
        var scale = this.getActualSizeScale(naturalWidth, width);
        if (this.core.outer.hasClass('lg-zoomed')) {
            this.scale = 1;
        }
        else {
            this.scale = this.getScale(scale);
        }
        this.setPageCords(event);
        this.beginZoom(this.scale);
        this.zoomImage(this.scale);
        setTimeout(function () {
            _this.core.outer.removeClass('lg-grabbing').addClass('lg-grab');
        }, 10);
    };
    Zoom.prototype.getNaturalWidth = function (index) {
        var $image = this.core.getSlideItem(index).find('.lg-image').first();
        var naturalWidth;
        // @todo if possible remove dynamic check
        if (this.core.s.dynamic) {
            naturalWidth = this.core.s.dynamicEl[index].width;
        }
        else {
            naturalWidth = LG(this.core.items).eq(index).attr('data-width');
        }
        return naturalWidth || $image.get().naturalWidth;
    };
    Zoom.prototype.getActualSizeScale = function (naturalWidth, width) {
        var _scale;
        var scale;
        if (naturalWidth > width) {
            _scale = naturalWidth / width;
            scale = _scale || 2;
        }
        else {
            scale = 1;
        }
        return scale;
    };
    Zoom.prototype.getPageCords = function (event) {
        var cords = {};
        if (event) {
            cords.x = event.pageX || event.targetTouches[0].pageX;
            cords.y = event.pageY || event.targetTouches[0].pageY;
        }
        else {
            cords.x = this.core.outer.width() / 2;
            cords.y = this.core.outer.height() / 2 + LG(window).scrollTop();
        }
        return cords;
    };
    Zoom.prototype.setPageCords = function (event) {
        var pageCords = this.getPageCords(event);
        this.pageX = pageCords.x;
        this.pageY = pageCords.y;
    };
    Zoom.prototype.beginZoom = function (scale) {
        this.core.outer.removeClass('lg-zoom-drag-transition');
        if (scale > 1) {
            this.core.outer.addClass('lg-zoomed');
        }
        else {
            this.resetZoom();
        }
    };
    Zoom.prototype.getScale = function (scale) {
        var $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-image')
            .first();
        var width = $image.get().offsetWidth;
        var naturalWidth = this.getNaturalWidth(this.core.index) || width;
        var actualSizeScale = this.getActualSizeScale(naturalWidth, width);
        if (scale < 1) {
            scale = 1;
        }
        else if (scale > actualSizeScale) {
            scale = actualSizeScale;
        }
        return scale;
    };
    Zoom.prototype.init = function () {
        var _this = this;
        this.buildTemplates();
        this.enableZoomOnSlideItemLoad();
        var tapped = null;
        this.core.outer.on('dblclick', function (event) {
            if (!LG(event.target).hasClass('lg-image')) {
                return;
            }
            _this.setActualSize(_this.core.index, event);
        });
        this.core.outer.on('touchstart', function (event) {
            var $target = LG(event.target);
            if (event.targetTouches.length === 1 &&
                $target.hasClass('lg-image')) {
                if (!tapped) {
                    tapped = setTimeout(function () {
                        tapped = null;
                    }, 300);
                }
                else {
                    clearTimeout(tapped);
                    tapped = null;
                    _this.setActualSize(_this.core.index, event);
                }
                event.preventDefault();
            }
        });
        // Update zoom on resize and orientationchange
        LG(window).on('resize.lg.zoom orientationchange.lg.zoom', function () {
            if (!_this.core.lgOpened)
                return;
            _this.setPageCords();
            _this.zoomImage(_this.scale);
        });
        this.core.outer
            .find('.lg-zoom-out')
            .first()
            .on('click.lg', function () {
            if (_this.core.outer.find('.lg-current .lg-image').first()) {
                _this.scale -= _this.s.scale;
                _this.scale = _this.getScale(_this.scale);
                _this.beginZoom(_this.scale);
                _this.zoomImage(_this.scale);
            }
        });
        this.core.outer
            .find('.lg-zoom-in')
            .first()
            .on('click.lg', function () {
            if (_this.core.outer.find('.lg-current .lg-image').first()) {
                _this.scale += _this.s.scale;
                _this.scale = _this.getScale(_this.scale);
                _this.beginZoom(_this.scale);
                _this.zoomImage(_this.scale);
            }
        });
        this.core.outer
            .find('.lg-actual-size')
            .first()
            .on('click.lg', function () {
            _this.setActualSize(_this.core.index);
        });
        this.core.LGel.on('onBeforeOpen.lg.tm', function () {
            _this.core.outer.find('.lg-item').first().removeClass('lg-zoomable');
        });
        // Reset zoom on slide change
        this.core.LGel.on('onBeforeSlide.lg', function () {
            _this.scale = 1;
            _this.resetZoom();
        });
        // Drag option after zoom
        this.zoomDrag();
        this.pinchZoom();
        this.zoomSwipe();
    };
    // Reset zoom effect
    Zoom.prototype.resetZoom = function () {
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
    };
    Zoom.prototype.getTouchDistance = function (e) {
        return Math.sqrt((e.targetTouches[0].pageX - e.targetTouches[1].pageX) *
            (e.targetTouches[0].pageX - e.targetTouches[1].pageX) +
            (e.targetTouches[0].pageY - e.targetTouches[1].pageY) *
                (e.targetTouches[0].pageY - e.targetTouches[1].pageY));
    };
    Zoom.prototype.pinchZoom = function () {
        var _this = this;
        var startDist = 0;
        var pinchStarted = false;
        var initScale = 1;
        var inner = LG("#" + this.core.getById('lg-inner'));
        var $item = this.core.getSlideItem(this.core.index);
        inner.on('touchstart.lg', function (e) {
            $item = _this.core.getSlideItem(_this.core.index);
            if (e.targetTouches.length === 2 &&
                (LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))) {
                initScale = _this.scale || 1;
                _this.core.outer.removeClass('lg-zoom-drag-transition lg-zoom-dragging');
                _this.core.touchAction = 'pinch';
                startDist = _this.getTouchDistance(e);
            }
        });
        inner.on('touchmove.lg', function (e) {
            if (e.targetTouches.length === 2 &&
                _this.core.touchAction === 'pinch' &&
                (LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))) {
                var endDist = _this.getTouchDistance(e);
                var distance = startDist - endDist;
                if (!pinchStarted && Math.abs(distance) > 5) {
                    pinchStarted = true;
                }
                if (pinchStarted) {
                    _this.scale = Math.max(1, initScale + -distance * 0.008);
                    _this.zoomImage(_this.scale);
                }
            }
        });
        inner.on('touchend.lg', function (e) {
            if (_this.core.touchAction === 'pinch' &&
                (LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))) {
                pinchStarted = false;
                startDist = 0;
                if (_this.scale <= 1) {
                    _this.resetZoom();
                }
                else {
                    _this.scale = _this.getScale(_this.scale);
                    _this.zoomImage(_this.scale);
                    _this.core.outer.addClass('lg-zoomed');
                }
                _this.core.touchAction = undefined;
            }
        });
    };
    Zoom.prototype.touchendZoom = function (startCoords, endCoords, allowX, allowY, touchDuration) {
        var distanceXnew = endCoords.x - startCoords.x;
        var distanceYnew = endCoords.y - startCoords.y;
        var speedX = Math.abs(distanceXnew) / touchDuration + 1;
        var speedY = Math.abs(distanceYnew) / touchDuration + 1;
        if (speedX > 2) {
            speedX += 1;
        }
        if (speedY > 2) {
            speedY += 1;
        }
        distanceXnew = distanceXnew * speedX;
        distanceYnew = distanceYnew * speedY;
        var _LGel = this.core
            .getSlideItem(this.core.index)
            .find('.lg-img-wrap')
            .first();
        var $image = this.core
            .getSlideItem(this.core.index)
            .find('.lg-object')
            .first();
        var dataX = parseFloat(_LGel.attr('data-x')) || 0;
        var dataY = parseFloat(_LGel.attr('data-y')) || 0;
        var distance = {};
        distance.x = -Math.abs(dataX) + distanceXnew;
        distance.y = -Math.abs(dataY) + distanceYnew;
        var $cont = this.core.outer.find('.lg');
        var possibleSwipeCords = this.getPossibleSwipeCords($image, $cont);
        if (Math.abs(distanceXnew) > 15 || Math.abs(distanceYnew) > 15) {
            if (allowY) {
                if (distance.y <= -possibleSwipeCords.maxY) {
                    distance.y = -possibleSwipeCords.maxY;
                }
                else if (distance.y >= -possibleSwipeCords.minY) {
                    distance.y = -possibleSwipeCords.minY;
                }
            }
            if (allowX) {
                if (distance.x <= -possibleSwipeCords.maxX) {
                    distance.x = -possibleSwipeCords.maxX;
                }
                else if (distance.x >= -possibleSwipeCords.minX) {
                    distance.x = -possibleSwipeCords.minX;
                }
            }
            if (allowY) {
                _LGel.attr('data-y', Math.abs(distance.y));
            }
            else {
                var dataY_1 = parseFloat(_LGel.attr('data-y')) || 0;
                distance.y = -Math.abs(dataY_1);
            }
            if (allowX) {
                _LGel.attr('data-x', Math.abs(distance.x));
            }
            else {
                var dataX_1 = parseFloat(_LGel.attr('data-x')) || 0;
                distance.x = -Math.abs(dataX_1);
            }
            this.setZoomSwipeStyles(_LGel, distance);
            this.positionChanged = true;
        }
    };
    Zoom.prototype.getZoomSwipeCords = function (startCoords, endCoords, allowX, allowY, possibleSwipeCords, dataY, dataX) {
        var distance = {};
        if (allowY) {
            distance.y = -Math.abs(dataY) + (endCoords.y - startCoords.y);
            if (distance.y <= -possibleSwipeCords.maxY) {
                var diffMaxY = -possibleSwipeCords.maxY - distance.y;
                distance.y = -possibleSwipeCords.maxY - diffMaxY / 6;
            }
            else if (distance.y >= -possibleSwipeCords.minY) {
                var diffMinY = distance.y - -possibleSwipeCords.minY;
                distance.y = -possibleSwipeCords.minY + diffMinY / 6;
            }
        }
        else {
            distance.y = -Math.abs(dataY);
        }
        if (allowX) {
            distance.x = -Math.abs(dataX) + (endCoords.x - startCoords.x);
            if (distance.x <= -possibleSwipeCords.maxX) {
                var diffMaxX = -possibleSwipeCords.maxX - distance.x;
                distance.x = -possibleSwipeCords.maxX - diffMaxX / 6;
            }
            else if (distance.x >= -possibleSwipeCords.minX) {
                var diffMinX = distance.x - -possibleSwipeCords.minX;
                distance.x = -possibleSwipeCords.minX + diffMinX / 6;
            }
        }
        else {
            distance.x = -Math.abs(dataX);
        }
        return distance;
    };
    Zoom.prototype.getPossibleSwipeCords = function (LGel, $cont) {
        var possibleCords = {};
        var contHeight = $cont.height();
        var contWidth = $cont.width();
        var elInnerHeight = LGel.get().offsetHeight;
        var elInnerWidth = LGel.get().offsetWidth;
        var dataY = parseFloat(LGel.attr('data-scale')) || 1;
        var elDataScale = Math.abs(dataY);
        possibleCords.minY = (contHeight - elInnerHeight) / 2;
        possibleCords.maxY = Math.abs(elInnerHeight * elDataScale - contHeight + possibleCords.minY);
        possibleCords.minX = (contWidth - elInnerWidth) / 2;
        possibleCords.maxX = Math.abs(elInnerWidth * elDataScale - contWidth + possibleCords.minX);
        return possibleCords;
    };
    Zoom.prototype.setZoomSwipeStyles = function (LGel, distance) {
        if (this.s.useLeftForZoom) {
            LGel.css('left', distance.x + 'px');
            LGel.css('top', distance.y + 'px');
        }
        else {
            LGel.css('transform', 'translate3d(' + distance.x + 'px, ' + distance.y + 'px, 0)');
        }
    };
    Zoom.prototype.zoomSwipe = function () {
        var _this = this;
        var startCoords = {};
        var endCoords = {};
        var isMoved = false;
        // Allow x direction drag
        var allowX = false;
        // Allow Y direction drag
        var allowY = false;
        var startTime = new Date();
        var endTime = new Date();
        var dataX = 0;
        var dataY = 0;
        var possibleSwipeCords;
        var _LGel;
        var inner = LG("#" + this.core.getById('lg-inner'));
        var $item = this.core.getSlideItem(this.core.index);
        inner.on('touchstart.lg', function (e) {
            $item = _this.core.getSlideItem(_this.core.index);
            if ((LG(e.target).hasClass('lg-item') ||
                $item.get().contains(e.target)) &&
                e.targetTouches.length === 1 &&
                _this.core.outer.hasClass('lg-zoomed')) {
                startTime = new Date();
                _this.core.touchAction = 'zoomSwipe';
                var $image = _this.core
                    .getSlideItem(_this.core.index)
                    .find('.lg-object')
                    .first();
                _LGel = _this.core
                    .getSlideItem(_this.core.index)
                    .find('.lg-img-wrap')
                    .first();
                allowY =
                    $image.get().offsetHeight *
                        parseFloat($image.attr('data-scale')) >
                        _this.core.outer.find('.lg').height();
                allowX =
                    $image.get().offsetWidth *
                        parseFloat($image.attr('data-scale')) >
                        _this.core.outer.find('.lg').width();
                if (allowX || allowY) {
                    e.preventDefault();
                    startCoords = {
                        x: e.targetTouches[0].pageX,
                        y: e.targetTouches[0].pageY,
                    };
                }
                dataY = parseFloat(_LGel.attr('data-y'));
                dataX = parseFloat(_LGel.attr('data-x'));
                var $cont = _this.core.outer.find('.lg');
                possibleSwipeCords = _this.getPossibleSwipeCords($image, $cont);
                // reset opacity and transition duration
                _this.core.outer.addClass('lg-zoom-dragging lg-zoom-drag-transition');
            }
        });
        inner.on('touchmove.lg', function (e) {
            if (e.targetTouches.length === 1 &&
                _this.core.touchAction === 'zoomSwipe' &&
                (LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))) {
                _this.core.touchAction = 'zoomSwipe';
                e.preventDefault();
                endCoords = {
                    x: e.targetTouches[0].pageX,
                    y: e.targetTouches[0].pageY,
                };
                var distance = _this.getZoomSwipeCords(startCoords, endCoords, allowX, allowY, possibleSwipeCords, dataY, dataX);
                if (Math.abs(endCoords.x - startCoords.x) > 15 ||
                    Math.abs(endCoords.y - startCoords.y) > 15) {
                    isMoved = true;
                    _this.setZoomSwipeStyles(_LGel, distance);
                }
            }
        });
        inner.on('touchend.lg', function (e) {
            if (_this.core.touchAction === 'zoomSwipe' &&
                (LG(e.target).hasClass('lg-item') ||
                    $item.get().contains(e.target))) {
                _this.core.touchAction = undefined;
                _this.core.outer.removeClass('lg-zoom-dragging');
                if (!isMoved) {
                    return;
                }
                isMoved = false;
                endTime = new Date();
                var touchDuration = endTime.valueOf() - startTime.valueOf();
                _this.touchendZoom(startCoords, endCoords, allowX, allowY, touchDuration);
            }
        });
    };
    Zoom.prototype.zoomDrag = function () {
        var _this = this;
        var startCoords = {};
        var endCoords = {};
        var isDragging = false;
        var isMoved = false;
        // Allow x direction drag
        var allowX = false;
        // Allow Y direction drag
        var allowY = false;
        var startTime;
        var endTime;
        var possibleSwipeCords;
        var dataY;
        var dataX;
        var _LGel;
        this.core.outer.on('mousedown.lg.zoom', function (e) {
            var $item = _this.core.getSlideItem(_this.core.index);
            if (LG(e.target).hasClass('lg-item') ||
                $item.get().contains(e.target)) {
                startTime = new Date();
                // execute only on .lg-object
                var $image = _this.core
                    .getSlideItem(_this.core.index)
                    .find('.lg-object')
                    .first();
                _LGel = _this.core
                    .getSlideItem(_this.core.index)
                    .find('.lg-img-wrap')
                    .first();
                allowY =
                    $image.get().offsetHeight *
                        parseFloat($image.attr('data-scale')) >
                        _this.core.outer.find('.lg').height();
                allowX =
                    $image.get().offsetWidth *
                        parseFloat($image.attr('data-scale')) >
                        _this.core.outer.find('.lg').width();
                if (_this.core.outer.hasClass('lg-zoomed')) {
                    if (LG(e.target).hasClass('lg-object') &&
                        (allowX || allowY)) {
                        e.preventDefault();
                        startCoords = {
                            x: e.pageX,
                            y: e.pageY,
                        };
                        var $cont = _this.core.outer.find('.lg');
                        possibleSwipeCords = _this.getPossibleSwipeCords($image, $cont);
                        isDragging = true;
                        dataY = parseFloat(_LGel.attr('data-y'));
                        dataX = parseFloat(_LGel.attr('data-x'));
                        // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                        _this.core.outer.get().scrollLeft += 1;
                        _this.core.outer.get().scrollLeft -= 1;
                        _this.core.outer
                            .removeClass('lg-grab')
                            .addClass('lg-grabbing lg-zoom-drag-transition lg-zoom-dragging');
                        // reset opacity and transition duration
                    }
                }
            }
        });
        LG(window).on('mousemove.lg.zoom', function (e) {
            if (isDragging) {
                isMoved = true;
                endCoords = {
                    x: e.pageX,
                    y: e.pageY,
                };
                var distance = _this.getZoomSwipeCords(startCoords, endCoords, allowX, allowY, possibleSwipeCords, dataY, dataX);
                _this.setZoomSwipeStyles(_LGel, distance);
            }
        });
        LG(window).on('mouseup.lg.zoom', function (e) {
            if (isDragging) {
                endTime = new Date();
                isDragging = false;
                _this.core.outer.removeClass('lg-zoom-dragging');
                // Fix for chrome mouse move on click
                if (isMoved &&
                    (startCoords.x !== endCoords.x ||
                        startCoords.y !== endCoords.y)) {
                    endCoords = {
                        x: e.pageX,
                        y: e.pageY,
                    };
                    var touchDuration = endTime.valueOf() - startTime.valueOf();
                    _this.touchendZoom(startCoords, endCoords, allowX, allowY, touchDuration);
                }
                isMoved = false;
            }
            _this.core.outer.removeClass('lg-grabbing').addClass('lg-grab');
        });
    };
    Zoom.prototype.destroy = function () {
        // Unbind all events added by lightGallery zoom plugin
        this.core.LGel.off('.lg.zoom');
        LG(window).off('.lg.zoom');
        this.core.outer.find('.lg-item').first().off('.lg.zoom');
        this.core.LGel.off('.lg.tm.zoom');
        this.resetZoom();
        clearTimeout(this.zoomableTimeout);
        this.zoomableTimeout = false;
    };
    return Zoom;
}());
exports.Zoom = Zoom;
window.lgModules.zoom = Zoom;
//# sourceMappingURL=lg-zoom.js.map