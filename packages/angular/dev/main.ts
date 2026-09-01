import {
    Component,
    computed,
    provideZonelessChangeDetection,
    signal,
    viewChild,
    type TemplateRef,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
    LgCaptionDirective,
    LgGalleryComponent,
    LgGalleryItemDirective,
    type LgGalleryItem,
} from '@lightgallery/angular';
import { withAutoplay } from '@lightgallery/angular/plugins/autoplay';
import {
    withComment,
    type CommentContext,
} from '@lightgallery/angular/plugins/comment';
import { withFullscreen } from '@lightgallery/angular/plugins/fullscreen';
import { withHash } from '@lightgallery/angular/plugins/hash';
import { withPager } from '@lightgallery/angular/plugins/pager';
import { withRotate } from '@lightgallery/angular/plugins/rotate';
import { withShare } from '@lightgallery/angular/plugins/share';
import { withThumbnail } from '@lightgallery/angular/plugins/thumbnail';
import { LgJustifiedGridComponent } from '@lightgallery/angular/plugins/justified';
import { withVideo } from '@lightgallery/angular/plugins/video';
import { withZoom } from '@lightgallery/angular/plugins/zoom';

// CSS stays a consumer import (ADR 0001 §7) — never bundled by the package.
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-transitions.css';
import 'lightgallery/css/lg-rtl.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-pager.css';
import 'lightgallery/css/lg-share.css';
import 'lightgallery/css/lg-rotate.css';
import 'lightgallery/css/lg-comments.css';
import 'lightgallery/css/lg-justified.css';

const picsum = (id: number, w: number, h: number): string =>
    `https://picsum.photos/id/${id}/${w}/${h}`;
// Rig-only responsive ladder: real w-descriptor srcset so device passes
// exercise the plan-002 selection math end to end.
const picsumSrcset = (id: number): string =>
    [640, 960, 1280, 1600]
        .map((w) => `${picsum(id, w, Math.round((w * 1067) / 1600))} ${w}w`)
        .join(', ');

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
    { id: 1043, title: 'Village at dusk' },
    { id: 1044, title: 'Foggy shore' },
    { id: 1051, title: 'Ridge line' },
];

const ITEMS: LgGalleryItem[] = SOURCES.map((source) => ({
    src: picsum(source.id, 1600, 1067),
    srcset: picsumSrcset(source.id),
    sizes: '100vw',
    thumb: picsum(source.id, 240, 160),
    lgSize: '1600-1067',
    alt: source.title,
    caption: source.title,
}));

// Video matrix for device passes: YouTube (endpoint poster), Vimeo with
// an explicit poster, posterless Vimeo/Wistia (thumb-fallback facades)
// and a self-hosted HTML5 file.
const VIDEO_ITEMS: LgGalleryItem[] = [
    {
        src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
        thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/1.jpg',
        alt: 'Big Buck Bunny (YouTube)',
        caption: 'YouTube video slide',
    },
    {
        src: 'https://vimeo.com/112836958',
        poster: picsum(1015, 1280, 720),
        lgSize: '1280-720',
        thumb: picsum(1015, 240, 160),
        alt: 'Vimeo demo video (poster first)',
        caption: 'Vimeo, poster first',
    },
    {
        src: 'https://vimeo.com/115041822',
        lgSize: '1280-720',
        thumb: picsum(1019, 240, 160),
        alt: 'Vimeo demo video',
        caption: 'Vimeo video slide (thumb-fallback facade)',
    },
    {
        src: 'https://sachinchoolur.wistia.com/medias/6tbe0u5g8n',
        lgSize: '1280-720',
        thumb: picsum(1039, 240, 160),
        alt: 'Wistia demo video',
        caption: 'Wistia video slide (thumb-fallback facade)',
    },
    {
        video: {
            source: [
                {
                    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                    type: 'video/mp4',
                },
            ],
            attributes: { preload: false, controls: true },
        },
        poster: picsum(1043, 1280, 720),
        lgSize: '1280-720',
        thumb: picsum(1043, 240, 160),
        alt: 'HTML5 demo video',
        caption: 'HTML5, self-hosted mp4',
    },
];

const RTL_ITEMS: LgGalleryItem[] = ITEMS.slice(0, 5).map((item, i) => ({
    ...item,
    caption: `شريحة ${i + 1} — ${item.alt}`,
}));

