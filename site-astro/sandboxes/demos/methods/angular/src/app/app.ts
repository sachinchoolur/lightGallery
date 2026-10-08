import { Component } from '@angular/core';
import {
    LgCaptionDirective,
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';

import { photos } from '../photos';

@Component({
    selector: 'app-root',
    imports: [LgCaptionDirective, LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery methods</h1>
        <p>
            <button type="button" (click)="gallery.openGallery(2)">
                Open on the third photo
            </button>
        </p>

        <!-- #gallery gives access to the gallery's methods.
             [controls]="false" hides the built-in previous and next
             buttons. -->
        <lg-gallery #gallery="lgGallery" [controls]="false">
            <div class="gallery">
                @for (photo of photos; track photo.src) {
                <a [href]="photo.src" [lgGalleryItem]="photo">
                    <img [src]="photo.thumb" [alt]="photo.alt" />
                </a>
                }
            </div>

            <!-- The lgCaption template puts custom buttons in the caption
                 area of every slide. -->
            <ng-template lgCaption>
                <div class="gallery-nav">
                    <button type="button" (click)="gallery.prevSlide()">
                        Previous
                    </button>
                    <button type="button" (click)="gallery.nextSlide()">
                        Next
                    </button>
                    <button type="button" (click)="gallery.closeGallery()">
                        Close
                    </button>
                </div>
            </ng-template>
        </lg-gallery>
    `,
})
export class App {
    readonly photos = photos;
}
