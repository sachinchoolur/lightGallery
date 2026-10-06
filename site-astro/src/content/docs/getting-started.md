---
title: 'JavaScript image gallery, get started'
description: 'Install lightGallery with npm or a CDN and build a responsive image and video gallery in a few lines of JavaScript, no dependencies, 15 plugins.'
lead: lightGallery is a lightweight, modular, JavaScript library for creating beautiful image & video galleries for the web and the mobile.
date: 2020-10-06T08:48:57.000Z
draft: false
images: []
menu: { docs: { parent: 'API Docs', name: 'Get started' } }
weight: 1
toc: true
---

## Core features

#### Packages and build

-   One gallery, four packages: `lightgallery` for plain JavaScript and
    TypeScript, plus native [React](/docs/react/), [Vue 3](/docs/vue/) and
    [Angular](/docs/angular/) packages that render their own DOM.
-   A shared [headless core](/docs/headless/) behind every package, so
    settings and behavior are identical in each stack.
-   Zero dependencies, TypeScript types, ES module and UMD builds.
    The core is about 19 KB minified and gzipped; plugins are separate
    entries and cost nothing until you import them.
-   Modular architecture with 15 built-in plugins, and an API for
    [writing your own](/docs/creating-plugins/).
-   Easily customizable via CSS (SCSS) and settings. Multiple instances
    on one page.

#### Layout and performance

-   Fully responsive, with [srcset, sizes and picture
    sources](/docs/responsive-loading/) on every slide.
-   [Justified layout](/docs/justified-layout/) plugin: row-justified
    trigger grids with no layout library in front of the lightbox.
-   [Virtualization](/docs/virtualization/) keeps a small, constant DOM
    for galleries with thousands of slides.
-   [Dynamic mode](/demos/dynamic-mode/) opens a gallery from an array
    of items, and [live updates](/demos/update-slides/) add, edit or
    remove slides while it is open.
-   Inline gallery and carousel modes.
-   Smart preloading of neighboring slides.

#### Interaction

-   Highly optimized for touch devices, with mouse drag on desktops.
-   Gesture physics: every release lands in a spring seeded with your
    gesture's velocity, flings glide, edges resist with friction.
-   Swipe, drag or pinch to close.
-   Zoom in and out, pinch to zoom, double-click or double-tap for actual
    size. Slides [open from the thumbnail's
    position](/demos/zoom-from-origin/) and close back to it.
-   Animated thumbnails, with [thumbnail
    scrubbing](/docs/thumbnail-scrubbing/) to drag through the gallery.
-   20+ hardware-accelerated CSS3 transitions, plus your own easing.
-   Keyboard navigation and full screen support.
-   A toolbar that fits: on narrow screens the lowest-priority buttons
    move into a "More options" menu.
-   [Accessibility](/docs/accessibility/): modal dialog semantics, focus
    trap, screen-reader announcements, reduced-motion support.
-   [Localization and RTL](/docs/localization-rtl/): every label is a
    setting, and the gallery mirrors for right-to-left pages.

#### Media and plugins

-   YouTube, Vimeo, Wistia and HTML5 video, with [video
    facades](/docs/video-facades/) that load the player only on play.
-   HTML iframe support and [mixed content](/demos/mixed-contents/):
    photos, videos, maps and PDFs in one gallery.
-   HTML [captions](/demos/captions/) per slide, with animated and
    relative-position variants.
-   Rotate and flip images.
-   [Sharing](/docs/web-share/) through the native share sheet where it
    exists, social links where it does not.
-   [Deep links](/docs/hash-drivers/) with browser back and forward,
    through the Navigation API or the History API.
-   Autoplay slideshow with a progress bar, pager dots, per-slide
    comments, and a [medium-zoom](/demos/medium-zoom/) plugin for
    in-page image zoom.
-   Inline SVG icons, each [replaceable by name](/docs/custom-icons/).

## Ask your coding agent

Working with a coding agent? Paste the prompt below into it and replace
the first line with the gallery you want. It points the agent at the
markdown version of these docs, so it picks the right package for your
stack and avoids the setup mistakes behind most bug reports.

<div class="agent-prompt">

```text
Add lightGallery to this project: [describe the gallery you want, for
example "a product photo grid that opens a lightbox with thumbnails and
zoom"].

1. Detect the stack and use the matching package:
   - React: @lightgallery/react
   - Vue 3: @lightgallery/vue
   - Angular: @lightgallery/angular
   - Anything else (plain JavaScript, TypeScript, server-rendered HTML):
     lightgallery
2. Before writing code, read the docs index at
   https://www.lightgalleryjs.com/llms.txt and the guide for that stack:
   - React: https://www.lightgalleryjs.com/docs/react/index.md
   - Vue: https://www.lightgalleryjs.com/docs/vue/index.md
   - Angular: https://www.lightgalleryjs.com/docs/angular/index.md
   - Plain JavaScript:
     https://www.lightgalleryjs.com/docs/getting-started/index.md
   Use the install command from that guide exactly. The framework
   packages also need the lightgallery package, which ships the CSS.
3. Import the CSS yourself: lightgallery/css/lightgallery.css plus one
   file per plugin you use, such as lightgallery/css/lg-thumbnail.css.
   The framework packages ship no styles.
4. Plugins are opt-in. Import each one from its plugins/<name> entry and
   add it to the plugins list (in Angular, the features input with
   withThumbnail(), withZoom() and so on). A plugin's settings do
   nothing until the plugin is added.
5. Give every item the full-size image URL, a thumbnail and alt text.
   When the image dimensions are known, set lgSize to "WIDTH-HEIGHT"
   (data-lg-size in HTML markup) so the image opens from its thumbnail.
6. Check every option name against
   https://www.lightgalleryjs.com/docs/settings/index.md instead of
   guessing. Commercial projects also need the licenseKey setting.
7. When you are done, run the project's build or type check, open the
   gallery in a browser, and confirm the styles are applied and the
   console shows no errors.
```

