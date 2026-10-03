import Carousel from 'bootstrap/js/dist/carousel';
import lightGallery from 'lightgallery';
import lgVideo from 'lightgallery/plugins/video';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-video.css';
import './demo.css';
import './carousel.css';

const carouselEl = document.getElementById('bootstrap-video-carousel');

// The Bootstrap carousel
new Carousel(carouselEl, {
    interval: 2000,
    wrap: false,
});

// One gallery over the carousel items, created once
lightGallery(carouselEl.querySelector('.carousel-inner'), {
    plugins: [lgVideo],
    selector: '.lg-item',
});
