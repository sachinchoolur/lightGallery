import lightGallery from 'lightgallery';

import 'lightgallery/css/lightgallery.css';
// Every mode other than lg-slide and lg-fade needs this stylesheet.
import 'lightgallery/css/lg-transitions.css';
import './demo.css';

lightGallery(document.getElementById('gallery'), {
    // Try 'lg-zoom-in', 'lg-slide-vertical', 'lg-rotate' or 'lg-tube'.
    mode: 'lg-fade',
});
