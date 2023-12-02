---
title: React carousel
description:
    LightGallery allows you to build inline carousel slider image and video
    galleries.
lead:
    With lightGallery you can create both inline carousel slider and lightBox
    galleries. You can create inline gallery by passing the container element
    via container option. All the lightBox features are available in inline
    gallery as well. inline gallery can be converted to the lightBox gallery by
    clicking on the maximize icon on the toolbar
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
import lgZoom from 'lightgallery/plugins/zoom';
import './style.scss';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import { LightGallery as ILightGallery } from 'lightgallery/lightgallery';

export const App: FC<{ name: string }> = ({ name }) => {
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
            <div>
                <LightGallery
                    container={galleryContainer}
                    onInit={onInit}
                    plugins={[lgZoom, lgThumbnail]}
                    closable={false}
                    showMaximizeIcon={true}
                    slideDelay={400}
                    thumbWidth={130}
                    thumbHeight={'100px'}
                    thumbMargin={6}
                    appendSubHtmlTo={'.lg-item'}
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
                    hash={false}
                    elementClassNames={'inline-gallery-container'}
                ></LightGallery>
            </div>
        </div>
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
```
