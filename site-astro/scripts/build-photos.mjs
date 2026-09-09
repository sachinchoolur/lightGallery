/**
 * Builds the demo photo set from `src/data/photos.json`.
 *
 * For every photo it fetches the original from the Unsplash CDN once (cached
 * under `node_modules/.cache/photos`, or `PHOTOS_CACHE`), encodes AVIF
 * variants at a few widths into `site/static/img/photos/<collection>/`, and
 * writes `src/data/photo-manifest.json` with the dimensions of each variant.
 * The manifest is what the site imports; this script only needs to run when
 * the photo list changes.
 *
 *   node scripts/build-photos.mjs          # encode missing variants
 *   node scripts/build-photos.mjs --force  # re-encode everything
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const source = JSON.parse(readFileSync(join(root, 'src/data/photos.json'), 'utf8'));
const outDir = resolve(root, '../site/static/img/photos');
const cacheDir = process.env.PHOTOS_CACHE ?? join(root, 'node_modules/.cache/photos');
const force = process.argv.includes('--force');

/** Variant widths; the zoom collections get a larger top size. */
const WIDTHS = [480, 1200, 1600];
const ZOOM_WIDTHS = [480, 1200, 2400];
const ZOOM_COLLECTIONS = new Set(['stone', 'facade', 'macro']);

mkdirSync(cacheDir, { recursive: true });

async function original(collection, index, cdn) {
    const file = join(cacheDir, `${collection}-${String(index).padStart(2, '0')}.jpg`);
    if (!existsSync(file)) {
        const url = `https://images.unsplash.com/${cdn}?w=2400&q=85&fm=jpg&fit=max`;
        const res = await fetch(url, { headers: { 'user-agent': 'lightgallery-site-build' } });
        if (!res.ok) throw new Error(`${url}: ${res.status}`);
        writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    }
    return file;
}

const manifest = { license: source.license, collections: {} };
let encoded = 0;

for (const [collection, { title, photos }] of Object.entries(source.collections)) {
    const widths = ZOOM_COLLECTIONS.has(collection) ? ZOOM_WIDTHS : WIDTHS;
    const dir = join(outDir, collection);
    mkdirSync(dir, { recursive: true });
    const items = [];
    for (const [i, photo] of photos.entries()) {
        const index = i + 1;
        const name = String(index).padStart(2, '0');
        const file = await original(collection, index, photo.cdn);
        const image = sharp(file).rotate();
        const meta = await image.metadata();
        const sizes = [];
        for (const width of widths) {
            const target = join(dir, `${name}-${width}.avif`);
            const w = Math.min(width, meta.width);
            const h = Math.round((meta.height * w) / meta.width);
            if (force || !existsSync(target)) {
                await image
                    .clone()
                    .resize({ width: w, withoutEnlargement: true })
                    .avif({ quality: width <= 480 ? 55 : 50, effort: 5 })
                    .toFile(target);
                encoded++;
            }
            sizes.push({ width: w, height: h, src: `/img/photos/${collection}/${name}-${width}.avif` });
        }
        items.push({
            id: photo.id,
            alt: photo.alt,
            photographer: photo.photographer,
            page: `https://unsplash.com/photos/${photo.id}`,
            sizes,
        });
    }
    manifest.collections[collection] = { title, photos: items };
}

writeFileSync(join(root, 'src/data/photo-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`photo manifest written, ${encoded} variants encoded`);
