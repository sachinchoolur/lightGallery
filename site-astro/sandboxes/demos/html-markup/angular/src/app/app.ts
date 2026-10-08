import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';

import { photos } from '../photos';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery HTML markup</h1>
        <!-- A trigger is a directive on your own link: its value carries the
             slide data that data attributes hold in plain HTML. -->
        <lg-gallery>
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
}
