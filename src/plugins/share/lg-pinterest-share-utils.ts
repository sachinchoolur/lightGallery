import { getPinterestShareLink as buildPinterestShareLink } from '@lightgallery/headless';

import { GalleryItem } from '../../lg-utils';

export function getPinterestShareLink(galleryItem: GalleryItem): string {
    return buildPinterestShareLink(galleryItem, window.location.href);
}
