---
title: 'Dynamic Mode'
description: 'Create dynamic JavaScript galleries with lightGallery.'
lead:
    'LightGallery can be instantiated and launched programmatically by setting
    dynamic option to true and populating dynamicEl option by passing array of
    objects representing the gallery elements. See available dynamic options <a
    href="../../docs/dynamic-variables/">Docs.</a>'
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 9
toc: true
---

<div>
<button type="button" class="btn btn-success" id="dynamic-gallery-demo">Launch
Gallery</button>

<div class="codepen-demo" style="
    display: inline-block;
    margin: 0 10px 0 10px;
">
    <a target="_blank" href="https://codepen.io/sachinchoolur/pen/VwpYagE">View on CodePen</a>
</div>
</div>

##### HTML Structure

```html
<button type="button" id="dynamic-gallery-demo">Open Gallery</button>
```

##### JavaScript

```js
const $dynamicGallery = document.getElementById('dynamic-gallery-demo');
const dynamicGallery = lightGallery($dynamicGallery, {
    dynamic: true,
    dynamicEl: [
        {
            src: 'img/1.jpg',
            thumb: 'img/thumb-1.jpg',
            subHtml: '<h4>Image 1 title</h4><p>Image 1 descriptions.</p>',
        },
        {
            src: 'img/2.jpg',
            thumb: 'img/thumb-2.jpg',
            subHtml: '<h4>Image 2 title</h4><p>Image 2 descriptions.</p>',
        },
        {
            src: 'img/3.jpg',
            thumb: 'img/thumb-3.jpg',
            subHtml: '<h4>Image 3 title</h4><p>Image 3 descriptions.</p>',
        },
    ],
});
$dynamicGallery.addEventListener('click', function () {
    // Starts with third item.(Optional).
    // This is useful if you want use dynamic mode with
    // custom thumbnails (thumbnails outside gallery),
    dynamicGallery.openGallery(2);
});
```
