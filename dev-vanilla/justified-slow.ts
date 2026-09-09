/**
 * Justified slow-load page: server-rendered markup (see the html), heavy
 * Unsplash thumbnails and a deliberately delayed init, so the pre-init
 * window and the per-thumbnail reveal can be watched on a device.
 * Knobs (query string): `delay` ms before init (default 1500), `slow`
 * ms between thumbnail arrivals via the dev server's /slow proxy
 * (default 400, 0 for the real network), `noclass=1` strips the markup
 * class, `small=1` swaps in 400px thumbs, `reveal=image` reveals per
 * thumbnail.
 */
import lightGallery from '../src/index';
import Justified from '../src/plugins/justified/lg-justified';
import Thumbnail from '../src/plugins/thumbnail/lg-thumbnail';
import Zoom from '../src/plugins/zoom/lg-zoom';

import '../src/scss/lightgallery-bundle.scss';
import '../src/scss/lg-transitions.scss';
import '../src/scss/lg-justified.scss';

const params = new URLSearchParams(location.search);
const delay = Number(params.get('delay') ?? 1500);
const grid = document.getElementById('justified-slow') as HTMLElement;
const timeline = document.getElementById('timeline') as HTMLElement;

const stamp = (): string => `${Math.round(performance.now())}ms`;
const log = (message: string): void => {
    timeline.textContent += `${stamp()}  ${message}\n`;
};

log(`script ready (${delay}ms delay before init)`);
grid.querySelectorAll('img').forEach((img, index) => {
    const done = (): void => log(`thumb ${index} loaded`);
    if (img.complete) {
        done();
    } else {
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
    }
});
new MutationObserver((records) => {
    records.forEach((record) => {
        const item = record.target as HTMLElement;
        if (
            item.classList.contains('lg-justified-item-visible') &&
            !item.dataset.revealed
        ) {
            item.dataset.revealed = '1';
            const index = Array.from(grid.children).indexOf(item);
            log(`item ${index} revealed`);
        }
    });
}).observe(grid, {
    attributes: true,
    subtree: true,
    attributeFilter: ['class'],
});

setTimeout(() => {
    log('lightGallery init');
    lightGallery(grid, {
        plugins: [Justified, Thumbnail, Zoom],
        selector: 'a',
        justifiedRowHeight: 180,
        justifiedGap: 8,
        justifiedLastRow: 'justify',
        justifiedReveal: params.get('reveal') === 'image' ? 'image' : 'row',
    });
}, delay);
