---
title: Bootstrap video carousel
description:
    'Demo of adding lightBox gallery support for Bootstrap video carousel with lightGallery'
lead:
    'Bootstrap is the most popular CSS Framework for developing responsive and mobile-first websites. Here is the demo adding lightBox gallery support for Bootstrap video carousel.'

date: 2020-10-06T08:48:57.000Z
draft: false
images: []
has_video: true
menu: {demos: {parent: Demos}}
weight: 25
toc: true
---

#### Demo

<div id="bootstrap-video-carousel" class="carousel slide"  data-bs-ride="carousel">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#bootstrap-video-carousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#bootstrap-video-carousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#bootstrap-video-carousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div class="carousel-inner">
      <div class="carousel-item active">
         <a
        data-lg-size="1280-720"
        class="lg-item"
        data-src="//vimeo.com/112836958"
        data-poster="/images/demo/vimeo-video-poster.jpg"
        data-sub-html="<h4>Nature</h4><p>Video by <a target='_blank' href='https://vimeo.com/charliekaye'>Charlie Kaye</a></p>"
    >
       <img
            width="300"
            height="100"
            class="img-responsive"
            src="/images/demo/vimeo-video-poster.jpg"
        />
    </a>
    </div>
    <div class="carousel-item ">
        <a
        class="lg-item"
       data-lg-size="1280-720"
        data-src="//www.youtube.com/watch?v=EIUJfXk3_3w"
        data-poster="https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg"
        data-sub-html="<h4>Puffin Hunts Fish To Feed Puffling | Blue Planet II | BBC Earth</h4><p>On the heels of Planet Earth II's record-breaking Emmy nominations, BBC America presents stunning visual soundscapes from the series' amazing habitats.</p>"
    >
        <img
            width="300"
            height="100"
            class="img-responsive"
            src="https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg"
        />
    </a>
    </div>
    <div class="carousel-item">
        <a
          class="lg-item"
        data-lg-size="1280-720"
        data-src="https://private-sharing.wistia.com/medias/mwhrulrucj"
        data-poster="/images/demo/wistia-video-poster.jpeg"
        data-sub-html="<h4>Thank You!</h4><p> Sample Wistia video </p>"
    >
        <img
            width="300"
            height="100"
            class="img-responsive"
            src="/images/demo/wistia-video-poster.jpeg"
        />
     </a>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#bootstrap-video-carousel" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#bootstrap-video-carousel" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

{{< demoButtons js="https://codepen.io/light-gallery/pen/ZEwqJqX" >}}

##### HTML

```html
<div
    id="bootstrap-video-carousel"
    class="carousel slide"
    data-bs-ride="carousel"
>
    <div class="carousel-indicators">
        <button
            type="button"
            data-bs-target="#bootstrap-video-carousel"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
        ></button>
        <button
            type="button"
            data-bs-target="#bootstrap-video-carousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
        ></button>
    </div>
    <div class="carousel-inner">
        <div class="carousel-item active">
            <a
                data-lg-size="1280-720"
                class="lg-item"
                data-src="//vimeo.com/112836958"
                data-poster="..."
                data-sub-html="..."
            >
                <img
                    width="300"
                    height="100"
                    class="img-responsive"
                    src="/images/demo/vimeo-video-poster.jpg"
                />
            </a>
        </div>
        <div class="carousel-item">
            <a
                class="lg-item"
                data-lg-size="1280-720"
                data-src="https://private-sharing.wistia.com/medias/mwhrulrucj"
                data-poster="..."
                data-sub-html="..."
            >
                <img
                    width="300"
                    height="100"
                    class="img-responsive"
                    src="/images/demo/wistia-video-poster.jpeg"
                />
            </a>
        </div>
    </div>
    <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#bootstrap-video-carousel"
        data-bs-slide="prev"
    >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#bootstrap-video-carousel"
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
let carouselEl = document.getElementById('bootstrap-video-carousel');

// Create a new Bootstrap 5 Carousel instance with specified options
const carousel = new bootstrap.Carousel(carouselEl, {
    interval: 2000,
    wrap: false,
});

// Add an event listener for the 'slide.bs.carousel' event, fires immediately when the slide instance method is invoked.
carouselEl.addEventListener('slide.bs.carousel', (event) => {
    const container = document.querySelector('.carousel-inner');
    window.lightGallery(container, {
        plugins: [lgVideo],
        selector: '.lg-item',
    });
});
```
