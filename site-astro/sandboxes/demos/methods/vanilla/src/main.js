import lightGallery from 'lightgallery';

import 'lightgallery/css/lightgallery.css';
import './demo.css';
import './methods.css';

const galleryElement = document.getElementById('gallery');

// lgInit fires once, when the gallery markup is created. Add custom
// buttons to it and call the gallery's methods from them.
galleryElement.addEventListener('lgInit', (event) => {
    const lg = event.detail.instance;
    const content = lg.outer.get().querySelector('.lg-content');

    content.insertAdjacentHTML(
        'beforeend',
        `<div class="gallery-nav">
            <button type="button" id="prev-slide">Previous</button>
            <button type="button" id="next-slide">Next</button>
            <button type="button" id="close-gallery">Close</button>
        </div>`,
    );
    content
        .querySelector('#prev-slide')
        .addEventListener('click', () => lg.goToPrevSlide());
    content
        .querySelector('#next-slide')
        .addEventListener('click', () => lg.goToNextSlide());
    content
        .querySelector('#close-gallery')
        .addEventListener('click', () => lg.closeGallery());
});

const gallery = lightGallery(galleryElement, {
    // Hide the built-in previous and next buttons.
    controls: false,
});

document.getElementById('open-third').addEventListener('click', () => {
    gallery.openGallery(2);
});
