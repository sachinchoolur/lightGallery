---
title: 'Methods'
description: 'LightGallery methods.'
lead:
    'You can use lightGallery plugin instance public methods to trigger specific
    lightGallery actions. lightGallery provides several useful methods which can
    be used to customize the gallery or to build your own features. You can find
    the list of methods in the <a href="../../docs/methods/">docs</a>.'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 12
toc: true
---

Let's see how we integrate custom next and previous buttons instead of built-in
buttons using lightGallery methods.

#### Demo

{{< image-gallery id="gallery-methods-demo">}}

<div class="codepen-demo">
    <a target="_blank" href="https://codepen.io/sachinchoolur/pen/yLMJYOw">View on CodePen</a>
</div>

##### HTML Structure

```html
<div id="gallery-methods-demo">
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
const $lgGalleryMethodsDemo = document.getElementById('gallery-methods-demo');
let methodsInstance;
$lgGalleryMethodsDemo.addEventListener('lgAfterOpen', () => {
    const previousBtn =
        '<button type="button" aria-label="Previous slide" class="lg-prev"> Prev Slide </button>';
    const nextBtn =
        '<button type="button" aria-label="Next slide" class="lg-next"> Next Slide </button>';

    // Append custom buttons to the lightGallery container
    const $lgContainer = document.querySelector('.lg-content');
    $lgContainer.insertAdjacentHTML('beforeend', nextBtn);
    $lgContainer.insertAdjacentHTML('beforeend', previousBtn);

    // use lightGallery goToNextSlide and goToPrevSlide methods to
    // navigate to respective slides
    document.querySelector('.lg-next').addEventListener('click', () => {
        methodsInstance.goToNextSlide();
    });
    document.querySelector('.lg-prev').addEventListener('click', () => {
        methodsInstance.goToPrevSlide();
    });
});

// Store the instance in a variable
methodsInstance = lightGallery($lgGalleryMethodsDemo, {
    // Add custom class for button styling
    addClass: 'lg-methods-demo',

    // Disable default controls
    controls: false,
});
```
