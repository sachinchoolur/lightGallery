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
} from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';
import Flickity from 'flickity';

const slides = [10, 11, 15, 16, 28, 29].map((id, index) => ({
    src: `https://picsum.photos/id/${id}/1600/1067`,
    thumb: `https://picsum.photos/id/${id}/720/480`,
    alt: `Sample photo ${index + 1}`,
    // WIDTH-HEIGHT of the full-size image; lets it open from its cell.
    lgSize: '1600-1067',
}));

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery with a Flickity carousel</h1>
        <lg-gallery [features]="features">
            <div #carousel class="main-carousel">
                @for (slide of slides; track slide.src) {
                <a
                    class="carousel-cell"
                    [href]="slide.src"
                    [lgGalleryItem]="slide"
                >
                    <img [src]="slide.thumb" [alt]="slide.alt" />
                </a>
                }
            </div>
        </lg-gallery>
    `,
})
export class App {
    readonly slides = slides;
    readonly features = [withZoom(), withThumbnail()];

    private readonly carousel =
        viewChild.required<ElementRef<HTMLElement>>('carousel');

    constructor() {
        let flickity: Flickity | undefined;
        // True from the start of a drag until the click that ends it.
        let dragged = false;

        // Create the carousel once its cells are in the page.
        afterNextRender(() => {
            const element = this.carousel().nativeElement;

            flickity = new Flickity(element, {
                cellAlign: 'center',
                pageDots: false,
                contain: true,
                autoPlay: true,
                on: {
                    pointerDown() {
                        dragged = false;
                    },
                    dragStart() {
                        dragged = true;
                    },
                },
            });

            // Letting go of a drag also clicks the cell under the pointer.
            // Stop that click before it reaches the cell, so only a plain
            // click opens the gallery.
            element.addEventListener(
                'click',
                (event) => {
                    if (dragged) {
                        dragged = false;
                        event.preventDefault();
                        event.stopPropagation();
                    }
                },
                true,
            );
        });
        inject(DestroyRef).onDestroy(() => flickity?.destroy());
    }
}
