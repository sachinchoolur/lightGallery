import { Component, signal } from '@angular/core';
import { LgGalleryComponent } from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent],
    template: `
        <h1>lightGallery virtualization</h1>
        <button type="button" (click)="open.set(true)">
            Open the 1,000-slide gallery
        </button>
        <!-- slides: how many slides are in the DOM at once, around the
             current one. thumbs: only the visible thumbnails are in the DOM,
             plus one more viewport of them on each side. -->
        <lg-gallery
            [slides]="slides"
            [features]="features"
            [virtualization]="{ slides: 7, thumbs: 'auto' }"
            [open]="open()"
            (closed)="open.set(false)"
            [(index)]="index"
        />
    `,
})
export class App {
    readonly slides = Array.from({ length: 1000 }, (_, i) => ({
        src: `https://picsum.photos/seed/lg-${i}/1600/1067`,
        thumb: `https://picsum.photos/seed/lg-${i}/240/160`,
        caption: `Slide ${i + 1} / 1000`,
    }));
    readonly features = [withThumbnail()];

    readonly open = signal(false);
    readonly index = signal(0);
}
