---
title: Settings
description: lightGallery settings.
lead: lightGallery comes with a lot of settings, events, and methods to customize the gallery without touching the core code. You can find both lightGallery core settings, and the built in plugin settings here.
date: 2020-10-06T08:48:57.000Z
draft: false
images: []
menu: {docs: {parent: API Docs}}
weight: 2
toc: true
---

## Passing settings

lightGallery accepts two parameters, an HTML element as the first parameter and
library settings as the second parameter. You need to pass settings only if you
want to modify default behaviors

```javascript
lightGallery(document.getElementById('gallery-container'), {
    speed: 500,
    mode: 'lg-fade',
    ...Other settings
});
```

## lightGallery core

LightGallery comes with modular architecture. All the basic functionalities are
available in the core module. You need to include plugins such if you need
additional functionalities such as thumbnails, vide support, zoom, etc. Here you
can find all lightGallery core settings. If you think something is missing,
please check the respective plugins settings as well.

{{< options interface="LightGalleryCoreSettings" variable="lightGalleryCoreSettings" >}}

<div class="options-section">

## Zoom Plugin

LightGallery zoom plugins enable functionalities like pinch to zoom, double-tap,
or double click to see the actual size, zoom in, zoom out, and more.

{{< options pluginName="Zoom" interface="ZoomSettings" variable="zoomSettings" >}}

</div>

<div class="options-section">

## Thumbnails plugin

Thumbnails plugins is required to generate thumbnails for your gallery, it
supports features like animated thumbnails, automatically load thumbnails from
external videos, and more.

{{< options pluginName="Thumbnails" interface="ThumbnailsSettings" variable="thumbnailsSettings" >}}

</div>

<div class="options-section">

## Video plugin

Video plugin is required to display videos in lightGallery. Video plugin
supports, YouTube, Vimeo, Wistia,and HTML5 videos.

<div class="alert alert-info" role="alert">
    <b>Dependency</b> - You need to include <a href="https://github.com/vimeo/player.js/">player.js</a> for Vimeo videos and <a href="https://wistia.com/support/developers/player-api">Wistia player API</a> for Wistia videos on your docment to enable video player feature like automatic play pause, automatically navigate to next slide when video ended.
</div>

{{< options pluginName="Video" interface="VideoSettings" variable="videoSettings" >}}

</div>

<div class="options-section">

## Hash plugin

lightGallery hash plugin lets you provide custom unique URLs for each gallery
image. This link can be used to share media anywhere on the web. It allows you
to navigate to different slides via browser back/forward buttons too.

{{< options pluginName="Hash" interface="HashSettings" variable="hashSettings" >}}

</div>

<div class="options-section">

## Autoplay plugin

lightGallery autoplay plugin supports automatic slideshow which can be stopped
on the first user action. It supports progress bar that indicates the duration
of the current slide.

{{< options pluginName="Autoplay" interface="AutoplaySettings" variable="autoplaySettings" >}}

</div>

<div class="options-section">

## Rotate plugin

Rotate plugin support features like rotate clockwise, rotate anticlockwise, flip
horizontal, flip vertical with single click.

{{< options pluginName="Rotate" interface="RotateSettings" variable="rotateSettings" >}}

</div>

<div class="options-section">

## Share plugin

lightGallery share plugin allows you to share your images/videos to social media
platforms such as Twitter or Facebook with unique url. It supports adding your
own social share button too.

{{< options pluginName="Share" interface="ShareSettings" variable="shareSettings" >}}

</div>

<div class="options-section">

## Pager plugin

If you prefer minimal layouts, you can opt pagers plugin instead of thumbnails
using the pager plugin. Pagers create minimal graphics that represent each
slide, and hovering over each pager item, shows the correspondent thumbnails.

{{< options pluginName="Pager" interface="PagerSettings" variable="pagerSettings" >}}

</div>

<div class="options-section">

## FullScreen plugin

lightGallery Fullscreen plugin supports native HTML5 fullscreen feature in the
gallery. you can toggle fullscreen with one click

{{< options pluginName="FullScreen" interface="FullscreenSettings" variable="fullscreenSettings" >}}

</div>

<div class="options-section">

## Comment box plugin

Comment plugin supports FaceBook and Disqus comments out of the box. Allows
people to comment on slides using their Facebook or Disqus accounts. You can
easily add your own comment widget as well.

{{< options pluginName="Comment box" interface="CommentSettings" variable="commentSettings" >}}

</div>

<div class="options-section">

## Medium zoom plugin

MediumZoom plugin helps you create similar zooming experience as seen on medium.
This is a very basic plugin created just to demonstrate the customizability of
lightGallery
<span class="badge rounded-pill bg-danger font-12" title="Available since version 2.1.0">v2.1.0</span>

{{< options pluginName="Medium zoom" interface="MediumZoomSettings" variable="mediumZoomSettings" >}}

</div>

<div class="options-section">

## Vimeo thumbnails plugin

Vimeo thumbnails plugin helps you load thumbnails automatically for Vimeo videos.
<span class="badge rounded-pill bg-danger font-12" title="Available since version 2.5.0">v2.5.0</span>

{{< options pluginName="Vimeo Thumbnails" interface="VimeoThumbnailSettings" variable="vimeoSettings" >}}

</div>
