import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

import { SITE, docsGroup, docsMarkdownUrl, docsUrl } from '../lib/markdown-twin';

/**
 * /llms.txt — the machine-readable index of the site (llmstxt.org).
 * Generated from the content collections, so it never drifts from the
 * sidebar.
 */
export const GET: APIRoute = async () => {
    const docs = (await getCollection('docs', ({ data }) => !data.draft)).sort(
        (a, b) => (a.data.weight ?? 999) - (b.data.weight ?? 999),
    );
    const demos = (await getCollection('demos', ({ data }) => !data.draft)).sort(
        (a, b) => (a.data.weight ?? 999) - (b.data.weight ?? 999),
    );
    const one = (text: string) => text.replace(/\s+/g, ' ').trim();

    const groups = new Map<string, string[]>();
    for (const entry of docs) {
        const group = docsGroup(entry);
        const line = `- [${entry.data.title}](${docsMarkdownUrl(entry)}): ${one(entry.data.description)}`;
        groups.set(group, [...(groups.get(group) ?? []), line]);
    }
    const order = ['Guides and reference', 'Framework packages', 'Features', 'Archive (version 2 wrappers)'];

    const out = [
        '# lightGallery',
        '',
        '> A lightweight, modular JavaScript lightbox and gallery for images and video, with native React, Vue and Angular packages. Plugins (thumbnails, zoom, video, autoplay, fullscreen, share, hash, rotate, pager, comments, justified layout) are separate entries — import only what you use.',
        '',
        'Packages: `lightgallery` (vanilla JavaScript/TypeScript), `@lightgallery/react`, `@lightgallery/vue`, `@lightgallery/angular`, `@lightgallery/headless` (the framework-free core).',
        '',
        `Every docs page below links to its markdown version; the HTML page is the same URL without \`index.md\`. The complete docs in one file: ${SITE}/llms-full.txt`,
        '',
    ];
    for (const group of order) {
        const lines = groups.get(group);
        if (!lines?.length) continue;
        out.push(`## ${group}`, '', ...lines, '');
    }
    out.push('## Demos', '', '_Live pages; each has the example code for all four stacks._', '');
    for (const entry of demos) {
        out.push(`- [${entry.data.title}](${SITE}/demos/${entry.id.replace(/\/index$/, '').toLowerCase()}/): ${one(entry.data.description)}`);
    }
    out.push('', '## Optional', '', `- [Changelog](${SITE}/changelog/index.md): what changed in each release`, `- [Blog](${SITE}/blog/)`, `- [License](${SITE}/license/): GPLv3, with a commercial license available`, `- [GitHub](https://github.com/sachinchoolur/lightGallery)`, '');
    // Keep docsUrl referenced for consumers that want HTML links.
    void docsUrl;
    return new Response(out.join('\n'), {
        headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
};
