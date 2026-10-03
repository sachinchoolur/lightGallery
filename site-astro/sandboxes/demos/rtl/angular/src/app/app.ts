import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';

import { photos } from '../photos';

const captions = [
    'الصورة الأولى',
    'الصورة الثانية',
    'الصورة الثالثة',
    'الصورة الرابعة',
    'الصورة الخامسة',
    'الصورة السادسة',
    'الصورة السابعة',
    'الصورة الثامنة',
];

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery RTL</h1>
        <!-- 'rtl' makes the gallery right-to-left. Use 'auto' to follow the
             dir attribute of the page's <html> or <body> instead. -->
        <lg-gallery direction="rtl">
            <!-- dir="rtl" mirrors the grid on the page. -->
            <div class="gallery" dir="rtl">
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
    readonly items = photos.map((photo, index) => ({
        ...photo,
        alt: captions[index],
        caption: captions[index],
    }));
}
