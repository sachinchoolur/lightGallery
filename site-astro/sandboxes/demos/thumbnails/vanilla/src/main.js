import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import './demo.css';

lightGallery(document.getElementById('gallery'), {
    plugins: [lgThumbnail],
    thumbnail: true,
});
