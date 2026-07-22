import {
    Component,
    provideZonelessChangeDetection,
    signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
    LgCaptionDirective,
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { withVideo } from '@lightgallery/angular/plugins/video';
import { withZoom } from '@lightgallery/angular/plugins/zoom';
import type { GalleryMode } from '@lightgallery/headless';

// CSS stays a consumer import (ADR 0001 §7) — never bundled by the package.
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-transitions.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-video.css';

const picsum = (id: number, w: number, h: number): string =>
    `https://picsum.photos/id/${id}/${w}/${h}`;

interface DemoSource {
    id: number;
    title: string;
}

const SOURCES: DemoSource[] = [
    { id: 1015, title: 'River between mountains' },
    { id: 1016, title: 'Canyon walls' },
    { id: 1018, title: 'Snowy peak' },
    { id: 1019, title: 'Lakeside cliffs' },
    { id: 1039, title: 'Waterfall in the forest' },
    { id: 1043, title: 'Foggy ridge' },
];

const ITEMS: LgGalleryItem[] = [
    ...SOURCES.map((source) => ({
        src: picsum(source.id, 1600, 1067),
        thumb: picsum(source.id, 240, 160),
        lgSize: '1600-1067',
        alt: source.title,
        caption: source.title,
    })),
    {
        src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
        thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/1.jpg',
        alt: 'Big Buck Bunny (YouTube)',
        caption: 'YouTube video slide (wave-1 video feature)',
    },
];

@Component({
    selector: 'demo-root',
    imports: [LgGalleryComponent, LgGalleryItemDirective, LgCaptionDirective],
    template: `
        <h1>&#64;lightgallery/angular — plan 003 dev demo</h1>

        <section>
            <h2>Uncontrolled (triggers + zoom-from-origin)</h2>
            <p>
                <label>
                    Transition:
                    <select
                        [value]="mode()"
                        (change)="onModeChange($event)"
                    >
                        <option value="lg-slide">lg-slide</option>
                        <option value="lg-fade">lg-fade</option>
                        <option value="lg-lollipop">
                            lg-lollipop (CSS-only)
                        </option>
                    </select>
                </label>
                <label>
                    <input
                        type="checkbox"
                        [checked]="loop()"
                        (change)="toggleLoop($event)"
                    />
                    loop
                </label>
                <label>
                    <input
                        type="checkbox"
                        [checked]="hideBars()"
                        (change)="toggleHideBars($event)"
                    />
                    hideBarsDelay 2s
                </label>
            </p>
            <lg-gallery
                #lg="lgGallery"
                [mode]="mode()"
                [loop]="loop()"
                [mousewheel]="true"
                [hideBarsDelay]="hideBars() ? 2000 : 0"
                [features]="features"
                (beforeSlide)="lastEvent.set('beforeSlide → ' + $event.index)"
                (afterSlide)="lastEvent.set('afterSlide → ' + $event.index)"
                (slideItemLoad)="
                    lastEvent.set('slideItemLoad → ' + $event.index)
                "
            >
                <div class="grid">
                    @for (item of items; track item.src) {
                        <a
                            [href]="item.src"
                            [lgGalleryItem]="item"
                            class="thumb"
                        >
                            <img [src]="item.thumb" [alt]="item.alt" />
                        </a>
                    }
                </div>
                <ng-template lgCaption let-item let-index="index">
                    <h4>{{ item?.caption }}</h4>
                    <p>Slide {{ index + 1 }} — template caption</p>
                </ng-template>
            </lg-gallery>
            <p>
                <button type="button" (click)="lg.openGallery(2)">
                    Imperative: open at slide 3
                </button>
                <span class="event">{{ lastEvent() }}</span>
            </p>
        </section>

        <section>
            <h2>Controlled ([open] + (closed) + [(index)])</h2>
            <p>
                <button type="button" (click)="controlledOpen.set(true)">
                    Open
                </button>
                <button type="button" (click)="controlledIndex.set(4)">
                    index → 5
                </button>
                current index: {{ controlledIndex() }}
            </p>
            <lg-gallery
                [slides]="items"
                [open]="controlledOpen()"
                (closed)="controlledOpen.set(false)"
                [(index)]="controlledIndex"
                [zoomFromOrigin]="false"
            />
        </section>
    `,
    styles: `
        :host {
            display: block;
            font-family: system-ui, sans-serif;
            padding: 1rem 2rem 4rem;
        }
        .grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .thumb img {
            display: block;
            width: 240px;
            height: 160px;
            object-fit: cover;
            border-radius: 4px;
        }
        label {
            margin-right: 1rem;
        }
        .event {
            margin-left: 1rem;
            color: #666;
        }
    `,
})
class DemoRoot {
    readonly items = ITEMS;
    readonly features = [
        withThumbnail({ thumbWidth: 100 }),
        withZoom({ showZoomInOutIcons: true }),
        withVideo(),
    ];
    readonly mode = signal<GalleryMode>('lg-slide');
    readonly loop = signal(true);
    readonly hideBars = signal(false);
    readonly lastEvent = signal('');
    readonly controlledOpen = signal(false);
    readonly controlledIndex = signal(0);

    onModeChange(event: Event): void {
        this.mode.set((event.target as HTMLSelectElement).value as GalleryMode);
    }

    toggleLoop(event: Event): void {
        this.loop.set((event.target as HTMLInputElement).checked);
    }

    toggleHideBars(event: Event): void {
        this.hideBars.set((event.target as HTMLInputElement).checked);
    }
}

void bootstrapApplication(DemoRoot, {
    providers: [provideZonelessChangeDetection()],
});
