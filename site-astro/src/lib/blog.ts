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
