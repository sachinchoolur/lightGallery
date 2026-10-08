import lightGallery from 'lightgallery';

import 'lightgallery/css/lightgallery.css';
// Mirrors the gallery controls in a right-to-left gallery.
import 'lightgallery/css/lg-rtl.css';
import './demo.css';

lightGallery(document.getElementById('gallery'), {
    // 'auto' takes the direction from the gallery element, which has
    // dir="rtl" in index.html. Use 'rtl' to force it whatever the markup.
    direction: 'auto',
});
