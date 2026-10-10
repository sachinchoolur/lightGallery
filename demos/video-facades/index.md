# Video facades demo

> Embed YouTube and Vimeo videos as lightweight facades. The provider iframe loads only when the user presses play.

lightGallery renders provider video slides, YouTube, Vimeo, Wistia, as lite facades: a poster with a play button, with the heavy provider iframe created only when the user presses play. YouTube embeds go through the privacy-enhanced youtube-nocookie.com host by default. Read more in the [video facades guide](https://www.lightgalleryjs.com/docs/video-facades/).

Canonical page: https://www.lightgalleryjs.com/demos/video-facades/

> You need to include the video plugin in the document.

### Demo

Open a video slide: the poster appears instantly with a play button, and the
provider iframe is created only when you press play. No third-party
JavaScript or cookies load until then.

**JavaScript**

**HTML**

```html
<div id="gallery-video-facades-demo">
    <a
        data-lg-size="1280-720"
        data-src="//www.youtube.com/watch?v=EIUJfXk3_3w"
        data-poster="https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg"
        data-sub-html="<h4>Puffin Hunts Fish To Feed Puffling</h4>"
    >
        <img src="https://img.youtube.com/vi/EIUJfXk3_3w/mqdefault.jpg" />
    </a>
    <a
        data-lg-size="1280-720"
        data-src="//vimeo.com/112836958"
        data-poster="img/vimeo-poster.jpg"
        data-sub-html="<h4>Nature</h4>"
    >
        <img src="img/vimeo-poster.jpg" />
    </a>
</div>
```

**JavaScript**

```js
import lightGallery from 'lightgallery';
import lgVideo from 'lightgallery/plugins/video';

lightGallery(document.getElementById('gallery-video-facades-demo'), {
    plugins: [lgVideo],
    // Defaults shown for clarity, facades and the
    // privacy-enhanced YouTube host are on out of the box.
    videoFacade: true,
    youTubeNoCookie: true,
    // autoplayFirstVideo defaults to true and, like
    // autoplayVideoOnSlide, forces an immediate embed by
    // design, turn it off to see the facade on every slide.
    autoplayFirstVideo: false,
});
```

**React**

```tsx
import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
} from '@lightgallery/react';
import Video from '@lightgallery/react/plugins/video';

// `poster` is the image the slide shows until play is pressed.
const items: GalleryItem[] = [
    {
        src: '//www.youtube.com/watch?v=EIUJfXk3_3w',
        poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
        thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/mqdefault.jpg',
        alt: 'Puffin Hunts Fish To Feed Puffling',
        captionHtml: '<h4>Puffin Hunts Fish To Feed Puffling</h4>',
        lgSize: '1280-720',
    },
    {
        src: '//vimeo.com/112836958',
        poster: 'img/vimeo-poster.jpg',
        thumb: 'img/vimeo-poster.jpg',
        alt: 'Nature',
        captionHtml: '<h4>Nature</h4>',
        lgSize: '1280-720',
    },
];

<LightGallery
    plugins={[Video]}
    video={{
        // Defaults shown for clarity, facades and the privacy-enhanced
        // YouTube host are on out of the box.
        videoFacade: true,
        youTubeNoCookie: true,
        // autoplayFirstVideo defaults to true and, like
        // autoplayVideoOnSlide, forces an immediate embed by design,
        // turn it off to see the facade on every slide.
        autoplayFirstVideo: false,
    }}
>
    {items.map((item) => (
        <LightGalleryItem key={item.src} item={item}>
            <img src={item.thumb} alt={item.alt} />
        </LightGalleryItem>
    ))}
</LightGallery>;
```

**Vue**

```vue
<script setup lang="ts">
import { LightGallery, LgItem, type LgGalleryItem } from '@lightgallery/vue';
import Video from '@lightgallery/vue/plugins/video';

const plugins = [Video];

const videoSettings = {
    // Defaults shown for clarity, facades and the privacy-enhanced
    // YouTube host are on out of the box.
    videoFacade: true,
    youTubeNoCookie: true,
    // autoplayFirstVideo defaults to true and, like autoplayVideoOnSlide,
    // forces an immediate embed by design, turn it off to see the facade
    // on every slide.
    autoplayFirstVideo: false,
};

// `poster` is the image the slide shows until play is pressed.
const items: LgGalleryItem[] = [
    {
        src: '//www.youtube.com/watch?v=EIUJfXk3_3w',
        poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
        thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/mqdefault.jpg',
        alt: 'Puffin Hunts Fish To Feed Puffling',
        captionHtml: '<h4>Puffin Hunts Fish To Feed Puffling</h4>',
        lgSize: '1280-720',
    },
    {
        src: '//vimeo.com/112836958',
        poster: 'img/vimeo-poster.jpg',
        thumb: 'img/vimeo-poster.jpg',
        alt: 'Nature',
        captionHtml: '<h4>Nature</h4>',
        lgSize: '1280-720',
    },
];
</script>

<template>
    <LightGallery :plugins="plugins" :video="videoSettings">
        <LgItem v-for="item of items" :key="item.src" :item="item">
            <img :src="item.thumb" :alt="item.alt" />
        </LgItem>
    </LightGallery>
</template>
```

**Angular**

```ts
import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withVideo } from '@lightgallery/angular/plugins/video';

@Component({
    selector: 'app-gallery',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <lg-gallery [features]="features">
            @for (item of items; track item.src) {
                <a [lgGalleryItem]="item">
                    <img [src]="item.thumb" [alt]="item.alt" />
                </a>
            }
        </lg-gallery>
    `,
})
export class Gallery {
    features = [
        withVideo({
            // Defaults shown for clarity, facades and the privacy-enhanced
            // YouTube host are on out of the box.
            videoFacade: true,
            youTubeNoCookie: true,
            // autoplayFirstVideo defaults to true and, like
            // autoplayVideoOnSlide, forces an immediate embed by design,
            // turn it off to see the facade on every slide.
            autoplayFirstVideo: false,
        }),
    ];

