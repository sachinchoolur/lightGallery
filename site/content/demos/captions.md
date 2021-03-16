---
title: 'Captions'
description: 'lightGallery captions demo.'
lead:
    'You can directly pass image caption html via data-sub-html attribute or
    just pass id or class name of any html object (div) which contains your
    cation html.'
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 16
toc: true
---

#### Demo

{{< image-gallery id="gallery-captions-demo">}}

##### HTML Structure

```html
<div id="caption2" style="display:none">
    <h4>Bowness Bay</h4>
    <p>
        A beautiful Sunrise this morning taken En-route to Keswick not one as
        planned but I'm extremely happy I was passing the right place at the
        right time....
    </p>
</div>
<div class="caption3" style="display:none">
    <h4>Sunset Serenity</h4>
    <p>A gorgeous Sunset tonight captured at Coniston Water....</p>
</div>

<div id="gallery-captions-demo">
    <a
        href="img/img1.jpg"
        data-sub-html="<h4>Fading Light</h4><p>Classic view from Rigwood Jetty on Coniston Water an old archive shot similar to an old post but a little later on.</p>"
    >
        <img src="img/thumb1.jpg" />
    </a>
    <a href="img/img2.jpg" data-sub-html="#caption2">
        <img src="img/thumb2.jpg" />
    </a>
    <a href="img/img3.jpg" data-sub-html=".caption3">
        <img src="img/thumb3.jpg" />
    </a>
    ...
</div>
```

### Caption relative to current element.

If you already have captions associated with the thumbnails, you can instruct
lightGallery to pick up captions from the element within the selector by passing
`subHtmlSelectorRelative: true,` via lightGallery settings

##### HTML structure

```html
<div id="relative-caption">
    <a href="img/img1.jpg" data-sub-html=".caption">
        <img src="img/thumb1.jpg" />

        <!-- This will appear as caption -->
        <div class="caption">
            <h4>Caption1</h4>
            <p>Desc1</p>
        </div>
    </a>
    <a href="img/img2.jpg" data-sub-html=".caption">
        <img src="img/thumb2.jpg" />
        <div class="caption">
            <h4>Caption1</h4>
            <p>Desc1</p>
        </div>
    </a>
    ...
</div>
```

##### JavaScript

```js
lightGallery(document.getElementById('relative-caption'), {
    subHtmlSelectorRelative: true,
});
```
