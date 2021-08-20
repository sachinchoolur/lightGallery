---
title: Captions
description: lightGallery captions demo.
lead: You can directly pass image caption html via data-sub-html attribute or just pass id or class name of any html object (div) which contains your cation html.
date: 2020-10-06T08:48:57.000Z
draft: false
images: []
menu: {demos: {parent: Demos}}
weight: 16
toc: true
---

#### Demo

{{< image-gallery id="gallery-captions-demo" >}}

##### HTML Structure

```html
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

### Caption animation

If you like to have animated captions, you can easily create your own animations
with the help of lightGallery `slideDelay` option

`slideDelay` adds a delay between slide transitions. You can use this time
interval to animate captions before the next slide transition starts.

{{< image-gallery-captions id="gallery-animated-captions-demo" >}}

<div class="codepen-demo">
    <a target="_blank" href="https://codepen.io/sachinchoolur/pen/poebjrm">View on CodePen</a>
</div>

##### HTML

```html
<div id="gallery-animated-captions-demo">
    <a
        href="img/img1.jpg"
        data-sub-html="<div class='lightGallery-captions'><h4>title</h4><p>description</p></div>"
    >
        <img src="img/thumb1.jpg" />
    </a>
    <a
        href="img/img2.jpg"
        data-sub-html="<div class='lightGallery-captions'><h4>title</h4><p>description</p></div>"
    >
        <img src="img/thumb2.jpg" />
    </a>
    <a
        href="img/img3.jpg"
        data-sub-html="<div class='lightGallery-captions'><h4>title</h4><p>description</p></div>"
    >
        <img src="img/thumb3.jpg" />
    </a>
    ...
</div>
```

##### JavaScript

```js
lightGallery(document.getElementById('gallery-animated-captions-demo'), {
    speed: 500,
    // Append caption inside the slide item
    // This way you can make use of lightGallery active slide class names to add animation
    appendSubHtmlTo: '.lg-item',
    // Delay slide transition to complete captions animations
    // before navigating to different slides (Optional)
    // You can find caption animation demo on the captions demo page
    slideDelay: 400,
});
```

##### CSS

```scss
// Add transitions
.lightGallery-captions {
    h4,
    p {
        transition: transform 0.4s ease-in-out, opacity 0.4s ease-in;
    }
}
.lg-current {
    .lightGallery-captions {
        h4,
        p {
            transition-delay: 500ms;
        }
    }
    &.lg-slide-progress {
        .lightGallery-captions {
            h4,
            p {
                transition-delay: 0ms;
            }
        }
    }
}

// Disappear
.lightGallery-captions {
    h4 {
        transform: translate3d(60px, 0, 0px);
    }
    p {
        transform: translate3d(-60px, 0, 0px);
    }
    h4,
    p {
        opacity: 0;
    }
}

// Active
.lg-current {
    .lightGallery-captions {
        h4,
        p {
            transform: translate3d(0, 0, 0px);
        }
        h4,
        p {
            opacity: 1;
        }
    }
}

// Disappear
.lg-slide-progress {
    .lightGallery-captions {
        h4 {
            transform: translate3d(-60px, 0, 0px);
        }
        p {
            transform: translate3d(60px, 0, 0px);
        }
        h4,
        p {
            opacity: 0;
        }
    }
}
```
