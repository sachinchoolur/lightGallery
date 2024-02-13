---
title: 'Owl carousel demo'
description: 'Add lightBox gallery support for Owl Carousel with lightGallery'
lead:  '<a href="https://owlcarousel2.github.io/OwlCarousel2/" target="_blank">Owl Carousel</a> is a touch enabled jQuery plugin that lets you create a beautiful responsive carousel slider.
Owl can be used for creating beautiful image galleries with thumbnails.
Here is the demo of adding lightbox gallery support for the Owl Carousel.'

date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 27
toc: true
---

#### Demo

{{< owl-carousel-gallery id="owl-carousel-gallery-demo" >}}
{{< demoButtons js="https://codepen.io/light-gallery/pen/rNPZMqK" >}}

##### HTML Structure

```html
<div id="owl-carousel-gallery-demo" class="owl-carousel owl-theme">
    <a data-lg-size="1600-1200" href="img/img1.jpg" class="owl-carousel-item">
        <img src="img/thumb1.jpg" />
    </a>
    <a data-lg-size="1600-1200" href="img/img2.jpg" class="owl-carousel-item">
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

##### Javascript

```js
let owl = jQuery('#owl-carousel-gallery-demo');
owl.on('initialized.owl.carousel', function (event) {
    const container = document.querySelector('.owl-stage');
    window.lightGallery(container, {
        thumbnail: false,
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

```css
.owl-carousel {
    .owl-carousel-item {
        img {
            height: 300px;
        }
    }
}
```
