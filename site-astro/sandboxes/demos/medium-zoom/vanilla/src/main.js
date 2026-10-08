import lightGallery from 'lightgallery';
import lgMediumZoom from 'lightgallery/plugins/mediumZoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-medium-zoom.css';
import './demo.css';
import './article.css';

lightGallery(document.querySelector('.article'), {
    // The images sit between the paragraphs of the article, so tell the
    // gallery which elements are its items.
    selector: '.blog-images',
    plugins: [lgMediumZoom],
});
