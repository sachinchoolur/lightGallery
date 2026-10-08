import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgVideo from 'lightgallery/plugins/video';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';
import './demo.css';
import './carousel.css';

const container = document.getElementById('inline-gallery-container');

const inlineGallery = lightGallery(container, {
    // Render the gallery inside this element instead of over the page.
    container,
    // The slides come from dynamicEl, not from links in the page.
    dynamic: true,
    dynamicEl: [
        // YouTube and Vimeo: src is the address of the video page.
        {
            src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
            poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
            thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/mqdefault.jpg',
            subHtml:
                'YouTube video: Puffin Hunts Fish To Feed Puffling, BBC Earth',
        },
        {
            src: 'https://vimeo.com/112836958',
            poster: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
            thumb: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
            subHtml: 'Vimeo video: Nature, by Charlie Kaye',
        },
        // A video file you host yourself: no src. The files and the
        // <video> attributes go in video.
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
            subHtml: 'HTML5 video: Peck Pocketed, by Kevin Herron',
        },
    ],
    // The carousel stays open: no close button, Esc key or swipe to close.
    closable: false,
    // Toolbar button that expands the carousel to the whole window.
    showMaximizeIcon: true,
    plugins: [lgThumbnail, lgVideo],
});

// A dynamic gallery has no thumbnails to click, so open it from code.
inlineGallery.openGallery();
