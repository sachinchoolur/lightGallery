import type { APIRoute } from 'astro';

import { feedResponse, renderBlogFeed } from '../../lib/rss';

/** Blog section feed; same posts as /index.xml under the Hugo section URL. */
export const GET: APIRoute = async () =>
    feedResponse(await renderBlogFeed('/blog/index.xml'));
