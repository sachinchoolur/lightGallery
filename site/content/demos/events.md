---
title: 'Events'
description: 'LightGallery custom events demo.'
lead:
    'lightGallery emits several custom events throughout the gallery lifecycle.
    This can be used to customize the gallery or to add your own features. <a
    href="../../docs/events/">Docs</a>'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 14
toc: true
---

Let's see how we can change the background color of the gallery on every slide
change.

#### Demo

{{< image-gallery id="gallery-events-demo">}}

##### HTML Structure

```html
<div id="custom-events-demo">
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
const colours = ['#6a7583', '#1e304b', '#315460', '#080607'];
const galleryEventsDemo = document.getElementById('custom-events-demo');
galleryEventsDemo.addEventListener('lgBeforeSlide', (event) => {
    const { index } = event.detail;
    document.querySelector('.lg-backdrop').style.backgroundColor =
        colours[index];
});
lightGallery(galleryEventsDemo, {
    addClass: 'lg-events-demo-outer', // (Optional)
});
```

##### SCSS (Optional)

```scss
.lg-events-demo-outer {
    .lg-backdrop {
        transition: opacity 333ms ease-in 0s, background-color 333ms ease-in 0s;
    }
}
```
