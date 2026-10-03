import lightGallery from 'lightgallery';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import './demo.css';

// Any SVG markup works; drawing with currentColor keeps the hover and
// active colors of the buttons.
const icon = (content) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`;

lightGallery(document.getElementById('gallery'), {
    plugins: [lgZoom, lgFullscreen, lgAutoplay, lgThumbnail],
    // Names left out, such as download and the zoom buttons, keep the
    // built-in icons.
    icons: {
        close: icon('<path d="M6 6l12 12M18 6L6 18"/>'),
        prev: icon('<path d="M14.5 5.5L8 12l6.5 6.5"/>'),
        next: icon('<path d="M9.5 5.5L16 12l-6.5 6.5"/>'),
        // A state pair needs both names, or the pair keeps the built-ins.
        autoplayPlay: icon('<path d="M9 5.8v12.4L19 12z"/>'),
        autoplayPause: icon('<path d="M8.5 6v12M15.5 6v12"/>'),
    },
});
