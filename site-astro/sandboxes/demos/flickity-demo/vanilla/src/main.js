import Flickity from 'flickity';
import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import 'flickity/css/flickity.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import './demo.css';
import './carousel.css';

const carousel = document.getElementById('flickity-carousel');

// True from the start of a drag until the click that ends it.
let dragged = false;

new Flickity(carousel, {
    cellAlign: 'center',
    pageDots: false,
    contain: true,
    autoPlay: true,
    on: {
        // Flickity moves the cells into its own slider element. Create
        // the gallery on that element once the carousel is ready.
        ready() {
            lightGallery(document.querySelector('.flickity-slider'), {
                plugins: [lgZoom, lgThumbnail],
                selector: '.carousel-cell',
            });
        },
        pointerDown() {
            dragged = false;
        },
        dragStart() {
            dragged = true;
        },
    },
});

// Letting go of a drag also clicks the cell under the pointer. Stop that
// click before it reaches the cell, so only a plain click opens the gallery.
carousel.addEventListener(
    'click',
    (event) => {
        if (dragged) {
            dragged = false;
            event.preventDefault();
            event.stopPropagation();
        }
    },
    true,
);
