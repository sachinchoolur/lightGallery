---
title: 'Flickity carousel demo'
description:
    'Add lightBox gallery support for Flickity Carousel with lightGallery'
lead:
    '<a href="https://flickity.metafizzy.co/" target="_blank">Flickity</a> makes carousels, galleries, & sliders that feel lively and effortless.
Flickity can be used for creating beautiful image galleries with thumbnails.
Here is the demo of adding lightbox gallery support for the Flickity carousel.'

date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 26
toc: true
---



#### Demo

{{< owl-carousel-gallery id="flickity-carousel-gallery-demo" >}}
{{< demoButtons js="https://codepen.io/light-gallery/pen/OJdBLLX" >}}

##### HTML Structure

```html
<div id="flickity-carousel-gallery-demo" class="main-carousel">
    <a data-lg-size="1600-1200" href="img/img1.jpg" class="carousel-cell">
        <img src="img/thumb1.jpg" />
    </a>
    <a data-lg-size="1600-1200" href="img/img2.jpg" class="carousel-cell">
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

##### Javascript

```js
var $flickityLG = document.querySelector('#flickity-carousel-gallery-demo');
if ($flickityLG) {
    var flkty = new Flickity($flickityLG, {
        cellAlign: 'center',
        pageDots: false,
        contain: true,
        autoPlay: true,
        on: {
            ready: function () {
                const container = document.querySelector('.flickity-slider');
                window.lightGallery(container, {
                    selector: '.carousel-cell',
                });
            },
        },
    });
}

```

##### SCSS (Optional)

```css
.flickity-slider {
    .lg-item {
        img {
            height: 600px;
        }
    }
}
```

