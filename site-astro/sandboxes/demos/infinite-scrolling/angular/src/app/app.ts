import {
    afterRenderEffect,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import {
    LgGalleryComponent,
    LgGalleryItemDirective,
} from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';

import { photos as firstPhotos, type Photo } from '../photos';

const PAGE_SIZE = 12;
const LAST_PAGE = 8;

// Stands in for a request to your server: resolves to one page of photos.
function fetchPage(page: number): Promise<Photo[]> {
    const photos = Array.from({ length: PAGE_SIZE }, (_, i) => {
        const n = firstPhotos.length + (page - 1) * PAGE_SIZE + i + 1;
        return {
            src: `https://picsum.photos/seed/lg-${n}/1600/1067`,
            thumb: `https://picsum.photos/seed/lg-${n}/360/240`,
            alt: `Sample photo ${n}`,
            lgSize: '1600-1067',
        };
    });
    return new Promise((resolve) => setTimeout(() => resolve(photos), 400));
}

@Component({
    selector: 'app-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective],
    template: `
        <h1>lightGallery infinite scrolling</h1>
        <lg-gallery [features]="features" [speed]="500">
            <div class="gallery">
                @for (photo of photos(); track photo.src) {
                <a [href]="photo.src" [lgGalleryItem]="photo">
                    <img [src]="photo.thumb" [alt]="photo.alt" />
                </a>
                }
            </div>
        </lg-gallery>
        <p #status>
            {{
                page() === lastPage
                    ? 'All photos loaded.'
                    : 'Loading more photos…'
            }}
        </p>
    `,
})
export class App {
    readonly features = [withThumbnail()];
    readonly lastPage = LAST_PAGE;
    readonly photos = signal(firstPhotos);
    readonly page = signal(0);

    private readonly status =
        viewChild.required<ElementRef<HTMLElement>>('status');
    private loading = false;

    constructor() {
        // The status line sits after the gallery. When it comes within
        // 200px of the viewport, the next page loads.
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    this.loadNextPage();
                }
            },
            { rootMargin: '200px' },
        );
        // Runs after the first render and after each page is rendered.
        // Observing again makes a status line that is still in view after
        // a short page load the next one too.
        afterRenderEffect(() => {
            observer.disconnect();
            if (this.page() < LAST_PAGE) {
                observer.observe(this.status().nativeElement);
            }
        });
        inject(DestroyRef).onDestroy(() => observer.disconnect());
    }

    private async loadNextPage(): Promise<void> {
        if (this.loading) {
            return;
        }
        this.loading = true;
        const next = await fetchPage(this.page() + 1);
        // Appending to the array is all it takes: the gallery picks up
        // the new slides on the next render.
        this.photos.update((current) => [...current, ...next]);
        this.page.update((page) => page + 1);
        this.loading = false;
    }
}
