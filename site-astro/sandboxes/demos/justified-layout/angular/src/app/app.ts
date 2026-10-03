import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';
import { LgJustifiedGridComponent } from '@lightgallery/angular/plugins/justified';

// Photos of different shapes: photo id, then the width and height of the
// full-size image.
const shapes = [
    [10, 1600, 1200],
    [11, 1200, 1600],
    [15, 1600, 900],
    [16, 1200, 1200],
    [28, 1600, 1000],
    [29, 1000, 1600],
    [37, 1600, 1200],
    [110, 1600, 800],
    [43, 1200, 1600],
    [49, 1600, 900],
    [57, 1600, 1200],
    [65, 1200, 1200],
];

const items = shapes.map(([id, width, height], index) => ({
    src: `https://picsum.photos/id/${id}/${width}/${height}`,
    thumb: `https://picsum.photos/id/${id}/${width / 4}/${height / 4}`,
    alt: `Sample photo ${index + 1}`,
    lgSize: `${width}-${height}`,
}));

@Component({
    selector: 'app-root',
    imports: [
        LgGalleryComponent,
        LgGalleryItemDirective,
        LgJustifiedGridComponent,
    ],
    template: `
        <h1>lightGallery justified layout</h1>
        <lg-gallery>
            <!-- Lays the thumbnails out in rows of equal height that fill
                 its width. data-lg-size gives it each photo's shape, so the
                 rows are known before the thumbnails load. -->
            <lg-justified-grid>
                @for (item of items; track item.src) {
                <a
                    [href]="item.src"
                    [lgGalleryItem]="item"
                    [attr.data-lg-size]="item.lgSize"
                >
                    <img [src]="item.thumb" [alt]="item.alt" />
                </a>
                }
            </lg-justified-grid>
        </lg-gallery>
    `,
})
export class App {
    readonly items = items;
}
