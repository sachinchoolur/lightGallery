// Serves index.html, the photos, and the installed lightgallery package
// under /npm/lightgallery@<version>/ the way a CDN like jsDelivr does: the
// package's real files at their real paths, with no `exports` mapping.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const packageDir = path.join(root, 'node_modules', 'lightgallery');
const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.map': 'application/json',
};

function resolve(url) {
    const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
    if (pathname === '/') return path.join(root, 'index.html');
    const cdn = /^\/npm\/lightgallery@[^/]+\/(.+)$/.exec(pathname);
    const [base, rest] = cdn ? [packageDir, cdn[1]] : [path.join(root, 'public'), pathname.slice(1)];
    const file = path.resolve(base, rest);
    return file.startsWith(base + path.sep) ? file : null;
}

http.createServer((request, response) => {
    const file = resolve(request.url);
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
        response.writeHead(404).end('Not found');
        return;
    }
    response.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(response);
}).listen(Number(process.env.PORT) || 4000);
