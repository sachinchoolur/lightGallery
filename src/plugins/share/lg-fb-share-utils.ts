import { getFacebookShareLink as buildFacebookShareLink } from '@lightgallery/headless';

import { GalleryItem } from '../../lg-utils';

export function getFacebookShareLink(galleryItem: GalleryItem): string {
    return buildFacebookShareLink(galleryItem, window.location.href);
}
