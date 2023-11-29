---
title: 'Owl carousel demo'
description: 'Create image gallery with lightGallery and Owl Carousel JS'
lead:
    In this demonstration, we showcase the seamless integration of LightGallery
    with Owl Carousel JS, providing a captivating solution for creating dynamic
    image galleries. With Owl Carousel's intuitive features and responsive
    design, users can enjoy a smooth and visually appealing carousel experience.
    LightGallery complements this by adding a sophisticated lightbox effect,
    allowing users to view images in a larger, more immersive format
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 4
toc: true
---

#### Demo

{{< owl-carousel-gallery id="owl-carousel-gallery-demo" >}}
{{< demoButtons js="https://codepen.io/Mohammed-Ajmal-the-decoder/pen/rNPZMqK" >}}

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
        plugins: [],
        hash: false,
        preload: 4,
        selector: '.owl-carousel-item',

    });
});
owl.owlCarousel({
    center: true,
    items: 1,
    loop: true,
    margin: 20,
});
```

##### SCSS

```css
.owl-carousel {
  .owl-stage {
    display: flex;
    flex-wrap: wrap;
  }
  .owl-carousel-item {
    img {
      width: 100%;
      height: auto;
      max-width: 100%;
      height: 300px;
    }
  }
}
```
