import { GalleryItem } from '../../lg-utils';

export function getFacebookShareLink(galleryItem: GalleryItem): string {
    const facebookBaseUrl = '//www.facebook.com/sharer/sharer.php?u=';
    return (
        facebookBaseUrl +
        encodeURIComponent(galleryItem.facebookShareUrl || window.location.href)
    );
}
