# Video carousel

> Video carousel demo: an inline gallery of YouTube and HTML5 videos embedded in the page, with thumbnails.

With lightGallery, you can create both carousel slider and lightbox galleries. You can create inline gallery by passing the container element via container option. All the lightbox features are available in inline gallery as well. Inline gallery can be converted to the lightbox gallery by clicking on the maximize icon on the toolbar.

Canonical page: https://www.lightgalleryjs.com/demos/video-carousel/

#### Demo

**JavaScript**

**HTML**

```html
<div id="inline-gallery-container" class="inline-gallery-container"></div>
```

**JavaScript**

```js
const lgContainer = document.getElementById('inline-gallery-container');
const inlineGallery = lightGallery(lgContainer, {
    container: lgContainer,
    dynamic: true,
    plugins: [lgVideo],
    // Turn off hash plugin in case if you are using it
    // as we don't want to change the url on slide change
    hash: false,
    // Do not allow users to close the gallery
    closable: false,
    // Add maximize icon to enlarge the gallery
    showMaximizeIcon: true,
    // Append caption inside the slide item
    // to apply some animation for the captions (Optional)
    appendSubHtmlTo: '.lg-item',
    // Delay slide transition to complete captions animations
    // before navigating to different slides (Optional)
    // You can find caption animation demo on the captions demo page
    slideDelay: 400,
    dynamicEl: [
        {
            src: 'https://youtu.be/IUN664s7N-c',
            subHtml: `<h4>'Peck Pocketed' by Kevin Herron</h4>`,
        },
        {
            src: 'https://www.youtube.com/watch?v=ttLu7ygaN6I',
            subHtml: `<h4>Second video</h4>`,
            thumb: 'https://img.youtube.com/vi/ttLu7ygaN6I/mqdefault.jpg',
        },
        {
            src: 'https://www.youtube.com/watch?v=C3vyugaBhSs',
            subHtml: `<h4>UE5</h4>`,
        },
        // Add more video objects as needed
    ],
});

// Since we are using dynamic mode, we need to programmatically open lightGallery
inlineGallery.openGallery();
```

**React**

```tsx
import { useState } from 'react';
import { LightGallery, type GalleryItem } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Video from '@lightgallery/react/plugins/video';

// YouTube and Vimeo: `src` is the address of the video page. `poster`
// is the image shown before the video plays.
const slides: GalleryItem[] = [
    {
        src: 'https://youtu.be/IUN664s7N-c',
        poster: 'https://img.youtube.com/vi/IUN664s7N-c/maxresdefault.jpg',
        thumb: 'https://img.youtube.com/vi/IUN664s7N-c/mqdefault.jpg',
        alt: 'Peck Pocketed',
        captionHtml: "<h4>'Peck Pocketed' by Kevin Herron</h4>",
        lgSize: '1280-720',
    },
    {
        src: 'https://www.youtube.com/watch?v=ttLu7ygaN6I',
        poster: 'https://img.youtube.com/vi/ttLu7ygaN6I/maxresdefault.jpg',
        thumb: 'https://img.youtube.com/vi/ttLu7ygaN6I/mqdefault.jpg',
        alt: 'Second video',
        captionHtml: '<h4>Second video</h4>',
        lgSize: '1280-720',
    },
];

// An inline gallery is the same component mounted into your own
// element: keep it open and non-closable, and it behaves as a carousel.
// The element is kept in state, not in a ref: the gallery can only be
// rendered into it once it exists, and setting state renders again.
const [container, setContainer] = useState<HTMLElement | null>(null);

<>
    {/* The gallery is rendered inside this element and takes its size. */}
    <div className="inline-gallery-container" ref={setContainer} />
    {container && (
        <LightGallery
            container={container}
            // The carousel is always open and cannot be closed.
            open
            closable={false}
            // Toolbar button that expands it to the whole window.
            showMaximizeIcon
            slides={slides}
            plugins={[Thumbnail, Video]}
        />
    )}
</>;
```

