import { Component, signal } from '@angular/core';
import {
    LgCaptionDirective,
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withHash } from '@lightgallery/angular/plugins/hash';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withVideo } from '@lightgallery/angular/plugins/video';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective, LgCaptionDirective],
    template: `
        <h1>lightGallery scratch consumer (AOT + SSR)</h1>
        <lg-gallery [features]="features">
            @for (item of items; track item.src) {
                <a [href]="item.src" [lgGalleryItem]="item">
                    <img [src]="item.thumb" [alt]="item.alt" width="120" />
                </a>
            }
            <ng-template lgCaption let-item>{{ item?.alt }}</ng-template>
        </lg-gallery>
        <lg-gallery [slides]="items" [open]="controlledOpen()" (closed)="controlledOpen.set(false)" />
    `,
})
export class App {
    readonly items: LgGalleryItem[] = [
        { src: 'a.jpg', thumb: 'a-t.jpg', alt: 'First' },
        { src: 'b.jpg', thumb: 'b-t.jpg', alt: 'Second' },
        { src: 'https://www.youtube.com/watch?v=abc123xyz90', alt: 'Video' },
    ];
    readonly features = [withThumbnail(), withZoom(), withVideo(), withHash()];
    readonly controlledOpen = signal(false);
}
