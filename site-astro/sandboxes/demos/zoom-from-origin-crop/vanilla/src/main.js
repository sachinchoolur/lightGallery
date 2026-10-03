import lightGallery from 'lightgallery';
import lgOriginCrop from 'lightgallery/plugins/originCrop';

import 'lightgallery/css/lightgallery.css';
import './demo.css';
import './tiles.css';

// The tiles are square and crop every photo with object-fit: cover. The
// origin crop plugin flies the part of the photo a tile shows and reveals
// the rest around it; without the plugin the whole photo would be
// squashed into the tile. It reads the tile's object-fit and
// object-position, nothing is needed in the markup.
lightGallery(document.getElementById('gallery'), {
    plugins: [lgOriginCrop],
});
