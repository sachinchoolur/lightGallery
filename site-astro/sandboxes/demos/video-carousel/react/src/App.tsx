import { useState } from 'react';
import { LightGallery, type GalleryItem } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Video from '@lightgallery/react/plugins/video';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';
import './carousel.css';

const videos: GalleryItem[] = [
    // YouTube and Vimeo: `src` is the address of the video page.
    {
        src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
        poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
        thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/mqdefault.jpg',
        alt: 'Puffin Hunts Fish To Feed Puffling',
        caption: 'YouTube video: Puffin Hunts Fish To Feed Puffling, BBC Earth',
    },
    {
        src: 'https://vimeo.com/112836958',
        poster: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
        thumb: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
        alt: 'Nature',
        caption: 'Vimeo video: Nature, by Charlie Kaye',
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
        thumb: 'https://www.lightgalleryjs.com/images/demo/html5-video-poster.jpg',
        alt: 'Peck Pocketed',
        caption: 'HTML5 video: Peck Pocketed, by Kevin Herron',
    },
];

export default function App() {
    // Kept in state, not in a ref: the gallery can only be rendered into
    // the element once it exists, and setting state renders again.
    const [container, setContainer] = useState<HTMLElement | null>(null);

    return (
        <>
            <h1>lightGallery video carousel</h1>
            {/* The gallery is rendered inside this element and takes its
                size, which is set in carousel.css. */}
            <div className="inline-gallery-container" ref={setContainer} />
            {container && (
                <LightGallery
                    container={container}
                    // The carousel is always open and cannot be closed.
                    open
                    closable={false}
                    // Toolbar button that expands it to the whole window.
                    showMaximizeIcon
                    slides={videos}
                    plugins={[Thumbnail, Video]}
                />
            )}
        </>
    );
}
