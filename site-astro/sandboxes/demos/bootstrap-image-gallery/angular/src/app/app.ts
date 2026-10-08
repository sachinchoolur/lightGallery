import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery with a Bootstrap image gallery</h1>
        <!-- The items can sit at any depth inside the gallery, so the
             Bootstrap grid keeps its own markup. -->
        <lg-gallery [features]="features">
            <div class="row g-2">
                @for (column of columns; track $index) {
                <div class="col-4">
                    @for (photo of column; track photo.src) {
                    <a
                        class="d-block mb-2"
                        [href]="photo.src"
                        [lgGalleryItem]="photo"
                    >
                        <img
                            [src]="photo.thumb"
                            class="d-block w-100"
                            [alt]="photo.alt"
                        />
                    </a>
                    }
                </div>
                }
            </div>
        </lg-gallery>
    `,
})
export class App {
    readonly features = [withZoom(), withThumbnail()];

    // The photos of each grid column. `lgSize` is the full-size image's
    // WIDTH-HEIGHT; it lets the image open from its thumbnail.
    readonly columns: LgGalleryItem[][] = [
        [
            {
                src: 'https://picsum.photos/id/10/1600/1067',
                thumb: 'https://picsum.photos/id/10/480/320',
                alt: 'Sample photo 1',
                lgSize: '1600-1067',
            },
            {
                src: 'https://picsum.photos/id/11/1200/1600',
                thumb: 'https://picsum.photos/id/11/480/640',
                alt: 'Sample photo 2',
                lgSize: '1200-1600',
            },
        ],
        [
            {
                src: 'https://picsum.photos/id/15/1200/1600',
                thumb: 'https://picsum.photos/id/15/480/640',
                alt: 'Sample photo 3',
                lgSize: '1200-1600',
            },
            {
                src: 'https://picsum.photos/id/16/1600/1067',
                thumb: 'https://picsum.photos/id/16/480/320',
                alt: 'Sample photo 4',
                lgSize: '1600-1067',
            },
        ],
        [
            {
                src: 'https://picsum.photos/id/28/1200/1200',
                thumb: 'https://picsum.photos/id/28/480/480',
                alt: 'Sample photo 5',
                lgSize: '1200-1200',
            },
            {
                src: 'https://picsum.photos/id/29/1200/1200',
                thumb: 'https://picsum.photos/id/29/480/480',
                alt: 'Sample photo 6',
                lgSize: '1200-1200',
            },
        ],
    ];
}
