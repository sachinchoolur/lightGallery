---
title: 'Get started'
description:
    'lightGallery is a lightweight modular touch friendly gallery, for creating
    beautiful image & video galleries.'
lead:
    'lightGallery is a lightweight modular touch friendly gallery, for creating
    beautiful image & video galleries.'
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    docs:
        parent: 'API Docs'
weight: 1
toc: true
---

## Core features

-   Fully responsive.
-   Modular architecture with built in plugins.
-   Touch and support for mobile devices.
-   Mouse drag supports for desktops.
-   Double-click/Double-tap to see actual size of the image.
-   Animated thumbnails.
-   Social sharing.
-   YouTube Vimeo Wistia and html5 videos Support.
-   20+ Hardware-Accelerated CSS3 transitions.
-   Dynamic mode.
-   Full screen support.
-   Zoom in/out, Pinch to zoom.
-   Swipe/Drag up/down support to close gallery
-   Browser history API(deep linking).
-   Responsive images.
-   HTML iframe support.
-   Multiple instances on one page.
-   Easily customizable via CSS (SCSS) and Settings.
-   Smart image preloading and code optimization.
-   Keyboard Navigation for desktop.
-   SVG icons.
-   Accessibility support.
-   Rotate, flip images.
-   And many more.

## Browser support

lightGallery supports all major browsers including IE 10 and above.

## Installation

lightGallery is available on NPM, Yarn, Bower, and CDN

### Install with NPM

You can install `lightgallery` using the [npm](https://www.npmjs.com/) package
manager.

```sh
npm install lightgallery
```

You can find `lightgallery` on [Yarn](https://yarnpkg.com/) and
[Bower](http://bower.io) as well.

### Yarn

```sh
yarn add lightgallery
```

### Bower

```sh
bower install lightgallery --save
```

### Download from Github

You can also directly download lightgallery from
[github](https://github.com/sachinchoolur/lightGallery/archive/master.zip).

#### CDN

If you prefer to use a CDN you can load files via
[jsdelivr](https://www.jsdelivr.com/projects/lightgallery) or
[cdnjs](https://cdnjs.com/libraries/lightgallery)

### Include CSS and Javascript files

First of all, include lightgallery.css in the &lt;head&gt; of the document.

```HTML
<head>
    <link type="text/css" rel="stylesheet" href="css/lightGallery.css" />
</head>
```

Then include lightgallery.umd.js into your document. If you want to include any
lightgallery plugin you can include it after lightgallery.umd.js.

```HTML
<body>
    ....

    <script src="js/lightgallery.umd.js"></script>

    <!-- lightgallery plugins -->
    <script src="js/plugins/lg-thumbnail.umd.js"></script>
    <script src="js/plugins/lg-zoom.umd.js"></script>
</body>
```

lightGallery supports AMD, CommonJS and ES6 modules too.

```JavaScript
import lightGallery from 'lightgallery';

// Plugins
import lgThumbnail from 'dist/js/plugins/lg-thumbnail.es5'
import lgZoom from 'dist/js/plugins/lg-zoom.es5'

```

#### The markup

lightgallery does not force you to use any kind of markup. you can use whatever
markup you want. <a href="/docs/methods/">Here</a> you can find the detailed
examples of different kind of markups.

```HTML
<div id="lightgallery">
    <a href="img/img1.jpg">
        <img alt=".." src="img/thumb1.jpg" />
    </a>
    <a href="img/img2.jpg">
        <img alt=".." src="img/thumb2.jpg" />
    </a>
    ...
</div>
```

#### Initialize lightGallery

Finally, you need to initiate the gallery by adding the following code.

```javascript
<script type="text/javascript">
    lightGallery(document.getElementById('lightgallery'), {
        plugins: [lgZoom, lgThumbnail,]
        speed: 500
        ... other settings
    });
</script>
```

#### Plugins

As shown above, you need to pass the plugins via settings if you want to use any
lightGallery plugins.

If you are using UMD, please use the same plugins names as follows. `lgZoom`,
`lgAutoplay`,` lgComment`,`lgFullscreen `,`lgHash`,`lgPager`,`lgRotate`,`lgShare`,`lgThumbnail`,`lgVideo`

## License

#### Commercial license

If you want to use lightGallery to develop commercial sites, themes, projects,
and applications, the Commercial license is the appropriate license. With this
option, your source code is kept proprietary.
[Read more about the commercial license](http://sachinchoolur.github.io/lightGallery/docs/license.html)

#### Open source license

If you are creating an open source application under a license compatible with
the GNU GPL license v3, you may use this project under the terms of the GPLv3.
