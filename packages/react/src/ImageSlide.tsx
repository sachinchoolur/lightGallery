import type { ReactElement } from 'react';
import type { ImageSize } from '@lightgallery/headless';

import type { GalleryItem } from './types';

export interface ImageSlideProps {
    item: GalleryItem;
    index: number;
    /** First-slide dummy (2.x): the thumb that flies while `src` loads. */
    dummySrc?: string | null;
    /** Box the dummy flies at: the fitted image size, capped at natural. */
    dummySize?: ImageSize | null;
    /** Hold back the real `<img>` while the origin flight runs (2.x). */
    deferSrc?: boolean;
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
    dummySrc,
    dummySize,
    deferSrc,
    onLoad,
    onError,
}: ImageSlideProps): ReactElement {
    return (
        <picture className="lg-img-wrap">
            {!deferSrc &&
                item.sources?.map((source, sourceIndex) => (
                    <source
                        key={sourceIndex}
                        media={source.media}
                        srcSet={source.srcset}
                        sizes={source.sizes}
                        type={source.type}
                    />
                ))}
            {!deferSrc && (
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
            )}
            {dummySrc && (
                <img
                    className="lg-dummy-img"
                    src={dummySrc}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    // v2 sizes the dummy to the fitted image box, which is
                    // capped at the natural size. Filling the whole wrap
                    // instead stretches the thumb of an image smaller than
                    // the stage up to stage size, then snaps it down when
                    // the real image replaces it.
                    style={
                        dummySize
                            ? {
                                  width: `${dummySize.width}px`,
                                  height: `${dummySize.height}px`,
                                  transform: 'translate(-50%, -50%)',
                              }
                            : {
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  transform: 'translate(-50%, -50%)',
                              }
                    }
                />
            )}
        </picture>
    );
}
