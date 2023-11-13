---
title: 'Hash'
description:
    'lightGallery hash plugin lets you to provide unique url for each gallery
    slides.'
lead:
    'lightGallery hash plugin allows you create unique url for each gallery
    images. You can provide custom names for each slides too. If you have
    multiple galleries on a page, you have to provide unique id for each gallery
    via galleryId setting.'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 5
toc: true
---

#### Demo

{{< image-gallery id="gallery-hash-demo">}}

{{< demoButtons react="https://stackblitz.com/edit/stackblitz-starters-fz6ajn" >}}

##### HTML Structure

```html
<div id="gallery-hash-demo">
    <a href="img/img1.jpg">
        <img src="img/thumb1.jpg" />
    </a>
    <a href="img/img2.jpg">
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

##### JavaScript

```js
lightGallery(document.getElementById('gallery-hash-demo'));

// if You have multiple galleries on same page you have to set unique id for each gallery.
/*
lightGallery(document.getElementById('gallery-hash-demo-2'), {
    galleryId: 2
});
lightGallery(document.getElementById('gallery-hash-demo-3'), {
    galleryId: 3
});
*/
```

#### Custom slide name

You can provide custom slide names for each slide by providing slide name via
`data-slide-name` attribute or `slideName` if you are using dynamic mode.

{{< image-gallery id="gallery-custom-hash-demo">}}

##### HTML Structure

```html
<div id="gallery-hash-demo">
    <a href="img/img1.jpg" data-slide-name="fading-light">
        <img src="img/thumb1.jpg" />
    </a>
    <a href="img/img2.jpg" data-slide-name="Bowness Bay">
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

##### JavaScript

```js
lightGallery(document.getElementById('gallery-hash-demo'), {
    customSlideName: true,
});
```
