import { Component, signal } from '@angular/core';
import {
    LgCaptionDirective,
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';

import { photos as firstPhotos, type Photo } from '../photos';

let added = 0;

function newPhoto(): Photo {
    added += 1;
    return {
        src: `https://picsum.photos/seed/lg-added-${added}/1600/1067`,
        thumb: `https://picsum.photos/seed/lg-added-${added}/360/240`,
        alt: `Added photo ${added}`,
        lgSize: '1600-1067',
    };
}

@Component({
    selector: 'app-root',
    imports: [LgCaptionDirective, LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery update slides</h1>
        <p>Open a photo, then use the buttons under it.</p>

        <lg-gallery>
            <div class="gallery">
                @for (photo of photos(); track photo.src) {
                <a [href]="photo.src" [lgGalleryItem]="photo">
                    <img [src]="photo.thumb" [alt]="photo.alt" />
                </a>
                }
            </div>

            <!-- The lgCaption template puts the buttons in the caption
                 area of every slide. -->
            <ng-template lgCaption let-index="index">
                <div class="slide-actions">
                    <button type="button" (click)="add()">Add a photo</button>
                    <button
                        type="button"
                        [disabled]="photos().length === 1"
                        (click)="remove(index)"
                    >
                        Remove this photo
                    </button>
                </div>
            </ng-template>
        </lg-gallery>
    `,
})
export class App {
    // Updating the signal is the update, also while the gallery is open.
    // There is no method to call.
    readonly photos = signal(firstPhotos);

    add(): void {
        this.photos.update((current) => [...current, newPhoto()]);
    }

    remove(index: number): void {
        this.photos.update((current) => current.filter((_, i) => i !== index));
    }
}
