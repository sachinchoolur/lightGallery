import lightGallery from 'lightgallery';
import lgRotate from 'lightgallery/plugins/rotate';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-rotate.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import './demo.css';

lightGallery(document.getElementById('gallery'), {
    plugins: [lgZoom, lgRotate, lgThumbnail],
    // Zoom in and zoom out buttons next to the actual-size button; the
    // library shows only actual size by default.
    showZoomInOutIcons: true,
    actualSize: true,
    // How much each zoom-in or zoom-out step changes the scale.
    scale: 1,
});
