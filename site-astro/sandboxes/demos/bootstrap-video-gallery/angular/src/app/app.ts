import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withVideo } from '@lightgallery/angular/plugins/video';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery with a Bootstrap video gallery</h1>
        <lg-gallery [features]="features">
            <!-- A Bootstrap grid whose columns are the video items. -->
            <div id="bootstrap-video-gallery" class="row g-3">
                @for (video of videos; track video.poster) {
                <a
                    class="col-sm-4"
                    [attr.href]="video.src"
                    [lgGalleryItem]="video"
                >
                    <img
                        class="img-fluid"
                        [src]="video.thumb"
                        [alt]="video.alt"
                    />
                </a>
                }
            </div>
        </lg-gallery>
    `,
})
export class App {
    // The thumbnail feature is optional.
    readonly features = [withThumbnail(), withVideo()];

    readonly videos: LgGalleryItem[] = [
        // YouTube and Vimeo: `src` is the address of the video page.
        // `poster` is the image shown before the video plays.
        {
            src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
            poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
            thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
            alt: 'YouTube video',
            lgSize: '1280-720',
        },
        {
            src: 'https://vimeo.com/112836958',
            poster: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
            thumb: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
            alt: 'Vimeo video',
            lgSize: '1280-720',
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
            alt: 'HTML5 video',
            lgSize: '1280-720',
        },
    ];
}
