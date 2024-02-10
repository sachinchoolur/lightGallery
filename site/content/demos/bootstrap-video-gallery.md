---
title: Bootstrap video gallery
description: Demo of adding lightBox gallery support for Bootstrap with lightGallery
lead:
    Bootstrap is the most popular CSS Framework for developing responsive and mobile-first websites. Bootstrap can be used for creating beautiful video galleries with thumbnails. Here is the demo of adding lightbox gallery support for the Bootstrap.
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu: { demos: { parent: Demos } }
weight: 26
toc: true
---

### Demo

{{< videos-gallery id="gallery-videos-demo" >}}

##### HTML Structure

```html
<div class="row" id="gallery-videos-demo">
    <!-- YouTube Video --->
    <a
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

    <!-- Vimeo Video --->
    <a
        data-lg-size="1280-720"
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

    <!-- Wistia Video --->
    <a
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

    <!-- HTML5 Video --->
    <a
        data-lg-size="1280-720"
        data-video='{"source": [{"src":"/videos/video1.mp4", "type":"video/mp4"}], "tracks": [{"src": "{/videos/title.txt", "kind":"captions", "srclang": "en", "label": "English", "default": "true"}], "attributes": {"preload": false, "playsinline": true, "controls": true}}'
        data-poster="/images/demo/youtube-video-poster.jpg"
        data-sub-html="<h4>'Peck Pocketed' by Kevin Herron | Disney Favorite</h4>"
    >
        <img
            width="300"
            height="100"
            class="img-responsive"
            src="/images/demo/youtube-video-poster.jpg"
        />
    </a>
</div>
```

##### JavaScript

```js
const container = document.querySelector('#bootstrap-image-gallery');
window.lightGallery(container, {
    zoomFromOrigin: true,
    download: true,
});
```
