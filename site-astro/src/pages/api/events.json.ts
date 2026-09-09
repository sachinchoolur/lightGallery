import { getEntry } from 'astro:content';
import type { APIRoute } from 'astro';

import { commentOf, findReflection, interfaceProps, tagText } from '../../lib/apidocs';

/** /api/events.json, custom events with their detail fields, from the events page's blocks. */
export const GET: APIRoute = async () => {
    // The page's own blocks decide what is listed, so JSON and HTML agree.
    const page = (await getEntry('docs', 'events'))?.body ?? '';
    const strip = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const events = [...page.matchAll(/<Events\s+interface="([^"]+)"/g)].map((m) => {
        const iface = m[1];
        const meta = commentOf(findReflection(iface));
        return {
            names: tagText(meta, 'name'),
            interface: iface,
            description: strip(meta.summary),
            detail: interfaceProps(iface).map((p) => ({ name: p.name, type: p.typeName, description: strip(p.comment.summary) })),
            examples: tagText(meta, 'example').map((e) => e.trim()),
        };
    });
    return new Response(JSON.stringify({ generated: new Date().toISOString(), docs: 'https://www.lightgalleryjs.com/docs/events/', events }, null, 2), {
        headers: { 'content-type': 'application/json; charset=utf-8' },
    });
};
