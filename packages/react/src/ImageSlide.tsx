import type { ReactElement } from 'react';

import type { GalleryItem } from './types';

export interface ImageSlideProps {
    item: GalleryItem;
    index: number;
    onLoad: () => void;
    onError: () => void;
}

/**
 * Default image renderer: `<picture class="lg-img-wrap">` with optional
 * `<source>` entries and the `lg-object lg-image` img — the same DOM the
 * vanilla core produces, so `lightgallery/css` styles it unchanged.
 */
export function ImageSlide({
    item,
    index,
    onLoad,
    onError,
}: ImageSlideProps): ReactElement {
    return (
        <picture className="lg-img-wrap">
            {item.sources?.map((source, sourceIndex) => (
                <source
                    key={sourceIndex}
                    media={source.media}
                    srcSet={source.srcset}
                    sizes={source.sizes}
                    type={source.type}
                />
            ))}
            <img
                className="lg-object lg-image"
                data-index={index}
                src={item.src}
                srcSet={item.srcset}
                sizes={item.sizes}
                alt={item.alt ?? ''}
                onLoad={onLoad}
                onError={onError}
                // Native image dragging would swallow the swipe gesture.
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
            />
        </picture>
    );
}
