---
title: Mixed contents
description: lightGallery mixed contents demo.
lead: lightGallery supports, images, HTML5 videos, external videos such as YouTube, Vimeo videos and iframes. You can mix all types of supported contents in a same gallery. lightGallery will automatically find the content type from source and create appropriate slides
date: 2020-10-06T08:48:57.000Z
draft: false
images: []
menu: {demos: {parent: Demos}}
weight: 7
toc: true
---

#### Demo

{{< minimal-gallery id="gallery-mixed-content-demo" >}}

##### HTML Structure

```html
<div id="gallery-mixed-content-demo">
    <!-- Image -->

    <a href="img/img1.jpg">
        <img src="img/thumb1.jpg" />
    </a>

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

    <!-- VImeo Video --->
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
        data-video='{"source": [{"src":"/videos/video1.mp4", "type":"video/mp4"}], "attributes": {"preload": false, "controls": true}}'
        data-poster="/images/demo/html5-video-poster.jpg"
        data-sub-html="<h4>'Peck Pocketed' by Kevin Herron | Disney Favorite</h4>"
    >
        <img
            width="300"
            height="100"
            class="img-responsive"
            src="/images/demo/html5-video-poster.jpg"
        />
    </a>
</div>
```

##### JavaScript

```js
lightGallery(document.getElementById('gallery-mixed-content-demo'));
```
