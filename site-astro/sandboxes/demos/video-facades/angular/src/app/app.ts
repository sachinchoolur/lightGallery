import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withVideo } from '@lightgallery/angular/plugins/video';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery video facades</h1>
        <lg-gallery [features]="features">
            <div class="gallery">
                @for (video of videos; track video.src) {
                <a [attr.href]="video.src" [lgGalleryItem]="video">
                    <img [src]="video.thumb" [alt]="video.alt" />
                </a>
                }
            </div>
        </lg-gallery>
    `,
})
export class App {
    readonly features = [
        withVideo({
            // The next two are the defaults, written out. A video slide
            // shows its poster with a play button; the player loads when
            // play is pressed.
            videoFacade: true,
            // YouTube videos are embedded through youtube-nocookie.com.
            youTubeNoCookie: true,
            // By default the first video starts playing as the gallery
            // opens, which loads its player at once. Off, so every slide
            // starts as a facade.
            autoplayFirstVideo: false,
        }),
    ];

    // `poster` is the image the slide shows until play is pressed.
    readonly videos: LgGalleryItem[] = [
        {
            src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
            poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
            thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/mqdefault.jpg',
            alt: 'Puffin Hunts Fish To Feed Puffling',
            caption:
                'YouTube video: Puffin Hunts Fish To Feed Puffling, BBC Earth',
            lgSize: '1280-720',
        },
        {
            src: 'https://vimeo.com/112836958',
            poster: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
            thumb: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
            alt: 'Nature',
            caption: 'Vimeo video: Nature, by Charlie Kaye',
            lgSize: '1280-720',
        },
    ];
}
