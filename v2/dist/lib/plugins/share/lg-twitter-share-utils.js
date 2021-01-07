"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTwitterShareLink = void 0;
function getTwitterShareLink(galleryItem) {
    var twitterBaseUrl = 'https://twitter.com/intent/tweet?text=';
    var url = encodeURIComponent(galleryItem.twitterShareUrl || window.location.href);
    var text = galleryItem.tweetText;
    return twitterBaseUrl + text + '&url=' + url;
}
function setTwitterShareLink(selector, galleryItem) {
    var href = getTwitterShareLink(galleryItem);
    selector.attr('href', href);
}
exports.setTwitterShareLink = setTwitterShareLink;
//# sourceMappingURL=lg-twitter-share-utils.js.map