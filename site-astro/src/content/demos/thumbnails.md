---
title: 'JavaScript gallery with thumbnails.'
description: 'Create beautiful JavaScript image and video gallery with animated thumbnails.'
lead:
    'Create JavaScript image and video galleries with animated thumbnails. lightGallery thumbnails plugin supports touch swipe
    navigation on touchscreen devices as well as mouse drag for desktops. it
    allows users to navigate between slides by clicking on the thumbnails.
    Thumbnails plugin also allows you to load thumbnails automatically for
    YouTube, Vimeo, and other video sources. Find out more options in the <a
    href="../../docs/options/#thumbnails-plugin"> docs </a>'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu: {demos: {parent: Demos, name: Thumbnails}}
weight: 1
toc: true
---

<div class="alert alert-warning" role="alert">
    You need to include thumbnails plugin in the document.
</div>

### Animated thumbnails

{{< gallery-demo size="xl"  id="animated-thumbnails-gallery">}}

{{< demoButtons js="https://codepen.io/sachinchoolur/pen/poebzpV" react="https://stackblitz.com/edit/stackblitz-starters-p5ngcb?file=src%2Findex.tsx" >}}

##### HTML Structure

```html
<div id="animated-thumbnails">
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
lightGallery(document.getElementById('animated-thumbnails-gallery'), {
    thumbnail: true,
});
```

### Static thumbnails

<div class="lg-masonry-gallery">
    {{< gallery-demo size="xl"  id="static-thumbnails-gallery">}}
</div>

##### HTML Structure

```html
<div id="static-thumbnails">
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
lightGallery(document.getElementById('static-thumbnails'), {
    animateThumb: false,
    zoomFromOrigin: false,
    allowMediaOverlap: true,
    toggleThumb: true,
});
```

### Customize more

You can customize the look and feel of the thumbnails however you want just by
updating the css files. Let's see how we can place the thumbnails on the right
hand side of the slide.

{{< gallery-demo size="xl"  id="customize-thumbnails-gallery">}}

##### HTML Structure

```html
<div id="customize-thumbnails-gallery">
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
lightGallery(document.getElementById('customize-thumbnails-gallery'), {
    // Add a custom class to apply style only for the particular gallery
    addClass: 'lg-custom-thumbnails',

    // Remove the starting animations.
    // This can be done by overriding CSS as well
    appendThumbnailsTo: '.lg-outer',

    animateThumb: false,
    allowMediaOverlap: true,
});
```

##### CSS

```scss
.lg-custom-thumbnails {
    &.lg-outer {
        width: auto;
        // Set space for the container to occupy thumbnails
        right: 225px;

        // Add some spacing on the left to match with the right hand side spacing
        left: 10px;

        .lg-thumb-outer {
            // Set the position of the thumbnails
            left: auto;
            top: 0;
            width: 225px;
            bottom: 0;
            position: fixed;
            right: 0;

            // Reset max height
            max-height: none;

            // Customize the layout (Optional)
            background-color: #999;
            padding-left: 5px;
            padding-right: 5px;
            margin: 0 -10px;
            overflow-y: auto;

            // Update transition values
            // By default thumbnails animates from bottom to top
            // Change that from right to left.
            // Also, add a tiny opacity transition to look better
            transform: translate3d(30%, 0, 0);
            opacity: 0;
            will-change: transform opacity;
            transition: transform 0.15s cubic-bezier(0, 0, 0.25, 1) 0s, cubic-bezier(
                        0,
                        0,
                        0.25,
                        1
                    ) 0.15s;
        }

        &.lg-thumb-open {
            .lg-thumb-outer {
                transform: translate3d(0, 0, 0);
                opacity: 1;
            }
        }

        // Add hove effect (Optional)
        .lg-thumb-item {
            filter: grayscale(100%);
            will-change: filter;
            transition: filter 0.12s ease-in, border-color 0.12s ease;
            &:hover,
            &.active {
                filter: grayscale(0);
                border-color: #545454;
            }
        }

        .lg-thumb {
            padding: 5px 0;
        }
    }
}
```