**Vue**

```vue
<script setup>
import { ref } from 'vue';
import { LightGallery } from '@lightgallery/vue';
import Thumbnail from '@lightgallery/vue/plugins/thumbnail';
import Video from '@lightgallery/vue/plugins/video';

const plugins = [Thumbnail, Video];

// YouTube and Vimeo: `src` is the address of the video page. `poster`
// is the image shown before the video plays.
const slides = [
    {
        src: 'https://youtu.be/IUN664s7N-c',
        poster: 'https://img.youtube.com/vi/IUN664s7N-c/maxresdefault.jpg',
        thumb: 'https://img.youtube.com/vi/IUN664s7N-c/mqdefault.jpg',
        alt: 'Peck Pocketed',
        captionHtml: "<h4>'Peck Pocketed' by Kevin Herron</h4>",
        lgSize: '1280-720',
    },
    {
        src: 'https://www.youtube.com/watch?v=ttLu7ygaN6I',
        poster: 'https://img.youtube.com/vi/ttLu7ygaN6I/maxresdefault.jpg',
        thumb: 'https://img.youtube.com/vi/ttLu7ygaN6I/mqdefault.jpg',
        alt: 'Second video',
        captionHtml: '<h4>Second video</h4>',
        lgSize: '1280-720',
    },
];

// An inline gallery is the same component mounted into your own
// element: keep it open and non-closable, and it behaves as a carousel.
const container = ref(null);
</script>

<template>
    <!-- The gallery is rendered inside this element and takes its size. -->
    <div ref="container" class="inline-gallery-container" />
    <!-- The carousel cannot be closed. The maximize icon expands it to the
         whole window. -->
    <LightGallery
        v-if="container"
        :container="container"
        :open="true"
        :closable="false"
        :show-maximize-icon="true"
        :slides="slides"
        :plugins="plugins"
    />
</template>
```

**Angular**

```ts
import { Component } from '@angular/core';
import { LgGalleryComponent, type LgGalleryItem } from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withVideo } from '@lightgallery/angular/plugins/video';

@Component({
    selector: 'app-gallery',
    imports: [LgGalleryComponent],
    template: `
        <!-- The gallery is rendered inside this element and takes its
             size. -->
        <div #host class="inline-gallery-container"></div>
        <!-- The carousel is always open and cannot be closed. The maximize
             icon expands it to the whole window. -->
        <lg-gallery
            [container]="host"
            [open]="true"
            [closable]="false"
            [showMaximizeIcon]="true"
            [slides]="slides"
            [features]="features"
        />
    `,
})
export class Gallery {
    features = [withThumbnail(), withVideo()];

    // YouTube and Vimeo: `src` is the address of the video page. `poster`
    // is the image shown before the video plays.
    slides: LgGalleryItem[] = [
        {
            src: 'https://youtu.be/IUN664s7N-c',
            poster: 'https://img.youtube.com/vi/IUN664s7N-c/maxresdefault.jpg',
            thumb: 'https://img.youtube.com/vi/IUN664s7N-c/mqdefault.jpg',
            alt: 'Peck Pocketed',
            captionHtml: "<h4>'Peck Pocketed' by Kevin Herron</h4>",
            lgSize: '1280-720',
        },
        {
            src: 'https://www.youtube.com/watch?v=ttLu7ygaN6I',
            poster: 'https://img.youtube.com/vi/ttLu7ygaN6I/maxresdefault.jpg',
            thumb: 'https://img.youtube.com/vi/ttLu7ygaN6I/mqdefault.jpg',
            alt: 'Second video',
            captionHtml: '<h4>Second video</h4>',
            lgSize: '1280-720',
        },
    ];
}
```

##### CSS

Set height and width for the container as the inline gallery automatically
adopts the container size.

```scss
.inline-gallery-container {
    width: 100%;

    // set 65% height
    height: 0;
    padding-bottom: 65%;
}
```
