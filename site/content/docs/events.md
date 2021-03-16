---
title: 'Events'
description: 'lightGallery custom events documentation.'
lead:
    'lightGallery emits several custom events throughout the gallery lifecycle.
    This can be used to customize the gallery or to add your own features. <a
    href="/demos/events/">Demo</a>'
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    docs:
        parent: 'Getting started'
weight: 3
toc: true
---

## Usage example

```javascript
const lg = document.getElementById('custom-events-demo');

// Perform any action just before opening the gallery
lg.addEventListener('beforeOpen', () => {
    alert('onBeforeOpen');
});

// custom event with extra parameters
lg.addEventListener('beforeSlide', (event) => {
    const { index, prevIndex } = event.detail;
    alert(index, prevIndex);
});

lightGallery(lg);
```

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
