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
        <h1>lightGallery zoom from origin</h1>
        <!-- zoomFromOrigin is on by default: the image grows out of the
             clicked thumbnail and flies back to it on close. It needs each
             item's lgSize, the full-size image's "WIDTH-HEIGHT". -->
        <lg-gallery [zoomFromOrigin]="true">
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