    // `poster` is the image the slide shows until play is pressed.
    items: LgGalleryItem[] = [
        {
            src: '//www.youtube.com/watch?v=EIUJfXk3_3w',
            poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
            thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/mqdefault.jpg',
            alt: 'Puffin Hunts Fish To Feed Puffling',
            captionHtml: '<h4>Puffin Hunts Fish To Feed Puffling</h4>',
            lgSize: '1280-720',
        },
        {
            src: '//vimeo.com/112836958',
            poster: 'img/vimeo-poster.jpg',
            thumb: 'img/vimeo-poster.jpg',
            alt: 'Nature',
            captionHtml: '<h4>Nature</h4>',
            lgSize: '1280-720',
        },
    ];
}
```

The facade poster falls back from the item's `data-poster` to the YouTube
thumbnail endpoint to the item thumb. A slide with no resolvable poster keeps
the previous eager-iframe behavior, as do slides shown with
`autoplayFirstVideo` or `autoplayVideoOnSlide`.

### Opting out

Set `videoFacade: false` to restore the 2.x behavior, the provider iframe is
created as soon as the slide loads:

**JavaScript**

```js
lightGallery(document.getElementById('gallery-eager-videos'), {
    plugins: [lgVideo],
    videoFacade: false,
});
```

**React**

```tsx
<LightGallery plugins={[Video]} video={{ videoFacade: false }}>
    {/* items as above */}
</LightGallery>
```

**Vue**

```vue
<template>
    <LightGallery :plugins="plugins" :video="{ videoFacade: false }">
        <!-- items as above -->
    </LightGallery>
</template>
```

**Angular**

```ts
// The template stays as above: <lg-gallery [features]="features">
features = [withVideo({ videoFacade: false })];
```

Set `youTubeNoCookie: false` to embed through youtube.com instead of
youtube-nocookie.com. Slide URLs that already point at youtube-nocookie.com
always keep it.
