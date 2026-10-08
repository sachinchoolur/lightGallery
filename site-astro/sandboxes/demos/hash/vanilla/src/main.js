import lightGallery from 'lightgallery';
import lgHash from 'lightgallery/plugins/hash';

import 'lightgallery/css/lightgallery.css';
import './demo.css';

lightGallery(document.getElementById('gallery'), {
    plugins: [lgHash],
    // The id in the URL: #lg=1&slide=2. Give each gallery on a page its own.
    galleryId: '1',
    // 'auto' uses the Navigation API where the browser has it and the
    // History API everywhere else.
    hashDriver: 'auto',
});
