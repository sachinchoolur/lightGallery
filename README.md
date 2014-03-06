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
add the Following code to the <head> of your document.
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
      mode:'slide',
    useCSS : true,
    easing: 'ease',//'cubic-bezier(0.25, 0, 0.25, 1)',//
    speed: 1000,
    loop: false,
    auto: false,
    pause: 4000,
    escKey:true,
    
    exThumbImage: false,
    thumbnail: true,
    caption:false,
    desc:false,
    controls:true,
    hideControlOnEnd:false,
    mobileSrc: false,
    mobileSrcMaxWidth :640,

    //touch
    swipeThreshold: 50,

    rel:false,
    dynamic:false,
    dynamicEl : [],
    
    //video
    vimeoColor : 'CCCCCC',
    videoAutoplay:true,
    videoMaxWidth:855,
    
    //callbacks
    onOpen: function() {},
    onSlideBefore: function() {},
    onSlideAfter: function() {},
    onSlideNext: function() {},
    onSlidePrev: function() {},
    onBeforeClose: function(){},
    onCloseAfter: function(){}
    });
  });
</script>
```