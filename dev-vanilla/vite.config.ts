import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, type Plugin } from 'vite';

/**
 * Vanilla dev-demo server for manual verification: serves the root
 * `src/` (TS + SCSS) directly with HMR — no build step. The v2/vanilla
 * counterpart of `packages/react/dev`, kept on the same images for
 * side-by-side gesture comparison.
 */

/**
 * `/slow/<ms>/<encoded url>` fetches the upstream image and holds the
 * response for `ms` before answering, never cached. Lets the justified
 * slow-load page stagger its thumbnails deterministically on any
 * network, including a phone on the tunnel.
 */
const slowImages = (): Plugin => ({
    name: 'lg-slow-images',
    configureServer(server) {
        server.middlewares.use(
            '/slow',
            (req: IncomingMessage, res: ServerResponse) => {
                const match = /^\/(\d+)\/(.+)$/.exec(req.url || '');
                if (!match) {
                    res.statusCode = 404;
                    res.end();
                    return;
                }
                const delay = Math.min(Number(match[1]), 30000);
                const url = decodeURIComponent(match[2]!);
                setTimeout(() => {
                    fetch(url)
                        .then(async (upstream) => {
                            res.statusCode = upstream.status;
                            res.setHeader(
                                'Content-Type',
                                upstream.headers.get('content-type') ||
                                    'application/octet-stream',
                            );
                            res.setHeader('Cache-Control', 'no-store');
                            res.end(Buffer.from(await upstream.arrayBuffer()));
                        })
                        .catch(() => {
                            res.statusCode = 502;
                            res.end();
                        });
                }, delay);
            },
        );
    },
});

export default defineConfig({
    root: __dirname,
    plugins: [slowImages()],
    server: {
        // Reachable from phones on the LAN for device passes.
        host: true,
        port: 5177,
        allowedHosts: ['.trycloudflare.com'],
    },
});
