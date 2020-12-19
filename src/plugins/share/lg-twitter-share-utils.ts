import { DynamicItem } from '../../lg-utils';
import { lgQuery } from '../../lgQuery';

function getTwitterShareLink(galleryItem: DynamicItem) {
    const twitterBaseUrl = 'https://twitter.com/intent/tweet?text=';
    const url = encodeURIComponent(
        galleryItem.twitterShareUrl || window.location.href,
    );
    const text = galleryItem.tweetText;
    return twitterBaseUrl + text + '&url=' + url;
}

export function setTwitterShareLink(
    selector: lgQuery,
    galleryItem: DynamicItem,
): void {
    const href = getTwitterShareLink(galleryItem);
    selector.attr('href', href);
}
