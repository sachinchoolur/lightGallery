import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
} from '@lightgallery/react';
import Video from '@lightgallery/react/plugins/video';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-video.css';

const videos: GalleryItem[] = [
    // YouTube, Vimeo and Wistia: `src` is the address of the video page.
    // `poster` is the image shown before the video plays.
    {
        src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
        poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
        thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/mqdefault.jpg',
        alt: 'Puffin Hunts Fish To Feed Puffling',
        caption: 'YouTube video: Puffin Hunts Fish To Feed Puffling, BBC Earth',
        lgSize: '1280-720',
    },
    {
        src: 'https://vimeo.com/112836958',
        poster: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
        thumb: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
        alt: 'Nature',
        caption: 'Vimeo video: Nature, by Charlie Kaye',
        lgSize: '1280-720',
    },
    {
        src: 'https://private-sharing.wistia.com/medias/mwhrulrucj',
        poster: 'https://www.lightgalleryjs.com/images/demo/wistia-video-poster.jpeg',
        thumb: 'https://www.lightgalleryjs.com/images/demo/wistia-video-poster.jpeg',
        alt: 'Thank You!',
        caption: 'Wistia video: Thank You!',
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
        thumb: 'https://www.lightgalleryjs.com/images/demo/html5-video-poster.jpg',
        alt: 'Peck Pocketed',
        caption: 'HTML5 video: Peck Pocketed, by Kevin Herron',
        lgSize: '1280-720',
    },
];

export default function App() {
    return (
        <>
            <h1>lightGallery video gallery</h1>
            <LightGallery plugins={[Video]}>
                <div className="gallery">
                    {videos.map((video) => (
                        <LightGalleryItem
                            key={video.poster}
                            item={video}
                            href={video.src}
                        >
                            <img src={video.thumb} alt={video.alt} />
                        </LightGalleryItem>
                    ))}
                </div>
            </LightGallery>
        </>
    );
}
