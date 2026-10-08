/**
 * Small-image matrix: every slide is below a desktop stage in at least
 * one axis, across a spread of aspect ratios and absolute sizes. It
 * exercises the paths that only misbehave when the fitted box differs
 * per slide — the origin flight, the per-slide fit, and actual-size
 * zoom, which must stay at scale 1 for anything already shown at its
 * natural size.
 *
 * Knobs (query string): `actual=0` disables actualSize, `origin=0`
 * disables zoomFromOrigin, `infinite=1` enables infiniteZoom.
 */
import lightGallery from '../src/index';
import Thumbnail from '../src/plugins/thumbnail/lg-thumbnail';
import Zoom from '../src/plugins/zoom/lg-zoom';

import '../src/scss/lightgallery-bundle.scss';
import '../src/scss/lg-transitions.scss';

interface Sample {
    id: number;
    w: number;
    h: number;
    note: string;
}

// Deliberately awkward shapes: strips, squares and near-thumbnail sizes
// alongside a couple of ordinary ones for contrast.
const SAMPLES: Sample[] = [
    { id: 1003, w: 120, h: 80, note: 'tiny landscape' },
    { id: 1005, w: 80, h: 120, note: 'tiny portrait' },
    { id: 1011, w: 240, h: 240, note: 'square' },
    { id: 1013, w: 480, h: 120, note: 'wide strip' },
    { id: 1021, w: 120, h: 480, note: 'tall strip' },
    { id: 1024, w: 320, h: 213, note: 'small landscape' },
    { id: 1025, w: 213, h: 320, note: 'small portrait' },
    { id: 1035, w: 640, h: 427, note: 'medium landscape' },
    { id: 1040, w: 427, h: 640, note: 'medium portrait' },
    { id: 1043, w: 900, h: 300, note: 'panorama' },
    { id: 1047, w: 300, h: 900, note: 'column' },
];

const src = ({ id, w, h }: Sample) =>
    `https://picsum.photos/id/${id}/${w}/${h}`;

const params = new URLSearchParams(location.search);
const grid = document.getElementById('small-images') as HTMLElement;
const readout = document.getElementById('readout') as HTMLElement;

grid.innerHTML = SAMPLES.map((sample) => {
    const { w, h, note } = sample;
    return `
    <figure style="margin:0">
        <a
            href="${src(sample)}"
            data-lg-size="${w}-${h}"
            data-sub-html="<h4>${note} <small>(${w}x${h})</small></h4>"
        >
            <img src="${src(
                sample,
            )}" width="${w}" height="${h}" alt="${note}" />
        </a>
        <figcaption>${w}&times;${h}</figcaption>
    </figure>`;
}).join('');

const instance = lightGallery(grid, {
    selector: 'a',
    plugins: [Zoom, Thumbnail],
    actualSize: params.get('actual') !== '0',
    zoomFromOrigin: params.get('origin') !== '0',
    infiniteZoom: params.get('infinite') === '1',
    showZoomInOutIcons: true,
});
(window as unknown as { lg: unknown }).lg = instance;

/**
 * Live readout of what the zoom math is working from. The interesting
 * number is the actual-size scale: it must be 1 for any slide already
 * rendered at or below its natural size.
 */
function sample(): string {
    const core = instance as unknown as {
        index: number;
        currentImageSize?: { width: number; height: number };
        outer: { get(): HTMLElement };
    };
    const img = document.querySelector<HTMLImageElement>(
        '.lg-item.lg-current .lg-image',
    );
    if (!img) {
        return 'open a slide…';
    }
    const rect = img.getBoundingClientRect();
    const fitted = core.currentImageSize;
    const outer = core.outer.get();
    const round = (n: number) => Math.round(n);
    const scale =
        fitted && fitted.width
            ? (img.naturalWidth / fitted.width).toFixed(2)
            : 'n/a';
    return [
        `slide      ${core.index + 1} / ${SAMPLES.length}  (${
            SAMPLES[core.index]?.note ?? ''
        })`,
        `natural    ${img.naturalWidth} x ${img.naturalHeight}`,
        `rendered   ${round(rect.width)} x ${round(rect.height)}`,
        `fitted     ${
            fitted
                ? `${round(fitted.width)} x ${round(fitted.height)}`
                : 'not set'
        }`,
        `actualsize ${scale}  (1.00 = already at natural size, no zoom)`,
        `classes    ${outer.classList.contains('lg-zoomed') ? 'zoomed ' : ''}${
            outer.classList.contains('lg-actual-size') ? 'actual-size' : ''
        }`.trimEnd(),
    ].join('\n');
}

let raf = 0;
const pump = () => {
    readout.textContent = sample();
    raf = requestAnimationFrame(pump);
};
instance.LGel.on('lgAfterOpen.smalldemo', () => {
    cancelAnimationFrame(raf);
    pump();
});
instance.LGel.on('lgAfterClose.smalldemo', () => {
    cancelAnimationFrame(raf);
    readout.textContent = 'open a slide…';
});
