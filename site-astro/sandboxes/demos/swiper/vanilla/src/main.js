import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import lightGallery from 'lightgallery';

import 'swiper/css';
import 'swiper/css/navigation';
import 'lightgallery/css/lightgallery.css';
import './demo.css';
import './carousel.css';

const slides = document.getElementById('lg-swiper');

new Swiper('.swiper', {
    modules: [Navigation],
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    on: {
        // Create the gallery once the carousel is ready.
        init(swiper) {
            const gallery = lightGallery(slides);

            // Before the gallery closes, move the carousel to the slide
            // the gallery is showing, so the image closes into its slide.
            slides.addEventListener('lgBeforeClose', () => {
                swiper.slideTo(gallery.index, 0);
            });
        },
    },
});
