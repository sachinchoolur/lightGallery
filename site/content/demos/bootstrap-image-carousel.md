---
title: Bootstrap image gallery
description: Create beautiful Bootstrap image gallery with light gallery.
lead: Responsive galleries created with <a href="https://getbootstrap.com/docs/5.2" target="_blank">Bootstrap 5</a>. Image gallery, video gallery, photo gallery, full-page, eCommerce, lightbox, slider, thumbnails, & more.
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu: { demos: { parent: Demos } }
weight: 2
toc: true
---

### Demo

<div class="row mx-0"  id="bootstrap-image-gallery">
  <div class="col-lg-4 col-md-12 mb-4 mb-lg-0 px-2  ">
    <img
      src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp"
      class="lg-item w-100 shadow-1-strong mb-3"
      alt="Boat on Calm Water"
    />
    <img
      src="https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain1.webp"
      class="lg-item w-100 shadow-1-strong "
      alt="Wintry Mountain Landscape"
    />
  </div>
  <div class="col-lg-4 mb-4 mb-lg-0 px-2">
    <img
      src="https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain2.webp"
      class="lg-item w-100 shadow-1-strong mb-3"
      alt="Mountains in the Clouds"
    />
    <img
      src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp"
      class="lg-item w-100 shadow-1-strong"
      alt="Boat on Calm Water"
    />
  </div>
  <div class="col-lg-4 mb-4 mb-lg-0 px-2  ">
    <img
      src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(18).webp"
      class="lg-item w-100 shadow-1-strong mb-3"
      alt="Waves at Sea"
    />
    <img
      src="https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain3.webp"
      class="lg-item w-100 shadow-1-strong "
      alt="Yosemite National Park"
    />
  </div>
</div>

##### HTML Structure

```html
<div class="row" id="bootstrap-image-gallery">
    <div class="col-lg-4 col-md-12 mb-4 mb-lg-0 px-2 ">
        <img
            src="..."
            class="lg-item w-100 shadow-1-strong mb-3"
        />
        <img
            src="..."
            class="lg-item w-100 shadow-1-strong mb-3"
        />
    </div>
    <div class="col-lg-4 mb-4 mb-lg-0 px-2">
        <img
            src="..."
            class="lg-item w-100 shadow-1-strong mb-3"
        />
        <img
            src="..."
            class="lg-item w-100 shadow-1-strong mb-3"
        />
    </div>
    <div class="col-lg-4 mb-4 mb-lg-0 px-2">
        <img
            src="..."
            class="lg-item w-100 shadow-1-strong mb-3"
        />
        <img
            src="..."
            class="lg-item w-100 shadow-1-strong mb-3"
        />
    </div>
</div>
```

##### JavaScript

```js
const container = document.querySelector('#bootstrap-image-gallery');
window.lightGallery(container, {
    selector: '.lg-item',
    zoomFromOrigin: true,
    download: true,
});
```
