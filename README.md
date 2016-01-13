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
* Youtube Vimeo Dailymotion and html5 videos Support.
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

    <!-- lightgallery plugins -->
    <script src="js/lg-thumbnail.min.js"></script>
    <script src="js/lg-fullscreen.min.js"></script>
</body>  
```
##### The markup
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

#### Support lightgallery
If you like lightgallery please support the project by staring the repository or <a href="https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fabout.twitter.com%2Fresources%2Fbuttons&ref_src=twsrc%5Etfw&text=lightGallery%20-%20The%20complete%20%23jQuery%20lightbox%20gallery%20plugin.%20%23javascript&tw_p=tweetbutton&url=http%3A%2F%2Fsachinchoolur.github.io%2FlightGallery%2F" target="_blank">tweet</a> about this project.

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
1. [Thumbnail](http://sachinchoolur.github.io/lightGallery/docs/api.html#lg-thumbnial)
2. [Autoplay](http://sachinchoolur.github.io/lightGallery/docs/api.html#lg-autoplay)
3. [Video](http://sachinchoolur.github.io/lightGallery/docs/api.html#lg-video)
4. [Fullscreen](http://sachinchoolur.github.io/lightGallery/docs/api.html#lg-fullscreen)
4. [Pager](http://sachinchoolur.github.io/lightGallery/docs/api.html#lg-pager)
4. [Zoom](http://sachinchoolur.github.io/lightGallery/docs/api.html#lg-zoom)
4. [Hash](http://sachinchoolur.github.io/lightGallery/docs/api.html#lg-hash)

Support
----
Please use GitHub [issue tracker](https://github.com/sachinchoolur/lightGallery/issues/new) in the event that you have come across a bug or glitch. It would also be very helpful if you could add a jsFiddle, which would allow you to demonstrate the problem in question.

You can post a comment [here](http://sachinchoolur.github.io/lightGallery/#comments) to leave feedback, and offer any feature suggestions you may have for Lightgallery.

Please use [stackoverflow](https://stackoverflow.com/search?q=lightgallery) instead of github issue tracker if you need any help with implementing lightgallery in your project or if you have any personal support requests. **If you need any special customization, feature or support email me at _sachi77n@gmail.com_. I can do it for reasonable price.**

Do you like lightgallery? You can support the project by staring the github repository or [tweet](https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fabout.twitter.com%2Fresources%2Fbuttons&ref_src=twsrc%5Etfw&text=lightGallery%20-%20The%20complete%20%23jQuery%20lightbox%20gallery%20plugin.%20%23javascript&tw_p=tweetbutton&url=http%3A%2F%2Fsachinchoolur.github.io%2FlightGallery%2F) about this project.

Follow me on twitter [@sachinchoolur](https://twitter.com/sachinchoolur) for the latest news, updates about this project.

Other Projects
----
#####[jQuery lightslider](https://github.com/sachinchoolur/lightslider)
> lightSlider is a lightweight responsive Content slider with carousel thumbnails navigation.

#####[Angular flash](https://github.com/sachinchoolur/angular-flash)
> A simple lightweight flash message module for angularjs

#####[ladda-angular](https://github.com/sachinchoolur/ladda-angular)
> Ladda button directive for angularjs

#####[Teamwave](http://www.teamwave.com/?kid=676V2)
> Integrated Suite of Business Applications.. (Not an open source project but free for the first 1,000 Companies!)



