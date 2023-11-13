---
title: 'SwiperJs demo'
description:
    'Create thumbnails image gallery with lightGallery and Swiperjs'
lead:
    '<a href="https://swiperjs.com/" target="_blank">SwiperJs</a> is one of the most popular JavaScript carousel/slider.
Swiper can be used for creating beautiful image galleries with thumbnails.
Here is the demo of adding lightbox gallery support for the Swiper carousel.'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 3
toc: true
---


#### Demo
<div class="swiper-lg-wrap">
    <div class="swiper">
    <div class="swiper-wrapper"  id="lg-swipper">
        <a
                data-lg-size="1600-1144"
                class="swiper-slide"
                data-src="https://images.unsplash.com/photo-1476842384041-a57a4f124e2e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
            >
                <img
                    class="img-responsive"
                    src="https://images.unsplash.com/photo-1476842384041-a57a4f124e2e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1200&q=80"
                />
            </a>
            <a
                data-lg-size="1600-1067"
                class="swiper-slide"
                data-src="https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
            >
                <img
                    class="img-responsive"
                    src="https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1200&q=80"
                />
            </a>
            <a
                data-lg-size="1600-1067"
                class="swiper-slide"
                data-src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
            >
                <img
                    class="img-responsive"
                    src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1200&q=80"
                />
            </a>
    </div>
    <!-- If we need navigation buttons -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
    </div>
</div>

{{< demoButtons js="https://codepen.io/sachinchoolur/pen/bGQGMXb" react="https://stackblitz.com/edit/stackblitz-starters-5sp895" >}}

##### HTML Structure

```html
<div class="swiper">
  <div class="swiper-wrapper"  id="lg-swipper">
    <a
        data-lg-size="1600-1200"
        href="img/img1.jpg"
        class="swiper-slide"
    >
        <img src="img/thumb1.jpg" />
    </a>
    <a
        data-lg-size="1600-1200"
        href="img/img2.jpg"
        class="swiper-slide"
    >
        <img src="img/thumb2.jpg" />
    </a>
    ...
  </div>

  <!-- If we need navigation buttons -->
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
</div>
```

##### JavaScript

```js
let $lgSwiper = document.getElementById('lg-swipper');
const swiper = new Swiper('.swiper', {
    // other parameters
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // Init lightGallery ince swiper is initilized
    on: {
        init: function () {
            const lg = lightGallery($lgSwiper);

            // Before closing lightGallery, make sure swiper slide
            // is aligned with the lightGallery active slide
            $lgSwiper.addEventListener('lgBeforeClose', () => {
                swiper.slideTo(lg.index, 0)
            });
        },
    }
});
```

##### CSS (Optional)

```css
.swiper-lg-wrap {
    width: 1200px;
    height: 0;
    padding-bottom: 65%;
    position: relative;
    max-width: 100%;
}
.swiper {
    width: 100%;
    height: 100%;
    position: absolute !important;
}

```
