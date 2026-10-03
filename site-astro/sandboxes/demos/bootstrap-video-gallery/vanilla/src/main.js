import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgVideo from 'lightgallery/plugins/video';

// The grid needs Bootstrap's stylesheet only, none of its JavaScript.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';
import './demo.css';
import './gallery.css';

lightGallery(document.getElementById('bootstrap-video-gallery'), {
    // The thumbnail plugin is optional
    plugins: [lgThumbnail, lgVideo],
});
