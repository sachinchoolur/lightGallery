import { readFileSync } from 'node:fs';
import path from 'node:path';

import type { APIRoute } from 'astro';

// Hugo page-bundle resource (the page's og:image URL). Read relative to
// the project root, bundled modules have no stable import.meta.url.
export const GET: APIRoute = () =>
    new Response(
        new Uint8Array(
            readFileSync(
                path.join(process.cwd(), 'src/tools/libstracker-banner.png'),
            ),
        ),
        { headers: { 'Content-Type': 'image/png' } },
    );
