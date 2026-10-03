import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
} from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Video from '@lightgallery/react/plugins/video';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';

import { photos } from './photos';

// One gallery, a different kind of slide for each item.
const items: GalleryItem[] = [
    // Image
    photos[0],
    // YouTube video
    {
        src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
        poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
        thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/mqdefault.jpg',
        alt: 'Puffin Hunts Fish To Feed Puffling',
        caption: 'YouTube video: Puffin Hunts Fish To Feed Puffling, BBC Earth',
        lgSize: '1280-720',
    },
    // Vimeo video
    {
        src: 'https://vimeo.com/112836958',
        poster: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
        thumb: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
        alt: 'Nature',
        caption: 'Vimeo video: Nature, by Charlie Kaye',
        lgSize: '1280-720',
    },
    // HTML5 video: no `src`; the files go in `video`.
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
        lgSize: '1280-720',
    },
    // Iframe: `iframe: true` shows the page at `src` inside the slide.
    {
        src: 'https://www.openstreetmap.org/export/embed.html?bbox=-5.2884,35.1588,-5.2484,35.1788',
        iframe: true,
        iframeTitle: 'Map',
        thumb: 'https://picsum.photos/id/49/360/240',
        alt: 'Map',
        caption: 'Iframe: a map',
    },
    // Image
    photos[1],
];

export default function App() {
    return (
        <>
            <h1>lightGallery mixed contents</h1>
            {/* Images and iframes work without a plugin; video slides need
                Video. */}
            <LightGallery plugins={[Thumbnail, Video]}>
                <div className="gallery">
                    {items.map((item) => (
                        <LightGalleryItem
                            key={item.thumb}
                            item={item}
                            href={item.src}
                        >
                            <img src={item.thumb} alt={item.alt} />
                        </LightGalleryItem>
                    ))}
                </div>
            </LightGallery>
        </>
    );
}
