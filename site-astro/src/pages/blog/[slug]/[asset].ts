import { promises as fs } from 'node:fs';
import path from 'node:path';

import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

/**
 * Hugo page-bundle resources: every image next to a post's index.md is
 * published at the post's URL (`/blog/<slug>/<image>.png`). The raw-HTML
 * `<img>` tags inside the posts rely on those relative URLs, and URL
 * parity keeps any external links to the images alive.
 */
const MIME: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
};

export async function getStaticPaths() {
    const posts = await getCollection('blog');
    const paths = [];
    for (const post of posts) {
        if (!post.filePath) continue;
        const dir = path.dirname(post.filePath);
        const slug = post.id.replace(/\/index$/, '');
        for (const file of await fs.readdir(dir)) {
            if (!MIME[path.extname(file)]) continue;
            paths.push({
                params: { slug, asset: file },
                props: { file: path.join(dir, file) },
            });
        }
    }
    return paths;
}

export const GET: APIRoute = async ({ props, params }) => {
    const body = await fs.readFile(props.file);
    return new Response(new Uint8Array(body), {
        headers: {
            'Content-Type': MIME[path.extname(params.asset ?? '')],
        },
    });
};
