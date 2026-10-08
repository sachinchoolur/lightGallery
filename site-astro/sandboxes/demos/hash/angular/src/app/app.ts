import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';
import { withHash } from '@lightgallery/angular/plugins/hash';

import { photos } from '../photos';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery hash</h1>
        <p>
            Open a photo and look at the address bar. Loading that URL opens the
            gallery on the same photo.
        </p>
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
    // galleryId is the id in the URL: #lg=1&slide=2. Give each gallery on a
    // page its own. hashDriver 'auto' uses the Navigation API where the
    // browser has it and the History API everywhere else.
    readonly features = [withHash({ galleryId: '1', hashDriver: 'auto' })];
}
