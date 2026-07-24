---
title: Events
description: lightGallery custom events documentation.
lead: lightGallery emits several custom events throughout the gallery lifecycle. This can be used to customize the gallery or to add your own features. <a href="../../demos/events/">Demo</a>
date: 2020-10-06T08:48:57.000Z
draft: false
images: []
menu: {docs: {parent: API Docs}}
weight: 3
toc: true
---

## Usage example

lightGallery custom events can be attached to the HTML element that you are
using to initialize the gallery. Every custom event holds useful plugin data
that can be used to control or customize lightGallery. Make sure that you attach
event listeners before initializing lightGallery

```javascript
const lg = document.getElementById('custom-events-demo');

// Perform any action just before opening the gallery
lg.addEventListener('lgBeforeOpen', () => {
    alert('onBeforeOpen');
});

// custom event with useful plugin data
lg.addEventListener('lgBeforeSlide', (event) => {
    const { index, prevIndex } = event.detail;
    alert(index, prevIndex);
});

lightGallery(lg);
```

## Available custom events

Here you can find the list of available custom events. Most of the events
provide useful lightGallery data via the event detail object. The table in each
event section represents the event detail object.

<div class="event-docs-list">
    {{< events interface="InitDetail" >}}
    {{< events interface="BeforeOpenDetail" >}}
    {{< events interface="AfterOpenDetail" >}}
    {{< events interface="AfterAppendSlideEventDetail" >}}
    {{< events interface="AfterAppendSubHtmlDetail" >}}
    {{< events interface="SlideItemLoadDetail" >}}
    {{< events interface="HasVideoDetail" >}}
    {{< events interface="BeforeSlideDetail" >}}
    {{< events interface="AfterSlideDetail" >}}
    {{< events interface="BeforeNextSlideDetail" >}}
    {{< events interface="BeforePrevSlideDetail" >}}
    {{< events interface="PosterClickDetail" >}}
    {{< events interface="DragStartDetail" >}}
    {{< events interface="DragMoveDetail" >}}
    {{< events interface="DragEndDetail" >}}
    {{< events interface="ContainerResizeDetail" >}}
    {{< events interface="BeforeCloseDetail" >}}
    {{< events interface="AfterCloseDetail" >}}
    {{< events interface="RotateLeftDetail" >}}
    {{< events interface="RotateRightDetail" >}}
    {{< events interface="FlipHorizontalDetail" >}}
    {{< events interface="FlipVerticalDetail" >}}
</div>
