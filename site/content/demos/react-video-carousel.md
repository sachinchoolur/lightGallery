---
title: React video carousel
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

<div id="inline-video-gallery-container" class="inline-gallery-container"></div>

{{< demoButtons js="https://codepen.io/light-gallery/pen/ZEwMyWE" react="https://stackblitz.com/edit/stackblitz-starters-rnvyp4" >}}

##### React

```js
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import LightGallery from 'lightgallery/react';
import lgZoom from 'lightgallery/plugins/zoom';
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
                        src: 'https://youtu.be/IUN664s7N-c',
                        subHtml: `<h4>'Peck Pocketed' by Kevin Herron</h4>`,
                    },
                    {
                        src: 'https://www.youtube.com/watch?v=ttLu7ygaN6I',
                        subHtml: `<h4>'Peck Pocketed' by Kevin Herron</h4>`,
                        thumb:
                            'https://img.youtube.com/vi/your_youtube_video_id/mqdefault.jpg',
                    },
                    {
                        src: 'https://www.youtube.com/watch?v=C3vyugaBhSs',
                        subHtml: `<h4>UE5</h4>`,
                    },
                    // Add more video objects as needed
                ]}
                hash={false}
                elementClassNames={'inline-video-gallery-container'}
            />
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
