import { DynamicItem } from '../../lg-utils';

export function getFacebookShareLink(galleryItem: DynamicItem): string {
    const facebookBaseUrl = '//www.facebook.com/sharer/sharer.php?u=';
    return (
        facebookBaseUrl +
        encodeURIComponent(galleryItem.facebookShareUrl || window.location.href)
    );
}
