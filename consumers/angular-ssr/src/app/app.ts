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
        <main>
            <h1>lightGallery consumer</h1>
            <lg-gallery [features]="features">
                <div class="grid">
                    @for (item of items; track item.src) {
                        <a [lgGalleryItem]="item"><img [src]="item.thumb" [alt]="item.alt" /></a>
                    }
                </div>
            </lg-gallery>
        </main>
    `,
})
export class App {
    // The same four photos in every consumer app; the check compares them.
    readonly items: LgGalleryItem[] = [1, 2, 3, 4].map((n) => ({
        src: `/photos/${n}.png`,
        thumb: `/photos/${n}-thumb.png`,
        alt: `Photo ${n}`,
        caption: `Photo ${n} caption`,
        lgSize: '1600-1067',
    }));
    readonly features = [withThumbnail({ animateThumb: true }), withZoom()];
}
