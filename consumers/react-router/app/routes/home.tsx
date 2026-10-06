import { LightGallery, LightGalleryItem, type GalleryItem } from '@lightgallery/react';
import Thumbnail from '@lightgallery/react/plugins/thumbnail';
import Zoom from '@lightgallery/react/plugins/zoom';

// The same four photos in every consumer app; the check compares them.
const items: GalleryItem[] = [1, 2, 3, 4].map((n) => ({
    src: `/photos/${n}.png`,
    thumb: `/photos/${n}-thumb.png`,
    alt: `Photo ${n}`,
    caption: `Photo ${n} caption`,
    lgSize: '1600-1067',
}));

export function meta() {
    return [{ title: 'lightGallery consumer: React Router' }];
}

export default function Home() {
    return (
        <main>
            <h1>lightGallery consumer</h1>
            <LightGallery plugins={[Zoom, Thumbnail]} thumbnail={{ animateThumb: true }}>
                <div className="grid">
                    {items.map((item) => (
                        <LightGalleryItem key={item.src} item={item}>
                            <img src={item.thumb} alt={item.alt} />
                        </LightGalleryItem>
                    ))}
                </div>
            </LightGallery>
        </main>
    );
}
