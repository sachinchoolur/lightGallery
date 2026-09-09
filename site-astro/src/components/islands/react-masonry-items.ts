import type { GalleryItem } from '@lightgallery/react';

import { photos } from '../../lib/photos';

/** The same street set the vanilla masonry demo renders. */
export const ITEMS: GalleryItem[] = photos('street').map((p) => ({
    src: p.src,
    lgSize: `${p.width}-${p.height}`,
    captionHtml: p.caption,
    thumb: p.thumb,
    alt: p.alt,
}));
