---
title: 'Bootstrap image gallery with lightbox'
description: 'Bootstrap image gallery demo with a full-screen lightbox, responsive grid markup, thumbnails, zoom and captions, and no jQuery required.'
lead: Bootstrap is the most popular CSS Framework for developing responsive and mobile-first websites. Here is the demo adding lightBox gallery support for Bootstrap.
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu: { demos: { parent: 'Demos', name: 'Bootstrap image gallery' } }
weight: 24
toc: true
---

### Demo

<div class="row mx-0" id="bootstrap-image-gallery">
    <div class="col-lg-4 col-md-12 mb-4 mb-lg-0 px-2">
        <a class="lg-item" data-lg-size="1600-1067"
            data-src="/img/photos/morocco/01-1600.avif"
            data-sub-html="<h4>Blue and white painted houses on the cliff</h4><p>Photo by <a href='https://unsplash.com/photos/NncAbldgViA'>Pretty Pink</a> on <a href='https://unsplash.com'>Unsplash</a></p>">
            <img src="/img/photos/morocco/01-480.avif"
                class="w-100 shadow-1-strong mb-3" alt="blue and white painted houses on the cliff" />
        </a>
        <a class="lg-item" data-lg-size="1600-1071"
            data-src="/img/photos/morocco/02-1600.avif"
            data-sub-html="<h4>Concrete houses surrounded by trees</h4><p>Photo by <a href='https://unsplash.com/photos/i-P1lmY_e1w'>Sergey Pesterev</a> on <a href='https://unsplash.com'>Unsplash</a></p>">
            <img src="/img/photos/morocco/02-480.avif"
                class="w-100 shadow-1-strong" alt="concrete houses surrounded by trees" />
        </a>
    </div>
    <div class="col-lg-4 mb-4 mb-lg-0 px-2">
        <a class="lg-item" data-lg-size="1600-2133"
            data-src="/img/photos/morocco/03-1600.avif"
            data-sub-html="<h4>Blue stairs in Chefchaouen market</h4><p>Photo by <a href='https://unsplash.com/photos/CBfUGtVP0QE'>Mohammed</a> on <a href='https://unsplash.com'>Unsplash</a></p>">
            <img src="/img/photos/morocco/03-480.avif"
                class="w-100 shadow-1-strong mb-3" alt="blue stairs in Chefchaouen market" />
        </a>
        <a class="lg-item" data-lg-size="1600-1200"
            data-src="/img/photos/morocco/04-1600.avif"
            data-sub-html="<h4>Boats docked near houses</h4><p>Photo by <a href='https://unsplash.com/photos/aqJfoLKFz6c'>Louis Hansel</a> on <a href='https://unsplash.com'>Unsplash</a></p>">
            <img src="/img/photos/morocco/04-480.avif"
                class="w-100 shadow-1-strong" alt="boats docked near houses" />
        </a>
    </div>
    <div class="col-lg-4 mb-4 mb-lg-0 px-2">
        <a class="lg-item" data-lg-size="1600-1067"
            data-src="/img/photos/morocco/05-1600.avif"
            data-sub-html="<h4>Textiles hanged beside concrete buildings</h4><p>Photo by <a href='https://unsplash.com/photos/LhVJaRPweJc'>Frida Aguilar Estrada</a> on <a href='https://unsplash.com'>Unsplash</a></p>">
            <img src="/img/photos/morocco/05-480.avif"
                class="w-100 shadow-1-strong mb-3" alt="textiles hanged beside concrete buildings" />
        </a>
        <a class="lg-item" data-lg-size="1600-1067"
            data-src="/img/photos/morocco/06-1600.avif"
            data-sub-html="<h4>Bird's eye view of town</h4><p>Photo by <a href='https://unsplash.com/photos/pcbSQTQr2-I'>Toa Heftiba</a> on <a href='https://unsplash.com'>Unsplash</a></p>">
            <img src="/img/photos/morocco/06-480.avif"
                class="w-100 shadow-1-strong" alt="bird's eye view of town" />
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
