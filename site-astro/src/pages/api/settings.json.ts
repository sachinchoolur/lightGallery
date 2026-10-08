import { getEntry } from 'astro:content';
import type { APIRoute } from 'astro';

import { interfaceProps, settingsDefaults, tagText } from '../../lib/apidocs';

/**
 * /api/settings.json, every documented setting, per interface, with type,
 * default and description. The interfaces come from the settings page
 * itself (its `<Options>` blocks), so the JSON and the HTML never disagree.
 */
export const GET: APIRoute = async () => {
    // The page's own blocks decide what is listed, so JSON and HTML agree.
    const page = (await getEntry('docs', 'settings'))?.body ?? '';
    const blocks = [...page.matchAll(/<Options\b([^>]*)\/>/g)].map((m) => {
        const attrs: Record<string, string> = {};
        for (const a of m[1].matchAll(/([\w-]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
        return attrs;
    });
    const strip = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const interfaces = blocks.map((attrs) => {
        const defaults = attrs.variable ? settingsDefaults(attrs.variable) : new Map<string, string>();
        return {
            interface: attrs.interface,
            plugin: attrs.pluginName ?? null,
            settings: interfaceProps(attrs.interface)
                .filter((p) => !p.name.startsWith('__'))
                .map((p) => ({
                    name: p.name,
                    type: p.typeName,
                    values: p.unionValues ?? null,
                    default: defaults.get(p.name) ?? null,
                    description: strip([p.comment.summary, ...tagText(p.comment, 'description')].join(' ')),
                    since: tagText(p.comment, 'version')[0] ?? null,
                    deprecated: tagText(p.comment, 'deprecated')[0] ? strip(tagText(p.comment, 'deprecated')[0]) : null,
                })),
        };
    });
    return new Response(JSON.stringify({ generated: new Date().toISOString(), docs: 'https://www.lightgalleryjs.com/docs/settings/', interfaces }, null, 2), {
        headers: { 'content-type': 'application/json; charset=utf-8' },
    });
};
