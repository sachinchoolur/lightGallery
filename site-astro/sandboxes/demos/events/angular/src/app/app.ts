import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';

import { photos } from '../photos';

const colours = ['#6a7583', '#1e304b', '#315460', '#080607'];

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery events</h1>
        <!-- Every gallery event is an output. This one changes the backdrop
             color on every slide change. "className" is a class on the
             gallery container, used by styles.css. -->
        <lg-gallery
            className="lg-events-demo-outer"
            (beforeSlide)="setBackdrop($event.index)"
        >
            <div class="gallery">
                @for (photo of photos; track photo.src) {
                <a [href]="photo.src" [lgGalleryItem]="photo">
                    <img [src]="photo.thumb" [alt]="photo.alt" />
                </a>
                }
            </div>
        </lg-gallery>
    `,
})
export class App {
    readonly photos = photos;

    setBackdrop(index: number): void {
        const backdrop = document.querySelector<HTMLElement>(
            '.lg-events-demo-outer .lg-backdrop',
        );
        if (backdrop) {
            backdrop.style.backgroundColor = colours[index % colours.length];
        }
    }
}
