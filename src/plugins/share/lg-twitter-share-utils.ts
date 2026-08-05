import { getXShareLink } from '@lightgallery/headless';

import { GalleryItem } from '../../lg-utils';

/** X (formerly Twitter) intent link; the file name is kept for 2.x import
 * compatibility — `tweetText`/`twitterShareUrl` fields keep working. */
export function getTwitterShareLink(galleryItem: GalleryItem): string {
    return getXShareLink(galleryItem, window.location.href);
}
