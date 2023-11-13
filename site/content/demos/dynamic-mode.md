---
title: 'Dynamic Mode'
description: 'Create dynamic JavaScript galleries with lightGallery.'
lead:
    'LightGallery can be instantiated and launched programmatically by setting
    dynamic option to true and populating dynamicEl option by passing array of
    objects representing the gallery elements. See available dynamic options <a
    href="../../docs/dynamic-variables/">Docs.</a>'
date: 2020-10-06T08:48:57+00:00
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


{{< demoButtons
   class="dynamic-mode-demo"
   js="https://codepen.io/sachinchoolur/pen/VwpYagE"
   react="https://stackblitz.com/edit/stackblitz-starters-puyir7" >}}


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

### Load more slides dynamically

You can add or remove slides of a dynamic gallery by passing the updated
dynamicEl list via refresh method

<button type="button" class="btn btn-success"
id="dynamic-gallery-demo-load-more"> Launch Gallery with more images </button>

##### HTML Structure

```html
<button
    type="button"
    class="btn btn-success"
    id="dynamic-gallery-demo-load-more"
>
    Launch Gallery with additional images
</button>
```

##### JavaScript

```js
document
    .getElementById('dynamic-gallery-demo-load-more')
    .addEventListener('click', () => {
        const newItems = [
            {
                src: 'img/4.jpg',
                thumb: 'img/thumb-4.jpg',
                subHtml: '<h4>Image 4 title</h4><p>Image 4 descriptions.</p>',
            },
            {
                src: 'img/5.jpg',
                thumb: 'img/thumb-5.jpg',
                subHtml: '<h4>Image 5 title</h4><p>Image 5 descriptions.</p>',
            },
        ];
        const updatedDynamicElements = [...dynamicEl, ...newItems];
        dynamicGallery.refresh(updatedDynamicElements);

        // To open gallery after updating slides,
        dynamicGallery.openGallery();
    });
```

### Load more slides with images

You can use the dynamic mode to display a few thumbnails and show all the images by clicking on a button.


<div class="dynamic-mode-images">
    {{< gallery-demo-sm id="gallery-dynamic-thumbnails">}}
    <button type="button" class="btn btn-dynamic"
        id="dynamic-mode-images" >
        See 15 photos
    </button>
</div>


{{< demoButtons
   js="https://codepen.io/sachinchoolur/pen/KKbeWaV"
   react="https://stackblitz.com/edit/stackblitz-starters-q1htvi" >}}
