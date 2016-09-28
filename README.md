![travis](https://travis-ci.org/sachinchoolur/lightGallery.svg?branch=master)
![bower](https://img.shields.io/bower/v/lightgallery.svg)
![npm](https://img.shields.io/npm/v/lightgallery.svg)

# lightGallery
A customizable, modular, responsive, lightbox gallery plugin for jQuery.
![lightgallery](https://raw.githubusercontent.com/sachinchoolur/lightGallery/master/lib/lg.png)
Demo
---
[JQuery lightGallery demo](http://sachinchoolur.github.io/lightGallery/). [Codepen demo](http://codepen.io/sachinchoolur/details/QjLNMM/) 

Main features
---

* Fully responsive.
* Modular architecture with built in plugins.
* Touch and support for mobile devices.
* Mouse drag supports for desktops.
* Double-click/Double-tap to see actual size of the image.
* Animated thumbnails.
* Social sharing.
* Youtube Vimeo Dailymotion VK and html5 videos Support.
* 20+ Hardware-Accelerated CSS3 transitions.
* Dynamic mode.
* Full screen support.
* Supports zoom.
* Browser history API.
* Responsive images.
* HTML iframe support.
* Multiple instances on one page.
* Easily customizable via CSS (SCSS) and Settings.
* Smart image preloading and code optimization.
* Keyboard Navigation for desktop.
* Font icon support.
* And many more.
 
Browser support
---
lightgallery supports all major browsers including IE 8 and above..


Installation
---
#### Install with Bower

You can install ```lightgallery``` using the [Bower](http://bower.io) package manager.

```sh
$ bower install lightgallery --save
```

#### npm

You can also find ```lightgallery``` on [npm](http://npmjs.org).

```sh
$ npm install lightgallery
```
#### Download from Github

You can also directly download lightgallery from github.

#### Cdnjs

If you prefer to use a CDN you can load files via [cdnjs](https://cdnjs.com/libraries/lightgallery)

#### Include CSS and Javascript files
First of all add lightgallery.css in the &lt;head&gt; of the document.
``` html
<head>
    <link type="text/css" rel="stylesheet" href="css/lightGallery.css" /> 
</head>
```
Then include jQuery and lightgallery.min.js into your document.
If you want to include any lightgallery plugin you can include it after lightgallery.min.js.
``` html
<body>
    ....

    <!-- jQuery version must be >= 1.8.0; -->
    <script src="jquery.min.js"></script>

    <!-- A jQuery plugin that adds cross-browser mouse wheel support. (Optional) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js"></script>

    <script src="js/lightgallery.min.js"></script>

    <!-- lightgallery plugins -->
    <script src="js/lg-thumbnail.min.js"></script>
    <script src="js/lg-fullscreen.min.js"></script>
</body>  
```
lightGallery also supports AMD, CommonJS and ES6 modules.
When you use AMD make sure that lightgallery.js is loaded before lightgallery modules.
```js
require(['./lightgallery.js'], function() {
    require(["./lg-zoom.js", "./lg-thumbnail.js"], function(){
        $("#lightgallery").lightGallery(); 
    });
});
```
#### The markup
lightgallery does not force you to use any kind of markup. you can use whatever markup you want. But i suggest you to use the following markup. [Here](http://sachinchoolur.github.io/lightGallery/demos/html-markup.html) you can find the detailed examples of deferent kind of markups.
``` html
<div id="lightgallery">
  <a href="img/img1.jpg">
      <img src="img/thumb1.jpg" />
  </a>
  <a href="img/img2.jpg">
      <img src="img/thumb2.jpg" />
  </a>
  ...
</div>
```
#### Call the plugin
Finally you need to initiate the gallery by adding the following code.
``` javascript
<script type="text/javascript">
    $(document).ready(function() {
        $("#lightgallery").lightGallery(); 
    });
</script>
```

Resources
----
* [API Reference](http://sachinchoolur.github.io/lightGallery/docs/api.html)
* [Events](http://sachinchoolur.github.io/lightGallery/docs/api.html#events)
* [Methods](http://sachinchoolur.github.io/lightGallery/docs/api.html#methods)
* [Data Attributes](http://sachinchoolur.github.io/lightGallery/docs/api.html#attributes)
* [Dynamic variables](http://sachinchoolur.github.io/lightGallery/docs/api.html#dynamic)
* [Sass variables](http://sachinchoolur.github.io/lightGallery/docs/api.html#sass)
* [Module API](http://sachinchoolur.github.io/lightGallery/docs/plugin-api.html)
* [Themes](http://sachinchoolur.github.io/lightGallery/themes/)

Demos 
----
* Thumbnails
  * [Gallery with animated thumbnails](http://sachinchoolur.github.io/lightGallery/demos/) 
  * [Gallery without animated thumbnails](http://sachinchoolur.github.io/lightGallery/demos/#normal-thumb) 
* Youtube, Vimeo Video Gallery
  * [Youtube, Vimeo Video Gallery](http://sachinchoolur.github.io/lightGallery/demos/videos.html)
  * [Video Gallery Without Poster](http://sachinchoolur.github.io/lightGallery/demos/videos.html#video-without-poster)
  * [Video Player Parameters](http://sachinchoolur.github.io/lightGallery/demos/videos.html#video-player-param)
  * [Automatically load thumbnails](http://sachinchoolur.github.io/lightGallery/demos/videos.html#auto-thumb)
* Html5 Video Gallery
  * [Html5 Video Gallery](http://sachinchoolur.github.io/lightGallery/demos/html5-videos.html)
  * [Html5 video gallery with videojs](http://sachinchoolur.github.io/lightGallery/demos/html5-videos.html#video-without-poster)
* [Transitions](http://sachinchoolur.github.io/lightGallery/demos/transitions.html)
* [Dynamic](http://sachinchoolur.github.io/lightGallery/demos/dynamic.html)
* [Events](http://sachinchoolur.github.io/lightGallery/demos/events.html)
* [Methods](http://sachinchoolur.github.io/lightGallery/demos/methods.html)
* [Iframe. External websites, Google map etc..](http://sachinchoolur.github.io/lightGallery/demos/iframe.html)
* [Captions](http://sachinchoolur.github.io/lightGallery/demos/captions.html)
* Responsive images
  * [Responsive images](http://sachinchoolur.github.io/lightGallery/demos/responsive.html)
  * [Responsive images with html5 srcset](http://sachinchoolur.github.io/lightGallery/demos/responsive.html#srcset-demo)
* [Gallery with fixed size](http://sachinchoolur.github.io/lightGallery/demos/fixed-size.html)
* [Html Markup](http://sachinchoolur.github.io/lightGallery/demos/html-markup.html)
* [Facebook comments](http://sachinchoolur.github.io/lightGallery/demos/comment-box.html)
* [Easing](http://sachinchoolur.github.io/lightGallery/demos/easing.html)
* [History/hash plugin](http://sachinchoolur.github.io/lightGallery/demos/hash.html)
* [Angularjs directive](http://sachinchoolur.github.io/lightGallery/demos/angularjs.html)

Built in modules
----
1. Thumbnail - [GItHub](https://github.com/sachinchoolur/lg-thumbnail) - [Docs](https://sachinchoolur.github.io/lightGallery/docs/api.html#lg-thumbnial)
2. Autoplay - [GItHub](https://github.com/sachinchoolur/lg-autoplay) - [Docs](https://sachinchoolur.github.io/lightGallery/docs/api.html#lg-autoplay)
3. Video - [GItHub](https://github.com/sachinchoolur/lg-video) - [Docs](https://sachinchoolur.github.io/lightGallery/docs/api.html#lg-video)
4. Fullscreen - [GItHub](https://github.com/sachinchoolur/lg-fullscreen) - [Docs](https://sachinchoolur.github.io/lightGallery/docs/api.html#lg-fullscreen)
5. Pager - [GItHub](https://github.com/sachinchoolur/lg-pager) - [Docs](https://sachinchoolur.github.io/lightGallery/docs/api.html#lg-pager)
6. Zoom - [GItHub](https://github.com/sachinchoolur/lg-zoom) - [Docs](https://sachinchoolur.github.io/lightGallery/docs/api.html#lg-zoom)
7. Hash - [GItHub](https://github.com/sachinchoolur/lg-hash) - [Docs](https://sachinchoolur.github.io/lightGallery/docs/api.html#lg-hash)
8. Share - [GItHub](https://github.com/sachinchoolur/lg-share) - [Docs](https://sachinchoolur.github.io/lightGallery/docs/api.html#lg-share)

License
---

#### Commercial license
If you want to use lightGallery to develop commercial sites, themes, projects, and applications, the Commercial license is the appropriate license. With this option, your source code is kept proprietary. Purchase a lightGallery Commercial License at [uplabs.com/posts/lightgallery-plugin](https://www.uplabs.com/posts/lightgallery-plugin)

#### Open source license

If you are creating an open source application under a license compatible with the GNU GPL license v3, you may use this project under the terms of the GPLv3.
