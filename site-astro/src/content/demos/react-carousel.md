---
title: React carousel
description: Full featured, Responsive carousel component for React.
lead:
    Use the lightGallery React component to build beautiful image and video
    carousels with a lightbox gallery. The lightGallery React component supports
    all the features of lightGallery, such as pinch to zoom, rotate, flip
    images, social sharing, animated thumbnails, etc. A carousel gallery can be
    converted to a lightbox gallery by clicking on the maximize icon on the
    toolbar.
date: 2020-10-06T08:48:57.000Z
draft: false
images: []
menu: { demos: { parent: Demos } }
weight: 4
toc: true
---

#### Demo

<div id="inline-gallery-container" class="inline-gallery-container"></div>
{{< demoButtons js="https://codepen.io/sachinchoolur/pen/zYZqaGm" react="https://stackblitz.com/edit/stackblitz-starters-vhsu43" >}}

##### React

```js
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import LightGallery from 'lightgallery/react';
import { LightGallery as ILightGallery } from 'lightgallery/lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';

export const App = () => {
    const lightGalleryRef = useRef < ILightGallery > null;
    const containerRef = useRef(null);
    const [galleryContainer, setGalleryContainer] = useState(null);

    const onInit = useCallback((detail) => {
        if (detail) {
            lightGalleryRef.current = detail.instance;
            lightGalleryRef.current.openGallery();
        }
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            setGalleryContainer(containerRef.current);
        }
    }, []);

    return (
        <div className="App">
            <div style={{ height: '800px' }} ref={containerRef}></div>
            <LightGallery
                container={galleryContainer}
                onInit={onInit}
                plugins={[lgZoom, lgThumbnail]}
                dynamic={true}
                dynamicEl={[
                    {
                        src: '...',
                        responsive: '...',
                        thumb: '...',
                        subHtml: `...`,
                    },
                    {
                        src: '...',
                        responsive: '...',
                        thumb: '...',
                        subHtml: `...`,
                    },
                ]}
            />
        </div>
    );
};
```
