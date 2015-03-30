jQuery lightGallery
=============


Demo
----------------
[JQuery lightGallery demo](http://sachinchoolur.github.io/lightGallery/)

Description
----------------
JQuery lightGallery is a lightweight jQuery lightbox gallery for displaying image and video gallery

what's new
----------------
+   Animated thumbnails.
+   Local html5 video support
+   Custom Html inseted of caption and description.
+   Custom selector property insted of just child.
+   destroy() method.
+   isActive() to check gallery active state.
+   iframe support.
+   showAfterLoad settings to show content once it is fully loaded
+   Callback parameter(plugin).
+   HTML support. inline and external.
+   currentPagerPosition setting to set Position of selected thumbnail.
+   Show Thumbnail by default option.
+   Added support for youtube player parameters to modify player appearance and functionality

Main Features
----------------


+    Responsive layout.
+    Touch support for mobile devices.
+    Animated thumbnails.
+    CSS transitions with jQuery fallback
+    Youtube Vimeo Video and html5 videos Support
+    Slide and Fade Effects
+    Chrome, Safari, Firefox, Opera, IE7+, IOS, Android, windows phone.
+    HTML iframe support.
+    Multiple instances on one page
+    Easily customizable via CSS and Settings
+    Lightweight (7kb) (minified)
+    Separate images for mobile devices
+    Can be extended with callbacks
+    Smart image preloading and code optimization
+    Keyboard Navigation for desktop
+    Font icon support



How to use lightGallery?
--------------------

### Bower

You can Install lightgallery using the [Bower](http://bower.io) package manager.

```sh
$ bower install lightgallery
```

### npm

You can also find lightgallery on [npm](http://npmjs.org).

```sh
$ npm install lightgallery
```

### The code ###

Add the Following code to the &lt;head&gt; of your document.

```html
<link type="text/css" rel="stylesheet" href="css/lightGallery.css" />
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="js/lightGallery.js"></script>
// Do not include both lightGallery.js and lightGallery.min.js
```

### HTML Structure ###

Create ul and li elements and add the path of the image or video inside the data-src attributes which you wish to open within the lightGallery.

```html
<ul id="light-gallery">
  <li data-src="img/img1.jpg">
    <img src="img/thumb1.jpg" />
  </li>
  <li data-src="img/img2.jpg">
    <img src="img/thumb2.jpg" />
  </li>
  ...
</ul>
```
### Data attributes ###

```html
    <!-- the image/video source for mobile devices -->
    <li data-responsive-src="mobile1.jpg" > </li>
    <!-- the large version of your image/video -->
    <li data-src="img1.jpg" > </li>

    <!-- Custom html5 video html (will be inserted same like youtube vimeo videos) -->
    <li data-html="video html" /> </li>
    <!-- id or class name of an object(div) which contain your html. -->
    <li data-html="#inline-html" > </li>

    <!-- Custom html (Caption description comments ...) -->
    <li data-sub-html="<h3>My caption</h3><p>My description..</p>" /> </li>
    <!-- id or class name of an object(div) which contain your html. -->
    <li data-sub-html="#inline-sub-html" > </li>

    <!-- If true your src will be displayed in an iframe.. -->
    <li data-iframe="true" data-src="http://www.w3schools.com/" > </li>
```

### Call lightGallery! ###

```html
<script type="text/javascript">
  $(document).ready(function() {
    $("#light-gallery").lightGallery();
  });
</script>
```

### Play with settings ###

```html
    <script type="text/javascript">
      $(document).ready(function() {
        $("#light-gallery").lightGallery({

          mode: 'slide',
          useCSS: true,
          cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',//
          easing: 'linear', //'for jquery animation',//
          speed: 600,
          addClass: '',

          closable: true,
          loop: false,
          auto: false,
          pause: 4000,
          escKey: true,
          controls: true,
          hideControlOnEnd: false,

          preload: 1, //number of preload slides. will exicute only after the current slide is fully loaded. ex:// you clicked on 4th image and if preload = 1 then 3rd slide and 5th slide will be loaded in the background after the 4th slide is fully loaded.. if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
          showAfterLoad: true,
          selector: null,
          index: false,

          lang: {
              allPhotos: 'All photos'
          },
          counter: false,

          exThumbImage: false,
          thumbnail: true,
          showThumbByDefault:false,
          animateThumb: true,
          currentPagerPosition: 'middle',
          thumbWidth: 100,
          thumbMargin: 5,


          mobileSrc: false,
          mobileSrcMaxWidth: 640,
          swipeThreshold: 50,
          enableTouch: true,
          enableDrag: true,

          vimeoColor: 'CCCCCC',
          youtubePlayerParams: false, // See: https://developers.google.com/youtube/player_parameters,
          videoAutoplay: true,
          videoMaxWidth: '855px',

          dynamic: false,
          dynamicEl: [],

          // Callbacks el = current plugin
          onOpen        : function(el) {}, // Executes immediately after the gallery is loaded.
          onSlideBefore : function(el) {}, // Executes immediately before each transition.
          onSlideAfter  : function(el) {}, // Executes immediately after each transition.
          onSlideNext   : function(el) {}, // Executes immediately before each "Next" transition.
          onSlidePrev   : function(el) {}, // Executes immediately before each "Prev" transition.
          onBeforeClose : function(el) {}, // Executes immediately before the start of the close process.
          onCloseAfter  : function(el) {}, // Executes immediately once lightGallery is closed.

        });
    });
    </script>
```

In-depth explanation of settings can be found on a [separate page](http://sachinchoolur.github.io/lightGallery/settings.html).

### Public methods ###

```html
    <script type="text/javascript">
    $(document).ready(function() {
        var gallery = $("#light-gallery").lightGallery();
        gallery.isActive(); //check active state of lightGallery;
        gallery.destroy(); //to destroy the plugin on the given element.
    });
    </script>
```
### Report an Issue ###
If you think you might have found a bug or if you have a feature suggestion please use github [issue tracker](https://github.com/sachinchoolur/lightGallery/issues/new). Also please try to add a jsfiddle that demonstrates your problem 

If you need any help with implementing lightGallery in your project or if have you any personal support requests i requset you to please use [stackoverflow](https://stackoverflow.com/) instead of github issue tracker



If you like lightGallery support me by staring this repository or tweet about this project.
[@sachinchoolur](https://twitter.com/sachinchoolur)
