/**
 * Demo photo sets for the site: the curated Unsplash collections encoded by
 * `scripts/build-photos.mjs`. Everything a gallery item needs (largest src,
 * thumbnail, srcset, lightGallery's `data-responsive` and `data-lg-size`
 * strings, a caption with credit) is derived here so every demo shortcode,
 * MDX page and the demo runtime read one shape.
 */
import manifest from '../data/photo-manifest.json';

export type CollectionName = keyof typeof manifest.collections;

export interface PhotoSize {
    width: number;
    height: number;
    src: string;
}

export interface Photo {
    /** Unsplash photo id, also used as a stable slug for hash and comment demos. */
    id: string;
    collection: string;
    /** Sentence-cased description, used as the caption title. */
    title: string;
    alt: string;
    photographer: string;
    /** The photo's page on Unsplash, the attribution target. */
    page: string;
    /** Every encoded variant, smallest first. */
    sizes: PhotoSize[];
    /** Largest variant. */
    src: string;
    width: number;
    height: number;
    /** Smallest variant, for grids and strips. */
    thumb: string;
    /** `<img srcset>` covering every variant. */
    srcset: string;
    /** lightGallery `data-responsive`: smaller variants keyed by viewport width. */
    responsive: string;
    /** lightGallery `data-lg-size` matching `responsive`, largest last. */
    size: string;
    /** Caption markup with the Unsplash credit. */
    caption: string;
    /** Plain credit line. */
    credit: string;
}

const sentence = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

function escapeAttr(text: string) {
    return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function build(collection: string, raw: (typeof manifest.collections)[CollectionName]['photos'][number]): Photo {
    const sizes = [...raw.sizes].sort((a, b) => a.width - b.width);
    const largest = sizes[sizes.length - 1];
    const smaller = sizes.slice(0, -1);
    const title = sentence(raw.alt);
    return {
        id: raw.id,
        collection,
        title,
        alt: raw.alt,
        photographer: raw.photographer,
        page: raw.page,
        sizes,
        src: largest.src,
        width: largest.width,
        height: largest.height,
        thumb: sizes[0].src,
        srcset: sizes.map((s) => `${s.src} ${s.width}w`).join(', '),
        responsive: smaller.map((s) => `${s.src} ${s.width}`).join(', '),
        size: [
            ...smaller.map((s) => `${s.width}-${s.height}-${s.width}`),
            `${largest.width}-${largest.height}`,
        ].join(', '),
        caption:
            `<h4>${escapeAttr(title)}</h4>` +
            `<p>Photo by <a href="${raw.page}">${escapeAttr(raw.photographer)}</a> on <a href="https://unsplash.com">Unsplash</a></p>`,
        credit: `Photo by ${raw.photographer} on Unsplash`,
    };
}

const cache = new Map<string, Photo[]>();

/** Photos of one collection, in curated order. */
export function collection(name: CollectionName | string): Photo[] {
    let list = cache.get(name);
    if (!list) {
        const entry = manifest.collections[name as CollectionName];
        if (!entry) throw new Error(`Unknown photo collection "${name}"`);
        list = entry.photos.map((p) => build(name, p));
        cache.set(name, list);
    }
    return list;
}

/**
 * Photos from one or more collections. `names` is a collection name, a
 * comma-separated list of them, or an array; the sets are concatenated in
 * the order given. `limit` truncates the result.
 */
export function photos(names: string | string[], limit?: number): Photo[] {
    const list = (Array.isArray(names) ? names : names.split(','))
        .map((n) => n.trim())
        .filter(Boolean)
        .flatMap((n) => collection(n));
    return typeof limit === 'number' ? list.slice(0, limit) : list;
}

/** Interleaves two collections so portrait and landscape frames alternate. */
export function interleave(a: string, b: string, limit?: number): Photo[] {
    const left = collection(a);
    const right = collection(b);
    const out: Photo[] = [];
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
        if (left[i]) out.push(left[i]);
        if (right[i]) out.push(right[i]);
    }
    return typeof limit === 'number' ? out.slice(0, limit) : out;
}

/** Every photo with its collection title, for the credits page. */
export function allPhotos(): { collection: string; title: string; photos: Photo[] }[] {
    return Object.entries(manifest.collections).map(([name, entry]) => ({
        collection: name,
        title: entry.title,
        photos: collection(name),
    }));
}

/** A URL-safe slug from a photo's description, for hash-plugin demos. */
export function slug(photo: Photo): string {
    return photo.alt
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40)
        .replace(/-$/, '');
}
