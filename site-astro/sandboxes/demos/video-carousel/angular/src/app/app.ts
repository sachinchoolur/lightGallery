import { Component } from '@angular/core';
import { LgGalleryComponent, type LgGalleryItem } from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withVideo } from '@lightgallery/angular/plugins/video';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent],
    template: `
        <h1>lightGallery video carousel</h1>
        <!-- The gallery is rendered inside this element and takes its
             size, which is set in styles.css. -->
        <div #container class="inline-gallery-container"></div>
        <!-- The carousel is always open and cannot be closed. The maximize
             icon expands it to the whole window. -->
        <lg-gallery
            [container]="container"
            [open]="true"
            [closable]="false"
            [showMaximizeIcon]="true"
            [slides]="videos"
            [features]="features"
        />
    `,
})
export class App {
    readonly features = [withThumbnail(), withVideo()];

    readonly videos: LgGalleryItem[] = [
        // YouTube and Vimeo: `src` is the address of the video page.
        {
            src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
            poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
            thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/mqdefault.jpg',
            alt: 'Puffin Hunts Fish To Feed Puffling',
            caption:
                'YouTube video: Puffin Hunts Fish To Feed Puffling, BBC Earth',
        },
        {
            src: 'https://vimeo.com/112836958',
            poster: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
            thumb: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
            alt: 'Nature',
            caption: 'Vimeo video: Nature, by Charlie Kaye',
        },
        // A video file you host yourself: no `src`. The files and the
        // <video> attributes go in `video`.
        {
            video: {
                source: [
                    {
                        src: 'https://www.lightgalleryjs.com/videos/video1.mp4',
                        type: 'video/mp4',
                    },
                ],
                attributes: { preload: 'metadata', controls: true },
            },
            poster: 'https://www.lightgalleryjs.com/images/demo/html5-video-poster.jpg',
            thumb: 'https://www.lightgalleryjs.com/images/demo/html5-video-poster.jpg',
            alt: 'Peck Pocketed',
            caption: 'HTML5 video: Peck Pocketed, by Kevin Herron',
        },
    ];
}
