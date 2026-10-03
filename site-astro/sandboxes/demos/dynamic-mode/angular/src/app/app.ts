import { Component, signal } from '@angular/core';
import { LgGalleryComponent } from '@lightgallery/angular';

import { photos } from '../photos';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent],
    template: `
        <h1>lightGallery dynamic mode</h1>
        <button type="button" (click)="open.set(true)">Open gallery</button>
        <lg-gallery
            [slides]="slides"
            [open]="open()"
            (closed)="open.set(false)"
            [(index)]="index"
        />
    `,
})
export class App {
    // The slides are data: there is no gallery markup on the page.
    readonly slides = photos.map((photo) => ({ ...photo, caption: photo.alt }));

    readonly open = signal(false);
    // Opens on the third slide.
    readonly index = signal(2);
}
