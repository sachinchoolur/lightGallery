---
title: React video carousel
description:
    Full featured, Responsive, video carousel component for React.
lead:
    Use the lightGallery React component to build beautiful video carousels with a lightbox gallery. The lightGallery React component supports all the features of lightGallery, social sharing, animated thumbnails, pagers, etc. A carousel video gallery can be converted to a lightbox gallery by clicking on the maximize icon on the toolbar.
date: 2020-10-06T08:48:57.000Z
draft: false
images: []
has_video: true
menu: { demos: { parent: Demos } }
weight: 30
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
                elementClassNames={'react-gallery-el'}
            />
        </div>
    );
};
```

##### CSS

Set height and width for the container as the inline automatically adopts the
container size

```scss
.react-gallery-el {
    width: 100%;
    height: 0;
    padding-bottom: 65%;
}
```
