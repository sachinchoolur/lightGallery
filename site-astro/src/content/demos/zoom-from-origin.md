---
title: 'Zoom image from origin'
description:
    "Create image gallery with zoom effect from image's origin while opening the image gallery"
lead:
    'Zoom images from its origin while opening the image gallery.'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 20
toc: true
---

You need to know the original image size upfront and provide it via data-lg-size attribute as data-lg-size="1920-1280"

If you don't know, the size of a few images in the list, you can skip the data-lg-size attribute for the particular slides,
lightGallery will show the default animation if data-lg-size is not available


#### Demo

{{< image-gallery id="gallery-zoom-from-origin-demo">}}

{{< demoButtons
   js="https://codepen.io/sachinchoolur/pen/GRWZbRv"
   react="https://stackblitz.com/edit/stackblitz-starters-cva7eb" >}}

##### HTML Structure

```html
<div id="lg-share-demo">
    <a
        data-lg-size="1600-1067"
        href="img/img1.jpg"
    >
        <img src="img/thumb1.jpg" />
    </a>
    <a
        data-lg-size="1600-1067"
        href="img/img2.jpg"
    >
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

##### JavaScript

```js
lightGallery(document.getElementById('gallery-zoom-from-origin-demo'));
```


### Using zoomFromOrigin with responsive images



If you want to use `zoomFromOrigin` option with responsive images, You can
provide specific `lg-size` values for specific screen size by providing a comma
separated list of sizes combined with a max-width (up to what size the
particular image should be used)

For example, if you have similar html structure,

```html
<div>
    <a
        data-lg-size="240-160-375, 400-267-480, 1600-1067"
        data-responsive="/img/img-240.jpg 375, /img/img-400.jpg 480"
        data-src="/img/img-1600.jpg"
    >
        <img alt="thumb" src="img/thumb.jpg" />
    </a>
    ...
</div>
```

Up to `375` width, `img.240.jpg` and `lg-size` `240-160` will be used.
Similarly, up to `480` pixel width, size `400-267` and `img-400.jpg` will be
used. And above `480`, `lg-size` `1600-1067` and `img-1600.jpg` will be used

{{< image-gallery id="gallery-captions-demo">}}

<div class="codepen-demo">
    <a target="_blank" href="https://codepen.io/sachinchoolur/pen/OJpXJda">View on CodePen</a>
</div>
