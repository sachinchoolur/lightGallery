/**
 * Shared media catalog for the React, Vue and Angular consumer apps.
 *
 * Framework-neutral on purpose: plain data with string captions, so all
 * three apps test identical content and a bug that shows in one can be
 * reproduced in the others by opening the same page.
 */

/** Structural subset of the gallery item every framework package accepts. */
export interface DemoItem {
    src?: string;
    thumb: string;
    alt: string;
    caption: string;
    lgSize?: string;
    poster?: string;
    video?: {
        source: { src: string; type: string }[];
        attributes: Record<string, boolean | string>;
    };
    /** Grid-trigger thumbnail box, so the page layout matches the shape. */
    thumbWidth: number;
    thumbHeight: number;
    /** Filter tags for the pages ("tiny", "portrait", "video", ...). */
    tags: string[];
}

const picsum = (id: number, w: number, h: number): string =>
    `https://picsum.photos/id/${id}/${w}/${h}`;

const seeded = (seed: string, w: number, h: number): string =>
    `https://picsum.photos/seed/${seed}/${w}/${h}`;

/** Trigger thumbnail that keeps the image's aspect ratio. */
function thumbBox(w: number, h: number, height = 160): [number, number] {
    const ratio = w / h;
    // Clamp extreme strips so one panorama cannot take a whole row.
    const width = Math.round(Math.min(Math.max(height * ratio, 60), 480));
    return [width, height];
}

export type SizeClass = 'tiny' | 'small' | 'medium' | 'large' | 'huge';
export type Shape =
    | 'landscape'
    | 'portrait'
    | 'square'
    | 'panorama'
    | 'column';

interface SizeSample {
    id: number;
    w: number;
    h: number;
    size: SizeClass;
    shape: Shape;
}

/**
 * Every size class in every shape. Tiny and small sit below a phone
 * stage (actual-size zoom must stay at 1), huge ones exceed a desktop
 * stage several times over (fit, pan bounds, decode time).
 */
const SIZE_SAMPLES: SizeSample[] = [
    { id: 1003, w: 120, h: 80, size: 'tiny', shape: 'landscape' },
    { id: 1005, w: 80, h: 120, size: 'tiny', shape: 'portrait' },
    { id: 1011, w: 100, h: 100, size: 'tiny', shape: 'square' },
    { id: 1013, w: 240, h: 60, size: 'tiny', shape: 'panorama' },
    { id: 1021, w: 60, h: 240, size: 'tiny', shape: 'column' },

    { id: 1024, w: 320, h: 213, size: 'small', shape: 'landscape' },
    { id: 1025, w: 213, h: 320, size: 'small', shape: 'portrait' },
    { id: 1026, w: 300, h: 300, size: 'small', shape: 'square' },
    { id: 1027, w: 480, h: 120, size: 'small', shape: 'panorama' },
    { id: 1028, w: 120, h: 480, size: 'small', shape: 'column' },

    { id: 1035, w: 800, h: 533, size: 'medium', shape: 'landscape' },
    { id: 1040, w: 533, h: 800, size: 'medium', shape: 'portrait' },
    { id: 1036, w: 700, h: 700, size: 'medium', shape: 'square' },
    { id: 1043, w: 1200, h: 400, size: 'medium', shape: 'panorama' },
    { id: 1047, w: 400, h: 1200, size: 'medium', shape: 'column' },

    { id: 1015, w: 1600, h: 1067, size: 'large', shape: 'landscape' },
    { id: 1016, w: 1067, h: 1600, size: 'large', shape: 'portrait' },
    { id: 1018, w: 1400, h: 1400, size: 'large', shape: 'square' },
    { id: 1019, w: 2400, h: 800, size: 'large', shape: 'panorama' },
    { id: 1039, w: 800, h: 2400, size: 'large', shape: 'column' },

    { id: 1044, w: 4000, h: 2667, size: 'huge', shape: 'landscape' },
    { id: 1051, w: 2667, h: 4000, size: 'huge', shape: 'portrait' },
    { id: 1053, w: 3000, h: 3000, size: 'huge', shape: 'square' },
    { id: 1055, w: 5000, h: 1200, size: 'huge', shape: 'panorama' },
    { id: 1056, w: 1200, h: 5000, size: 'huge', shape: 'column' },
];

