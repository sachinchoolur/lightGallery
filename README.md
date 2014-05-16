jQuery lightGallery
=============


Demo
----------------
[JQuery lightGallery demo](http://sachinchoolur.github.io/lightGallery/)

Description
----------------
JQuery lightGallery is a lightweight jQuery lightbox gallery for displaying image and video gallery

Main Features
----------------

+   Responsive layout.
+   Touch support for mobile devices.
+   CSS transitions with jQuery fallback.
+   Youtube Vimeo Video Support.
+   Slide and Fade Effects.
+   Chrome, Safari, Firefox, Opera, IE7+, IOS, Android, windows phone.
+   Image captions and descriptions.
+   Multiple sliders on the same page.
+   Easily customizable via CSS and Settings.
+   Lightweight (8kb) (minified).
+   Thumbnail support.
+   Separate images for mobile devices
+   Can be extended with callbacks
+   Smart image preloading and code optimization
+   Keyboard Navigation for desktop
+   Font icon support


How to use lightGallery?
--------------------

### The code ###
add the Following code to the &lt;head&gt; of your document.
```html
<link type="text/css" rel="stylesheet" href="css/lightGallery.css" />           
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="js/lightGallery.js"></script>
// Do not include both lightGallery.js and lightGallery.min.js
```
### HTML Structure ###
Create ul and li elements and add the path of the image or video inside the data-src attributes which you wish to open within the lightGallery.
```html
<ul id="lightGallery">
  <li data-src="img/img1.jpg">
    <img src="img/thumb1.jpg" />
  </li>
  <li data-src="img/img2.jpg">
    <img src="img/thumb2.jpg" />
  </li>
  ...
</ul>
```
### Call lightGallery! ###
```html
<script type="text/javascript">
  $(document).ready(function() {
    $("#lightGallery").lightGallery(); 
  });
</script>
```
### Play with settings ###
```html
<script type="text/javascript">
  $(document).ready(function() {
    $("#lightGallery").lightGallery({
      // Elements
      thumbnail   : true  // Whether to display a button to show thumbnails.
      caption     : false // Enables image captions. Content is taken from "data-title" attribute.
      captionLink : false // Makes image caption a link. URL is taken from "data-link" attribute.
      desc        : false // Enables image descriptions. Description is taken from "data-desc" attr.
      counter     : false // Shows total number of images and index number of current image.
      controls    : true  // Whether to display prev/next buttons.

      // Transitions
      mode   : 'slide'  // Type of transition between images. Either 'slide' or 'fade'.
      useCSS : true     // Whether to always use jQuery animation for transitions or as a fallback.
      easing : 'linear' // Value for CSS "transition-timing-function" prop. and jQuery .animate().
      speed  : 1000     // Transition duration (in ms).

      // Navigation
      hideControlOnEnd : false // If true, prev/next button will be hidden on first/last image.
      loop             : false // Allows to go to the other end of the gallery at first/last img.
      auto             : false // Enables slideshow mode.
      pause            : 4000  // Delay (in ms) between transitions in slideshow mode.
      escKey           : true  // Whether lightGallery should be closed when user presses "Esc".

      // Mobile devices
      mobileSrc         : false // If "data-responsive-src" attr. should be used for mobiles.
      mobileSrcMaxWidth : 640   // Max screen resolution for alternative images to be loaded for.
      swipeThreshold    : 50    // How far user must swipe for the next/prev image (in px).

      // Video
      vimeoColor    : 'CCCCCC' // Vimeo video player theme color (hex color code).
      videoAutoplay : true     // Set to false to disable video autoplay option.
      videoMaxWidth : 855      // Limits video maximal width (in px).

      // i18n
      lang : { allPhotos: 'All photos' } // Text of labels.

      // Callbacks
      onOpen        : function() {} // Executes immediately after the gallery is loaded.
      onSlideBefore : function() {} // Executes immediately before each transition.
      onSlideAfter  : function() {} // Executes immediately after each transition.
      onSlideNext   : function() {} // Executes immediately before each "Next" transition.
      onSlidePrev   : function() {} // Executes immediately before each "Prev" transition.
      onBeforeClose : function() {} // Executes immediately before the start of the close process.
      onCloseAfter  : function() {} // Executes immediately once lightGallery is closed.

      // Dynamical load
      dynamic   : false // Set to true to build a gallery based on the data from "dynamicEl" opt.
      dynamicEl : []    // Array of objects (src, thumb, caption, desc, mobileSrc) for gallery els.

      // Misc
      rel          : false // Combines containers with the same "data-rel" attr. into 1 gallery.
      exThumbImage : false // Name of a "data-" attribute containing the paths to thumbnails.
    );
  });
</script>
```

In-depth explanation of settings can be found on a [separate page](http://sachinchoolur.github.io/lightGallery/settings.html).