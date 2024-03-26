---
title: Video carousel
description:
    Demo of javascript video carousel gallery.
lead:
    With lightGallery, you can create both carousel slider and lightBox
    galleries. You can create inline gallery by passing the container element
    via container option. All the lightBox features are available in inline
    gallery as well. inline gallery can be converted to the lightBox gallery by
    clicking on the maximize icon on the toolbar
date: 2020-10-06T08:48:57.000Z
draft: false
images: []
has_video: true
menu: { demos: { parent: Demos } }
weight: 4
toc: true
---

#### Demo

<div id="inline-video-gallery-container" class="inline-gallery-container"></div>

{{< demoButtons js="https://codepen.io/light-gallery/pen/ZEwMyWE" react="https://stackblitz.com/edit/stackblitz-starters-rnvyp4" >}}

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
            src: 'https://youtu.be/IUN664s7N-c',
            subHtml: `<h4>'Peck Pocketed' by Kevin Herron</h4>`,
        },
        {
            src: 'https://www.youtube.com/watch?v=ttLu7ygaN6I',
            subHtml: `<h4>'Peck Pocketed' by Kevin Herron</h4>`,
            thumb:
                'https://img.youtube.com/vi/your_youtube_video_id/mqdefault.jpg',
        },
        {
            src: 'https://www.youtube.com/watch?v=C3vyugaBhSs',
            subHtml: `<h4>UE5</h4>`,
        },
        // Add more video objects as needed
    ],
});

// Since we are using dynamic mode, we need to programmatically open lightGallery
inlineGallery.openGallery();
```

##### CSS

Set height and width for the container as the inline automatically adopts the
container size

```scss
.inline-gallery-container {
    width: 100%;

    // set 60% height
    height: 0;
    padding-bottom: 65%;
}
```
