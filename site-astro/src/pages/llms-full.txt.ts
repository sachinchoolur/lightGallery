import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

import { docsGroup, docsMarkdown } from '../lib/markdown-twin';

/** /llms-full.txt, every docs page as markdown, in sidebar order. */
export const GET: APIRoute = async () => {
    const docs = (await getCollection('docs', ({ data }) => !data.draft)).sort(
        (a, b) => (a.data.weight ?? 999) - (b.data.weight ?? 999),
    );
    const order = ['Guides and reference', 'Framework packages', 'Features', 'Archive (version 2 wrappers)'];
    const sorted = [...docs].sort((a, b) => order.indexOf(docsGroup(a)) - order.indexOf(docsGroup(b)));
    const demos = (await getCollection('demos', ({ data }) => !data.draft)).sort(
        (a, b) => (a.data.weight ?? 999) - (b.data.weight ?? 999),
    );
    const body = [...sorted, ...demos].map((entry) => docsMarkdown(entry)).join('\n\n---\n\n');
    return new Response(`<!-- lightGallery documentation, generated from the same sources as the HTML pages. -->\n\n${body}`, {
        headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
};
