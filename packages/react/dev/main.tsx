import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
    type LightGalleryRefHandle,
} from '@lightgallery/react';

import Autoplay from '@lightgallery/react/plugins/autoplay';
import { JustifiedGrid } from '@lightgallery/react/plugins/justified';
import Comment from '@lightgallery/react/plugins/comment';
import Fullscreen from '@lightgallery/react/plugins/fullscreen';
import Hash from '@lightgallery/react/plugins/hash';
import MediumZoom from '@lightgallery/react/plugins/mediumZoom';
import Pager from '@lightgallery/react/plugins/pager';
import Rotate from '@lightgallery/react/plugins/rotate';
import Share from '@lightgallery/react/plugins/share';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Video from '@lightgallery/react/plugins/video';
import Zoom from '@lightgallery/react/plugins/zoom';

// CSS stays a consumer import (ADR 0001 §8) — never bundled by the package.
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-transitions.css';
import 'lightgallery/css/lg-rtl.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-pager.css';
import 'lightgallery/css/lg-share.css';
import 'lightgallery/css/lg-rotate.css';
import 'lightgallery/css/lg-comments.css';
import 'lightgallery/css/lg-justified.css';
import 'lightgallery/css/lg-medium-zoom.css';

// Zoom before Rotate: zoom stays the outermost slide wrapper (2.x DOM).
const kitchenSinkPlugins = [
    Thumbnail,
    Zoom,
    Video,
    Autoplay,
    Fullscreen,
    Hash,
    Pager,
    Share,
    Rotate,
    Comment,
];

const picsum = (id: number, w: number, h: number) =>
    `https://picsum.photos/id/${id}/${w}/${h}`;

// Rig-only responsive ladder: real w-descriptor srcset so device passes
// exercise the plan-002 selection math end to end.
const picsumSrcset = (id: number) =>
    [640, 960, 1280, 1600]
        .map((w) => `${picsum(id, w, Math.round((w * 1067) / 1600))} ${w}w`)
        .join(', ');

