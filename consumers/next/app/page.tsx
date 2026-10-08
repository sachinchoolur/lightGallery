import type { GalleryItem } from '@lightgallery/react';

import { Gallery } from './Gallery';

// The same four photos in every consumer app; the check compares them.
const items: GalleryItem[] = [1, 2, 3, 4].map((n) => ({
    src: `/photos/${n}.png`,
    thumb: `/photos/${n}-thumb.png`,
    alt: `Photo ${n}`,
    caption: `Photo ${n} caption`,
    lgSize: '1600-1067',
}));

// Rendered on every request, so the check exercises server rendering.
export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <main>
            <h1>lightGallery consumer</h1>
            <Gallery items={items} />
        </main>
    );
}
