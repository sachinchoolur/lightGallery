import {
    afterNextRender,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    viewChild,
} from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withVideo } from '@lightgallery/angular/plugins/video';
import Carousel from 'bootstrap/js/dist/carousel';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery with a Bootstrap video carousel</h1>
        <!-- One gallery over the carousel: every slide holds an item that
             opens its video. -->
        <lg-gallery [features]="features">
            <div #carousel id="bootstrap-video-carousel" class="carousel slide">
                <div class="carousel-indicators">
                    @for (video of videos; track video.poster) {
                    <button
                        type="button"
                        data-bs-target="#bootstrap-video-carousel"
                        [attr.data-bs-slide-to]="$index"
                        [class.active]="$first"
                        [attr.aria-current]="$first ? 'true' : null"
                        [attr.aria-label]="'Slide ' + ($index + 1)"
                    ></button>
                    }
                </div>
                <div class="carousel-inner">
                    @for (video of videos; track video.poster) {
                    <div class="carousel-item" [class.active]="$first">
                        <a [attr.href]="video.src" [lgGalleryItem]="video">
                            <img
                                [src]="video.poster"
                                class="d-block w-100"
                                [alt]="video.alt"
                            />
                        </a>
                    </div>
                    }
                </div>
                <button
                    class="carousel-control-prev"
                    type="button"
                    data-bs-target="#bootstrap-video-carousel"
                    data-bs-slide="prev"
                >
                    <span
                        class="carousel-control-prev-icon"
                        aria-hidden="true"
                    ></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button
                    class="carousel-control-next"
                    type="button"
                    data-bs-target="#bootstrap-video-carousel"
                    data-bs-slide="next"
                >
                    <span
                        class="carousel-control-next-icon"
                        aria-hidden="true"
                    ></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </lg-gallery>
    `,
})
export class App {
    readonly features = [withVideo()];

    readonly videos: LgGalleryItem[] = [
        // YouTube and Vimeo: `src` is the address of the video page.
        // `poster` is the image shown before the video plays.
        {
            src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
            poster: 'https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg',
            alt: 'YouTube video',
            lgSize: '1280-720',
        },
        {
            src: 'https://vimeo.com/112836958',
            poster: 'https://www.lightgalleryjs.com/images/demo/vimeo-video-poster.jpg',
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
            alt: 'HTML5 video',
            lgSize: '1280-720',
        },
    ];

    private readonly carouselEl =
        viewChild.required<ElementRef<HTMLElement>>('carousel');

    constructor() {
        let carousel: Carousel | undefined;

        // The Bootstrap carousel
        afterNextRender(() => {
            carousel = new Carousel(this.carouselEl().nativeElement, {
                interval: 2000,
                wrap: false,
                // Start cycling right away.
                ride: 'carousel',
            });
        });
        inject(DestroyRef).onDestroy(() => {
            // dispose() leaves the cycle timer running, so stop it first.
            carousel?.pause();
            carousel?.dispose();
        });
    }
}
