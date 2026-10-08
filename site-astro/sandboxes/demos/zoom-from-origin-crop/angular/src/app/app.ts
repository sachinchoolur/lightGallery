import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';
import { withOriginCrop } from '@lightgallery/angular/plugins/originCrop';

import { photos } from '../photos';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery zoom from origin, cropped thumbnails</h1>
        <!-- The tiles are square and crop every photo with object-fit:
             cover. The origin crop feature flies the part of the photo a
             tile shows and reveals the rest around it; without it the whole
             photo would be squashed into the tile. It reads the tile's
             object-fit and object-position, nothing is needed in the
             markup. -->
        <lg-gallery [features]="features">
            <div class="tiles">
                @for (photo of photos; track photo.src) {
                <a [href]="photo.src" [lgGalleryItem]="photo">
                    <img
                        [src]="photo.thumb"
                        [alt]="photo.alt"
                        [style.object-position]="photo.position"
                    />
                </a>
                }
            </div>
        </lg-gallery>
    `,
})
export class App {
    readonly photos = photos;
    readonly features = [withOriginCrop()];
}
