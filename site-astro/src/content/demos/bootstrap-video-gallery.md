---
title: Bootstrap video gallery
description:
    Demo of adding lightBox gallery support for Bootstrap with lightGallery
lead:
    Bootstrap is the most popular CSS Framework for developing responsive and
    mobile-first websites. Bootstrap can be used for creating beautiful video
    galleries with thumbnails. Here is the demo of adding lightbox gallery
    support for the Bootstrap.
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
has_video: true
menu: { demos: { parent: Demos } }
weight: 26
toc: true
---

### Demo

{{< bootstrap-videos-gallery id="bootstrap-video-gallery" >}}

##### HTML Structure

```html
<div class="container">
    <div class="row mx-0" id="{{$id}}">
        <a
            class="col-md-6 col-sm-6 px-0"
            data-lg-size="1280-720"
            data-src="//www.youtube.com/watch?v=EIUJfXk3_3w"
            data-poster="https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg"
            data-sub-html="..."
        >
            <img
                class="img-fluid"
                src="https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg"
            />
        </a>
        <a
            class="col-md-6 col-sm-6 px-0"
            data-lg-size="1280-720"
            data-src="//vimeo.com/112836958"
            data-poster="..."
            data-sub-html="..."
        >
            <img class="img-fluid" src="..." />
        </a>
    </div>
</div>
```

##### JavaScript

```js
window.lightGallery(document.getElementById('bootstrap-video-gallery'), {
    // Optional thumbnail plugin
    plugins: [lgThumbnail, lgVideo],
});
```
