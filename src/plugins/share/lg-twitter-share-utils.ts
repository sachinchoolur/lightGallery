import { GalleryItem } from '../../lg-utils';

export function getTwitterShareLink(galleryItem: GalleryItem): string {
    const twitterBaseUrl = '//twitter.com/intent/tweet?text=';
    const url = encodeURIComponent(
        galleryItem.twitterShareUrl || window.location.href,
    );
    const text = galleryItem.tweetText;
    return twitterBaseUrl + text + '&url=' + url;
}
