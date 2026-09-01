import lightGallery from '../src/index';
import { LightGallery } from '../src/lightgallery';
import Thumbnail from '../src/plugins/thumbnail/lg-thumbnail';
import Video from '../src/plugins/video/lg-video';
import Zoom from '../src/plugins/zoom/lg-zoom';
import Rotate from '../src/plugins/rotate/lg-rotate';
import Share from '../src/plugins/share/lg-share';
import Justified from '../src/plugins/justified/lg-justified';
import Autoplay from '../src/plugins/autoplay/lg-autoplay';
import Fullscreen from '../src/plugins/fullscreen/lg-fullscreen';
import Pager from '../src/plugins/pager/lg-pager';

// Styles compile from the scss sources so plugin CSS edits hot-reload
// too. The bundle covers fonts/theme/plugins/core; transitions ship
// separately (same split the react demo consumes from dist/css).
import '../src/scss/lightgallery-bundle.scss';
import '../src/scss/lg-transitions.scss';
// Opt-in RTL layer (plan 011) — the RTL scenario below exercises it.
import '../src/scss/lg-rtl.scss';
import '../src/scss/lg-justified.scss';

// Same images as packages/react/dev/main.tsx — every rig runs the same
// scenario matrix on the same slides so the four packages can be
// compared side by side on real devices.
const picsum = (id: number, w: number, h: number) =>
    `https://picsum.photos/id/${id}/${w}/${h}`;

// Rig-only responsive ladder: real w-descriptor srcset so device passes
// exercise the plan-002 selection math end to end.
const picsumSrcset = (id: number) =>
    [640, 960, 1280, 1600]
        .map((w) => `${picsum(id, w, Math.round((w * 1067) / 1600))} ${w}w`)
        .join(', ');

const SOURCES = [
    { id: 1015, title: 'River between mountains' },
    { id: 1016, title: 'Canyon walls' },
    { id: 1018, title: 'Snowy peak' },
    { id: 1019, title: 'Lakeside cliffs' },
    { id: 1039, title: 'Waterfall in the forest' },
    { id: 1043, title: 'Village at dusk' },
    { id: 1044, title: 'Foggy shore' },
    { id: 1051, title: 'Ridge line' },
];

const imageAnchor = ({ id, title }: { id: number; title: string }) => `
    <a
        href="${picsum(id, 1600, 1067)}"
        data-srcset="${picsumSrcset(id)}"
        data-sizes="100vw"
        data-lg-size="1600-1067"
        data-sub-html="<h4>${title} <small>(#${id})</small></h4>"
    >
        <img src="${picsum(id, 240, 160)}" alt="${title}" />
    </a>`;

// Video matrix for device passes: YouTube (endpoint poster), Vimeo +
// Wistia (posterless — the thumb-fallback facade) and a self-hosted
// HTML5 file, all materializing their player only on play.
const videoAnchors = [
    {
        href: '//www.youtube.com/watch?v=EIUJfXk3_3w',
        thumb: '//img.youtube.com/vi/EIUJfXk3_3w/1.jpg',
        title: 'YouTube — facade from the thumbnail endpoint',
    },
    {
        href: 'https://vimeo.com/112836958',
        thumb: picsum(1015, 240, 160),
        title: 'Vimeo — facade from the item thumb',
    },
    {
        href: 'https://sachinchoolur.wistia.com/medias/6tbe0u5g8n',
        thumb: picsum(1016, 240, 160),
        title: 'Wistia — facade from the item thumb',
    },
]
    .map(
        ({ href, thumb, title }) => `
    <a href="${href}" data-lg-size="1280-720" data-sub-html="<h4>${title}</h4>">
        <img src="${thumb}" alt="${title}" />
    </a>`,
    )
    .join('');

const html5VideoAnchor = `
    <a
        data-lg-size="1280-720"
        data-video='{"source": [{"src":"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", "type":"video/mp4"}], "attributes": {"preload": false, "controls": true}}'
        data-poster="${picsum(1043, 1280, 720)}"
        data-sub-html="<h4>HTML5 — self-hosted mp4</h4>"
    >
        <img src="${picsum(1043, 240, 160)}" alt="HTML5 video" />
    </a>`;

const dynamicItems = (count = 8) =>
    SOURCES.slice(0, count).map(({ id, title }, i) => ({
        src: picsum(id, 1600, 1067),
        thumb: picsum(id, 240, 160),
        subHtml: `<h4>Slide ${i + 1} — ${title}</h4>`,
    }));

const stressItems = Array.from({ length: 1000 }, (_, i) => ({
    src: `https://picsum.photos/seed/lg-${i}/1600/1067`,
    thumb: `https://picsum.photos/seed/lg-${i}/240/160`,
    subHtml: `<h4>Stress slide ${i + 1} / 1000</h4>`,
}));

