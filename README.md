![commit](https://badgen.net/github/last-commit/sachinchoolur/lightGallery/next)
![npm](https://img.shields.io/npm/v/lightgallery.svg?color=red)
![npm-tag](https://badgen.net/github/tag/sachinchoolur/lightgallery)
![size](https://badgen.net/bundlephobia/minzip/lightgallery?color=cyan)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/lightgallery?color=purple)
![types](https://badgen.net/npm/types/lightgallery?color=blue)
![hits](https://badgen.net/jsdelivr/hits/npm/lightgallery?color=pink)

# lightGallery

A customizable, modular, responsive, lightbox gallery plugin. No dependencies.\\
Available for React.js, Angular, Vue.js, and typescript.

![lightgallery](https://www.lightgalleryjs.com/lightgallery-demo.png)

## Core features

-   Fully responsive.
-   Modular architecture with built in plugins.
-   Highly optimized for touch devices.
-   Mouse drag supports for desktops.
-   Double-click/Double-tap to see actual size of the image.
-   Animated thumbnails.
-   Social sharing.
-   YouTube Vimeo Wistia and html5 videos Support.
-   20+ Hardware-Accelerated CSS3 transitions.
-   Dynamic mode.
-   Inline gallery
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

## Documentation

-   [Getting started](https://www.lightgalleryjs.com/docs/getting-started/)
-   [Settings](https://www.lightgalleryjs.com/docs/settings/)
-   [React](https://www.lightgalleryjs.com/docs/react/)
-   [Vue.js](https://www.lightgalleryjs.com/docs/vue/)
-   [Angular](https://www.lightgalleryjs.com/docs/angular/)
-   [Demos](https://www.lightgalleryjs.com/demos/thumbnails/)
-   [CodePen](https://codepen.io/collection/BNNjpR)

## Installation

lightGallery is available on NPM, Yarn, Bower, CDNs, and GitHub. You can use any
of the following method to download lightGallery

-   [NPM](https://www.npmjs.com/) - NPM is a package manager for the JavaScript
    programming language. You can install `lightgallery` using the following
    command

    ```sh
    npm install lightgallery
    ```

-   [YARN](https://yarnpkg.com/) - Yarn is another popular package manager for
    the JavaScript programming language. If you prefer you can use Yarn instead
    of NPM

    ```sh
    yarn add lightgallery
    ```

-   [Bower](http://bower.io) - You can find lightGallery on Bower package
    manager as well

    ```sh
    bower install lightgallery --save
    ```

-   [GitHub](https://github.com/sachinchoolur/lightGallery/archive/master.zip) -
    You can also directly download lightgallery from GitHub

-   CDN - If you prefer to use a CDN, you can load files via
    [jsdelivr](https://www.jsdelivr.com/projects/lightgallery),
    [cdnjs](https://cdnjs.com/libraries/lightgallery) or
    [unpkg](https://unpkg.com/browse/lightgallery@latest/)

#### Include CSS and Javascript files

First of all, include lightgallery.css in the &lt;head> of the document. If
you want include any lightGallery plugin such as thumbnails or zoom, you need to
include respective css files as well.

Alternatively you can include `lightgallery-bundle.css` which contains
lightGallery and all plugin styles instead of separate stylesheets.

If you like you can also import scss files instead of css files from the `scss`
folder.

```HTML
<head>
    <link type="text/css" rel="stylesheet" href="css/lightgallery.css" />

    <!-- lightgallery plugins -->
    <link type="text/css" rel="stylesheet" href="css/lg-zoom.css" />
    <link type="text/css" rel="stylesheet" href="css/lg-thumbnail.css" />


    <!-- OR -->

    <link type="text/css" rel="stylesheet" href="css/lightgallery-bundle.css" />
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
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'

```

#### The markup

lightgallery does not force you to use any kind of markup. you can use whatever
markup you want.
<a href="https://www.lightgalleryjs.com/demos/html-markup/">Here</a> can find
detailed examples of different kinds of markups.

If you know the original size of the media, you can pass it via
`data-lg-size="${width}-${height}"` attribute for the initial
[zoom](https://www.lightgalleryjs.com/docs/settings/#zoomFromOrigin) animation.
But, this is completely optional.

```HTML
<div id="lightgallery">
    <a href="img/img1.jpg" data-lg-size="1600-2400">
        <img alt=".." src="img/thumb1.jpg" />
    </a>
    <a href="img/img2.jpg" data-lg-size="1024-800">
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
        plugins: [lgZoom, lgThumbnail],
        speed: 500,
        licenseKey: 'your_license_key'
        ... other settings
    });
</script>
```

[CodePen Demos](https://codepen.io/collection/BNNjpR)

#### License Key

You'll receive a license key via email one you purchase a license [More info](https://www.lightgalleryjs.com/docs/settings/#licenseKey)

#### Plugins

As shown above, you need to pass the plugins via settings if you want to use any
lightGallery plugins.

If you are including lightGallery files via script tag, please use the same
plugins names as follows.

`lgZoom`, `lgAutoplay`, ` lgComment`, `lgFullscreen `, `lgHash`, `lgPager`,
`lgRotate`, `lgShare`, `lgThumbnail`, `lgVideo`, `lgMediumZoom`

## Browser support

lightGallery supports all major browsers including IE 10 and above.

## License

#### Commercial license

If you want to use lightGallery to develop commercial sites, themes, projects,
and applications, the Commercial license is the appropriate license. With this
option, your source code is kept proprietary.
[Read more about the commercial license](https://www.lightgalleryjs.com/license/)

#### Open source license

If you are creating an open source application under a license compatible with
the GNU GPL license v3, you may use this project under the terms of the GPLv3.

## Support

If you have any questions, suggestions, feedback, please reach out to [contact@lightgalleryjs.com](mailto:contact@lightgalleryjs.com) or DM me on [twitter](https://twitter.com/SachinNeravath)
