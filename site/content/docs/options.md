---
title: 'Options'
description: 'lightGallery options.'
lead:
    'lightGallery comes with a lot of options, events, and methods to customize
    the gallery without touching the core code. You can find both lightGallery
    core options, and the built in plugin options here.'
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    docs:
        parent: 'API Docs'
weight: 2
toc: true
---

## Passing options

```javascript
lightGallery(document.getElementById('gallery-container'), {
    speed: 500,
    mode: 'fade',
    ...Other options
});
```

## lightGallery core

{{< options interface="LightGallerySettings" variable="lightGallerySettings">}}

<div class="options-section">

<div class="options-section">

## Zoom Plugin

{{< options pluginName="Zoom" interface="ZoomSettings" variable="zoomSettings">}}

</div>
<div>

<div class="options-section">

## Thumbnails plugin

{{< options pluginName="Thumbnails" interface="ThumbnailsSettings" variable="thumbnailsSettings">}}

</div>

<div class="options-section">

## Video plugin

{{< options pluginName="Video" interface="VideoSettings" variable="videoSettings">}}

</div>

<div class="options-section">

## Hash plugin

{{< options pluginName="Hash" interface="HashSettings" variable="hashSettings">}}

</div>

<div class="options-section">

## Autoplay plugin

{{< options pluginName="Autoplay" interface="AutoplaySettings" variable="autoplaySettings">}}

</div>

<div class="options-section">

## Rotate plugin

{{< options pluginName="Rotate" interface="RotateSettings" variable="rotateSettings">}}

</div>

<div class="options-section">

## Share plugin

{{< options pluginName="Share" interface="ShareSettings" variable="shareSettings">}}

</div>

<div class="options-section">

## Pager plugin

{{< options pluginName="Pager" interface="PagerSettings" variable="pagerSettings">}}

</div>

<div class="options-section">

## FullScreen plugin

{{< options pluginName="FullScreen" interface="FullscreenSettings" variable="fullscreenSettings">}}

</div>

<div class="options-section">

## Comment box plugin

{{< options pluginName="Comment box" interface="CommentSettings" variable="commentSettings">}}

</div>
