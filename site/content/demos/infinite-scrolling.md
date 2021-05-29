---
title: 'Infinite scrolling'
description: 'Javascript gallery with infinite scrolling.'
lead:
    'Infinite scrolling is a web-design technique that loads content
    continuously as the user scrolls down the page, eliminating the need for
    pagination. Let`s see how we can implement infinite scrolling with
    lightGallery'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 16
toc: true
---

### HTML Structure

```html
<div id="infinite-scroll-gallery">
    <a href="img/img1.jpg">
        <img src="img/thumb1.jpg" />
    </a>
    <a href="img/img2.jpg">
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

### Javascript

```js
const $infiniteScrollGallery = document.getElementById(
    'infinite-scroll-gallery',
);
const lg = lightGallery($infiniteScrollGallery, {
    speed: 500,
});
```

Since, we are already using jQuery on this website, let's make use of jQuery to
find out when user scrolls till the bottom of the page. Or if you prefer, you
can use any of the JavaScript infinite scrolling plugin.

```js
const $window = $(window);
$window.scroll(function () {
    if ($window.scrollTop() >= $(document).height() - $window.height() - 10) {
        // User scrolled till the bottom the page
    }
});
```

Then, append thumbnails to the existing gallery.

```js
const thumbnails = `
    <a href="img/img1.jpg">
        <img src="img/thumb1.jpg" />
    </a>
    <a href="img/img2.jpg">
        <img src="img/thumb2.jpg" />
    </a>
    `;
$('#infinite-scroll-gallery').append(thumbnails);
```

Finally, you need to destroy the current lightGallery instance and re-initiate
lightGallery

```js
lg.destroy();
setTimeout(() => {
    lg = lightGallery($infiniteScrollGallery, {
        speed: 500,
    });
}, 500);
```

That's it. Here the full example

```js
const $infiniteScrollGallery = document.getElementById(
    'infinite-scroll-gallery',
);
let infiniteScrollingGallery = lightGallery($infiniteScrollGallery, {
    speed: 500,
});

const thumbnails = `
    <a href="img/img3.jpg">
        <img src="img/thumb3.jpg" />
    </a>
    <a href="img/img4.jpg">
        <img src="img/thumb4.jpg" />
    </a>
    `;

const $window = $(window);
let shouldReInit = true;
$window.scroll(function () {
    if ($window.scrollTop() >= $(document).height() - $window.height() - 10) {
        $('#infinite-scroll-gallery').append(images);
        infiniteScrollingGallery.refresh();
    }
});
```

### Infinite scrolling

<div class="infinite-scroll-gallery" id="infinite-scroll-gallery">
    <a data-lg-size="1600-1067" class="gallery-item"
            data-src="https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
            data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@tobbes_rd' >Tobias Rademacher </a></h4><p> Location - <a href='https://unsplash.com/s/photos/puezgruppe%2C-wolkenstein-in-gr%C3%B6den%2C-s%C3%BCdtirol%2C-italien'>Puezgruppe, Wolkenstein in Gröden, Südtirol, Italien</a>layers of blue.</p>">
            <img alt="layers of blue." class="img-responsive"
                src="https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80" />
        </a>
        <a data-lg-size="1600-2400" data-pinterest-text="Pin it2" data-tweet-text="lightGallery slide  2"
            class="gallery-item"
            data-src="https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
            data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@therawhunter' >Massimiliano Morosinotto </a></h4><p> Location - <a href='https://unsplash.com/s/photos/tre-cime-di-lavaredo%2C-italia'>Tre Cime di Lavaredo, Italia</a>This is the Way</p>">
            <img class="img-responsive"
                src="https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80" />
        </a>
        <a data-lg-size="1600-2400" data-pinterest-text="Pin it3" data-tweet-text="lightGallery slide  4"
            class="gallery-item"
            data-src="https://images.unsplash.com/photo-1605973029521-8154da591bd7?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
            data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@thesaboo' >Sascha Bosshard </a></h4><p> Location - <a href='https://unsplash.com/s/photos/pizol%2C-mels%2C-schweiz'>Pizol, Mels, Schweiz</a></p>">
            <img class="img-responsive"
                src="https://images.unsplash.com/photo-1605973029521-8154da591bd7?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80" />
        </a>
        <a data-lg-size="1600-2398" data-pinterest-text="Pin it3" data-tweet-text="lightGallery slide  4"
            class="gallery-item"
            data-src="https://images.unsplash.com/photo-1526281216101-e55f00f0db7a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1600&q=80"
            data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@yusufevli' >Yusuf Evli </a></h4><p> Foggy Road</p>">
            <img class="img-responsive"
                src="https://images.unsplash.com/photo-1526281216101-e55f00f0db7a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80" />
    </a>
</div>
