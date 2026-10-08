import lightGallery from 'lightgallery';

import 'lightgallery/css/lightgallery.css';
import './demo.css';

// selector: 'this' makes the button itself the gallery's only slide.
lightGallery(document.getElementById('open-website'), {
    selector: 'this',
});
lightGallery(document.getElementById('open-map'), {
    selector: 'this',
});
lightGallery(document.getElementById('open-pdf'), {
    selector: 'this',
});
