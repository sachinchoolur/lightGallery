---
title: 'Social sharing'
description:
    'lightGallery allows sharing your images and videos across social media
    platforms using the unique url created by lightGallery.'
lead:
    'Share your images and videos across social media platforms using the unique
    url created by lightGallery.'
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 3
toc: true
---

#### Demo

{{< image-gallery id="gallery-share-demo">}}

<div class="codepen-demo">
    <a target="_blank" href="https://codepen.io/sachinchoolur/pen/GRWZbRv">View on CodePen</a>
</div>

##### HTML Structure

```html
<div id="lg-share-demo">
    <a
        data-pinterest-text="Pin it1"
        data-tweet-text="lightGallery slide  1"
        href="img/img1.jpg"
    >
        <img src="img/thumb1.jpg" />
    </a>
    <a
        data-pinterest-text="Pin it2"
        data-tweet-text="lightGallery slide  2"
        href="img/img2.jpg"
    >
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

Optionally you can pass separate url for each images instead of current browser
url.

```html
<div id="gallery-share-demo">
    <a
        data-pinterest-text="Pin it1"
        data-tweet-text="lightGallery slide  1"
        data-facebook-share-url="share/facebook-share-url"
        data-twitter-share-url="share/twitter-share-url"
        data-pinterest-share-url="share/pinterest-share-url"
        href="img/img1.jpg"
    >
        <img src="img/thumb1.jpg" />
    </a>
    <a
        data-pinterest-text="Pin it1"
        data-tweet-text="lightGallery slide  1"
        data-facebook-share-url="share/facebook-share-url"
        data-twitter-share-url="share/twitter-share-url"
        data-pinterest-share-url="share/pinterest-share-url"
        href="img/img2.jpg"
    >
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

##### JavaScript

```js
lightGallery(document.getElementById('gallery-share-demo'));
```

#### Add new share options

By default, lightGallery supports sharing on Facebook, Twitter and pinterest.
Missing something? you can easily add your own share buttons in lightGallery.

Let's see how we can add
<a href="https://www.reddit.com/" target="_blank">reddit</a> share button.

{{< image-gallery id="gallery-share-reddit-demo">}}

<div class="codepen-demo">
    <a target="_blank" href="https://codepen.io/sachinchoolur/pen/mdWPZRq">View on CodePen</a>
</div>

To share a post on reddit, you need to create the following url structure

```
https://reddit.com/submit?url={url}&title={title}
```

**Step 1 -**

We need to fetch title attribute from each slide. lightGallery allows you to
fetch custom props from the selector element by passing the prop name via
extraProps settings

#### HTML

```html
<div id="gallery-share-reddit-demo">
    <a data-reddit-title="slide title" href="img/img1.jpg">
        <img src="img/thumb1.jpg" />
    </a>
    <a data-reddit-title="slide title - 2" href="img/img2.jpg">
        <img src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

##### JavaScript

```js
lightGallery(document.getElementById('gallery-share-reddit-demo'), {
    extraProps: ['redditTitle'],
});
```

**Step 2 -**

Using setting `additionalShareOptions` provide the required data to lightGallery
share plugin

#### JavaScript

```js
lightGallery(document.getElementById('gallery-share-reddit-demo'), {
    extraProps: ['redditTitle'],
    additionalShareOptions: [
        {
            // Selector for the anchor tag inside share list item
            selector: '.lg-share-reddit',

            // HTML to be appended to the share dropdown menu
            dropdownHTML:
                '<li class="lg-share-item-reddit"><a class="lg-share-reddit" target="_blank"><svg class="lg-reddit">...</svg><span class="lg-dropdown-text">Reddit</span></a></li>',

            // Construct url
            generateLink: (galleryItem) => {
                const url = encodeURIComponent(window.location.href);

                // The prop data-reddit-title is converted to redditTitle and added to the gallery item
                const title = galleryItem.redditTitle;
                const redditShareLink = `//reddit.com/submit?url=${url}&title=${title}`;
                return redditShareLink;
            },
        },
    ],
});
```

That's it. Now you can see additional reddit button in the share dropdown menu

Reference - https://github.com/bradvin/social-share-urls
