---
title: Bootstrap image gallery
description: Create beautiful Bootstrap image gallery with light gallery.
lead: Bootstrap is the most popular CSS Framework for developing responsive and mobile-first websites. Here is the demo adding lightBox gallery support for Bootstrap.
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu: { demos: { parent: Demos } }
weight: 24
toc: true
---

### Demo

<div class="row mx-0" id="bootstrap-image-gallery">
    <div class="col-lg-4 col-md-12 mb-4 mb-lg-0 px-2  ">
        <a class="lg-item" data-lg-size="1600-1067"
            data-src="https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80">
            <img src="https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
                class="w-100 shadow-1-strong mb-3" alt="Boat on Calm Water" />
        </a>
        <a class="lg-item" data-lg-size="1600-2400"
            data-src="https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80">
            <img src="https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80"
                class="w-100 shadow-1-strong " alt="Wintry Mountain Landscape" />
        </a>
    </div>
    <div class="col-lg-4 mb-4 mb-lg-0 px-2">
        <a class="lg-item" data-lg-size="1600-2398"
            data-src="https://images.unsplash.com/photo-1526281216101-e55f00f0db7a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80">
            <img src="https://images.unsplash.com/photo-1526281216101-e55f00f0db7a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80"
                class="w-100 shadow-1-strong mb-3" alt="Mountains in the Clouds" />
        </a>
        <a class="lg-item" data-lg-size="1600-1065"
            data-src="https://images.unsplash.com/photo-1596370743446-6a7ef43a36f9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80">
            <img src="https://images.unsplash.com/photo-1596370743446-6a7ef43a36f9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80"
                class=" w-100 shadow-1-strong" alt="Boat on Calm Water" />
        </a>
    </div>
    <div class="col-lg-4 mb-4 mb-lg-0 px-2">
        <a class="lg-item" data-lg-size="1600-1067"
            data-src="https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80">
            <img src="https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80"
                class="w-100 shadow-1-strong mb-3" alt="Waves at Sea" />
        </a>
        <a class="lg-item" data-lg-size="1600-2400"
            data-src="https://images.unsplash.com/photo-1610448721566-47369c768e70?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80">
            <img src="https://images.unsplash.com/photo-1610448721566-47369c768e70?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80"
                class="w-100 shadow-1-strong " alt="Yosemite National Park" />
                </a>
    </div>
</div>

##### HTML Structure

```html

<div class="row mx-0" id="">
    <div class="col-lg-4 col-md-12 mb-4 mb-lg-0 px-2  ">
        <a class="lg-item" data-lg-size="1600-1067"
            data-src="img/img1.jpg">
            <img src="img/thumb1.jpg"
                class="w-100 shadow-1-strong mb-3" alt="Boat on Calm Water" />
        </a>
        <a class="lg-item" data-lg-size="1600-2400"
            data-src="img/img2.jpg">
            <img src="img/thumb2.jpg"
                class="w-100 shadow-1-strong " alt="Wintry Mountain Landscape" />
        </a>
    </div>
    <div class="col-lg-4 mb-4 mb-lg-0 px-2">
        <a class="lg-item" data-lg-size="1600-2398"
            data-src="img/img3.jpg">
            <img src="img/thumb3.jpg"
                class="w-100 shadow-1-strong mb-3" alt="Mountains in the Clouds" />
        </a>
        <a class="lg-item" data-lg-size="1600-1065"
            data-src="img/img4.jpg">
            <img src="img/thumb4.jpg"
                class=" w-100 shadow-1-strong" alt="Boat on Calm Water" />
        </a>
    </div>
</div>
```

##### JavaScript

```js
const container = document.querySelector('#bootstrap-image-gallery');
window.lightGallery(container, {
    selector: '.lg-item',
    plugins: [
        lgZoom,
        lgThumbnail
    ],
});
```
