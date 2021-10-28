---
title: Inline Gallery
description: LightGallery allows you to build inline image/video galleries.
lead: With lightGallery you can create both inline and lightBox galleries. You can create inline gallery by passing the container element via container option. All the lightBox features are available in inline gallery as well. inline gallery can be converted to the lightBox gallery by clicking on the maximize icon on the toolbar
date: 2020-10-06T08:48:57.000Z
draft: false
images: []
menu: {demos: {parent: Demos}}
weight: 4
toc: true
---

#### Demo

<div id="inline-gallery-container" class="inline-gallery-container"></div>
<div class="codepen-demo">
    <a target="_blank" href="https://codepen.io/sachinchoolur/pen/zYZqaGm">View on CodePen</a>
</div>

##### HTML

```html
<div id="inline-gallery-container" class="inline-gallery-container"></div>
```

##### JavaScript

```js
const lgContainer = document.getElementById('inline-gallery-container');
const inlineGallery = lightGallery(lgContainer, {
    container: lgContainer,
    dynamic: true,
    // Turn off hash plugin in case if you are using it
    // as we don't want to change the url on slide change
    hash: false,
    // Do not allow users to close the gallery
    closable: false,
    // Add maximize icon to enlarge the gallery
    showMaximizeIcon: true,
    // Append caption inside the slide item
    // to apply some animation for the captions (Optional)
    appendSubHtmlTo: '.lg-item',
    // Delay slide transition to complete captions animations
    // before navigating to different slides (Optional)
    // You can find caption animation demo on the captions demo page
    slideDelay: 400,
    dynamicEl: [
        {
            src: 'img/img1.jpg',
            thumb: 'img/thumb1.jpg',
            subHtml: `<div class="lightGallery-captions">
                <h4>Caption 1</h4>
                <p>Description of the slide 1</p>
            </div>`,
        },
        {
            src: 'img/img2.jpg',
            thumb: 'img/thumb2.jpg',
            subHtml: `<div class="lightGallery-captions">
                <h4>Caption 2</h4>
                <p>Description of the slide 2</p>
            </div>`,
        },
        ...
    ],
});

// Since we are using dynamic mode, we need to programmatically open lightGallery
inlineGallery.openGallery();
```

##### CSS

Set height and width for the container as the inline automatically adopts the container size

```scss
.inline-gallery-container {
    width: 100%;

    // set 60% height
    height: 0;
    padding-bottom: 65%;
}
```
