---
title: 'lightGallery React'
description: 'Full featured image and video gallery component for react'
lead: 'Full featured image and video gallery component for react.'
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    docs:
        parent: 'API Docs'
        name: 'React'
weight: 7
toc: true
---

<a class="btn btn-outline-primary" href="https://stackblitz.com/edit/lightgallery-react" target="_blank">StackBlitz
Demo</a>

## Installation

Follow the below steps to use lightGallery react component in your application.
React component is part of the main lightGallery package on NPM. You can import
it using the following way

-   Install lightGallery via NPM

```
npm install lightgallery
```

-   Import react component and styles

```jsx
import LightGallery from 'lightgallery/react';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

// If you want you can use SCSS instead of css
import 'lightgallery/scss/lightgallery.scss';
import 'lightgallery/scss/lg-zoom.scss';

// import plugins if you need
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

function Gallery() {
    const onInit = () => {
        console.log('lightGallery has been initialized');
    };
    return (
        <div className="App">
            <LightGallery
                onInit={onInit}
                speed={500}
                plugins={[lgThumbnail, lgZoom]}
            >
                <a href="img/img1.jpg">
                    <img alt=".." src="img/thumb1.jpg" />
                </a>
                <a href="img/img2.jpg">
                    <img alt=".." src="img/thumb2.jpg" />
                </a>
                ...
            </LightGallery>
        </div>
    );
}
```

## Props and methods

All lightGallery settings can be passed to react component as props.
Additionally, you can use lifecycle hook methods listed below to hook into
lightGalley component lifecycle. Almost every method passes a detail object
which holds useful plugin data. Also, you can pass additional classnames to the
lightGallery react wrapper element via `elementClassNames` prop

#### usage example

```js
function Gallery() {
    const onBeforeSlide = (detail) => {
        const { index, prevIndex } = detail;
        console.log(index, prevIndex);
    };
    return (
        <div className="App">
            <LightGallery
                elementClassNames="custom-wrapper-class"
                onBeforeSlide={onBeforeSlide}
            >
                <a href="img/img1.jpg">
                    <img alt=".." src="img/thumb1.jpg" />
                </a>
                ...
            </LightGallery>
        </div>
    );
}
```

<div class="event-docs-list">
    {{< callbacks interface="InitDetail" >}}
    {{< callbacks interface="BeforeOpenDetail" >}}
    {{< callbacks interface="AfterOpenDetail" >}}
    {{< callbacks interface="AfterAppendSlideEventDetail" >}}
    {{< callbacks interface="AfterAppendSubHtmlDetail" >}}
    {{< callbacks interface="SlideItemLoadDetail" >}}
    {{< callbacks interface="HasVideoDetail" >}}
    {{< callbacks interface="BeforeSlideDetail" >}}
    {{< callbacks interface="AfterSlideDetail" >}}
    {{< callbacks interface="BeforeNextSlideDetail" >}}
    {{< callbacks interface="BeforePrevSlideDetail" >}}
    {{< callbacks interface="PosterClickDetail" >}}
    {{< callbacks interface="DragStartDetail" >}}
    {{< callbacks interface="DragMoveDetail" >}}
    {{< callbacks interface="DragEndDetail" >}}
    {{< callbacks interface="ContainerResizeDetail" >}}
    {{< callbacks interface="BeforeCloseDetail" >}}
    {{< callbacks interface="AfterCloseDetail" >}}
</div>
