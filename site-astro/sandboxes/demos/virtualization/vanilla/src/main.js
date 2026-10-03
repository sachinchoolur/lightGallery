import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import './demo.css';

const slides = Array.from({ length: 1000 }, (_, i) => ({
    src: `https://picsum.photos/seed/lg-${i}/1600/1067`,
    thumb: `https://picsum.photos/seed/lg-${i}/240/160`,
    subHtml: `<h4>Slide ${i + 1} / 1000</h4>`,
}));

const button = document.getElementById('open-gallery');

const gallery = lightGallery(button, {
    dynamic: true,
    dynamicEl: slides,
    plugins: [lgThumbnail],
    virtualization: {
        // How many slides are in the DOM at once, around the current one.
        slides: 7,
        // Only the visible thumbnails are in the DOM, plus one more
        // viewport of them on each side.
        thumbs: 'auto',
    },
});

button.addEventListener('click', () => gallery.openGallery(0));
