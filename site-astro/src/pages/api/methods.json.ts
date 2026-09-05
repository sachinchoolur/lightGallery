import type { APIRoute } from 'astro';

import { publicMethods, tagText } from '../../lib/apidocs';

/** /api/methods.json — the gallery instance's public methods. */
export const GET: APIRoute = () => {
    const strip = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const methods = publicMethods().map((m) => ({
        name: m.name,
        description: strip([m.comment.summary, ...tagText(m.comment, 'description')].join(' ')),
        examples: tagText(m.comment, 'example').map((e) => e.trim()),
    }));
    return new Response(JSON.stringify({ generated: new Date().toISOString(), docs: 'https://www.lightgalleryjs.com/docs/methods/', methods }, null, 2), {
        headers: { 'content-type': 'application/json; charset=utf-8' },
    });
};
