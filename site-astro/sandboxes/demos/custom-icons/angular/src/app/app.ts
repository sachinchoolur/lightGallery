import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    LgIconDirective,
} from '@lightgallery/angular';
import { withAutoplay } from '@lightgallery/angular/plugins/autoplay';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

import { photos } from '../photos';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective, LgIconDirective],
    template: `
        <h1>lightGallery custom icons</h1>
        <lg-gallery [features]="features">
            <div class="gallery">
                @for (photo of photos; track photo.src) {
                <a [href]="photo.src" [lgGalleryItem]="photo">
                    <img [src]="photo.thumb" [alt]="photo.alt" />
                </a>
                }
            </div>

            <!-- The template lists the icon names it covers; other names
                 keep the built-in icons. A state pair needs both names.
                 Drawing with currentColor keeps the hover and active colors
                 of the buttons. -->
            <ng-template
                [lgIcon]="['close', 'autoplayPlay', 'autoplayPause']"
                let-name
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    @switch (name) { @case ('close') {
                    <path d="M6 6l12 12M18 6L6 18" />
                    } @case ('autoplayPlay') {
                    <path d="M9 5.8v12.4L19 12z" />
                    } @case ('autoplayPause') {
                    <path d="M8.5 6v12M15.5 6v12" />
                    } }
                </svg>
            </ng-template>
        </lg-gallery>
    `,
})
export class App {
    readonly photos = photos;
    readonly features = [withZoom(), withAutoplay()];
}
