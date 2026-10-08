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
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import Carousel from 'bootstrap/js/dist/carousel';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery with a Bootstrap carousel</h1>
        <!-- One gallery over the carousel: every slide holds an item that
             opens its full-size image. -->
        <lg-gallery [features]="features">
            <div
                #carousel
                id="bootstrap-gallery-carousel"
                class="carousel slide"
            >
                <div class="carousel-inner">
                    @for (photo of slides; track photo.src) {
                    <div class="carousel-item" [class.active]="$first">
                        <a [href]="photo.src" [lgGalleryItem]="photo">
                            <img
                                [src]="photo.thumb"
                                class="d-block w-100"
                                [alt]="photo.alt"
                            />
                        </a>
                    </div>
                    }
                </div>
                <button
                    class="carousel-control-prev"
                    type="button"
                    data-bs-target="#bootstrap-gallery-carousel"
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
                    data-bs-target="#bootstrap-gallery-carousel"
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
    readonly features = [withThumbnail()];

    // `thumb` is the image on the slide. `lgSize` is the full-size image's
    // WIDTH-HEIGHT; it lets the image open from its slide.
    readonly slides: LgGalleryItem[] = [
        {
            src: 'https://picsum.photos/id/10/1600/1067',
            thumb: 'https://picsum.photos/id/10/960/640',
            alt: 'Sample photo 1',
            lgSize: '1600-1067',
        },
        {
            src: 'https://picsum.photos/id/11/1600/1067',
            thumb: 'https://picsum.photos/id/11/960/640',
            alt: 'Sample photo 2',
            lgSize: '1600-1067',
        },
        {
            src: 'https://picsum.photos/id/15/1600/1067',
            thumb: 'https://picsum.photos/id/15/960/640',
            alt: 'Sample photo 3',
            lgSize: '1600-1067',
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
            });
        });
        inject(DestroyRef).onDestroy(() => carousel?.dispose());
    }
}
