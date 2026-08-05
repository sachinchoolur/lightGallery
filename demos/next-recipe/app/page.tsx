'use client';

/**
 * Runnable verification of recipes/next-image.md — the recipe code,
 * verbatim in shape: a `slideRenderer` plugin that renders opted-in
 * slides through `next/image` while keeping the three contracts
 * (classes, SLIDE_LOADED dispatch, declared resolution via lgSize).
 * The last item deliberately has no `nextImage` flag to show the
 * pass-through to the built-in renderer.
 */

import Image from 'next/image';
import {
    LightGallery,
    LightGalleryItem,
    type GalleryItem,
    type LgPlugin,
} from '@lightgallery/react';
import Zoom from '@lightgallery/react/plugins/zoom';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-transitions.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

type OptimizedItem = GalleryItem & { nextImage?: boolean };

const picsum = (id: number, w: number, h: number) =>
    `https://picsum.photos/id/${id}/${w}/${h}`;

const nextImagePlugin: LgPlugin = {
    name: 'nextImage',
    slideRenderer: (item, index, ctx) => {
        const optimized = item as OptimizedItem;
        if (!optimized.nextImage || !item.src) {
            return undefined; // pass through to the built-in renderer
        }
        const markLoaded = () =>
            ctx.actions.dispatch({ type: 'SLIDE_LOADED', index });
        return (
            <picture className="lg-img-wrap">
                <Image
                    className="lg-object lg-image"
                    data-index={index}
                    src={item.src}
                    alt={item.alt ?? ''}
                    // Explicit dims (lgSize knows them), NOT `fill`: fill
                    // stretches the img ELEMENT box over the whole slide
                    // (letterbox included), which extends the grab cursor
                    // and tap/zoom targets beyond the visible image. With
                    // dims, the stylesheet contain-fits the element like
                    // the built-in renderer.
                    width={1600}
                    height={1067}
                    sizes="100vw"
                    // The lightbox slide IS the focal content — never lazy.
                    loading="eager"
                    // Completion via a ref, not onLoad: next/image's own
                    // load plumbing does not reliably forward the event,
                    // and a ref also covers the cached-image case where
                    // the img is already complete at mount.
                    ref={(img) => {
                        if (!img) return;
                        if (img.complete && img.naturalWidth > 0) {
                            markLoaded();
                            return;
                        }
                        img.addEventListener('load', markLoaded, {
                            once: true,
                        });
                    }}
                />
            </picture>
        );
    },
};

const items: OptimizedItem[] = [
    { id: 1015, title: 'River between mountains' },
    { id: 1016, title: 'Canyon walls' },
    { id: 1018, title: 'Snowy peak' },
].map(({ id, title }) => ({
    src: picsum(id, 1600, 1067),
    thumb: picsum(id, 240, 160),
    alt: title,
    lgSize: '1600-1067',
    nextImage: true,
}));

// Pass-through control: no nextImage flag → built-in renderer.
items.push({
    src: picsum(1019, 1600, 1067),
    thumb: picsum(1019, 240, 160),
    alt: 'Lakeside cliffs (built-in renderer)',
    lgSize: '1600-1067',
});

export default function Page() {
    return (
        <main>
            <h1>next/image recipe — @lightgallery/react</h1>
            <p>
                First three slides render through <code>next/image</code> (check
                the <code>/_next/image?url=…</code> requests); the fourth uses
                the built-in renderer.
            </p>
            <LightGallery plugins={[nextImagePlugin, Zoom, Thumbnail]}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {items.map((item) => (
                        <LightGalleryItem
                            key={item.src}
                            item={item}
                            href={item.src}
                        >
                            <Image
                                src={item.thumb!}
                                alt={item.alt!}
                                width={240}
                                height={160}
                            />
                        </LightGalleryItem>
                    ))}
                </div>
            </LightGallery>
        </main>
    );
}
