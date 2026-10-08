import lightGallery from 'lightgallery';

import 'lightgallery/css/lightgallery.css';
import './demo.css';

const button = document.getElementById('open-gallery');

// The slides are data: there is no gallery markup on the page.
const dynamicEl = [
    {
        src: 'https://picsum.photos/id/10/1600/1067',
        thumb: 'https://picsum.photos/id/10/360/240',
        subHtml: '<h4>Sample photo 1</h4>',
    },
    {
        src: 'https://picsum.photos/id/11/1600/1067',
        thumb: 'https://picsum.photos/id/11/360/240',
        subHtml: '<h4>Sample photo 2</h4>',
    },
    {
        src: 'https://picsum.photos/id/15/1600/1067',
        thumb: 'https://picsum.photos/id/15/360/240',
        subHtml: '<h4>Sample photo 3</h4>',
    },
    {
        src: 'https://picsum.photos/id/16/1600/1067',
        thumb: 'https://picsum.photos/id/16/360/240',
        subHtml: '<h4>Sample photo 4</h4>',
    },
];

const gallery = lightGallery(button, {
    dynamic: true,
    dynamicEl,
});

button.addEventListener('click', () => {
    // Opens on the third slide. With no argument it opens on the first.
    gallery.openGallery(2);
});
