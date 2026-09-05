// Sitemap <lastmod> from git: the last commit that touched each content
// file, mapped to the URL the site serves it at. Runs at config load
// (build time). Anything without a known source file gets no lastmod
// rather than a wrong one.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ROOT = fileURLToPath(new URL('../..', import.meta.url));
const CONTENT = join(SITE_ROOT, 'src/content');

function walk(dir) {
    return readdirSync(dir, { withFileTypes: true, recursive: true })
        .filter((e) => e.isFile() && /\.(md|mdx)$/.test(e.name))
        .map((e) => join(e.parentPath, e.name));
}

function gitDate(file) {
    try {
        const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
            cwd: SITE_ROOT,
            encoding: 'utf8',
        }).trim();
        return iso || undefined;
    } catch {
        return undefined;
    }
}

function frontmatterSlug(file) {
    const head = readFileSync(file, 'utf8').slice(0, 2000);
    const m = head.match(/^slug:\s*["']?([^"'\n]+)["']?\s*$/m);
    return m?.[1];
}

/** URL pathname (with trailing slash) for a content file, or undefined. */
function pathnameFor(file) {
    const rel = relative(CONTENT, file).replace(/\\/g, '/');
    const [collection, ...rest] = rel.split('/');
    let id = rest.join('/').replace(/\.(md|mdx)$/, '').replace(/\/index$/, '');
    switch (collection) {
        case 'docs':
        case 'demos':
            return `/${collection}/${id.toLowerCase()}/`;
        case 'blog':
            return `/blog/${frontmatterSlug(file) ?? id}/`;
        case 'pages':
            if (id === 'home') return '/';
            if (id === 'home-v3') return '/home-v3/';
            if (id === 'blog-index') return '/blog/';
            return `/${id}/`;
        default:
            return undefined;
    }
}

let cache;
/** Map of pathname → ISO date. Built once per process. */
export function lastmodMap() {
    if (cache) return cache;
    cache = new Map();
    for (const file of walk(CONTENT)) {
        const pathname = pathnameFor(file);
        const date = gitDate(file);
        if (pathname && date) cache.set(pathname, date);
    }
    return cache;
}

/** `@astrojs/sitemap` serialize hook: attach lastmod when known. */
export function withLastmod(item) {
    const pathname = new URL(item.url).pathname;
    const date = lastmodMap().get(pathname);
    if (date) item.lastmod = date;
    return item;
}
