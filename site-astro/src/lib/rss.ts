import { getCollection } from 'astro:content';

import { blogSlug } from './blog';
import { SITE } from './site';

/**
 * RSS 2.0 feed of the blog, served at /index.xml and /blog/index.xml, the
 * two feed URLs the Hugo site published and linked from every page head.
 * Hand-rolled (like /llms.txt) so the site keeps its dependency list as is.
 */
export async function renderBlogFeed(selfPath: string): Promise<string> {
    const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
        (a, b) => (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0),
    );
    const base = SITE.baseUrl.replace(/\/$/, '');
    const lastBuild = posts
        .map((post) => post.data.lastmod ?? post.data.date)
        .filter((d): d is Date => d instanceof Date)
        .sort((a, b) => b.valueOf() - a.valueOf())[0];

    const items = posts.map((post) => {
        const url = `${base}/blog/${blogSlug(post)}/`;
        const pubDate = post.data.date
            ? `<pubDate>${post.data.date.toUTCString()}</pubDate>`
            : '';
        const categories = post.data.tags
            .map((tag) => `<category>${escapeXml(tag)}</category>`)
            .join('');
        return (
            `<item>` +
            `<title>${escapeXml(post.data.title)}</title>` +
            `<link>${url}</link>` +
            `<guid>${url}</guid>` +
            pubDate +
            categories +
            `<description>${escapeXml(post.data.description)}</description>` +
            `</item>`
        );
    });

    return (
        `<?xml version="1.0" encoding="utf-8" standalone="yes"?>` +
        `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">` +
        `<channel>` +
        `<title>${escapeXml(SITE.title)}</title>` +
        `<link>${SITE.baseUrl}</link>` +
        `<description>${escapeXml(SITE.description)}</description>` +
        `<language>en-US</language>` +
        (lastBuild
            ? `<lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>`
            : '') +
        `<atom:link href="${base}${selfPath}" rel="self" type="application/rss+xml"/>` +
        items.join('') +
        `</channel>` +
        `</rss>`
    );
}

const escapeXml = (text: string): string =>
    text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

export const feedResponse = (xml: string): Response =>
    new Response(xml, {
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    });