const items: GalleryItem[] = [
    { id: 1015, title: 'River between mountains' },
    { id: 1016, title: 'Canyon walls' },
    { id: 1018, title: 'Snowy peak' },
    { id: 1019, title: 'Lakeside cliffs' },
    { id: 1039, title: 'Waterfall in the forest' },
    { id: 1043, title: 'Village at dusk' },
    { id: 1044, title: 'Foggy shore' },
    { id: 1051, title: 'Ridge line' },
].map(({ id, title }) => ({
    src: picsum(id, 1600, 1067),
    srcset: picsumSrcset(id),
    sizes: '100vw',
    thumb: picsum(id, 240, 160),
    alt: title,
    lgSize: '1600-1067',
    caption: (
        <h4 style={{ margin: '8px 0' }}>
            {title} <small>(#{id})</small>
        </h4>
    ),
}));

// Video matrix for device passes: YouTube (endpoint poster), Vimeo with
// an explicit poster, posterless Vimeo/Wistia (thumb-fallback facades)
// and a self-hosted HTML5 file.
const videoItems: GalleryItem[] = [
    {
        src: '//www.youtube.com/watch?v=EIUJfXk3_3w',
        thumb: '//img.youtube.com/vi/EIUJfXk3_3w/1.jpg',
        alt: 'YouTube demo video',
        caption: <h4 style={{ margin: '8px 0' }}>YouTube embed</h4>,
    },
    {
        src: 'https://vimeo.com/112836958',
        poster: picsum(1015, 1280, 720),
        lgSize: '1280-720',
        thumb: picsum(1015, 240, 160),
        alt: 'Vimeo demo video (poster first)',
        caption: <h4 style={{ margin: '8px 0' }}>Vimeo, poster first</h4>,
    },
    {
        src: 'https://vimeo.com/115041822',
        lgSize: '1280-720',
        thumb: picsum(1019, 240, 160),
        alt: 'Vimeo demo video (thumb-fallback facade)',
        caption: <h4 style={{ margin: '8px 0' }}>Vimeo, facade from thumb</h4>,
    },
    {
        src: 'https://sachinchoolur.wistia.com/medias/6tbe0u5g8n',
        lgSize: '1280-720',
        thumb: picsum(1039, 240, 160),
        alt: 'Wistia demo video (thumb-fallback facade)',
        caption: <h4 style={{ margin: '8px 0' }}>Wistia, facade from thumb</h4>,
    },
    {
        video: {
            source: [
                {
                    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                    type: 'video/mp4',
                },
            ],
            attributes: { preload: false, controls: true },
        },
        poster: picsum(1043, 1280, 720),
        lgSize: '1280-720',
        thumb: picsum(1043, 240, 160),
        alt: 'HTML5 demo video',
        caption: <h4 style={{ margin: '8px 0' }}>HTML5, self-hosted mp4</h4>,
    },
];

// Stress rig: 1,000 items, opened imperatively so the page grid stays
// light. Virtualization bounds the mounted slides + thumb strip.
const stressItems: GalleryItem[] = Array.from({ length: 1000 }, (_, i) => ({
    src: `https://picsum.photos/seed/lg-${i}/1600/1067`,
    thumb: `https://picsum.photos/seed/lg-${i}/240/160`,
    lgSize: '1600-1067',
    alt: `Stress slide ${i + 1}`,
    caption: <h4 style={{ margin: '8px 0' }}>Stress slide {i + 1} / 1000</h4>,
}));

const rtlItems: GalleryItem[] = items.slice(0, 5).map((item, i) => ({
    ...item,
    caption: <h4 style={{ margin: '8px 0' }}>شريحة {i + 1} — {item.alt}</h4>,
}));

function Grid({
    slides,
    onOpen,
}: {
    slides: GalleryItem[];
    onOpen?: never;
}) {
    return (
        <div className="demo-grid">
            {slides.map((item) => (
                <LightGalleryItem
                    key={item.src ?? item.alt}
                    item={item}
                    href={item.src}
                >
                    <img src={item.thumb} alt={item.alt} />
                </LightGalleryItem>
            ))}
        </div>
    );
}

function ImagesScenario() {
    return (
        <LightGallery plugins={[Thumbnail, Zoom]}>
            <Grid slides={items} />
        </LightGallery>
    );
}

function ThumbnailsScenario() {
    return (
        <LightGallery
            plugins={[Thumbnail]}
            thumbnail={{ animateThumb: false, toggleThumb: true }}
            allowMediaOverlap
        >
            <Grid slides={items} />
        </LightGallery>
    );
}

function ThumbScrubScenario() {
    return (
        <LightGallery
            plugins={[Thumbnail]}
            thumbnail={{ scrubThumbnails: true }}
        >
            <Grid slides={items} />
        </LightGallery>
    );
}

function ZoomScenario() {
    return (
        <LightGallery
            plugins={[Zoom, Thumbnail]}
            zoom={{
                showZoomInOutIcons: true,
                actualSize: true,
                infiniteZoom: true,
            }}
        >
            <Grid slides={items} />
        </LightGallery>
    );
}

function VideoScenario() {
    return (
        <LightGallery
            plugins={[Video, Thumbnail]}
            video={{ autoplayFirstVideo: false }}
        >
            <Grid slides={videoItems} />
        </LightGallery>
    );
}

function ShareScenario() {
    return (
        <LightGallery
            plugins={[Share, Thumbnail]}
            share={{ preferNativeShare: true }}
        >
            <Grid slides={items.slice(0, 5)} />
        </LightGallery>
    );
}

function DynamicScenario() {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [count, setCount] = useState(4);
    return (
        <>
            <div className="demo-controls">
                <button type="button" onClick={() => setOpen(true)}>
                    open gallery
                </button>
                <button
                    type="button"
                    onClick={() =>
                        setCount((current) =>
                            Math.min(current + 1, items.length),
                        )
                    }
                >
                    add slide
                </button>
                <button
                    type="button"
                    onClick={() =>
                        setCount((current) => Math.max(current - 1, 1))
                    }
                >
                    remove slide
                </button>
                <span>
                    {count} slides · index {index}
                </span>
            </div>
            <LightGallery
                slides={items.slice(0, count)}
                plugins={[Thumbnail, Zoom]}
                open={open}
                onClose={() => setOpen(false)}
                index={index}
                onIndexChange={setIndex}
            />
        </>
    );
}

function VirtualizationScenario() {
    const ref = useRef<LightGalleryRefHandle>(null);
    return (
        <>
            <div className="demo-controls">
                <button type="button" onClick={() => ref.current?.openGallery(0)}>
                    open 1,000-item gallery
                </button>
                <button
                    type="button"
                    onClick={() => ref.current?.openGallery(500)}
                >
                    open at #500
                </button>
            </div>
            <LightGallery
                ref={ref}
                slides={stressItems}
                plugins={[Thumbnail]}
                virtualization={{ slides: 7, thumbs: 'auto' }}
                zoomFromOrigin={false}
                // iOS-filmstrip-sized thumbs + scrub over 1,000 slides.
                thumbnail={{
                    scrubThumbnails: true,
                    thumbWidth: 28,
                    thumbHeight: '42px',
                    thumbMargin: 2,
                }}
            />
        </>
    );
}

function JustifiedScenario() {
    return (
        <LightGallery plugins={[Thumbnail, Zoom]}>
            <JustifiedGrid rowHeight={140} gap={8}>
                {items.map((item) => (
                    <LightGalleryItem
                        key={item.src}
                        item={item}
                        href={item.src}
                        data-lg-size={item.lgSize}
                    >
                        <img src={item.thumb} alt={item.alt} />
                    </LightGalleryItem>
                ))}
            </JustifiedGrid>
        </LightGallery>
    );
}

function RtlScenario() {
    const ref = useRef<LightGalleryRefHandle>(null);
    return (
        <>
            <div className="demo-controls">
                <button type="button" onClick={() => ref.current?.openGallery(0)}>
                    open RTL gallery (direction: rtl)
                </button>
            </div>
            <LightGallery
                ref={ref}
                slides={rtlItems}
                direction="rtl"
                plugins={[Thumbnail, Zoom]}
            />
        </>
    );
}

function MediumZoomScenario() {
    return (
        <LightGallery
            plugins={[MediumZoom]}
            mediumZoom={{ backgroundColor: '#101418' }}
        >
            <Grid slides={items.slice(0, 4)} />
        </LightGallery>
    );
}

function KitchenSinkScenario() {
    const ref = useRef<LightGalleryRefHandle>(null);
    return (
        <>
            <div className="demo-controls">
                <button type="button" onClick={() => ref.current?.openGallery(3)}>
                    openGallery(3) via ref
                </button>
            </div>
            <LightGallery
                ref={ref}
                hideBarsDelay={3000}
                showBarsAfter={1000}
                plugins={kitchenSinkPlugins}
                zoom={{ showZoomInOutIcons: true, actualSize: true }}
                comment={{
                    commentBox: true,
                    renderComments: (item) => (
                        <p style={{ padding: 12 }}>
                            Demo comments for <strong>{item.alt}</strong>
                        </p>
                    ),
                }}
                onAfterSlide={(detail) =>
                    console.log('[demo] afterSlide', detail)
                }
            >
                <Grid slides={[...items, ...videoItems.slice(0, 3)]} />
            </LightGallery>
        </>
    );
}

/**
 * The device-test matrix — the same scenario ids as the vanilla, Vue and
 * Angular rigs (hash-routed), so a phone can be deep-linked to e.g.
 * #share on all four ports and the packages compared on identical
 * content. One scenario mounts at a time to keep the page light.
 */
const SCENARIOS: {
    id: string;
    title: string;
    note: string;
    Component: () => JSX.Element;
}[] = [
    {
        id: 'images',
        title: 'Images',
        note: 'Plain grid — thumbnails + zoom defaults, srcset ladder.',
        Component: ImagesScenario,
    },
    {
        id: 'thumbnails',
        title: 'Thumbnails',
        note: 'Static strip + toggle button (animateThumb off, allowMediaOverlap).',
        Component: ThumbnailsScenario,
    },
    {
        id: 'scrub',
        title: 'Thumb scrub',
        note: 'scrubThumbnails — drag the strip and the main slide follows instantly; needs the strip to overflow (phone/narrow window).',
        Component: ThumbScrubScenario,
    },
    {
        id: 'zoom',
        title: 'Zoom',
        note: 'actualSize + infiniteZoom + icons — pinch, double-tap, drag.',
        Component: ZoomScenario,
    },
    {
        id: 'video',
        title: 'Video',
        note: 'YouTube / Vimeo / Wistia facades + HTML5 mp4; autoplayFirstVideo off.',
        Component: VideoScenario,
    },
    {
        id: 'share',
        title: 'Share',
        note: 'preferNativeShare — expect the system share sheet on devices.',
        Component: ShareScenario,
    },
    {
        id: 'dynamic',
        title: 'Dynamic',
        note: 'Controlled open/index; add/remove slides is a state update.',
        Component: DynamicScenario,
    },
    {
        id: 'virtualization',
        title: 'Virtualization',
        note: '1,000 dynamic slides; slide pool 7, windowed strip of iOS-size scrub thumbs.',
        Component: VirtualizationScenario,
    },
    {
        id: 'justified',
        title: 'Justified',
        note: 'Justified trigger rows — resize/rotate the device to re-flow.',
        Component: JustifiedScenario,
    },
    {
        id: 'rtl',
        title: 'RTL',
        note: 'direction: rtl — arrows/keys/swipe mirror, chrome flips.',
        Component: RtlScenario,
    },
    {
        id: 'medium-zoom',
        title: 'mediumZoom',
        note: 'Minimal medium-style zoom, click anywhere to close.',
        Component: MediumZoomScenario,
    },
    {
        id: 'kitchen-sink',
        title: 'Kitchen sink',
        note: 'Images + videos, all plugins at once.',
        Component: KitchenSinkScenario,
    },
];

const readHash = () => window.location.hash.replace(/^#/, '');
const isScenario = (id: string) =>
    SCENARIOS.some((entry) => entry.id === id);

function App() {
    const [current, setCurrent] = useState(readHash());
    useEffect(() => {
        // Unknown hashes belong to the galleries themselves (the Hash
        // plugin writes #lg=… deep links) — never switch scenarios on one.
        const onHash = () => {
            const id = readHash();
            if (isScenario(id)) setCurrent(id);
        };
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);
    const scenario =
        SCENARIOS.find((entry) => entry.id === current) ?? SCENARIOS[0];
    return (
        <>
            <h1>@lightgallery/react dev demo</h1>
            <nav className="scenario-nav">
                {SCENARIOS.map((entry) => (
                    <a
                        key={entry.id}
                        href={`#${entry.id}`}
                        className={entry.id === scenario.id ? 'active' : ''}
                    >
                        {entry.title}
                    </a>
                ))}
            </nav>
            <p className="scenario-note">{scenario.note}</p>
            {/* key remounts the scenario on switch — galleries tear down */}
            <scenario.Component key={scenario.id} />
            <div className="demo-spacer">
                (spacer to verify scroll lock/restore)
            </div>
        </>
    );
}

const style = document.createElement('style');
style.textContent = `
    .scenario-nav { display: flex; flex-wrap: wrap; gap: 4px 12px; margin: 12px 0; }
    .scenario-nav a { text-decoration: none; }
    .scenario-nav a.active { font-weight: 700; text-decoration: underline; }
    .scenario-note { color: #667; margin: 0 0 12px; }`;
document.head.appendChild(style);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