// Stress rig: 1,000 items, opened imperatively so the page grid stays
// light. Virtualization bounds the mounted slides + thumb strip.
const STRESS_ITEMS: LgGalleryItem[] = Array.from({ length: 1000 }, (_, i) => ({
    src: `https://picsum.photos/seed/lg-${i}/1600/1067`,
    thumb: `https://picsum.photos/seed/lg-${i}/240/160`,
    lgSize: '1600-1067',
    alt: `Stress slide ${i + 1}`,
    caption: `Stress slide ${i + 1} / 1000`,
}));

/**
 * The device-test matrix — the same scenario ids as the vanilla, React
 * and Vue rigs (hash-routed), so a phone can be deep-linked to e.g.
 * #share on all four ports and the packages compared on identical
 * content. One scenario mounts at a time to keep the page light.
 */
const SCENARIOS = [
    {
        id: 'images',
        title: 'Images',
        note: 'Plain grid — thumbnails + zoom defaults, srcset ladder.',
    },
    {
        id: 'thumbnails',
        title: 'Thumbnails',
        note: 'Static strip + toggle button (animateThumb off, allowMediaOverlap).',
    },
    {
        id: 'scrub',
        title: 'Thumb scrub',
        note: 'scrubThumbnails — drag the strip and the main slide follows instantly; needs the strip to overflow (phone/narrow window).',
    },
    {
        id: 'zoom',
        title: 'Zoom',
        note: 'actualSize + infiniteZoom + icons — pinch, double-tap, drag.',
    },
    {
        id: 'video',
        title: 'Video',
        note: 'YouTube / Vimeo / Wistia facades + HTML5 mp4; autoplayFirstVideo off.',
    },
    {
        id: 'share',
        title: 'Share',
        note: 'preferNativeShare — expect the system share sheet on devices.',
    },
    {
        id: 'dynamic',
        title: 'Dynamic',
        note: '[open]/(closed) + [(index)]; add/remove slides is a signal update.',
    },
    {
        id: 'virtualization',
        title: 'Virtualization',
        note: '1,000 dynamic slides; slide pool 7, windowed strip of iOS-size scrub thumbs.',
    },
    {
        id: 'justified',
        title: 'Justified',
        note: 'Justified trigger rows — resize/rotate the device to re-flow.',
    },
    {
        id: 'rtl',
        title: 'RTL',
        note: 'direction: rtl — arrows/keys/swipe mirror, chrome flips.',
    },
    {
        id: 'kitchen-sink',
        title: 'Kitchen sink',
        note: 'Images + videos, all plugins at once.',
    },
] as const;

type ScenarioId = (typeof SCENARIOS)[number]['id'];

