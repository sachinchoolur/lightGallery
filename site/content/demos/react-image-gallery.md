---
title: 'React image gallery'
description:
    Build a React gallery with lightGallery. Customize sliders and lightbox
    galleries effortlessly. Transform inline images with a click.
lead:
    Utilize lightGallery in your React application to create inline carousel
    sliders and lightbox galleries. Easily set up an inline gallery by passing
    the container element through the container option. All the powerful
    lightbox features are seamlessly integrated into the inline gallery.
    Clicking on the maximize icon in the toolbar transforms the inline gallery
    into a full-fledged lightbox gallery.
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

<div id="inline-gallery-container" class="inline-gallery-container"></div>
{{< demoButtons js="https://codepen.io/sachinchoolur/pen/zYZqaGm" react="https://stackblitz.com/edit/stackblitz-starters-vhsu43" >}}

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
            src: 'https://via.placeholder.com/1400x800.png?text=Image+1',
            responsive:
                'https://via.placeholder.com/800x480.png?text=Image+1 800w, https://via.placeholder.com/480x240.png?text=Image+1 480w',
            thumb: 'https://via.placeholder.com/240x120.png?text=Image+1',
            subHtml: `<div class="lightGallery-captions"> <h4>Placeholder Image 1</h4> <p>Published on January 1, 2023</p> </div>`,
        },
        {
            src: 'https://via.placeholder.com/1400x800.png?text=Image+2',
            responsive:
                'https://via.placeholder.com/800x480.png?text=Image+2 800w, https://via.placeholder.com/480x240.png?text=Image+2 480w',
            thumb: 'https://via.placeholder.com/240x120.png?text=Image+2',
            subHtml: `<div class="lightGallery-captions"> <h4>Placeholder Image 2</h4><p>Published on January 2, 2023</p></div>`,
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
                elementClassNames={'inline-gallery-container'}
                dynamic={true}
                dynamicEl={dynamicEl}
            />
        </>
    );
};
```

##### CSS

Set height and width for the container as the inline automatically adopts the
container size

```scss
.inline-gallery-container {
    width: 100%;

    // set 60% height
    height: 0;
    padding-bottom: 65%;
}

// Add transitions for caption; check the caption page
```
