import lightGallery from 'lightgallery';
import lgVideo from 'lightgallery/plugins/video';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-video.css';
import './demo.css';

lightGallery(document.getElementById('gallery'), {
    plugins: [lgVideo],
});
