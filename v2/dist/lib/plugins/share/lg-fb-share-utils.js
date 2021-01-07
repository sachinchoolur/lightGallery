"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFacebookShareLink = void 0;
function getFacebookShareLink(galleryItem) {
    var facebookBaseUrl = 'https://www.facebook.com/sharer/sharer.php?u=';
    return (facebookBaseUrl +
        encodeURIComponent(galleryItem.facebookShareUrl || window.location.href));
}
function setFacebookShareLink(selector, galleryItem) {
    var href = getFacebookShareLink(galleryItem);
    selector.attr('href', href);
}
exports.setFacebookShareLink = setFacebookShareLink;
//# sourceMappingURL=lg-fb-share-utils.js.map