export const SIZE_CLASSES: SizeClass[] = [
    'tiny',
    'small',
    'medium',
    'large',
    'huge',
];
export const SHAPES: Shape[] = [
    'landscape',
    'portrait',
    'square',
    'panorama',
    'column',
];

export const SIZE_ITEMS: DemoItem[] = SIZE_SAMPLES.map((sample) => {
    const { id, w, h, size, shape } = sample;
    const [thumbWidth, thumbHeight] = thumbBox(w, h);
    const label = `${size} ${shape} (${w}×${h})`;
    return {
        src: picsum(id, w, h),
        thumb: picsum(id, thumbWidth, thumbHeight),
        alt: label,
        caption: label,
        lgSize: `${w}-${h}`,
        thumbWidth,
        thumbHeight,
        tags: [size, shape, 'image'],
    };
});

/** Aspect ratios the thumbnail and justified sets cycle through. */
const RATIOS: [number, number, Shape][] = [
    [1600, 1067, 'landscape'],
    [1067, 1600, 'portrait'],
    [1200, 1200, 'square'],
    [2400, 900, 'panorama'],
    [1600, 900, 'landscape'],
    [900, 1600, 'portrait'],
    [1600, 1200, 'landscape'],
    [1200, 1600, 'portrait'],
];

/**
 * A large set of images with mixed aspect ratios for the thumbnail
 * strip (drag, scrub, pager centering, virtualization) and for the
 * justified grid. Seeded URLs so any count stays stable across reloads.
 */
export function manyItems(count: number): DemoItem[] {
    return Array.from({ length: count }, (_, i) => {
        const [w, h, shape] = RATIOS[i % RATIOS.length];
        const [thumbWidth, thumbHeight] = thumbBox(w, h);
        const seed = `lg-demo-${i}`;
        const label = `${i + 1} / ${count} — ${shape} (${w}×${h})`;
        return {
            src: seeded(seed, w, h),
            thumb: seeded(seed, thumbWidth, thumbHeight),
            alt: label,
            caption: label,
            lgSize: `${w}-${h}`,
            thumbWidth,
            thumbHeight,
            tags: [shape, 'image'],
        };
    });
}

export const THUMB_COUNTS = [10, 30, 100, 250, 500];

const MP4 =
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

/**
 * One slide per provider and poster path: explicit poster, provider
 * thumbnail fallback, and the facade built from the item thumb.
 */
