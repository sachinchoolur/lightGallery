# Owl Carousel demo with lightbox gallery

> Owl Carousel slider demo with a lightbox gallery on every slide, full-screen images and video, thumbnails and zoom, in a few lines of code.

[Owl Carousel](https://owlcarousel2.github.io/OwlCarousel2/) is a touch enabled jQuery plugin that lets you create a beautiful responsive carousel slider. Owl can be used for creating beautiful image galleries with thumbnails. Here is the demo of adding lightbox gallery support for the Owl Carousel.

Canonical page: https://www.lightgalleryjs.com/demos/owl-carousel-with-lightbox/

#### Demo

##### HTML Structure

```html
<div id="owl-carousel-gallery-demo" class="owl-carousel owl-theme">
    <a data-lg-size="1600-1200" href="img/img1.jpg" class="owl-carousel-item">
        <img src="img/thumb1.jpg" />
    </a>
    <a data-lg-size="1600-1200" href="img/img2.jpg" class="owl-carousel-item">
        <img src="img/thumb2.jpg" />
    </a>
    <!-- more items -->
</div>
```

##### JavaScript

```js
let owl = jQuery('#owl-carousel-gallery-demo');
owl.on('initialized.owl.carousel', function (event) {
    const container = document.querySelector('.owl-stage');
    window.lightGallery(container, {
        pager: false,
        plugins: [
            lgZoom,
            lgAutoplay,
            lgFullscreen,
            lgRotate,
            lgShare,
            lgThumbnail,
        ],
        hash: false,
        preload: 1,
        selector: '.owl-carousel-item',
    });
});
owl.owlCarousel({
    center: true,
    items: 1,
    margin: 20,
});
```

##### SCSS

```scss
.owl-carousel {
    .owl-carousel-item {
        img {
            height: 300px;
        }
    }
}
```
