import { useEffect, useRef } from 'react';
import Carousel from 'bootstrap/js/dist/carousel';
import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
} from '@lightgallery/react';
import Video from '@lightgallery/react/plugins/video';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-video.css';
import './carousel.css';

const videos: GalleryItem[] = [
    // YouTube and Vimeo: `src` is the address of the video page. `poster`
    // is the image shown before the video plays.
    {
        src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
        poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
        alt: 'YouTube video',
        lgSize: '1280-720',
    },
    {
        src: 'https://vimeo.com/112836958',
        poster: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
        alt: 'Vimeo video',
        lgSize: '1280-720',
    },
    // A video file you host yourself: no `src`. The files and the <video>
    // attributes go in `video`.
    {
        video: {
            source: [
                {
                    src: 'https://www.lightgalleryjs.com/videos/video1.mp4',
                    type: 'video/mp4',
                },
            ],
            attributes: { preload: 'metadata', controls: true },
        },
        poster: 'https://www.lightgalleryjs.com/images/demo/html5-video-poster.jpg',
        alt: 'HTML5 video',
        lgSize: '1280-720',
    },
];

export default function App() {
    const carouselRef = useRef<HTMLDivElement>(null);

    // The Bootstrap carousel
    useEffect(() => {
        const carousel = new Carousel(carouselRef.current!, {
            interval: 2000,
            wrap: false,
            // Start cycling right away.
            ride: 'carousel',
        });
        return () => {
            // dispose() leaves the cycle timer running, so stop it first.
            carousel.pause();
            carousel.dispose();
        };
    }, []);

    return (
        <>
            <h1>lightGallery with a Bootstrap video carousel</h1>
            {/* One gallery over the carousel: every slide holds an item
                that opens its video. */}
            <LightGallery plugins={[Video]}>
                <div
                    id="bootstrap-video-carousel"
                    className="carousel slide"
                    ref={carouselRef}
                >
                    <div className="carousel-indicators">
                        {videos.map((video, index) => (
                            <button
                                key={video.poster}
                                type="button"
                                data-bs-target="#bootstrap-video-carousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? 'active' : undefined}
                                aria-current={index === 0 ? 'true' : undefined}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>
                    <div className="carousel-inner">
                        {videos.map((video, index) => (
                            <div
                                key={video.poster}
                                className={
                                    index === 0
                                        ? 'carousel-item active'
                                        : 'carousel-item'
                                }
                            >
                                <LightGalleryItem item={video} href={video.src}>
                                    <img
                                        src={video.poster}
                                        className="d-block w-100"
                                        alt={video.alt}
                                    />
                                </LightGalleryItem>
                            </div>
                        ))}
                    </div>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#bootstrap-video-carousel"
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
                        data-bs-target="#bootstrap-video-carousel"
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
