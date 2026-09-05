import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

/** Markdown twin of /changelog/ — the CHANGELOG.md file itself. */
export const GET: APIRoute = async () => {
    const [entry] = await getCollection('changelog');
    return new Response(entry?.body ?? '# Changelog\n', {
        headers: { 'content-type': 'text/markdown; charset=utf-8' },
    });
};
