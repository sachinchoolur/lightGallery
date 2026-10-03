import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
} from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Video from '@lightgallery/react/plugins/video';

// The grid needs Bootstrap's stylesheet only, none of its JavaScript.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';
import './gallery.css';

const videos: GalleryItem[] = [
    // YouTube and Vimeo: `src` is the address of the video page. `poster`
    // is the image shown before the video plays.
    {
        src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
        poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
        thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
        alt: 'YouTube video',
        lgSize: '1280-720',
    },
    {
        src: 'https://vimeo.com/112836958',
        poster: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
        thumb: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
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
        thumb: 'https://www.lightgalleryjs.com/images/demo/html5-video-poster.jpg',
        alt: 'HTML5 video',
        lgSize: '1280-720',
    },
];

export default function App() {
    return (
        <>
            <h1>lightGallery with a Bootstrap video gallery</h1>
            {/* The thumbnail plugin is optional. */}
            <LightGallery plugins={[Thumbnail, Video]}>
                {/* A Bootstrap grid whose columns are the video items. */}
                <div className="row g-3" id="bootstrap-video-gallery">
                    {videos.map((video) => (
                        <LightGalleryItem
                            key={video.poster}
                            item={video}
                            href={video.src}
                            className="col-sm-4"
                        >
                            <img
                                className="img-fluid"
                                src={video.thumb}
                                alt={video.alt}
                            />
                        </LightGalleryItem>
                    ))}
                </div>
            </LightGallery>
        </>
    );
}
