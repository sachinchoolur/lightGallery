import { useEffect, useRef, type MouseEvent } from 'react';
import Flickity from 'flickity';
import { LightGallery, LightGalleryItem } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

import 'flickity/css/flickity.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import './carousel.css';

const slides = [10, 11, 15, 16, 28, 29].map((id, index) => ({
    src: `https://picsum.photos/id/${id}/1600/1067`,
    thumb: `https://picsum.photos/id/${id}/720/480`,
    alt: `Sample photo ${index + 1}`,
    // WIDTH-HEIGHT of the full-size image; lets it open from its cell.
    lgSize: '1600-1067',
}));

export default function App() {
    const carousel = useRef<HTMLDivElement>(null);
    // True from the start of a drag until the click that ends it.
    const dragged = useRef(false);

    // Create the carousel once its cells are in the page.
    useEffect(() => {
        const flickity = new Flickity(carousel.current!, {
            cellAlign: 'center',
            pageDots: false,
            contain: true,
            autoPlay: true,
            on: {
                pointerDown() {
                    dragged.current = false;
                },
                dragStart() {
                    dragged.current = true;
                },
            },
        });
        return () => flickity.destroy();
    }, []);

    // Letting go of a drag also clicks the cell under the pointer. Stop
    // that click before it reaches the cell, so only a plain click opens
    // the gallery.
    const stopDragClick = (event: MouseEvent) => {
        if (dragged.current) {
            dragged.current = false;
            event.preventDefault();
            event.stopPropagation();
        }
    };

    return (
        <>
            <h1>lightGallery with a Flickity carousel</h1>
            <LightGallery plugins={[Zoom, Thumbnail]}>
                <div
                    ref={carousel}
                    className="main-carousel"
                    onClickCapture={stopDragClick}
                >
                    {slides.map((slide) => (
                        <LightGalleryItem
                            key={slide.src}
                            className="carousel-cell"
                            item={slide}
                            href={slide.src}
                        >
                            <img src={slide.thumb} alt={slide.alt} />
                        </LightGalleryItem>
                    ))}
                </div>
            </LightGallery>
        </>
    );
}
