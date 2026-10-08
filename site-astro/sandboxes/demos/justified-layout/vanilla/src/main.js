import lightGallery from 'lightgallery';
import lgJustified from 'lightgallery/plugins/justified';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-justified.css';
import './demo.css';

// The plugin lays the thumbnails out in rows of equal height that fill
// the width of the gallery element.
lightGallery(document.getElementById('gallery'), {
    plugins: [lgJustified],
});
