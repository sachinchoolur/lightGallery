import { DynamicItem } from '../../lg-utils';
import { lgQuery } from '../../lgQuery';

function getFacebookShareLink(galleryItem: DynamicItem) {
    const facebookBaseUrl = '//www.facebook.com/sharer/sharer.php?u=';
    return (
        facebookBaseUrl +
        encodeURIComponent(galleryItem.facebookShareUrl || window.location.href)
    );
}
export function setFacebookShareLink(
    selector: lgQuery,
    galleryItem: DynamicItem,
): void {
    const href = getFacebookShareLink(galleryItem);
    selector.attr('href', href);
}
