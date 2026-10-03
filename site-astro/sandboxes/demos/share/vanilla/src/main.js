import lightGallery from 'lightgallery';
import lgShare from 'lightgallery/plugins/share';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-share.css';
import './demo.css';

// Adds a share button to the toolbar. It lists Facebook, X and Pinterest;
// on touch devices it opens the device's share sheet first. Set
// preferNativeShare to true or false to choose one for every device.
lightGallery(document.getElementById('gallery'), {
    plugins: [lgShare],
});
