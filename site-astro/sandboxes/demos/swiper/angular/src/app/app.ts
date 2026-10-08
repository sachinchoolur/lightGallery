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
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

const slides = [10, 11, 15, 16].map((id, index) => ({
    src: `https://picsum.photos/id/${id}/1600/1067`,
    thumb: `https://picsum.photos/id/${id}/960/640`,
    alt: `Sample photo ${index + 1}`,
    // WIDTH-HEIGHT of the full-size image; lets it open from its slide.
    lgSize: '1600-1067',
}));

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery with a Swiper carousel</h1>
        <!-- When the gallery goes to another slide, move the carousel to
             the same slide, so the image closes into its slide. -->
        <lg-gallery (beforeSlide)="swiper?.slideTo($event.index, 0)">
            <div #carousel class="swiper">
                <div class="swiper-wrapper">
                    @for (slide of slides; track slide.src) {
                    <a
                        class="swiper-slide"
                        [href]="slide.src"
                        [lgGalleryItem]="slide"
                    >
                        <img [src]="slide.thumb" [alt]="slide.alt" />
                    </a>
                    }
                </div>

                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </lg-gallery>
    `,
})
export class App {
    readonly slides = slides;

    protected swiper?: Swiper;

    private readonly carousel =
        viewChild.required<ElementRef<HTMLElement>>('carousel');

    constructor() {
        // Create the carousel once its slides are in the page.
        afterNextRender(() => {
            this.swiper = new Swiper(this.carousel().nativeElement, {
                modules: [Navigation],
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        });
        inject(DestroyRef).onDestroy(() => this.swiper?.destroy());
    }
}