/**
 * The device-test matrix. Every rig (vanilla/react/vue/angular) exposes
 * the same scenario ids behind the same hash routes, so a phone can be
 * deep-linked to e.g. #share on all four ports and the packages compared
 * on identical content. One scenario mounts at a time to keep the page
 * light on low-end devices.
 */
interface Scenario {
    id: string;
    title: string;
    note?: string;
    mount(host: HTMLElement): () => void;
}

/** Grid-trigger scenario: inline anchors + a lightGallery over them. */
const gridScenario = (
    html: string,
    settings: Parameters<typeof lightGallery>[1],
) => {
    return (host: HTMLElement): (() => void) => {
        const grid = document.createElement('div');
        grid.className = 'demo-grid';
        grid.innerHTML = html;
        host.appendChild(grid);
        const instance = lightGallery(grid, { selector: 'a', ...settings });
        (window as unknown as { lg: unknown }).lg = instance;
        return () => instance.destroy();
    };
};

/** Button-opened dynamic scenario. */
const buttonScenario = (
    label: string,
    make: () => LightGallery,
    openIndex = 0,
) => {
    return (host: HTMLElement): (() => void) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        host.appendChild(button);
        const instance = make();
        (window as unknown as { lg: unknown }).lg = instance;
        button.addEventListener('click', () => instance.openGallery(openIndex));
        return () => instance.destroy();
    };
};

const dynamicHost = () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    return el;
};

const SCENARIOS: Scenario[] = [
    {
        id: 'images',
        title: 'Images',
        note: 'Plain grid — thumbnails + zoom defaults, srcset ladder.',
        mount: gridScenario(SOURCES.map(imageAnchor).join(''), {
            plugins: [Thumbnail, Zoom],
        }),
    },
    {
        id: 'thumbnails',
        title: 'Thumbnails',
        note: 'Static strip + toggle button (animateThumb off, allowMediaOverlap).',
        mount: gridScenario(SOURCES.map(imageAnchor).join(''), {
            plugins: [Thumbnail],
            animateThumb: false,
            allowMediaOverlap: true,
            toggleThumb: true,
        }),
    },
    {
        id: 'scrub',
        title: 'Thumb scrub',
        note: 'scrubThumbnails — drag the strip and the main slide follows instantly; needs the strip to overflow (phone/narrow window).',
        mount: gridScenario(SOURCES.map(imageAnchor).join(''), {
            plugins: [Thumbnail],
            scrubThumbnails: true,
        }),
    },
    {
        id: 'zoom',
        title: 'Zoom',
        note: 'actualSize + infiniteZoom + icons — pinch, double-tap, drag.',
        mount: gridScenario(SOURCES.map(imageAnchor).join(''), {
            plugins: [Zoom, Thumbnail],
            showZoomInOutIcons: true,
            actualSize: true,
            infiniteZoom: true,
        }),
    },
    {
        id: 'video',
        title: 'Video',
        note: 'YouTube / Vimeo / Wistia facades + HTML5 mp4; autoplayFirstVideo off.',
        mount: gridScenario(videoAnchors + html5VideoAnchor, {
            plugins: [Video, Thumbnail],
            autoplayFirstVideo: false,
        }),
    },
    {
        id: 'share',
        title: 'Share',
        note: 'preferNativeShare — expect the system share sheet on devices.',
        mount: gridScenario(SOURCES.slice(0, 5).map(imageAnchor).join(''), {
            plugins: [Share, Thumbnail],
            preferNativeShare: true,
        }),
    },
    {
        id: 'dynamic',
        title: 'Dynamic',
        note: 'Dynamic mode — button open, add/remove slides via refresh().',
        mount: (host) => {
            const controls = document.createElement('div');
            controls.className = 'demo-controls';
            controls.innerHTML = `
                <button type="button" data-open>open gallery</button>
                <button type="button" data-add>add slide</button>
                <button type="button" data-remove>remove slide</button>
                <span data-count></span>`;
            host.appendChild(controls);
            let slides = dynamicItems(4);
            const target = dynamicHost();
            const instance = lightGallery(target, {
                dynamic: true,
                dynamicEl: slides,
                plugins: [Thumbnail, Zoom],
            });
            (window as unknown as { lg: unknown }).lg = instance;
            const count = controls.querySelector('[data-count]')!;
            const sync = () => {
                count.textContent = `${slides.length} slides`;
            };
            sync();
            controls
                .querySelector('[data-open]')!
                .addEventListener('click', () => instance.openGallery(0));
            controls
                .querySelector('[data-add]')!
                .addEventListener('click', () => {
                    slides = dynamicItems(
                        Math.min(slides.length + 1, SOURCES.length),
                    );
                    instance.refresh(slides);
                    sync();
                });
            controls
                .querySelector('[data-remove]')!
                .addEventListener('click', () => {
                    slides = dynamicItems(Math.max(slides.length - 1, 1));
                    instance.refresh(slides);
                    sync();
                });
            return () => {
                instance.destroy();
                target.remove();
            };
        },
    },
    {
        id: 'virtualization',
        title: 'Virtualization',
        note: '1,000 dynamic slides; slide pool 7, windowed strip of iOS-size scrub thumbs.',
        mount: (host) => {
            const open0 = document.createElement('button');
            open0.type = 'button';
            open0.textContent = 'open 1,000-item gallery';
            const open500 = document.createElement('button');
            open500.type = 'button';
            open500.textContent = 'open at #500';
            open500.style.marginLeft = '12px';
            host.append(open0, open500);
            const target = dynamicHost();
            const instance = lightGallery(target, {
                dynamic: true,
                dynamicEl: stressItems,
                plugins: [Thumbnail],
                virtualization: { slides: 7, thumbs: 'auto' },
                // iOS-filmstrip-sized thumbs + scrub over 1,000 slides.
                scrubThumbnails: true,
                thumbWidth: 28,
                thumbHeight: '42px',
                thumbMargin: 2,
            });
            (window as unknown as { lg: unknown }).lg = instance;
            open0.addEventListener('click', () => instance.openGallery(0));
            open500.addEventListener('click', () => instance.openGallery(500));
            return () => {
                instance.destroy();
                target.remove();
            };
        },
    },
    {
        id: 'justified',
        title: 'Justified',
        note: 'Justified trigger rows — resize/rotate the device to re-flow.',
        mount: gridScenario(SOURCES.map(imageAnchor).join(''), {
            plugins: [Justified, Thumbnail, Zoom],
            justifiedRowHeight: 140,
            justifiedGap: 8,
        }),
    },
    {
        id: 'rtl',
        title: 'RTL',
        note: 'direction: rtl — arrows/keys/swipe mirror, chrome flips.',
        mount: buttonScenario('open RTL gallery (direction: rtl)', () =>
            lightGallery(dynamicHost(), {
                dynamic: true,
                dynamicEl: SOURCES.slice(0, 5).map(({ id, title }, i) => ({
                    src: picsum(id, 1600, 1067),
                    thumb: picsum(id, 240, 160),
                    subHtml: `<h4>شريحة ${i + 1} — ${title}</h4>`,
                })),
                direction: 'rtl',
                plugins: [Thumbnail, Zoom],
            }),
        ),
    },
    {
        id: 'kitchen-sink',
        title: 'Kitchen sink',
        note: 'Images + videos, most plugins at once.',
        mount: gridScenario(
            SOURCES.map(imageAnchor).join('') + videoAnchors,
            {
                plugins: [
                    Thumbnail,
                    Zoom,
                    Video,
                    Rotate,
                    Share,
                    Autoplay,
                    Fullscreen,
                    Pager,
                ],
                showZoomInOutIcons: true,
                actualSize: true,
            },
        ),
    },
];

