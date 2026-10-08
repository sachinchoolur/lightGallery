import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withShare } from '@lightgallery/angular/plugins/share';

import { photos } from '../photos';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery social sharing</h1>
        <lg-gallery [features]="features">
            <div class="gallery">
                @for (item of items; track item.src) {
                <a [attr.href]="item.src" [lgGalleryItem]="item">
                    <img [src]="item.thumb" [alt]="item.alt" />
                </a>
                }
            </div>
        </lg-gallery>
    `,
})
export class App {
    // withShare() adds a share button to the toolbar. It lists Facebook, X
    // and Pinterest; on touch devices it opens the device's share sheet
    // first. Pass withShare({ preferNativeShare: true }) (or false) to
    // choose one for every device.
    readonly features = [withShare()];

    // tweetText and pinterestText are the text the post on X and the pin on
    // Pinterest start with.
    readonly items: LgGalleryItem[] = photos.map((photo) => ({
        ...photo,
        tweetText: `${photo.alt}, shared from lightGallery`,
        pinterestText: photo.alt,
    }));
}
