import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';

import sachinNeravath from '../assets/contributors/sachin-neravath.jpeg';
import ujjwalMaheendran from '../assets/contributors/ujjwal-maheendran.jpg';

/** Blog helpers shared by the list, single and related-posts views. */

/** Contributor avatars; rendered through `<Image>` at 36px. */
export const CONTRIBUTOR_IMAGES: Record<string, ImageMetadata> = {
    'Ujjwal Maheendran': ujjwalMaheendran,
    'Sachin Neravath': sachinNeravath,
};

/** "Oct 12, 2026": the post and card date format. */
export const SHORT_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
});

/** The post's category label: its first tag, capitalised. */
export function categoryOf(entry: CollectionEntry<'blog'>): string {
    const tag = entry.data.tags[0] ?? 'Blog';
    return tag.charAt(0).toUpperCase() + tag.slice(1);
}

/**
 * A revision date worth showing: a lastmod at least a day after the
 * post date (same-day edits are noise).
 */
export function updatedOn(entry: CollectionEntry<'blog'>): Date | undefined {
    const DAY = 24 * 60 * 60 * 1000;
    const { date, lastmod } = entry.data;
    return lastmod && date && lastmod.valueOf() - date.valueOf() >= DAY ? lastmod : undefined;
}

/** The one date a post shows: its revision date when it has one, else when it was published. */
export function displayDate(entry: CollectionEntry<'blog'>): Date | undefined {
    return updatedOn(entry) ?? entry.data.date;
}

/** Up to `limit` other posts, the ones sharing a tag first, newest first. */
export function relatedPosts(
    entry: CollectionEntry<'blog'>,
    all: CollectionEntry<'blog'>[],
    limit = 3,
): CollectionEntry<'blog'>[] {
    const others = all
        .filter((post) => post.id !== entry.id)
        .sort((a, b) => (displayDate(b)?.valueOf() ?? 0) - (displayDate(a)?.valueOf() ?? 0));
    const shared = others.filter((post) =>
        post.data.tags.some((tag) => entry.data.tags.includes(tag)),
    );
    const rest = others.filter((post) => !shared.includes(post));
    return [...shared, ...rest].slice(0, limit);
}

export function blogSlug(entry: CollectionEntry<'blog'>): string {
    // The glob loader already honors the frontmatter `slug` override.
    return entry.id.replace(/\/index$/, '');
}

export function blogUrl(entry: CollectionEntry<'blog'>): string {
    return `/blog/${blogSlug(entry)}/`;
}

/** Hugo `.ReadingTime` equivalent (words / 213, rounded up, min 1). */
export function readingTime(body: string): number {
    const words = body.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 213));
}

/** Hugo `truncate` equivalent on the raw body, tags stripped. */
export function teaser(body: string, length: number): string {
    const text = body
        .replace(/```[\s\S]*?```/g, ' ')
        // MDX posts: import and export lines are not prose.
        .replace(/^(import|export)\s.*$/gm, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/[#*_>\[\]()`]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return text.length > length ? `${text.slice(0, length - 1)}…` : text;
}

/**
 * Bundle image (Hugo page-bundle resource) as Astro image metadata. Images
 * live next to the content file; callers render them through `<Image>` so
 * they ship sized, lazy and in WebP.
 */
const bundleImages = import.meta.glob<{ default: ImageMetadata }>(
    '../content/blog/*/*.{png,jpg,jpeg,webp}',
    { eager: true },
);

export function bundleImage(
    entry: CollectionEntry<'blog'>,
    name: string,
): ImageMetadata | undefined {
    // entry.id follows the frontmatter `slug` override, so the bundle
    // directory must come from the entry's file path instead.
    const dir = entry.filePath?.split('/').at(-2);
    return bundleImages[`../content/blog/${dir}/${name}`]?.default;
}

export const POST_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});
