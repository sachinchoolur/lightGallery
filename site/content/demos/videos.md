---
title: 'Videos Gallery'
description: 'lightGallery allows you to build image/video galleries.'
lead:
    'lightGallery comes with a lot of options, events, and methods to customize
    the gallery without touching the core code. You can find both lightGallery
    core options, and the built in plugin options here.'
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 020
toc: true
---

#### YouTube, Vimeo Video Gallery

<p>lightGallery supports YouTube, Vimeo, VK and all other types of HTML5 video formats. Such as MP4, WebM, Ogg, etc. </p>

<p>To display YouTube, Vimeo or VK video, you can paste the video URL, or share URL, which is provided by YouTube / vimeo in the data-src attribute. The same way you display images in the gallery. lightGallery will check the data-src attribute and if it is YouTube or vimeo video URL, it will create the video slide.</p>

<p>You can even provide poster image for each videos. Poster images will be loaded instead of videos. So user will be able to navigate to other slides by using mouse drag or swipe. Poster images improve performance, and maintain the flexibility of your gallery without effecting user experience. Videos will be loaded when a user clicks on the poster images. You can place poster image url in the data-poster attribute.</p>

<p>lightGallery allows you to load thumbnail images automatically from YouTube, Vimeo or VK. You can specify the size of the thumbnails in the settings. Videos will be automatically paused when a user starts to navigate to another slide. So user never have to worry about it. lightGallery takes care of everything! </p>

<div class="gallery-demo">
    <ul id="lightGallery-videos" class="list-unstyled row">
        <li title="new title1" class="col-xs-6 col-sm-4 col-md-3" data-src="https://www.youtube.com/watch?v=ymarrXoi0ZM" data-sub-html="<h4>Fading Light</h4><p>Classic view from Rigwood Jetty on Coniston Water an old archive shot similar to an old post but a little later on.</p>">
            <img class="img-responsive" src="/images/demo/image-1-thumb.jpg">
            </li>
        <li class="col-xs-6 col-sm-4 col-md-3" data-src="https://www.youtube.com/watch?v=IUN664s7N-c" data-sub-html="<h4>Bowness Bay</h4><p>A beautiful Sunrise this morning taken En-route to Keswick not one as planned but I'm extremely happy I was passing the right place at the right time....</p>"><img alt="xys" class="img-responsive" src="/images/demo/image-2-thumb.jpg"></li>
        <li class="col-xs-6 col-sm-4 col-md-3" data-responsive="img/13-375.jpg 375, img/13-480.jpg 480, img/13.jpg 800" data-src="img/13-1600.jpg" data-sub-html="<h4>Bowness Bay</h4><p>A beautiful Sunrise this morning taken En-route to Keswick not one as planned but I'm extremely happy I was passing the right place at the right time....</p>"><img class="img-responsive" src="img/thumb-13.jpg"></li>
        <li class="col-xs-6 col-sm-4 col-md-3" data-responsive="img/4-375.jpg 375, img/4-480.jpg 480, img/4.jpg 800" data-src="img/4-1600.jpg" data-sub-html="<h4>Bowness Bay</h4><p>A beautiful Sunrise this morning taken En-route to Keswick not one as planned but I'm extremely happy I was passing the right place at the right time....</p>"><img class="img-responsive" src="img/thumb-4.jpg"></li>
    </ul>
</div>
