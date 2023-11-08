---
title: 'Responsive Image Gallery'
description: 'lightGallery responsive image gallery demo.'
lead:
    "Create beautiful responsive html image gallery with lightGallery. You can provide different images for different screen sizes, resolution or
    devices. Other than it's own mechanism, lightGallery supports HTML5 picture
    tag, srcset and sizes for responsive images."
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu: {demos: {parent: Demos, name: Responsive images}}
weight: 6
toc: true
---

### Demo

For cress browser responsive image support, lightGallery accepts a comma
separated list of images sources, each with a max width descriptor for
displaying different images for different screen sizes. For modern browsers you
can use native srcset and sizes attributes. Please refer the next demo.

{{< image-gallery id="gallery-captions-demo">}}

{{< demoButtons js="https://codepen.io/sachinchoolur/pen/OJpXJda" react="https://stackblitz.com/edit/stackblitz-starters-v7wpeb" >}}

##### HTML Structure

```html
<!-- above 757px default href/data-src will be used -->
<div
    id="responsive-images-demo"
    data-responsive="img/1-375.jpg 375, img/1-480.jpg 480, img/1-757.jpg 757"
    data-src="img/img.jpg"
>
    <a href="img/img1.jpg">
        <img src="img/thumb1.jpg" />
    </a>
    <a
        href="img/img2.jpg"
        data-responsive="img/2-375.jpg 375, img/2-480.jpg 480, img/2-757.jpg 757"
    >
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

##### JavaScript

```js
lightGallery(document.getElementById('responsive-images-demo'));
```

### HTML5 srcset and sizes

You can use native srcset and sizes attributes in lightGallery. Pass srcset and
sizes via data-srcset and data-sizes attributes respectively. lightGallery will
automatically create image with srcset and sizes.

<div class="alert alert-info" role="alert">If you want srcset to be supported for older browser please include <a href="http://caniuse.com/#feat=video" target="_blank">picturefil</a> javascript library in your document.
</div>

lightGallery will automatically call picturefil library if it is available

{{< image-gallery-srcset id="gallery-srcset-demo">}}

<div class="codepen-demo">
    <a target="_blank" href="https://codepen.io/sachinchoolur/pen/BaWzyaE">View on CodePen</a>
</div>

##### HTML Structure

```html
<div id="lg-srcset-demo">
    <a
        href="img/img1.jpg"
        data-srcset="img/1-375.jpg 375w, img/1-480.jpg 480w, img/1-757.jpg 757w"
        data-sizes="(min-width: 40em) 80vw, 100vw"
    >
        <img src="img/thumb1.jpg" />
    </a>
    <a
        href="img/img2.jpg"
        data-srcset="img/2-375.jpg 375w, img/2-480.jpg 480w, img/2-757.jpg 757w"
        data-sizes="(min-width: 40em) 80vw, 100vw"
    >
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

##### JavaScript

```js
lightGallery(document.getElementById('lg-srcset-demo'));
```

### HTML5 picture tag

The `<picture>` tag gives web developers more flexibility in specifying image
resources. lightGallery will construct picture element if `data-sources`
attribute is specified. You can specify sources in the form of an array of
picture source objects.

For example, if you want to construct picture element in lightGallery as shown
bellow,

```html
<picture>
    <source media="(min-width:620px)" srcset="img/image-medium.jpg" />
    <source media="(min-width:480px)" srcset="img/image-small.jpg" />
    <img src="img/image-x-small.jpg" alt="images" />
</picture>
```

You need to use `data-source` (or sources if you are using dynamic mode) as
shown below.

```html
<div>
    <a
        data-src="img/image-x-small.jpg"
        data-sources='[{"srcset": "img/image-medium.jpg", "media":"(min-width:620px)"}, {"srcset": "img/image-small.jpg", "media":"(min-width:480px)"}]'
    >
        <img alt="thumb" src="img/thumb.jpg" />
    </a>
    ...
</div>
```

Similarly you can pass all supported
<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source#attributes" target="_blank">attributes</a>
in the form of an object

If you want to provide `webp` for supported browsers with `jpg` fallback image,
You can use `data-sources` in the following way

```html
<div>
    <a
        data-src="/img/img-1.jpg"
        data-sources='[{"srcset": "/img/img-1.webp", "type":"image/webp"}]'
    >
        <img alt="thumb" src="img/thumb.jpg" />
    </a>
    ...
</div>
```

{{< image-gallery-picture id="gallery-picture-demo">}}

<div class="codepen-demo">
    <a target="_blank" href="https://codepen.io/sachinchoolur/pen/wvJWBOM">View on CodePen</a>
</div>

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
