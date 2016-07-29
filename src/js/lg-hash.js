/*! lightgallery - v1.2.19 - 2016-05-17
* http://sachinchoolur.github.io/lightGallery/
* Copyright (c) 2016 Sachin N; Licensed Apache 2.0 */
(function($, window, document, undefined) {

    'use strict';

    var defaults = {
        hash: true,
        // Use get instead hash
        get: false
    };

    var Hash = function(element) {

        this.core = $(element).data('lightGallery');

        this.core.s = $.extend({}, defaults, this.core.s);

        if (this.core.s.hash) {
            this.oldHash = this.core.s.get ? window.location.search : window.location.hash;
            this.init();
        }

        return this;
    };

    Hash.prototype.init = function() {
        var _this = this;
        var _hash;

        // Change hash value on after each slide transition
        _this.core.$el.on('onAfterSlide.lg.tm', function(event, prevIndex, index) {
            if (_this.core.s.get) {
                var _search = window.location.href;
                if (window.location.href.search('lg') !== -1) {
                    _search = window.location.href.replace(/lg=[0-9]+/, 'lg=' + _this.core.s.galleryId).replace(/slide=[0-9]+/, 'slide=' + index);
                } else {
                    _search = window.location.href + (window.location.search.length !== 0 ? '&' : '?') + 'lg=' + _this.core.s.galleryId + '&slide=' + index;
                }
                if (history.pushState) {
                    history.pushState('', document.title, _search);
                }
            } else {
                window.location.hash = 'lg=' + _this.core.s.galleryId + '&slide=' + index;
            }
        });

        // Listen hash change and change the slide according to slide value
        $(window).on('hashchange.lg.hash', function() {
            _hash = _this.core.s.get ? window.location.search : window.location.hash;
            var _idx = parseInt(_hash.split('&slide=')[1], 10);

            // it galleryId doesn't exist in the url close the gallery
            if ((_hash.indexOf('lg=' + _this.core.s.galleryId) > -1)) {
                _this.core.slide(_idx, false, false);
            } else if (_this.core.lGalleryOn) {
                _this.core.destroy();
            }

        });
    };

    Hash.prototype.destroy = function() {

        if (!this.core.s.hash) {
            return;
        }

        // Reset to old hash value
        if (this.oldHash && this.oldHash.indexOf('lg=' + this.core.s.galleryId) === -1) {
            if(this.core.s.get) {
                if (history.pushState) {
                    history.pushState('', document.title, window.location.pathname + this.oldHash);
                } else {
                    window.location.search = this.oldHash;
                }
            } else {
                window.location.hash = this.oldHash;
            }
        } else {
            if (history.pushState) {
                history.pushState('', document.title, window.location.pathname + window.location.search.replace(/[&]?lg=[0-9]+&slide=[0-9]+[?&]?/, '').replace(/[?]$/, ''));
            } else {
                if (this.core.s.get) {
                    // Using replace because in url can be others gets.
                    window.location.search.replace(/[&]?lg=[0-9]+&slide=[0-9]+[?&]?/, '').replace(/[?]$/, '');
                } else {
                    // Using replace because in url can be others hashs.
                    window.location.hash.replace(/[&]?lg=[0-9]+&slide=[0-9]+[?&]?/, '').replace(/[#]$/, '');
                }
            }
        }

        this.core.$el.off('.lg.hash');

    };

    $.fn.lightGallery.modules.hash = Hash;

})(jQuery, window, document);