// ── Hash-routed scenario shell (shared shape across the four rigs) ──────

const root = document.getElementById('gallery')!;
root.innerHTML = `
    <nav class="scenario-nav"></nav>
    <p class="scenario-note"></p>
    <div class="scenario-host"></div>`;
const nav = root.querySelector<HTMLElement>('.scenario-nav')!;
const note = root.querySelector<HTMLElement>('.scenario-note')!;
const hostEl = root.querySelector<HTMLElement>('.scenario-host')!;

nav.innerHTML = SCENARIOS.map(
    (scenario) => `<a href="#${scenario.id}">${scenario.title}</a>`,
).join('');

const style = document.createElement('style');
style.textContent = `
    .scenario-nav { display: flex; flex-wrap: wrap; gap: 4px 12px; margin: 12px 0; }
    .scenario-nav a { text-decoration: none; }
    .scenario-nav a.active { font-weight: 700; text-decoration: underline; }
    .scenario-note { color: #667; margin: 0 0 12px; }
    .demo-controls { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }`;
document.head.appendChild(style);

let teardown: (() => void) | undefined;
let currentId: string | undefined;

function render() {
    const id = window.location.hash.replace(/^#/, '') || SCENARIOS[0].id;
    const scenario = SCENARIOS.find((entry) => entry.id === id);
    // Unknown hashes belong to the galleries themselves (the Hash plugin
    // writes #lg=… deep links) — never tear a scenario down over one.
    if (!scenario) {
        if (!currentId) renderScenario(SCENARIOS[0]);
        return;
    }
    renderScenario(scenario);
}

function renderScenario(scenario: Scenario) {
    if (scenario.id === currentId) return;
    currentId = scenario.id;
    teardown?.();
    hostEl.innerHTML = '';
    note.textContent = scenario.note ?? '';
    nav.querySelectorAll('a').forEach((a) =>
        a.classList.toggle('active', a.hash === `#${scenario.id}`),
    );
    teardown = scenario.mount(hostEl);
}

window.addEventListener('hashchange', render);
render();
