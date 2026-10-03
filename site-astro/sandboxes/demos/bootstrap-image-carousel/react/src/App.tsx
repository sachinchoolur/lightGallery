import { useEffect, useRef } from 'react';
import Carousel from 'bootstrap/js/dist/carousel';
import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
} from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import './carousel.css';

// `thumb` is the image on the slide. `lgSize` is the full-size image's
// WIDTH-HEIGHT; it lets the image open from its slide.
const slides: GalleryItem[] = [
    {
        src: 'https://picsum.photos/id/10/1600/1067',
        thumb: 'https://picsum.photos/id/10/960/640',
        alt: 'Sample photo 1',
        lgSize: '1600-1067',
    },
    {
        src: 'https://picsum.photos/id/11/1600/1067',
        thumb: 'https://picsum.photos/id/11/960/640',
        alt: 'Sample photo 2',
        lgSize: '1600-1067',
    },
    {
        src: 'https://picsum.photos/id/15/1600/1067',
        thumb: 'https://picsum.photos/id/15/960/640',
        alt: 'Sample photo 3',
        lgSize: '1600-1067',
    },
];

export default function App() {
    const carouselRef = useRef<HTMLDivElement>(null);

    // The Bootstrap carousel
    useEffect(() => {
        const carousel = new Carousel(carouselRef.current!, {
            interval: 2000,
            wrap: false,
        });
        return () => carousel.dispose();
    }, []);

    return (
        <>
            <h1>lightGallery with a Bootstrap carousel</h1>
            {/* One gallery over the carousel: every slide holds an item
                that opens its full-size image. */}
            <LightGallery plugins={[Thumbnail]}>
                <div
                    id="bootstrap-gallery-carousel"
                    className="carousel slide"
                    ref={carouselRef}
                >
                    <div className="carousel-inner">
                        {slides.map((photo, index) => (
                            <div
                                key={photo.src}
                                className={
                                    index === 0
                                        ? 'carousel-item active'
                                        : 'carousel-item'
                                }
                            >
                                <LightGalleryItem item={photo} href={photo.src}>
                                    <img
                                        src={photo.thumb}
                                        className="d-block w-100"
                                        alt={photo.alt}
                                    />
                                </LightGalleryItem>
                            </div>
                        ))}
                    </div>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#bootstrap-gallery-carousel"
                        data-bs-slide="prev"
                    >
                        <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                        />
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#bootstrap-gallery-carousel"
                        data-bs-slide="next"
                    >
                        <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                        />
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </LightGallery>
        </>
    );
}
