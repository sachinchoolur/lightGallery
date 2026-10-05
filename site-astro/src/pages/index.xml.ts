import type { APIRoute } from 'astro';

import { feedResponse, renderBlogFeed } from '../lib/rss';

/** Site feed, the URL the Hugo site advertised in every page head. */
export const GET: APIRoute = async () =>
    feedResponse(await renderBlogFeed('/index.xml'));
