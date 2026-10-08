import lightGallery from 'lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import './demo.css';

// The captions come from the data-sub-html attributes in index.html.
lightGallery(document.getElementById('gallery'), {
    plugins: [lgZoom],
});
