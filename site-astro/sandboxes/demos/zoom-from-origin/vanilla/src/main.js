import lightGallery from 'lightgallery';

import 'lightgallery/css/lightgallery.css';
import './demo.css';

lightGallery(document.getElementById('gallery'), {
    // On by default: the image grows out of the clicked thumbnail and
    // flies back to it on close.
    zoomFromOrigin: true,
});
