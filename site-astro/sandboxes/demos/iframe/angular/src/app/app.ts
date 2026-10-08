import { Component, signal } from '@angular/core';
import { LgGalleryComponent, type LgGalleryItem } from '@lightgallery/angular';

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent],
    template: `
        <h1>lightGallery iframe</h1>
        <div class="gallery">
            <button type="button" (click)="openSlide(0)">Open website</button>
            <button type="button" (click)="openSlide(1)">Open map</button>
            <button type="button" (click)="openSlide(2)">Open PDF file</button>
        </div>
        <lg-gallery
            [slides]="slides"
            [open]="open()"
            (closed)="open.set(false)"
            [(index)]="index"
        />
    `,
})
export class App {
    // `iframe: true` shows the page at `src` in an iframe.
    readonly slides: LgGalleryItem[] = [
        {
            src: 'https://example.com/',
            iframe: true,
            iframeTitle: 'Website',
        },
        {
            src: 'https://www.openstreetmap.org/export/embed.html?bbox=-5.2884,35.1588,-5.2484,35.1788',
            iframe: true,
            iframeTitle: 'Map',
        },
        {
            src: 'https://www.lightgalleryjs.com/pdf/sample.pdf',
            iframe: true,
            iframeTitle: 'PDF file',
        },
    ];

    readonly open = signal(false);
    readonly index = signal(0);

    openSlide(slide: number) {
        this.index.set(slide);
        this.open.set(true);
    }
}
