import { Component } from '@angular/core';
import { LgGalleryComponent } from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

import { photos } from '../photos';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent],
    template: `
        <h1>lightGallery carousel gallery</h1>
        <!-- The gallery is rendered inside this element and takes its
             size, which is set in styles.css. -->
        <div #container class="inline-gallery-container"></div>
        <!-- The carousel is always open and cannot be closed. The maximize
             icon expands it to the whole window. -->
        <lg-gallery
            [container]="container"
            [open]="true"
            [closable]="false"
            [showMaximizeIcon]="true"
            [slides]="photos"
            [features]="features"
        />
    `,
})
export class App {
    readonly photos = photos;
    readonly features = [withThumbnail(), withZoom()];
}
