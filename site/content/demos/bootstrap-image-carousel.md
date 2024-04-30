---
title: Bootstrap carousel with lightBox gallery
description:
    'Demo of adding lightBox gallery support for Bootstrap carousel with lightGallery'
lead:
    'Bootstrap is the most popular CSS Framework for developing responsive and mobile-first websites. Bootstrap can be used for creating beautiful image galleries with thumbnails. Here is the demo of adding lightbox gallery support for the Bootstrap.'

date: 2020-10-06T08:48:57.000Z
draft: false
images: []
menu: {
    demos: {
            parent: Demos,
            name: Bootstrap carousel gallery
        }
    }
weight: 4
toc: true
---

#### Demo

<div id="bootstrap-gallery-carousel" class="carousel slide"  data-bs-ride="carousel">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#bootstrap-gallery-carousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#bootstrap-gallery-carousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#bootstrap-gallery-carousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">
        <a
        data-lg-size="1600-1144"
        class="lg-item"
        data-src="https://images.unsplash.com/photo-1476842384041-a57a4f124e2e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
    >
        <img
            class="img-responsive"
            src="https://images.unsplash.com/photo-1476842384041-a57a4f124e2e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1200&q=80"
        />
    </a>
    </div>
    <div class="carousel-item">
         <a
        data-lg-size="1600-1067"
        class="lg-item"
        data-src="https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
    >
        <img
            class="img-responsive"
            src="https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1200&q=80"
        />
    </a>
    </div>
    <div class="carousel-item">
         <a
        data-lg-size="1600-1067"
        class="lg-item"
        data-src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
    >
        <img
            class="img-responsive"
            src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1200&q=80"
        />
     </a>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#bootstrap-gallery-carousel" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#bootstrap-gallery-carousel" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

{{< demoButtons js="https://codepen.io/light-gallery/pen/ZEwqJqX" >}}

##### HTML

```html
<div id="bootstrap-gallery-carousel" class="carousel slide">
    <div class="carousel-inner">
        <div class="carousel-item active">
            <img src="..." class="d-block w-100" alt="..." />
        </div>
        <div class="carousel-item">
            <img src="..." class="d-block w-100" alt="..." />
        </div>
        <div class="carousel-item">
            <img src="..." class="d-block w-100" alt="..." />
        </div>
    </div>
    <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#bootstrap-gallery-carousel"
        data-bs-slide="prev"
    >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#bootstrap-gallery-carousel"
        data-bs-slide="next"
    >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
</div>
```

##### JavaScript

```js
// Get the carousel element by its ID
let carouselEl = document.getElementById('bootstrap-gallery-carousel');

// Create a new Bootstrap 5 Carousel instance with specified options
const carousel = new bootstrap.Carousel(carouselEl, {
    interval: 2000,
    wrap: false,
});

// Add an event listener for the 'slide.bs.carousel' event, fires immediately when the slide instance method is invoked.
carouselEl.addEventListener('slide.bs.carousel', (event) => {
    const container = document.querySelector('.carousel-inner');
    window.lightGallery(container, {
        plugins: [lgThumbnail],
        selector: '.lg-item',
    });
});
```

##### CSS (Optional)

```css
.carousel-item {
    .lg-item > img {
        height: 600px;
    }
}
```
