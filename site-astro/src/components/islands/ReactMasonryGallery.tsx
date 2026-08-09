import { useEffect, useRef } from 'react';

import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import Autoplay from '@lightgallery/react/plugins/autoplay';
import Fullscreen from '@lightgallery/react/plugins/fullscreen';
import Rotate from '@lightgallery/react/plugins/rotate';
import Share from '@lightgallery/react/plugins/share';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Video from '@lightgallery/react/plugins/video';

import { ITEMS } from './react-masonry-items';
import masonryUrl from '../../scripts/vendor/masonry.pkgd.min.js?url';
import imagesLoadedUrl from '../../scripts/vendor/imagesloaded.pkgd.js?url';
import { loadVendor } from '../../scripts/load-vendor.js';

const PLUGINS = [Autoplay, Fullscreen, Share, Thumbnail, Video, Rotate];

/**
 * The React demo gallery as an actual `@lightgallery/react` island — the
 * same masonry grid markup/classes as the vanilla demo (so the site CSS
 * applies), with the Masonry layout vendor applied after mount.
 */
export default function ReactMasonryGallery() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let disposed = false;
        let masonryInstance:
            | { layout(): void; destroy(): void }
            | undefined;
        (async () => {
            await loadVendor(masonryUrl);
            await loadVendor(imagesLoadedUrl);
            const Masonry = window.Masonry;
            const imagesLoaded = window.imagesLoaded;
            const container = containerRef.current;
            if (disposed || !container || !Masonry || !imagesLoaded) {
                return;
            }
            masonryInstance = new Masonry(container, {
                itemSelector: '.lg-item',
                columnWidth: '.grid-sizer',
                percentPosition: true,
                gutter: 10,
                horizontalOrder: true,
                fitWidth: true,
            });
            imagesLoaded(container).on('progress', () => {
                masonryInstance?.layout();
            });
        })();
        return () => {
            disposed = true;
            masonryInstance?.destroy();
        };
    }, []);

    return (
        <LightGallery plugins={PLUGINS}>
            <div ref={containerRef} className="grid masonry-grid">
                <div className="grid-sizer"></div>
                {ITEMS.map((item) => (
                    <LightGalleryItem
                        key={item.src}
                        item={item}
                        className="lg-item"
                    >
                        <img
                            alt={item.alt}
                            className="img-responsive"
                            src={item.thumb}
                        />
                    </LightGalleryItem>
                ))}
            </div>
        </LightGallery>
    );
}
