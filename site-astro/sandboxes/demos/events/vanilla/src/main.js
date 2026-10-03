import lightGallery from 'lightgallery';

import 'lightgallery/css/lightgallery.css';
import './demo.css';
import './events.css';

const colours = ['#6a7583', '#1e304b', '#315460', '#080607'];
const gallery = document.getElementById('gallery');

// Events fire on the gallery element. Add the listeners before starting
// lightGallery. This one changes the backdrop color on every slide change.
gallery.addEventListener('lgBeforeSlide', (event) => {
    const { index } = event.detail;
    document.querySelector('.lg-backdrop').style.backgroundColor =
        colours[index % colours.length];
});

lightGallery(gallery, {
    // A class on the gallery container, used by events.css.
    addClass: 'lg-events-demo-outer',
});