const readHash = (): ScenarioId => {
    const hash = window.location.hash.replace(/^#/, '');
    return SCENARIOS.some((entry) => entry.id === hash)
        ? (hash as ScenarioId)
        : SCENARIOS[0].id;
};

@Component({
    selector: 'demo-root',
    imports: [
        LgGalleryComponent,
        LgGalleryItemDirective,
        LgCaptionDirective,
        LgJustifiedGridComponent,
    ],
    template: `
        <h1>&#64;lightgallery/angular dev demo</h1>
        <nav class="scenario-nav">
            @for (entry of scenarios; track entry.id) {
                <a
                    [href]="'#' + entry.id"
                    [class.active]="entry.id === current()"
                >
                    {{ entry.title }}
                </a>
            }
        </nav>
        <p class="scenario-note">{{ note() }}</p>

        @switch (current()) {
            @case ('images') {
                <lg-gallery [features]="imagesFeatures">
                    <div class="demo-grid">
                        @for (item of items; track item.src) {
                            <a [href]="item.src" [lgGalleryItem]="item">
                                <img [src]="item.thumb" [alt]="item.alt" />
                            </a>
                        }
                    </div>
                </lg-gallery>
            }
            @case ('thumbnails') {
                <lg-gallery
                    [features]="thumbnailsFeatures"
                    [allowMediaOverlap]="true"
                >
                    <div class="demo-grid">
                        @for (item of items; track item.src) {
                            <a [href]="item.src" [lgGalleryItem]="item">
                                <img [src]="item.thumb" [alt]="item.alt" />
                            </a>
                        }
                    </div>
                </lg-gallery>
            }
            @case ('scrub') {
                <lg-gallery [features]="scrubFeatures">
                    <div class="demo-grid">
                        @for (item of items; track item.src) {
                            <a [href]="item.src" [lgGalleryItem]="item">
                                <img [src]="item.thumb" [alt]="item.alt" />
                            </a>
                        }
                    </div>
                </lg-gallery>
            }
            @case ('zoom') {
                <lg-gallery [features]="zoomFeatures">
                    <div class="demo-grid">
                        @for (item of items; track item.src) {
                            <a [href]="item.src" [lgGalleryItem]="item">
                                <img [src]="item.thumb" [alt]="item.alt" />
                            </a>
                        }
                    </div>
                </lg-gallery>
            }
            @case ('video') {
                <lg-gallery [features]="videoFeatures">
                    <div class="demo-grid">
                        @for (item of videoItems; track item.alt) {
                            <a [lgGalleryItem]="item">
                                <img [src]="item.thumb" [alt]="item.alt" />
                            </a>
                        }
                    </div>
                </lg-gallery>
            }
            @case ('share') {
                <lg-gallery [features]="shareFeatures">
                    <div class="demo-grid">
                        @for (item of items.slice(0, 5); track item.src) {
                            <a [href]="item.src" [lgGalleryItem]="item">
                                <img [src]="item.thumb" [alt]="item.alt" />
                            </a>
                        }
                    </div>
                </lg-gallery>
            }
            @case ('dynamic') {
                <div class="demo-controls">
                    <button type="button" (click)="dynOpen.set(true)">
                        open gallery
                    </button>
                    <button type="button" (click)="addSlide()">
                        add slide
                    </button>
                    <button type="button" (click)="removeSlide()">
                        remove slide
                    </button>
                    <span>
                        {{ dynSlides().length }} slides · index
                        {{ dynIndex() }}
                    </span>
                </div>
                <lg-gallery
                    [slides]="dynSlides()"
                    [features]="imagesFeatures"
                    [open]="dynOpen()"
                    (closed)="dynOpen.set(false)"
                    [(index)]="dynIndex"
                />
            }
            @case ('virtualization') {
                <div class="demo-controls">
                    <button
                        type="button"
                        (click)="stressGallery.openGallery(0)"
                    >
                        open 1,000-item gallery
                    </button>
                    <button
                        type="button"
                        (click)="stressGallery.openGallery(500)"
                    >
                        open at #500
                    </button>
                </div>
                <lg-gallery
                    #stressGallery="lgGallery"
                    [slides]="stressItems"
                    [features]="stressFeatures"
                    [virtualization]="{ slides: 7, thumbs: 'auto' }"
                    [zoomFromOrigin]="false"
                />
            }
            @case ('justified') {
                <lg-gallery [features]="imagesFeatures">
                    <lg-justified-grid [rowHeight]="140" [gap]="8">
                        @for (item of items; track 'justified-' + item.src) {
                            <a
                                [href]="item.src"
                                [lgGalleryItem]="item"
                                data-lg-size="1600-1067"
                            >
                                <img [src]="item.thumb" [alt]="item.alt" />
                            </a>
                        }
                    </lg-justified-grid>
                </lg-gallery>
            }
            @case ('rtl') {
                <div class="demo-controls">
                    <button
                        type="button"
                        (click)="rtlGallery.openGallery(0)"
                    >
                        open RTL gallery (direction: rtl)
                    </button>
                </div>
                <lg-gallery
                    #rtlGallery="lgGallery"
                    [slides]="rtlItems"
                    direction="rtl"
                    [features]="imagesFeatures"
                />
            }
            @default {
                <div class="demo-controls">
                    <button
                        type="button"
                        (click)="sinkGallery.openGallery(2)"
                    >
                        Imperative: open at slide 3
                    </button>
                    <span class="event">{{ lastEvent() }}</span>
                </div>
                <lg-gallery
                    #sinkGallery="lgGallery"
                    [mousewheel]="true"
                    [features]="kitchenSinkFeatures()"
                    (beforeSlide)="
                        lastEvent.set('beforeSlide → ' + $event.index)
                    "
                    (afterSlide)="
                        lastEvent.set('afterSlide → ' + $event.index)
                    "
                >
                    <div class="demo-grid">
                        @for (item of sinkItems; track item.alt) {
                            <a [lgGalleryItem]="item">
                                <img [src]="item.thumb" [alt]="item.alt" />
                            </a>
                        }
                    </div>
                    <ng-template lgCaption let-item let-index="index">
                        <h4>{{ item?.caption }}</h4>
                        <p>Slide {{ index + 1 }} — template caption</p>
                    </ng-template>
                </lg-gallery>
                <ng-template #commentsTpl let-item let-index="index">
                    <div style="padding: 1rem">
                        <p><strong>{{ item?.caption }}</strong></p>
                        <p>
                            Comment panel for slide {{ index + 1 }} — bring
                            any comment system as a template.
                        </p>
                    </div>
                </ng-template>
            }
        }
    `,
    styles: `
        :host {
            display: block;
            font-family: system-ui, sans-serif;
            padding: 1rem 2rem 4rem;
        }
        .scenario-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 4px 12px;
            margin: 12px 0;
        }
        .scenario-nav a {
            text-decoration: none;
        }
        .scenario-nav a.active {
            font-weight: 700;
            text-decoration: underline;
        }
        .scenario-note {
            color: #667;
            margin: 0 0 12px;
        }
        .demo-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .demo-grid img {
            display: block;
            width: 160px;
            height: 107px;
            object-fit: cover;
        }
        .demo-controls {
            display: flex;
            gap: 8px;
            align-items: center;
            margin-bottom: 12px;
        }
        .event {
            color: #666;
        }
    `,
})
class DemoRoot {
    readonly scenarios = SCENARIOS;
    readonly items = ITEMS;
    readonly videoItems = VIDEO_ITEMS;
    readonly rtlItems = RTL_ITEMS;
    readonly stressItems = STRESS_ITEMS;
    readonly sinkItems = [...ITEMS, ...VIDEO_ITEMS.slice(0, 3)];

    readonly current = signal<ScenarioId>(readHash());
    readonly note = computed(
        () =>
            SCENARIOS.find((entry) => entry.id === this.current())?.note ?? '',
    );

    readonly imagesFeatures = [withThumbnail(), withZoom()];
    readonly scrubFeatures = [withThumbnail({ scrubThumbnails: true })];
    readonly thumbnailsFeatures = [
        withThumbnail({ animateThumb: false, toggleThumb: true }),
    ];
    readonly zoomFeatures = [
        withZoom({
            showZoomInOutIcons: true,
            actualSize: true,
            infiniteZoom: true,
        }),
        withThumbnail(),
    ];
    readonly videoFeatures = [
        withVideo({ autoplayFirstVideo: false }),
        withThumbnail(),
    ];
    readonly shareFeatures = [
        withShare({ preferNativeShare: true }),
        withThumbnail(),
    ];
    // iOS-filmstrip-sized thumbs + scrub over 1,000 slides.
    readonly stressFeatures = [
        withThumbnail({
            scrubThumbnails: true,
            thumbWidth: 28,
            thumbHeight: '42px',
            thumbMargin: 2,
        }),
    ];

    private readonly commentsTpl =
        viewChild<TemplateRef<CommentContext>>('commentsTpl');
    // Kitchen sink (zoom before rotate: zoom stays the outermost wrapper,
    // 2.x DOM order).
    readonly kitchenSinkFeatures = computed(() => [
        withThumbnail({ thumbWidth: 100 }),
        withZoom({ showZoomInOutIcons: true, actualSize: true }),
        withVideo(),
        withAutoplay(),
        withFullscreen(),
        withHash({ galleryId: 'demo' }),
        withPager(),
        withShare(),
        withRotate(),
        withComment({
            commentBox: true,
            commentsTemplate: this.commentsTpl(),
        }),
    ]);

    readonly lastEvent = signal('');

    readonly dynOpen = signal(false);
    readonly dynIndex = signal(0);
    readonly dynCount = signal(4);
    readonly dynSlides = computed(() => ITEMS.slice(0, this.dynCount()));

    constructor() {
        // Unknown hashes belong to the galleries themselves (the Hash
        // plugin writes #lg=… deep links) — never switch scenarios on one.
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace(/^#/, '');
            if (SCENARIOS.some((entry) => entry.id === hash)) {
                this.current.set(hash as ScenarioId);
            }
        });
    }

    addSlide(): void {
        this.dynCount.update((count) => Math.min(count + 1, ITEMS.length));
    }

    removeSlide(): void {
        this.dynCount.update((count) => Math.max(count - 1, 1));
    }
}

void bootstrapApplication(DemoRoot, {
    providers: [provideZonelessChangeDetection()],
});
