import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgVideo from 'lightgallery/plugins/video';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';
import './demo.css';

// Images and iframes work without a plugin; video slides need lgVideo.
lightGallery(document.getElementById('gallery'), {
    plugins: [lgThumbnail, lgVideo],
});