export const VIDEO_ITEMS: DemoItem[] = [
    {
        src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
        thumb: 'https://img.youtube.com/vi/EIUJfXk3_3w/mqdefault.jpg',
        alt: 'YouTube, poster from the YouTube thumbnail',
        caption: 'YouTube, poster from the YouTube thumbnail',
        thumbWidth: 284,
        thumbHeight: 160,
        tags: ['video', 'youtube'],
    },
    {
        src: 'https://www.youtube.com/watch?v=EIUJfXk3_3w',
        poster: picsum(1015, 1280, 720),
        lgSize: '1280-720',
        thumb: picsum(1015, 284, 160),
        alt: 'YouTube, explicit poster',
        caption: 'YouTube, explicit poster',
        thumbWidth: 284,
        thumbHeight: 160,
        tags: ['video', 'youtube'],
    },
    {
        src: 'https://vimeo.com/112836958',
        poster: picsum(1016, 1280, 720),
        lgSize: '1280-720',
        thumb: picsum(1016, 284, 160),
        alt: 'Vimeo, explicit poster',
        caption: 'Vimeo, explicit poster',
        thumbWidth: 284,
        thumbHeight: 160,
        tags: ['video', 'vimeo'],
    },
    {
        src: 'https://vimeo.com/115041822',
        lgSize: '1280-720',
        thumb: picsum(1019, 284, 160),
        alt: 'Vimeo, facade from the item thumb',
        caption: 'Vimeo, facade from the item thumb',
        thumbWidth: 284,
        thumbHeight: 160,
        tags: ['video', 'vimeo'],
    },
    {
        src: 'https://sachinchoolur.wistia.com/medias/6tbe0u5g8n',
        lgSize: '1280-720',
        thumb: picsum(1039, 284, 160),
        alt: 'Wistia, facade from the item thumb',
        caption: 'Wistia, facade from the item thumb',
        thumbWidth: 284,
        thumbHeight: 160,
        tags: ['video', 'wistia'],
    },
    {
        video: {
            source: [{ src: MP4, type: 'video/mp4' }],
            attributes: { preload: false, controls: true },
        },
        poster: picsum(1043, 1280, 720),
        lgSize: '1280-720',
        thumb: picsum(1043, 284, 160),
        alt: 'HTML5 mp4, with poster',
        caption: 'HTML5 mp4, with poster',
        thumbWidth: 284,
        thumbHeight: 160,
        tags: ['video', 'html5'],
    },
    {
        video: {
            source: [{ src: MP4, type: 'video/mp4' }],
            attributes: { preload: 'metadata', controls: true },
        },
        lgSize: '1280-720',
        thumb: picsum(1044, 284, 160),
        alt: 'HTML5 mp4, no poster',
        caption: 'HTML5 mp4, no poster',
        thumbWidth: 284,
        thumbHeight: 160,
        tags: ['video', 'html5'],
    },
    {
        video: {
            source: [{ src: MP4, type: 'video/mp4' }],
            attributes: { preload: false, controls: true, muted: true, loop: true },
        },
        poster: picsum(1051, 1280, 720),
        lgSize: '1280-720',
        thumb: picsum(1051, 284, 160),
        alt: 'HTML5 mp4, muted and looping',
        caption: 'HTML5 mp4, muted and looping',
        thumbWidth: 284,
        thumbHeight: 160,
        tags: ['video', 'html5'],
    },
];

export const VIDEO_PROVIDERS = ['youtube', 'vimeo', 'wistia', 'html5'];

/**
 * Videos interleaved with images of every size and shape: the slide
 * type changes on almost every navigation, which is where transitions,
 * zoom state and facade teardown tend to leak.
 */
export const MIXED_ITEMS: DemoItem[] = SIZE_ITEMS.flatMap((item, i) =>
    i % 3 === 0 && VIDEO_ITEMS[i / 3] ? [item, VIDEO_ITEMS[i / 3]] : [item],
);

/** Hash-routed pages shared by the three apps. */
export const PAGES = [
    { id: 'combinations', title: 'Plugin combinations' },
    { id: 'sizes', title: 'Image sizes' },
    { id: 'thumbnails', title: 'Thumbnails' },
    { id: 'video', title: 'Video' },
    { id: 'justified', title: 'Justified' },
    { id: 'mixed', title: 'Mixed media' },
] as const;

export type PageId = (typeof PAGES)[number]['id'];

export function pageFromHash(hash: string): PageId {
    const id = hash.replace(/^#/, '');
    // The Hash plugin writes #lg=… deep links; never switch pages on one.
    return (PAGES.find((page) => page.id === id)?.id ??
        'combinations') as PageId;
}

export function isPageHash(hash: string): boolean {
    const id = hash.replace(/^#/, '');
    return PAGES.some((page) => page.id === id);
}

/** Transition modes offered by the pages' mode pickers. */
export const MODES = [
    'lg-slide',
    'lg-fade',
    'lg-zoom-in',
    'lg-zoom-out',
    'lg-soft-zoom',
    'lg-scale-up',
    'lg-slide-circular',
    'lg-slide-vertical',
] as const;

export type Mode = (typeof MODES)[number];
