---
title: 'React image gallery'
description: Full featured, responsive image gallery component for React.
lead:
    Use lightGallery React component to build beautiful image gallery lightBox.
    lightGallery react component support all the feature of lightGallery such as
    pinch to zoom, rotate, flip images, social sharing, animated thumbnails,
    etc.
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
    demos:
        parent: 'Demos'
weight: 21
toc: true
---

#### Demo

{{< masonry-layout id="masonry-gallery-demo" >}}

{{< demoButtons js="https://codepen.io/light-gallery/pen/jOdeQYJ" react="https://stackblitz.com/edit/stackblitz-starters-gyrdgu" >}}

##### React

```js
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import { LightGallery as ILightGallery } from 'lightgallery/lightgallery';
import './style.scss';

export const App = () => {

    const dynamicEl = [
        {
            src: '...',
            responsive: '...',
            thumb: '...',
            subHtml: `...`,
        },
        {
            src: '...',
            responsive: '...',
            subHtml: `...`,
        },
        // Add more placeholder images as needed
    ];

    return (
        <>
            <LightGallery
                dynamic={true}
                dynamicEl={dynamicEl}
            />
        </>
    );
};
```
