/*! lg-share - v1.2.1 - 2020-06-13
* http://sachinchoolur.github.io/lightGallery
* Copyright (c) 2020 Sachin N; Licensed GPLv3 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(['jquery'], function (a0) {
      return (factory(a0));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('jquery'));
  } else {
    factory(root["jQuery"]);
  }
}(this, function ($) {

(function() {

    'use strict';

    var defaults = {
        share: true,
        facebook: true,
        facebookDropdownText: 'Facebook',
        twitter: true,
        twitterDropdownText: 'Twitter',
        googlePlus: true,
        googlePlusDropdownText: 'GooglePlus',
        pinterest: true,
        pinterestDropdownText: 'Pinterest'
    };

    var Share = function(element) {

        this.core = $(element).data('lightGallery');

        this.core.s = $.extend({}, defaults, this.core.s);
        if (this.core.s.share) {
            this.init();
        }

        return this;
    };

    Share.prototype.init = function() {
        var _this = this;

        var shareHtml = '<button type="button" aria-label="Share" id="lg-share" class="lg-icon" aria-haspopup="true" aria-expanded="false">' +
            '<ul class="lg-dropdown" style="position: absolute;">';
        shareHtml += _this.core.s.facebook ? '<li><a id="lg-share-facebook" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' + this.core.s.facebookDropdownText + '</span></a></li>' : '';
        shareHtml += _this.core.s.twitter ? '<li><a id="lg-share-twitter" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' + this.core.s.twitterDropdownText + '</span></a></li>' : '';
        shareHtml += _this.core.s.googlePlus ? '<li><a id="lg-share-googleplus" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' + this.core.s.googlePlusDropdownText + '</span></a></li>' : '';
        shareHtml += _this.core.s.pinterest ? '<li><a id="lg-share-pinterest" target="_blank"><span class="lg-icon"></span><span class="lg-dropdown-text">' + this.core.s.pinterestDropdownText + '</span></a></li>' : '';
        shareHtml += '</ul></button>';

        this.core.$outer.find('.lg-toolbar').append(shareHtml);
        this.core.$outer.find('.lg').append('<div id="lg-dropdown-overlay"></div>');
        $('#lg-share').on('click.lg', function(){
            _this.core.$outer.toggleClass('lg-dropdown-active');
            var ariaExpanded = $('#lg-share').attr('aria-expanded');
            $('#lg-share').attr('aria-expanded', ariaExpanded === 'true' ? false: true);
        });

        $('#lg-dropdown-overlay').on('click.lg', function(){
            _this.core.$outer.removeClass('lg-dropdown-active');
            $('#lg-share').attr('aria-expanded', false);
        });

        _this.core.$el.on('onAfterSlide.lg.tm', function(event, prevIndex, index) {

            setTimeout(function() {

                $('#lg-share-facebook').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + (encodeURIComponent(_this.getSahreProps(index, 'facebookShareUrl') || window.location.href)));

                $('#lg-share-twitter').attr('href', 'https://twitter.com/intent/tweet?text=' + _this.getSahreProps(index, 'tweetText') + '&url=' + (encodeURIComponent(_this.getSahreProps(index, 'twitterShareUrl') || window.location.href)));

                $('#lg-share-googleplus').attr('href', 'https://plus.google.com/share?url=' + (encodeURIComponent(_this.getSahreProps(index, 'googleplusShareUrl') || window.location.href)));

                $('#lg-share-pinterest').attr('href', 'https://www.pinterest.com/pin/create/button/?url=' + (encodeURIComponent(_this.getSahreProps(index, 'pinterestShareUrl') || window.location.href)) + '&media=' + encodeURIComponent(_this.getSahreProps(index, 'src')) + '&description=' + _this.getSahreProps(index, 'pinterestText'));

            }, 100);
        });
    };

    Share.prototype.getSahreProps = function(index, prop){
        var shareProp = '';
        if(this.core.s.dynamic) {
            shareProp = this.core.s.dynamicEl[index][prop];
        } else {
            var _href = this.core.$items.eq(index).attr('href');
            var _prop = this.core.$items.eq(index).data(prop);
            shareProp = prop === 'src' ? _href || _prop : _prop;
        }
        return shareProp;
    };

    Share.prototype.destroy = function() {

    };

    $.fn.lightGallery.modules.share = Share;

})();



}));
