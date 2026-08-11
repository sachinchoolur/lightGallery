import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import Autoplay from '@lightgallery/react/plugins/autoplay';
import Fullscreen from '@lightgallery/react/plugins/fullscreen';
import Rotate from '@lightgallery/react/plugins/rotate';
import Share from '@lightgallery/react/plugins/share';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Video from '@lightgallery/react/plugins/video';

import { ITEMS } from './react-masonry-items';

const PLUGINS = [Autoplay, Fullscreen, Share, Thumbnail, Video, Rotate];

/** Rendered width of the grid thumbnails (the `w=270` unsplash crop). */
const THUMB_WIDTH = 270;

/**
 * The React demo gallery as an actual `@lightgallery/react` island.
 *
 * The columns are CSS (`.masonry-grid`), not the Masonry vendor the
 * vanilla demo uses: a JS layout pass repositions every tile after the
 * images load, which shifts the page under it. CSS columns land with the
 * first paint, and drop two vendor scripts from the page.
 */
export default function ReactMasonryGallery() {
    return (
        <LightGallery plugins={PLUGINS}>
            <div className="grid masonry-grid">
                {ITEMS.map((item) => {
                    // Intrinsic thumb size from the slide ratio, so a tile
                    // never resizes once its image arrives.
                    const [width, height] = (item.lgSize ?? '')
                        .split('-')
                        .map(Number);
                    return (
                        <LightGalleryItem
                            key={item.src}
                            item={item}
                            className="lg-item"
                        >
                            <img
                                alt={item.alt}
                                className="img-responsive"
                                src={item.thumb}
                                width={THUMB_WIDTH}
                                height={
                                    width && height
                                        ? Math.round(
                                              (THUMB_WIDTH * height) / width,
                                          )
                                        : undefined
                                }
                            />
                        </LightGalleryItem>
                    );
                })}
            </div>
        </LightGallery>
    );
}
