import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';

import { docsMarkdown, docsSlug } from '../../../lib/markdown-twin';

/** Markdown twin of every demo page — `/demos/<slug>/index.md`. */
export const getStaticPaths: GetStaticPaths = async () => {
    const entries = await getCollection('demos', ({ data }) => !data.draft);
    return entries.map((entry) => ({ params: { slug: docsSlug(entry) }, props: { entry } }));
};

export const GET: APIRoute = ({ props }) => {
    return new Response(docsMarkdown(props.entry), {
        headers: { 'content-type': 'text/markdown; charset=utf-8' },
    });
};
