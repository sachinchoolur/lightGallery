---
title: 'Update Slides'
description: 'LightGallery add, edit or delete slides while gallery is open.'
lead:
    'lightGallery supports, adding, editing, deleting slides even if the gallery
    is opened. You just need to modify the current gallery items and pass it via
    updateSlides method.'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 10
toc: true
---

Let's see how we can add and delete slides dynamically.

In this demo, we'll be using some of the lightGallery jQuery like utilities for
dom manipulations such as `append`, `find` or `on`. <a
    href="../../docs/lg-query/">Docs</a>

##### HTML Structure

```html
<div id="gallery-update-slides-demo">
    <a href="img/img1.jpg">
        <img src="img/thumb1.jpg" />
    </a>
    <a href="img/img2.jpg">
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

First, we need to add delete and add buttons into the gallery toolbar.

```js
const $lgDemoUpdateSlides = document.getElementById(
    'gallery-update-slides-demo',
);

// make use on lightGallery init event to add custom buttons into the toolbar
$lgDemoUpdateSlides.addEventListener('lgInit', (event) => {
    let updateSlideInstance = event.detail.instance;
    const addBtn =
        '<button type="button" aria-label="Add slide" class="lg-icon" id="lg-add"><svg>...</svg></button>';
    const deleteBtn =
        '<button type="button" aria-label="Remove slide" class="lg-icon" id="lg-delete"> <svg>...</svg></button>';

    updateSlideInstance.outer.find('.lg-toolbar').append(deleteBtn);
    updateSlideInstance.outer.find('.lg-toolbar').append(addBtn);
});

// Initialize lightGallery
updateSlideInstance = lightGallery($lgDemoUpdateSlides, {
    addClass: 'lg-update-slide-demo',
});
```

Delete the first slide on clicking on the delete button

Note :

-   Do not mutate existing lightGallery items directly.
-   Always pass new list of gallery items
-   You need to take care of thumbnails outside the gallery if any You can use
    refresh() method to update lightGallery after updating thumbnails -
    [Docs](../../docs/methods/#refresh) -
    [Demo](../../demos/infinite-scrolling/)

```js
updateSlideInstance.outer.find('#lg-delete').on('click', () => {
    let galleryItems = JSON.parse(
        JSON.stringify(updateSlideInstance.galleryItems),
    );

    // Delete first item
    galleryItems.shift();

    // Pass the modified gallery items via updateSlides method
    // the second parameter is the index of the slide
    // to determine which slide lightGallery should navigate to after deleting current items
    updateSlideInstance.updateSlides(galleryItems, 1);

    let slidesUpdated = false;
});
```

Add a new slide on clicking on the add button

```js
updateSlideInstance.outer.find('#lg-add').on('click', () => {
    let galleryItems = [
        ...updateSlideInstance.galleryItems,
        ...[
            {
                src: 'img/img.1jpg',
                thumb: 'img/thumb.1jpg',
            },
        ],
    ];

    // instead of first slide, this time lets persist the current index
    updateSlideInstance.updateSlides(galleryItems, updateSlideInstance.index);
});
```

##### SCSS (Optional)

```scss
.lg-update-slide-demo {
    .lg-toolbar {
        .lg-icon {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        svg {
            fill: #999;
            width: 22px;
            height: 22px;
        }
    }
}
```

#### Demo

{{< image-gallery id="gallery-update-slides-demo">}}

<div class="codepen-demo">
    <a target="_blank" href="https://codepen.io/sachinchoolur/pen/WNpxvXZ">View on CodePen</a>
</div>
