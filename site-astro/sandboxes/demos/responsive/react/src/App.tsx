import { LightGallery, LightGalleryItem } from '@lightgallery/react';

import 'lightgallery/css/lightgallery.css';

const url = (id: number, width: number, height: number) =>
    `https://picsum.photos/id/${id}/${width}/${height}`;

// Each item lists the same photo in three widths. The slide image gets
// srcset and sizes, so the browser downloads the smallest one that fits.
// sizes is the width the slide can take: up to the whole window.
const items = [10, 11, 15, 16, 28, 29, 37, 110].map((id, index) => ({
    src: url(id, 1600, 1067),
    srcset: [
        `${url(id, 480, 320)} 480w`,
        `${url(id, 800, 533)} 800w`,
        `${url(id, 1600, 1067)} 1600w`,
    ].join(', '),
    sizes: '100vw',
    thumb: url(id, 360, 240),
    alt: `Sample photo ${index + 1}`,
    lgSize: '1600-1067',
}));

export default function App() {
    return (
        <>
            <h1>lightGallery responsive images</h1>
            <LightGallery>
                <div className="gallery">
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
