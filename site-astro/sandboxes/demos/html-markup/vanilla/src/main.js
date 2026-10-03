import lightGallery from 'lightgallery';

import 'lightgallery/css/lightgallery.css';
import './demo.css';

// The direct children of the element are the slides: each link's href is
// the full-size image. For any other markup, name the items with the
// `selector` setting.
lightGallery(document.getElementById('gallery'));
