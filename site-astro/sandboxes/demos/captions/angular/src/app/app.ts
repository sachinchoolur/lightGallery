import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery captions</h1>
        <lg-gallery>
            <div class="gallery">
                @for (item of items; track item.src) {
                <a [href]="item.src" [lgGalleryItem]="item">
                    <img [src]="item.thumb" [alt]="item.alt" />
                </a>
                }
            </div>
        </lg-gallery>
    `,
})
export class App {
    // `captionHtml` takes an HTML string; `caption` takes plain text.
    readonly items: LgGalleryItem[] = [
        {
            src: 'https://picsum.photos/id/10/1600/1067',
            thumb: 'https://picsum.photos/id/10/360/240',
            alt: 'Forest and sea',
            lgSize: '1600-1067',
            captionHtml:
                '<h4>Forest and sea</h4><p>Evergreen treetops in front of a calm blue bay.</p>',
        },
        {
            src: 'https://picsum.photos/id/11/1600/1067',
            thumb: 'https://picsum.photos/id/11/360/240',
            alt: 'Misty valley',
            lgSize: '1600-1067',
            captionHtml:
                '<h4>Misty valley</h4><p>A stream winds through a meadow under a grey sky.</p>',
        },
        {
            src: 'https://picsum.photos/id/15/1600/1067',
            thumb: 'https://picsum.photos/id/15/360/240',
            alt: 'Waterfall',
            lgSize: '1600-1067',
            captionHtml:
                '<h4>Waterfall</h4><p>A narrow waterfall drops into a rocky gorge.</p>',
        },
        {
            src: 'https://picsum.photos/id/16/1600/1067',
            thumb: 'https://picsum.photos/id/16/360/240',
            alt: 'Rocky shore',
            lgSize: '1600-1067',
            captionHtml:
                '<h4>Rocky shore</h4><p>Driftwood and boulders at the edge of clear water.</p>',
        },
    ];
}
