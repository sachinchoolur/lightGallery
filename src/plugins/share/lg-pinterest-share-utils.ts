import { GalleryItem } from '../../lg-utils';

export function getPinterestShareLink(galleryItem: GalleryItem): string {
    const pinterestBaseUrl = 'http://www.pinterest.com/pin/create/button/?url=';
    const description = galleryItem.pinterestText;
    const media = encodeURIComponent(galleryItem.src as string);
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
