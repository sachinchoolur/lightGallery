import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

// The grid needs Bootstrap's stylesheet only, none of its JavaScript.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import './demo.css';

// The links sit inside the grid columns, so `selector` names them.
lightGallery(document.getElementById('bootstrap-image-gallery'), {
    selector: '.lg-item',
    plugins: [lgZoom, lgThumbnail],
});