</div>

## Installation

lightGallery is available on NPM, Yarn, CDNs, and GitHub. You can use any
of the following methods to download lightGallery

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

-   [GitHub](https://github.com/sachinchoolur/lightGallery/archive/master.zip) -
    You can also directly download lightgallery from GitHub

-   CDN - If you prefer to use a CDN, you can load files via
    [jsdelivr](https://www.jsdelivr.com/package/npm/lightgallery),
    [cdnjs](https://cdnjs.com/libraries/lightgallery) or
    [unpkg](https://unpkg.com/browse/lightgallery@latest/)

#### Include CSS and Javascript files

First of all, include lightgallery.css in the &lt;head> of the document. If you
want to include any lightGallery plugin such as thumbnails or zoom, you need to
include respective css files as well.

Alternatively you can include `lightgallery-bundle.css` which contains
lightGallery and all plugin styles instead of separate stylesheets.

If you like you can also import scss files instead of css files from the `scss`
folder.

```html
<head>
    <link type="text/css" rel="stylesheet" href="css/lightgallery.css" />

    <!-- lightgallery plugins -->
    <link type="text/css" rel="stylesheet" href="css/lg-zoom.css" />
    <link type="text/css" rel="stylesheet" href="css/lg-thumbnail.css" />


    <!-- OR -->

    <link type="text/css" rel="stylesheet" href="css/lightgallery-bundle.css" />
</head>
```

Then include `lightgallery.umd.js` into your document. If you want to include
any lightgallery plugin you can include it after `lightgallery.umd.js`.

```html
<body>
    ....

    <script src="lightgallery.umd.js"></script>
    <!-- Or use the minified version -->
    <script src="lightgallery.min.js"></script>

    <!-- lightgallery plugins -->
    <script src="plugins/thumbnail/lg-thumbnail.umd.js"></script>
    <script src="plugins/zoom/lg-zoom.umd.js"></script>
</body>
```

lightGallery supports AMD, CommonJS and ES6 modules too.

```javascript
import lightGallery from 'lightgallery';

// Plugins
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'

```

#### The markup

lightGallery does not force you to use any kind of markup. You can use whatever
markup you want. <a href="../../demos/html-markup/">Here</a> you can find
detailed examples of different kinds of markups.

If you know the original size of the media, you can pass it via
`data-lg-size="${width}-${height}"` attribute for the initial
[zoom](/docs/settings/#zoomFromOrigin) animation. But, this is completely optional.

```html
<div id="lightgallery">
    <a href="img/img1.jpg" data-lg-size="1600-2400">
        <img alt="img1" src="img/thumb1.jpg" />
    </a>
    <a href="img/img2.jpg" data-lg-size="1024-800">
        <img alt="img2" src="img/thumb2.jpg" />
    </a>
    <!-- more items -->
</div>
```

#### Initialize lightGallery

Finally, you need to initiate the gallery by adding the following code.

```html
<script type="text/javascript">
    lightGallery(document.getElementById('lightgallery'), {
        plugins: [lgZoom, lgThumbnail],
        licenseKey: 'your_license_key',
        speed: 500,
        // ... other settings
    });
</script>
```

#### License Key

You'll receive a license key via email once you purchase a license [More info](https://www.lightgalleryjs.com/docs/settings/#licenseKey)

#### Plugins

As shown above, you need to pass the plugins via settings if you want to use any
lightGallery plugins.

If you are including lightGallery files via script tag, please use the same
plugins names as follows.

`lgZoom`, `lgAutoplay`, `lgComment`, `lgFullscreen`, `lgHash`, `lgJustified`,
`lgPager`, `lgRelativeCaption`, `lgRotate`, `lgShare`, `lgThumbnail`, `lgVideo`,
`lgVimeoThumbnail`, `lgMediumZoom`, `lgOriginCrop`

## Browser support

lightGallery supports current evergreen browsers and iOS Safari: Chrome,
Edge, Firefox and Safari on desktop, Safari on iOS and Chrome on Android.
The builds target ES2017 and run without transpiling or polyfills.

-   **ES module and UMD builds.** Import it in a bundler, load it as a
    native `<script type="module">`, or drop the UMD file into a plain
    `<script>` tag. Nothing is module-only.
-   **Newer APIs are optional.** Features that rely on newer browser
    APIs, such as the native share sheet or observer-based relayout, are
    feature-detected and fall back cleanly where they are missing.

If something misbehaves in a browser you care about, please
[open an issue](https://github.com/sachinchoolur/lightGallery/issues)
with the browser and version.

## License

lightGallery is free and open source under the
[GPLv3](https://github.com/sachinchoolur/lightGallery/blob/master/LICENSE).
Use it in any project, personal or commercial, that is distributed under
GPLv3-compatible terms.

If you want to keep your own source proprietary, choose the
[commercial license](/license/). It covers the same code with every feature
and plugin included, nothing is gated, and it is a one-time payment. The
[license docs](/docs/license/) explain which license applies and how to pass
your key.

## Support

If you have any questions, suggestions, feedback, please reach out to [contact@lightgalleryjs.com](mailto:contact@lightgalleryjs.com) or DM me on [X](https://x.com/SachinNeravath)
