import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import './demo.css';
import './carousel.css';

const photo = (id) => ({
    src: `https://picsum.photos/id/${id}/1600/1067`,
    thumb: `https://picsum.photos/id/${id}/360/240`,
});

const container = document.getElementById('inline-gallery-container');

const inlineGallery = lightGallery(container, {
    // Render the gallery inside this element instead of over the page.
    container,
    // The slides come from dynamicEl, not from links in the page.
    dynamic: true,
    dynamicEl: [10, 11, 15, 16, 28, 29, 37, 110].map(photo),
    // The carousel stays open: no close button, Esc key or swipe to close.
    closable: false,
    // Toolbar button that expands the carousel to the whole window.
    showMaximizeIcon: true,
    plugins: [lgThumbnail, lgZoom],
});

// A dynamic gallery has no thumbnails to click, so open it from code.
inlineGallery.openGallery();
