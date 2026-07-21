import { StrictMode, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
    type LightGalleryRefHandle,
} from '@lightgallery/react';

import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Video from '@lightgallery/react/plugins/video';
import Zoom from '@lightgallery/react/plugins/zoom';

// CSS stays a consumer import (ADR 0001 §8) — never bundled by the package.
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-transitions.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-video.css';

const wave1Plugins = [Thumbnail, Zoom, Video];

type DemoMode = 'lg-slide' | 'lg-fade' | 'lg-lollipop';

const picsum = (id: number, w: number, h: number) =>
    `https://picsum.photos/id/${id}/${w}/${h}`;

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
    thumb: picsum(id, 240, 160),
    alt: title,
    lgSize: '1600-1067',
    caption: (
        <h4 style={{ margin: '8px 0' }}>
            {title} <small>(#{id})</small>
        </h4>
    ),
}));

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
        thumb: picsum(1015, 240, 160),
        alt: 'Vimeo demo video (poster first)',
        caption: <h4 style={{ margin: '8px 0' }}>Vimeo, poster first</h4>,
    },
    ...items.slice(0, 2),
];

function UncontrolledDemo({ mode }: { mode: DemoMode }) {
    const ref = useRef<LightGalleryRefHandle>(null);
    return (
        <>
            <h2>Uncontrolled — click a thumbnail</h2>
            <div className="demo-controls">
                <button type="button" onClick={() => ref.current?.openGallery(3)}>
                    openGallery(3) via ref
                </button>
            </div>
            <LightGallery
                ref={ref}
                mode={mode}
                hideBarsDelay={3000}
                showBarsAfter={1000}
                plugins={wave1Plugins}
                zoom={{ showZoomInOutIcons: true }}
                onAfterSlide={(detail) =>
                    console.log('[demo] afterSlide', detail)
                }
            >
                <div className="demo-grid">
                    {items.map((item) => (
                        <LightGalleryItem
                            key={item.src}
                            item={item}
                            href={item.src}
                        >
                            <img src={item.thumb} alt={item.alt} />
                        </LightGalleryItem>
                    ))}
                </div>
            </LightGallery>
        </>
    );
}

function ControlledDemo({ mode }: { mode: DemoMode }) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    return (
        <>
            <h2>Controlled — open/index as state</h2>
            <div className="demo-controls">
                <button type="button" onClick={() => setOpen(true)}>
                    Open at slide {index + 1}
                </button>
                <label>
                    index:{' '}
                    <input
                        type="number"
                        min={0}
                        max={items.length - 1}
                        value={index}
                        onChange={(event) =>
                            setIndex(Number(event.target.value) || 0)
                        }
                    />
                </label>
            </div>
            <LightGallery
                slides={items}
                mode={mode}
                open={open}
                onClose={() => setOpen(false)}
                index={index}
                onIndexChange={setIndex}
            />
        </>
    );
}

function VideoDemo() {
    const ref = useRef<LightGalleryRefHandle>(null);
    return (
        <>
            <h2>Video — YouTube / Vimeo / poster flow</h2>
            <LightGallery ref={ref} plugins={wave1Plugins}>
                <div className="demo-grid">
                    {videoItems.map((item) => (
                        <LightGalleryItem
                            key={item.src}
                            item={item}
                            href={item.src}
                        >
                            <img src={item.thumb} alt={item.alt} />
                        </LightGalleryItem>
                    ))}
                </div>
            </LightGallery>
        </>
    );
}

function App() {
    const [mode, setMode] = useState<DemoMode>('lg-slide');
    return (
        <>
            <h1>@lightgallery/react dev demo</h1>
            <div className="demo-controls">
                mode:
                {(['lg-slide', 'lg-fade', 'lg-lollipop'] as const).map(
                    (option) => (
                        <label key={option}>
                            <input
                                type="radio"
                                name="mode"
                                checked={mode === option}
                                onChange={() => setMode(option)}
                            />
                            {option}
                        </label>
                    ),
                )}
            </div>
            <UncontrolledDemo mode={mode} />
            <VideoDemo />
            <ControlledDemo mode={mode} />
            <div className="demo-spacer">
                (spacer to verify scroll lock/restore)
            </div>
        </>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
