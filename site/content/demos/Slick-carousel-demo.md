---
title: 'Slick carousel demo'
description:
    'Add lightBox gallery support for Slick carousel with lightGallery'
lead:
    '<a href="https://kenwheeler.github.io/slick/" target="_blank">Slick</a> is a jQuery plugin for creating versatile and responsive content sliders..
Slick can be used for creating beautiful image galleries with thumbnails.
Here is the demo of adding lightbox gallery support for the Slick carousel.'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 28
toc: true
---

#### Demo

{{< owl-carousel-gallery id="slick-carousel-gallery-demo" >}} {{< demoButtons
    js="https://codepen.io/light-gallery/pen/GRzXYgZ"
    react="https://stackblitz.com/edit/stackblitz-starters-a7gtex?file=src%2FApp.tsx"
    >}}

##### HTML Structure

```html
<div id="slick-carousel-gallery-demo" class="carousel">
    <a data-lg-size="1600-1200" href="img/img1.jpg" class="lg-item">
        <img src="img/thumb1.jpg" />
    </a>
    <a data-lg-size="1600-1200" href="img/img2.jpg" class="lg-item">
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

##### Javascript

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
    $slickDemo.slick({,
        slidesToShow: 3,
    });
}
```

##### SCSS (Optional)

```css
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
