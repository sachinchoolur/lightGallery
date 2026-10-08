import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
} from '@lightgallery/react';
import Video from '@lightgallery/react/plugins/video';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-video.css';

// `poster` is the image the slide shows until play is pressed.
const videos: GalleryItem[] = [
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
];

export default function App() {
    return (
        <>
            <h1>lightGallery video facades</h1>
            <LightGallery
                plugins={[Video]}
                video={{
                    // The next two are the defaults, written out. A video
                    // slide shows its poster with a play button; the player
                    // loads when play is pressed.
                    videoFacade: true,
                    // YouTube videos are embedded through
                    // youtube-nocookie.com.
                    youTubeNoCookie: true,
                    // By default the first video starts playing as the
                    // gallery opens, which loads its player at once. Off,
                    // so every slide starts as a facade.
                    autoplayFirstVideo: false,
                }}
            >
                <div className="gallery">
                    {videos.map((video) => (
                        <LightGalleryItem
                            key={video.src}
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
