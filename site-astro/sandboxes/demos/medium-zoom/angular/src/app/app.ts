import { Component } from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';
import { withMediumZoom } from '@lightgallery/angular/plugins/mediumZoom';

// lgBackgroundColor sets the backdrop color for one image; the default is
// black.
const image = (id: number, alt: string, lgBackgroundColor?: string) => ({
    src: `https://picsum.photos/id/${id}/1600/1000`,
    thumb: `https://picsum.photos/id/${id}/800/500`,
    alt,
    lgSize: '1600-1000',
    lgBackgroundColor,
});

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery medium zoom</h1>
        <!-- Click an image to zoom it in place. -->
        <lg-gallery [features]="features">
            <article class="article">
                @for (image of images; track image.src) {
                <p>{{ text }}</p>
                <a [href]="image.src" [lgGalleryItem]="image">
                    <img [src]="image.thumb" [alt]="image.alt" />
                </a>
                }
                <p>{{ text }}</p>
            </article>
        </lg-gallery>
    `,
})
export class App {
    readonly images = [
        image(15, 'Sample photo 1', '#fff'),
        image(28, 'Sample photo 2', 'rgb(28 62 74)'),
        image(29, 'Sample photo 3'),
    ];
    readonly text =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eleifend ' +
        'purus ligula, at gravida augue ullamcorper et. Cras placerat eu lectus ' +
        'a condimentum. Nam hendrerit sem augue, ac porta ante venenatis vel.';
    // margin is the space kept above and below the zoomed image, in px.
    readonly features = [withMediumZoom({ margin: 24 })];
}
