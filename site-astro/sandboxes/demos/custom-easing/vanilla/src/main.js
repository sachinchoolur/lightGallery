import lightGallery from 'lightgallery';

import 'lightgallery/css/lightgallery.css';
import './demo.css';

lightGallery(document.getElementById('gallery'), {
    // Any CSS timing function.
    easing: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
    // Slower than the default 400, so the curve is easy to see.
    speed: 1000,
});
