// Opens a post's figures (BlogFigure, `figure.blog-images`) in a lightbox
// with the Medium-style zoom: the image grows in place, no chrome. Loaded
// by BlogFigure itself, so a post without figures never loads it, and a
// post with several loads it once.
import lightGallery from 'lightgallery';
import lgMediumZoom from 'lightgallery/plugins/mediumZoom';

import { SITE_LICENSE_KEY } from '../lib/license';

const wrapper = document.querySelector('.blog-wrapper');
if (wrapper && !wrapper.hasAttribute('data-lg-figures')) {
    wrapper.setAttribute('data-lg-figures', '');
    lightGallery.setLicenseKey(SITE_LICENSE_KEY);
    lightGallery(wrapper, {
        selector: '.blog-images',
        getCaptionFromTitleOrAlt: false,
        backgroundColor: '#FFF',
        plugins: [lgMediumZoom],
    });
}
