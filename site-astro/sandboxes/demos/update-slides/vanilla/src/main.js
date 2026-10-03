import lightGallery from 'lightgallery';

import 'lightgallery/css/lightgallery.css';
import './demo.css';

const galleryElement = document.getElementById('gallery');

let added = 0;
// True when the thumbnails on the page changed while the gallery was open.
let thumbnailsChanged = false;

function addSlide() {
    added += 1;
    const src = `https://picsum.photos/seed/lg-added-${added}/1600/1067`;
    const thumb = `https://picsum.photos/seed/lg-added-${added}/360/240`;
    const alt = `Added photo ${added}`;

    // Always pass a new list; do not change lg.galleryItems itself. The
    // second argument is the slide to stay on.
    lg.updateSlides(
        [...lg.galleryItems, { src, thumb, subHtml: alt }],
        lg.index,
    );

    // The thumbnails on the page are yours to update.
    galleryElement.insertAdjacentHTML(
        'beforeend',
        `<a href="${src}" data-lg-size="1600-1067">
            <img src="${thumb}" alt="${alt}" />
        </a>`,
    );
    thumbnailsChanged = true;
}

function removeFirstSlide() {
    if (lg.galleryItems.length === 1) {
        return;
    }
    lg.updateSlides(lg.galleryItems.slice(1), lg.index);

    galleryElement.firstElementChild.remove();
    thumbnailsChanged = true;
}

// lgInit fires once, when the gallery markup is created: add the buttons
// to the toolbar there.
galleryElement.addEventListener('lgInit', (event) => {
    const toolbar = event.detail.instance.outer
        .get()
        .querySelector('.lg-toolbar');

    toolbar.insertAdjacentHTML(
        'beforeend',
        `<button
            type="button"
            id="remove-slide"
            class="lg-icon"
            aria-label="Remove the first slide"
        >
            −
        </button>
        <button
            type="button"
            id="add-slide"
            class="lg-icon"
            aria-label="Add a slide"
        >
            +
        </button>`,
    );
    toolbar
        .querySelector('#remove-slide')
        .addEventListener('click', removeFirstSlide);
    toolbar.querySelector('#add-slide').addEventListener('click', addSlide);
});

// Once the gallery is closed, refresh() picks up the changed thumbnails.
galleryElement.addEventListener('lgAfterClose', () => {
    if (thumbnailsChanged) {
        lg.refresh();
        thumbnailsChanged = false;
    }
});

const lg = lightGallery(galleryElement);
