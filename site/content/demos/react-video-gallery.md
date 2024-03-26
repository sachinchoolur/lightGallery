---
title: 'React video gallery'
description:
    Full featured video gallery component for React
lead:
    lightGallery supports YouTube, Vimeo, Wistia and all other types of HTML5
    video formats. Such as MP4, WebM, Ogg, etc. into a full-fledged lightbox
    gallery.
date: 2020-10-06T08:48:57+00:00
draft: false
images: []
has_video: true
menu:
    demos:
        parent: 'Demos'
weight: 22
toc: true
---

#### External videos

<p>To display YouTube, Vimeo and Wistia, videos, you just need to paste the video URL, or share URL of the video in the data-src attribute. The same way you display images in the gallery. lightGallery will check the data-src attribute and if it is a video URL, it will create the respective video slide.</p>

<p>You can also provide poster image for each videos. Poster images will be loaded instead of videos. So user will be able to navigate to other slides by using mouse drag or swipe. Poster images improve performance, and maintain the flexibility of your gallery without effecting user experience. Videos will be loaded when a user clicks on the poster images. You can place poster image url in the data-poster attribute.</p>

<p>lightGallery allows you to load thumbnail images automatically from YouTube and Vimeo. You can specify the size of the thumbnails in the settings. You need to use <a href="/docs/settings/#vimeo-thumbnails-plugin">Vimeo thumbnail plugin</a> to load thumbnails for vimeo videos. Videos will be automatically paused when a user starts to navigate to another slide.</p>

#### HTML5 videos

<p>For displaying HTML5 videos, you need to construct an object with array of video sources and types, and videos attributes objects as shown below and pass it via data-video attribute</p>
Note - data-src should not be provided when you use html5 videos

#### Demo

<div id="inline-video-gallery-container" class="inline-gallery-container"></div>
{{< demoButtons js="https://codepen.io/light-gallery/pen/ZEwMyWE" react="https://stackblitz.com/edit/stackblitz-starters-rnvyp4" >}}

##### React

```js
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { LightGallery as ILightGallery } from 'lightgallery/lightgallery';
import LightGallery from 'lightgallery/react';
import lgVideo from 'lightgallery/plugins/video';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';
import './style.scss';

export const App: FC<{ name: string }> = ({ name }) => {
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

    const videos = [
        {
            src: 'https://youtu.be/IUN664s7N-c',
            subHtml: `<h4>'Peck Pocketed' by Kevin Herron | Disney Favorite</h4>`,
        },
        {
            src: 'https://www.youtube.com/watch?v=ttLu7ygaN6I',
            subHtml: `<h4>Forest Path - Unreal Engine 5 Cinematic by Sharkyy</h4>`,
        },
        {
            src: 'https://www.youtube.com/watch?v=C3vyugaBhSs',
            subHtml: `<h4>UE5 | In The Heart Of The Forest by Anastasia Gorban</h4>`,
        },
        // Add more video objects as needed
    ];

    return (
        <>
            <div ref={containerRef} />
            <LightGallery
                container={galleryContainer}
                onInit={onInit}
                plugins={[lgThumbnail, lgVideo]}
                closable={false}
                showMaximizeIcon={true}
                slideDelay={400}
                thumbWidth={130}
                thumbHeight={'100px'}
                thumbMargin={6}
                appendSubHtmlTo={'.lg-item'}
                dynamic={true}
                dynamicEl={videos}
                // videojs
                // videojsOptions={{ muted: false }}
                hash={false}
                elementClassNames={'inline-gallery-container'}
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
```
