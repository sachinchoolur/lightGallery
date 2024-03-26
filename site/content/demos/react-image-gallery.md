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
    const lightGalleryRef = useRef < ILightGallery > null;
    const containerRef = useRef(null);
    const [galleryContainer, setGalleryContainer] = useState(null);

    const onInit = useCallback((detail) => {
        if (detail) {
            lightGalleryRef.current = detail.instance;
            // Since we are using dynamic mode, we need to programmatically open lightGallery
            lightGalleryRef.current.openGallery();
        }
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            setGalleryContainer(containerRef.current);
        }
    }, []);

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
            <div ref={containerRef} />
            <LightGallery
                container={galleryContainer}
                onInit={onInit}
                // Turn off hash plugin in case if you are using it
                // as we don't want to change the url on slide change
                hash={false}
                plugins={[lgZoom, lgThumbnail]}
                // Do not allow users to close the gallery
                closable={false}
                // Add maximize icon to enlarge the gallery
                showMaximizeIcon={true}
                // Delay slide transition to complete captions animations
                // before navigating to different slides (Optional)
                // You can find caption animation demo on the captions demo page
                slideDelay={400}
                thumbWidth={130}
                thumbHeight={'100px'}
                thumbMargin={6}
                appendSubHtmlTo={'.lg-item'}
                elementClassNames={'react-image-container'}
                dynamic={true}
                dynamicEl={dynamicEl}
            />
        </>
    );
};
```
