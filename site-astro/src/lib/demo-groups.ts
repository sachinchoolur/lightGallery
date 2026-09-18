/**
 * The demo catalogue's groups: what a visitor is looking for rather than
 * one flat alphabetical list. One source for the /demos/ index, the demo
 * sidebar and the "More in …" row on each demo page. Slugs, not titles,
 * key the groups so retitling a page never moves it (and never silently
 * drops it: anything unlisted falls into "More demos").
 */
import { photos, type Photo } from './photos';

export interface DemoGroup {
    name: string;
    blurb: string;
    slugs: string[];
}

export const DEMO_GROUPS: DemoGroup[] = [
    {
        name: 'Image galleries',
        blurb: 'Thumbnails, zoom, captions and the layouts around them.',
        slugs: [
            'thumbnails',
            'justified-layout',
            'responsive',
            'zoom-from-origin',
            'medium-zoom',
            'captions',
            'mixed-contents',
            'html-markup',
            'iframe',
            'infinite-scrolling',
            'virtualization',
            'rtl',
        ],
    },
    {
        name: 'Video galleries',
        blurb: 'YouTube, Vimeo, Wistia and self-hosted HTML5 video.',
        slugs: ['video-gallery', 'video-facades', 'video-carousel'],
    },
    {
        name: 'Carousels',
        blurb: 'Inline galleries that expand into the lightbox.',
        slugs: ['carousel-gallery'],
    },
    {
        name: 'React, Vue and Angular',
        blurb: 'The native framework packages, each with its own component API.',
        slugs: [
            'react-image-gallery',
            'react-video-gallery',
            'react-carousel',
            'react-video-carousel',
            'vue-image-gallery',
            'vue-video-gallery',
            'angular-image-gallery',
            'angular-video-gallery',
        ],
    },
    {
        name: 'Integrations',
        blurb: 'Adding a lightbox to a slider or grid you already use.',
        slugs: [
            'slick-carousel-demo',
            'owl-carousel-with-lightbox',
            'swiper',
            'flickity-demo',
            'bootstrap-image-gallery',
            'bootstrap-image-carousel',
            'bootstrap-video-gallery',
            'bootstrap-video-carousel',
        ],
    },
    {
        name: 'Behavior and API',
        blurb: 'Events, methods, deep links, sharing, custom icons and dynamic slides.',
        slugs: [
            'events',
            'methods',
            'dynamic-mode',
            'update-slides',
            'hash',
            'share',
            'comment-box',
            'custom-icons',
            'transitions',
            'custom-easing',
        ],
    },
];

/** The group whose name a page belongs under, if it is listed. */
export const demoGroupOf = (slug: string): DemoGroup | undefined =>
    DEMO_GROUPS.find((group) => group.slugs.includes(slug.toLowerCase()));

/** Framework badge for the packages that have their own demo pages. */
export const demoFramework = (slug: string): 'React' | 'Vue' | 'Angular' | null =>
    slug.startsWith('react-')
        ? 'React'
        : slug.startsWith('vue-')
          ? 'Vue'
          : slug.startsWith('angular-')
            ? 'Angular'
            : null;

/**
 * A representative photo per demo, for cards that point at a demo page.
 * Walks the demo photo sets with a stride coprime to their count, so
 * every listed demo gets a different picture and the same one each time.
 */
const pool = photos('street,alley,morocco,facade,desert,stone,hero,warm,macro');
const order = DEMO_GROUPS.flatMap((group) => group.slugs);
export function demoPhoto(slug: string): Photo {
    const i = order.indexOf(slug.toLowerCase());
    const n = i >= 0 ? i : order.length + [...slug].reduce((h, c) => h + c.charCodeAt(0), 0);
    return pool[(n * 5) % pool.length];
}
