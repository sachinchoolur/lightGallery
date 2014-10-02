jQuery lightGallery
=============


Demo
----------------
[JQuery lightGallery demo](http://sachinchoolur.github.io/lightGallery/)

Description
----------------
JQuery lightGallery is a lightweight jQuery lightbox gallery for displaying image and video gallery

Changelog
----------------
#### Added ####
+   Animated thumbnails. 
+   Custom Html inseted of caption and description.
+   Custom selector property insted of just child.
+   destroy() method.
+   isActive() to check gallery active state.
+   iframe support.
+   showAfterLoad settings to show content once it is fully loaded
+   Callback parameter(plugin).
+   HTML support. inline and external.
+   currentPagerPosition setting to set Position of selected thumbnail.

#### Removed ####
+   Gallery relation. 
+   captionLink
+   caption
+   desc

Main Features
----------------


+    Responsive layout.
+    Touch support for mobile devices.
+    Animated thumbnails.
+    CSS transitions with jQuery fallback
+    Youtube Vimeo Video Support
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
### Data attributes ###
```html
    <!-- the image/video source for mobile devices -->
    <li data-responsive-src="mobile1.jpg" > </li>
    <!-- the large version of your image/video -->
    <li data-src="img1.jpg" > </li>
     
    <!-- Custom html (Caption description comments ...) -->
    <li data-html="<h3>My caption</h3><p>My description..</p>" /> </li>
    <!-- id or class name of an object(div) which contain your html. -->
    <li data-html="#inlineHtml" > </li>
     
    <!-- Remote URL which you want to load.. -->
    <li data-url="myCustomHtml.html" > </li>
     
    <!-- If true your src will be displayed in an iframe.. -->
    <li data-iframe="true" data-src="http://www.w3schools.com/" > </li>
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

          mode   : 'slide',  // Type of transition between images. Either 'slide' or 'fade'.
          useCSS : true,     // Whether to always use jQuery animation for transitions or as a fallback.
          cssEasing : 'ease', // Value for CSS "transition-timing-function".
          easing: 'linear', //'for jquery animation',//
          speed  : 600,     // Transition duration (in ms).
          addClass  : '',       // Add custom class for gallery.
          
          preload         : 1,    //number of preload slides. will exicute only after the current slide is fully loaded. ex:// you clicked on 4th image and if preload = 1 then 3rd slide and 5th slide will be loaded in the background after the 4th slide is fully loaded.. if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
          showAfterLoad   : true,  // Show Content once it is fully loaded.
          selector        : null,  // Custom selector property insted of just child.
          index           : false, // Allows to set which image/video should load when using dynamicEl.
          html            : false,  // Enables custon html. Content is taken from "data-html" / "data-url" attributes.

          dynamic   : false, // Set to true to build a gallery based on the data from "dynamicEl" opt.
          dynamicEl : [],    // Array of objects (src, thumb, caption, desc, mobileSrc) for gallery els.

          thumbnail            : true,     // Whether to display a button to show thumbnails.
          exThumbImage         : false,    // Name of a "data-" attribute containing the paths to thumbnails.
          animateThumb         : true,     // Enable thumbnail animation.
          currentPagerPosition : 'middle', // Position of selected thumbnail.
          thumbWidth           : 100,      // Width of each thumbnails
          thumbMargin          : 5,        // Spacing between each thumbnails 

          controls         : true,  // Whether to display prev/next buttons.
          hideControlOnEnd : false, // If true, prev/next button will be hidden on first/last image.
          loop             : false, // Allows to go to the other end of the gallery at first/last img.
          auto             : false, // Enables slideshow mode.
          pause            : 4000,  // Delay (in ms) between transitions in slideshow mode.
          escKey           : true,  // Whether lightGallery should be closed when user presses "Esc".
          closable         : true,  //allows clicks on dimmer to close gallery

          counter      : false, // Shows total number of images and index number of current image.
          lang         : { allPhotos: 'All photos' }, // Text of labels.

          mobileSrc         : false, // If "data-responsive-src" attr. should be used for mobiles.
          mobileSrcMaxWidth : 640,   // Max screen resolution for alternative images to be loaded for.
          swipeThreshold    : 50,    // How far user must swipe for the next/prev image (in px).

          vimeoColor    : 'CCCCCC', // Vimeo video player theme color (hex color code).
          videoAutoplay : true,     // Set to false to disable video autoplay option.
          videoMaxWidth : 855,      // Limits video maximal width (in px).

          // Callbacks plugin = current plugin
          onOpen        : function(plugin) {}, // Executes immediately after the gallery is loaded.
          onSlideBefore : function(plugin) {}, // Executes immediately before each transition.
          onSlideAfter  : function(plugin) {}, // Executes immediately after each transition.
          onSlideNext   : function(plugin) {}, // Executes immediately before each "Next" transition.
          onSlidePrev   : function(plugin) {}, // Executes immediately before each "Prev" transition.
          onBeforeClose : function(plugin) {}, // Executes immediately before the start of the close process.
          onCloseAfter  : function(plugin) {}, // Executes immediately once lightGallery is closed.
                
        });
    });
    </script>
```

In-depth explanation of settings can be found on a [separate page](http://sachinchoolur.github.io/lightGallery/settings.html).

### Public methods ###
```html
    <script type="text/javascript">
    $(document).ready(function() {
        var gallery = $("#lightGallery").lightGallery();
        gallery.isActive(); //check active state of lightGallery;
        gallery.destroy(); //to destroy the plugin on the given element.
    });
    </script>
```