# Slick slider demo with lightbox gallery

> Slick slider demo with a lightbox gallery on every slide, click a slide to open it full-screen, with thumbnails, zoom and video support.

[Slick](https://kenwheeler.github.io/slick/) is a jQuery plugin for creating versatile and responsive content sliders. Slick can be used for creating beautiful image galleries with thumbnails. Here is the demo of adding lightbox gallery support for the Slick carousel.

Canonical page: https://www.lightgalleryjs.com/demos/slick-carousel-demo/

#### Demo

 

##### HTML Structure

```html
<div id="slick-carousel-gallery-demo" class="carousel">
    <a data-lg-size="1600-1200" href="img/img1.jpg" class="lg-item">
        <img src="img/thumb1.jpg" />
    </a>
    <a data-lg-size="1600-1200" href="img/img2.jpg" class="lg-item">
        <img src="img/thumb2.jpg" />
    </a>
    <!-- more items -->
</div>
```

##### JavaScript

```js
let slickEl = document.getElementById('slick-carousel-gallery-demo');
if (slickEl) {
    var $slickDemo = $('#slick-carousel-gallery-demo');
    $slickDemo.on('init', function (event, slick, direction) {
        const container = document.querySelector('.slick-track');
        window.lightGallery(container, {
            plugins: [
                lgZoom,
                lgThumbnail,
            ],
            preload: 4,
        });
    });
    $slickDemo.slick({
        slidesToShow: 3,
    });
}
```

##### SCSS (Optional)

```scss
.carousel {
    .slick-prev,
    .slick-next {
        padding: 10px;
        position: absolute;
        top: 50%;
        z-index: 1;
        cursor: pointer;
        zoom: 2;
    }
    .slick-prev {
        left: -8px;
    }
    .slick-next {
        right: 12px;
    }
}
```
