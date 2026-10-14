import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';
import { withRotate } from '@lightgallery/angular/plugins/rotate';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

import { photos } from '../photos';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery image zoom</h1>
        <lg-gallery [features]="features">
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
    // Zoom in and zoom out buttons next to the actual-size button; the
    // library shows only actual size by default. `scale` is how much
    // each step changes the scale.
    readonly features = [
        withZoom({ showZoomInOutIcons: true, actualSize: true, scale: 1 }),
        withRotate(),
        withThumbnail(),
    ];
}
