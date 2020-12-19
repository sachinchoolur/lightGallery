import { DynamicItem } from '../../lg-utils';
import { lgQuery } from '../../lgQuery';

function getPinterestShareLink(galleryItem: DynamicItem) {
    const pinterestBaseUrl = 'http://www.pinterest.com/pin/create/button/?url=';
    const description = galleryItem.pinterestText;
    const media = encodeURIComponent(galleryItem.src);
    const url = encodeURIComponent(
        galleryItem.pinterestShareUrl || window.location.href,
    );
    return (
        pinterestBaseUrl +
        url +
        '&media=' +
        media +
        '&description=' +
        description
    );
}

export function setPinterestShareLink(
    selector: lgQuery,
    galleryItem: DynamicItem,
): void {
    const href = getPinterestShareLink(galleryItem);
    selector.attr('href', href);
}
